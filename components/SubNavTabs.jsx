import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { fetchWithCacheBusting } from '@/utils/api';

export default function SubNavTabs({ pagePath }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetchWithCacheBusting(`/api/subnav?path=${encodeURIComponent(pagePath)}`);
        const data = res.ok ? await res.json() : [];
        if (mounted) setItems(data);
      } catch (e) {
        console.error('SubNav load error', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [pagePath]);

  const isActive = (href) => {
    if (!href) return false;
    return router.asPath === href || router.asPath.startsWith(href + '/');
  };

  if (loading) return null;
  if (!items.length) return null;

  return (
    <section className="bg-white" style={{ marginTop: '-10px', position: 'absolute', width: '100%' }}>
      <div className="gi-container">
        <div className="bg-[#162f6a] rounded-xl px-6 py-4 flex items-center space-x-6 overflow-x-auto" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
          {items.map((it) => (
            <Link key={it.id} href={it.href} className={`${isActive(it.href) ? 'text-white font-bold underline relative pl-3 dot-before' : 'text-white/80 hover:text-white whitespace-nowrap'}`} style={{ color: '#fff', fontSize: isActive(it.href) ? '1.3rem' : '1.3rem', fontWeight: isActive(it.href) ? 800 : 400 }}>
              {it.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
