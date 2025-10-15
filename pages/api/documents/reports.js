import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const [rows] = await pool.query(
      `SELECT r.id, r.title, r.type, r.year, r.size, r.file_url,
              r.item_count,
              (SELECT COUNT(1) FROM report_files rf WHERE rf.report_id = r.id) AS files_count,
              (SELECT rf2.file_url FROM report_files rf2 WHERE rf2.report_id = r.id ORDER BY rf2.id ASC LIMIT 1) AS first_file_url
       FROM reports r
       WHERE r.is_active = TRUE
       ORDER BY r.year DESC, r.display_order ASC, r.created_at DESC`
    );
    return res.status(200).json(rows);
  } catch (e) {
    console.error('Public reports list error', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
