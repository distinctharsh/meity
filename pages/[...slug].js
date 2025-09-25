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
  const html = page?.content_json?.html || '';
  const css = page?.content_json?.css || '';
  return (
    <main id="main">
      {/* Attach dynamic Page Header if configured for this page path */}
      <PageHeader pagePath={page?.slug} />
      {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}
      <div className="gi-container">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <Footer />
    </main>
  );
}
