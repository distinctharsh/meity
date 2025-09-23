import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { page_path } = req.query;
      const sql = page_path
        ? 'SELECT id, page_path, label, href, display_order, is_active FROM page_subnav_items WHERE page_path = ? ORDER BY display_order ASC, id ASC'
        : 'SELECT id, page_path, label, href, display_order, is_active FROM page_subnav_items ORDER BY page_path ASC, display_order ASC, id ASC';
      const params = page_path ? [page_path] : [];
      const [rows] = await pool.query(sql, params);
      res.status(200).json(rows);
    } catch (err) {
      console.error('Admin subnav list error', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { page_path, label, href, display_order, is_active } = req.body;
      if (!page_path || !label || !href) {
        return res.status(400).json({ message: 'page_path, label, href are required' });
      }
      const ord = Number.isFinite(Number(display_order)) ? Number(display_order) : 0;
      const active = is_active !== false ? 1 : 0;
      const [r] = await pool.query(
        'INSERT INTO page_subnav_items (page_path, label, href, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
        [String(page_path).trim(), String(label).trim(), String(href).trim(), ord, active]
      );
      res.status(201).json({ id: r.insertId });
    } catch (err) {
      console.error('Admin subnav create error', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
