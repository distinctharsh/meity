# MEITY CMS Admin Panel Setup Guide

This guide will help you set up the comprehensive CMS admin panel for the MEITY website.

## Features

The CMS admin panel provides full control over:

- **Hero Slider Management**: Add, edit, delete, and reorder homepage slider images
- **Announcements**: Create and manage site announcements with urgency levels
- **PM Quotes**: Manage Prime Minister quotes and testimonials
- **About Sections**: Control about page content and images
- **Offerings**: Manage services, schemes, and offerings
- **Documents**: Upload and manage documents, policies, reports
- **Social Media**: Manage social media feed and posts
- **Promotions**: Control promotional sections and campaigns
- **Partners**: Manage partner logos and links
- **Navigation**: Control site navigation structure
- **Media Library**: Upload and manage images, documents, and files
- **Site Settings**: Configure site-wide settings and SEO

## Installation Steps

### 1. Database Setup

First, create the database and run the schema:

```sql
-- Create database
CREATE DATABASE meity_clone;

-- Use the database
USE meity_clone;

-- Run the schema file
SOURCE lib/cms-schema.sql;
```

Or manually run the SQL commands from `lib/cms-schema.sql`.

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=meity_clone

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

### 4. Create Upload Directory

```bash
mkdir -p public/uploads
```

### 5. Start the Development Server

```bash
npm run dev
```

## Accessing the Admin Panel

1. Navigate to `http://localhost:3000/admin/login`
2. Use the default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`

**Important**: Change the default password immediately after first login!

## Admin Panel Structure

### Dashboard (`/admin`)
- Overview of all content
- Quick statistics
- Recent activity feed
- Quick action buttons

### Content Management
- **Hero Slider** (`/admin/slider`): Manage homepage carousel
- **Announcements** (`/admin/announcements`): Create and manage announcements
- **PM Quotes** (`/admin/pm-quotes`): Manage Prime Minister quotes
- **About Sections** (`/admin/about`): Control about page content
- **Offerings** (`/admin/offerings`): Manage services and schemes
- **Documents** (`/admin/documents`): Upload and manage documents
- **Social Media** (`/admin/social-media`): Manage social media content
- **Promotions** (`/admin/promotions`): Control promotional sections
- **Partners** (`/admin/partners`): Manage partner logos

### System Management
- **Navigation** (`/admin/navigation`): Control site navigation
- **Media Library** (`/admin/media`): Upload and manage files
- **Settings** (`/admin/settings`): Site-wide configuration

## API Endpoints

### Authentication
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/verify` - Verify token
- `POST /api/admin/auth/logout` - Logout

### Content Management
- `GET/POST /api/admin/slider` - Hero slider management
- `GET/POST /api/admin/announcements` - Announcements management
- `GET/POST /api/admin/offerings` - Offerings management
- `GET/POST /api/admin/documents` - Documents management
- `GET/POST /api/admin/partners` - Partners management

### Media Management
- `GET /api/admin/media` - List media files
- `POST /api/admin/media/upload` - Upload files
- `DELETE /api/admin/media/[id]` - Delete media file

### Settings
- `GET /api/admin/settings` - Get site settings
- `PUT /api/admin/settings` - Update site settings

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- File upload validation
- SQL injection protection
- XSS protection

## File Upload Configuration

The system supports:
- **Images**: JPEG, PNG, GIF
- **Documents**: PDF, DOC, DOCX, TXT
- **Size Limit**: 10MB per file
- **Storage**: Local filesystem (`public/uploads/`)

## Database Tables

- `cms_users` - Admin users
- `hero_slides` - Homepage slider
- `announcements` - Site announcements
- `pm_quotes` - Prime Minister quotes
- `about_sections` - About page content
- `offerings` - Services and schemes
- `recent_documents` - Document management
- `social_media_posts` - Social media content
- `promo_sections` - Promotional content
- `partner_logos` - Partner management
- `navigation_items` - Site navigation
- `media_library` - File management
- `site_settings` - Site configuration

## Customization

### Adding New Content Types

1. Create database table
2. Add API endpoints (`/api/admin/[content-type]/`)
3. Create admin page (`/pages/admin/[content-type].js`)
4. Add to navigation in `AdminLayout.js`

### Styling

The admin panel uses Tailwind CSS. Customize styles by modifying:
- `components/admin/AdminLayout.js`
- Individual component files
- `styles/globals.css`

## Production Deployment

### Security Checklist

1. Change default admin password
2. Update JWT secret
3. Use HTTPS
4. Set up proper database credentials
5. Configure file upload limits
6. Set up backup system
7. Enable logging and monitoring

### Performance Optimization

1. Enable database connection pooling
2. Implement caching
3. Optimize images
4. Use CDN for static assets
5. Enable compression

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check database credentials
   - Ensure MySQL is running
   - Verify database exists

2. **File Upload Issues**
   - Check upload directory permissions
   - Verify file size limits
   - Check file type restrictions

3. **Authentication Problems**
   - Clear browser cache
   - Check JWT secret
   - Verify user exists in database

### Support

For technical support or feature requests, please contact the development team.

## License

This CMS is developed for the MEITY website and is proprietary software.
