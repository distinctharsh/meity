-- Update Vacancies & Tenders Schema
-- This script updates the database structure to match the new requirements

-- Drop existing tables if they exist
DROP TABLE IF EXISTS vacancies_tenders_files;
DROP TABLE IF EXISTS vacancies_tenders;

-- Create new vacancies_tenders table with clean structure (no file_url, only file upload)
CREATE TABLE vacancies_tenders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type ENUM('vacancy', 'tender') NOT NULL DEFAULT 'vacancy',
  description TEXT NULL,
  tender_id VARCHAR(50) NULL, -- For tenders only (e.g., CABSEC-2020)
  published_date DATE DEFAULT CURRENT_DATE,
  due_date DATE NULL, -- For tenders (closing date)
  file_name VARCHAR(255) NULL, -- Stored uploaded file name
  file_size VARCHAR(50) NULL, -- File size display (e.g., "245 KB")
  is_active BOOLEAN DEFAULT 1,
  is_archived BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Add indexes for better performance
CREATE INDEX idx_vacancies_tenders_type ON vacancies_tenders(type);
CREATE INDEX idx_vacancies_tenders_published ON vacancies_tenders(published_date);
CREATE INDEX idx_vacancies_tenders_active ON vacancies_tenders(is_active, is_archived);

-- Insert sample data for Tenders (without file URLs - will be uploaded via admin)
INSERT INTO vacancies_tenders (title, type, tender_id, published_date, due_date, file_name, file_size) VALUES
('Tenders (2020)', 'tender', 'CABSEC-2020', '2020-11-06', '2020-11-06', NULL, NULL),
('IT Infrastructure Tender', 'tender', 'CABSEC-2025-01', '2025-01-10', '2025-02-28', NULL, NULL),
('Network Equipment Procurement', 'tender', 'CABSEC-2025-02', '2025-01-05', '2025-03-15', NULL, NULL);

-- Insert sample data for Vacancies (without file URLs - will be uploaded via admin)
INSERT INTO vacancies_tenders (title, type, description, published_date, file_name, file_size) VALUES
('Senior Software Engineer Position', 'vacancy', 'We are looking for an experienced software engineer to join our team...', '2025-01-15', NULL, NULL),
('Data Analyst Vacancy', 'vacancy', 'Data analyst position with expertise in statistical analysis and reporting...', '2025-01-08', NULL, NULL),
('System Administrator Role', 'vacancy', 'System administrator responsible for managing and maintaining IT infrastructure...', '2025-01-12', NULL, NULL);
