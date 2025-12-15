import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    // Find Documents parent node by link or name
    const [parents] = await pool.query("SELECT id FROM navigation_items WHERE (link = '/documents' OR name = 'Documents') LIMIT 1");
    const parentId = parents && parents.length ? parents[0].id : null;

    // Get candidate nav items: children of Documents (or top-level items with /documents prefix)
    let navRows = [];
    if (parentId) {
      const [children] = await pool.query('SELECT id, name, link FROM navigation_items WHERE parent_id = ? AND is_active = 1 ORDER BY display_order ASC', [parentId]);
      navRows = children || [];
    } else {
      // Fallback: any nav items whose link starts with /documents
      const [rows] = await pool.query("SELECT id, name, link FROM navigation_items WHERE is_active = 1 AND link LIKE '/documents/%' ORDER BY display_order ASC");
      navRows = rows || [];
    }

    const out = [];
    for (const n of navRows) {
      const link = n.link || '';
      if (!link) continue;

      // Decide how to check for documents under this link.
      // If the link path contains '/reports', check reports table.
      let hasDocs = false;
      try {
        if (link.includes('/reports')) {
          const [r] = await pool.query('SELECT COUNT(*) as cnt FROM reports WHERE is_active = 1');
          hasDocs = (r && r[0] && r[0].cnt > 0);
        } else {
          // Check recent_docs rows that link to this path (prefix match)
          const [r2] = await pool.query('SELECT COUNT(*) as cnt FROM recent_docs WHERE is_active = 1 AND (link_url = ? OR link_url LIKE CONCAT(?, "%"))', [link, link]);
          hasDocs = (r2 && r2[0] && r2[0].cnt > 0);
        }
      } catch (e) {
        // ignore per-item errors
      }
      if (hasDocs) out.push({ label: n.name, link });
    }

    return res.status(200).json(out);
  } catch (e) {
    console.error('Recent doc links error', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
