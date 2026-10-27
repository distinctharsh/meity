import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Sirf active rows select karein as per display order
    const [rows] = await pool.query(
      'SELECT * FROM about_content WHERE is_active = 1 ORDER BY display_order ASC, section_key ASC'
    );

    return res.status(200).json(rows || []);
  } catch (error) {
    console.error('Error fetching about content:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}