import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { t } from '@/lib/translations';

// Helper: title-case from slug/segment (used only as last resort for English if needed)
function toTitleCase(str = '') {
  return str
    .replace(/[-_/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function PageHeader({ pagePath, fallbackHeading, fallbackSubheading, fallbackBackgroundUrl, breadcrumbPath: externalBreadcrumb = [] }) {
  const router = useRouter();
  const effectivePath = pagePath || router?.pathname || '';
  const [cfg, setCfg] = useState(null);
  const [autoBreadcrumbPath, setAutoBreadcrumbPath] = useState([]);
  const [loading, setLoading] = useState(true);

  const breadcrumbPath =
    externalBreadcrumb.length > 0
      ? externalBreadcrumb
      : autoBreadcrumbPath;

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        if (!effectivePath) return;
        
        // Load header config from respective language API/DB
        const res = await fetch(`/api/page-header?path=${encodeURIComponent(effectivePath)}`);
        const data = res.ok ? await res.json() : null;
        if (mounted) setCfg(data);

        let resolvedPath = [];

        // Fetch navigation items for breadcrumb from the active DB
        try {
          const navRes = await fetch('/api/navigation');
          if (navRes.ok) {
            const nav = await navRes.json();

            const navMap = new Map();
            const buildNavMap = (nodes) => {
              for (const n of nodes || []) {
                const linkVal = n.href || n.link || '';
                if (linkVal) {
                  navMap.set(linkVal, n);
                  navMap.set(linkVal.replace(/^\//, ''), n);
                }
                if (n.children && n.children.length) {
                  buildNavMap(n.children);
                }
              }
            };
            buildNavMap(nav);

            const currentItem = navMap.get(effectivePath) || navMap.get(effectivePath.replace(/^\//, ''));

            const buildBreadcrumb = (node, path = []) => {
              if (!node) return path;
              // Yeh database se aane wala name hai (Hindi DB hoga toh Hindi naam aayega!)
              const name = node.text || node.name || node.label || node.title || '';
              path.unshift({ name, href: node.href || node.link });

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
              resolvedPath = buildBreadcrumb(currentItem);
            }
          }
        } catch (e2) {
          console.error('Nav fetch error', e2);
        }

        // FALLBACK: Agar DB/Nav me match na mile, tabhi URL segments use honge
        if (resolvedPath.length === 0) {
          const segments = effectivePath.split('/').filter(Boolean);
          let accumulatedPath = '';
          resolvedPath = segments.map((seg) => {
            accumulatedPath += `/${seg}`;
            // Yahan hum translation file ya t() function ka use kar sakte hain agar segment match ho
            // Jaise agar segment 'policies' hai, toh t('policies') check karega
            const translationKey = seg.replace(/-/g, '_');
            const translatedName = t(translationKey) !== translationKey ? t(translationKey) : toTitleCase(seg);

            return {
              name: translatedName,
              href: accumulatedPath,
            };
          });
        }

        if (mounted) {
          setAutoBreadcrumbPath(resolvedPath);
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

      subheading: base.subheading || fallbackSubheading || '',
      background_url: base.background_url || fallbackBackgroundUrl || '/images/headers/about-default.jpg',
      overlay: base.overlay !== undefined ? base.overlay : true,
      breadcrumb_enabled: base.breadcrumb_enabled !== undefined ? base.breadcrumb_enabled : true,
      text_color: base.text_color || '#ffffff',
      parent_label: base.parent_label || null,
      parent_href: base.parent_href || null
    };

  }, [cfg, loading, fallbackHeading, fallbackSubheading, fallbackBackgroundUrl, effectivePath, breadcrumbPath]);

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
          </p>
        ) : null}
        {final.heading ? (
          <h1 className="text-4xl font-bold" style={{ position: 'relative', zIndex: 1, color: textColor }}>
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