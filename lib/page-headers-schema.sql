-- Dynamic Page Headers schema

CREATE TABLE IF NOT EXISTS page_headers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_path VARCHAR(255) NOT NULL UNIQUE,
  heading VARCHAR(200) NOT NULL,
  subheading VARCHAR(255) NULL,
  background_url VARCHAR(500) NOT NULL,
  parent_label VARCHAR(120) NULL,
  parent_href VARCHAR(255) NULL,
  overlay BOOLEAN DEFAULT TRUE,
  breadcrumb_enabled BOOLEAN DEFAULT TRUE,
  text_color VARCHAR(20) DEFAULT '#ffffff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_page_headers_path (page_path)
);

-- Example seeds (uncomment to use)
-- INSERT INTO page_headers (page_path, heading, subheading, background_url, parent_label, parent_href)
-- VALUES
-- ('/ministry/about', 'About Us', NULL, '/images/about-page/head-background.jpg', 'Ministry', '/ministry'),
-- ('/media/photos', 'Photos', NULL, '/images/media/banner.jpg', 'Media', '/media'),
-- ('/media/videos', 'Videos', NULL, '/images/media/banner.jpg', 'Media', '/media'),
-- ('/offerings/schemes-and-services', 'Schemes and Services', NULL, '/images/schemes-services/banner.jpg', 'Offerings', '/offerings'),
-- ('/documents/reports', 'Reports', NULL, '/images/reports/banner.jpg', 'Documents', '/documents');
