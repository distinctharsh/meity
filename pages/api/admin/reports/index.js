import pool from '@/lib/db';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Detect whether `nav_item_id` and `nav_link` columns exist
      const [colsItem] = await pool.query('SHOW COLUMNS FROM reports LIKE ?', ['nav_item_id']);
      const [colsLink] = await pool.query('SHOW COLUMNS FROM reports LIKE ?', ['nav_link']);
      const hasNavItem = Array.isArray(colsItem) && colsItem.length > 0;
      const hasNavLink = Array.isArray(colsLink) && colsLink.length > 0;
      const selectCols = ['r.id', 'r.title', 'r.type', 'r.year', 'r.size', 'r.file_url'];
      let fromClause = 'FROM reports r';
      if (hasNavItem) {
        // join to navigation_items to get the readable name
        selectCols.push('r.nav_item_id');
        selectCols.push('n.name AS nav_name');
        fromClause = 'FROM reports r LEFT JOIN navigation_items n ON n.id = r.nav_item_id';
      } else if (hasNavLink) {
        // nav_item_id not present but nav_link exists; resolve name via subquery
        selectCols.push('r.nav_link');
        selectCols.push('(SELECT name FROM navigation_items WHERE link = r.nav_link LIMIT 1) AS nav_name');
      }
      selectCols.push('r.item_count', 'r.display_order', 'r.is_active', 'r.created_at', 'r.updated_at');
      const select = `SELECT ${selectCols.join(', ')} ${fromClause} ORDER BY r.display_order ASC, r.created_at DESC`;
      const [rows] = await pool.query(select);
      return res.status(200).json(rows);
    } catch (e) {
      console.error('List reports error', e?.stack || e);
      return res.status(500).json({ message: e?.message || 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, type, year, size = null, file_url = null, nav_item_id = null, nav_link = null, item_count = null, is_active = true } = req.body || {};
      if (!title) return res.status(400).json({ message: 'title is required' });
      // Defaults: type -> 'pdf'; year -> current year if not provided
      const nowYear = new Date().getFullYear();
      let finalType = (typeof type === 'string' && type) ? type : undefined;
      if (!finalType) {
        const u = (file_url || '').toLowerCase();
        if (u.endsWith('.pdf')) finalType = 'pdf';
        else if (u) finalType = 'link';
        else finalType = 'pdf';
      }
      const finalYear = (year === 0 || year === null || typeof year === 'undefined' || year === '') ? nowYear : year;

      // Auto-compute size if not provided and file_url points to a local file
      let finalSize = size;
      try {
        if (!finalSize && typeof file_url === 'string' && file_url) {
          // Support paths like /report_document/..., /uploads/..., or absolute public paths
          // On Windows, path.join ignores previous segments if rel startswith '/'
          // so ensure rel has no leading slash
          let rel = file_url.startsWith('/') ? file_url.slice(1) : file_url;
          // next.js serves from projectRoot/public
          const projectRoot = process.cwd();
          const localPath = path.join(projectRoot, 'public', rel);
          if (fs.existsSync(localPath)) {
            const st = fs.statSync(localPath);
            if (st.isFile()) {
              const kb = st.size / 1024;
              finalSize = `${kb.toFixed(2)} KB`;
            }
          }
        }
      } catch { }
      const [orows] = await pool.query('SELECT COALESCE(MAX(display_order), -1) AS max_order FROM reports');
      const nextOrder = (orows?.[0]?.max_order ?? -1) + 1;
      // Detect available columns for insert
      const [cols2] = await pool.query('SHOW COLUMNS FROM reports LIKE ?', ['nav_item_id']);
      const [cols3] = await pool.query('SHOW COLUMNS FROM reports LIKE ?', ['nav_link']);
      const hasNavItem2 = Array.isArray(cols2) && cols2.length > 0;
      const hasNavLink2 = Array.isArray(cols3) && cols3.length > 0;

      const insertCols = ['title', 'type', 'year', 'size', 'file_url'];
      const insertVals = [title, finalType, finalYear, finalSize, file_url];
      if (hasNavItem2) {
        insertCols.push('nav_item_id');
        insertVals.push(nav_item_id || null);
      }
      if (hasNavLink2) {
        insertCols.push('nav_link');
        insertVals.push(nav_link || null);
      }
      insertCols.push('item_count', 'display_order', 'is_active');
      insertVals.push(item_count, nextOrder, !!is_active);

      const placeholders = insertCols.map(() => '?').join(', ');
      const sql = `INSERT INTO reports (${insertCols.join(', ')}) VALUES (${placeholders})`;
      const [result] = await pool.query(sql, insertVals);
      return res.status(201).json({ id: result.insertId, message: 'Report created' });
    } catch (e) {
      console.error('Create report error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
