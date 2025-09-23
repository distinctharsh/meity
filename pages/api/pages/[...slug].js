import pool from '@/lib/db';

function normalizePath(slugArr) {
  if (!slugArr || !slugArr.length) return '/';
  const s = '/' + slugArr.join('/');
  return s;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { slug = [] } = req.query;
    const full = normalizePath(Array.isArray(slug) ? slug : [slug]);

    const [rows] = await pool.query(
      `SELECT p.*, t.name as template_name, t.template_key
       FROM pages p
       JOIN page_templates t ON t.id = p.template_id
       WHERE p.slug = ? AND p.is_active = TRUE
       LIMIT 1`,
      [full]
    );
    if (!rows.length) return res.status(404).json({ message: 'Page not found' });
    const page = rows[0];

    // Parse JSON fields
    try {
      if (page.tabs_json && typeof page.tabs_json === 'string') page.tabs_json = JSON.parse(page.tabs_json);
      if (page.content_json && typeof page.content_json === 'string') page.content_json = JSON.parse(page.content_json);
    } catch (e) {}

    res.status(200).json(page);
  } catch (err) {
    console.error('Resolve page by slug error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
