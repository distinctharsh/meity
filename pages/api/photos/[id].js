import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    // Database se specific gallery select karein ID ke through
    const [rows] = await pool.query(
      'SELECT id, title, date, images, created_at, updated_at FROM photo_galleries WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Photo gallery not found' });
    }

    // Images JSON string ko parse karein
    const gallery = {
      ...rows[0],
      images: rows[0].images 
        ? (typeof rows[0].images === 'string' ? JSON.parse(rows[0].images) : rows[0].images) 
        : []
    };

    return res.status(200).json(gallery);
  } catch (error) {
    console.error('Single photo gallery public API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}