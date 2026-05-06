import db from '../../../lib/db';

async function query(sql, params = []) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    connection.release();
  }
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Get all photo galleries
      const result = await query(`
        SELECT id, title, date, images, created_at, updated_at 
        FROM photo_galleries 
        ORDER BY date DESC, created_at DESC
      `);
      
      // Parse images JSON if it exists
      const galleries = result.map(gallery => ({
        ...gallery,
        images: gallery.images ? JSON.parse(gallery.images) : []
      }));
      
      return res.status(200).json(galleries);
    }
    
    if (req.method === 'POST') {
      // Create new photo gallery
      const { title, date, images } = req.body;
      
      if (!title || !date) {
        return res.status(400).json({ message: 'Title and date are required' });
      }
      
      const result = await query(`
        INSERT INTO photo_galleries (title, date, images, created_at, updated_at)
        VALUES (?, ?, ?, NOW(), NOW())
      `, [title, date, JSON.stringify(images || [])]);
      
      return res.status(201).json({ 
        message: 'Gallery created successfully',
        id: result.insertId 
      });
    }
    
    if (req.method === 'PUT') {
      // Update photo gallery
      const { id } = req.query;
      const { title, date, images } = req.body;
      
      if (!title || !date) {
        return res.status(400).json({ message: 'Title and date are required' });
      }
      
      await query(`
        UPDATE photo_galleries 
        SET title = ?, date = ?, images = ?, updated_at = NOW()
        WHERE id = ?
      `, [title, date, JSON.stringify(images || []), id]);
      
      return res.status(200).json({ message: 'Gallery updated successfully' });
    }
    
    if (req.method === 'DELETE') {
      // Delete photo gallery
      const { id } = req.query;
      
      await query('DELETE FROM photo_galleries WHERE id = ?', [id]);
      
      return res.status(200).json({ message: 'Gallery deleted successfully' });
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
    
  } catch (error) {
    console.error('Photos API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
