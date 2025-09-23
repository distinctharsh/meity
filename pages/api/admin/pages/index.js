import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        `SELECT p.*, t.name as template_name, t.template_key
         FROM pages p
         JOIN page_templates t ON t.id = p.template_id
         ORDER BY p.created_at DESC`
      );
      res.status(200).json(rows);
    } catch (err) {
      console.error('Fetch pages error', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, slug, parent_id, template_id, hero_title, hero_subtitle, hero_image_url, tabs_json, content_json, is_active = true, display_order = 0 } = req.body;
      if (!title || !slug || !template_id) {
        return res.status(400).json({ message: 'title, slug and template_id are required' });
      }
      const [result] = await pool.query(
        `INSERT INTO pages (title, slug, parent_id, template_id, hero_title, hero_subtitle, hero_image_url, tabs_json, content_json, is_active, display_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, slug, parent_id || null, template_id, hero_title || null, hero_subtitle || null, hero_image_url || null, tabs_json ? JSON.stringify(tabs_json) : null, content_json ? JSON.stringify(content_json) : null, !!is_active, display_order]
      );
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      console.error('Create page error', err);
      if (err && err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Slug already exists' });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
