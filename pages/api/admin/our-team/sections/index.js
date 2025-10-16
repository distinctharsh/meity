import pool from '@/lib/db';

async function ensureTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS our_team_sections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      display_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

export default async function handler(req, res) {
  try { await ensureTables(); } catch (e) { console.error('ensureTables sections', e); }

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM our_team_sections ORDER BY display_order ASC, id ASC');
      return res.status(200).json(rows);
    } catch (e) {
      console.error('List sections error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, display_order, is_active = true } = req.body || {};
      if (!title) return res.status(400).json({ message: 'title is required' });
      let order = display_order;
      if (order == null || order === '') {
        const [r] = await pool.query('SELECT COALESCE(MAX(display_order), -1) AS maxo FROM our_team_sections');
        order = (r?.[0]?.maxo ?? -1) + 1;
      }
      const [ins] = await pool.query('INSERT INTO our_team_sections (title, display_order, is_active) VALUES (?, ?, ?)', [title, order, !!is_active]);
      return res.status(201).json({ id: ins.insertId });
    } catch (e) {
      console.error('Create section error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
