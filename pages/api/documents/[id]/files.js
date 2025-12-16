import db from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    const [files] = await db.query(`
      SELECT id, original_name, file_url, file_type, file_size, created_at 
      FROM report_files 
      WHERE report_id = ? 
      ORDER BY created_at DESC
    `, [id]);

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