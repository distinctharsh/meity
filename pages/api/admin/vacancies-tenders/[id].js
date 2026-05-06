import pool from '@/lib/db';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'vacancies-tenders');

// Multer config
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
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

// Disable Next.js body parser so multer can handle it
export const config = {
  api: { bodyParser: false },
};

// Helper to run middleware as promise
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

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM vacancies_tenders WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Item not found' });
      }

      return res.status(200).json(rows[0]);
    } catch (e) {
      console.error('GET error', e);
      return res.status(500).json({ message: 'Internal server error', error: e.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      // Parse multipart form with multer
      await runMiddleware(req, res, upload.single('file'));

      const title = req.body.title;
      const type = req.body.type || 'vacancy';
      const description = req.body.description || '';
      const published_date = req.body.published_date || null;
      const closing_date = req.body.closing_date || null;
      const is_active = req.body.is_active !== 'false';
      const is_archived = req.body.is_archived === 'true';

      let file_url = null;
      let file_size = null;

      if (req.file) {
        file_url = `/uploads/vacancies-tenders/${req.file.filename}`;
        file_size = `${(req.file.size / 1024).toFixed(2)} KB`;
      }

      // Build update query dynamically based on provided fields
      const updateFields = [];
      const updateValues = [];

      if (title !== undefined) {
        updateFields.push('title = ?');
        updateValues.push(title);
      }
      if (type !== undefined) {
        updateFields.push('type = ?');
        updateValues.push(type);
      }
      if (description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(description);
      }
      if (published_date !== undefined) {
        updateFields.push('published_date = ?');
        updateValues.push(published_date);
      }
      if (closing_date !== undefined) {
        updateFields.push('closing_date = ?');
        updateValues.push(closing_date);
      }
      if (file_url !== null) {
        updateFields.push('file_url = ?, file_size = ?');
        updateValues.push(file_url, file_size);
      }
      if (is_active !== undefined) {
        updateFields.push('is_active = ?');
        updateValues.push(!!is_active);
      }
      if (is_archived !== undefined) {
        updateFields.push('is_archived = ?');
        updateValues.push(!!is_archived);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
      }

      updateFields.push('updated_at = NOW()');
      updateValues.push(id);

      const [result] = await pool.query(
        `UPDATE vacancies_tenders SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Item not found' });
      }

      return res.status(200).json({ message: 'Item updated successfully' });
    } catch (e) {
      console.error('PUT error', e);
      return res.status(500).json({ message: 'Internal server error', error: e.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const [result] = await pool.query(
        'DELETE FROM vacancies_tenders WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Item not found' });
      }

      return res.status(200).json({ message: 'Item deleted successfully' });
    } catch (e) {
      console.error('DELETE error', e);
      return res.status(500).json({ message: 'Internal server error', error: e.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
