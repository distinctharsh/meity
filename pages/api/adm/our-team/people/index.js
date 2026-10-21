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
  await pool.query(`
    CREATE TABLE IF NOT EXISTS our_team_people (
      id INT AUTO_INCREMENT PRIMARY KEY,
      section_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      designation VARCHAR(1000) DEFAULT NULL,
      address TEXT DEFAULT NULL,
      display_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_people_section FOREIGN KEY (section_id) REFERENCES our_team_sections(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

export default async function handler(req, res) {
  try { await ensureTables(); } catch (e) { console.error('ensureTables people', e); }

  if (req.method === 'GET') {
    try {
      const { section_id } = req.query;
      if (section_id) {
        const [rows] = await pool.query('SELECT * FROM our_team_people WHERE section_id = ? ORDER BY display_order ASC, id ASC', [section_id]);
        return res.status(200).json(rows);
      }
      const [rows] = await pool.query('SELECT * FROM our_team_people ORDER BY section_id ASC, display_order ASC, id ASC');
      return res.status(200).json(rows);
    } catch (e) {
      console.error('List people error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { section_id, name, designation = '', address = '', display_order, is_active = true } = req.body || {};
      if (!section_id || !name) return res.status(400).json({ message: 'section_id and name are required' });
      let order = display_order;
      if (order == null || order === '') {
        const [r] = await pool.query('SELECT COALESCE(MAX(display_order), -1) AS maxo FROM our_team_people WHERE section_id = ?', [section_id]);
        order = (r?.[0]?.maxo ?? -1) + 1;
      }
      const [ins] = await pool.query(
        'INSERT INTO our_team_people (section_id, name, designation, address, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [section_id, name, designation, address, order, !!is_active]
      );
      return res.status(201).json({ id: ins.insertId });
    } catch (e) {
      console.error('Create person error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
