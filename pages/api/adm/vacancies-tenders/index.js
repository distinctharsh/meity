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

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vacancies_tenders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      type ENUM('vacancy', 'tender', 'group') DEFAULT 'vacancy',
      description TEXT NULL,
      published_date DATE DEFAULT CURRENT_DATE,
      closing_date DATE NULL,
      file_url VARCHAR(500) NULL,
      file_size VARCHAR(50) NULL,
      is_active BOOLEAN DEFAULT 1,
      is_archived BOOLEAN DEFAULT 0,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS vacancies_tenders_files (
      id INT AUTO_INCREMENT PRIMARY KEY,
      vacancies_tenders_id INT NOT NULL,
      filename VARCHAR(255) NOT NULL,
      file_url VARCHAR(500) NOT NULL,
      file_size VARCHAR(50) NULL,
      file_type VARCHAR(50) DEFAULT 'pdf',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vacancies_tenders_id) REFERENCES vacancies_tenders(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);
}

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
  try { 
    await ensureTable(); 
  } catch (e) {
    console.error('ensureTable failed', e);
    return res.status(500).json({ message: 'Database setup failed', error: e.message });
  }

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM vacancies_tenders ORDER BY published_date DESC, created_at DESC'
      );
      return res.status(200).json(rows);
    } catch (e) {
      console.error('GET error', e);
      return res.status(500).json({ message: 'Internal server error', error: e.message });
    }
  }

  if (req.method === 'POST') {
    try {
      // Parse multipart form with multer
      await runMiddleware(req, res, upload.single('file'));

      const title = req.body.title;
      const type = req.body.type || 'vacancy';
      const description = req.body.description || '';
      const published_date = req.body.published_date || new Date().toISOString().split('T')[0];
      const closing_date = req.body.closing_date || null;
      const is_active = req.body.is_active !== 'false';
      const is_archived = req.body.is_archived === 'true';

      let file_url = null;
      let file_size = null;

      if (req.file) {
        file_url = `/uploads/vacancies-tenders/${req.file.filename}`;
        file_size = `${(req.file.size / 1024).toFixed(2)} KB`;
      }

      if (!title) {
        return res.status(400).json({ message: 'title is required' });
      }

      const [ins] = await pool.query(
        'INSERT INTO vacancies_tenders (title, type, description, published_date, closing_date, file_url, file_size, is_active, is_archived) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [title, type, description, published_date, closing_date, file_url, file_size, !!is_active, !!is_archived]
      );

      return res.status(201).json({ id: ins.insertId });
    } catch (e) {
      console.error('POST error', e);
      return res.status(500).json({ message: 'Internal server error', error: e.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
