// import pool from '@/lib/db';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    /* 
      ============================================================
      FUTURE USE: Database queries
      ============================================================
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


    */

    // Fast Load: Read data from local JSON file
    const filePath = path.join(process.cwd(), 'lib', 'homeData.json');
    
    let jsonData = {
      slides: [],
      announcements: [],
      pmQuotes: [],
      aboutSection: null,
      offerings: [],
      whatsNew: [],
      importantLinks: [],
      recentDocs: [],
      partnerLogos: []
    };

    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath, 'utf8');
      jsonData = JSON.parse(fileBuffer);
    }

    return res.status(200).json(jsonData);

  } catch (error) {
    console.error('Error fetching home data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}