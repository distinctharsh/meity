-- Offerings single setup (idempotent)

CREATE TABLE IF NOT EXISTS offerings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  schemes JSON NULL,
  vacancies JSON NULL,
  whats_new JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ensure JSON columns exist (safe on re-run; for MySQL < 8 you may need to check before adding)
ALTER TABLE offerings
  ADD COLUMN IF NOT EXISTS schemes JSON NULL;
ALTER TABLE offerings
  ADD COLUMN IF NOT EXISTS vacancies JSON NULL;
ALTER TABLE offerings
  ADD COLUMN IF NOT EXISTS whats_new JSON NULL;
