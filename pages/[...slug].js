import React, { useEffect, useState } from 'react';
import pool from '@/lib/db';
import PageHeader from '@/components/PageHeader';
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
  return (
    <main id="main">
      {/* Attach dynamic Page Header if configured for this page path */}
      <PageHeader pagePath={page?.slug} />
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
