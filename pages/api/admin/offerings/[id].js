import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid offering ID' });
  }

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM offerings WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Offering not found' });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error fetching offering:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, description, icon, link_url, category, display_order, is_active } = req.body;

      const [result] = await pool.query(
        'UPDATE offerings SET title = ?, description = ?, icon = ?, link_url = ?, category = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, description, icon, link_url, category, display_order || 0, is_active !== false, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Offering not found' });
      }

      res.status(200).json({ message: 'Offering updated successfully' });
    } catch (error) {
      console.error('Error updating offering:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [result] = await pool.query(
        'DELETE FROM offerings WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Offering not found' });
      }

      res.status(200).json({ message: 'Offering deleted successfully' });
    } catch (error) {
      console.error('Error deleting offering:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
