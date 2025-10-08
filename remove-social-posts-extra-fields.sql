-- Migration: drop unnecessary fields from social_media_posts
-- Run this on your MySQL/MariaDB database used by the app.

ALTER TABLE social_media_posts 
  DROP COLUMN IF EXISTS content,
  DROP COLUMN IF EXISTS image_url;

-- Verify
DESCRIBE social_media_posts;
