import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { t } from '@/lib/translations';

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
  const [breadcrumbPath, setBreadcrumbPath] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        if (!effectivePath) return;
        // Load header config
        const res = await fetch(`/api/page-header?path=${encodeURIComponent(effectivePath)}`);
        const data = res.ok ? await res.json() : null;
        if (mounted) setCfg(data);

        // Fetch navigation items for breadcrumb
        try {
          const navRes = await fetch('/api/navigation');
          if (navRes.ok) {
            const nav = await navRes.json();

            // Build flat map of navigation items
            const navMap = new Map();
            const buildNavMap = (nodes) => {
              for (const n of nodes || []) {
                navMap.set(n.href || n.link, n);
                if (n.children && n.children.length) {
                  buildNavMap(n.children);
                }
              }
            };
            buildNavMap(nav);

            // Find current navigation item
            const currentItem = navMap.get(effectivePath);

            // Build breadcrumb path by traversing parent_id
            const buildBreadcrumb = (node, path = []) => {
              if (!node) return path;
              // Use field priority for Hindi text support
              const name = node.text || node.name || node.label || node.title || '';
              path.unshift({ name, href: node.href || node.link });

              // Find parent by traversing the tree
              const findParent = (nodes, targetId, parent = null) => {
                for (const n of nodes || []) {
                  if (n.id === targetId) return parent;
                  if (n.children && n.children.length) {
                    const p = findParent(n.children, targetId, n);
                    if (p) return p;
                  }
                }
                return null;
              };

              const parent = findParent(nav, node.id);
              if (parent) {
                return buildBreadcrumb(parent, path);
              }
              return path;
            };

            if (currentItem) {
              const path = buildBreadcrumb(currentItem);
              if (mounted) setBreadcrumbPath(path);
            } else if (mounted) {
              setBreadcrumbPath([]);
            }
          } else if (mounted) {
            setBreadcrumbPath([]);
          }
        } catch (e2) {
          if (mounted) setBreadcrumbPath([]);
        }

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
                const parentOf = (nodes, target, parent = null) => {
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
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [effectivePath]);


  const final = useMemo(() => {
    const base = cfg || {};

    return {
      heading:
        base.heading ||
        (!loading ? fallbackHeading : '') ||
        (!loading
          ? (
            breadcrumbPath.length
              ? breadcrumbPath[breadcrumbPath.length - 1].name
              : toTitleCase(
                (effectivePath || '')
                  .split('/')
                  .filter(Boolean)
                  .slice(-1)[0] || ''
              )
          )
          : ''),

      subheading:
        base.subheading ||
        fallbackSubheading ||
        '',

      background_url:
        base.background_url ||
        fallbackBackgroundUrl ||
        '/images/headers/about-default.jpg',

      overlay:
        base.overlay !== undefined
          ? base.overlay
          : true,

      breadcrumb_enabled:
        base.breadcrumb_enabled !== undefined
          ? base.breadcrumb_enabled
          : true,

      text_color:
        base.text_color ||
        '#ffffff',

      // backend se ayega
      parent_label:
        base.parent_label || null,

      parent_href:
        base.parent_href || null
    };

  }, [
    cfg,
    loading,
    fallbackHeading,
    fallbackSubheading,
    fallbackBackgroundUrl,
    effectivePath,
    breadcrumbPath
  ]);

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
            {breadcrumbPath.length > 0 ? (
              <>
                <a href="/" className="hover:underline" style={{ color: textColor }}>{t('home')}</a>
                {breadcrumbPath.map((item, index) => (
                  <span key={index}>
                    <span style={{ color: textColor }}> / </span>
                    {item.href && item.href !== router.asPath ? (
                      <a href={item.href} className="hover:underline" style={{ color: textColor }}>
                        {item.name}
                      </a>
                    ) : (
                      <span style={{ color: textColor }}>{item.name}</span>
                    )}
                  </span>
                ))}
              </>
            ) : (
              <>
                <a href="/" className="hover:underline" style={{ color: textColor }}>{t('home')}</a>
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
              </>
            )}
          </p>
        ) : null}
        {final.heading ? (
          <h1
            className="text-4xl font-bold"
            style={{ position: 'relative', zIndex: 1, color: textColor }}
          >
            {final.heading}
          </h1>
        ) : null}
        {final.subheading ? (
          <p className="text-xl md:text-2xl opacity-90" style={{ position: 'relative', zIndex: 1, color: textColor }}>{final.subheading}</p>
        ) : null}
      </div>
    </section>
  );
}
