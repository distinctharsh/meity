import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Public endpoint: only return active slides in display order
    const [rows] = await pool.query(
      'SELECT id, title, description, image_url, link_url, link_text FROM hero_slides WHERE is_active = TRUE ORDER BY display_order ASC, created_at DESC'
    );

    // Basic no-cache to keep homepage fresh
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.status(200).json(rows || []);
  } catch (error) {
    console.error('Error fetching public slider:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
