import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function PageHeader({ pagePath }) {
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

  if (!cfg) return null;

  const textColor = cfg.text_color || '#ffffff';

  return (
    <section
      className="bg-[#123a6b] text-white px-4 hero-before"
      style={{
        background: `url('${cfg.background_url}') no-repeat center center`,
        backgroundSize: 'cover',
        paddingTop: '90px',
        paddingBottom: '90px',
        position: 'relative'
      }}
    >
      <div className="gi-container">
        {cfg.overlay ? (
          <div className="overlay" style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'linear-gradient(90deg, rgb(22, 47, 106) 20%, transparent 70%)'
          }} />
        ) : null}
        {cfg.breadcrumb_enabled ? (
          <p className="opacity-99 mb-4" style={{ position: 'relative', zIndex: 1, color: textColor }}>
            <a href="/" className="hover:underline" style={{ color: textColor }}>Home</a>
            {cfg.parent_label && cfg.parent_href ? (
              <>
                {' '}/{' '}
                <a href={cfg.parent_href} className="hover:underline" style={{ color: textColor }}>{cfg.parent_label}</a>
              </>
            ) : null}
          </p>
        ) : null}
        <h1 className="text-4xl font-bold" style={{ position: 'relative', zIndex: 1, color: textColor }}>{cfg.heading}</h1>
        {cfg.subheading ? (
          <p className="text-xl md:text-2xl opacity-90" style={{ position: 'relative', zIndex: 1, color: textColor }}>{cfg.subheading}</p>
        ) : null}
      </div>
    </section>
  );
}
