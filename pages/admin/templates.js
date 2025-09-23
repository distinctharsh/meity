import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function TemplatesManagement() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => { refresh(); }, []);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/page-templates');
      const data = res.ok ? await res.json() : [];
      setTemplates(data);
    } catch (e) {
      console.error('Load templates failed', e);
    } finally { setLoading(false); }
  }

  const handleAdd = () => { setEditing(null); setShowForm(true); };
  const handleEdit = (t) => { setEditing(t); setShowForm(true); };

  async function handleDelete(id) {
    if (!confirm('Delete this template? Pages using it will need updating.')) return;
    try {
      const res = await fetch(`/api/admin/page-templates/${id}`, { method: 'DELETE' });
      if (res.ok) await refresh(); else alert('Delete failed');
    } catch (e) { console.error(e); alert('Delete failed'); }
  }

  async function toggleActive(tpl) {
    try {
      const res = await fetch(`/api/admin/page-templates/${tpl.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tpl.name,
          template_key: tpl.template_key,
          description: tpl.description,
          schema_json: safeParse(tpl.schema_json),
          is_active: !tpl.is_active,
        }),
      });
      if (res.ok) refresh(); else alert('Update failed');
    } catch (e) { console.error(e); alert('Update failed'); }
  }

  return (
    <AdminLayout>
      <div className="p-2">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
          <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Create Template</button>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(4)].map((_, i) => (<div key={i} className="h-16 bg-gray-200 rounded" />))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold text-gray-600">
              <div className="col-span-3">Name</div>
              <div className="col-span-3">Key</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            {templates.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">No templates yet. Click Create Template.</div>
            ) : templates.map((t) => (
              <div key={t.id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center text-sm">
                <div className="col-span-3 font-medium">{t.name}</div>
                <div className="col-span-3 text-gray-600"><code>{t.template_key}</code></div>
                <div className="col-span-4 text-gray-600 truncate" title={t.description || ''}>{t.description}</div>
                <div className="col-span-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${t.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {t.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <div className="col-span-1 flex items-center justify-end space-x-2">
                  <button onClick={() => toggleActive(t)} className={`px-2 py-1 text-xs rounded ${t.is_active ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {t.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => handleEdit(t)} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Edit</button>
                  <button onClick={() => handleDelete(t.id)} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <TemplateForm
            onClose={() => { setShowForm(false); setEditing(null); }}
            onSaved={async () => { setShowForm(false); setEditing(null); await refresh(); }}
            editing={editing}
          />
        )}
      </div>
    </AdminLayout>
  );
}

function safeParse(v) {
  if (v == null) return null;
  if (typeof v === 'object') return v;
  try { return JSON.parse(v); } catch { return v; }
}

function TemplateForm({ onClose, onSaved, editing }) {
  const [form, setForm] = useState({
    name: '',
    template_key: '',
    description: '',
    schema_json: defaultSchemaExample(),
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || '',
        template_key: editing.template_key || '',
        description: editing.description || '',
        schema_json: JSON.stringify(safeParse(editing.schema_json) || {}, null, 2),
        is_active: editing.is_active !== false,
      });
    }
  }, [editing]);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        template_key: form.template_key.trim(),
        description: form.description || null,
        schema_json: form.schema_json ? JSON.parse(form.schema_json) : null,
        is_active: !!form.is_active,
      };
      const url = editing ? `/api/admin/page-templates/${editing.id}` : '/api/admin/page-templates';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) await onSaved(); else {
        const j = await res.json().catch(() => ({}));
        alert(j.message || 'Save failed');
      }
    } catch (e2) {
      console.error('Save template error', e2);
      alert('Save failed');
    } finally { setSaving(false); }
  }

  function loadHeroTabsSchema() {
    update('schema_json', JSON.stringify(heroTabsSchema(), null, 2));
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[95vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">{editing ? 'Edit Template' : 'Create Template'}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✕</button>
        </div>
        <form onSubmit={save} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input value={form.name} onChange={(e) => update('name', e.target.value)} required className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Template Key</label>
              <input value={form.template_key} onChange={(e) => update('template_key', e.target.value)} required placeholder="hero_tabs" className="mt-1 w-full border rounded px-3 py-2" />
              <p className="text-xs text-gray-500 mt-1">Unique identifier used by frontend renderer.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input value={form.description} onChange={(e) => update('description', e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Schema (JSON)</label>
              <div className="space-x-2">
                <button type="button" onClick={loadHeroTabsSchema} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">Load Hero+Tabs Example</button>
              </div>
            </div>
            <textarea value={form.schema_json} onChange={(e) => update('schema_json', e.target.value)} rows={14} className="mt-1 w-full border rounded px-3 py-2 font-mono text-sm" />
            <p className="text-xs text-gray-500 mt-1">Define fields and structure your template expects. This is stored and can guide admin forms later.</p>
          </div>

          <div className="flex items-center space-x-2">
            <input id="is_active_t" type="checkbox" checked={form.is_active} onChange={(e) => update('is_active', e.target.checked)} />
            <label htmlFor="is_active_t" className="text-sm text-gray-700">Active</label>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">{saving ? 'Saving...' : 'Save Template'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function defaultSchemaExample() {
  return JSON.stringify(heroTabsSchema(), null, 2);
}

function heroTabsSchema() {
  return {
    fields: [
      { key: 'hero_title', label: 'Hero Title', type: 'text', required: false },
      { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text', required: false },
      { key: 'hero_image_url', label: 'Hero Image URL', type: 'image', required: false },
      { key: 'tabs', label: 'Tabs', type: 'array', itemSchema: { fields: [
        { key: 'label', label: 'Tab Label', type: 'text', required: true },
        { key: 'content', label: 'Content HTML', type: 'richtext', required: false },
      ]}}
    ]
  };
}
