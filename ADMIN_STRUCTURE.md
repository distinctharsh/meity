# Project Structure and Admin Folders Overview

## Files and What They Do

- **.env**
  Environment variables used by the app (database creds, secrets, etc.).

- **.gitignore**
  Git ignore rules.

- **CMS_SETUP.md**
  Steps to set up the CMS layer.

- **DEVELOPER_GUIDE_HI.md**
  Developer guide (Hindi).

- **MARQUEE_PAUSE_FIX.md**
  Notes/fix guide for marquee pause behavior.

- **PROJECT_GUIDE.md**
  Detailed project usage and structure guide.

- **README.md**
  Project overview and getting started.

- **REAL_TIME_UPDATES_GUIDE.md**
  Guide for real-time updates features.

- **drop_hero_title_description.sql**
  SQL script to alter hero title/description.

- **remove-content-field.sql**
  SQL script to drop a content field.

- **remove-social-posts-extra-fields.sql**
  SQL script to drop extra social post fields.

- **script.sql**
  Main SQL bootstrap/migration script.

- **setup-cms.js**
  Script to initialize CMS-related database/data.

- **setup-database.js**
  Script to initialize database schema/connection.

- **eslint.config.mjs**
  ESLint configuration.

- **jsconfig.json**
  JS path aliases and editor tooling config.

- **middleware.js**
  Next.js middleware (auth/rewrites/headers, etc.).

- **next.config.mjs**
  Next.js config (build/runtime settings).

- **postcss.config.mjs**
  PostCSS setup.

- **tailwind.config.js**
  TailwindCSS configuration.

- **package.json**
  Dependencies, scripts, project metadata.

- **package-lock.json**
  Locked dependency tree.

## Directories and What They Do

- **components/**
  Reusable UI components for the public and admin apps.

- **components/admin/**
  Shared components used by admin pages (layout, forms, widgets).
  - **AdminLayout.js**: Layout shell (sidebar, header, auth check, logout) used by admin pages.
  - **AnnouncementForm.js**: Form UI for announcements CRUD.
  - **DashboardStats.js**: Dashboard stats cards.
  - **OfferingForm.js**: Form UI for offerings CRUD.
  - **QuickActions.js**: Quick actions panel in dashboard.
  - **RecentActivity.js**: Shows recent admin activities (consumes `/api/admin/activities`).
  - **SliderForm.js**: Form UI for hero slider CRUD.
  - **SocialPostForm.js**: Form UI for social posts CRUD.

- **lib/**
  Server-side libraries (DB and SQL schema files).
  - **db.js**: Database connection pool and helpers.
  - **cms-schema.sql**: CMS database schema.
  - **components-schema.sql**: Components tables schema.
  - **page-headers-schema.sql**: Page headers schema.
  - **pages-schema.sql**: Pages table schema.
  - **subnav-schema.sql**: Sub-navigation schema.

- **pages/**
  Next.js routes. Files become pages. Includes public site and admin UI.
  - **_app.js**: Custom App wrapper.
  - **_document.js**: Custom Document.
  - **index.js**: Public home page.
  - **[...slug].js**: Dynamic catch-all page renderer.
  - **cookies.js, media.js, ministry.js, offerings.js, documents.js**: Public-facing pages.
  - **connect/**, **documents/**, **media/**, **ministry/**, **offerings/**: Public sub-routes.
  - **admin/**: Admin UI routes (client-side admin screens, protected).
    - **index.js**: Admin dashboard; reads token, fetches `/api/admin/stats`.
    - **login.js, signup.js**: Auth screens for admin.
    - **announcements.js, pages.js, page-headers.js, slider.js, social.js, navigation.js, offerings.js, media.js, settings.js, subnav.js, templates.js**: Admin CRUD pages for respective modules.
  - **api/**: API routes (serverless functions).
    - **admin/**: Admin-only API endpoints.
      - **activities.js**: Returns recent activity list (mocked examples).
      - **stats.js**: Returns dashboard stats summary.
      - **auth/**: Auth endpoints (login/logout/verify/signup).
      - **announcements/**, **pages/**, **page-header/**, **page-components/**, **page-templates/**, **navigation/**, **subnav/**, **slider/**, **media/**, **offerings/**, **social-posts/**, **settings/**, **components/**: REST endpoints for admin CRUD.

- **public/**
  Static assets served as-is.
  - **uploads/**: Media uploads storage folder.

- **styles/**
  Global CSS and style assets.
  - **globals.css**: Base/global styles.

- **utils/**
  Client and server utilities.
  - **README.md**: Notes for utilities.
  - **api.js**: Fetch/HTTP helpers.
  - **auth.js**: Auth helpers (e.g., token management).
  - **debug.js**: Debug logging helpers.
  - **errorHandler.js**: Error handling utilities.

- **tmp/**
  Temporary files directory.

- **.next/**
  Next.js build output (generated).

- **node_modules/**
  Installed dependencies (generated).

## Why There Are Multiple "admin" Folders

In a Next.js app, different concerns live in different places. The project uses three admin-related folders, each for a distinct layer of the system:

- **pages/admin/** (Admin UI routes)
  - Purpose: Client-side admin screens that administrators use in the browser.
  - Examples: `pages/admin/index.js` (dashboard), `pages/admin/announcements.js` (manage announcements), etc.
  - Why separate: Keeps admin-facing UI pages isolated from public pages, enabling route-level protection and clearer navigation.

- **pages/api/admin/** (Admin API routes)
  - Purpose: Server-side HTTP endpoints used by the admin UI to perform CRUD operations.
  - Examples: `pages/api/admin/activities.js`, `pages/api/admin/auth/*`, `pages/api/admin/pages/*`, etc.
  - Why separate: Enforces a clear API boundary for admin data/actions, with potential for middleware-based auth/authorization distinct from public APIs.

- **components/admin/** (Admin shared components)
  - Purpose: Reusable React components used by admin pages (layout, forms, widgets).
  - Examples: `AdminLayout.js`, `AnnouncementForm.js`, `SliderForm.js`, etc.
  - Why separate: Avoids mixing admin-only components with public components, keeps imports clean and maintainable.

### Summary
- **UI (pages/admin)**: What administrators see and interact with.
- **API (pages/api/admin)**: What the UI calls to persist and retrieve admin data.
- **Shared UI (components/admin)**: Building blocks to implement admin pages consistently.

This separation improves security (clear API boundary), maintainability (files by concern), and scalability (easy to add modules across all three layers consistently).
