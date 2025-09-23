-- Component catalog and page-component placement schema

CREATE TABLE IF NOT EXISTS component_catalog (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  component_key VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  default_props_json JSON NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS page_components (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_id INT NOT NULL,
  component_id INT NOT NULL,
  display_order INT DEFAULT 0,
  props_json JSON NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
  FOREIGN KEY (component_id) REFERENCES component_catalog(id)
);

-- Seed some common components
INSERT INTO component_catalog (name, component_key, description) VALUES
('About Section', 'AboutSection', 'Generic about section'),
('Offerings Grid', 'Offerings', 'Show offerings'),
('Recent Documents', 'RecentDocs', 'Recent docs list'),
('Promo Section', 'PromoSection', 'Promotional banners'),
('Social Media Feed', 'SocialMediaFeed', 'Feed from social handles');
