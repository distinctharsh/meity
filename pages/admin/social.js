import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SocialPostForm from '@/components/admin/SocialPostForm';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function AdminSocialPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/social-posts');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Group posts by platform: twitter → facebook → instagram → youtube → others
  const grouped = useMemo(() => {
    const order = ['twitter', 'facebook', 'instagram', 'youtube'];
    const map = new Map();
    for (const p of posts) {
      const key = (p.platform || 'other').toLowerCase();
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    }
    // Sort within platform by display_order then id
    for (const arr of map.values()) {
      arr.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || a.id - b.id);
    }
    const entries = [];
    for (const k of order) {
      if (map.has(k)) entries.push([k, map.get(k)]);
    }
    for (const [k, v] of map.entries()) {
      if (!order.includes(k)) entries.push([k, v]);
    }
    return entries;
  }, [posts]);

  const onSaved = async () => {
    setCreating(false);
    setEditing(null);
    await load();
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    const res = await fetch(`/api/admin/social-posts/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Delete failed');
    } else {
      await load();
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Social Media Posts</h1>
        <button
          onClick={() => { setCreating(true); setEditing(null); }}
          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          aria-label="Add Post"
          title="Add Post"
        >
          <FaPlus className="text-white" />
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !creating && !editing && (
        <div className="space-y-6">
          {grouped.map(([platform, arr]) => (
            <div key={platform} className="bg-white rounded-lg shadow">
              <div className="px-4 py-3 border-b flex items-center gap-2">
                {platform === 'twitter' && <FaTwitter className="text-sky-500" />}
                {platform === 'facebook' && <FaFacebook className="text-blue-600" />}
                {platform === 'instagram' && <FaInstagram className="text-pink-500" />}
                {platform === 'youtube' && <FaYoutube className="text-red-600" />}
                <h2 className="text-lg font-semibold capitalize">{platform}</h2>
              </div>
              <ul className="divide-y">
                {arr.map((p) => (
                  <li key={p.id} className="flex items-center justify-between px-4 py-3 text-sm">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="inline-block w-10 text-gray-500">#{p.id}</span>
                        <a href={p.post_url} target="_blank" rel="noreferrer" className="text-blue-700 underline truncate">{p.post_url}</a>
                      </div>
                      <div className="mt-1 text-gray-500">
                        <span className="mr-4">Order: {p.display_order ?? 0}</span>
                        <span>Status: {p.is_active ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <button
                        onClick={() => { setEditing(p); setCreating(false); }}
                        className="p-2 rounded hover:bg-gray-100"
                        aria-label="Edit"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        className="p-2 rounded hover:bg-gray-100 text-red-600"
                        aria-label="Delete"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {(creating || editing) && (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-300">
          <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Post' : 'Add Post'}</h2>
          <SocialPostForm
            initial={editing}
            onCancel={() => { setCreating(false); setEditing(null); }}
            onSaved={onSaved}
          />
        </div>
      )}
    </AdminLayout>
  );
}

