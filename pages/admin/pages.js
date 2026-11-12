import { useEffect, useRef, useState, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { syncPagesAndRoutes } from '@/utils/api';

import dynamic from 'next/dynamic';
import { loader } from '@monaco-editor/react';

// Next.js static asset serve karega local public folder se
loader.config({
  paths: {
    vs: '/monaco-editor/min/vs',
  },
});

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

function CKEditorCDN({ value, onChange }) {
  const editorRef = useRef(null);
  const instanceRef = useRef(null);
  const onChangeRef = useRef(onChange);

  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let mounted = true;
    let editorInstance = null;

    const SCRIPT_ID = 'ckeditor-umd-script';
    const CSS_ID = 'ckeditor-umd-css';

    const initialize = async () => {
      if (!mounted || !editorRef.current) return;

      try {
        const CK = window.CKEDITOR;

        if (!CK) {
          throw new Error('window.CKEDITOR not found.');
        }

        const {
          ClassicEditor,
          Essentials,
          Paragraph,
          Heading,
          Bold,
          Italic,
          Underline,
          Strikethrough,
          Code,
          Subscript,
          Superscript,
          Link,
          List,
          TodoList,
          BlockQuote,
          Alignment,
          Font,
          Highlight,
          Image,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageUpload,
          ImageResize,
          PictureEditing,
          Table,
          TableToolbar,
          TableColumnResize,
          TableProperties,
          TableCellProperties,
          HorizontalLine,
          SpecialCharacters,
          SourceEditing,
          RemoveFormat,
          FindAndReplace,
          CodeBlock,
          PageBreak
        } = CK;

        if (!ClassicEditor) {
          throw new Error('ClassicEditor export missing.');
        }

        // Custom Upload Adapter Plugin for Local /api/adm/upload
        function MyUploadAdapterPlugin(editor) {
          editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return {
              upload: async () => {
                const file = await loader.file;
                const data = new FormData();
                data.append('file', file);
                data.append('type', 'images');

                const response = await fetch('/api/adm/upload', {
                  method: 'POST',
                  body: data,
                });

                if (!response.ok) {
                  const errorJson = await response.json().catch(() => ({}));
                  throw new Error(errorJson.error || 'Image upload failed on server.');
                }

                const result = await response.json();
                return {
                  default: result.url || result.location
                };
              }
            };
          };
        }

        const plugins = [
          Essentials,
          Paragraph,
          Heading,
          Bold,
          Italic,
          Underline,
          Strikethrough,
          Code,
          Subscript,
          Superscript,
          Link,
          List,
          TodoList,
          BlockQuote,
          Alignment,
          Font,
          Highlight,
          Image,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageUpload,
          ImageResize,
          PictureEditing,
          Table,
          TableToolbar,
          TableColumnResize,
          TableProperties,
          TableCellProperties,
          HorizontalLine,
          SpecialCharacters,
          SourceEditing,
          RemoveFormat,
          FindAndReplace,
          CodeBlock,
          PageBreak,
          MyUploadAdapterPlugin
        ];

        const editor = await ClassicEditor.create(
          editorRef.current,
          {
            licenseKey: 'GPL',
            plugins,
            toolbar: [
              'sourceEditing', '|',
              'findAndReplace', '|',
              'heading', '|',
              'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor', '|',
              'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'highlight', '|',
              'alignment', '|',
              'link', 'imageUpload', 'insertTable', 'horizontalLine', 'pageBreak', 'specialCharacters', '|',
              'bulletedList', 'numberedList', 'todoList', '|',
              'blockQuote', 'codeBlock', 'removeFormat', '|',
              'undo', 'redo'
            ],
            image: {
              toolbar: [
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side',
                '|',
                'toggleImageCaption',
                'imageTextAlternative',
                '|',
                'resizeImage'
              ]
            },
            table: {
              contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells',
                'tableProperties',
                'tableCellProperties'
              ]
            },
            root: {
              placeholder: 'Start typing your content or drag & drop images here...'
            }
          }
        );

        if (!mounted) {
          await editor.destroy();
          return;
        }

        editorInstance = editor;
        instanceRef.current = editor;

        editor.setData(value || '');

        editor.model.document.on('change:data', () => {
          onChangeRef.current?.(editor.getData());
        });

        setStatus('ready');

      } catch (error) {
        console.error('CKEditor initialization failed:', error);
        if (mounted) {
          setErrorMessage(error.message);
          setStatus('error');
        }
      }
    };

    const loadEditor = () => {
      if (!document.getElementById(CSS_ID)) {
        const link = document.createElement('link');
        link.id = CSS_ID;
        link.rel = 'stylesheet';
        link.href = '/ckeditor/ckeditor5/ckeditor5.css';
        document.head.appendChild(link);
      }

      if (window.CKEDITOR) {
        initialize();
        return;
      }

      const existing = document.getElementById(SCRIPT_ID);

      if (existing) {
        if (existing.dataset.loaded === 'true') {
          initialize();
          return;
        }
        existing.addEventListener('load', initialize, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = '/ckeditor/ckeditor5/ckeditor5.umd.js';
      script.onload = () => {
        script.dataset.loaded = 'true';
        initialize();
      };
      script.onerror = () => {
        if (mounted) {
          setErrorMessage('Cannot load CKEditor UMD script');
          setStatus('error');
        }
      };
      document.body.appendChild(script);
    };

    loadEditor();

    return () => {
      mounted = false;
      if (editorInstance) {
        editorInstance.destroy().catch(console.error);
      }
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const editor = instanceRef.current;
    if (editor && editor.getData() !== (value || '')) {
      editor.setData(value || '');
    }
  }, [value]);

  return (
    <div className="w-full">
      {status === 'loading' && <div className="p-3 text-sm text-gray-500">Loading Offline CKEditor...</div>}
      {status === 'error' && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
          <strong>CKEditor Error:</strong>
          <p>{errorMessage}</p>
        </div>
      )}
      <div ref={editorRef} style={{ display: status === 'error' ? 'none' : 'block' }} />
    </div>
  );
}

export default function PagesManagement() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const pRes = await fetch('/api/adm/pages');
      const p = pRes.ok ? await pRes.json() : [];
      setPages(Array.isArray(p) ? p : []);
    } catch (e) {
      console.error('Load pages failed', e);
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
      const res = await fetch(`/api/adm/pages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await refresh();
        await syncPagesAndRoutes();
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
      const res = await fetch(`/api/adm/pages/${pg.id}`, {
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
      if (res.ok) {
        refresh();
        await syncPagesAndRoutes();
      } else {
        alert('Failed to update status');
      }
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
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow cursor-pointer"
            aria-label="Create new page"
            title="Create new page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </svg>
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
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-center">Actions</div>
            </div>
            {pages.length === 0 ? (
              <div className="px-4 py-8 text-gray-500 text-center">No pages yet. Click Create Page.</div>
            ) : (
              pages.map((pg) => (
                <div key={pg.id} className="grid grid-cols-12 gap-4 px-4 py-3 items-center text-sm">
                  <div className="col-span-3 font-medium">{pg.title}</div>
                  <div className="col-span-3 text-gray-600">{pg.slug}</div>
                  <div className="col-span-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${pg.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {pg.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => toggleActive(pg)}
                      className={`p-2 rounded-md focus:outline-none focus:ring-2 cursor-pointer ${pg.is_active
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:ring-gray-200'
                        : 'text-green-600 hover:text-green-800 hover:bg-green-50 focus:ring-green-200'
                      }`}
                      title={pg.is_active ? 'Deactivate page' : 'Activate page'}
                      aria-label={pg.is_active ? 'Deactivate page' : 'Activate page'}
                    >
                      {pg.is_active ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5v9a2.25 2.25 0 002.25 2.25h6a2.25 2.25 0 002.25-2.25v-9M9 7.5V6.75A2.25 2.25 0 0111.25 4.5h1.5A2.25 2.25 0 0115 6.75V7.5" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(pg)}
                      className="p-2 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                      title="Edit page"
                      aria-label="Edit page"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687 1.687m-2.496-.79l-8.74 8.74a2.25 2.25 0 00-.57.99l-.53 2.122a.75.75 0 00.91.91l2.122-.53a2.25 2.25 0 00.99-.57l8.74-8.74m-2.496-.79l2.496.79M16.862 4.487a1.875 1.875 0 112.652 2.652" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(pg.id)}
                      className="p-2 rounded-md text-red-600 hover:text-red-800 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 cursor-pointer"
                      title="Delete page"
                      aria-label="Delete page"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M9 3a1 1 0 0 0-1 1v1H4.5a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5H16V4a1 1 0 0 0-1-1H9z" />
                        <path d="M6.5 7h11l-.84 11.2A2 2 0 0 1 14.67 20H9.33a2 2 0 0 1-1.99-1.8L6.5 7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {showForm && (
          <PageForm
            onClose={() => { setShowForm(false); setEditing(null); }}
            onSaved={async () => {
              setShowForm(false); 
              setEditing(null); 
              await refresh(); 
              await syncPagesAndRoutes();
            }}
            editing={editing}
          />
        )}
      </div>
    </AdminLayout>
  );
}

function PageForm({ onClose, onSaved, editing }) {
  const [form, setForm] = useState({
    title: '',
    slug: '',
    hero_title: '',
    hero_subtitle: '',
    hero_image_url: '',
    content_html: '',
    content_css: '',
    content_js: '',
    is_active: true,
    display_order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [navOptions, setNavOptions] = useState([]);
  const [useNavDropdown, setUseNavDropdown] = useState(true);
  const [navLoading, setNavLoading] = useState(true);
  const [routeCheck, setRouteCheck] = useState({ checking: false, staticExists: false, cmsExists: false, conflict: false, message: '' });
  const [navConflicts, setNavConflicts] = useState({});
  const [activeTab, setActiveTab] = useState('html');
  const [leftPanePct, setLeftPanePct] = useState(60);
  const [dragging, setDragging] = useState(false);
  const [editorMode, setEditorMode] = useState('visual'); // 'visual' | 'advanced'

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title || '',
        slug: editing.slug || '',
        hero_title: editing.hero_title || '',
        hero_subtitle: editing.hero_subtitle || '',
        hero_image_url: editing.hero_image_url || '',
        content_html: safeExtractHtml(editing?.content_json),
        content_css: safeExtractCss(editing?.content_json),
        content_js: safeExtractJs(editing?.content_json),
        is_active: editing.is_active !== false,
        display_order: editing.display_order ?? 0,
      });
      setUseNavDropdown(true);
    }
  }, [editing]);

  useEffect(() => {
    let mounted = true;
    async function loadNav() {
      setNavLoading(true);
      try {
        const res = await fetch('/api/adm/navigation');
        const items = res.ok ? (await res.json()) : [];
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
        const options = items
          .filter(it => (it.link && it.link.trim() !== '') && (it.is_active !== false))
          .map(it => ({ value: it.link, label: `${labelFor(it)} — ${it.link}` }));
        if (mounted) setNavOptions(options);

        try {
          const pagesRes = await fetch('/api/adm/pages');
          const pagesData = pagesRes.ok ? await pagesRes.json() : [];
          const cmsSlugs = new Set(
            (Array.isArray(pagesData) ? pagesData : [])
              .map(p => ensureLeadingSlash(p.slug || ''))
              .filter(Boolean)
          );

          const checks = await Promise.all(options.map(async (opt) => {
            const slug = opt.value.startsWith('/') ? opt.value : '/' + opt.value;
            const normalizedSlug = ensureLeadingSlash(slug);

            let staticExists = false;
            try {
              const r = await fetch(normalizedSlug, { headers: { 'x-skip-cms': '1' }, cache: 'no-store' });
              const isCms = r.headers?.get?.('x-cms-page') === '1';
              staticExists = r.ok && !isCms;
            } catch {}

            let cmsExists = cmsSlugs.has(normalizedSlug);
            if (editing && normalizedSlug === ensureLeadingSlash(editing.slug)) {
              cmsExists = false;
            }

            const conflict = staticExists || cmsExists;
            const message = staticExists
              ? 'Static page exists at this path'
              : (cmsExists ? 'CMS page exists at this path' : '');
            return [opt.value, { staticExists, cmsExists, conflict, message }];
          }));
          if (mounted) setNavConflicts(Object.fromEntries(checks));
        } catch (e) {
          if (mounted) setNavConflicts({});
        }
      } catch (e) {
        console.error('Load navigation for page form failed', e);
        if (mounted) setNavOptions([]);
      } finally {
        if (mounted) setNavLoading(false);
      }
    }
    loadNav();
    return () => { mounted = false; };
  }, []);

  const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const ensurePrettierLoaded = async () => {
    if (typeof window === 'undefined') return null;
    if (window.prettier && window.prettierPlugins) return window.prettier;
    const loadScript = (src) => new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    try {
      await loadScript('/vendor/prettier/standalone.js');
      await loadScript('/vendor/prettier/parser-html.js');
      await loadScript('/vendor/prettier/parser-postcss.js');
      await loadScript('/vendor/prettier/parser-babel.js');
      return window.prettier;
    } catch (e) {
      console.warn('Prettier load failed', e);
      return null;
    }
  };

  const formatWithPrettier = async (lang, code) => {
    const prettier = await ensurePrettierLoaded();
    if (!prettier || !window.prettierPlugins) return code;
    try {
      const parser = lang === 'html' ? 'html' : (lang === 'css' ? 'css' : 'babel');
      return prettier.format(code || '', { parser, plugins: window.prettierPlugins });
    } catch (e) {
      console.warn('Prettier format failed', e);
      return code;
    }
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging) return;
      const container = document.getElementById('cms-editor-split');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftPanePct(Math.max(30, Math.min(75, pct)));
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging]);

  const ensureLeadingSlash = (s) => {
    if (!s) return s;
    return s.startsWith('/') ? s : '/' + s;
  };

  useEffect(() => {
    let cancelled = false;
    async function check() {
      const slug = ensureLeadingSlash((form.slug || '').trim());
      if (!slug) {
        if (!cancelled) setRouteCheck({ checking: false, staticExists: false, cmsExists: false, conflict: false, message: '' });
        return;
      }
      if (!cancelled) setRouteCheck(prev => ({ ...prev, checking: true }));
      try {
        let staticExists = false;
        try {
          const res = await fetch(slug, { headers: { 'x-skip-cms': '1' }, cache: 'no-store' });
          const isCms = res.headers?.get?.('x-cms-page') === '1';
          staticExists = res.ok && !isCms && slug !== ensureLeadingSlash(editing?.slug || '');
        } catch {}

        let cmsExists = false;
        try {
          const pathNoSlash = slug.replace(/^\//, '');
          const res2 = await fetch(`/api/pages/${pathNoSlash}`, { headers: { 'x-cms-check': '1' }, cache: 'no-store' });
          cmsExists = res2.ok;
        } catch {}

        let conflict = false;
        let message = '';
        if (staticExists) {
          conflict = true;
          message = 'A static page already exists at this path. Pick another navigation link or use a different path.';
        } else if (cmsExists && (!editing || (editing && ensureLeadingSlash(editing.slug) !== slug))) {
          conflict = true;
          message = 'A CMS page already exists at this path. Choose a different link/path.';
        }

        if (!cancelled) setRouteCheck({ checking: false, staticExists, cmsExists, conflict, message });
      } catch (e) {
        if (!cancelled) setRouteCheck({ checking: false, staticExists: false, cmsExists: false, conflict: false, message: '' });
      }
    }
    const t = setTimeout(check, 300);
    return () => { cancelled = true; clearTimeout(t); };
  }, [form.slug, editing]);

  const previewDoc = useMemo(
    () => buildPreviewDoc(form.content_html, form.content_css, form.content_js),
    [form.content_html, form.content_css, form.content_js]
  );

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: ensureLeadingSlash(form.slug.trim()),
        content_json: {
          html: form.content_html || '',
          css: form.content_css || '',
          js: form.content_js || '',
        },
      };
      delete payload.content_html;
      delete payload.content_css;
      delete payload.content_js;
      const url = editing ? `/api/adm/pages/${editing.id}` : '/api/adm/pages';
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl h-[92vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">{editing ? 'Edit Page' : 'Create Page'}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✕</button>
        </div>
        <form onSubmit={save} className="p-6 space-y-5 flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input value={form.title} onChange={(e) => updateField('title', e.target.value)} required className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Path</label>
                <label className="text-xs text-gray-600 flex items-center gap-2">
                  <input type="checkbox" className="mr-1" checked={useNavDropdown} onChange={(e) => setUseNavDropdown(e.target.checked)} />
                  Pick from navigation
                </label>
              </div>
              {useNavDropdown ? (
                <select
                  className="mt-1 w-full border rounded px-3 py-2"
                  value={form.slug || ''}
                  onChange={(e) => updateField('slug', e.target.value)}
                >
                  <option value="">{navLoading ? 'Loading navigation…' : 'Select a navigation link'}</option>
                  {navOptions.map(opt => {
                    const info = navConflicts[opt.value] || {};
                    const disabled = !!info.conflict;
                    const label = disabled ? `${opt.label} — (${info.message || 'already exists'})` : opt.label;
                    return (
                      <option key={opt.value} value={opt.value} disabled={disabled} title={info.message || ''}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <input value={form.slug} onChange={(e) => updateField('slug', e.target.value)} placeholder="/cabinet-secretariat/about" className="mt-1 w-full border rounded px-3 py-2" />
              )}
              <p className="text-xs text-gray-500 mt-1">This page will be available at <code>&lt;slug&gt;</code>.</p>
              {form.slug ? (
                <p className="text-xs text-blue-700 mt-1">Preview URL: <code>{ensureLeadingSlash(form.slug)}</code></p>
              ) : null}
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <input id="is_active" type="checkbox" checked={form.is_active} onChange={(e) => updateField('is_active', e.target.checked)} />
              <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
            </div> 
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Page Code</h3>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditorMode('visual')}
                className={editorMode === 'visual' ? 'px-3 py-1.5 text-xs rounded border bg-white shadow-sm' : 'px-3 py-1.5 text-xs rounded border hover:bg-gray-50'}
              >
                Visual Editor (CKEditor)
              </button>
              <button
                type="button"
                onClick={() => setEditorMode('advanced')}
                className={editorMode === 'advanced' ? 'px-3 py-1.5 text-xs rounded border bg-white shadow-sm' : 'px-3 py-1.5 text-xs rounded border hover:bg-gray-50'}
              >
                Advanced (HTML/CSS/JS)
              </button>
            </div>

            {editorMode === 'visual' ? (
              <div className="mt-3 border rounded bg-white overflow-hidden shadow-sm">
                <div className="px-3 py-2 border-b bg-gray-50 flex items-center justify-between">
                  <div className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                    <span>Visual Rich Text Editor (CKEditor Classic)</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">100% Offline Ready</span>
                  </div>
                </div>

                <div className="p-3 bg-white">
                  <CKEditorCDN
                    value={form.content_html || ''}
                    onChange={(html) => setForm(prev => ({ ...prev, content_html: html }))}
                  />
                </div>
              </div>
            ) : (
              <div id="cms-editor-split" className="mt-3 h-[68vh] border rounded overflow-hidden bg-white flex">
                <div className="h-full flex flex-col" style={{ width: `${leftPanePct}%` }}>
                  <div className="flex items-center justify-between border-b bg-gray-50 px-2 h-10">
                    <div className="flex items-center gap-1">
                      {['html','css','js'].map(t => (
                        <button key={t} type="button" className={`px-3 py-1 text-xs rounded ${activeTab===t ? 'bg-white border shadow-sm' : 'hover:bg-gray-100'}`} onClick={() => setActiveTab(t)}>{t.toUpperCase()}</button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" className="px-2 py-0.5 text-xs border rounded bg-gray-100" onClick={async () => {
                        if (activeTab==='html') updateField('content_html', await formatWithPrettier('html', form.content_html||''));
                        if (activeTab==='css') updateField('content_css', await formatWithPrettier('css', form.content_css||''));
                        if (activeTab==='js') updateField('content_js', await formatWithPrettier('js', form.content_js||''));
                      }}>Format</button>
                    </div>
                  </div>
                  <div className="flex-1">
                    {activeTab==='html' && (
                      <MonacoEditor height="100%" language="html" value={form.content_html || ''} onChange={(v) => updateField('content_html', v || '')} options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }} />
                    )}
                    {activeTab==='css' && (
                      <MonacoEditor height="100%" language="css" value={form.content_css || ''} onChange={(v) => updateField('content_css', v || '')} options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }} />
                    )}
                    {activeTab==='js' && (
                      <MonacoEditor height="100%" language="javascript" value={form.content_js || ''} onChange={(v) => updateField('content_js', v || '')} options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }} />
                    )}
                  </div>
                </div>
                <div className="w-1.5 cursor-col-resize bg-gray-100 hover:bg-gray-200" onMouseDown={() => setDragging(true)} title="Drag to resize" />
                <div className="h-full flex-1 flex flex-col">
                  <div className="flex items-center justify-between border-b bg-gray-50 px-2 h-10">
                    <h4 className="text-xs font-medium">Live Preview</h4>
                  </div>
                  <div className="flex-1">
                    <iframe title="preview" className="w-full h-full bg-white" sandbox="allow-scripts allow-same-origin" srcDoc={previewDoc} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button disabled={saving || routeCheck.conflict || routeCheck.checking || !form.slug} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">{saving ? 'Saving...' : 'Save Page'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function safeExtractHtml(content_json) {
  try {
    if (!content_json) return '';
    const j = typeof content_json === 'string' ? JSON.parse(content_json) : content_json;
    return j?.html || '';
  } catch {
    return '';
  }
}

function safeExtractCss(content_json) {
  try {
    if (!content_json) return '';
    const j = typeof content_json === 'string' ? JSON.parse(content_json) : content_json;
    return j?.css || '';
  } catch {
    return '';
  }
}

function safeExtractJs(content_json) {
  try {
    if (!content_json) return '';
    const j = typeof content_json === 'string' ? JSON.parse(content_json) : content_json;
    return j?.js || '';
  } catch {
    return '';
  }
}

function buildPreviewDoc(html = '', css = '', js = '') {
  const sanitizeContent = (content) => {
    if (!content) return content;
    return content
      .replace(/https?:\/\/github\.com[^"'\s]*/gi, '')
      .replace(/MDJAdmin/gi, '')
      .replace(/https?:\/\/[^\s]*MDJ[^\s]*/gi, '');
  };

  const cleanHtml = sanitizeContent(html);
  const cleanCss = sanitizeContent(css);
  const cleanJs = sanitizeContent(js);

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { margin: 0; padding: 12px; box-sizing: border-box; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
      ${cleanCss}
    </style>
  </head>
  <body>
    ${cleanHtml}
    <script>
      try { ${cleanJs} } catch (e) { console.error('Preview script error:', e); }
    </script>
  </body>
</html>`;
}