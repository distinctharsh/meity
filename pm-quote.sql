-- PM Quote single setup (idempotent)

-- 1) Ensure table exists with core columns
CREATE TABLE IF NOT EXISTS pm_quotes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote_text TEXT NOT NULL,
  author VARCHAR(255) DEFAULT 'Prime Minister',
  image_url VARCHAR(500),
  event_url VARCHAR(500),
  quote_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2) Make sure optional columns exist (safe on re-run)
ALTER TABLE pm_quotes
  ADD COLUMN IF NOT EXISTS event_url VARCHAR(500) NULL AFTER image_url;

ALTER TABLE pm_quotes
  ADD COLUMN IF NOT EXISTS quote_date DATE NULL AFTER event_url;

-- 3) Remove old/unused columns if present (requires MySQL 8.0.19+)
ALTER TABLE pm_quotes
  DROP COLUMN IF EXISTS is_active,
  DROP COLUMN IF EXISTS display_order;
