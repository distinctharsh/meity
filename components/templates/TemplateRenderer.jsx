import React from 'react';
import HeroTabsPage from './HeroTabsPage';

const registry = {
  hero_tabs: HeroTabsPage,
};

export default function TemplateRenderer({ page }) {
  const Comp = registry[page?.template_key] || (() => (
    <div className="px-[7%] py-10">
      <h1 className="text-3xl font-bold mb-2">{page?.title || 'Untitled Page'}</h1>
      <p className="text-gray-600">No renderer found for template: <code>{page?.template_key}</code></p>
    </div>
  ));
  return <Comp page={page} />;
}
