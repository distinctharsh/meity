-- Add nav_link column to reports table so reports can be associated with a navigation link
ALTER TABLE reports
  ADD COLUMN IF NOT EXISTS nav_link VARCHAR(255) NULL AFTER file_url;

-- Optional: create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_reports_nav_link ON reports(nav_link);
