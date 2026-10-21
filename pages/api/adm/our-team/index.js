import pool from '@/lib/db';

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS our_team (
      id INT AUTO_INCREMENT PRIMARY KEY,
      role VARCHAR(50) NOT NULL,
      name VARCHAR(255) NOT NULL,
      designation VARCHAR(500) NULL,
      photo_url VARCHAR(500) NULL,
      email VARCHAR(255) NULL,
      phone_primary VARCHAR(50) NULL,
      phone_secondary VARCHAR(50) NULL,
      profile_url VARCHAR(500) NULL,
      about_text TEXT NULL,
      office_title VARCHAR(255) NULL,
      office_name VARCHAR(255) NULL,
      office_designation VARCHAR(255) NULL,
      office_phone1 VARCHAR(50) NULL,
      office_phone2 VARCHAR(50) NULL,
      office_email1 VARCHAR(255) NULL,
      office_email2 VARCHAR(255) NULL,
      office_fax VARCHAR(50) NULL,
      display_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Ensure columns exist for backward compatibility (works across MySQL/MariaDB)
  const safeAlter = async (sql) => {
    try { await pool.query(sql); } catch (e) { if (e && e.code === 'ER_DUP_FIELDNAME') {/* column already exists */} }
  };
  await safeAlter('ALTER TABLE our_team ADD COLUMN email VARCHAR(255) NULL');
  await safeAlter('ALTER TABLE our_team ADD COLUMN phone_primary VARCHAR(50) NULL');
  await safeAlter('ALTER TABLE our_team ADD COLUMN phone_secondary VARCHAR(50) NULL');
  await safeAlter('ALTER TABLE our_team ADD COLUMN profile_url VARCHAR(500) NULL');
  await safeAlter('ALTER TABLE our_team ADD COLUMN about_text TEXT NULL');
  await safeAlter('ALTER TABLE our_team ADD COLUMN office_title VARCHAR(255) NULL');
  await safeAlter('ALTER TABLE our_team ADD COLUMN office_name VARCHAR(255) NULL');
  await safeAlter('ALTER TABLE our_team ADD COLUMN office_designation VARCHAR(255) NULL');
  await safeAlter('ALTER TABLE our_team ADD COLUMN office_phone1 VARCHAR(50) NULL');
  await safeAlter('ALTER TABLE our_team ADD COLUMN office_phone2 VARCHAR(50) NULL');
  await safeAlter('ALTER TABLE our_team ADD COLUMN office_email1 VARCHAR(255) NULL');
  await safeAlter('ALTER TABLE our_team ADD COLUMN office_email2 VARCHAR(255) NULL');
  await safeAlter('ALTER TABLE our_team ADD COLUMN office_fax VARCHAR(50) NULL');
}

export default async function handler(req, res) {
  try { await ensureTable(); } catch (e) { console.error('ensureTable failed', e); }

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT id, role, name, designation, photo_url, email, phone_primary, phone_secondary, profile_url, about_text, office_title, office_name, office_designation, office_phone1, office_phone2, office_email1, office_email2, office_fax, display_order, is_active, created_at, updated_at FROM our_team ORDER BY display_order ASC, created_at DESC'
      );
      return res.status(200).json(rows);
    } catch (e) {
      console.error('List our_team error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, designation = '', photo_url = '', email = '', phone_primary = '', phone_secondary = '', profile_url = '', about_text = '', office_title = '', office_name = '', office_designation = '', office_phone1 = '', office_phone2 = '', office_email1 = '', office_email2 = '', office_fax = '', display_order, is_active = true } = req.body || {};
      if (!name) return res.status(400).json({ message: 'name is required' });

      let finalOrder = display_order;
      if (typeof finalOrder === 'undefined' || finalOrder === null || finalOrder === '') {
        const [r] = await pool.query('SELECT COALESCE(MAX(display_order), -1) AS max_order FROM our_team');
        finalOrder = (r?.[0]?.max_order ?? -1) + 1;
      }

      const [ins] = await pool.query(
        'INSERT INTO our_team (role, name, designation, photo_url, email, phone_primary, phone_secondary, profile_url, about_text, office_title, office_name, office_designation, office_phone1, office_phone2, office_email1, office_email2, office_fax, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        ['', name, designation, photo_url, email, phone_primary, phone_secondary, profile_url, about_text, office_title, office_name, office_designation, office_phone1, office_phone2, office_email1, office_email2, office_fax, finalOrder, !!is_active]
      );
      return res.status(201).json({ id: ins.insertId });
    } catch (e) {
      console.error('Create our_team error', e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
