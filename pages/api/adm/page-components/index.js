import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { page_id } = req.query;
      if (!page_id) return res.status(400).json({ message: 'page_id is required' });
      const [rows] = await pool.query(
        `SELECT pc.*, cc.name as component_name, cc.component_key
         FROM page_components pc
         JOIN component_catalog cc ON cc.id = pc.component_id
         WHERE pc.page_id = ?
         ORDER BY pc.display_order ASC, pc.created_at ASC`,
        [page_id]
      );
      res.status(200).json(rows);
    } catch (err) {
      console.error('Fetch page components error', err);
      if (err && err.code === 'ER_NO_SUCH_TABLE') {
        return res.status(500).json({ message: 'Database tables not found. Please run SQL from lib/components-schema.sql.' });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { page_id, component_id, display_order = 0, props_json, is_active = true } = req.body;
      if (!page_id || !component_id) return res.status(400).json({ message: 'page_id and component_id are required' });
      let propsToStore = null;
      if (props_json != null) {
        if (typeof props_json === 'string') {
          try { propsToStore = JSON.stringify(JSON.parse(props_json)); } catch { propsToStore = props_json; }
        } else {
          propsToStore = JSON.stringify(props_json);
        }
      }
      const [r] = await pool.query(
        'INSERT INTO page_components (page_id, component_id, display_order, props_json, is_active) VALUES (?, ?, ?, ?, ?)',
        [page_id, component_id, display_order, propsToStore, !!is_active]
      );
      res.status(201).json({ id: r.insertId });
    } catch (err) {
      console.error('Create page component error', err);
      if (err && err.code === 'ER_NO_SUCH_TABLE') return res.status(500).json({ message: 'Run SQL from lib/components-schema.sql.' });
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
