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

    const [rows] = await pool.query(`
      SELECT 
        id,
        title,
        description,
        type,
        YEAR(published_date) as year,
        file_name,
        file_size as size,
        published_date,
        due_date,
        is_archived,
        created_at,
        updated_at
      FROM vacancies_tenders 
      WHERE is_active = 1 AND type = 'vacancy' AND is_archived = ?
      ORDER BY published_date DESC, created_at DESC
    `, [showArchived ? 1 : 0]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching vacancies:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

async function ensureTable() {
  try {
    // Create table with NEW schema (file_name instead of file_url)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vacancies_tenders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type ENUM('vacancy', 'tender') NOT NULL DEFAULT 'vacancy',
        description TEXT NULL,
        tender_id VARCHAR(50) NULL,
        published_date DATE DEFAULT CURRENT_DATE,
        closing_date DATE NULL,
        file_name VARCHAR(255) NULL,
        file_size VARCHAR(50) NULL,
        is_active BOOLEAN DEFAULT 1,
        is_archived BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);

    // Drop old unused table if exists
    try {
      await pool.query('DROP TABLE IF EXISTS vacancies_tenders_files');
    } catch (e) {
      // Ignore error
    }

    // Add indexes for better performance
    try {
      await pool.query('CREATE INDEX idx_vacancies_tenders_type ON vacancies_tenders(type)');
      await pool.query('CREATE INDEX idx_vacancies_tenders_published ON vacancies_tenders(published_date)');
      await pool.query('CREATE INDEX idx_vacancies_tenders_active ON vacancies_tenders(is_active, is_archived)');
    } catch (e) {
      // Index might already exist, ignore error
    }
  } catch (error) {
    console.error('Error ensuring table:', error);
  }
}
