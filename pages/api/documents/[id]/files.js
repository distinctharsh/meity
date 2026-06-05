import db from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { id, archived } = req.query;

  try {
    // Check if is_archived column exists in report_files
    const [cols] = await db.query('SHOW COLUMNS FROM report_files LIKE ?', ['is_archived']);
    const hasArchived = Array.isArray(cols) && cols.length > 0;

    const archivedOnly = archived === '1' || archived === 'true';
    const archivedFilter = hasArchived ? (archivedOnly ? 'TRUE' : 'FALSE') : null;

    const query = hasArchived && archivedFilter !== null
      ? `
        SELECT id, original_name, file_url, file_type, file_size, created_at, publish_date
        FROM report_files
        WHERE report_id = ? AND is_archived = ${archivedFilter}
        ORDER BY created_at DESC
      `
      : `
        SELECT id, original_name, file_url, file_type, file_size, created_at, publish_date
        FROM report_files
        WHERE report_id = ?
        ORDER BY created_at DESC
      `;

    const [files] = await db.query(query, [id]);

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