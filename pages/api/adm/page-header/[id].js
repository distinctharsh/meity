import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT id, page_path, background_url FROM page_headers WHERE id = ?', [id]);
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error('Admin page header get error', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { page_path, background_url } = req.body;
      const [curRows] = await pool.query('SELECT * FROM page_headers WHERE id = ?', [id]);
      if (!curRows.length) return res.status(404).json({ message: 'Not found' });
      const cur = curRows[0];
      const next = {
        page_path: page_path !== undefined ? String(page_path).trim() : cur.page_path,
        background_url: background_url !== undefined ? String(background_url).trim() : cur.background_url,
      };
      const [r] = await pool.query(
        'UPDATE page_headers SET page_path = ?, background_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [next.page_path, next.background_url, id]
      );
      if (!r.affectedRows) return res.status(404).json({ message: 'Not found' });
      res.status(200).json({ message: 'Updated' });
    } catch (err) {
      console.error('Admin page header update error', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [r] = await pool.query('DELETE FROM page_headers WHERE id = ?', [id]);
      if (!r.affectedRows) return res.status(404).json({ message: 'Not found' });
      res.status(200).json({ message: 'Deleted' });
    } catch (err) {
      console.error('Admin page header delete error', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

