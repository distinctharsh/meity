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
      [partnerLogos]
    ] = await Promise.all([
      // Hero Slides
      pool.query('SELECT * FROM hero_slides ORDER BY display_order ASC'),
      
      // Announcements
      pool.query('SELECT * FROM announcements ORDER BY created_at DESC'),
      
      // PM Quotes
      pool.query('SELECT * FROM pm_quotes'),
      
      // Offerings (activities table)
      pool.query('SELECT * FROM offerings ORDER BY display_order ASC'),
      
      // Partner Logos
      pool.query('SELECT * FROM partner_logos ORDER BY display_order ASC')
    ]);

    res.status(200).json({
      slides: slides || [],
      announcements: announcements || [],
      pmQuotes: pmQuotes || [],
      aboutSection: null, 
      offerings: offerings || [],
      recentDocs: [], 
      partnerLogos: partnerLogos || []
    });
  } catch (error) {
    console.error('Error fetching home data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}