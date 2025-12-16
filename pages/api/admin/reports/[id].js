import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid report ID' });

  if (req.method === 'GET') {
    try {
      // Detect nav_item_id and nav_link presence
      const [colsItem] = await pool.query('SHOW COLUMNS FROM reports LIKE ?', ['nav_item_id']);
      const [colsLink] = await pool.query('SHOW COLUMNS FROM reports LIKE ?', ['nav_link']);
      const hasNavItem = Array.isArray(colsItem) && colsItem.length > 0;
      const hasNavLink = Array.isArray(colsLink) && colsLink.length > 0;
      const selectCols = ['id', 'title', 'type', 'year', 'size', 'file_url'];
      if (hasNavLink) selectCols.push('nav_link');
      if (hasNavItem) selectCols.push('nav_item_id');
      selectCols.push('item_count', 'display_order', 'is_active', 'created_at', 'updated_at');
      const select = `SELECT ${selectCols.join(', ')} FROM reports WHERE id = ?`;
      const [rows] = await pool.query(select, [id]);
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      return res.status(200).json(rows[0]);
    } catch (e) {
      console.error('Get report error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, type, year, size, file_url, nav_item_id, nav_link, item_count, display_order, is_active } = req.body || {};
      const fields = [];
      const values = [];
      if (typeof title !== 'undefined') { fields.push('title = ?'); values.push(title); }
      if (typeof type !== 'undefined') { fields.push('type = ?'); values.push(type); }
      if (typeof year !== 'undefined') { fields.push('year = ?'); values.push(year); }
      if (typeof size !== 'undefined') { fields.push('size = ?'); values.push(size); }
      if (typeof file_url !== 'undefined') { fields.push('file_url = ?'); values.push(file_url || null); }
      // Only include nav_item_id/nav_link assignment if the columns exist
      const [cols2] = await pool.query('SHOW COLUMNS FROM reports LIKE ?', ['nav_item_id']);
      const [cols3] = await pool.query('SHOW COLUMNS FROM reports LIKE ?', ['nav_link']);
      const hasNavItem2 = Array.isArray(cols2) && cols2.length > 0;
      const hasNavLink2 = Array.isArray(cols3) && cols3.length > 0;
      if (typeof nav_item_id !== 'undefined' && hasNavItem2) { fields.push('nav_item_id = ?'); values.push(nav_item_id || null); }
      if (typeof nav_link !== 'undefined' && hasNavLink2) { fields.push('nav_link = ?'); values.push(nav_link || null); }
      if (typeof item_count !== 'undefined') { fields.push('item_count = ?'); values.push(item_count); }
      if (typeof display_order !== 'undefined') { fields.push('display_order = ?'); values.push(display_order); }
      if (typeof is_active !== 'undefined') { fields.push('is_active = ?'); values.push(!!is_active); }
      if (!fields.length) return res.status(400).json({ message: 'No valid fields to update' });
      const sql = `UPDATE reports SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      values.push(id);
      const [result] = await pool.query(sql, values);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
      return res.status(200).json({ message: 'Updated' });
    } catch (e) {
      console.error('Update report error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [result] = await pool.query('DELETE FROM reports WHERE id = ?', [id]);
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
      return res.status(200).json({ message: 'Deleted' });
    } catch (e) {
      console.error('Delete report error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
