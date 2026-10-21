import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
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
      console.error('Error fetching footer:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { sections, social_links, copyright } = req.body || {};

      // Basic validation
      if (sections !== undefined && typeof sections !== 'object') {
        return res.status(400).json({ message: 'sections must be an object or array' });
      }

      if (social_links !== undefined && typeof social_links !== 'object') {
        return res.status(400).json({ message: 'social_links must be an object or array' });
      }

      const sectionsJson = sections != null ? JSON.stringify(sections) : JSON.stringify([]);
      const socialLinksJson = social_links != null ? JSON.stringify(social_links) : JSON.stringify({});
      const copyrightText = copyright != null ? String(copyright) : '';

      await pool.query(
        'INSERT INTO footer (type, sections, social_links, copyright) VALUES (?, ?, ?, ?)\n         ON DUPLICATE KEY UPDATE sections = VALUES(sections), social_links = VALUES(social_links), copyright = VALUES(copyright), updated_at = CURRENT_TIMESTAMP',
        ['main', sectionsJson, socialLinksJson, copyrightText]
      );

      return res.status(200).json({ message: 'Footer updated successfully' });
    } catch (error) {
      console.error('Error updating footer:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

// API implementation here
