import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { fetchWithCacheBusting } from '@/utils/api';

export default function SubNavTabs({ pagePath }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const effectivePath = pagePath || router?.pathname || '';
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        if (!effectivePath) return;
        // Always derive from main navigation (DB-driven)
        const navRes = await fetchWithCacheBusting('/api/navigation');
        if (navRes.ok) {
          const nav = await navRes.json();
          const derived = deriveFromNavigation(nav, effectivePath);
          if (mounted) setItems(derived);
        } else {
          if (mounted) setItems([]);
        }
      } catch (e) {
        console.error('SubNav load error', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [effectivePath]);

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
            isActive(it.href) ? (
              <span
                key={it.href || it.id}
                className={"text-white font-bold underline relative pl-3 dot-before"}
                style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800 }}
              >
                {it.label}
              </span>
            ) : (
              <Link
                key={it.href || it.id}
                href={it.href}
                className={"text-white/80 hover:text-white whitespace-nowrap"}
                style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 400 }}
              >
                {it.label}
              </Link>
            )
          ))}
        </div>
      </div>
    </section>
  );
}

function deriveFromNavigation(nav, path) {
  if (!Array.isArray(nav)) return [];
  const parts = (path || '').split('/').filter(Boolean);
  if (!parts.length) return [];
  const sectionPath = '/' + parts[0]; // e.g., '/media' from '/media/photos'

  // Flatten helper to ensure children are accessible
  const findByLink = (nodes, link) => {
    for (const n of nodes) {
      if ((n.link || n.href) === link) return n;
      if (n.children && n.children.length) {
        const f = findByLink(n.children, link);
        if (f) return f;
      }
    }
    return null;
  };

  // Prefer children of the section node
  const sectionNode = findByLink(nav, sectionPath);
  let children = sectionNode?.children || [];

  // If no children on section, try siblings of current page item
  if (!children.length) {
    const currentNode = findByLink(nav, path);
    if (currentNode) {
      // find parent
      const parentOf = (nodes, target, parent=null) => {
        for (const n of nodes) {
          if (n === target) return parent;
          if (n.children && n.children.length) {
            const p = parentOf(n.children, target, n);
            if (p) return p;
          }
        }
        return null;
      };
      const parent = parentOf(nav, currentNode, null);
      children = parent?.children || [];
    }
  }

  const tabs = (children || [])
    .filter((c) => (c.is_active !== false))
    .map((c) => {
      const href = c.link || c.href || '#';
      const raw = c.name || c.label || c.title || '';
      const label = raw && String(raw).trim().length ? raw : formatLabelFromHref(href);
      return { label, href };
    });
  return tabs;
}



function formatLabelFromHref(href) {
  if (!href || href === '#') return 'Item';
  try {
    const path = href.split('?')[0].split('#')[0];
    const segs = path.split('/').filter(Boolean);
    const last = segs[segs.length - 1] || '';
    if (!last) return 'Item';
    return last
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (m) => m.toUpperCase());
  } catch {
    return 'Item';
  }
}
