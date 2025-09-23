import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid page ID' });

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        `SELECT p.*, t.name as template_name, t.template_key
         FROM pages p
         JOIN page_templates t ON t.id = p.template_id
         WHERE p.id = ?`,
        [id]
      );
      if (!rows.length) return res.status(404).json({ message: 'Page not found' });
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error('Get page error', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, slug, parent_id, template_id, hero_title, hero_subtitle, hero_image_url, tabs_json, content_json, is_active, display_order } = req.body;
      const [result] = await pool.query(
        `UPDATE pages SET title = ?, slug = ?, parent_id = ?, template_id = ?, hero_title = ?, hero_subtitle = ?, hero_image_url = ?, tabs_json = ?, content_json = ?, is_active = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [title, slug, parent_id || null, template_id, hero_title || null, hero_subtitle || null, hero_image_url || null, tabs_json ? JSON.stringify(tabs_json) : null, content_json ? JSON.stringify(content_json) : null, is_active !== false, display_order ?? 0, id]
      );
      if (!result.affectedRows) return res.status(404).json({ message: 'Page not found' });
      res.status(200).json({ message: 'Page updated' });
    } catch (err) {
      console.error('Update page error', err);
      if (err && err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Slug already exists' });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [result] = await pool.query('DELETE FROM pages WHERE id = ?', [id]);
      if (!result.affectedRows) return res.status(404).json({ message: 'Page not found' });
      res.status(200).json({ message: 'Page deleted' });
    } catch (err) {
      console.error('Delete page error', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
