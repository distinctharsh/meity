-- Add nav_item_id column to reports, backfill from nav_link, and index
ALTER TABLE reports
  ADD COLUMN IF NOT EXISTS nav_item_id INT NULL AFTER file_url;

-- Backfill nav_item_id by matching navigation_items.link (tolerate leading/trailing slashes)
UPDATE reports r
JOIN navigation_items n ON (
  (r.nav_link = n.link)
  OR (TRIM(LEADING '/' FROM r.nav_link) = TRIM(LEADING '/' FROM n.link))
  OR (r.nav_link = TRIM(LEADING '/' FROM n.link))
  OR (TRIM(LEADING '/' FROM r.nav_link) = n.link)
)
SET r.nav_item_id = n.id
WHERE r.nav_link IS NOT NULL AND r.nav_link <> '';

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_reports_nav_item_id ON reports(nav_item_id);

-- Optional: after verifying data and code, you may DROP the old nav_link column
-- ALTER TABLE reports DROP COLUMN IF EXISTS nav_link;

-- Note: run this migration once. Verify results before dropping `nav_link`.
