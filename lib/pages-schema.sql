-- Pages and Templates schema for dynamic page rendering

CREATE TABLE IF NOT EXISTS page_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  template_key VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  schema_json JSON NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  parent_id INT NULL,
  template_id INT NOT NULL,
  hero_title VARCHAR(255),
  hero_subtitle VARCHAR(500),
  hero_image_url VARCHAR(500),
  tabs_json JSON NULL,
  content_json JSON NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_slug (slug),
  FOREIGN KEY (parent_id) REFERENCES pages(id) ON DELETE SET NULL,
  FOREIGN KEY (template_id) REFERENCES page_templates(id)
);

-- Seed a default "Hero + Tabs" template schema
INSERT INTO page_templates (name, template_key, description, schema_json) VALUES (
  'Hero + Tabs',
  'hero_tabs',
  'Hero section at top with image/title/subtitle and tabbed content sections',
  JSON_OBJECT(
    'fields', JSON_ARRAY(
      JSON_OBJECT('key','hero_title','label','Hero Title','type','text','required', true),
      JSON_OBJECT('key','hero_subtitle','label','Hero Subtitle','type','text','required', false),
      JSON_OBJECT('key','hero_image_url','label','Hero Image URL','type','image','required', false),
      JSON_OBJECT('key','tabs','label','Tabs','type','array','itemSchema', JSON_OBJECT(
        'fields', JSON_ARRAY(
          JSON_OBJECT('key','label','label','Tab Label','type','text','required', true),
          JSON_OBJECT('key','content','label','Content HTML','type','richtext','required', false)
        )
      ))
    )
  )
);
