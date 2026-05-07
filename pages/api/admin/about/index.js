import pool from '@/lib/db';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'about');

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
  // Drop old table if it has ENUM content_type (causes issues)
  try {
    const [cols] = await pool.query("SHOW COLUMNS FROM about_content LIKE 'content_type'");
    if (cols.length > 0 && cols[0].Type && cols[0].Type.includes('enum')) {
      await pool.query('DROP TABLE about_content');
    }
  } catch (e) {
    // Table doesn't exist yet, that's fine
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS about_content (
      id INT AUTO_INCREMENT PRIMARY KEY,
      section_key VARCHAR(100) NOT NULL UNIQUE,
      title VARCHAR(255) NULL,
      content LONGTEXT NULL,
      content_type VARCHAR(50) DEFAULT 'text',
      display_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      file_url VARCHAR(500) NULL,
      file_size VARCHAR(50) NULL,
      file_name VARCHAR(255) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const safeAlter = async (sql) => {
    try { await pool.query(sql); } catch (e) { if (e?.code !== 'ER_DUP_FIELDNAME') console.log('alter:', e.message); }
  };
  await safeAlter('ALTER TABLE about_content ADD COLUMN file_name VARCHAR(255) NULL');
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
  try { await ensureTable(); } catch (e) {
    console.error('ensureTable failed', e);
    return res.status(500).json({ message: 'Database setup failed', error: e.message });
  }

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM about_content WHERE is_active = 1 ORDER BY display_order ASC, section_key ASC'
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

      const section_key = req.body.section_key;
      const title = req.body.title;
      const content = req.body.content;
      const content_type = req.body.content_type || 'text';
      const display_order = req.body.display_order;
      const is_active = req.body.is_active !== 'false';

      let file_url = null, file_size = null, file_name = null;

      if (req.file) {
        file_url = `/uploads/about/${req.file.filename}`;
        file_size = `${(req.file.size / 1024).toFixed(2)} KB`;
        file_name = req.file.originalname;
      }

      if (!section_key) return res.status(400).json({ message: 'section_key is required' });

      let finalOrder = display_order;
      if (typeof finalOrder === 'undefined' || finalOrder === null || finalOrder === '') {
        const [r] = await pool.query('SELECT COALESCE(MAX(display_order), -1) AS max_order FROM about_content');
        finalOrder = (r?.[0]?.max_order ?? -1) + 1;
      }

      const [ins] = await pool.query(
        'INSERT INTO about_content (section_key, title, content, content_type, display_order, is_active, file_url, file_size, file_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [section_key, title, content, content_type, finalOrder, !!is_active, file_url, file_size, file_name]
      );
      return res.status(201).json({ id: ins.insertId });
    } catch (e) {
      console.error('POST error', e);
      if (e.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'section_key already exists' });
      return res.status(500).json({ message: 'Internal server error', error: e.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
