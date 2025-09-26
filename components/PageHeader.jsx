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

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        if (!effectivePath) return;
        const res = await fetch(`/api/page-header?path=${encodeURIComponent(effectivePath)}`);
        const data = res.ok ? await res.json() : null;
        if (mounted) setCfg(data);
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
            {final.parent_label && final.parent_href ? (
              <>
                {' '}/{' '}
                <a href={final.parent_href} className="hover:underline" style={{ color: textColor }}>{final.parent_label}</a>
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
