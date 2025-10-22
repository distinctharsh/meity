import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminDirectoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/directory");
      const data = r.ok ? await r.json() : [];
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!confirm("Delete this entry?")) return;
    const r = await fetch(`/api/admin/directory/${id}`, { method: "DELETE" });
    if (r.ok) await load();
  };
  const onSaved = async () => { setShowForm(false); setEditing(null); await load(); };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Directory</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700">
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      {loading ? <p>Loading...</p> : (!showForm && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Active</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Order</th>
                <th className="px-4 py-2 w-28"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map(r => (
                <tr key={r.id}>
                  <td className="px-4 py-2 text-sm">{r.role}</td>
                  <td className="px-4 py-2 text-sm">{r.name}</td>
                  <td className="px-4 py-2 text-sm">{r.is_active ? "Yes" : "No"}</td>
                  <td className="px-4 py-2 text-sm">{r.display_order}</td>
                  <td className="px-4 py-2 text-sm text-right space-x-2">
                    <button
                      onClick={() => { setEditing(r); setShowForm(true); }}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full border hover:bg-gray-50"
                      aria-label="Edit"
                      title="Edit"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(r.id)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full border text-red-600 hover:bg-red-50"
                      aria-label="Delete"
                      title="Delete"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-300">
          <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Entry' : 'Add Entry'}</h2>
          <DirectoryForm initial={editing} onSaved={onSaved} onCancel={() => { setShowForm(false); setEditing(null); }} />
        </div>
      )}
    </AdminLayout>
  );
}

// no Modal; using inline card style like Reports

function DirectoryForm({ initial, onSaved, onCancel }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    role: initial?.role || "",
    name: initial?.name || "",
    tags: (initial?.tags || []).join(", "),
    phones: (initial?.phones || []).join(", "),
    emails: (initial?.emails || []).join(", "),
    address: initial?.address || "",
    display_order: initial?.display_order ?? "",
    is_active: initial?.is_active ?? true,
  });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        role: form.role,
        name: form.name,
        tags: form.tags,
        phones: form.phones,
        emails: form.emails,
        address: form.address,
        display_order: form.display_order === "" ? undefined : Number(form.display_order),
        is_active: !!form.is_active,
      };
      const url = initial ? `/api/admin/directory/${initial.id}` : "/api/admin/directory";
      const method = initial ? "PUT" : "POST";
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error("Save failed");
      onSaved && onSaved();
    } catch (e) {
      alert(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Role *</label>
          <input value={form.role} onChange={e=>setForm({...form, role:e.target.value})} required className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (comma separated)</label>
          <input value={form.tags} onChange={e=>setForm({...form, tags:e.target.value})} className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Cyber Security Division, Data Governance Group" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phones (comma separated)</label>
          <input value={form.phones} onChange={e=>setForm({...form, phones:e.target.value})} className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="+91-11-..., +91-11-..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Emails (comma separated)</label>
          <input value={form.emails} onChange={e=>setForm({...form, emails:e.target.value})} className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="name[at]gov[dot]in, ..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
          <textarea rows={3} value={form.address} onChange={e=>setForm({...form, address:e.target.value})} className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Order</label>
          <input type="number" value={form.display_order} onChange={e=>setForm({...form, display_order:e.target.value})} className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div className="flex items-center">
          <input id="active" type="checkbox" checked={form.is_active} onChange={e=>setForm({...form, is_active:e.target.checked})} className="h-4 w-4 text-blue-600" />
          <label htmlFor="active" className="ml-2 text-sm">Active</label>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 border rounded">Cancel</button>
        <button type="submit" disabled={saving} className="px-3 py-1.5 rounded bg-blue-600 text-white">{saving ? "Saving..." : initial ? "Update" : "Create"}</button>
      </div>
    </form>
  );
}
