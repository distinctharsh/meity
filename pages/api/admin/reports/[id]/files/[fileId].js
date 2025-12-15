import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id, fileId } = req.query;
  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid report ID' });
  if (!fileId || isNaN(fileId)) return res.status(400).json({ message: 'Invalid file ID' });

  if (req.method === 'DELETE') {
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
