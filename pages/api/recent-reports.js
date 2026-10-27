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
    rf.original_name AS title,
    rf.file_url,
    n.name AS nav_name,
    n.link AS nav_link
FROM report_files rf
INNER JOIN reports r
    ON r.id = rf.report_id
LEFT JOIN navigation_items n
    ON n.id = r.nav_item_id
WHERE r.is_active = 1
  AND rf.publish_date >= MAKEDATE(YEAR(CURDATE()) - 1, 1)
  AND rf.publish_date <  MAKEDATE(YEAR(CURDATE()) + 1, 1)
ORDER BY rf.created_at DESC
LIMIT 4;
    `;

    const [rows] = await pool.query(query);
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching recent reports:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}