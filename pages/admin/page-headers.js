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
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow cursor-pointer"
            aria-label="Add header"
            title="Add header"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </svg>
          </button>
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
                  <button
                    onClick={() => handleEdit(it)}
                    className="p-2 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                    title="Edit header"
                    aria-label="Edit header"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687 1.687m-2.496-.79l-8.74 8.74a2.25 2.25 0 00-.57.99l-.53 2.122a.75.75 0 00.91.91l2.122-.53a2.25 2.25 0 00.99-.57l8.74-8.74m-2.496-.79l2.496.79M16.862 4.487a1.875 1.875 0 112.652 2.652" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(it.id)}
                    className="p-2 rounded-md text-red-600 hover:text-red-800 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 cursor-pointer"
                    title="Delete header"
                    aria-label="Delete header"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M9 3a1 1 0 0 0-1 1v1H4.5a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5H16V4a1 1 0 0 0-1-1H9z" />
                      <path d="M6.5 7h11l-.84 11.2A2 2 0 0 1 14.67 20H9.33a2 2 0 0 1-1.99-1.8L6.5 7z" />
                    </svg>
                  </button>
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

