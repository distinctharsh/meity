import React, { useEffect, useState } from 'react';
import pool from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import SubNavTabs from '@/components/SubNavTabs';
import Footer from '@/components/Footer';

export async function getServerSideProps(context) {
  const slugArr = context.params.slug || [];
  const slug = '/' + slugArr.join('/');
  try {
    const [rows] = await pool.query(
      `SELECT p.*
       FROM pages p
       WHERE p.slug = ? AND p.is_active = TRUE
       LIMIT 1`,
      [slug]
    );
    if (!rows.length) {
      return { notFound: true };
    }
    const page = rows[0];
    try {
      if (page.content_json && typeof page.content_json === 'string') page.content_json = JSON.parse(page.content_json);
    } catch (e) {}
    const serializable = { ...page };
    ['created_at', 'updated_at'].forEach((k) => {
      if (serializable[k] instanceof Date) serializable[k] = serializable[k].toISOString();
    });
    // Mark this response as a CMS-rendered page for client-side route checks
    try { context.res.setHeader('x-cms-page', '1'); } catch {}
    return { props: { page: serializable } };
  } catch (err) {
    console.error('SSR page fetch error', err);
    return { notFound: true };
  }
}

export default function DynamicPage({ page }) {
  const rawHtml = page?.content_json?.html || '';
  const rawCss = page?.content_json?.css || '';
  const rawJs = page?.content_json?.js || '';
  // Strip any <script> tags from user-provided HTML for safety
  const safeHtml = rawHtml.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');

  // Naive CSS scoping: prefix selectors with .cms-content, including inside @media
  const scopeSelectors = (cssText, scope) => {
    if (!cssText) return '';
    // Handle @media blocks first
    const scopedMedia = cssText.replace(/@media[^{]+{([\s\S]*?)}/g, (full, inner) => {
      const innerScoped = scopeSelectors(inner, scope);
      return full.replace(inner, innerScoped);
    });
    // Now scope simple rules (not at-rules)
    return scopedMedia.replace(/(^|})([^@}][^{]+){/g, (match, brace, selectorPart) => {
      // Split multiple selectors
      const scopedSel = selectorPart
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          // Avoid scoping keyframes selectors etc.
          if (s.startsWith('@') || s.length === 0) return s;
          // If selector is html/body, still prefix to avoid global effects
          return `${scope} ${s}`;
        })
        .join(', ');
      return `${brace}${scopedSel}{`;
    });
  };

  const scopedCss = scopeSelectors(rawCss, '.cms-content');
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);

  // Base typography for CMS content so tags like <h1> look like headings
  const baseScopedCss = `
    .cms-content h1 { font-size: 2rem; line-height: 2.4rem; font-weight: 700; margin: 1rem 0 0.75rem; }
    .cms-content h2 { font-size: 1.5rem; line-height: 2rem; font-weight: 700; margin: 0.875rem 0 0.5rem; }
    .cms-content h3 { font-size: 1.25rem; line-height: 1.75rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
    .cms-content p { margin: 0.75rem 0; }
    .cms-content ul { list-style: disc; padding-left: 1.25rem; margin: 0.75rem 0; }
    .cms-content ol { list-style: decimal; padding-left: 1.25rem; margin: 0.75rem 0; }
    .cms-content a { color: #2563eb; text-decoration: underline; }
    .cms-content img { max-width: 100%; height: auto; }
    .cms-content table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    .cms-content th, .cms-content td { border: 1px solid #e5e7eb; padding: 0.5rem; text-align: left; }
    .cms-content code { background: #f3f4f6; padding: 0.1rem 0.3rem; border-radius: 4px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .cms-content pre { background: #111827; color: #f9fafb; padding: 0.75rem; border-radius: 6px; overflow: auto; }
  `;

  // Inject JS from content_json.js after hydration
  useEffect(() => {
    if (!hydrated) return;
    const id = 'cms-inline-js';
    const prev = document.getElementById(id);
    if (prev) prev.remove();
    if (rawJs && typeof window !== 'undefined') {
      const s = document.createElement('script');
      s.id = id;
      s.type = 'text/javascript';
      s.defer = false;
      // Wrap user-provided JS to avoid breaking the app on errors
      s.textContent = `try{\n${rawJs}\n}catch(e){console.error('CMS inline JS error:', e);}`;
      document.body.appendChild(s);
    }
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [hydrated, rawJs]);
  return (
    <main id="main">
      {/* Attach dynamic Page Header if configured for this page path */}
      <PageHeader pagePath={page?.slug} />
      {/* Sub navigation derived from main nav (like About page) */}
      <SubNavTabs pagePath={page?.slug} />
      <style dangerouslySetInnerHTML={{ __html: baseScopedCss }} />
      {scopedCss ? <style dangerouslySetInnerHTML={{ __html: scopedCss }} /> : null}
      <div className="gi-container" suppressHydrationWarning>
        {hydrated ? (
          <div className="cms-content" dangerouslySetInnerHTML={{ __html: safeHtml }} suppressHydrationWarning />
        ) : null}
      </div>
      <Footer />
    </main>
  );
}
