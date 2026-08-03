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
      const { original_name, status } = req.body || {};
      
      if (!original_name && !status) {
        return res.status(400).json({ message: 'File name or status is required' });
      }

      // Build update query dynamically based on provided fields
      const fields = [];
      const values = [];
      
      if (original_name) {
        fields.push('original_name = ?');
        values.push(original_name);
      }
      
      if (status !== undefined) {
        // Convert status to is_active value: 1 = Active, 2 = Archived, 0 = Deleted
        const statusValue = status === 'archived' ? 2 : (status === 'deleted' ? 0 : 1);
        fields.push('is_active = ?');
        values.push(statusValue);
      }
      
      if (fields.length === 0) {
        return res.status(400).json({ message: 'No valid fields to update' });
      }
      
      values.push(fileId, id);
      
      await pool.query(
        `UPDATE report_files SET ${fields.join(', ')} WHERE id = ? AND report_id = ?`,
        values
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