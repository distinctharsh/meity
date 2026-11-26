import db from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { id, archived } = req.query;

  try {
    const archivedOnly = archived === '1' || archived === 'true';
    const statusFilter = archivedOnly ? 2 : 1;

    // Get order_type from parent report
    const [reportRows] = await db.query(
      'SELECT order_type FROM reports WHERE id = ? LIMIT 1',
      [id]
    );

    const orderType = Number(reportRows[0]?.order_type ?? 0);

    // Fetch report files
    const query = `
      SELECT id, original_name, file_url, file_type, file_size, created_at, publish_date, is_active
      FROM report_files
      WHERE report_id = ? AND is_active = ?
    `;

    const [files] = await db.query(query, [id, statusFilter]);

    return res.status(200).json({
      success: true,
      files: files || [],
      order_type: orderType
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch files'
    });
  }
}