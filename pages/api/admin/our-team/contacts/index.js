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
  await pool.query(`
    CREATE TABLE IF NOT EXISTS our_team_contacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      person_id INT NOT NULL,
      type ENUM('phone','fax','email') NOT NULL,
      value VARCHAR(255) NOT NULL,
      display_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_contacts_person FOREIGN KEY (person_id) REFERENCES our_team_people(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

export default async function handler(req, res) {
  try { await ensureTables(); } catch (e) { console.error('ensureTables contacts', e); }

  if (req.method === 'GET') {
    try {
      const { person_id } = req.query;
      if (person_id) {
        const [rows] = await pool.query('SELECT * FROM our_team_contacts WHERE person_id = ? ORDER BY display_order ASC, id ASC', [person_id]);
        return res.status(200).json(rows);
      }
      const [rows] = await pool.query('SELECT * FROM our_team_contacts ORDER BY person_id ASC, display_order ASC, id ASC');
      return res.status(200).json(rows);
    } catch (e) {
      console.error('List contacts error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { person_id, type, value, display_order, is_active = true } = req.body || {};
      if (!person_id || !type || !value) return res.status(400).json({ message: 'person_id, type, value are required' });
      const allowed = ['phone','fax','email'];
      if (!allowed.includes(String(type))) return res.status(400).json({ message: 'invalid type' });
      let order = display_order;
      if (order == null || order === '') {
        const [r] = await pool.query('SELECT COALESCE(MAX(display_order), -1) AS maxo FROM our_team_contacts WHERE person_id = ?', [person_id]);
        order = (r?.[0]?.maxo ?? -1) + 1;
      }
      const [ins] = await pool.query(
        'INSERT INTO our_team_contacts (person_id, type, value, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
        [person_id, type, value, order, !!is_active]
      );
      return res.status(201).json({ id: ins.insertId });
    } catch (e) {
      console.error('Create contact error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
