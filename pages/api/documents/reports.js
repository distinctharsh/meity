import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const [rows] = await pool.query(
      "SELECT id, title, type, year, size, file_url, item_count FROM reports WHERE is_active = TRUE ORDER BY year DESC, display_order ASC, created_at DESC"
    );
    return res.status(200).json(rows);
  } catch (e) {
    console.error('Public reports list error', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
