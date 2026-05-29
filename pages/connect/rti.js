import { useEffect, useState } from 'react';
import Head from 'next/head';
import Footer from "@/components/Footer";
import SubNavTabs from "@/components/SubNavTabs";
import PageHeader from "@/components/PageHeader";
import { t } from '@/lib/translations';

export default function RTIPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/rti');
        if (!res.ok) throw new Error('Failed to load RTI data');
        const json = await res.json();
        setData(json);
        // Auto-open first section if available
        if (json.sections && json.sections.length > 0) {
          setOpenSections({ [json.sections[0].id]: true });
        }
      } catch (e) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

const toggleSection = (id) => {
  setOpenSections((prev) => ({
    [id]: !prev[id]
  }));
};

  const content = data?.content;
  const sections = data?.sections || [];

  let bullets = [];
  try {
    if (content?.intro_bullets) {
      bullets = JSON.parse(content.intro_bullets);
    }
  } catch {
    bullets = [];
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{content?.page_title || 'RTI'} - Cabinet Secretariat</title>
      </Head>

      <main id="main">
        {/* Dynamic Page Header */}
        <PageHeader/>

        {/* Tabs (DB-driven for current route) */}
        <SubNavTabs/>

        {/* Main Content */}
        <section className="bg-white py-12">
          <div className="gi-container">
        {/* Intro Section */}
        <div className="mb-10">
          <span className='font-24-400'>{content?.title || t('rti')}</span>
          <h2 className="font-24-500 mb-3">
            {content?.intro_heading || 'Power and Duties of Officials'}
          </h2>
          {bullets.length > 0 && (
            <ul className="list-disc pl-5 space-y-1 font-16-400">
              {bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Accordion Sections */}
        <div className="space-y-3">
          {sections.map((section) => {
            const isOpen = !!openSections[section.id];
            return (
              <div
                key={section.id}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                <span
                  className={`text-[20px] text-[rgb(22,47,106)] font-["Noto_Sans"] ${
                    isOpen ? 'font-[700]' : 'font-[500]'
                  }`}
                >
                  {section.title}
                </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100">
                    {section.items && section.items.length > 0 ? (
                      <div className="p-5">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-[#a8c4ff]">
                                <th className="text-left px-4 py-2.5 font-semibold text-gray-800 text-xs uppercase tracking-wide">
                                  Title
                                </th>
                                <th className="text-left px-4 py-2.5 font-semibold text-gray-800 text-xs uppercase tracking-wide w-32">
                                  Type/Size
                                </th>
                                <th className="text-left px-4 py-2.5 font-semibold text-gray-800 text-xs uppercase tracking-wide w-24">
                                  Link
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {section.items.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 font-16-400">
                                    {item.title}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center font-12-600">
                                      <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                      </svg>
                                      {item.file_size || item.file_type || 'N/A'}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 ">
                                    {item.file_url ? (
                                      <a
                                        href={item.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200  transition-colors border border-gray-200 view-btn-all"
                                      >
                                        <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        VIEW
                                      </a>
                                    ) : (
                                      <span className="text-gray-400 text-xs">-</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="px-5 py-6 text-sm text-gray-500">
                        No documents available in this section.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {sections.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No sections available.
          </div>
        )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
