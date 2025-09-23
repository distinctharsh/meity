import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM page_templates WHERE is_active = TRUE ORDER BY created_at DESC'
      );
      res.status(200).json(rows);
    } catch (err) {
      console.error('Fetch templates error', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, template_key, description, schema_json, is_active = true } = req.body;
      if (!name || !template_key) {
        return res.status(400).json({ message: 'name and template_key are required' });
      }
      const [result] = await pool.query(
        'INSERT INTO page_templates (name, template_key, description, schema_json, is_active) VALUES (?, ?, ?, ?, ?)',
        [name, template_key, description || null, schema_json ? JSON.stringify(schema_json) : null, !!is_active]
      );
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      console.error('Create template error', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
