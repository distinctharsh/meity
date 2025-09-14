import pool from '../../../lib/db';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid media ID' });
  }

  if (req.method === 'DELETE') {
    try {
      // Get file info from database
      const [rows] = await pool.query(
        'SELECT * FROM media_library WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Media file not found' });
      }

      const fileInfo = rows[0];

      // Delete file from filesystem
      const filePath = path.join(process.cwd(), 'public', fileInfo.file_path);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (unlinkError) {
        console.error('Error deleting file from filesystem:', unlinkError);
        // Continue with database deletion even if file deletion fails
      }

      // Delete record from database
      const [result] = await pool.query(
        'DELETE FROM media_library WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Media file not found' });
      }

      res.status(200).json({ message: 'Media file deleted successfully' });
    } catch (error) {
      console.error('Error deleting media file:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM media_library WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Media file not found' });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error fetching media file:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
