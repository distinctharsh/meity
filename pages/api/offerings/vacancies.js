import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Ensure table exists with correct schema
    await ensureTable();

    // Get query parameters
    const { archived } = req.query;
    const showArchived = archived === 'true';

    const targetStatus = showArchived ? 2 : 1;

    const [rows] = await pool.query(`
      SELECT
        id,
        title,
        description,
        type,
        YEAR(published_date) AS year,
        file_name, -- Aapke kahe mutabik file_name hi rakha hai
        file_size AS size,
        published_date,
        due_date,
        is_active,
        created_at,
        updated_at
      FROM vacancies_tenders
      WHERE type = 'vacancy'
        AND is_active = ?
      ORDER BY published_date DESC, created_at DESC
    `, [targetStatus]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching vacancies:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

async function ensureTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vacancies_tenders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type ENUM('vacancy', 'tender', 'group') DEFAULT 'vacancy',
        description TEXT NULL,
        tender_id VARCHAR(50) NULL,
        published_date DATE NULL,
        due_date DATE NULL,
        file_name VARCHAR(255) NULL, 
        file_size VARCHAR(50) NULL,
        is_active INT DEFAULT 1, 
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);

    try {
      await pool.query("ALTER TABLE vacancies_tenders MODIFY COLUMN is_active INT DEFAULT 1");
    } catch (e) {
      // Ignore error
    }

    // Unused indexes and tables clean up safely
    try {
      await pool.query('DROP TABLE IF EXISTS vacancies_tenders_files');
    } catch (e) {}

    try {
      await pool.query('CREATE INDEX idx_vacancies_tenders_type ON vacancies_tenders(type)');
      await pool.query('CREATE INDEX idx_vacancies_tenders_published ON vacancies_tenders(published_date)');
      await pool.query('CREATE INDEX idx_vacancies_tenders_active ON vacancies_tenders(is_active)');
    } catch (e) {}
  } catch (error) {
    console.error('Error ensuring table:', error);
  }
}