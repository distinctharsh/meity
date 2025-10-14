import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    const [rows] = await pool.query(
      'SELECT title, link_url, category FROM offerings WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC'
    );

    const toItem = (r) => ({
      title: r.title,
      link_url: r.link_url || null,
    });

    const result = { schemes: [], vacancies: [], whats_new: [] };
    for (const r of rows) {
      if (r.category === 'schemes') result.schemes.push(toItem(r));
      else if (r.category === 'vacancies') result.vacancies.push(toItem(r));
      else if (r.category === 'whats_new') result.whats_new.push(toItem(r));
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching offerings:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
