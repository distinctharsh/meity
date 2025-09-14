import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid announcement ID' });
  }

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM announcements WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Announcement not found' });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error fetching announcement:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { 
        title, 
        content, 
        link_url, 
        link_text, 
        is_urgent, 
        is_active, 
        start_date, 
        end_date, 
        display_order 
      } = req.body;

      const [result] = await pool.query(
        'UPDATE announcements SET title = ?, content = ?, link_url = ?, link_text = ?, is_urgent = ?, is_active = ?, start_date = ?, end_date = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [
          title, 
          content, 
          link_url, 
          link_text, 
          is_urgent || false, 
          is_active !== false, 
          start_date, 
          end_date, 
          display_order || 0, 
          id
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Announcement not found' });
      }

      res.status(200).json({ message: 'Announcement updated successfully' });
    } catch (error) {
      console.error('Error updating announcement:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [result] = await pool.query(
        'DELETE FROM announcements WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Announcement not found' });
      }

      res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
