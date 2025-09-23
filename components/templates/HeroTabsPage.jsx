import React, { useState } from 'react';

export default function HeroTabsPage({ page }) {
  const tabs = Array.isArray(page?.tabs_json) ? page.tabs_json : [];
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[#0e2a5a] text-white">
        <div className="px-[7%] py-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">{page.hero_title || page.title}</h1>
            {page.hero_subtitle && (
              <p className="text-white/90 text-lg">{page.hero_subtitle}</p>
            )}
          </div>
          {page.hero_image_url && (
            <div className="w-full md:w-[420px]">
              <img src={page.hero_image_url} alt={page.title} className="w-full h-auto rounded shadow" />
            </div>
          )}
        </div>
      </section>

      {/* Tabs */}
      {tabs.length > 0 && (
        <section className="px-[7%] py-8">
          <div className="border-b border-gray-200 flex flex-wrap gap-2">
            {tabs.map((t, idx) => (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className={`px-4 py-2 text-sm font-semibold border-b-4 transition-colors ${
                  active === idx ? 'border-[#162f6a] text-[#162f6a]' : 'border-transparent text-gray-600 hover:text-[#162f6a]'
                }`}
              >
                {t.label || `Tab ${idx + 1}`}
              </button>
            ))}
          </div>
          <div className="mt-6">
            {tabs.map((t, idx) => (
              <div key={idx} className={active === idx ? 'block' : 'hidden'}>
                {t.content ? (
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: t.content }} />
                ) : (
                  <p className="text-gray-600">No content.</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
