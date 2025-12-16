import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    // Optional query params:
    // - `nav` (path) to filter documents for a specific nav link (e.g. /documents/reports)
    // - `nav_item` (id) to filter by navigation_items.id directly
    const nav = req.query.nav ? String(req.query.nav).trim() : null;
    const navItemParam = req.query.nav_item ? String(req.query.nav_item).trim() : null;

    // If nav param provided, try to resolve it to navigation_items.id.
    // If `nav_item_id` column exists on reports, filter by it; otherwise fall back to comparing nav_link.
    const [cols] = await pool.query('SHOW COLUMNS FROM reports LIKE ?', ['nav_item_id']);
    const hasNavItem = Array.isArray(cols) && cols.length > 0;

    let params = [];
    let whereClause = 'WHERE r.is_active = TRUE';
    if (navItemParam) {
      const parsed = parseInt(navItemParam, 10);
      if (Number.isFinite(parsed) && parsed > 0) {
        if (hasNavItem) {
          whereClause += ' AND r.nav_item_id = ?';
          params.push(parsed);
        } else {
          // no nav_item column on reports; try to resolve id -> link and compare nav_link
          const [navRows] = await pool.query('SELECT link FROM navigation_items WHERE id = ? LIMIT 1', [parsed]);
          if (navRows && navRows.length) {
            whereClause += ' AND r.nav_link = ?';
            params.push(navRows[0].link);
          } else {
            whereClause += ' AND 0';
          }
        }
      }
    } else if (nav) {
      const norm = nav.split('?')[0];
      if (hasNavItem) {
        const [navRows] = await pool.query('SELECT id FROM navigation_items WHERE link = ? LIMIT 1', [norm]);
        if (navRows && navRows.length) {
          whereClause += ' AND r.nav_item_id = ?';
          params.push(navRows[0].id);
        } else {
          // if nav item not found, no rows should match
          whereClause += ' AND 0';
        }
      } else {
        whereClause += ' AND r.nav_link = ?';
        params.push(norm);
      }
    }

    const [rows] = await pool.query(
      `SELECT r.id, r.title, r.type, r.year, r.size, r.file_url,
              r.item_count,
              (SELECT COUNT(1) FROM report_files rf WHERE rf.report_id = r.id) AS files_count,
              (SELECT rf2.file_url FROM report_files rf2 WHERE rf2.report_id = r.id ORDER BY rf2.id ASC LIMIT 1) AS first_file_url
       FROM reports r
       ${whereClause}
       ORDER BY r.year DESC, r.display_order ASC, r.created_at DESC`,
      params
    );
    return res.status(200).json(rows);
  } catch (e) {
    console.error('Public reports list error', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
