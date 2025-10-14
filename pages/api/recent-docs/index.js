import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    const [rows] = await pool.query(
      'SELECT title, description, link_url FROM recent_docs WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC LIMIT 4'
    );
    return res.status(200).json(rows);
  } catch (e) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
