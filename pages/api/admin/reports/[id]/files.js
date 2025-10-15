import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid report ID' });

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT id, original_name, file_url, file_type, file_size, created_at FROM report_files WHERE report_id = ? ORDER BY id ASC',
        [id]
      );
      return res.status(200).json(rows);
    } catch (e) {
      console.error('List report files error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const files = Array.isArray(body.files) ? body.files : [];
      if (!files.length) return res.status(400).json({ message: 'files array required' });

      const values = [];
      const params = [];
      for (const f of files) {
        const original_name = f.original_name || null;
        const file_url = f.file_url || null;
        const file_type = f.file_type || null;
        const file_size = f.file_size ?? null;
        if (!file_url) continue;
        values.push('(?, ?, ?, ?, ?)');
        params.push(id, original_name, file_url, file_type, file_size);
      }
      if (!values.length) return res.status(400).json({ message: 'No valid files to attach' });
      const sql = `INSERT INTO report_files (report_id, original_name, file_url, file_type, file_size) VALUES ${values.join(',')}`;
      await pool.query(sql, params);
      return res.status(201).json({ message: 'Files attached' });
    } catch (e) {
      console.error('Attach report files error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
