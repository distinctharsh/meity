import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function PagesManagement() {
  const [pages, setPages] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const [pRes, tRes] = await Promise.all([
        fetch('/api/admin/pages'),
        fetch('/api/admin/page-templates'),
      ]);
      const p = pRes.ok ? await pRes.json() : [];
      const t = tRes.ok ? await tRes.json() : [];
      setPages(p);
      setTemplates(t);
    } catch (e) {
      console.error('Load pages/templates failed', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (pg) => {
    setEditing(pg);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this page?')) return;
    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await refresh();
      } else {
        const j = await res.json().catch(() => ({}));
        alert(j.message || 'Delete failed');
      }
    } catch (e) {
      console.error('Delete page error', e);
      alert('Delete failed');
    }
  };

  const toggleActive = async (pg) => {
    try {
      const res = await fetch(`/api/admin/pages/${pg.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pg.title,
          slug: pg.slug,
          parent_id: pg.parent_id,
          template_id: pg.template_id,
          hero_title: pg.hero_title,
          hero_subtitle: pg.hero_subtitle,
          hero_image_url: pg.hero_image_url,
          tabs_json: pg.tabs_json,
          content_json: pg.content_json,
          display_order: pg.display_order,
          is_active: !pg.is_active,
        }),
      });
      if (res.ok) refresh();
      else alert('Failed to update status');
    } catch (e) {
      console.error('Toggle active error', e);
      alert('Failed to update status');
    }
  };

  return (
    <AdminLayout>
      <div className="p-2">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Page
          </button>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold text-gray-600">
              <div className="col-span-3">Title</div>
              <div className="col-span-3">Slug</div>
              <div className="col-span-2">Template</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            {pages.length === 0 ? (
              <div className="px-4 py-8 text-gray-500 text-center">No pages yet. Click Create Page.</div>
            ) : (
              pages.map((pg) => (
                <div key={pg.id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center text-sm">
                  <div className="col-span-3 font-medium">{pg.title}</div>
                  <div className="col-span-3 text-gray-600">{pg.slug}</div>
                  <div className="col-span-2 text-gray-600">{pg.template_name || pg.template_key}</div>
                  <div className="col-span-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${pg.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {pg.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end space-x-2">
                    <button onClick={() => toggleActive(pg)} className={`px-2 py-1 text-xs rounded ${pg.is_active ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                      {pg.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleEdit(pg)} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Edit</button>
                    <button onClick={() => handleDelete(pg.id)} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {showForm && (
          <PageForm
            onClose={() => { setShowForm(false); setEditing(null); }}
            onSaved={async () => { setShowForm(false); setEditing(null); await refresh(); }}
            templates={templates}
            editing={editing}
          />
        )}
      </div>
    </AdminLayout>
  );
}

function PageForm({ onClose, onSaved, templates, editing }) {
  const [form, setForm] = useState({
    title: '',
    slug: '',
    template_id: '',
    hero_title: '',
    hero_subtitle: '',
    hero_image_url: '',
    tabs_json: [],
    content_json: null,
    is_active: true,
    display_order: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title || '',
        slug: editing.slug || '',
        template_id: editing.template_id || '',
        hero_title: editing.hero_title || '',
        hero_subtitle: editing.hero_subtitle || '',
        hero_image_url: editing.hero_image_url || '',
        tabs_json: Array.isArray(editing.tabs_json) ? editing.tabs_json : (editing.tabs_json ? JSON.parse(editing.tabs_json) : []),
        content_json: editing.content_json || null,
        is_active: editing.is_active !== false,
        display_order: editing.display_order ?? 0,
      });
    }
  }, [editing]);

  const currentTemplate = useMemo(() => templates.find(t => String(t.id) === String(form.template_id)), [templates, form.template_id]);

  const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const ensureLeadingSlash = (s) => {
    if (!s) return s;
    return s.startsWith('/') ? s : '/' + s;
  };

  const addTab = () => updateField('tabs_json', [...(form.tabs_json || []), { label: '', content: '' }]);
  const updateTab = (idx, key, value) => {
    const next = [...(form.tabs_json || [])];
    next[idx] = { ...next[idx], [key]: value };
    updateField('tabs_json', next);
  };
  const removeTab = (idx) => {
    const next = [...(form.tabs_json || [])];
    next.splice(idx, 1);
    updateField('tabs_json', next);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: ensureLeadingSlash(form.slug.trim()),
        template_id: Number(form.template_id),
      };
      const url = editing ? `/api/admin/pages/${editing.id}` : '/api/admin/pages';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await onSaved();
      } else {
        const j = await res.json().catch(() => ({}));
        alert(j.message || 'Save failed');
      }
    } catch (e2) {
      console.error('Save page error', e2);
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[95vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">{editing ? 'Edit Page' : 'Create Page'}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✕</button>
        </div>
        <form onSubmit={save} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input value={form.title} onChange={(e) => updateField('title', e.target.value)} required className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Slug (path)</label>
              <input value={form.slug} onChange={(e) => updateField('slug', e.target.value)} required placeholder="/ministry/about" className="mt-1 w-full border rounded px-3 py-2" />
              <p className="text-xs text-gray-500 mt-1">This page will be available at <code>/p&lt;slug&gt;</code>. Example: slug "/ministry/about" &rarr; URL "/p/ministry/about"</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Template</label>
              <select value={form.template_id} onChange={(e) => updateField('template_id', e.target.value)} required className="mt-1 w-full border rounded px-3 py-2">
                <option value="">Select template</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.template_key})</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <input id="is_active" type="checkbox" checked={form.is_active} onChange={(e) => updateField('is_active', e.target.checked)} />
              <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
            </div>
          </div>

          {/* Hero fields (common for hero_tabs) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Hero Title</label>
              <input value={form.hero_title} onChange={(e) => updateField('hero_title', e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hero Subtitle</label>
              <input value={form.hero_subtitle} onChange={(e) => updateField('hero_subtitle', e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hero Image URL</label>
              <input value={form.hero_image_url} onChange={(e) => updateField('hero_image_url', e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
          </div>

          {/* Tabs editor for hero_tabs template */}
          {currentTemplate?.template_key === 'hero_tabs' && (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Tabs</h3>
                <button type="button" onClick={addTab} className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">Add Tab</button>
              </div>
              <div className="mt-3 space-y-3">
                {(form.tabs_json || []).map((t, idx) => (
                  <div key={idx} className="border rounded p-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Label</label>
                        <input value={t.label} onChange={(e) => updateTab(idx, 'label', e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Content (HTML)</label>
                        <textarea value={t.content} onChange={(e) => updateTab(idx, 'content', e.target.value)} rows={4} className="mt-1 w-full border rounded px-3 py-2 font-mono text-sm" />
                      </div>
                    </div>
                    <div className="mt-2 text-right">
                      <button type="button" onClick={() => removeTab(idx)} className="text-xs text-red-600 hover:underline">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">{saving ? 'Saving...' : 'Save Page'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
