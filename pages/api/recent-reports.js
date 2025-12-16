// pages/api/recent-reports.js
import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const query = `
      SELECT 
        r.id,
        r.title,
        r.file_url,
        n.name as nav_name,
        n.link as nav_link
      FROM 
        reports r
      LEFT JOIN 
        navigation_items n ON r.nav_item_id = n.id
      WHERE 
        r.is_active = 1
      ORDER BY 
        r.created_at DESC
      LIMIT 4
    `;

    const [rows] = await pool.query(query);
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching recent reports:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}