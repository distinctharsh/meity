import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid template ID' });

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM page_templates WHERE id = ?', [id]);
      if (!rows.length) return res.status(404).json({ message: 'Template not found' });
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error('Get template error', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, template_key, description, schema_json, is_active } = req.body;
      const [result] = await pool.query(
        'UPDATE page_templates SET name = ?, template_key = ?, description = ?, schema_json = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, template_key, description || null, schema_json ? JSON.stringify(schema_json) : null, is_active !== false, id]
      );
      if (!result.affectedRows) return res.status(404).json({ message: 'Template not found' });
      res.status(200).json({ message: 'Template updated' });
    } catch (err) {
      console.error('Update template error', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [result] = await pool.query('DELETE FROM page_templates WHERE id = ?', [id]);
      if (!result.affectedRows) return res.status(404).json({ message: 'Template not found' });
      res.status(200).json({ message: 'Template deleted' });
    } catch (err) {
      console.error('Delete template error', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
