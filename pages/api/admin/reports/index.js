import pool from '@/lib/db';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT id, title, type, year, size, file_url, item_count, display_order, is_active, created_at, updated_at FROM reports ORDER BY display_order ASC, created_at DESC'
      );
      return res.status(200).json(rows);
    } catch (e) {
      console.error('List reports error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, type, year, size = null, file_url = null, item_count = null, is_active = true } = req.body || {};
      if (!title) return res.status(400).json({ message: 'title is required' });
      // Defaults: type -> 'pdf'; year -> current year if not provided
      const nowYear = new Date().getFullYear();
      let finalType = (typeof type === 'string' && type) ? type : undefined;
      if (!finalType) {
        const u = (file_url || '').toLowerCase();
        if (u.endsWith('.pdf')) finalType = 'pdf';
        else if (u) finalType = 'link';
        else finalType = 'pdf';
      }
      const finalYear = (year === 0 || year === null || typeof year === 'undefined' || year === '') ? nowYear : year;

      // Auto-compute size if not provided and file_url points to a local file
      let finalSize = size;
      try {
        if (!finalSize && typeof file_url === 'string' && file_url) {
          // Support paths like /report_document/..., /uploads/..., or absolute public paths
          // On Windows, path.join ignores previous segments if rel startswith '/'
          // so ensure rel has no leading slash
          let rel = file_url.startsWith('/') ? file_url.slice(1) : file_url;
          // next.js serves from projectRoot/public
          const projectRoot = process.cwd();
          const localPath = path.join(projectRoot, 'public', rel);
          if (fs.existsSync(localPath)) {
            const st = fs.statSync(localPath);
            if (st.isFile()) {
              const kb = st.size / 1024;
              finalSize = `${kb.toFixed(2)} KB`;
            }
          }
        }
      } catch {}
      const [orows] = await pool.query('SELECT COALESCE(MAX(display_order), -1) AS max_order FROM reports');
      const nextOrder = (orows?.[0]?.max_order ?? -1) + 1;
      const [result] = await pool.query(
        'INSERT INTO reports (title, type, year, size, file_url, item_count, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, finalType, finalYear, finalSize, file_url, item_count, nextOrder, !!is_active]
      );
      return res.status(201).json({ id: result.insertId, message: 'Report created' });
    } catch (e) {
      console.error('Create report error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
