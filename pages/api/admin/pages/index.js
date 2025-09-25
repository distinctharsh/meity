import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        `SELECT p.*
         FROM pages p
         ORDER BY p.created_at DESC`
      );
      res.status(200).json(rows);
    } catch (err) {
      console.error('Fetch pages error', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, slug, parent_id, template_id, hero_title, hero_subtitle, hero_image_url, content_html, content_css, is_active = true, display_order = 0 } = req.body;
      if (!title || !slug) {
        return res.status(400).json({ message: 'title and slug are required' });
      }
      // Resolve template_id if not provided: prefer 'hero_tabs', else first active template
      let tplId = template_id;
      if (!tplId) {
        try {
          const [pref] = await pool.query("SELECT id FROM page_templates WHERE template_key = 'hero_tabs' AND is_active = TRUE LIMIT 1");
          if (pref && pref.length) tplId = pref[0].id;
        } catch {}
        if (!tplId) {
          try {
            const [any] = await pool.query('SELECT id FROM page_templates WHERE is_active = TRUE ORDER BY id ASC LIMIT 1');
            if (any && any.length) tplId = any[0].id;
          } catch {}
        }
      }
      if (!tplId) {
        return res.status(500).json({ message: 'No active page template found. Please create a template first.' });
      }
      const contentJson = JSON.stringify({ html: content_html || '', css: content_css || '' });
      const [result] = await pool.query(
        `INSERT INTO pages (title, slug, parent_id, template_id, hero_title, hero_subtitle, hero_image_url, tabs_json, content_json, is_active, display_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, slug, parent_id || null, tplId, hero_title || null, hero_subtitle || null, hero_image_url || null, null, contentJson, !!is_active, display_order]
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
