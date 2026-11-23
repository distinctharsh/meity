import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const MAX_SECTIONS = 6;
const MAX_LINKS = 10;

const emptyLink = () => ({ label: '', url: '' });
const emptySection = () => ({ title: '', links: [emptyLink()] });

const inputCls =
  'w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2';

export default function FooterAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [sections, setSections] = useState([emptySection()]);

  // Social links
  const [twitterUrl, setTwitterUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');

  const [copyright, setCopyright] = useState('');

  useEffect(() => {
    fetchFooter();
  }, []);

  const fetchFooter = async () => {
    try {
      const response = await fetch('/api/adm/footer');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          const raw = Array.isArray(data.sections) ? data.sections : [];
          const loaded = raw.map((s) => ({
            title: s?.title || '',
            links: (Array.isArray(s?.links) ? s.links : []).map((l) => ({
              label: l?.label || '',
              url: l?.url || ''
            }))
          }));
          setSections(loaded.length ? loaded : [emptySection()]);

          const social = data.social_links || {};
          setTwitterUrl(social.twitter || '');
          setYoutubeUrl(social.youtube || '');
          setFacebookUrl(social.facebook || '');
          setInstagramUrl(social.instagram || '');

          setCopyright(data.copyright || '');
        }
      }
    } catch (error) {
      console.error('Failed to fetch footer:', error);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Section / link helpers ----------
  const updateSection = (i, patch) =>
    setSections((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const updateLink = (i, j, field, value) =>
    setSections((prev) =>
      prev.map((s, idx) =>
        idx !== i
          ? s
          : { ...s, links: s.links.map((l, k) => (k === j ? { ...l, [field]: value } : l)) }
      )
    );

  const addLink = (i) =>
    setSections((prev) =>
      prev.map((s, idx) =>
        idx === i && s.links.length < MAX_LINKS
          ? { ...s, links: [...s.links, emptyLink()] }
          : s
      )
    );

  const removeLink = (i, j) =>
    setSections((prev) =>
      prev.map((s, idx) =>
        idx !== i ? s : { ...s, links: s.links.filter((_, k) => k !== j) }
      )
    );

  const addSection = () =>
    setSections((prev) => (prev.length < MAX_SECTIONS ? [...prev, emptySection()] : prev));

  const removeSection = (i) => {
    if (!confirm(`Remove Section ${i + 1}?`)) return;
    setSections((prev) => prev.filter((_, idx) => idx !== i));
  };

  const moveSection = (i, dir) =>
    setSections((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  // ---------- Save ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleaned = [];
    for (let i = 0; i < sections.length; i++) {
      const links = sections[i].links
        .map((l) => ({ label: l.label.trim(), url: l.url.trim() || '#' }))
        .filter((l) => l.label);

      if (links.length === 0) {
        alert(`Section ${i + 1} has no links. Add at least one link with a label, or remove the section.`);
        return;
      }
      cleaned.push({ title: sections[i].title.trim(), links });
    }

    if (cleaned.length === 0) {
      alert('Add at least one section.');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/adm/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: cleaned,
          social_links: {
            twitter: twitterUrl,
            youtube: youtubeUrl,
            facebook: facebookUrl,
            instagram: instagramUrl
          },
          copyright
        })
      });

      if (response.ok) {
        alert('Footer settings saved successfully!');
        fetchFooter();
      } else {
        const error = await response.json().catch(() => ({}));
        alert(error.message || 'Failed to save footer settings');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save footer settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900">Footer Management</h1>
          <p className="text-gray-600 mt-1">
            Manage footer sections, links, social media URLs and copyright text
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sections */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Sections ({sections.length}/{MAX_SECTIONS})
              </h2>
              <button
                type="button"
                onClick={addSection}
                disabled={sections.length >= MAX_SECTIONS}
                className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add Section
              </button>
            </div>

            {sections.map((section, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Section {i + 1}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveSection(i, -1)}
                      disabled={i === 0}
                      title="Move up"
                      className="w-8 h-8 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-40"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(i, 1)}
                      disabled={i === sections.length - 1}
                      title="Move down"
                      className="w-8 h-8 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-40"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSection(i)}
                      disabled={sections.length === 1}
                      className="px-3 h-8 rounded border border-red-200 bg-white text-red-600 text-sm hover:bg-red-50 disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    className={inputCls}
                    value={section.title}
                    onChange={(e) => updateSection(i, { title: e.target.value })}
                    placeholder="e.g. Useful Links"
                  />
                </div>

                <div className="space-y-3">
                  {section.links.map((link, j) => (
                    <div
                      key={j}
                      className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Link {j + 1} Label
                        </label>
                        <input
                          type="text"
                          className={inputCls}
                          value={link.label}
                          onChange={(e) => updateLink(i, j, 'label', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Link {j + 1} URL
                        </label>
                        <input
                          type="text"
                          className={inputCls}
                          value={link.url}
                          onChange={(e) => updateLink(i, j, 'url', e.target.value)}
                          placeholder="/page or https://..."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLink(i, j)}
                        disabled={section.links.length === 1}
                        title="Remove link"
                        className="h-10 px-3 rounded border border-red-200 bg-white text-red-600 text-sm hover:bg-red-50 disabled:opacity-40"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addLink(i)}
                  disabled={section.links.length >= MAX_LINKS}
                  className="px-3 py-1.5 rounded border border-blue-200 bg-white text-blue-700 text-sm hover:bg-blue-50 disabled:opacity-50"
                >
                  + Add Link
                </button>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Social Media Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
                <input
                  type="text"
                  className={inputCls}
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://x.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                <input
                  type="text"
                  className={inputCls}
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                <input
                  type="text"
                  className={inputCls}
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                <input
                  type="text"
                  className={inputCls}
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Copyright</h2>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <input
              type="text"
              className={inputCls}
              value={copyright}
              onChange={(e) => setCopyright(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Footer'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}