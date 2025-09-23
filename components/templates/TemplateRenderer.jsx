import React from 'react';
import HeroTabsPage from './HeroTabsPage';
import { getComponentByKey } from '@/components/componentRegistry';

const registry = {
  hero_tabs: HeroTabsPage,
};

export default function TemplateRenderer({ page, blocks = [] }) {
  const Comp = registry[page?.template_key] || (() => (
    <div className="px-[7%] py-10">
      <h1 className="text-3xl font-bold mb-2">{page?.title || 'Untitled Page'}</h1>
      <p className="text-gray-600">No renderer found for template: <code>{page?.template_key}</code></p>
    </div>
  ));
  return (
    <div>
      <Comp page={page} />
      {/* Render attached components */}
      {Array.isArray(blocks) && blocks.length > 0 && (
        <section className="px-[7%] py-8 space-y-8">
          {blocks.map((b) => {
            const K = getComponentByKey(b.component_key);
            if (!K) return (
              <div key={b.id || Math.random()} className="text-sm text-gray-500">
                Unknown component: <code>{b.component_key}</code>
              </div>
            );
            const props = (b.props_json && typeof b.props_json === 'object') ? b.props_json : {};
            return (
              <div key={b.id || Math.random()}>
                <K {...props} />
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
