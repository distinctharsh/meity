import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT id, page_path, label, href, display_order, is_active FROM page_subnav_items WHERE id = ?', [id]);
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error('Admin subnav get error', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { page_path, label, href, display_order, is_active } = req.body;
      const ord = display_order !== undefined ? Number(display_order) : undefined;
      const active = typeof is_active === 'boolean' ? (is_active ? 1 : 0) : undefined;

      // Fetch current
      const [rows] = await pool.query('SELECT * FROM page_subnav_items WHERE id = ?', [id]);
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      const cur = rows[0];

      const next = {
        page_path: page_path !== undefined ? String(page_path).trim() : cur.page_path,
        label: label !== undefined ? String(label).trim() : cur.label,
        href: href !== undefined ? String(href).trim() : cur.href,
        display_order: ord !== undefined && Number.isFinite(ord) ? ord : cur.display_order,
        is_active: active !== undefined ? active : cur.is_active,
      };

      const [r] = await pool.query(
        'UPDATE page_subnav_items SET page_path = ?, label = ?, href = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [next.page_path, next.label, next.href, next.display_order, next.is_active, id]
      );
      if (!r.affectedRows) return res.status(404).json({ message: 'Not found' });
      res.status(200).json({ message: 'Updated' });
    } catch (err) {
      console.error('Admin subnav update error', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [r] = await pool.query('DELETE FROM page_subnav_items WHERE id = ?', [id]);
      if (!r.affectedRows) return res.status(404).json({ message: 'Not found' });
      res.status(200).json({ message: 'Deleted' });
    } catch (err) {
      console.error('Admin subnav delete error', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
