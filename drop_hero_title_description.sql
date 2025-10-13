-- Migration: drop title and description from hero_slides
-- Run this against your existing database after deploying code changes.

ALTER TABLE hero_slides
  DROP COLUMN IF EXISTS title,
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS link_text;
