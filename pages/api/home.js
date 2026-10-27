import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch all home page data in parallel
    const [
      [slides],
      [announcements],
      [pmQuotes],
      [offerings],
      [whatsNew],
      [importantLinks],
      [partnerLogos]
    ] = await Promise.all([
      pool.query('SELECT * FROM hero_slides WHERE is_active = 1 ORDER BY display_order ASC'),
      pool.query('SELECT * FROM announcements WHERE is_active = 1 ORDER BY created_at DESC'),
      pool.query('SELECT * FROM pm_quotes'),
      pool.query('SELECT * FROM offerings WHERE is_active = 1 ORDER BY display_order ASC'),
      pool.query('SELECT * FROM whats_new WHERE is_active = 1 ORDER BY display_order ASC'),
      pool.query('SELECT * FROM important_links WHERE is_active = 1 ORDER BY display_order ASC'),
      pool.query('SELECT * FROM partner_logos WHERE is_active = 1 ORDER BY display_order ASC')
    ]);

    res.status(200).json({
      slides: slides || [],
      announcements: announcements || [],
      pmQuotes: pmQuotes || [],
      aboutSection: null, 
      offerings: offerings || [],
      whatsNew: whatsNew || [], 
      importantLinks: importantLinks || [],
      recentDocs: [], 
      partnerLogos: partnerLogos || []
    });
  } catch (error) {
    console.error('Error fetching home data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}