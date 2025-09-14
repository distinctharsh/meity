-- Migration script to remove content field from announcements table
-- Run this SQL script to update existing database

-- Remove content field from announcements table
ALTER TABLE announcements DROP COLUMN content;

-- Verify the table structure
DESCRIBE announcements;
