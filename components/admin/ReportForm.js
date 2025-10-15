import { useEffect, useState } from 'react';

export default function ReportForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState({
    title: '',
    type: 'pdf',
    year: '',
    size: '',
    file_url: '',
    item_count: '',
    display_order: '',
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        type: initial.type || 'pdf',
        year: initial.year || '',
        size: initial.size || '',
        file_url: initial.file_url || '',
        item_count: initial.item_count ?? '',
        display_order: initial.display_order ?? '',
        is_active: !!initial.is_active,
      });
    } else {
      const y = new Date().getFullYear();
      setForm((p) => ({ ...p, year: String(y) }));
    }
  }, [initial]);

  const update = (k, v) => {
    setForm((p) => {
      const next = { ...p, [k]: v };
      if (k === 'file_url') {
        const u = (v || '').toLowerCase();
        if (u.endsWith('.pdf')) next.type = 'pdf';
        else if (u) next.type = 'link';
      }
      return next;
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        year: form.year ? Number(form.year) : null,
        item_count: form.item_count === '' ? null : Number(form.item_count),
        display_order: form.display_order === '' ? null : Number(form.display_order),
      };
      const url = initial ? `/api/admin/reports/${initial.id}` : '/api/admin/reports';
      const method = initial ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(j.message || 'Save failed');
        return;
      }
      await onSaved();
    } catch (e) {
      console.error(e);
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input value={form.title} onChange={(e) => update('title', e.target.value)} required className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select value={form.type} onChange={(e) => update('type', e.target.value)} className="mt-1 w-full border rounded px-3 py-2">
            <option value="pdf">PDF</option>
            <option value="group">Group</option>
            <option value="link">Link</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input type="number" value={form.year} onChange={(e) => update('year', e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Size (e.g., 37.15 KB)</label>
          <input value={form.size} onChange={(e) => update('size', e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">File/Link URL</label>
          <input value={form.file_url} onChange={(e) => update('file_url', e.target.value)} className="mt-1 w-full border rounded px-3 py-2" placeholder="/uploads/report.pdf or https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Item Count (for Group)</label>
          <input type="number" value={form.item_count} onChange={(e) => update('item_count', e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Display Order</label>
          <input type="number" value={form.display_order} onChange={(e) => update('display_order', e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div className="flex items-center gap-2">
          <input id="is_active" type="checkbox" checked={form.is_active} onChange={(e) => update('is_active', e.target.checked)} />
          <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
        <button disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">{saving ? 'Saving...' : (initial ? 'Update' : 'Create')}</button>
      </div>
    </form>
  );
}
