-- Per-page Sub Navigation (Tabs) schema

CREATE TABLE IF NOT EXISTS page_subnav_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_path VARCHAR(255) NOT NULL,
  label VARCHAR(120) NOT NULL,
  href VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_page_path (page_path)
);

-- Example seed for /ministry/about
-- INSERT INTO page_subnav_items (page_path, label, href, display_order, is_active) VALUES
-- ('/ministry/about', 'About Us', '/ministry/about', 0, 1),
-- ('/ministry/about', 'Our Team', '/ministry/leadership', 1, 1),
-- ('/ministry/about', 'Our Organisations', '/ministry/organization', 2, 1),
-- ('/ministry/about', 'Our Performance', '/ministry/our-performance', 3, 1),
-- ('/ministry/about', 'Our Groups', '/ministry/our-groups', 4, 1),
-- ('/ministry/about', 'Directory', '/ministry/directory', 5, 1);
