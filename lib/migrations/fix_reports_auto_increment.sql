-- Migration: Fix reports table auto-increment issue
-- Date: 2026-08-03
-- Description: Fix reports table to properly auto-generate IDs

-- This migration fixes the reports table where the id column was not properly configured
-- as AUTO_INCREMENT PRIMARY KEY, which caused issues when creating new reports.

-- For English Database (cabsec_cms)
USE cabsec_cms;

-- Remove any invalid entries first
DELETE FROM reports WHERE id IS NULL OR id = 0 OR id = '';

-- Modify id column to be NOT NULL AUTO_INCREMENT and add PRIMARY KEY
ALTER TABLE reports 
MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT,
ADD PRIMARY KEY (id);

-- For Hindi Database (cabsec_cms_hi)
USE cabsec_cms_hi;

-- Remove duplicate entries (keep the most recently updated ones)
DELETE r1 FROM reports r1
INNER JOIN reports r2 
WHERE r1.id = r2.id 
AND r1.updated_at < r2.updated_at;

-- Remove any invalid entries
DELETE FROM reports WHERE id IS NULL OR id = 0 OR id = '';

-- Modify id column to be NOT NULL AUTO_INCREMENT and add PRIMARY KEY
ALTER TABLE reports 
MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT,
ADD PRIMARY KEY (id);

-- Verification queries (run these to verify the fix)
-- SHOW CREATE TABLE reports;
-- SELECT MAX(id) as max_id FROM reports;
-- INSERT INTO reports (title, type, year, display_order, is_active) VALUES ('Test', 'pdf', 2026, 999, 1);
-- SELECT LAST_INSERT_ID();
-- DELETE FROM reports WHERE id = LAST_INSERT_ID();