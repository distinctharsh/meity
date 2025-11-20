-- Dumping database structure for cabsec_cms
CREATE DATABASE IF NOT EXISTS `cabsec_cms` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `cabsec_cms`;

-- Dumping structure for table cabsec_cms.announcements
CREATE TABLE IF NOT EXISTS `announcements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `link_url` varchar(500) DEFAULT NULL,
  `link_text` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping structure for table cabsec_cms.cms_users
CREATE TABLE IF NOT EXISTS `cms_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('super_admin','admin','editor') DEFAULT 'editor',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping structure for table cabsec_cms.hero_slides
CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image_url` varchar(500) NOT NULL,
  `link_url` varchar(500) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping structure for table cabsec_cms.media_library
CREATE TABLE IF NOT EXISTS `media_library` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_type` varchar(100) NOT NULL,
  `file_size` int(11) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `caption` text DEFAULT NULL,
  `uploaded_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `media_library_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `cms_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping structure for table cabsec_cms.navigation_items
CREATE TABLE IF NOT EXISTS `navigation_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `navigation_items_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `navigation_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping structure for table cabsec_cms.offerings
CREATE TABLE IF NOT EXISTS `offerings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `link_url` varchar(500) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `schemes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`schemes`)),
  `vacancies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`vacancies`)),
  `whats_new` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`whats_new`)),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping structure for table cabsec_cms.pages
CREATE TABLE IF NOT EXISTS `pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `hero_title` varchar(255) DEFAULT NULL,
  `hero_subtitle` varchar(500) DEFAULT NULL,
  `hero_image_url` varchar(500) DEFAULT NULL,
  `tabs_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tabs_json`)),
  `content_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`content_json`)),
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_slug` (`slug`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `pages_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `pages` (`id`) ON DELETE SET NULL,
  
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping structure for table cabsec_cms.page_headers
CREATE TABLE IF NOT EXISTS `page_headers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_path` varchar(255) NOT NULL,
  `background_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `page_path` (`page_path`),
  KEY `idx_page_headers_path` (`page_path`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping structure for table cabsec_cms.pm_quotes
CREATE TABLE IF NOT EXISTS `pm_quotes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quote_text` text NOT NULL,
  `author` varchar(255) DEFAULT 'Prime Minister',
  `image_url` varchar(500) DEFAULT NULL,
  `event_url` varchar(500) DEFAULT NULL,
  `quote_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping structure for table cabsec_cms.recent_docs
CREATE TABLE IF NOT EXISTS `recent_docs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(500) NOT NULL,
  `description` text NOT NULL,
  `link_url` varchar(1000) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping structure for table cabsec_cms.reports
CREATE TABLE IF NOT EXISTS `reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(500) NOT NULL,
  `type` enum('pdf','group','link') NOT NULL DEFAULT 'pdf',
  `year` int(11) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `file_url` varchar(1000) DEFAULT NULL,
  `item_count` int(11) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_reports_active` (`is_active`),
  KEY `idx_reports_year` (`year`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping structure for table cabsec_cms.report_files
CREATE TABLE IF NOT EXISTS `report_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `report_id` int(11) NOT NULL,
  `original_name` varchar(500) NOT NULL,
  `file_url` varchar(1000) NOT NULL,
  `file_type` varchar(100) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_report_files_report` (`report_id`),
  CONSTRAINT `report_files_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping structure for table cabsec_cms.social_media_posts
CREATE TABLE IF NOT EXISTS `social_media_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `platform` varchar(50) NOT NULL,
  `post_url` varchar(500) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table cabsec_cms.announcements: ~0 rows (approximately)
INSERT INTO `announcements` (`id`, `title`, `link_url`, `link_text`, `is_active`, `start_date`, `end_date`, `display_order`, `created_at`, `updated_at`) VALUES
	(1, 'Tets', NULL, NULL, 1, '2025-09-13', '2025-09-28', 1, '2025-09-15 09:05:50', '2025-10-13 08:50:11'),
	(2, 'Test2', '', '', 1, '2025-09-13', '2025-09-26', 2, '2025-09-23 11:05:01', '2025-09-23 11:05:01');

-- Dumping data for table cabsec_cms.cms_users: ~0 rows (approximately)
INSERT INTO `cms_users` (`id`, `username`, `email`, `password_hash`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
	(1, 'admin', 'admin@meity.gov.in', '$2a$10$z1rXO8Gq6xcCduSP641V5uDiXexfRdoxrBn338.t09TkLq0TgWKaq', 'super_admin', 1, '2025-09-15 09:03:11', '2025-09-15 09:03:11');

-- Dumping data for table cabsec_cms.hero_slides: ~4 rows (approximately)
INSERT INTO `hero_slides` (`id`, `image_url`, `link_url`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
	(1, 'https://ccps.digifootprint.gov.in/static//uploads/2025/04/280a2904686013069b9d954c45b2df35.jpg', '', 1, 1, '2025-10-01 10:05:58', '2025-10-09 05:26:15'),
	(2, 'https://www.meity.gov.in/static/uploads/2025/09/bd248e45bbef200143b50c4d661a0ecd.png', 'https://www.youtube.com/live/jzU7NK90LIQ', 2, 1, '2025-10-01 10:07:40', '2025-10-09 05:26:15'),
	(3, 'https://www.meity.gov.in/static/uploads/2025/09/eaa43577696faf12d7ea962600fc848e.jpg', '', 0, 1, '2025-10-01 10:07:57', '2025-10-13 07:08:04'),
	(4, 'https://www.meity.gov.in/static/uploads/2025/09/82e9f622643f798dbb3164ba5eef53c1.png', '', 3, 1, '2025-10-01 10:08:15', '2025-10-09 05:25:59');

-- Dumping data for table cabsec_cms.media_library: ~5 rows (approximately)
INSERT INTO `media_library` (`id`, `filename`, `original_name`, `file_path`, `file_type`, `file_size`, `alt_text`, `caption`, `uploaded_by`, `created_at`) VALUES
	(1, 'files-1759739848075-317601665.jpg', 'a.jpg', '/uploads/files-1759739848075-317601665.jpg', 'image/jpeg', 241210, NULL, NULL, 1, '2025-10-06 08:37:28'),
	(2, 'files-1760357100540-12009811.pdf', 'epfo.pdf', '/uploads/files-1760357100540-12009811.pdf', 'application/pdf', 48003, NULL, NULL, 1, '2025-10-13 12:05:00'),
	(3, 'files-1760516763214-28888982.pdf', 'blank.pdf', '/uploads/files-1760516763214-28888982.pdf', 'application/pdf', 4911, NULL, NULL, 1, '2025-10-15 08:26:03'),
	(4, 'files-1760518265959-877519462.pdf', 'blank.pdf', '/uploads/files-1760518265959-877519462.pdf', 'application/pdf', 4911, NULL, NULL, 1, '2025-10-15 08:51:05'),
	(5, 'files-1760520732952-999865479.pdf', 'blank.pdf', '/uploads/files-1760520732952-999865479.pdf', 'application/pdf', 4911, NULL, NULL, 1, '2025-10-15 09:32:12');

-- Dumping data for table cabsec_cms.navigation_items: ~16 rows (approximately)
INSERT INTO `navigation_items` (`id`, `name`, `link`, `parent_id`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
	(1, 'Home', '/', NULL, 1, 1, '2025-09-15 09:03:11', '2025-09-15 09:03:11'),
	(2, 'Ministry', NULL, NULL, 2, 1, '2025-09-15 09:03:11', '2025-09-15 09:03:11'),
	(3, 'Offerings', NULL, NULL, 3, 1, '2025-09-15 09:03:11', '2025-09-15 09:03:11'),
	(4, 'Documents', NULL, NULL, 4, 1, '2025-09-15 09:03:11', '2025-09-15 09:03:11'),
	(5, 'Media', NULL, NULL, 5, 1, '2025-09-15 09:03:11', '2025-09-15 09:03:11'),
	(7, 'About Us', '/ministry/about', 2, 1, 1, '2025-09-15 09:03:11', '2025-09-23 10:50:37'),
	(10, 'Schemes', '/offerings/schemes-and-services', 3, 1, 1, '2025-09-15 09:03:11', '2025-09-23 09:42:47'),
	(14, 'Reports', '/documents/reports', 4, 3, 1, '2025-09-15 09:03:11', '2025-09-23 09:58:33'),
	(16, 'Photos', '/media/photos', 5, 2, 1, '2025-09-15 09:03:11', '2025-09-23 10:46:46'),
	(17, 'Videos', '/media/videos', 5, 3, 1, '2025-09-15 09:03:11', '2025-09-23 10:46:53'),
	(22, 'Connect', '', NULL, 6, 1, '2025-09-23 10:58:51', '2025-09-23 10:59:55'),
	(23, 'Conact Us', '/connect/contact-us', 22, 1, 1, '2025-09-23 10:59:50', '2025-09-23 10:59:50'),
	(32, 'Test', '/ministry/test', 2, 2, 1, '2025-09-24 10:06:57', '2025-09-25 06:44:50'),
	(33, 'Test2', '/ministry/test2', 2, 3, 1, '2025-09-24 10:07:26', '2025-09-29 08:03:59'),
	(34, 'Test2', '/offerings/test2', 3, 0, 1, '2025-09-25 08:11:36', '2025-09-29 08:04:17'),
	(35, 'Test', '/connect/test', 22, 0, 1, '2025-10-15 05:05:43', '2025-10-15 05:05:43');

-- Dumping data for table cabsec_cms.offerings: ~14 rows (approximately)
INSERT INTO `offerings` (`id`, `title`, `description`, `icon`, `link_url`, `category`, `display_order`, `is_active`, `created_at`, `updated_at`, `schemes`, `vacancies`, `whats_new`) VALUES
	(1, 'Guidelines for implementation of Scheme for reimbursement of Testing and Certification Charges', '', NULL, 'https://www.meity.gov.in/offerings/schemes-and-services/details/guidelines-for-implementation-of-scheme-for-reimbursement-of-testing-and-certification-charges-for-start-ups-and-telecom-mses-cjNwMjMtQWa', 'schemes', 0, 1, '2025-10-14 10:55:17', '2025-10-14 10:55:17', NULL, NULL, NULL),
	(2, 'MyGov is looking for a Social Media Content Writer', '', NULL, 'https://www.meity.gov.in/offerings/vacancies/details/mygov-is-looking-for-a-social-media-content-writer-UTM4QjMtQWa?page=1', 'vacancies', 0, 1, '2025-10-14 10:55:53', '2025-10-14 10:55:53', NULL, NULL, NULL),
	(3, 'TECHNICAL INTERNSHIP PROGRAMME 2025', '', NULL, 'https://www.meity.gov.in/offerings/schemes-and-services/details/technical-internship-programme-2025-UjN5IjMtQWa', 'schemes', 1, 1, '2025-10-14 10:59:10', '2025-10-14 10:59:10', NULL, NULL, NULL),
	(4, 'Electronics Component Manufacturing Scheme', '', NULL, NULL, 'schemes', 2, 1, '2025-10-14 10:59:25', '2025-10-14 10:59:25', NULL, NULL, NULL),
	(5, 'Electronic Manufacturing Clusters (EMC) Scheme', '', NULL, NULL, 'schemes', 3, 1, '2025-10-14 10:59:34', '2025-10-14 10:59:34', NULL, NULL, NULL),
	(6, 'Scheme for ‘Skill Development in ESDM for Digital India’', '', NULL, NULL, 'schemes', 4, 1, '2025-10-14 10:59:43', '2025-10-14 10:59:43', NULL, NULL, NULL),
	(7, 'Digital India BHASHINI Division-DIC is currently inviting applications for the Awareness & Coordination Manager positions purely on Contract/Consolidated basis', '', NULL, NULL, 'vacancies', 1, 1, '2025-10-14 11:00:13', '2025-10-14 11:00:13', NULL, NULL, NULL),
	(8, 'MyGov is looking for a Graphic Designer', '', NULL, NULL, 'vacancies', 2, 1, '2025-10-14 11:00:22', '2025-10-14 11:00:22', NULL, NULL, NULL),
	(9, 'Digital India Corporation is currently inviting applications for the DevOps Engineer position purely on Contract/ Consolidated basis', '', NULL, NULL, 'vacancies', 3, 1, '2025-10-14 11:00:31', '2025-10-14 11:00:31', NULL, NULL, NULL),
	(10, 'Digital India Corporation is currently inviting applications for the Business Analyst & Technical Architect position purely on Contract/ Consolidated basis', '', NULL, NULL, 'vacancies', 4, 1, '2025-10-14 11:00:40', '2025-10-14 11:00:40', NULL, NULL, NULL),
	(11, 'Major achievement of MeitY for the month of September, 2025', '', NULL, NULL, 'whats_new', 0, 1, '2025-10-14 11:01:13', '2025-10-14 11:01:13', NULL, NULL, NULL),
	(12, 'Stakeholder Consultation on the Draft Promotion and Regulation of Online Gaming Rules, 2025', '', NULL, NULL, 'whats_new', 1, 1, '2025-10-14 11:01:21', '2025-10-14 11:01:21', NULL, NULL, NULL),
	(13, 'Message From Cabinet Secretary on Hindi Diwas 2025', '', NULL, NULL, 'whats_new', 2, 1, '2025-10-14 11:01:30', '2025-10-14 11:01:30', NULL, NULL, NULL),
	(14, 'Call for Proposal for 2D Innovation Hub_Updated', '', NULL, NULL, 'whats_new', 3, 1, '2025-10-14 11:01:39', '2025-10-14 11:01:39', NULL, NULL, NULL),
	(15, 'MeitY Performance Smartboard', '', NULL, NULL, 'whats_new', 4, 1, '2025-10-14 11:01:47', '2025-10-14 11:01:47', NULL, NULL, NULL);

-- Dumping data for table cabsec_cms.pages: ~2 rows (approximately)
INSERT INTO `pages` (`id`, `title`, `slug`, `parent_id`, `hero_title`, `hero_subtitle`, `hero_image_url`, `tabs_json`, `content_json`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
	(1, 'Test', '/ministry/test', NULL, 'Test Title', 'Test subtitle', NULL, NULL, '{"html":"  <body>\n    <main class=\"main flow\">\n      <h1 class=\"main__heading\">Pricing</h1>\n      <div class=\"main__cards cards\">\n        <div class=\"cards__inner\">\n          <div\n            class=\"cards__card card\"\n            data-start=\"2022\"\n          >\n            <h2 class=\"card__heading\">UI/UX Design</h2>\n            <p class=\"card__price\">$20 – $35/hr</p>\n            <h6 class=\"card__heading exp-text\"></h6>\n            <ul\n              role=\"list\"\n              class=\"card__bullets flow\"\n            >\n              Design intuitive and engaging user interfaces. Enhance user experience with\n              research-driven insights. Create wireframes, prototypes, and design systems.\n              Focus on usability, accessibility, and visual appeal.\n            </ul>\n            <a\n              href=\"https://dribbble.com/MDJAmin\"\n              class=\"card__cta cta\"\n              >Get Started</a\n            >\n          </div>\n\n          <div\n            class=\"cards__card card\"\n            data-start=\"2020\"\n          >\n            <h2 class=\"card__heading\">Video Editing & Content Creation</h2>\n            <p class=\"card__price\">$18 – $30/hr</p>\n            <h6 class=\"card__heading exp-text\"></h6>\n            <ul\n              role=\"list\"\n              class=\"card__bullets flow\"\n            >\n              Professional editing to refine raw content into polished videos. Consistency with\n              brand identity across all platforms. Story-driven editing for maximum audience\n              engagement. Experience with YouTube, TikTok, Instagram, and more.\n            </ul>\n            <a\n              href=\"https://www.youtube.com/c/DARKLORDCDL\"\n              class=\"card__cta cta\"\n              >Get Started</a\n            >\n          </div>\n\n          <div\n            class=\"cards__card card\"\n            data-start=\"2024\"\n          >\n            <h2 class=\"card__heading\">Front-End Development</h2>\n            <p class=\"card__price\">$25 – $45/hr</p>\n            <h6 class=\"card__heading exp-text\"></h6>\n            <ul\n              role=\"list\"\n              class=\"card__bullets flow\"\n            >\n              Responsive and modern web UI development. Strong knowledge of HTML, CSS,\n              JavaScript. Integration with APIs and back-end services. Focus on performance,\n              accessibility, and SEO.\n            </ul>\n            <a\n              href=\"https://github.com/MDJAmin\"\n              class=\"card__cta cta\"\n              >Get Started</a\n            >\n          </div>\n        </div>\n\n        <div class=\"overlay cards__inner\"></div>\n      </div>\n    </main>\n    <div class=\"MDJAminDiv\">\n      <a\n        class=\"MDJAmin\"\n        href=\"https://github.com/MDJAmin\"\n        target=\"_blank\"\n        >MDJAmin</a\n      >\n    </div>\n\n<img src=\"/uploads/files-1759739848075-317601665.jpg\"> \n\n<a href=\"/uploads/files-1760357100540-12009811.pdf\" >Test</a>\n<script>\n// Enjoy!! 🍓\n\n\"use strict\";\n\nconst cardsContainer = document.querySelector(\".cards\");\nconst cardsContainerInner = document.querySelector(\".cards__inner\");\nconst cards = Array.from(document.querySelectorAll(\".card\"));\nconst overlay = document.querySelector(\".overlay\");\n\nconst applyOverlayMask = (e) => {\n  const overlayEl = e.currentTarget;\n  const x = e.pageX - cardsContainer.offsetLeft;\n  const y = e.pageY - cardsContainer.offsetTop;\n\n  overlayEl.style = `--opacity: 1; --x: ${x}px; --y:${y}px;`;\n};\n\nconst createOverlayCta = (overlayCard, ctaEl) => {\n  const overlayCta = document.createElement(\"div\");\n  overlayCta.classList.add(\"cta\");\n  overlayCta.textContent = ctaEl.textContent;\n  overlayCta.setAttribute(\"aria-hidden\", true);\n  overlayCard.append(overlayCta);\n};\n\nconst observer = new ResizeObserver((entries) => {\n  entries.forEach((entry) => {\n    const cardIndex = cards.indexOf(entry.target);\n    let width = entry.borderBoxSize[0].inlineSize;\n    let height = entry.borderBoxSize[0].blockSize;\n\n    if (cardIndex >= 0) {\n      overlay.children[cardIndex].style.width = `${width}px`;\n      overlay.children[cardIndex].style.height = `${height}px`;\n    }\n  });\n});\n\nconst initOverlayCard = (cardEl) => {\n  const overlayCard = document.createElement(\"div\");\n  overlayCard.classList.add(\"card\");\n  createOverlayCta(overlayCard, cardEl.lastElementChild);\n  overlay.append(overlayCard);\n  observer.observe(cardEl);\n};\n\ncards.forEach(initOverlayCard);\ndocument.body.addEventListener(\"pointermove\", applyOverlayMask);\n\nconst currentYear = new Date().getFullYear();\n\ncards.forEach((card) => {\n  const startYear = card.dataset.start;\n  const expTextEl = card.querySelector(\".exp-text\");\n\n  if (expTextEl && startYear) {\n    const years = currentYear - parseInt(startYear, 10);\n    expTextEl.textContent = `${years}+ years experience`;\n  }\n});\n</script>\n  </body>\n\n","css":"/* Enjoy!! 🍓 */\n@import url(\"https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800;900&display=swap\");\n\n*,\n*::after,\n*::before {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\nhtml,\nbody {\n  height: 100%;\n  min-height: 100vh;\n}\n\nbody {\n  display: grid;\n  place-items: center;\n  font-family: \"League Spartan\", system-ui, sans-serif;\n  font-size: 1.1rem;\n  line-height: 1.2;\n  background-color: #212121;\n  color: #ddd;\n  user-select: none;\n}\n\nul {\n  list-style: none;\n}\n\n.main {\n  max-width: 75rem;\n  padding: 3em 1.5em;\n}\n\n.main__heading {\n  font-weight: 600;\n  font-size: 2.25em;\n  margin-bottom: 0.75em;\n  text-align: center;\n  color: #eceff1;\n}\n\n.cards {\n  position: relative;\n}\n\n.cards__inner {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 2.5em;\n}\n\n.card {\n  --flow-space: 0.5em;\n  --hsl: var(--hue), var(--saturation), var(--lightness);\n  flex: 1 1 14rem;\n  padding: 1.5em 2em;\n  display: grid;\n  grid-template-rows: auto auto auto 1fr;\n  align-items: start;\n  gap: 1.25em;\n  color: #eceff1;\n  background-color: #2b2b2b;\n  border: 1px solid #eceff133;\n  border-radius: 15px;\n}\n\n.card:nth-child(1) {\n  --hue: 165;\n  --saturation: 82.26%;\n  --lightness: 51.37%;\n}\n\n.card:nth-child(2) {\n  --hue: 291.34;\n  --saturation: 95.9%;\n  --lightness: 61.76%;\n}\n\n.card:nth-child(3) {\n  --hue: 338.69;\n  --saturation: 100%;\n  --lightness: 48.04%;\n}\n\n.card__bullets {\n  line-height: 1.4;\n}\n\n.card__bullets li::before {\n  display: inline-block;\n  content: \" \";\n  transform: translatey(0.25ch);\n  margin-right: 1ch;\n}\n\n.card__heading {\n  font-size: 1.05em;\n  font-weight: 600;\n}\n\n.card__price {\n  font-size: 1.75em;\n  font-weight: 700;\n}\n\n.flow > * + * {\n  margin-top: var(--flow-space, 1.25em);\n}\n\n.cta {\n  display: block;\n  align-self: end;\n  margin: 1em 0 0.5em 0;\n  text-align: center;\n  text-decoration: none;\n  color: #fff;\n  background-color: #0d0d0d;\n  padding: 0.7em;\n  border-radius: 10px;\n  font-size: 1rem;\n  font-weight: 600;\n}\n\n.overlay {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n  user-select: none;\n  opacity: var(--opacity, 0);\n  -webkit-mask: radial-gradient(25rem 25rem at var(--x) var(--y), #000 1%, transparent 50%);\n  mask: radial-gradient(25rem 25rem at var(--x) var(--y), #000 1%, transparent 50%);\n  transition: 400ms mask ease;\n  will-change: mask;\n}\n\n.overlay .card {\n  background-color: hsla(var(--hsl), 0.15);\n  border-color: hsla(var(--hsl), 1);\n  box-shadow: 0 0 0 1px inset hsl(var(--hsl));\n}\n\n.overlay .cta {\n  display: block;\n  grid-row: -1;\n  width: 100%;\n  background-color: hsl(var(--hsl));\n  box-shadow: 0 0 0 1px hsl(var(--hsl));\n}\n\n:not(.overlay) > .card {\n  transition: 400ms background ease;\n  will-change: background;\n}\n\n:not(.overlay) > .card:hover {\n  --lightness: 95%;\n  background: hsla(var(--hsl), 0.1);\n}\n\n.MDJAminDiv {\n  z-index: 4444;\n  position: fixed;\n  bottom: 5%;\n  left: 2%;\n}\n\n.MDJAmin {\n  text-decoration: none;\n  border-bottom: 1px dashed rgb(204, 204, 204);\n  border-top: 1px dashed rgb(204, 204, 204);\n  /* border-bottom: 1px dashed rgb(44, 44, 44); */\n  /* border-top: 1px dashed rgb(44, 44, 44); */\n  padding: 4px 0;\n  /* color: rgba(44, 44, 44, 0.525); */\n  color: rgba(204, 204, 204, 0.414);\n  font-family: monospace;\n  font-style: italic;\n  font-size: 1em;\n  transition: all 0.5s;\n}\n\n.MDJAmin:hover {\n  /* color: #000000; */\n  color: white;\n}\n","js":""}', 0, 1, '2025-09-23 11:33:13', '2025-10-13 12:05:37'),
	(4, 'Test2', '/ministry/test2', NULL, 'Test2', NULL, NULL, NULL, '{"html":"<section>\r\n<h1>hii</h1>\r\n\r\n<h1>This is the test</h1>\r\n\r\n<p></p>\r\n\r\n</section>\r\n\r\n","css":"\r\nsection{\r\n    background-color: blue;\r\n    color: white;\r\n}\r\n\r\n","js":""}', 0, 1, '2025-09-25 08:27:06', '2025-09-29 08:08:40'),
	(5, 'tETS', '/offerings/test2', NULL, 'tEST', 'Test', '/uploads/files-1759739848075-317601665.jpg', NULL, '{"html":"<h1>hII</h1>","css":"","js":""}', 0, 1, '2025-10-06 09:34:43', '2025-10-06 09:36:15'),
	(6, 'Test', '/connect/test', NULL, NULL, NULL, NULL, '{"html":"Test","css":"","js":"","no_scope":false}', 0, 1, '2025-10-15 05:06:18', '2025-10-15 05:06:18');

-- Dumping data for table cabsec_cms.page_headers: ~3 rows (approximately)
INSERT INTO `page_headers` (`id`, `page_path`, `background_url`, `created_at`, `updated_at`) VALUES
	(1, '/connect/test', 'https://www.meity.gov.in/static/uploads/2024/08/d4029ca3276dedf1e9583d9768ab0e5d.jpg', '2025-10-15 05:34:53', '2025-10-15 05:34:53'),
	(2, '/ministry/test', 'https://www.meity.gov.in/static/uploads/2024/08/73976be515cd567a6fdbfe364bff131f.jpg', '2025-10-15 05:35:25', '2025-10-15 05:35:25'),
	(3, '/ministry/test2', 'https://www.meity.gov.in/static/uploads/2024/08/d4029ca3276dedf1e9583d9768ab0e5d.jpg', '2025-10-15 05:35:54', '2025-10-15 05:35:54');

-- Dumping data for table cabsec_cms.pm_quotes: ~0 rows (approximately)
INSERT INTO `pm_quotes` (`id`, `quote_text`, `author`, `image_url`, `event_url`, `quote_date`, `created_at`, `updated_at`) VALUES
	(1, 'The world trusts India, the world believes in India, and the world is ready to build the semiconductor future with India.\n\nWe are creating a complete ecosystem, an ecosystem where designing, manufacturing, packaging and high-tech devices, everything is available right here in India.', 'Prime Minister', 'http://localhost:3000/images/pm/pm-modi.jpg', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2163000', '2025-10-13', '2025-10-14 07:45:11', '2025-10-14 10:04:59');

-- Dumping data for table cabsec_cms.recent_docs: ~4 rows (approximately)
INSERT INTO `recent_docs` (`id`, `title`, `description`, `link_url`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
	(1, 'Orders and Notices', 'Assigning the work related to SCOMET and Wassenaar Arrangement to IPHW Division', NULL, 0, 1, '2025-10-14 12:50:42', '2025-10-14 12:50:42'),
	(2, 'Gazettes Notifications', 'Recruitment Rules for Group \'A\' S&T posts', NULL, 1, 1, '2025-10-14 12:51:08', '2025-10-14 12:51:08'),
	(3, 'Gazettes Notifications', 'LDCE Rules for the posts of PA', NULL, 2, 1, '2025-10-14 12:51:24', '2025-10-14 12:51:24'),
	(4, 'Gazettes Notifications', 'LDCE Rules for the posts of ASO', NULL, 3, 1, '2025-10-14 12:51:38', '2025-10-14 12:51:38');

-- Dumping data for table cabsec_cms.reports: ~1 rows (approximately)
INSERT INTO `reports` (`id`, `title`, `type`, `year`, `size`, `file_url`, `item_count`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
	(4, 'Test', 'pdf', 2025, '4.80 KB', '/uploads/files-1760518265959-877519462.pdf', 2, 0, 1, '2025-10-15 09:02:33', '2025-10-15 09:02:33');

-- Dumping data for table cabsec_cms.social_media_posts: ~10 rows (approximately)
INSERT INTO `social_media_posts` (`id`, `platform`, `post_url`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
	(1, 'facebook', 'https://www.facebook.com/meityindia/posts/944312881217817?ref=embed_post', 0, 1, '2025-10-07 06:05:05', '2025-10-08 05:56:24'),
	(2, 'facebook', 'https://www.facebook.com/meityindia/posts/944312881217817?ref=embed_post', 2, 1, '2025-10-07 06:05:29', '2025-10-07 06:05:29'),
	(5, 'youtube', 'https://www.youtube.com/embed?listType=user_uploadsß&list=UUAMMb7ahUbhS9Y0tKomdEsw&index=1', 0, 1, '2025-10-07 06:09:12', '2025-10-07 06:09:12'),
	(6, 'youtube', 'https://www.youtube.com/embed?listType=user_uploads%C3%9F&list=UUAMMb7ahUbhS9Y0tKomdEsw', 2, 1, '2025-10-07 06:10:07', '2025-10-07 06:27:01'),
	(7, 'instagram', 'https://www.instagram.com/p/CdEhFSNMbC7/embed/captioned/?cr=1&v=14&wp=326&rd=https%3A%2F%2Fwww.meity.gov.in&rp=%2F#%7B%22ci%22%3A0%2C%22os%22%3A3530.699999999255%2C%22ls%22%3A3261.7999999998137%2C%22le%22%3A3518.699999999255%7D', 0, 1, '2025-10-07 06:10:43', '2025-10-07 06:27:54'),
	(8, 'youtube', 'https://www.youtube.com/embed?listType=user_uploadsß&list=UUAMMb7ahUbhS9Y0tKomdEsw&index=3', 3, 1, '2025-10-07 06:31:09', '2025-10-07 06:31:09'),
	(9, 'youtube', 'https://www.youtube.com/embed?listType=user_uploadsß&list=UUAMMb7ahUbhS9Y0tKomdEsw&index=3', 4, 1, '2025-10-07 06:31:27', '2025-10-07 06:31:27'),
	(10, 'twitter', 'https://platform.twitter.com/embed/Tweet.html?dnt=false&embedId=twitter-widget-0&features=eyJ0ZndfdGltZWxpbmVfbGlzdCI6eyJidWNrZXQiOltdLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X2ZvbGxvd2VyX2NvdW50X3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9iYWNrZW5kIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19yZWZzcmNfc2Vzc2lvbiI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfZm9zbnJfc29mdF9pbnRlcnZlbnRpb25zX2VuYWJsZWQiOnsiYnVja2V0Ijoib24iLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X21peGVkX21lZGlhXzE1OD', 0, 1, '2025-10-08 04:57:14', '2025-10-08 04:57:14'),
	(11, 'twitter', 'https://platform.twitter.com/embed/Tweet.html?dnt=false&embedId=twitter-widget-0&features=eyJ0ZndfdGltZWxpbmVfbGlzdCI6eyJidWNrZXQiOltdLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X2ZvbGxvd2VyX2NvdW50X3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9iYWNrZW5kIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19yZWZzcmNfc2Vzc2lvbiI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfZm9zbnJfc29mdF9pbnRlcnZlbnRpb25zX2VuYWJsZWQiOnsiYnVja2V0Ijoib24iLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X21peGVkX21lZGlhXzE1OD', 2, 1, '2025-10-08 05:17:17', '2025-10-08 05:17:34'),
	(12, 'facebook', 'https://www.facebook.com/meityindia/posts/944312881217817?ref=embed_post', 0, 1, '2025-10-08 06:13:35', '2025-10-08 06:13:35');

