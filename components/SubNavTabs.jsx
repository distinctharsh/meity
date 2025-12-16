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

  const isActiveItem = (it) => {
    if (!it) return false;
    const href = it.href || '';
    // For documents, match by query param nav_item or nav
    if (href.startsWith('/documents')) {
      if (router.pathname === '/documents') {
        const qNavItem = router.query?.nav_item;
        const qNav = router.query?.nav;
        if (qNavItem && String(qNavItem) === String(it.id)) return true;
        if (qNav && decodeURIComponent(String(qNav)) === href) return true;
        // Also consider default path matching when no query present
        return router.asPath.split('?')[0] === '/documents' && !qNav && !qNavItem && href === '/documents';
      }
    }
    const h = String(href);
    const cur = String(router.asPath || '');
    return cur === h || cur.startsWith(h + '/');
  };

  if (loading) return null;
  if (!items.length) return null;
  return (
    <>
      <style>{`
        .dot-before::before {
          content: '';
          position: absolute;
          left: -8px;
          top: 5px;
          width: 12px;
          height: 28px;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='28' viewBox='0 0 12 28' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_1293_43610)'%3E%3Cpath d='M8.35593 3.06788C8.35593 4.07416 9.17168 4.88992 10.178 4.88992C11.1842 4.88992 12 4.07417 12 3.06788C12 2.0616 11.1842 1.24585 10.178 1.24585C9.17168 1.24585 8.35593 2.0616 8.35593 3.06788Z' fill='white'/%3E%3Cpath d='M8.35593 10.356C8.35593 11.3623 9.17168 12.178 10.178 12.178C11.1842 12.178 12 11.3623 12 10.356C12 9.34969 11.1842 8.53394 10.178 8.53394C9.17168 8.53394 8.35593 9.34969 8.35593 10.356Z' fill='white'/%3E%3Cpath d='M8.35593 17.6441C8.35593 18.6503 9.17168 19.4661 10.178 19.4661C11.1842 19.4661 12 18.6503 12 17.6441C12 16.6378 11.1842 15.822 10.178 15.822C9.17168 15.822 8.35593 16.6378 8.35593 17.6441Z' fill='white'/%3E%3Cpath d='M8.35593 24.9321C8.35593 25.9384 9.17168 26.7542 10.178 26.7542C11.1842 26.7542 12 25.9384 12 24.9321C12 23.9259 11.1842 23.1101 10.178 23.1101C9.17168 23.1101 8.35593 23.9259 8.35593 24.9321Z' fill='white'/%3E%3Cpath d='M1.06785 3.06788C1.06785 4.07416 1.8836 4.88992 2.88988 4.88992C3.89616 4.88992 4.71191 4.07417 4.71191 3.06788C4.71191 2.0616 3.89616 1.24585 2.88988 1.24585C1.8836 1.24585 1.06785 2.0616 1.06785 3.06788Z' fill='white'/%3E%3Cpath d='M1.06785 10.356C1.06785 11.3623 1.8836 12.178 2.88988 12.178C3.89616 12.178 4.71191 11.3623 4.71191 10.356C4.71191 9.34969 3.89616 8.53394 2.88988 8.53394C1.8836 8.53394 1.06785 9.34969 1.06785 10.356Z' fill='white'/%3E%3Cpath d='M1.06785 17.6441C1.06785 18.6503 1.8836 19.4661 2.88988 19.4661C3.89616 19.4661 4.71191 18.6503 4.71191 17.6441C4.71191 16.6378 3.89616 15.822 2.88988 15.822C1.8836 15.822 1.06785 16.6378 1.06785 17.6441Z' fill='white'/%3E%3Cpath d='M1.06785 24.9321C1.06785 25.9384 1.8836 26.7542 2.88988 26.7542C3.89616 26.7542 4.71191 25.9384 4.71191 24.9321C4.71191 23.9259 3.89616 23.1101 2.88988 23.1101C1.8836 23.1101 1.06785 23.9259 1.06785 24.9321Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_1293_43610'%3E%3Crect width='27' height='12' fill='white' transform='translate(12 0.5) rotate(90)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E");
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }
      `}</style>
      <section className="bg-white" style={{ marginTop: '-10px', position: 'absolute', width: '100%' }}>
        <div className="gi-container">
          <div className="bg-[#162f6a] rounded-xl px-6 py-4 flex items-center space-x-6 overflow-x-auto" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
            {items.map((it) => {
              // Build a single documents page link when item belongs to /documents
              let displayHref = it.href;
              if (it.href && String(it.href).startsWith('/documents')) {
                if (it.id) {
                  displayHref = `/documents?nav_item=${encodeURIComponent(String(it.id))}`;
                } else {
                  displayHref = `/documents?nav=${encodeURIComponent(String(it.href))}`;
                }
              }
              return isActiveItem(it) ? (
                <span
                  key={displayHref || it.id}
                  className={"text-white font-bold underline relative pl-3 dot-before"}
                  style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800 }}
                >
                  {it.label}
                </span>
              ) : (
                <Link
                  key={displayHref || it.id}
                  href={displayHref}
                  className={"text-white/80 hover:text-white whitespace-nowrap"}
                  style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 400 }}
                >
                  {it.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
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
      const parentOf = (nodes, target, parent = null) => {
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
      return { label, href, id: c.id };
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
