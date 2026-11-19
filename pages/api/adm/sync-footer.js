import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const [rows] = await pool.query(
      `SELECT sections, social_links, copyright, updated_at
       FROM footer
       WHERE type = ?
       LIMIT 1`,
      ['main']
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Footer data not found'
      });
    }

    const row = rows[0];

    const footerData = {
      sections: row.sections ? JSON.parse(row.sections) : [],
      social_links: row.social_links ? JSON.parse(row.social_links) : {},
      copyright: row.copyright || '',
      updated_at: row.updated_at
        ? new Date(row.updated_at).toISOString()
        : null
    };

    const footerJsonPath = path.join(
      process.cwd(),
      'lib',
      'footer.json'
    );

    fs.writeFileSync(
      footerJsonPath,
      JSON.stringify(footerData, null, 2),
      'utf8'
    );

    return res.status(200).json({
      success: true,
      message: 'Footer synced successfully'
    });

  } catch (error) {
    console.error('Footer sync error:', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}