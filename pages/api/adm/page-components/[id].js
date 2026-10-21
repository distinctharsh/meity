import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  if (req.method === 'DELETE') {
    try {
      const [r] = await pool.query('DELETE FROM page_components WHERE id = ?', [id]);
      if (!r.affectedRows) return res.status(404).json({ message: 'Not found' });
      res.status(200).json({ message: 'Deleted' });
    } catch (err) {
      console.error('Delete page component error', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { display_order, props_json, is_active } = req.body;
      let propsToStore = null;
      if (props_json != null) {
        if (typeof props_json === 'string') {
          try { propsToStore = JSON.stringify(JSON.parse(props_json)); } catch { propsToStore = props_json; }
        } else {
          propsToStore = JSON.stringify(props_json);
        }
      }
      const [r] = await pool.query(
        'UPDATE page_components SET display_order = COALESCE(?, display_order), props_json = COALESCE(?, props_json), is_active = COALESCE(?, is_active), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [display_order ?? null, propsToStore, typeof is_active === 'boolean' ? is_active : null, id]
      );
      if (!r.affectedRows) return res.status(404).json({ message: 'Not found' });
      res.status(200).json({ message: 'Updated' });
    } catch (err) {
      console.error('Update page component error', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM page_components WHERE id = ?', [id]);
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error('Get page component error', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
