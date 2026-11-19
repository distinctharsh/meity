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
  
  } else if (req.method === 'POST') {
    try {
      const { action } = req.body || {};

      // Soft Delete
      if (action === 'delete') {
        const [r] = await pool.query(
          'UPDATE our_team SET is_active = 0 WHERE id = ?',
          [id]
        );

        return res.status(200).json({
          success: true,
          deleted: r.affectedRows > 0
        });
      }

      // Update
      const {
        name, designation, photo_url, email,
        phone_primary, phone_secondary, profile_url,
        about_text, office_title, office_name,
        office_designation, office_phone1, office_phone2,
        office_email1, office_email2, office_fax,
        display_order, is_active
      } = req.body || {};

      const fields = [];
      const vals = [];

      const data = {
        name, designation, photo_url, email,
        phone_primary, phone_secondary, profile_url,
        about_text, office_title, office_name,
        office_designation, office_phone1, office_phone2,
        office_email1, office_email2, office_fax,
        display_order, is_active
      };

      Object.entries(data).forEach(([key, value]) => {
        if (typeof value !== 'undefined') {
          fields.push(`${key} = ?`);
          vals.push(key === 'is_active' ? !!value : value);
        }
      });

      if (!fields.length) {
        return res.status(400).json({ message: 'No fields to update' });
      }

      vals.push(id);

      const [r] = await pool.query(
        `UPDATE our_team SET ${fields.join(', ')} WHERE id = ?`,
        vals
      );

      return res.status(200).json({
        success: true,
        updated: r.affectedRows > 0
      });

    } catch (e) {
      console.error('Our team POST error', e);
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
