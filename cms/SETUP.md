# Blog CMS Setup Guide

## Environment Variables

Create a `.env` file in the `cms` directory with the following variables:

```env
# Database (SQLite for development)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# JWT Secrets (generate secure random strings)
JWT_SECRET=your-jwt-secret-here
ADMIN_JWT_SECRET=your-admin-jwt-secret-here
API_TOKEN_SALT=your-api-token-salt-here
TRANSFER_TOKEN_SALT=your-transfer-token-salt-here

# App Keys (generate secure random strings)
APP_KEYS=your-app-keys-here,another-app-key-here

# Email Configuration (for Phase 2)
SENDGRID_API_KEY=your-sendgrid-api-key-here
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
DEFAULT_REPLY_TO_EMAIL=hello@yourdomain.com

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com

# Server Configuration
HOST=0.0.0.0
PORT=1337
```

## Content Types Created

1. **Author** - Blog authors with profiles and social links
2. **Category** - Post categories for organization
3. **Tag** - Post tags for better search and organization
4. **Post** - Main blog posts with MDX support
5. **Page** - Static pages (About, Services, Contact)
6. **ContactSubmission** - Contact form submissions

## API Endpoints

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `GET /api/posts/featured` - Get featured posts
- `GET /api/posts/category/:categorySlug` - Get posts by category
- `GET /api/posts/tag/:tagSlug` - Get posts by tag

### Contact Submissions
- `POST /api/contact-submissions` - Submit contact form (public)
- `PUT /api/contact-submissions/:id/mark-read` - Mark as read (admin)
- `PUT /api/contact-submissions/:id/respond` - Add admin response (admin)

### GraphQL
- `POST /graphql` - GraphQL endpoint

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with the variables above

3. Start the development server:
   ```bash
   npm run develop
   ```

4. Access the admin panel at `http://localhost:1337/admin`

5. Create your first admin account

6. Start creating content!

## Next Steps

- Create sample authors, categories, and tags
- Create your first blog post
- Set up the frontend Next.js application
- Configure email notifications (Phase 2) 