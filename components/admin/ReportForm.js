import { useEffect, useState } from 'react';

export default function ReportForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState({
    title: '',
    type: 'pdf',
    year: '',
    file_url: '',
    nav_item_id: null,
    nav_link: '',
    display_order: '',
    is_active: true,
  });
  const [navOptions, setNavOptions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState([]); // for group
  const [pendingAttach, setPendingAttach] = useState([]); // buffer uploaded files before save

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        type: initial.type || 'pdf',
        year: initial.year || '',
        file_url: initial.file_url || '',
        nav_item_id: initial.nav_item_id ?? null,
        nav_link: initial.nav_link || '',
        display_order: initial.display_order ?? '',
        is_active: !!initial.is_active,
      });
      // Load existing files for group if editing
      if (initial.type === 'group') {
        (async () => {
          try {
            const res = await fetch(`/api/admin/reports/${initial.id}/files`);
            const data = res.ok ? await res.json() : [];
            setAttachedFiles(data || []);
          } catch { }
        })();
      }
    } else {
      const y = new Date().getFullYear();
      setForm((p) => ({ ...p, year: String(y) }));
    }
  }, [initial]);

  // Load navigation options for nav_link selector
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/admin/navigation');
        if (!res.ok) return;
        const items = await res.json();

        // Build byId map to walk parent chain
        const byId = new Map(items.map(i => [i.id, i]));
        const labelFor = (it) => {
          let label = it.name || '';
          let p = it.parent_id ? byId.get(it.parent_id) : null;
          const parts = [label];
          while (p) {
            parts.unshift(p.name || '');
            p = p.parent_id ? byId.get(p.parent_id) : null;
          }
          return parts.filter(Boolean).join(' / ');
        };

        // Find Documents parent by link '/documents' or name 'Documents'
        const documentsParent = items.find(it => (it.link === '/documents' || String(it.name).toLowerCase() === 'documents'));
        let filtered = [];
        if (documentsParent) {
          // Only immediate children of Documents
          filtered = items.filter(it => it.parent_id === documentsParent.id && it.is_active !== false && it.link && it.link.trim() !== '');
        } else {
          // Fallback: any active nav items whose link begins with /documents
          filtered = items.filter(it => it.is_active !== false && it.link && String(it.link).startsWith('/documents'));
        }

        const options = filtered.map(it => ({
          id: it.id,
          value: it.id,
          link: it.link,
          label: `${labelFor(it)} — ${it.link.startsWith('/') ? it.link : '/' + it.link}`
        }));
        if (mounted) setNavOptions(options);

        // If editing an existing item that only has nav_link, try to resolve to nav_item_id
        if (initial && initial.nav_item_id == null && initial.nav_link) {
          const match = options.find(o => (o.link === initial.nav_link) || ('/' + String(o.link).replace(/^\//, '') === initial.nav_link) || (o.link === '/' + String(initial.nav_link).replace(/^\//, '')));
          if (match) setForm(p => ({ ...p, nav_item_id: match.id }));
        }
      } catch (e) {
        console.error('Load navigation for report form failed', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

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
      // For non-group: if no file_url yet but user has selected files, try uploading first
      if (form.type !== 'group' && !form.file_url && selectedFiles.length) {
        await uploadFiles(selectedFiles);
      }
      // Basic guard: need title, and for non-group a file_url or a non-empty external link
      if (!form.title) {
        alert('Title is required');
        return;
      }
      if (!form.nav_item_id) {
        alert('Please select a navigation link');
        return;
      }
      if (form.type !== 'group' && !form.file_url) {
        alert('Please upload a file or provide a link URL for this report.');
        return;
      }
      const payload = {
        ...form,
        year: form.year ? Number(form.year) : null,
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
      // Resolve report id for attaching files
      let reportId = initial?.id;
      if (!reportId) {
        const j = await res.json().catch(() => ({}));
        reportId = j?.id;
      }
      // If group type and we have freshly uploaded files buffered, attach them
      if (form.type === 'group' && pendingAttach.length) {
        await fetch(`/api/admin/reports/${reportId}/files`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            files: pendingAttach.map(f => ({
              original_name: f.original_name || f.filename || 'file',
              file_url: f.file_path,
              file_type: f.file_type,
              file_size: f.file_size,
            }))
          })
        });
      }
      await onSaved();
    } catch (e) {
      console.error(e);
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onChooseFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    // Auto-fill title from first file name if empty
    if (files[0] && !form.title) {
      const base = files[0].name.replace(/\.[^.]+$/, '');
      setForm((p) => ({ ...p, title: base }));
    }
    // For non-group, auto-upload immediately to populate file_url
    if (files.length && form.type !== 'group') {
      // Upload chosen files directly to avoid state timing issues
      uploadFiles(files);
    }
  };

  const uploadFiles = async (filesArg) => {
    const toUpload = Array.isArray(filesArg) ? filesArg : selectedFiles;
    if (!toUpload.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      toUpload.forEach(f => fd.append('files', f));
      const resp = await fetch('/api/admin/media/upload', { method: 'POST', body: fd });
      if (!resp.ok) {
        const j = await resp.json().catch(() => ({}));
        alert(j.message || 'Upload failed');
        return;
      }
      const j = await resp.json();
      const up = j.files || [];
      if (form.type === 'group') {
        setPendingAttach(prev => [...prev, ...up]);
        setAttachedFiles(prev => [...prev, ...up.map(x => ({
          id: 0,
          original_name: x.original_name,
          file_url: x.file_path,
          file_type: x.file_type,
          file_size: x.file_size,
        }))]);
      } else {
        // For single report, set the first file URL
        if (up[0]?.file_path) setForm(p => ({ ...p, file_url: up[0].file_path }));
      }
      setSelectedFiles([]);
    } catch (err) {
      console.error('Upload error', err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeAttachedFile = async (file, index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    setPendingAttach(prev =>
      prev.filter(p => p.file_path !== file.file_url)
    );
    if (file.id && file.id !== 0 && initial?.id) {
      try {
        await fetch(
          `/api/admin/reports/${initial.id}/files/${file.id}`,
          { method: 'DELETE' }
        );
      } catch (e) {
        console.error('Failed to delete file', e);
      }
    }
  };

  const removeSingleFile = async () => {
    const current = form.file_url;
    // Clear UI immediately
    setForm(p => ({ ...p, file_url: '' }));
    setSelectedFiles([]);
    // Remove from pending attachments buffer if present
    setPendingAttach(prev => prev.filter(p => ((p.file_path || p.file_url) !== current)));

    // If editing an existing report, update the report record to clear file_url
    if (initial?.id) {
      try {
        await fetch(`/api/admin/reports/${initial.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file_url: null })
        });
      } catch (e) {
        console.error('Failed to clear report file_url on server', e);
      }
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
          <label className="block text-sm font-medium text-gray-700">
            Nav Link <span className="text-red-500">*</span>
          </label>
          <select 
            value={form.nav_item_id || ''} 
            onChange={(e) => update('nav_item_id', e.target.value ? Number(e.target.value) : null)} 
            className="mt-1 w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select navigation link</option>
            {navOptions.map(opt => (
              <option key={opt.id} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {form.type !== 'group' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">File/Link URL</label>
            <input value={form.file_url} onChange={(e) => update('file_url', e.target.value)} className="mt-1 w-full border rounded px-3 py-2" placeholder="/uploads/report.pdf or https://..." />
            {form.file_url ? (
              <div className="mt-2 flex items-center justify-between">
                <a href={form.file_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline truncate">{form.file_url}</a>
                <button type="button" onClick={removeSingleFile} className="text-red-600 hover:text-red-800 text-sm font-bold">✕</button>
              </div>
            ) : null}
          </div>
        )}

        {/* Inline upload like Media Library */}
        <div className={form.type === 'group' ? 'md:col-span-2' : ''}>
          <label className="block text-sm font-medium text-gray-700">Upload {form.type === 'group' ? 'Files (multiple for group)' : 'File'}</label>
          <input type="file" multiple={form.type === 'group'} onChange={onChooseFiles} accept="image/*,.pdf,.doc,.docx,.txt" className="mt-1 block w-full text-sm" />
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={uploadFiles} disabled={uploading || selectedFiles.length === 0} className="px-3 py-1.5 bg-blue-600 text-white rounded disabled:opacity-50">{uploading ? 'Uploading...' : 'Upload'}</button>
            {selectedFiles.length > 0 && <span className="text-xs text-gray-500">{selectedFiles.length} file(s) selected</span>}
          </div>
        </div>

        {form.type === 'group' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Attached Files</label>
            {attachedFiles.length === 0 ? (
              <div className="text-sm text-gray-500">No files attached yet. Upload files above.</div>
            ) : (
              <ul className="text-sm text-gray-700 space-y-1">
                {attachedFiles.map((f, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between border rounded px-2 py-1"
                  >
                    <span className="truncate mr-2">
                      {f.original_name || f.file_url}
                    </span>

                    <div className="flex items-center gap-2">
                      <a
                        href={f.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline text-xs"
                      >
                        View
                      </a>

                      <button
                        type="button"
                        onClick={() => removeAttachedFile(f, idx)}
                        className="text-red-600 hover:text-red-800 text-sm font-bold"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </li>

                ))}
              </ul>
            )}
          </div>
        )}

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
        <button disabled={saving || (form.type !== 'group' && uploading)} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">{saving ? 'Saving...' : (initial ? 'Update' : 'Create')}</button>
      </div>
    </form>
  );
}
