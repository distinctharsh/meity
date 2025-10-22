import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminOurTeamPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // New: Sections/People state
  const [sections, setSections] = useState([]);
  const [people, setPeople] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loadingStruct, setLoadingStruct] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/our-team');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setItems(data);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const loadStruct = async () => {
    try {
      setLoadingStruct(true);
      const [s, p, c] = await Promise.all([
        fetch('/api/admin/our-team/sections'),
        fetch('/api/admin/our-team/people'),
        fetch('/api/admin/our-team/contacts'),
      ]);
      const [sv, pv, cv] = await Promise.all([s.ok ? s.json() : [], p.ok ? p.json() : [], c.ok ? c.json() : []]);
      setSections(Array.isArray(sv) ? sv : []);
      setPeople(Array.isArray(pv) ? pv : []);
      setContacts(Array.isArray(cv) ? cv : []);
    } catch (e) {
      console.error('Load struct failed', e);
    } finally {
      setLoadingStruct(false);
    }
  };
  useEffect(() => { loadStruct(); }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const $ = window.$ || window.jQuery;
    if (!$) return;
    if (!items || items.length === 0) return;
    if (showForm) return;
    const selector = '#our-team-table';
    try {
      if ($.fn.dataTable.isDataTable(selector)) {
        $(selector).DataTable().destroy();
      }
      $(selector).DataTable({
        paging: true,
        searching: true,
        info: true,
        order: [[3, 'asc']], // by display_order (after removing Role column)
        autoWidth: false,
        responsive: true,
        columnDefs: [
          { orderable: false, targets: -1 },
          { width: '34%', targets: 0 }, // Name
          { width: '34%', targets: 1 }, // Designation
          { width: '14%', targets: 2 }, // Active
          { width: '14%', targets: 3 }, // Order
        ],
      });
    } catch (e) {
      console.error('DataTable init failed (our-team)', e);
    }
    return () => {
      if ($ && $.fn.dataTable.isDataTable(selector)) {
        $(selector).DataTable().destroy();
      }
    };
  }, [items, showForm]);

  const onDelete = async (id) => {
    if (!confirm('Delete this member?')) return;
    const res = await fetch(`/api/admin/our-team/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Delete failed');
    } else {
      await load();
    }
  };

  const onSaved = async () => {
    setShowForm(false);
    setEditing(null);
    await load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Our Team</h1>
        <button
          onClick={() => { setShowForm(true); setEditing(null); }}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          aria-label="Add member"
          title="Add member"
        >
          <span aria-hidden="true" className="material-symbols-outlined">add</span>
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => { setShowForm(false); setEditing(null); }} />
          <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-xl ring-1 ring-black/5" role="dialog" aria-modal="true" aria-labelledby="our-team-dialog-title">
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <h2 id="our-team-dialog-title" className="text-lg font-semibold">{editing ? 'Edit Member' : 'Add Member'}</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100" aria-label="Close" title="Close">
                <span aria-hidden="true" className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="max-h-[80vh] overflow-y-auto p-5">
              <OurTeamForm initial={editing} onCancel={() => { setShowForm(false); setEditing(null); }} onSaved={onSaved} />
            </div>
          </div>
        </div>
      )}

      {!loading && !showForm && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table id="our-team-table" className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Active</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Order</th>
                <th className="px-4 py-2 w-28"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2 text-sm text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap" title={r.name}>{r.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap" title={r.designation}>{r.designation || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{r.is_active ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{r.display_order}</td>
                  <td className="px-4 py-2 text-sm text-right space-x-2 w-28 whitespace-nowrap">
                    <button onClick={() => { setEditing(r); setShowForm(true); }} className="inline-flex items-center justify-center w-9 h-9 rounded-full border hover:bg-gray-50 cursor-pointer" aria-label="Edit" title="Edit">
                      <span aria-hidden="true" className="material-symbols-outlined">edit</span>
                    </button>
                    <button onClick={() => onDelete(r.id)} className="inline-flex items-center justify-center w-9 h-9 rounded-full border text-red-600 hover:bg-red-50 cursor-pointer" aria-label="Delete" title="Delete">
                      <span aria-hidden="true" className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sections Manager */}
      <SectionsManager sections={sections} reload={loadStruct} />

      {/* People Manager */}
      <PeopleManager
        sections={sections}
        people={people}
        contacts={contacts}
        reload={loadStruct}
      />
    </AdminLayout>
  );
}

function OurTeamForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    designation: initial?.designation || '',
    photo_url: initial?.photo_url || '',
    email: initial?.email || '',
    phone_primary: initial?.phone_primary || '',
    phone_secondary: initial?.phone_secondary || '',
    profile_url: initial?.profile_url || '',
    about_text: initial?.about_text || '',
    office_title: initial?.office_title || '',
    office_name: initial?.office_name || '',
    office_designation: initial?.office_designation || '',
    office_phone1: initial?.office_phone1 || '',
    office_phone2: initial?.office_phone2 || '',
    office_email1: initial?.office_email1 || '',
    office_email2: initial?.office_email2 || '',
    office_fax: initial?.office_fax || '',
    display_order: typeof initial?.display_order === 'number' ? initial.display_order : '',
    is_active: initial?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const url = initial ? `/api/admin/our-team/${initial.id}` : '/api/admin/our-team';
      const method = initial ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          designation: form.designation,
          photo_url: form.photo_url,
          email: form.email,
          phone_primary: form.phone_primary,
          phone_secondary: form.phone_secondary,
          profile_url: form.profile_url,
          about_text: form.about_text,
          office_title: form.office_title,
          office_name: form.office_name,
          office_designation: form.office_designation,
          office_phone1: form.office_phone1,
          office_phone2: form.office_phone2,
          office_email1: form.office_email1,
          office_email2: form.office_email2,
          office_fax: form.office_fax,
          display_order: form.display_order === '' ? undefined : Number(form.display_order),
          is_active: form.is_active,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      onSaved && onSaved();
    } catch (e) {
      alert(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name *</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Designation</label>
          <input type="text" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">About Text (one or two lines)</label>
          <textarea rows={2} value={form.about_text} onChange={(e) => setForm({ ...form, about_text: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Photo URL</label>
          <input type="text" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} placeholder="/images/our-team/a.jpg" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone (Primary)</label>
          <input type="text" value={form.phone_primary} onChange={(e) => setForm({ ...form, phone_primary: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone (Secondary)</label>
          <input type="text" value={form.phone_secondary} onChange={(e) => setForm({ ...form, phone_secondary: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile URL</label>
          <input type="text" value={form.profile_url} onChange={(e) => setForm({ ...form, profile_url: e.target.value })} placeholder="https://example.com/profile" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div className="md:col-span-2 pt-2">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Office Block (appears below profile)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Office Title</label>
              <input type="text" value={form.office_title} onChange={(e) => setForm({ ...form, office_title: e.target.value })} placeholder="OFFICE OF HON'BLE MINISTER" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Office Fax</label>
              <input type="text" value={form.office_fax} onChange={(e) => setForm({ ...form, office_fax: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Office Contact Name</label>
              <input type="text" value={form.office_name} onChange={(e) => setForm({ ...form, office_name: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Office Contact Designation</label>
              <input type="text" value={form.office_designation} onChange={(e) => setForm({ ...form, office_designation: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Office Phone 1</label>
              <input type="text" value={form.office_phone1} onChange={(e) => setForm({ ...form, office_phone1: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Office Phone 2</label>
              <input type="text" value={form.office_phone2} onChange={(e) => setForm({ ...form, office_phone2: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Office Email 1</label>
              <input type="text" value={form.office_email1} onChange={(e) => setForm({ ...form, office_email1: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Office Email 2</label>
              <input type="text" value={form.office_email2} onChange={(e) => setForm({ ...form, office_email2: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Display Order</label>
          <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div className="flex items-center">
          <input id="is_active" type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Active</label>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
        <button type="submit" disabled={saving} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60">{saving ? 'Saving...' : initial ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
}

function SectionsManager({ sections, reload }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ id: null, title: '', display_order: '', is_active: true });

  const open = (s) => {
    if (s) setForm({ id: s.id, title: s.title, display_order: s.display_order, is_active: !!s.is_active });
    else setForm({ id: null, title: '', display_order: '', is_active: true });
    setShow(true);
  };
  const save = async (e) => {
    e.preventDefault();
    const body = { title: form.title, display_order: form.display_order === '' ? undefined : Number(form.display_order), is_active: form.is_active };
    const url = form.id ? `/api/admin/our-team/sections/${form.id}` : '/api/admin/our-team/sections';
    const method = form.id ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) return alert('Save failed');
    setShow(false);
    await reload();
  };
  const remove = async (id) => {
    if (!confirm('Delete this section? All its people will be deleted.')) return;
    const res = await fetch(`/api/admin/our-team/sections/${id}`, { method: 'DELETE' });
    if (!res.ok) return alert('Delete failed');
    await reload();
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Sections</h2>
        <button onClick={() => open(null)} className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm">Add Section</button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Active</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Order</th>
              <th className="px-4 py-2 w-28"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sections.map(s => (
              <tr key={s.id}>
                <td className="px-4 py-2 text-sm">{s.title}</td>
                <td className="px-4 py-2 text-sm">{s.is_active ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 text-sm">{s.display_order}</td>
                <td className="px-4 py-2 text-sm text-right space-x-2">
                  <button
                    onClick={() => open(s)}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full border hover:bg-gray-50"
                    aria-label="Edit"
                    title="Edit"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    onClick={() => remove(s.id)}
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

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShow(false)} />
          <div className="relative bg-white w-full max-w-md rounded-xl shadow-xl ring-1 ring-black/5 p-5">
            <h3 className="text-base font-semibold mb-3">{form.id ? 'Edit Section' : 'Add Section'}</h3>
            <form onSubmit={save} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title *</label>
                <input className="mt-1 block w-full border-gray-300 rounded-md" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Display Order</label>
                  <input type="number" className="mt-1 block w-full border-gray-300 rounded-md" value={form.display_order} onChange={e=>setForm({...form, display_order:e.target.value})} />
                </div>
                <div className="flex items-center mt-6">
                  <input id="s_active" type="checkbox" className="h-4 w-4 text-blue-600" checked={form.is_active} onChange={e=>setForm({...form, is_active:e.target.checked})} />
                  <label htmlFor="s_active" className="ml-2 text-sm">Active</label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={()=>setShow(false)} className="px-3 py-1.5 border rounded">Cancel</button>
                <button type="submit" className="px-3 py-1.5 rounded bg-blue-600 text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function PeopleManager({ sections, people, contacts, reload }) {
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ section_id: '', name: '', designation: '', address: '', display_order: '', is_active: true, contacts: [] });

  const open = (p) => {
    if (p) {
      const pc = contacts.filter(ct => ct.person_id === p.id).map(ct => ({ id: ct.id, type: ct.type, value: ct.value }));
      setForm({ section_id: p.section_id, name: p.name, designation: p.designation || '', address: p.address || '', display_order: p.display_order ?? '', is_active: !!p.is_active, contacts: pc });
      setEditing(p);
    } else {
      setForm({ section_id: '', name: '', designation: '', address: '', display_order: '', is_active: true, contacts: [] });
      setEditing(null);
    }
    setShow(true);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const base = { section_id: Number(form.section_id), name: form.name, designation: form.designation, address: form.address, display_order: form.display_order === '' ? undefined : Number(form.display_order), is_active: form.is_active };
      if (!editing) {
        const r = await fetch('/api/admin/our-team/people', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(base) });
        if (!r.ok) throw new Error('Save failed');
        const { id } = await r.json();
        for (const ct of form.contacts) {
          if (!ct.type || !ct.value) continue;
          await fetch('/api/admin/our-team/contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ person_id: id, type: ct.type, value: ct.value }) });
        }
      } else {
        const r = await fetch(`/api/admin/our-team/people/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(base) });
        if (!r.ok) throw new Error('Update failed');
        const existing = contacts.filter(ct => ct.person_id === editing.id);
        for (const ex of existing) { await fetch(`/api/admin/our-team/contacts/${ex.id}`, { method: 'DELETE' }); }
        for (const ct of form.contacts) {
          if (!ct.type || !ct.value) continue;
          await fetch('/api/admin/our-team/contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ person_id: editing.id, type: ct.type, value: ct.value }) });
        }
      }
      setShow(false);
      setEditing(null);
      await reload();
    } catch (e) {
      alert(e.message || 'Save failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this person?')) return;
    const r = await fetch(`/api/admin/our-team/people/${id}`, { method: 'DELETE' });
    if (!r.ok) return alert('Delete failed');
    await reload();
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">People</h2>
        <button onClick={() => open(null)} className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm">Add Person</button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Active</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Order</th>
              <th className="px-4 py-2 w-28"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {people.map(p => (
              <tr key={p.id}>
                <td className="px-4 py-2 text-sm">{sections.find(s=>s.id===p.section_id)?.title || '-'}</td>
                <td className="px-4 py-2 text-sm">{p.name}</td>
                <td className="px-4 py-2 text-sm">{p.designation || '-'}</td>
                <td className="px-4 py-2 text-sm">{p.is_active ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 text-sm">{p.display_order}</td>
                <td className="px-4 py-2 text-sm text-right space-x-2">
                  <button
                    onClick={() => open(p)}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full border hover:bg-gray-50"
                    aria-label="Edit"
                    title="Edit"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    onClick={() => remove(p.id)}
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

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => { setShow(false); setEditing(null); }} />
          <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-xl ring-1 ring-black/5 p-5">
            <h3 className="text-base font-semibold mb-3">{editing ? 'Edit Person' : 'Add Person'}</h3>
            <form onSubmit={save} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Section *</label>
                  <select className="mt-1 block w-full border-gray-300 rounded-md" value={form.section_id} onChange={e=>setForm({...form, section_id: e.target.value})} required>
                    <option value="">Select section</option>
                    {sections.map(s => (<option key={s.id} value={s.id}>{s.title}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Display Order</label>
                  <input type="number" className="mt-1 block w-full border-gray-300 rounded-md" value={form.display_order} onChange={e=>setForm({...form, display_order: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input className="mt-1 block w-full border-gray-300 rounded-md" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Active</label>
                  <div className="mt-2 flex items-center"><input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form, is_active: e.target.checked})} className="h-4 w-4 text-blue-600" /><span className="ml-2 text-sm">Active</span></div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Designation</label>
                  <input className="mt-1 block w-full border-gray-300 rounded-md" value={form.designation} onChange={e=>setForm({...form, designation: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea className="mt-1 block w-full border-gray-300 rounded-md" rows={2} value={form.address} onChange={e=>setForm({...form, address: e.target.value})} />
                </div>
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Contacts</h4>
                  <button type="button" onClick={()=>setForm({...form, contacts:[...form.contacts, {type:'phone', value:''}]})} className="px-2 py-1 rounded bg-gray-100 text-sm">Add</button>
                </div>
                <div className="space-y-2">
                  {form.contacts.map((ct, idx) => (
                    <div key={idx} className="grid grid-cols-5 gap-2 items-center">
                      <select className="col-span-1 border-gray-300 rounded-md" value={ct.type} onChange={e=>{const arr=[...form.contacts]; arr[idx]={...ct, type:e.target.value}; setForm({...form, contacts:arr});}}>
                        <option value="phone">Phone</option>
                        <option value="fax">Fax</option>
                        <option value="email">Email</option>
                      </select>
                      <input className="col-span-3 border-gray-300 rounded-md" value={ct.value} onChange={e=>{const arr=[...form.contacts]; arr[idx]={...ct, value:e.target.value}; setForm({...form, contacts:arr});}} placeholder="Value" />
                      <button type="button" onClick={()=>{const arr=[...form.contacts]; arr.splice(idx,1); setForm({...form, contacts:arr});}} className="col-span-1 px-2 py-1 rounded border">Remove</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={()=>{setShow(false); setEditing(null);}} className="px-3 py-1.5 border rounded">Cancel</button>
                <button type="submit" className="px-3 py-1.5 rounded bg-blue-600 text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
