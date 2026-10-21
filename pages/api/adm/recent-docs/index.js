import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');

      const [rows] = await pool.query(
        'SELECT id, title, description, link_url, display_order, is_active, created_at, updated_at FROM recent_docs ORDER BY display_order ASC, created_at DESC'
      );
      return res.status(200).json(rows);
    } catch (e) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, link_url, is_active } = req.body || {};
      if (!title || !description) return res.status(400).json({ message: 'title and description are required' });
      const [orows] = await pool.query('SELECT COALESCE(MAX(display_order), -1) AS max_order FROM recent_docs');
      const nextOrder = (orows?.[0]?.max_order ?? -1) + 1;
      const [result] = await pool.query(
        'INSERT INTO recent_docs (title, description, link_url, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
        [title, description, link_url || null, nextOrder, is_active !== false]
      );
      return res.status(201).json({ id: result.insertId, message: 'Recent document created' });
    } catch (e) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
