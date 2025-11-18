import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, type, sections, social_links, copyright, created_at, updated_at FROM footer WHERE type = ? LIMIT 1',
      ['main']
    );

    if (!rows || rows.length === 0) {
      return res.status(200).json(null);
    }

    const row = rows[0];

    let sections = null;
    let socialLinks = null;

    try {
      sections = row.sections ? JSON.parse(row.sections) : null;
    } catch (e) {
      sections = null;
    }

    try {
      socialLinks = row.social_links ? JSON.parse(row.social_links) : null;
    } catch (e) {
      socialLinks = null;
    }

    return res.status(200).json({
      id: row.id,
      type: row.type,
      sections,
      social_links: socialLinks,
      copyright: row.copyright,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  } catch (error) {
    console.error('Error fetching public footer:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
