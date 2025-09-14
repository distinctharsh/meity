# 🚀 MEITY Clone Project - Complete Reference Guide

## 🎯 Project Overview
- **Type**: Next.js 15.5.2 with Pages Router
- **Database**: MySQL2 with connection pooling
- **Styling**: Tailwind CSS
- **Authentication**: JWT-based admin authentication
- **File Uploads**: Multer for media management

## 📁 Project Structure Explained

```
meity-clone/
├── 📁 components/                    # UI Components (Frontend)
│   ├── 📁 admin/                    # Admin Dashboard Components
│   │   ├── AdminLayout.js           # Admin page layout wrapper
│   │   ├── DashboardStats.js        # Statistics cards
│   │   ├── SliderForm.js            # Slider management form
│   │   ├── AnnouncementForm.js      # Announcement form
│   │   ├── OfferingForm.js          # Offering management form
│   │   ├── QuickActions.js          # Quick action buttons
│   │   └── RecentActivity.js        # Recent activity feed
│   ├── 📁 icons/                    # SVG Icons
│   ├── Header.js                    # Main website header
│   ├── Navbar.js                    # Main website navigation
│   ├── Footer.js                    # Main website footer
│   ├── HeroSlider.js                # Homepage slider
│   ├── AboutSection.js              # About section component
│   ├── Offerings.js                 # Offerings display
│   ├── RecentDocs.js                # Recent documents
│   ├── SocialMediaFeed.js           # Social media feed
│   ├── PmQuote.js                   # PM quote section
│   └── navData.js                   # Navigation data
│
├── 📁 pages/                        # Routes (Next.js Pages)
│   ├── 📁 admin/                    # Admin Pages (Frontend Routes)
│   │   ├── index.js                 # /admin (Admin Dashboard)
│   │   ├── login.js                 # /admin/login
│   │   ├── slider.js                # /admin/slider
│   │   ├── announcements.js         # /admin/announcements
│   │   ├── offerings.js             # /admin/offerings
│   │   ├── media.js                 # /admin/media
│   │   ├── navigation.js             # /admin/navigation
│   │   └── settings.js              # /admin/settings
│   │
│   ├── 📁 api/                      # Backend API Routes
│   │   └── 📁 admin/                # Admin API Endpoints
│   │       ├── activities.js        # GET /api/admin/activities
│   │       ├── stats.js             # GET /api/admin/stats
│   │       ├── 📁 auth/             # Authentication APIs
│   │       │   ├── login.js         # POST /api/admin/auth/login
│   │       │   ├── logout.js        # POST /api/admin/auth/logout
│   │       │   └── verify.js        # GET /api/admin/auth/verify
│   │       ├── 📁 slider/           # Slider Management APIs
│   │       │   ├── index.js         # GET/POST /api/admin/slider
│   │       │   ├── [id].js          # GET/PUT/DELETE /api/admin/slider/123
│   │       │   └── reorder.js       # POST /api/admin/slider/reorder
│   │       ├── 📁 announcements/    # Announcement APIs
│   │       ├── 📁 offerings/        # Offering APIs
│   │       ├── 📁 media/            # Media Management APIs
│   │       ├── 📁 navigation/       # Navigation APIs
│   │       └── 📁 settings/         # Settings APIs
│   │
│   ├── 📁 ministry/                 # Ministry Sub-pages
│   │   ├── about.js                 # /ministry/about
│   │   ├── organization.js          # /ministry/organization
│   │   └── leadership.js            # /ministry/leadership
│   │
│   ├── 📁 offerings/                # Offerings Sub-pages
│   │   ├── services.js              # /offerings/services
│   │   ├── schemes.js               # /offerings/schemes
│   │   └── initiatives.js           # /offerings/initiatives
│   │
│   ├── 📁 documents/                # Documents Sub-pages
│   │   ├── reports.js               # /documents/reports
│   │   ├── publications.js          # /documents/publications
│   │   └── circulars.js             # /documents/circulars
│   │
│   ├── 📁 media/                    # Media Sub-pages
│   │   ├── gallery.js               # /media/gallery
│   │   ├── videos.js                # /media/videos
│   │   └── press.js                 # /media/press
│   │
│   ├── index.js                     # / (Home Page)
│   ├── ministry.js                  # /ministry (Main Ministry Page)
│   ├── offerings.js                 # /offerings (Main Offerings Page)
│   ├── documents.js                 # /documents (Main Documents Page)
│   ├── media.js                     # /media (Main Media Page)
│   ├── _app.js                      # App wrapper (Layout)
│   └── _document.js                 # HTML document structure
│
├── 📁 lib/                          # Utility Libraries
│   ├── db.js                        # Database connection (MySQL)
│   └── cms-schema.sql               # Database schema
│
├── 📁 utils/                        # Helper Functions
│   ├── auth.js                      # Authentication utilities
│   └── README.md
│
├── 📁 styles/                       # CSS Styles
│   ├── globals.css                  # Global styles
│   ├── slider.css                   # Slider specific styles
│   └── style2.css                   # Additional styles
│
├── 📁 public/                       # Static Assets
│   ├── 📁 images/                   # Images
│   └── 📁 uploads/                  # User uploaded files
│
├── 📄 package.json                  # Dependencies & Scripts
├── 📄 next.config.mjs               # Next.js configuration
├── 📄 tailwind.config.js            # Tailwind CSS configuration
├── 📄 jsconfig.json                 # JavaScript configuration
└── 📄 README.md                     # Project documentation
```

## 🔄 Data Flow Architecture

### 1. Frontend Flow (User Interface)
```
User visits page → pages/[page].js → components/[component].js → API call
```

### 2. Backend Flow (API Processing)
```
API request → pages/api/[endpoint].js → lib/db.js → MySQL Database → Response
```

### 3. Admin Flow (Content Management)
```
Admin page → Admin component → API call → Backend API → Database → Update UI
```

## 🎯 Key Concepts Explained

| Type | Location | Purpose | Example |
|------|----------|---------|---------|
| **Components** | `/components/` | Reusable UI pieces | `SliderForm.js`, `Header.js` |
| **Pages** | `/pages/` | Routes (what user sees) | `index.js` → `/`, `ministry.js` → `/ministry` |
| **APIs** | `/pages/api/` | Backend logic | `slider/index.js` → `/api/admin/slider` |

## 🚀 How to Navigate the Project

### For Frontend Development:
- Look in `/components/` for UI components
- Look in `/pages/` for page routes
- Check `/styles/` for styling

### For Backend Development:
- Look in `/pages/api/` for API endpoints
- Check `/lib/db.js` for database connection
- See `/utils/` for helper functions

### For Admin Features:
- Admin UI: `/components/admin/`
- Admin Pages: `/pages/admin/`
- Admin APIs: `/pages/api/admin/`

## 📋 Quick Reference

### Main Routes:
- `/` - Home page
- `/ministry` - Ministry main page
- `/offerings` - Offerings main page
- `/documents` - Documents main page
- `/media` - Media main page
- `/admin` - Admin dashboard

### Admin Routes:
- `/admin/login` - Admin login
- `/admin/slider` - Slider management
- `/admin/announcements` - Announcement management
- `/admin/offerings` - Offering management
- `/admin/media` - Media management

### API Endpoints:
- `/api/admin/slider` - Slider CRUD operations
- `/api/admin/announcements` - Announcement CRUD operations
- `/api/admin/stats` - Dashboard statistics
- `/api/admin/auth/login` - Admin authentication

## 🛠️ Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 💡 Tips for Development

1. **Adding new pages**: Create file in `/pages/` folder
2. **Adding new components**: Create file in `/components/` folder
3. **Adding new APIs**: Create file in `/pages/api/` folder
4. **Database changes**: Update `/lib/db.js` and run migration
5. **Styling**: Use Tailwind CSS classes or add to `/styles/`

## 🐛 Common Issues & Solutions

### 1. Import Path Issues
- **Problem**: `Module not found: Can't resolve '../../../lib/db'`
- **Solution**: Use `@/lib/db` instead of relative paths
- **Reason**: `jsconfig.json` has path alias `@/*` mapped to root

### 2. Build Cache Issues
- **Problem**: `ENOENT: no such file or directory, open '.next/server/pages/_document.js'`
- **Solution**: Delete `.next` folder and restart server
- **Command**: `Remove-Item -Recurse -Force .next` then `npm run dev`

### 3. Database Connection
- **File**: `lib/db.js`
- **Config**: MySQL connection with pooling
- **Tables**: Check `lib/cms-schema.sql` for table structure

## 📊 Database Schema

The project uses MySQL with these main tables:
- `hero_slides` - Homepage slider images
- `announcements` - Announcement data
- `offerings` - Service offerings
- `media_files` - Uploaded media files
- `navigation_items` - Navigation menu items
- `admin_users` - Admin authentication

## 🎨 Styling Guidelines

- **Primary Color**: `#123a6b` (Dark Blue)
- **Secondary Color**: `#1e4a7a` (Light Blue)
- **Framework**: Tailwind CSS
- **Icons**: Material Symbols Outlined
- **Responsive**: Mobile-first approach

## 🔐 Authentication Flow

1. Admin visits `/admin/login`
2. Credentials sent to `/api/admin/auth/login`
3. JWT token generated and stored
4. Token verified on each admin request
5. Protected routes check authentication

## 📱 Responsive Design

- **Mobile**: `< 768px` - Stacked layout, mobile menu
- **Tablet**: `768px - 1024px` - Adjusted grid
- **Desktop**: `> 1024px` - Full layout with sidebars

## 📝 File Structure Summary

### Components Folder (`/components/`)
- **Purpose**: Reusable UI components
- **Admin Components**: Dashboard-specific UI elements
- **Main Components**: Website-wide UI elements (Header, Navbar, Footer)

### Pages Folder (`/pages/`)
- **Purpose**: Next.js routes (what users see)
- **Admin Pages**: Admin dashboard pages
- **Main Pages**: Public website pages
- **Sub-pages**: Detailed content pages

### API Folder (`/pages/api/`)
- **Purpose**: Backend API endpoints
- **Admin APIs**: Content management APIs
- **Authentication**: Login/logout APIs

### Lib Folder (`/lib/`)
- **Purpose**: Utility libraries and configurations
- **Database**: MySQL connection setup
- **Schema**: Database table definitions

---

**Note**: This is a Next.js project using the Pages Router. The structure follows Next.js conventions where the `pages/` folder automatically creates routes.

**Last Updated**: March 2024  
**Version**: 1.0.0  
**Status**: Development Ready

---

## 🎯 Quick Start Checklist

- [ ] Database setup complete
- [ ] Admin authentication working
- [ ] All pages accessible
- [ ] Navigation working properly
- [ ] Responsive design implemented
- [ ] API endpoints functional

## 📞 Support

For any issues or questions:
1. Check this guide first
2. Look at the terminal output for errors
3. Check browser console for frontend issues
4. Verify database connection
5. Clear build cache if needed

---

**Happy Coding! 🚀**
