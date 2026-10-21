import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM component_catalog ORDER BY name ASC');
      res.status(200).json(rows);
    } catch (err) {
      console.error('Fetch components error', err);
      if (err && err.code === 'ER_NO_SUCH_TABLE') {
        return res.status(500).json({ message: 'Database tables not found. Please run SQL from lib/components-schema.sql.' });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, component_key, description, default_props_json, is_active = true } = req.body;
      if (!name || !component_key) {
        return res.status(400).json({ message: 'name and component_key are required' });
      }
      let propsToStore = null;
      if (default_props_json != null) {
        if (typeof default_props_json === 'string') {
          try { propsToStore = JSON.stringify(JSON.parse(default_props_json)); } catch { propsToStore = default_props_json; }
        } else {
          propsToStore = JSON.stringify(default_props_json);
        }
      }
      const [r] = await pool.query(
        'INSERT INTO component_catalog (name, component_key, description, default_props_json, is_active) VALUES (?, ?, ?, ?, ?)',
        [name, component_key, description || null, propsToStore, !!is_active]
      );
      res.status(201).json({ id: r.insertId });
    } catch (err) {
      console.error('Create component error', err);
      if (err && err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'component_key already exists' });
      if (err && err.code === 'ER_NO_SUCH_TABLE') return res.status(500).json({ message: 'Run SQL from lib/components-schema.sql.' });
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
