import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid section ID' });

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT id, title, display_order, is_active, created_at FROM rti_sections WHERE id = ?',
        [id]
      );
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error fetching RTI section:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, display_order, is_active } = req.body || {};
      const fields = [];
      const values = [];
      if (typeof title !== 'undefined') { fields.push('title = ?'); values.push(title); }
      if (typeof display_order !== 'undefined') { fields.push('display_order = ?'); values.push(display_order); }
      if (typeof is_active !== 'undefined') { fields.push('is_active = ?'); values.push(!!is_active ? 1 : 0); }
      if (!fields.length) return res.status(400).json({ message: 'No valid fields to update' });
      const sql = `UPDATE rti_sections SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      values.push(id);
      const [result] = await pool.query(sql, values);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
      res.status(200).json({ message: 'Updated' });
    } catch (error) {
      console.error('Error updating RTI section:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [result] = await pool.query('DELETE FROM rti_sections WHERE id = ?', [id]);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
      res.status(200).json({ message: 'Deleted' });
    } catch (error) {
      console.error('Error deleting RTI section:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
