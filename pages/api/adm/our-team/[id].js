import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: 'id is required' });

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM our_team WHERE id = ?', [id]);
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      return res.status(200).json(rows[0]);
    } catch (e) {
      console.error('Get our_team error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, designation, photo_url, email, phone_primary, phone_secondary, profile_url, about_text, office_title, office_name, office_designation, office_phone1, office_phone2, office_email1, office_email2, office_fax, display_order, is_active } = req.body || {};
      const fields = [];
      const vals = [];
      if (typeof name !== 'undefined') { fields.push('name = ?'); vals.push(name); }
      if (typeof designation !== 'undefined') { fields.push('designation = ?'); vals.push(designation); }
      if (typeof photo_url !== 'undefined') { fields.push('photo_url = ?'); vals.push(photo_url); }
      if (typeof email !== 'undefined') { fields.push('email = ?'); vals.push(email); }
      if (typeof phone_primary !== 'undefined') { fields.push('phone_primary = ?'); vals.push(phone_primary); }
      if (typeof phone_secondary !== 'undefined') { fields.push('phone_secondary = ?'); vals.push(phone_secondary); }
      if (typeof profile_url !== 'undefined') { fields.push('profile_url = ?'); vals.push(profile_url); }
      if (typeof about_text !== 'undefined') { fields.push('about_text = ?'); vals.push(about_text); }
      if (typeof office_title !== 'undefined') { fields.push('office_title = ?'); vals.push(office_title); }
      if (typeof office_name !== 'undefined') { fields.push('office_name = ?'); vals.push(office_name); }
      if (typeof office_designation !== 'undefined') { fields.push('office_designation = ?'); vals.push(office_designation); }
      if (typeof office_phone1 !== 'undefined') { fields.push('office_phone1 = ?'); vals.push(office_phone1); }
      if (typeof office_phone2 !== 'undefined') { fields.push('office_phone2 = ?'); vals.push(office_phone2); }
      if (typeof office_email1 !== 'undefined') { fields.push('office_email1 = ?'); vals.push(office_email1); }
      if (typeof office_email2 !== 'undefined') { fields.push('office_email2 = ?'); vals.push(office_email2); }
      if (typeof office_fax !== 'undefined') { fields.push('office_fax = ?'); vals.push(office_fax); }
      if (typeof display_order !== 'undefined') { fields.push('display_order = ?'); vals.push(display_order); }
      if (typeof is_active !== 'undefined') { fields.push('is_active = ?'); vals.push(!!is_active); }
      if (!fields.length) return res.status(400).json({ message: 'No fields to update' });
      vals.push(id);
      const [r] = await pool.query(`UPDATE our_team SET ${fields.join(', ')} WHERE id = ?`, vals);
      return res.status(200).json({ updated: r.affectedRows > 0 });
    } catch (e) {
      console.error('Update our_team error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [r] = await pool.query('DELETE FROM our_team WHERE id = ?', [id]);
      return res.status(200).json({ deleted: r.affectedRows > 0 });
    } catch (e) {
      console.error('Delete our_team error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
