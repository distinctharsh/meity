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

      // Normalize schema_json input
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
        'UPDATE page_templates SET name = ?, template_key = ?, description = ?, schema_json = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, template_key, description || null, schemaToStore, is_active !== false, id]
      );
      if (!result.affectedRows) return res.status(404).json({ message: 'Template not found' });
      res.status(200).json({ message: 'Template updated' });
    } catch (err) {
      console.error('Update template error', err);
      if (err && err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Template key already exists. Choose a unique template_key.' });
      }
      if (err && err.code === 'ER_NO_SUCH_TABLE') {
        return res.status(500).json({ message: 'Database tables not found. Please run SQL from lib/pages-schema.sql.' });
      }
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
