-- =====================================================
-- DATABASE SETUP FOR PHOTOS AND VIDEOS GALLERIES
-- =====================================================
-- Run these queries in your MySQL database manually

-- 1. CREATE PHOTO GALLERIES TABLE
CREATE TABLE IF NOT EXISTS `photo_galleries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `alt_text` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2. CREATE VIDEOS TABLE
CREATE TABLE IF NOT EXISTS `videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `video_url` text NOT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `alt_text` text DEFAULT NULL,
  `thumbnail_url` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- SAMPLE DATA INSERTION (OPTIONAL)
-- =====================================================

-- 3. INSERT SAMPLE PHOTO GALLERIES
INSERT INTO `photo_galleries` (`title`, `date`, `images`, `alt_text`) VALUES
('Special Campaign', '2024-03-16', 
 '[{"url": "https://www.meity.gov.in/static/uploads/2024/02/WhatsApp-Image-2022-10-28-at-3.10.46-PM-768x512.jpeg", "alt": "Special Campaign Image having Minister of Cabinet Secretariat"}]', 
 'Special Campaign Image having Minister of Cabinet Secretariat'),
('FIT India Freedom Run 2.0', '2022-11-03', 
 '[{"url": "https://www.meity.gov.in/static/uploads/2024/02/WhatsApp-Image-2022-10-4-768x512.jpeg", "alt": "FIT India Freedom Run 2.0"}]', 
 'FIT India Freedom Run 2.0'),
('Fire Hydrant Check', '2022-11-01', 
 '[{"url": "https://www.meity.gov.in/static/uploads/2024/02/WhatsApp-Image-2022-10-29--768x432.jpeg", "alt": "Fire Hydrant Check"}]', 
 'Fire Hydrant Check'),
('Dengue Smoke Fogging', '2022-11-01', 
 '[{"url": "https://www.meity.gov.in/static/uploads/2024/02/ba2f00d153a139202836b88804bc7ab9-768x432.jpeg", "alt": "Dengue Smoke Fogging"}]', 
 'Dengue Smoke Fogging'),
('Blood Donation Camp', '2022-11-01', 
 '[{"url": "https://www.meity.gov.in/static/uploads/2024/02/WhatsApp-Image-2022-10-28-at-5.3-768x512.jpeg", "alt": "Blood Donation Camp"}]', 
 'Blood Donation Camp');

-- 4. INSERT SAMPLE VIDEOS
INSERT INTO `videos` (`title`, `date`, `video_url`, `duration`, `alt_text`, `thumbnail_url`) VALUES
('Kaushal Deekshant Samaroh', '2024-03-16', 
 'https://www.youtube.com/embed/kAKsKu_cy2k', 
 '1H 30Mins', 
 'Special Campaign Video', 
 'https://img.youtube.com/vi/kAKsKu_cy2k/maxresdefault.jpg');

-- =====================================================
-- TEST QUERIES (TO VERIFY DATA)
-- =====================================================

-- 5. TEST: Get all photo galleries
SELECT id, title, date, 
       JSON_LENGTH(images) as image_count,
       alt_text, 
       created_at 
FROM photo_galleries 
ORDER BY date DESC, created_at DESC;

-- 6. TEST: Get all videos
SELECT id, title, date, video_url, duration, alt_text, thumbnail_url, created_at 
FROM videos 
ORDER BY date DESC, created_at DESC;

-- 7. TEST: Get specific photo gallery with parsed images
SELECT id, title, date, 
       JSON_EXTRACT(images, '$[0].url') as first_image_url,
       JSON_EXTRACT(images, '$[0].alt') as first_image_alt,
       alt_text 
FROM photo_galleries 
WHERE id = 1;

-- =====================================================
-- COMMON ADMIN OPERATIONS
-- =====================================================

-- 8. UPDATE PHOTO GALLERY EXAMPLE
UPDATE photo_galleries 
SET title = 'Updated Gallery Title',
    images = '[{"url": "new-image-url.jpg", "alt": "New image alt text"}]',
    alt_text = 'Updated alt text',
    updated_at = NOW()
WHERE id = 1;

-- 9. UPDATE VIDEO EXAMPLE
UPDATE videos 
SET title = 'Updated Video Title',
    video_url = 'https://www.youtube.com/embed/new-video-id',
    duration = '2H 15Mins',
    thumbnail_url = 'https://img.youtube.com/vi/new-video-id/maxresdefault.jpg',
    updated_at = NOW()
WHERE id = 1;

-- 10. DELETE OPERATIONS
DELETE FROM photo_galleries WHERE id = 1;
DELETE FROM videos WHERE id = 1;

-- =====================================================
-- INDEXES FOR BETTER PERFORMANCE (OPTIONAL)
-- =====================================================

-- 11. Add indexes for better performance
CREATE INDEX idx_photo_galleries_date ON photo_galleries(date);
CREATE INDEX idx_photo_galleries_created ON photo_galleries(created_at);
CREATE INDEX idx_videos_date ON videos(date);
CREATE INDEX idx_videos_created ON videos(created_at);

-- =====================================================
-- CLEANUP (IF NEEDED)
-- =====================================================

-- 12. Drop tables if you need to reset everything
-- DROP TABLE IF EXISTS photo_galleries;
-- DROP TABLE IF EXISTS videos;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- 13. Check table structure
DESCRIBE photo_galleries;
DESCRIBE videos;

-- 14. Count records
SELECT COUNT(*) as photo_galleries_count FROM photo_galleries;
SELECT COUNT(*) as videos_count FROM videos;
