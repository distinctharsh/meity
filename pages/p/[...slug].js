import React from 'react';
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
  const noScope = page?.content_json?.no_scope === true;

  const safeHtml = rawHtml.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');

  const scopeSelectors = (cssText, scope) => {
    if (!cssText) return '';
    const scopedMedia = cssText.replace(/@media[^{}]+{([\s\S]*?)}/g, (full, inner) => {
      const innerScoped = scopeSelectors(inner, scope);
      return full.replace(inner, innerScoped);
    });
    return scopedMedia.replace(/(^|})([^@}][^{]+){/g, (match, brace, selectorPart) => {
      const scopedSel = selectorPart
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => (s.startsWith('@') || s.length === 0 ? s : `${scope} ${s}`))
        .join(', ');
      return `${brace}${scopedSel}{`;
    });
  };

  const scopedCss = noScope ? rawCss : scopeSelectors(rawCss, '.cms-content');

  React.useEffect(() => {
    const id = 'cms-inline-js';
    const prev = document.getElementById(id);
    if (prev) prev.remove();
    if (rawJs && typeof window !== 'undefined') {
      const s = document.createElement('script');
      s.id = id;
      s.type = 'text/javascript';
      s.defer = false;
      s.textContent = rawJs;
      document.body.appendChild(s);
    }
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [rawJs]);

  return (
    <main id="main">
      <PageHeader pagePath={page?.slug} />
      {scopedCss ? <style dangerouslySetInnerHTML={{ __html: scopedCss }} /> : null}
      <div className="gi-container" suppressHydrationWarning>
        <div className="cms-content" dangerouslySetInnerHTML={{ __html: safeHtml }} suppressHydrationWarning />
      </div>
      <Footer />
    </main>
  );
}
