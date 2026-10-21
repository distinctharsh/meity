import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT id, page_title, intro_heading, intro_bullets, is_active FROM rti_page_content LIMIT 1'
      );
      if (!rows.length) {
        return res.status(200).json({
          id: null,
          page_title: 'RTI',
          intro_heading: 'Power and Duties of Officials',
          intro_bullets: '["To Provide Secretarial assistance to the Cabinet and Cabinet Committees.","To Frame Rules of Business."]',
          is_active: 1
        });
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error fetching RTI content:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { page_title, intro_heading, intro_bullets, is_active } = req.body || {};
      const [rows] = await pool.query('SELECT id FROM rti_page_content LIMIT 1');
      const existing = rows[0];

      if (existing) {
        const fields = [];
        const values = [];
        if (typeof page_title !== 'undefined') { fields.push('page_title = ?'); values.push(page_title); }
        if (typeof intro_heading !== 'undefined') { fields.push('intro_heading = ?'); values.push(intro_heading); }
        if (typeof intro_bullets !== 'undefined') { fields.push('intro_bullets = ?'); values.push(intro_bullets); }
        if (typeof is_active !== 'undefined') { fields.push('is_active = ?'); values.push(!!is_active ? 1 : 0); }
        if (!fields.length) return res.status(400).json({ message: 'No fields to update' });
        const sql = `UPDATE rti_page_content SET ${fields.join(', ')} WHERE id = ?`;
        values.push(existing.id);
        await pool.query(sql, values);
        res.status(200).json({ message: 'Updated' });
      } else {
        await pool.query(
          'INSERT INTO rti_page_content (page_title, intro_heading, intro_bullets, is_active) VALUES (?, ?, ?, ?)',
          [page_title || 'RTI', intro_heading || 'Power and Duties of Officials', intro_bullets || '[]', is_active !== false ? 1 : 0]
        );
        res.status(201).json({ message: 'Created' });
      }
    } catch (error) {
      console.error('Error saving RTI content:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
