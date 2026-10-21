import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM page_templates ORDER BY created_at DESC'
      );
      res.status(200).json(rows);
    } catch (err) {
      console.error('Fetch templates error', err);
      if (err && err.code === 'ER_NO_SUCH_TABLE') {
        return res.status(500).json({ message: 'Database tables not found. Please run SQL from lib/pages-schema.sql.' });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, template_key, description, schema_json, is_active = true } = req.body;

      if (!name || !template_key) {
        return res.status(400).json({ message: 'name and template_key are required' });
      }

      // Accept both object and string for schema_json
      let schemaToStore = null;
      if (schema_json != null) {
        if (typeof schema_json === 'string') {
          try { schemaToStore = JSON.stringify(JSON.parse(schema_json)); }
          catch { schemaToStore = schema_json; }
        } else {
          schemaToStore = JSON.stringify(schema_json);
        }
      }

      const [result] = await pool.query(
        'INSERT INTO page_templates (name, template_key, description, schema_json, is_active) VALUES (?, ?, ?, ?, ?)',
        [name, template_key, description || null, schemaToStore, !!is_active]
      );

      res.status(201).json({ id: result.insertId });
    } catch (err) {
      console.error('Create template error', err);
      if (err && err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Template key already exists. Choose a unique template_key.' });
      }
      if (err && err.code === 'ER_NO_SUCH_TABLE') {
        return res.status(500).json({ message: 'Database tables not found. Please run SQL from lib/pages-schema.sql.' });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
