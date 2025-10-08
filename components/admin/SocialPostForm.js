import { useState, useEffect } from 'react';

export default function SocialPostForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState({
    platform: 'twitter',
    post_url: '',
    content: '',
    image_url: '',
    display_order: 0,
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        platform: initial.platform || 'twitter',
        post_url: initial.post_url || '',
        content: initial.content || '',
        image_url: initial.image_url || '',
        display_order: initial.display_order || 0,
        is_active: initial.is_active !== undefined ? initial.is_active : true,
      });
    }
  }, [initial]);

  // Try to normalize Twitter URLs so we save a clean tweet URL
  const normalizeTwitterUrl = (url) => {
    if (!url) return url;
    try {
      const u = new URL(url);
      const host = u.hostname;
      // If it's an embed URL and has id, rebuild to a canonical status URL
      if (host.includes('platform.twitter.com')) {
        const id = u.searchParams.get('id');
        if (id) return `https://x.com/i/web/status/${id}`;
        return url; // cannot normalize without id
      }
      // If it's a twitter/x status URL
      if (host.includes('twitter.com') || host.includes('x.com')) {
        const m = url.match(/status(?:es)?\/(\d+)/);
        const id = m ? m[1] : '';
        if (id) return `https://x.com/i/web/status/${id}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = initial ? 'PUT' : 'POST';
      const url = initial ? `/api/admin/social-posts/${initial.id}` : '/api/admin/social-posts';
      // Prepare payload with possible normalization for Twitter
      const payload = {
        ...form,
        post_url: form.platform === 'twitter' ? normalizeTwitterUrl(form.post_url) : form.post_url,
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      const data = await res.json().catch(() => ({}));
      onSaved && onSaved(data);
    } catch (e) {
      alert(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Platform</label>
          <select name="platform" value={form.platform} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md">
            <option value="twitter">Twitter</option>
            <option value="youtube">YouTube</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Post URL</label>
          <input name="post_url" value={form.post_url} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Display Order</label>
          <input type="number" name="display_order" value={form.display_order} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md" />
        </div>
        <div className="flex items-center">
          <input id="is_active" type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
          <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">Active</label>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Content (optional)</label>
          <textarea name="content" value={form.content} onChange={handleChange} rows={3} className="mt-1 block w-full border-gray-300 rounded-md" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
          <input name="image_url" value={form.image_url} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md" placeholder="/uploads/... or https://..." />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md">Cancel</button>
        <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-md">{saving ? 'Saving...' : (initial ? 'Update' : 'Create')}</button>
      </div>
    </form>
  );
}
