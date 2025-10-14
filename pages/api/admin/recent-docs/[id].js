import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid recent doc ID' });

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT id, title, description, link_url, display_order, is_active, created_at, updated_at FROM recent_docs WHERE id = ?', [id]);
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      return res.status(200).json(rows[0]);
    } catch (e) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, description, link_url, is_active } = req.body || {};
      const fields = [];
      const values = [];
      if (typeof title !== 'undefined') { fields.push('title = ?'); values.push(title); }
      if (typeof description !== 'undefined') { fields.push('description = ?'); values.push(description); }
      if (typeof link_url !== 'undefined') { fields.push('link_url = ?'); values.push(link_url || null); }
      if (typeof is_active !== 'undefined') { fields.push('is_active = ?'); values.push(!!is_active); }
      if (!fields.length) return res.status(400).json({ message: 'No valid fields to update' });
      const sql = `UPDATE recent_docs SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      values.push(id);
      const [result] = await pool.query(sql, values);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
      return res.status(200).json({ message: 'Updated' });
    } catch (e) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [result] = await pool.query('DELETE FROM recent_docs WHERE id = ?', [id]);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
      return res.status(200).json({ message: 'Deleted' });
    } catch (e) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
