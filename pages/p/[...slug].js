import React from 'react';
import pool from '@/lib/db';
import TemplateRenderer from '@/components/templates/TemplateRenderer';

export async function getServerSideProps(context) {
  const slugArr = context.params.slug || [];
  const slug = '/' + slugArr.join('/');
  try {
    const [rows] = await pool.query(
      `SELECT p.*, t.template_key
       FROM pages p JOIN page_templates t ON t.id = p.template_id
       WHERE p.slug = ? AND p.is_active = TRUE
       LIMIT 1`,
      [slug]
    );
    if (!rows.length) {
      return { notFound: true };
    }
    const page = rows[0];
    try {
      if (page.tabs_json && typeof page.tabs_json === 'string') page.tabs_json = JSON.parse(page.tabs_json);
      if (page.content_json && typeof page.content_json === 'string') page.content_json = JSON.parse(page.content_json);
    } catch (e) {}
    // Ensure JSON-serializable props (convert Date objects)
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
  return <TemplateRenderer page={page} />;
}
