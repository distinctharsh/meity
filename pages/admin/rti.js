import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminRTIPage() {
  const [content, setContent] = useState({
    page_title: 'RTI',
    intro_heading: 'Power and Duties of Officials',
    intro_bullets: '[]'
  });
  const [sections, setSections] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [editingSection, setEditingSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [message, setMessage] = useState('');
  const [itemUploading, setItemUploading] = useState(false);
  const [itemForm, setItemForm] = useState({
    section_id: '',
    title: '',
    file_url: '',
    file_size: '',
    file_type: '',
    display_order: '',
    is_active: true
  });

  const loadAll = async () => {
    try {
      setLoading(true);
      const [contentRes, sectionsRes, itemsRes] = await Promise.all([
        fetch('/api/admin/rti/content'),
        fetch('/api/admin/rti/sections'),
        fetch('/api/admin/rti/items')
      ]);
      const contentData = await contentRes.json();
      const sectionsData = await sectionsRes.json();
      const itemsData = await itemsRes.json();
      setContent(contentData);
      const dedupSections = Array.isArray(sectionsData)
        ? [...new Map(sectionsData.map(s => [String(s.id), s])).values()]
        : [];
      const dedupItems = Array.isArray(itemsData)
        ? [...new Map(itemsData.map(i => [String(i.id), i])).values()]
        : [];
      setSections(dedupSections);
      setItems(dedupItems);
    } catch (e) {
      console.error('Load error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // Content form helpers
  const getBullets = () => {
    try { return JSON.parse(content.intro_bullets || '[]'); } catch { return []; }
  };

  const setBullets = (bullets) => {
    setContent(prev => ({ ...prev, intro_bullets: JSON.stringify(bullets) }));
  };

  const addBullet = () => {
    const b = getBullets();
    b.push('');
    setBullets(b);
  };

  const updateBullet = (index, value) => {
    const b = getBullets();
    b[index] = value;
    setBullets(b);
  };

  const removeBullet = (index) => {
    const b = getBullets();
    b.splice(index, 1);
    setBullets(b);
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/rti/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_title: content.page_title,
          intro_heading: content.intro_heading,
          intro_bullets: content.intro_bullets
        })
      });
      if (res.ok) showMsg('Page content saved!');
      else showMsg('Failed to save content');
    } catch (e) {
      showMsg('Error saving content');
    } finally {
      setSaving(false);
    }
  };

  // Section CRUD
  const saveSection = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const rawOrder = fd.get('display_order');
    const payload = {
      title: fd.get('title'),
      display_order: rawOrder === '' || rawOrder == null ? null : Number(rawOrder),
      is_active: fd.get('is_active') === 'on'
    };
    setSaving(true);
    try {
      const url = editingSection ? `/api/admin/rti/sections/${editingSection.id}` : '/api/admin/rti/sections';
      const method = editingSection ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showMsg(editingSection ? 'Section updated!' : 'Section created!');
        setShowSectionForm(false);
        setEditingSection(null);
        loadAll();
      } else {
        showMsg('Failed to save section');
      }
    } catch (e) {
      showMsg('Error saving section');
    } finally {
      setSaving(false);
    }
  };

  const deleteSection = async (id) => {
    if (!confirm('Delete this section and all its items?')) return;
    try {
      const res = await fetch(`/api/admin/rti/sections/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMsg('Section deleted');
        loadAll();
      } else {
        showMsg('Failed to delete');
      }
    } catch (e) {
      showMsg('Error deleting');
    }
  };

  const toggleSectionActive = async (sec) => {
    try {
      const res = await fetch(`/api/admin/rti/sections/${sec.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !sec.is_active })
      });
      if (res.ok) loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  // Item CRUD
  const saveItem = async (e) => {
    e.preventDefault();
    const payload = {
      section_id: Number(itemForm.section_id),
      title: itemForm.title,
      file_url: itemForm.file_url,
      file_size: itemForm.file_size,
      file_type: itemForm.file_type,
      display_order: itemForm.display_order === '' ? null : Number(itemForm.display_order),
      is_active: !!itemForm.is_active
    };
    if (!payload.section_id) {
      alert('Please select a section');
      return;
    }
    if (!payload.title) {
      alert('Title is required');
      return;
    }
    setSaving(true);
    try {
      const url = editingItem ? `/api/admin/rti/items/${editingItem.id}` : '/api/admin/rti/items';
      const method = editingItem ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showMsg(editingItem ? 'Item updated!' : 'Item created!');
        setShowItemForm(false);
        setEditingItem(null);
        loadAll();
      } else {
        showMsg('Failed to save item');
      }
    } catch (e) {
      showMsg('Error saving item');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      const res = await fetch(`/api/admin/rti/items/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMsg('Item deleted');
        loadAll();
      }
    } catch (e) {
      showMsg('Error deleting');
    }
  };

  const toggleItemActive = async (item) => {
    try {
      const res = await fetch(`/api/admin/rti/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !item.is_active })
      });
      if (res.ok) loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const openItemForm = (sectionId, item = null) => {
    setSelectedSectionId(sectionId);
    setEditingItem(item);
    setItemForm({
      section_id: item?.section_id || sectionId || '',
      title: item?.title || '',
      file_url: item?.file_url || '',
      file_size: item?.file_size || '',
      file_type: item?.file_type || '',
      display_order: item?.display_order ?? '',
      is_active: item ? !!item.is_active : true
    });
    setShowItemForm(true);
  };

  const handleItemFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setItemUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/media/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      const up = data.files?.[0];
      if (!up) throw new Error('No file returned');
      const kb = up.file_size ? (up.file_size / 1024).toFixed(2) + ' KB' : '';
      const ext = (file.name.split('.').pop() || '').toUpperCase();
      setItemForm(prev => ({
        ...prev,
        file_url: up.file_path || '',
        file_size: kb,
        file_type: ext
      }));
    } catch (err) {
      alert('File upload failed: ' + err.message);
    } finally {
      setItemUploading(false);
    }
  };

  const removeItemFile = () => {
    setItemForm(prev => ({ ...prev, file_url: '', file_size: '', file_type: '' }));
  };

  const bullets = getBullets();

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">RTI Page Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage RTI page content, sections and documents.</p>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {[
          { id: 'content', label: 'Page Content' },
          { id: 'sections', label: 'Sections' },
          { id: 'items', label: 'Items' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* CONTENT TAB */}
          {activeTab === 'content' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Page Intro Content</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                  <input
                    type="text"
                    value={content.page_title || ''}
                    onChange={e => setContent({ ...content, page_title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Intro Heading</label>
                  <input
                    type="text"
                    value={content.intro_heading || ''}
                    onChange={e => setContent({ ...content, intro_heading: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bullet Points</label>
                  <div className="space-y-2">
                    {bullets.map((b, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          value={b}
                          onChange={e => updateBullet(i, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                          placeholder={`Bullet point ${i + 1}`}
                        />
                        <button
                          onClick={() => removeBullet(i)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addBullet}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Add bullet point
                  </button>
                </div>
                <div className="pt-2">
                  <button
                    onClick={saveContent}
                    disabled={saving}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Content'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTIONS TAB */}
          {activeTab === 'sections' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Sections (Accordions)</h2>
                <button
                  onClick={() => { setEditingSection(null); setShowSectionForm(true); }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  + Add Section
                </button>
              </div>

              {showSectionForm && (
                <form onSubmit={saveSection} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-4">
                  <h3 className="font-medium text-gray-900 mb-3">
                    {editingSection ? 'Edit Section' : 'New Section'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        name="title"
                        defaultValue={editingSection?.title || ''}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Display Order <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input
                        name="display_order"
                        type="number"
                        defaultValue={editingSection?.display_order ?? ''}
                        placeholder="Auto"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      name="is_active"
                      type="checkbox"
                      defaultChecked={editingSection ? !!editingSection.is_active : true}
                      id="sec_active"
                      className="w-4 h-4 text-blue-600 rounded border-gray-300"
                    />
                    <label htmlFor="sec_active" className="text-sm text-gray-700">Active</label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : (editingSection ? 'Update' : 'Create')}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowSectionForm(false); setEditingSection(null); }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {sections.map(sec => (
                  <div key={sec.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm font-mono">#{sec.display_order}</span>
                      <span className="font-medium text-gray-800 text-sm">{sec.title}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${sec.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {sec.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleSectionActive(sec)}
                        className="px-2 py-1.5 text-xs rounded-md bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium"
                      >
                        {sec.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => { setEditingSection(sec); setShowSectionForm(true); }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteSection(sec.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                {sections.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">No sections yet. Add one above.</div>
                )}
              </div>
            </div>
          )}

          {/* ITEMS TAB */}
          {activeTab === 'items' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Section Items (Documents)</h2>
                <button
                  onClick={() => openItemForm(sections[0]?.id || null, null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  + Add Item
                </button>
              </div>

              {showItemForm && (
                <form onSubmit={saveItem} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-4">
                  <h3 className="font-medium text-gray-900 mb-3">
                    {editingItem ? 'Edit Item' : 'New Item'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                      <select
                        value={itemForm.section_id}
                        onChange={e => setItemForm(p => ({ ...p, section_id: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                      >
                        <option value="">Select section...</option>
                        {sections.map(s => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        value={itemForm.title}
                        onChange={e => setItemForm(p => ({ ...p, title: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">File Upload</label>
                      {itemForm.file_url ? (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 truncate">{itemForm.file_url}</p>
                            <p className="text-xs text-gray-500">{itemForm.file_size} {itemForm.file_type && `· ${itemForm.file_type}`}</p>
                          </div>
                          <button
                            type="button"
                            onClick={removeItemFile}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="file"
                            onChange={handleItemFileUpload}
                            disabled={itemUploading}
                            className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:font-medium cursor-pointer"
                          />
                          {itemUploading && (
                            <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                              <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></span>
                              Uploading...
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Display Order <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input
                        type="number"
                        value={itemForm.display_order}
                        onChange={e => setItemForm(p => ({ ...p, display_order: e.target.value }))}
                        placeholder="Auto"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-3 self-end pb-2">
                      <input
                        id="item_active"
                        type="checkbox"
                        checked={itemForm.is_active}
                        onChange={e => setItemForm(p => ({ ...p, is_active: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                      <label htmlFor="item_active" className="text-sm text-gray-700">Active</label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={saving || itemUploading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowItemForm(false); setEditingItem(null); }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Group items by section */}
              {sections.map(sec => {
                const secItems = items.filter(i => i.section_id === sec.id);
                if (secItems.length === 0) return null;
                return (
                  <div key={sec.id} className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">{sec.title}</h3>
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-4 py-2.5 font-medium text-gray-600">Title</th>
                            <th className="text-left px-4 py-2.5 font-medium text-gray-600 w-32">Size/Type</th>
                            <th className="text-left px-4 py-2.5 font-medium text-gray-600 w-20">Status</th>
                            <th className="text-right px-4 py-2.5 font-medium text-gray-600 w-32">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {secItems.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-800">{item.title}</td>
                              <td className="px-4 py-3 text-gray-500 text-xs">
                                {item.file_size || item.file_type || '-'}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 text-xs rounded-full ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                  {item.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => toggleItemActive(item)}
                                    className="px-2 py-1 text-xs rounded bg-gray-50 hover:bg-gray-100 text-gray-700"
                                  >
                                    {item.is_active ? 'Hide' : 'Show'}
                                  </button>
                                  <button
                                    onClick={() => openItemForm(sec.id, item)}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    title="Edit"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => deleteItem(item.id)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    title="Delete"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
              {items.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">No items yet. Add one above.</div>
              )}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
