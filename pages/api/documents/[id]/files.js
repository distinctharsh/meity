import db from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { id, archived } = req.query;

  try {
    const archivedOnly = archived === '1' || archived === 'true';
    
    // Simple logic: filter files based on their individual status
    const statusFilter = archivedOnly ? 2 : 1;

    const query = `
      SELECT id, original_name, file_url, file_type, file_size, created_at, publish_date, is_active
      FROM report_files
      WHERE report_id = ? AND is_active = ?
      ORDER BY created_at DESC
    `;

    const [files] = await db.query(query, [id, statusFilter]);

    return res.status(200).json({
      success: true,
      files: files || []
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch files'
    });
  }
}