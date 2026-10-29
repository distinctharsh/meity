import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Database se sabhi active home data aur recent documents parallel fetch karein
    const [
      [slides],
      [announcements],
      [pmQuotes],
      [offerings],
      [whatsNew],
      [importantLinks],
      [recentDocs],
      [partnerLogos]
    ] = await Promise.all([
      connection.execute('SELECT * FROM hero_slides WHERE is_active = 1 ORDER BY display_order ASC'),
      connection.execute('SELECT * FROM announcements WHERE is_active = 1 ORDER BY created_at DESC'),
      connection.execute('SELECT * FROM pm_quotes'),
      connection.execute('SELECT * FROM offerings WHERE is_active = 1 ORDER BY display_order ASC'),
      connection.execute('SELECT * FROM whats_new WHERE is_active = 1 ORDER BY display_order ASC'),
      connection.execute('SELECT * FROM important_links WHERE is_active = 1 ORDER BY display_order ASC'),
      connection.execute(`
        SELECT
            r.id,
            rf.original_name AS title,
            rf.file_url,
            n.name AS nav_name,
            rf.file_url AS nav_link
        FROM report_files rf
        INNER JOIN reports r
            ON r.id = rf.report_id
        LEFT JOIN navigation_items n
            ON n.id = r.nav_item_id
        WHERE r.is_active = 1
          AND rf.publish_date >= MAKEDATE(YEAR(CURDATE()) - 1, 1)
          AND rf.publish_date <  MAKEDATE(YEAR(CURDATE()) + 1, 1) and n.name is not null
        ORDER BY rf.created_at DESC
        LIMIT 4;
      `),
      connection.execute('SELECT * FROM partner_logos WHERE is_active = 1 ORDER BY display_order ASC')
    ]);

    const homeDataPayload = {
      slides: slides || [],
      announcements: announcements || [],
      pmQuotes: pmQuotes || [],
      aboutSection: null,
      offerings: offerings || [],
      whatsNew: whatsNew || [],
      importantLinks: importantLinks || [],
      recentDocs: recentDocs || [],
      partnerLogos: partnerLogos || []
    };

    const filePath = path.join(process.cwd(), 'lib', 'homeData.json');

    fs.writeFileSync(filePath, JSON.stringify(homeDataPayload, null, 2), 'utf8');

    return res.status(200).json({
      success: true,
      message: "Successfully synced and updated homeData.json including recentDocs from database!"
    });

  } catch (error) {
    console.error("Home data sync error:", error);
    return res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) connection.release();
  }
}