import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { page_path } = req.query;
      const sql = page_path
        ? 'SELECT id, page_path, heading, subheading, background_url, parent_label, parent_href, overlay, breadcrumb_enabled, text_color FROM page_headers WHERE page_path = ?'
        : 'SELECT id, page_path, heading, subheading, background_url, parent_label, parent_href, overlay, breadcrumb_enabled, text_color FROM page_headers ORDER BY page_path ASC';
      const params = page_path ? [page_path] : [];
      const [rows] = await pool.query(sql, params);
      res.status(200).json(rows);
    } catch (err) {
      console.error('Admin page header list error', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { page_path, heading, subheading, background_url, parent_label, parent_href, overlay, breadcrumb_enabled, text_color } = req.body;
      if (!page_path || !heading || !background_url) {
        return res.status(400).json({ message: 'page_path, heading, background_url are required' });
      }
      const ov = overlay !== false ? 1 : 0;
      const bc = breadcrumb_enabled !== false ? 1 : 0;
      const color = text_color || '#ffffff';
      const [r] = await pool.query(
        'INSERT INTO page_headers (page_path, heading, subheading, background_url, parent_label, parent_href, overlay, breadcrumb_enabled, text_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)\n        ON DUPLICATE KEY UPDATE heading = VALUES(heading), subheading = VALUES(subheading), background_url = VALUES(background_url), parent_label = VALUES(parent_label), parent_href = VALUES(parent_href), overlay = VALUES(overlay), breadcrumb_enabled = VALUES(breadcrumb_enabled), text_color = VALUES(text_color)',
        [String(page_path).trim(), String(heading).trim(), subheading ?? null, String(background_url).trim(), parent_label ?? null, parent_href ?? null, ov, bc, color]
      );
      res.status(201).json({ id: r.insertId || null, upserted: true });
    } catch (err) {
      console.error('Admin page header create error', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
