import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id, fileId } = req.query;
  
  // Validate IDs
  if (!id || id === null || id === undefined || id === '' || isNaN(Number(id))) {
    return res.status(400).json({ message: 'Invalid report ID' });
  }
  if (!fileId || fileId === null || fileId === undefined || fileId === '' || isNaN(Number(fileId))) {
    return res.status(400).json({ message: 'Invalid file ID' });
  }

  if (req.method === 'PUT') {
    try {
      const { original_name } = req.body || {};
      
      if (!original_name) {
        return res.status(400).json({ message: 'File name is required' });
      }

      // Update file name
      await pool.query(
        'UPDATE report_files SET original_name = ? WHERE id = ? AND report_id = ?',
        [original_name, fileId, id]
      );

      return res.status(200).json({ message: 'File updated successfully' });
    } catch (e) {
      console.error('Update report file error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}