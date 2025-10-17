import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

// Helper: title-case from slug/segment
function toTitleCase(str = '') {
  return str
    .replace(/[-_/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function PageHeader({ pagePath, fallbackHeading, fallbackSubheading, fallbackBackgroundUrl }) {
  const router = useRouter();
  const effectivePath = pagePath || router?.pathname || '';
  const [cfg, setCfg] = useState(null);
  const [parentTargetHref, setParentTargetHref] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        if (!effectivePath) return;
        // Load header config
        const res = await fetch(`/api/page-header?path=${encodeURIComponent(effectivePath)}`);
        const data = res.ok ? await res.json() : null;
        if (mounted) setCfg(data);

        // Derive breadcrumb target: use same logic as SubNavTabs to compute tabs, then pick the first tab href
        const parts = (effectivePath || '').split('/').filter(Boolean);
        if (parts.length > 0) {
          const sectionPath = `/${parts[0]}`;
          try {
            const navRes = await fetch('/api/navigation');
            if (navRes.ok) {
              const nav = await navRes.json();
              // Helpers copied to match SubNavTabs behavior
              const findByLink = (nodes, link) => {
                for (const n of nodes || []) {
                  if ((n.link || n.href) === link) return n;
                  if (n.children && n.children.length) {
                    const f = findByLink(n.children, link);
                    if (f) return f;
                  }
                }
                return null;
              };
              const sectionNode = findByLink(nav, sectionPath);
              let children = sectionNode?.children || [];
              if (!children.length) {
                const currentNode = findByLink(nav, effectivePath);
                const parentOf = (nodes, target, parent=null) => {
                  for (const n of nodes || []) {
                    if (n === target) return parent;
                    if (n.children && n.children.length) {
                      const p = parentOf(n.children, target, n);
                      if (p) return p;
                    }
                  }
                  return null;
                };
                const parent = currentNode ? parentOf(nav, currentNode, null) : null;
                children = parent?.children || [];
              }
              const firstTab = (children || []).find((c) => c && c.is_active !== false && (c.link || c.href));
              if (mounted) setParentTargetHref(firstTab ? (firstTab.link || firstTab.href) : null);
            } else if (mounted) {
              setParentTargetHref(null);
            }
          } catch (e2) {
            if (mounted) setParentTargetHref(null);
          }
        } else if (mounted) {
          setParentTargetHref(null);
        }
      } catch (e) {
        console.error('PageHeader load error', e);
      }
    }
    load();
    return () => { mounted = false; };
  }, [effectivePath]);

  // Compute derived breadcrumb info
  const crumbs = useMemo(() => {
    const parts = (effectivePath || '').split('/').filter(Boolean);
    if (parts.length <= 1) return null;
    const parent = `/${parts[0]}`;
    return { parent_label: toTitleCase(parts[0]), parent_href: parent };
  }, [effectivePath]);

  // Build final config with sensible defaults if API returned null
  const final = useMemo(() => {
    const base = cfg || {};
    return {
      heading: base.heading || fallbackHeading || toTitleCase((effectivePath || '').split('/').filter(Boolean).slice(-1)[0] || ''),
      subheading: base.subheading || fallbackSubheading || '',
      background_url: base.background_url || fallbackBackgroundUrl || '/images/headers/about-default.jpg',
      overlay: base.overlay !== undefined ? base.overlay : true,
      breadcrumb_enabled: base.breadcrumb_enabled !== undefined ? base.breadcrumb_enabled : true,
      text_color: base.text_color || '#ffffff',
      parent_label: base.parent_label || crumbs?.parent_label || null,
      parent_href: base.parent_href || crumbs?.parent_href || null,
    };
  }, [cfg, fallbackHeading, fallbackSubheading, fallbackBackgroundUrl, effectivePath, crumbs]);

  const textColor = final.text_color || '#ffffff';

  return (
    <section
      className="bg-[#123a6b] text-white px-4 hero-before"
      style={{
        background: final.background_url ? `url('${final.background_url}') no-repeat center center` : undefined,
        backgroundSize: 'cover',
        paddingTop: '90px',
        paddingBottom: '90px',
        position: 'relative'
      }}
    >
      <div className="gi-container">
        {final.overlay ? (
          <div className="overlay" style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'linear-gradient(90deg, rgb(22, 47, 106) 20%, transparent 70%)'
          }} />
        ) : null}
        {final.breadcrumb_enabled ? (
          <p className="opacity-99 mb-4" style={{ position: 'relative', zIndex: 1, color: textColor }}>
            <a href="/" className="hover:underline" style={{ color: textColor }}>Home</a>
            {final.parent_label ? (
              <>
                {' '}/{' '}
                {parentTargetHref && parentTargetHref !== router.asPath ? (
                  <a href={parentTargetHref} className="hover:underline" style={{ color: textColor }}>
                    {final.parent_label}
                  </a>
                ) : (
                  <span style={{ color: textColor }}>{final.parent_label}</span>
                )}
              </>
            ) : null}
          </p>
        ) : null}
        <h1 className="text-4xl font-bold" style={{ position: 'relative', zIndex: 1, color: textColor }}>{final.heading}</h1>
        {final.subheading ? (
          <p className="text-xl md:text-2xl opacity-90" style={{ position: 'relative', zIndex: 1, color: textColor }}>{final.subheading}</p>
        ) : null}
      </div>
    </section>
  );
}
