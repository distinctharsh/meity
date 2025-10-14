import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    const [rows] = await pool.query(
      'SELECT id, quote_text, author, image_url, event_url, quote_date, updated_at FROM pm_quotes ORDER BY updated_at DESC, created_at DESC LIMIT 1'
    );
    if (!rows.length) return res.status(200).json(null);
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching active PM quote:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
