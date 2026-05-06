import pool from '@/lib/db';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'about');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }
});

export const config = {
  api: { bodyParser: false },
};

const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      resolve(result);
    });
  });
};

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Valid ID required' });
  }

  if (req.method === 'PUT') {
    try {
      await runMiddleware(req, res, upload.single('file'));

      const section_key = req.body.section_key;
      const title = req.body.title;
      const content = req.body.content;
      const content_type = req.body.content_type;
      const display_order = req.body.display_order;
      const is_active = req.body.is_active !== 'false';
      let file_url = req.body.file_url || null;
      let file_size = req.body.file_size || null;
      let file_name = req.body.file_name || null;

      if (req.file) {
        file_url = `/uploads/about/${req.file.filename}`;
        file_size = `${(req.file.size / 1024).toFixed(2)} KB`;
        file_name = req.file.originalname;
      }

      if (!section_key) return res.status(400).json({ message: 'section_key is required' });

      const [result] = await pool.query(
        'UPDATE about_content SET section_key = ?, title = ?, content = ?, content_type = ?, display_order = ?, is_active = ?, file_url = ?, file_size = ?, file_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [section_key, title, content, content_type, display_order, is_active, file_url, file_size, file_name, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'About content not found' });
      }

      return res.status(200).json({ message: 'Updated successfully' });
    } catch (e) {
      console.error('Update about_content error', e);
      if (e.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'section_key already exists' });
      }
      return res.status(500).json({ message: 'Internal server error', error: e.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const [result] = await pool.query('DELETE FROM about_content WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'About content not found' });
      }

      return res.status(200).json({ message: 'Deleted successfully' });
    } catch (e) {
      console.error('Delete about_content error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
