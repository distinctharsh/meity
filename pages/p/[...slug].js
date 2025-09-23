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
    // Fetch attached components
    const [pcRows] = await pool.query(
      `SELECT pc.*, cc.name as component_name, cc.component_key
       FROM page_components pc
       JOIN component_catalog cc ON cc.id = pc.component_id
       WHERE pc.page_id = ? AND pc.is_active = TRUE
       ORDER BY pc.display_order ASC, pc.created_at ASC`,
      [page.id]
    );
    const pageComponents = pcRows.map((r) => {
      const item = { ...r };
      try { if (item.props_json && typeof item.props_json === 'string') item.props_json = JSON.parse(item.props_json); } catch {}
      return item;
    });
    // Ensure JSON-serializable props (convert Date objects)
    const serializable = { ...page };
    ['created_at', 'updated_at'].forEach((k) => {
      if (serializable[k] instanceof Date) serializable[k] = serializable[k].toISOString();
    });
    const blocks = pageComponents.map((c) => {
      const s = { ...c };
      ['created_at', 'updated_at'].forEach((k) => { if (s[k] instanceof Date) s[k] = s[k].toISOString(); });
      return s;
    });
    return { props: { page: serializable, blocks } };
  } catch (err) {
    console.error('SSR page fetch error', err);
    return { notFound: true };
  }
}

export default function DynamicPage({ page, blocks }) {
  return <TemplateRenderer page={page} blocks={blocks} />;
}
