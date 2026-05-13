import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id, fileId } = req.query;
  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid report ID' });
  if (!fileId || isNaN(fileId)) return res.status(400).json({ message: 'Invalid file ID' });

  if (req.method === 'PUT') {
    try {
      const { original_name } = req.body || {};
      if (typeof original_name !== 'string' || !original_name.trim()) {
        return res.status(400).json({ message: 'original_name is required' });
      }
      const [r] = await pool.query(
        'UPDATE report_files SET original_name = ? WHERE id = ? AND report_id = ?',
        [original_name.trim(), fileId, id]
      );
      if (!r.affectedRows) return res.status(404).json({ message: 'File not found' });
      return res.status(200).json({ message: 'Updated' });
    } catch (e) {
      console.error('Update report file error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [r] = await pool.query('DELETE FROM report_files WHERE id = ? AND report_id = ?', [fileId, id]);
      if (!r.affectedRows) return res.status(404).json({ message: 'File not found' });
      return res.status(200).json({ message: 'Deleted' });
    } catch (e) {
      console.error('Delete report file error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
