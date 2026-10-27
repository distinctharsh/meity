import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Database se galleries fetch karein
    const [rows] = await pool.query(`
      SELECT id, title, date, images, created_at, updated_at 
      FROM photo_galleries 
      ORDER BY date DESC, created_at DESC
    `);
    
    // Images JSON string ko properly parse karein agar stored hai
    const galleries = rows.map(gallery => ({
      ...gallery,
      images: gallery.images 
        ? (typeof gallery.images === 'string' ? JSON.parse(gallery.images) : gallery.images) 
        : []
    }));
    
    return res.status(200).json(galleries || []);
  } catch (error) {
    console.error('Photos public API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}