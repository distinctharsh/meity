import db from '../../../../lib/db';

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
  const { id } = req.query;
  
  try {
    if (req.method === 'GET') {
      // Get single photo gallery by ID
      const result = await query(`
        SELECT id, title, date, images, created_at, updated_at 
        FROM photo_galleries 
        WHERE id = ?
      `, [id]);
      
      if (result.length === 0) {
        return res.status(404).json({ message: 'Photo gallery not found' });
      }
      
      // Parse images JSON if it exists
      const gallery = {
        ...result[0],
        images: result[0].images ? JSON.parse(result[0].images) : []
      };
      
      return res.status(200).json(gallery);
    }
    
    if (req.method === 'PUT') {
      // Update photo gallery by ID
      const { title, date, images } = req.body;
      
      if (!title || !date) {
        return res.status(400).json({ message: 'Title and date are required' });
      }
      
      const updateResult = await query(`
        UPDATE photo_galleries 
        SET title = ?, date = ?, images = ?, updated_at = NOW()
        WHERE id = ?
      `, [title, date, JSON.stringify(images || []), id]);
      
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Photo gallery not found' });
      }
      
      return res.status(200).json({ message: 'Gallery updated successfully' });
    }
    
    if (req.method === 'DELETE') {
      // Delete photo gallery by ID
      const deleteResult = await query('DELETE FROM photo_galleries WHERE id = ?', [id]);
      
      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Photo gallery not found' });
      }
      
      return res.status(200).json({ message: 'Gallery deleted successfully' });
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
    
  } catch (error) {
    console.error('Photo API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
