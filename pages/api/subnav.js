import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  const { path } = req.query;
  if (!path) return res.status(400).json({ message: 'path is required, e.g. /ministry/about' });
  try {
    const [rows] = await pool.query(
      'SELECT id, page_path, label, href, display_order, is_active FROM page_subnav_items WHERE page_path = ? AND is_active = TRUE ORDER BY display_order ASC, id ASC',
      [path]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error('Fetch subnav error', err);
    // Return empty list to avoid breaking UI
    return res.status(200).json([]);
  }
}
