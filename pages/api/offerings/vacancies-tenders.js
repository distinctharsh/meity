import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if vacancies_tenders table exists, if not create it
    await ensureTable();

    const [rows] = await pool.query(`
      SELECT 
        id,
        title,
        type,
        YEAR(published_date) as year,
        file_url,
        file_size as size,
        closing_date,
        is_archived,
        created_at,
        updated_at,
        (SELECT COUNT(*) FROM vacancies_tenders_files WHERE vacancies_tenders_id = id) as files_count
      FROM vacancies_tenders 
      WHERE is_active = 1 
      ORDER BY published_date DESC, created_at DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching vacancies and tenders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

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

  // Add indexes for better performance
  try {
    await pool.query('CREATE INDEX idx_vacancies_tenders_type ON vacancies_tenders(type)');
    await pool.query('CREATE INDEX idx_vacancies_tenders_published ON vacancies_tenders(published_date)');
    await pool.query('CREATE INDEX idx_vacancies_tenders_active ON vacancies_tenders(is_active, is_archived)');
  } catch (e) {
    // Index might already exist, ignore error
  }

  // Insert sample data for testing
  const [count] = await pool.query('SELECT COUNT(*) as count FROM vacancies_tenders');
  if (count[0].count === 0) {
    await pool.query(`
      INSERT INTO vacancies_tenders (title, type, published_date, closing_date, file_url, file_size) VALUES
      ('Senior Software Engineer Position', 'vacancy', '2025-01-15', '2025-02-15', '/uploads/vacancies/software-engineer.pdf', '245 KB'),
      ('IT Infrastructure Tender', 'tender', '2025-01-10', '2025-02-28', '/uploads/tenders/it-infrastructure.pdf', '1.2 MB'),
      ('Data Analyst Vacancy', 'vacancy', '2025-01-08', '2025-01-31', '/uploads/vacancies/data-analyst.pdf', '180 KB'),
      ('Network Equipment Procurement', 'tender', '2025-01-05', '2025-03-15', '/uploads/tenders/network-equipment.pdf', '890 KB'),
      ('Multiple Positions - Cabinet Secretariat', 'group', '2025-01-03', '2025-02-10', '/uploads/vacancies/multiple-positions.pdf', '2.1 MB')
    `);
  }
}
