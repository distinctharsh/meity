import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: 'id is required' });

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM our_team_people WHERE id = ?', [id]);
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      return res.status(200).json(rows[0]);
    } catch (e) {
      console.error('Get person error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { section_id, name, designation, address, display_order, is_active } = req.body || {};
      const fields = [];
      const vals = [];
      if (typeof section_id !== 'undefined') { fields.push('section_id = ?'); vals.push(section_id); }
      if (typeof name !== 'undefined') { fields.push('name = ?'); vals.push(name); }
      if (typeof designation !== 'undefined') { fields.push('designation = ?'); vals.push(designation); }
      if (typeof address !== 'undefined') { fields.push('address = ?'); vals.push(address); }
      if (typeof display_order !== 'undefined') { fields.push('display_order = ?'); vals.push(display_order); }
      if (typeof is_active !== 'undefined') { fields.push('is_active = ?'); vals.push(!!is_active); }
      if (!fields.length) return res.status(400).json({ message: 'No fields to update' });
      vals.push(id);
      const [r] = await pool.query(`UPDATE our_team_people SET ${fields.join(', ')} WHERE id = ?`, vals);
      return res.status(200).json({ updated: r.affectedRows > 0 });
    } catch (e) {
      console.error('Update person error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [r] = await pool.query('DELETE FROM our_team_people WHERE id = ?', [id]);
      return res.status(200).json({ deleted: r.affectedRows > 0 });
    } catch (e) {
      console.error('Delete person error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
