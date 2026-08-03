# Cabinet Secretariat CMS - Complete Project Documentation

**Project Name:** Cabinet Secretariat CMS  
**Version:** 0.1.0  
**Framework:** Next.js 15.5.2 (Pages Router)  
**Database:** MySQL 8.0.46  
**Languages:** English & Hindi (Bilingual)  
**Last Updated:** August 3, 2026

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Database Structure](#database-structure)
5. [Key Features](#key-features)
6. [API Endpoints](#api-endpoints)
7. [Components](#components)
8. [Configuration](#configuration)
9. [Setup Instructions](#setup-instructions)
10. [Development Workflow](#development-workflow)
11. [Important Notes](#important-notes)

---

## 🎯 PROJECT OVERVIEW

This is a bilingual (English/Hindi) Content Management System for the Cabinet Secretariat, Government of India. The system manages:

- Official documents and reports
- Navigation and menu structure
- Team members and organizational structure
- Announcements and news
- RTI (Right to Information) documents
- Vacancies and tenders
- Media galleries
- Static pages with dynamic content

**Current Status:** Production-ready with active admin panel and public-facing website.

---

## 🛠️ TECH STACK

### Frontend
- **Framework:** Next.js 15.5.2 (Pages Router architecture)
- **React:** 19.1.0
- **Styling:** Tailwind CSS 4.1.13
- **Icons:** react-icons 5.5.0

### Backend
- **Runtime:** Node.js (Next.js API routes)
- **Database:** MySQL 8.0.46 (mysql2 package)
- **Authentication:** JWT (jsonwebtoken 9.0.2) + bcryptjs 2.4.3

### File Handling
- **Upload:** formidable 3.5.4, multer 1.4.5-lts.1
- **Rich Text:** CKEditor 5 (Classic build)
- **Code Editor:** Monaco Editor 4.7.0

### Security
- **Sanitization:** isomorphic-dompurify 2.28.0
- **Password Hashing:** bcryptjs 2.4.3
- **JWT Tokens:** jsonwebtoken 9.0.2

---

## 📁 PROJECT STRUCTURE

```
cabsec-cms-main/
├── pages/                          # Next.js Pages Router
│   ├── admin/                     # Admin panel pages
│   │   ├── index.js              # Admin dashboard
│   │   ├── login.js              # Admin login
│   │   ├── reports.js            # Reports management
│   │   ├── pages.js              # CMS pages management
│   │   ├── navigation.js         # Navigation management
│   │   ├── announcements.js      # Announcements management
│   │   ├── media.js              # Media library
│   │   ├── our-team.js           # Team management
│   │   ├── settings.js           # System settings
│   │   └── [20+ more admin pages]
│   ├── api/                      # API routes
│   │   ├── admin/                # Admin APIs
│   │   │   ├── auth/             # Authentication endpoints
│   │   │   ├── reports/          # Reports CRUD
│   │   │   ├── pages/            # Pages CRUD
│   │   │   ├── navigation/       # Navigation CRUD
│   │   │   ├── media/            # Media operations
│   │   │   └── [15+ more admin API folders]
│   │   ├── documents/            # Public document APIs
│   │   │   ├── reports.js        # Public reports listing
│   │   │   ├── [id]/             # Document detail APIs
│   │   │   └── by-name/, by-slug/
│   │   ├── navigation.js         # Public navigation data
│   │   ├── search.js             # Search functionality
│   │   ├── upload.js             # File upload endpoint
│   │   └── [10+ more public APIs]
│   ├── documents/                # Public document pages
│   │   ├── index.js              # Main documents listing
│   │   ├── reports.js            # Reports listing
│   │   ├── [slug].js             # Pretty URL routing
│   │   └── report/[id].js        # Report detail page
│   ├── ministry/                 # Ministry pages
│   ├── offerings/                # Offerings pages
│   ├── cabinet-secretariat/      # Cabinet Secretariat pages
│   ├── connect/                  # Connect pages
│   ├── media.js                  # Media page
│   ├── archives.js               # Archives page
│   ├── search.js                 # Search page
│   ├── index.js                  # Home page
│   ├── [...slug].js              # Dynamic CMS pages (catch-all)
│   ├── _app.js                   # App wrapper
│   └── _document.js              # HTML document wrapper
├── components/                    # React components
│   ├── admin/                    # Admin-specific components
│   │   ├── AdminLayout.js        # Admin panel layout
│   │   ├── ReportForm.js         # Report creation/editing form
│   │   ├── AnnouncementForm.js   # Announcement form
│   │   ├── OfferingForm.js       # Offering form
│   │   ├── [10+ more admin forms]
│   ├── common/                   # Common/shared components
│   ├── icons/                    # Icon components
│   ├── Header.js                 # Site header
│   ├── Navbar.js                 # Navigation menu
│   ├── Footer.js                 # Site footer
│   ├── HeroSlider.js             # Homepage hero carousel
│   ├── AnnouncementBar.js        # Announcement bar
│   ├── AboutSection.js           # About section
│   ├── Offerings.js              # Offerings display
│   ├── RecentDocs.js             # Recent documents widget
│   ├── SocialMediaFeed.js        # Social media feed
│   ├── SubNavTabs.jsx            # Sub-navigation tabs
│   ├── PageHeader.jsx            # Dynamic page headers
│   └── [15+ more UI components]
├── lib/                          # Server-side utilities
│   ├── db.js                     # MySQL connection pool
│   ├── translations.js           # Bilingual translations (en/hi)
│   └── migrations/               # Database migration files
├── public/                       # Static assets
│   ├── images/                   # Image assets
│   ├── fonts/                    # Font files
│   ├── vendor/                   # Third-party libraries (jQuery, DataTables)
│   └── report_document/          # Uploaded documents
│       ├── councilofministers/   # Report categories
│       ├── allocationofbusiness/ # Report categories
│       └── [more report folders]
├── styles/                       # Stylesheets
│   ├── globals.css               # Global styles (Tailwind imports)
│   └── slider.css                # Legacy slider styles
├── utils/                        # Helper functions
├── scripts/                      # Utility scripts
│   ├── setup-cms.js              # CMS setup script
│   └── setup-database.js         # Database setup script
├── tmp/                          # Temporary files
├── .env                          # Environment variables (GIT IGNORED)
├── package.json                  # Dependencies and scripts
├── next.config.mjs               # Next.js configuration
├── middleware.js                # Next.js middleware
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.mjs           # PostCSS configuration
├── eslint.config.mjs            # ESLint configuration
├── jsconfig.json               # JavaScript project configuration
├── README.md                   # Basic project information
├── REPORTS_WORKFLOW.md         # Reports feature workflow documentation
└── PROJECT_DOCUMENTATION.md    # THIS FILE - Complete documentation
```

---

## 🗄️ DATABASE STRUCTURE

### Database Information

**English Database:** `cabsec_cms`  
**Hindi Database:** `cabsec_cms_hi`  
**Character Set:** UTF8MB4 (supports full Unicode including Hindi)  
**Collation:** utf8mb4_general_ci (case-insensitive)  
**Total Tables:** 30 (identical structure in both databases)

### Complete Table List

| # | Table Name | Purpose | Key Fields |
|---|------------|---------|------------|
| 1 | `about_content` | Static About page sections | section_key, title, content, file_url |
| 2 | `announcements` | Site-wide announcements | title, content, start_date, end_date |
| 3 | `audit_trails` | User activity logging | user_id, action, ip_address, timestamp |
| 4 | `cms_users` | CMS administrators | username, email, password_hash, role |
| 5 | `directory_entries` | Contact directory entries | name, designation, phone, email |
| 6 | `footer` | Footer configuration | sections, social_links, copyright |
| 7 | `hero_slides` | Homepage hero carousel | image_url, title, link, display_order |
| 8 | `important_links` | External/internal important links | title, url, category |
| 9 | `media_library` | Centralized file storage | file_url, file_type, file_size, alt_text |
| 10 | `navigation_items` | Hierarchical menu structure | name, link, parent_id, display_order |
| 11 | `offerings` | Government offerings | title, description, category, icon |
| 12 | `our_team` | Team member profiles | name, designation, photo_url, email |
| 13 | `our_team_contacts` | Team member contact details | team_id, contact_type, value |
| 14 | `our_team_people` | Individual people in teams | team_section_id, name, designation |
| 15 | `our_team_sections` | Organizational team sections | title, description, display_order |
| 16 | `page_headers` | Page background images | page_path, image_url, title |
| 17 | `page_templates` | Reusable page templates | name, schema_json, content_json |
| 18 | `pages` | Main CMS pages | title, slug, content_json, navigation_item_id |
| 19 | `partner_logos` | Partner/organization logos | name, logo_url, website_url |
| 20 | `photo_galleries` | Photo gallery collections | title, description, cover_image |
| 21 | `pm_quotes` | Prime Minister quotes | quote, event_link, display_order |
| 22 | `recent_docs` | Recently published documents | title, file_url, publish_date |
| 23 | `report_files` | Individual files in reports | report_id, file_url, publish_date |
| 24 | `reports` | Document groups/categories | title, type, nav_item_id, file_url |
| 25 | `rti_items` | RTI documents and items | title, file_url, section_id |
| 26 | `rti_page_content` | RTI page configuration | section_key, content |
| 27 | `rti_sections` | RTI document sections | title, description |
| 28 | `social_media_posts` | Social media feed links | platform, post_url, content |
| 29 | `vacancies_tenders` | Job vacancies and tenders | title, type, due_date, file_url |
| 30 | `whats_new` | What's New section items | title, description, link |

### Key Table Schemas

#### 1. `pages` Table (Core CMS Content)
```sql
CREATE TABLE `pages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `parent_id` int DEFAULT NULL,
  `hero_title` varchar(255) DEFAULT NULL,
  `hero_subtitle` varchar(500) DEFAULT NULL,
  `hero_image_url` varchar(500) DEFAULT NULL,
  `tabs_json` longtext,              -- JSON validated
  `content_json` longtext,           -- JSON validated (HTML/CSS/JS)
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `navigation_item_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_slug` (`slug`),
  KEY `parent_id` (`parent_id`),
  KEY `idx_navigation_item_id` (`navigation_item_id`),
  CONSTRAINT `fk_pages_navigation` FOREIGN KEY (`navigation_item_id`) REFERENCES `navigation_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pages_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `pages` (`id`) ON DELETE SET NULL,
  CONSTRAINT `pages_chk_1` CHECK (json_valid(`tabs_json`)),
  CONSTRAINT `pages_chk_2` CHECK (json_valid(`content_json`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

**Content JSON Structure:**
```json
{
  "html": "<div>Page HTML content</div>",
  "css": ".custom-class { color: red; }",
  "js": "console.log('Page JavaScript');"
}
```

#### 2. `navigation_items` Table (Menu Structure)
```sql
CREATE TABLE `navigation_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `is_show` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `navigation_items_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `navigation_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

**Menu Hierarchy:** Self-referencing via `parent_id` for nested menus.

#### 3. `reports` Table (Document Groups)
```sql
CREATE TABLE `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(500) NOT NULL,
  `type` enum('pdf','group','link') NOT NULL DEFAULT 'pdf',
  `year` int DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `file_url` varchar(1000) DEFAULT NULL,
  `nav_item_id` int DEFAULT NULL,
  `item_count` int DEFAULT NULL,
  `display_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_archived` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

**Report Types:**
- `pdf`: Single PDF file
- `group`: Multiple files (uses `report_files` table)
- `link`: External URL

**Status System:**
- `is_active`: Status field with values: 1 (Active), 2 (Archived), 0 (Deleted/Soft Delete)
- Simplified single column status system instead of separate is_active + is_archived

#### 4. `report_files` Table (Individual Documents)
```sql
CREATE TABLE `report_files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_id` int NOT NULL,
  `original_name` varchar(500) NOT NULL,
  `file_url` varchar(1000) NOT NULL,
  `file_type` varchar(100) DEFAULT NULL,
  `file_size` varchar(225) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_archived` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `publish_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

**Volume:** 10K+ records in English, 12K+ in Hindi database.

#### 5. `cms_users` Table (Admin Users)
```sql
CREATE TABLE `cms_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('super_admin','admin','editor') DEFAULT 'editor',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

**User Roles:**
- `super_admin`: Full system access
- `admin`: Content management access
- `editor`: Limited editing access

### Database Differences (English vs Hindi)

| Aspect | English DB | Hindi DB |
|--------|-----------|----------|
| **Database Name** | `cabsec_cms` | `cabsec_cms_hi` |
| **Report Files** | 10,408 records | 12,412 records |
| **Reports** | 72 records | 64 records |
| **RTI Items** | 379 records | 66 records |
| **Audit Trails** | 0 records | 6,460 records |
| **Navigation** | English names | Hindi names (मुखपृष्ठ, etc.) |
| **File Paths** | `/english/` folders | `/hindi/` folders |

### Current Database Connection
```javascript
// lib/db.js
host: 127.0.0.1
port: 3306
user: root
password: 123456
database: cabsec_cms
```

---

## ✨ KEY FEATURES

### 1. CMS System
- **Dynamic Page Rendering:** Pages created via admin panel with HTML/CSS/JS support
- **Page Templates:** Reusable page templates with JSON schemas
- **Navigation Management:** Hierarchical menu structure with drag-and-drop ordering
- **Content Versioning:** Automatic timestamps for created/updated dates

### 2. Document Management
- **Reports System:** Categorized documents with group, PDF, and link types
- **File Upload:** Multiple file upload support with size validation
- **Archive System:** Archive old documents while keeping them accessible
- **Search:** Full-text search across documents

### 3. Admin Panel
- **Dashboard:** Stats overview with recent activity
- **Authentication:** JWT-based secure login
- **Role-Based Access:** Three permission levels (super_admin, admin, editor)
- **Activity Logging:** Audit trails for user actions
- **Rich Text Editor:** CKEditor integration for content editing

### 4. Public Features
- **Bilingual Support:** English and Hindi content
- **Responsive Design:** Mobile-friendly interface
- **Accessibility:** WCAG compliant with skip links and ARIA labels
- **SEO Friendly:** Clean URLs and meta tags
- **Social Media Integration:** Social media feed display

### 5. Security Features
- **SQL Injection Protection:** Prepared statements for all queries
- **XSS Protection:** DOMPurify sanitization
- **CSRF Protection:** Token-based validation
- **Password Hashing:** bcrypt for secure password storage
- **Safe Event Listeners:** Guard against malformed addEventListener calls

---

## 🔌 API ENDPOINTS

### Authentication APIs
```
POST   /api/admin/auth/login      - Admin login
POST   /api/admin/auth/logout     - Admin logout
GET    /api/admin/auth/verify     - Token verification
```

### Admin APIs
```
# Reports
GET    /api/admin/reports         - List all reports
POST   /api/admin/reports         - Create new report
GET    /api/admin/reports/[id]    - Get single report
PUT    /api/admin/reports/[id]    - Update report
DELETE /api/admin/reports/[id]    - Delete report

# Pages
GET    /api/admin/pages           - List all pages
POST   /api/admin/pages           - Create new page
GET    /api/admin/pages/[id]      - Get single page
PUT    /api/admin/pages/[id]      - Update page
DELETE /api/admin/pages/[id]      - Delete page

# Navigation
GET    /api/admin/navigation      - List navigation items
POST   /api/admin/navigation      - Create navigation item
PUT    /api/admin/navigation/[id] - Update navigation item
DELETE /api/admin/navigation/[id] - Delete navigation item

# Media
POST   /api/admin/upload          - Upload file
GET    /api/admin/media           - List media library
DELETE /api/admin/media/[id]      - Delete media item

# Announcements
GET    /api/admin/announcements   - List announcements
POST   /api/admin/announcements   - Create announcement
PUT    /api/admin/announcements/[id] - Update announcement
DELETE /api/admin/announcements/[id] - Delete announcement

# [15+ more admin API endpoints for various features]
```

### Public APIs
```
# Navigation
GET    /api/navigation            - Get full navigation tree
GET    /api/navigation-subnav     - Get sub-navigation for page

# Documents
GET    /api/documents/reports     - Get reports listing
GET    /api/documents/[id]        - Get document details
GET    /api/documents/by-name/[name] - Get document by name
GET    /api/documents/by-slug/[slug] - Get document by slug

# Search
GET    /api/search                - Search across content
GET    /api/search?s=query        - Search with query parameter

# Page Headers
GET    /api/page-header           - Get page header configuration

# Recent Documents
GET    /api/recent-docs           - Get recent documents
GET    /api/recent-reports        - Get recent reports

# RTI
GET    /api/rti                   - Get RTI information

# Social Media
GET    /api/social-posts          - Get social media feed

# Slider
GET    /api/slider                - Get hero slider data

# Upload
POST   /api/upload                - Public file upload
```

---

## 🧩 COMPONENTS

### Layout Components
- **AdminLayout.js** - Admin panel layout with sidebar and header
- **Header.js** - Public site header with accessibility features
- **Navbar.js** - Main navigation menu with responsive design
- **Footer.js** - Site footer with links and copyright

### Page Components
- **HeroSlider.js** - Homepage hero carousel
- **AnnouncementBar.js** - Scrolling announcement bar
- **AboutSection.js** - About page content
- **Offerings.js** - Government offerings display
- **RecentDocs.js** - Recent documents widget
- **SocialMediaFeed.js** - Social media feed integration
- **PartnerLogoCarousel.js** - Partner logos carousel

### Admin Components
- **ReportForm.js** - Report creation/editing form
- **AnnouncementForm.js** - Announcement form
- **OfferingForm.js** - Offering form
- **PmQuoteForm.js** - PM quote form
- **SliderForm.js** - Hero slider form
- **SocialPostForm.js** - Social media post form
- **WhatsNewForm.js** - What's New form
- **DashboardStats.js** - Admin dashboard statistics
- **QuickActions.js** - Quick action buttons
- **RecentActivity.js** - Recent activity feed

### Utility Components
- **PageHeader.jsx** - Dynamic page headers
- **SubNavTabs.jsx** - Sub-navigation tabs
- **GoToTop.js** - Scroll to top button
- **CookieBanner.jsx** - Cookie consent banner
- **Skeleton.js** - Loading skeleton
- **AccessibilityBar.js** - Accessibility options

---

## ⚙️ CONFIGURATION

### Environment Variables (.env)
```
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=123456
MYSQL_DATABASE=cabsec_cms
JWT_SECRET=your_jwt_secret_key
```

### Next.js Configuration (next.config.mjs)
```javascript
{
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
  headers: [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        { key: 'Pragma', value: 'no-cache' }
      ]
    }
  ]
}
```

### Tailwind Configuration
- Version: 4.1.13
- Custom theme extensions in `tailwind.config.js`
- Global styles in `styles/globals.css`

### Middleware (middleware.js)
- Skips API routes and static assets
- Handles CMS page routing
- Route existence checks via `x-skip-cms` header

---

## 🚀 SETUP INSTRUCTIONS

### Prerequisites
- Node.js (v18 or higher)
- MySQL 8.0+
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd cabsec-cms-main
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy .env file and update with your database credentials
# .env file is already present in the project
```

4. **Setup database**
```bash
# Import English database
mysql -u root -p < cabsec_cms_english\ 31\ july\ 2026.sql

# Import Hindi database (if needed)
mysql -u root -p < cabsec_cms_hindi_31\ july\ 2026.sql
```

5. **Run development server**
```bash
npm run dev
```

6. **Access the application**
- Public site: http://localhost:3000
- Admin panel: http://localhost:3000/admin

### Build for Production
```bash
npm run build
npm start
```

---

## 🔄 DEVELOPMENT WORKFLOW

### Adding New Features

1. **Database Changes:**
   - Create migration SQL file in `lib/migrations/`
   - Test on both English and Hindi databases
   - Update `lib/db.js` if connection changes needed

2. **API Endpoints:**
   - Create API route in `pages/api/`
   - Follow existing patterns for error handling
   - Use prepared statements for SQL queries
   - Add proper authentication checks

3. **Admin UI:**
   - Create admin page in `pages/admin/`
   - Create form component in `components/admin/`
   - Follow existing form patterns
   - Add proper validation

4. **Public Pages:**
   - Create page in `pages/` or use CMS
   - Create reusable components in `components/`
   - Follow existing design patterns
   - Ensure mobile responsiveness

### Reports Feature Workflow

For detailed reports feature workflow, see `REPORTS_WORKFLOW.md`. Key files:
- Admin APIs: `pages/api/admin/reports/index.js`, `pages/api/admin/reports/[id].js`
- Public API: `pages/api/documents/reports.js`
- Admin UI: `components/admin/ReportForm.js`, `pages/admin/reports.js`
- Public Pages: `pages/documents/index.js`, `pages/documents/report/[id].js`

### Testing Changes

1. **Restart development server** after database changes
2. **Test admin functionality** via admin panel
3. **Test public APIs** via browser or curl
4. **Check both languages** if adding bilingual content
5. **Verify mobile responsiveness**

---

## 📝 IMPORTANT NOTES

### Code Conventions
- **Language:** Mixed English and Hindi content in database
- **Styling:** Use Tailwind CSS utilities
- **Components:** Follow existing component patterns
- **API Routes:** Use Pages Router (not App Router)
- **Database:** Always use prepared statements
- **Security:** Never commit credentials or expose secrets

### File Structure Rules
- Server-only code in `lib/`
- Client UI in `components/`
- Static assets in `public/`
- API routes in `pages/api/`
- Pages in `pages/`

### Common Issues

1. **Database Connection:**
   - Ensure MySQL service is running
   - Check credentials in `.env` file
   - Verify database exists

2. **Image Optimization:**
   - Images are unoptimized in config
   - Use appropriate image formats
   - Compress images before upload

3. **API Caching:**
   - API routes have no-cache headers
   - Changes reflect immediately
   - Clear browser cache if needed

4. **Language Switching:**
   - Database selection based on configuration
   - Translation keys in `lib/translations.js`
   - File paths differ by language

### Security Considerations
- Never expose database credentials
- Always sanitize user input
- Use HTTPS in production
- Keep dependencies updated
- Monitor audit logs regularly
- Implement rate limiting on APIs

### Performance Optimization
- Use connection pooling (already configured)
- Implement pagination for large datasets
- Optimize images before upload
- Use Next.js Image component where possible
- Enable caching for static assets

### Backup Strategy
- Regular database backups
- Backup uploaded files in `public/report_document/`
- Version control for code changes
- Document custom configurations

---

## 📞 SUPPORT & CONTACT

For project-specific issues:
1. Check `REPORTS_WORKFLOW.md` for reports feature
2. Review this documentation
3. Check existing code patterns
4. Test changes in development environment

---

## 📚 ADDITIONAL RESOURCES

- **Next.js Documentation:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **MySQL Documentation:** https://dev.mysql.com/doc/
- **CKEditor 5:** https://ckeditor.com/docs/ckeditor5/latest/

---

**Documentation Last Updated:** August 3, 2026  
**Project Version:** 0.1.0  
**Maintainer:** Cabinet Secretariat Development Team