import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  const { path } = req.query;
  if (!path) return res.status(400).json({ message: 'path is required, e.g. /ministry/about' });
  try {
    const [rows] = await pool.query(
      'SELECT id, page_path, background_url FROM page_headers WHERE page_path = ? LIMIT 1',
      [path]
    );
    if (!rows.length) return res.status(200).json(null);
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Fetch page header error', err);
    return res.status(200).json(null);
  }
}
