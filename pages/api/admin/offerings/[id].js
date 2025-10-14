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
      const { title, link_url, category, is_active } = req.body;

      // If only is_active is provided, update just that field
      const onlyToggle = typeof is_active !== 'undefined' && typeof title === 'undefined' && typeof link_url === 'undefined' && typeof category === 'undefined';
      let result;
      if (onlyToggle) {
        [result] = await pool.query(
          'UPDATE offerings SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [!!is_active, id]
        );
      } else {
        // Build dynamic update for provided fields
        const fields = [];
        const values = [];
        if (typeof title !== 'undefined') { fields.push('title = ?'); values.push(title); }
        if (typeof link_url !== 'undefined') { fields.push('link_url = ?'); values.push(link_url || null); }
        if (typeof category !== 'undefined') { fields.push('category = ?'); values.push(category); }
        if (typeof is_active !== 'undefined') { fields.push('is_active = ?'); values.push(!!is_active); }

        if (fields.length === 0) {
          return res.status(400).json({ message: 'No valid fields to update' });
        }

        const sql = `UPDATE offerings SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        values.push(id);
        [result] = await pool.query(sql, values);
      }

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
