import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function PageHeadersAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPath, setFilterPath] = useState('');
  const [pageOptions, setPageOptions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => { refresh(); loadPages(); }, []);

  async function refresh(path) {
    setLoading(true);
    try {
      const qs = (path ?? filterPath) ? `?page_path=${encodeURIComponent(path ?? filterPath)}` : '';
      const res = await fetch(`/api/admin/page-header${qs}`);
      const data = res.ok ? await res.json() : [];
      setItems(Array.isArray(data) ? data : (data ? [data] : []));
    } catch (e) {
      console.error('Load page headers error', e);
      setItems([]);
    } finally { setLoading(false); }
  }

  async function loadPages() {
    try {
      const res = await fetch('/api/admin/pages');
      if (!res.ok) return setPageOptions([]);
      const rows = await res.json();
      const opts = (rows || [])
        .filter(r => r.slug)
        .map(r => ({ value: r.slug, label: r.slug }));
      setPageOptions(opts);
    } catch (e) {
      console.error('Load pages error', e);
      setPageOptions([]);
    }
  }

  const handleAdd = () => { setEditing(null); setShowForm(true); };
  const handleEdit = (it) => { setEditing(it); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!confirm('Delete this header?')) return;
    try {
      const res = await fetch(`/api/admin/page-header/${id}`, { method: 'DELETE' });
      if (res.ok) await refresh(); else alert('Delete failed');
    } catch (e) { console.error(e); alert('Delete failed'); }
  };

  return (
    <AdminLayout>
      <div className="p-2">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Page Headers</h1>
          <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add Header</button>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-4 flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Page Path</label>
            <input value={filterPath} onChange={(e) => setFilterPath(e.target.value)} placeholder="/ministry/about" className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => refresh()} className="px-3 py-2 bg-gray-100 rounded">Apply</button>
            <button onClick={() => { setFilterPath(''); refresh(''); }} className="px-3 py-2 bg-gray-100 rounded">Clear</button>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(4)].map((_, i) => (<div key={i} className="h-16 bg-gray-200 rounded" />))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold text-gray-600">
              <div className="col-span-6">Page Path</div>
              <div className="col-span-5">Background</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            {items.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">No headers yet. Click Add Header.</div>
            ) : items.map((it) => (
              <div key={it.id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center text-sm">
                <div className="col-span-6 text-gray-700">{it.page_path}</div>
                <div className="col-span-5 text-gray-600 truncate">{it.background_url || '-'}</div>
                <div className="col-span-1 flex items-center justify-end gap-2">
                  <button onClick={() => handleEdit(it)} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Edit</button>
                  <button onClick={() => handleDelete(it.id)} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <HeaderForm
            editing={editing}
            pageOptions={pageOptions}
            onClose={() => { setShowForm(false); setEditing(null); }}
            onSaved={async () => { setShowForm(false); setEditing(null); await refresh(); }}
          />
        )}
      </div>
    </AdminLayout>
  );
}

function HeaderForm({ editing, onClose, onSaved, pageOptions }) {
  const [form, setForm] = useState({ page_path: '', background_url: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        page_path: editing.page_path,
        background_url: editing.background_url || '',
      });
    }
  }, [editing]);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/admin/page-header/${editing.id}` : '/api/admin/page-header';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) await onSaved(); else {
        const j = await res.json().catch(() => ({}));
        alert(j.message || 'Save failed');
      }
    } catch (e2) {
      console.error('Save header error', e2);
      alert('Save failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">{editing ? 'Edit Header' : 'Add Header'}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✕</button>
        </div>
        <form onSubmit={save} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Page Path</label>
              <select value={form.page_path} onChange={(e) => update('page_path', e.target.value)} required className="mt-1 w-full border rounded px-3 py-2">
                <option value="">Select a page path</option>
                {pageOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Background URL (optional)</label>
              <input value={form.background_url} onChange={(e) => update('background_url', e.target.value)} placeholder="/images/.../banner.jpg" className="mt-1 w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

