import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function FooterAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Section 1
  const [section1Link1Label, setSection1Link1Label] = useState('');
  const [section1Link1Url, setSection1Link1Url] = useState('');
  const [section1Link2Label, setSection1Link2Label] = useState('');
  const [section1Link2Url, setSection1Link2Url] = useState('');

  // Section 2
  const [section2Link1Label, setSection2Link1Label] = useState('');
  const [section2Link1Url, setSection2Link1Url] = useState('');
  const [section2Link2Label, setSection2Link2Label] = useState('');
  const [section2Link2Url, setSection2Link2Url] = useState('');

  // Section 3
  const [section3Link1Label, setSection3Link1Label] = useState('');
  const [section3Link1Url, setSection3Link1Url] = useState('');
  const [section3Link2Label, setSection3Link2Label] = useState('');
  const [section3Link2Url, setSection3Link2Url] = useState('');

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
      const response = await fetch('/api/admin/footer');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          const sections = Array.isArray(data.sections) ? data.sections : [];
          const s1 = sections[0] || {};
          const s2 = sections[1] || {};
          const s3 = sections[2] || {};

          const s1Links = Array.isArray(s1.links) ? s1.links : [];
          const s2Links = Array.isArray(s2.links) ? s2.links : [];
          const s3Links = Array.isArray(s3.links) ? s3.links : [];

          setSection1Link1Label(s1Links[0]?.label || 'Archives');
          setSection1Link1Url(s1Links[0]?.url || '#');
          setSection1Link2Label(s1Links[1]?.label || 'Sitemap');
          setSection1Link2Url(s1Links[1]?.url || '#');

          setSection2Link1Label(s2Links[0]?.label || 'Website Policies');
          setSection2Link1Url(s2Links[0]?.url || '#');
          setSection2Link2Label(s2Links[1]?.label || 'Help');
          setSection2Link2Url(s2Links[1]?.url || '#');

          setSection3Link1Label(s3Links[0]?.label || 'Related Links');
          setSection3Link1Url(s3Links[0]?.url || '#');
          setSection3Link2Label(s3Links[1]?.label || 'Contact Us');
          setSection3Link2Url(s3Links[1]?.url || '#');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const sections = [
        {
          title: 'USEFUL LINKS',
          links: [
            { label: section1Link1Label, url: section1Link1Url },
            { label: section1Link2Label, url: section1Link2Url },
          ],
        },
        {
          title: 'Website Policies',
          links: [
            { label: section2Link1Label, url: section2Link1Url },
            { label: section2Link2Label, url: section2Link2Url },
          ],
        },
        {
          title: 'Related Links',
          links: [
            { label: section3Link1Label, url: section3Link1Url },
            { label: section3Link2Label, url: section3Link2Url },
          ],
        },
      ];

      const socialLinks = {
        twitter: twitterUrl,
        youtube: youtubeUrl,
        facebook: facebookUrl,
        instagram: instagramUrl,
      };

      const response = await fetch('/api/admin/footer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sections,
          social_links: socialLinks,
          copyright,
        }),
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
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900">Footer Management</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Section 1 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Section 1
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link 1 Label
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm mb-2"
                    value={section1Link1Label}
                    onChange={(e) => setSection1Link1Label(e.target.value)}
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link 1 URL
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={section1Link1Url}
                    onChange={(e) => setSection1Link1Url(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link 2 Label
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm mb-2"
                    value={section1Link2Label}
                    onChange={(e) => setSection1Link2Label(e.target.value)}
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link 2 URL
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={section1Link2Url}
                    onChange={(e) => setSection1Link2Url(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Section 2
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link 1 Label
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm mb-2"
                    value={section2Link1Label}
                    onChange={(e) => setSection2Link1Label(e.target.value)}
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link 1 URL
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={section2Link1Url}
                    onChange={(e) => setSection2Link1Url(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link 2 Label
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm mb-2"
                    value={section2Link2Label}
                    onChange={(e) => setSection2Link2Label(e.target.value)}
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link 2 URL
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={section2Link2Url}
                    onChange={(e) => setSection2Link2Url(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Section 3
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link 1 Label
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm mb-2"
                    value={section3Link1Label}
                    onChange={(e) => setSection3Link1Label(e.target.value)}
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link 1 URL
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={section3Link1Url}
                    onChange={(e) => setSection3Link1Url(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link 2 Label
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm mb-2"
                    value={section3Link2Label}
                    onChange={(e) => setSection3Link2Label(e.target.value)}
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link 2 URL
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={section3Link2Url}
                    onChange={(e) => setSection3Link2Url(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Social links */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Social Media Links
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter URL
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    placeholder="https://x.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Copyright
              </h2>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text
              </label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={copyright}
                onChange={(e) => setCopyright(e.target.value)}
                placeholder="© 2024 Cabinet Secretariat, Government of India"
              />
            </div>
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

// Footer admin page implementation here
