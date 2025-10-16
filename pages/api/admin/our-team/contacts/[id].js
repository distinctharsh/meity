import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: 'id is required' });

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM our_team_contacts WHERE id = ?', [id]);
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      return res.status(200).json(rows[0]);
    } catch (e) {
      console.error('Get contact error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { person_id, type, value, display_order, is_active } = req.body || {};
      const fields = [];
      const vals = [];
      if (typeof person_id !== 'undefined') { fields.push('person_id = ?'); vals.push(person_id); }
      if (typeof type !== 'undefined') { fields.push('type = ?'); vals.push(type); }
      if (typeof value !== 'undefined') { fields.push('value = ?'); vals.push(value); }
      if (typeof display_order !== 'undefined') { fields.push('display_order = ?'); vals.push(display_order); }
      if (typeof is_active !== 'undefined') { fields.push('is_active = ?'); vals.push(!!is_active); }
      if (!fields.length) return res.status(400).json({ message: 'No fields to update' });
      vals.push(id);
      const [r] = await pool.query(`UPDATE our_team_contacts SET ${fields.join(', ')} WHERE id = ?`, vals);
      return res.status(200).json({ updated: r.affectedRows > 0 });
    } catch (e) {
      console.error('Update contact error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [r] = await pool.query('DELETE FROM our_team_contacts WHERE id = ?', [id]);
      return res.status(200).json({ deleted: r.affectedRows > 0 });
    } catch (e) {
      console.error('Delete contact error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
