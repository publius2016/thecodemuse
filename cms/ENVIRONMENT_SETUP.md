# CMS Environment Configuration

This guide explains how to configure the Strapi CMS for different environments (local development, staging, production).

## How Environment Switching Works

The CMS uses `NODE_ENV` to determine which database configuration to use:

| Command | NODE_ENV | Database Variables Used |
|---------|----------|------------------------|
| `npm run develop` | development | `DEV_DATABASE_*` |
| `NODE_ENV=staging npm run develop` | staging | `STAGING_DATABASE_*` |
| `NODE_ENV=production npm run start` | production | `PROD_DATABASE_*` |

## Environment Variables Reference

### Core Strapi Configuration

```bash
HOST=0.0.0.0
PORT=1337

# Security keys (generate unique values for each environment)
# Generate with: openssl rand -base64 32
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret
```

### Local Development Database (PostgreSQL)

Used when `NODE_ENV=development` (default for `npm run develop`):

```bash
DEV_DATABASE_HOST=localhost
DEV_DATABASE_PORT=5432
DEV_DATABASE_NAME=blog_cms
DEV_DATABASE_USERNAME=postgres
DEV_DATABASE_PASSWORD=your-local-postgres-password
DEV_DATABASE_SSL=false
```

### Staging Database (Supabase)

Used when `NODE_ENV=staging`:

```bash
# Get these from: Supabase Dashboard > Project Settings > Database
STAGING_DATABASE_HOST=db.xxxxxxxxxxxx.supabase.co
STAGING_DATABASE_PORT=5432
STAGING_DATABASE_NAME=postgres
STAGING_DATABASE_USERNAME=postgres
STAGING_DATABASE_PASSWORD=your-supabase-staging-password
STAGING_DATABASE_SSL=true
```

### Production Database (Supabase)

Used when `NODE_ENV=production`:

```bash
# Get these from: Supabase Dashboard > Project Settings > Database
PROD_DATABASE_HOST=db.xxxxxxxxxxxx.supabase.co
PROD_DATABASE_PORT=5432
PROD_DATABASE_NAME=postgres
PROD_DATABASE_USERNAME=postgres
PROD_DATABASE_PASSWORD=your-supabase-production-password
PROD_DATABASE_SSL=true
```

### Email Service Configuration

```bash
EMAIL_SERVICE_URL=http://localhost:3030
EMAIL_SERVICE_API_KEY=your-email-service-api-key
```

## Setting Up Supabase Databases

### Step 1: Create Supabase Projects

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create two new projects:
   - `thecodemuse-staging`
   - `thecodemuse-production`
3. Wait for each project to finish provisioning

### Step 2: Get Connection Details

For each Supabase project:

1. Go to **Project Settings** > **Database**
2. Scroll to **Connection string** section
3. Copy the following values:
   - **Host**: `db.xxxxxxxxxxxx.supabase.co`
   - **Database name**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: The password you set when creating the project

### Step 3: Configure Your `.env` File

Add all three sets of database variables to your `.env` file:

```bash
# Local Development
DEV_DATABASE_HOST=localhost
DEV_DATABASE_PORT=5432
DEV_DATABASE_NAME=blog_cms
DEV_DATABASE_USERNAME=postgres
DEV_DATABASE_PASSWORD=yourLocalPassword
DEV_DATABASE_SSL=false

# Staging (Supabase)
STAGING_DATABASE_HOST=db.abcdefghijkl.supabase.co
STAGING_DATABASE_PORT=5432
STAGING_DATABASE_NAME=postgres
STAGING_DATABASE_USERNAME=postgres
STAGING_DATABASE_PASSWORD=yourStagingPassword
STAGING_DATABASE_SSL=true

# Production (Supabase)
PROD_DATABASE_HOST=db.mnopqrstuvwx.supabase.co
PROD_DATABASE_PORT=5432
PROD_DATABASE_NAME=postgres
PROD_DATABASE_USERNAME=postgres
PROD_DATABASE_PASSWORD=yourProductionPassword
PROD_DATABASE_SSL=true
```

## Running Different Environments

### Local Development (default)

```bash
npm run develop
```

This uses your local PostgreSQL database.

### Staging

```bash
NODE_ENV=staging npm run develop
```

This connects to your Supabase staging database.

### Production (build mode)

```bash
npm run build
NODE_ENV=production npm run start
```

This connects to your Supabase production database.

## NPM Scripts for Convenience

You can add these scripts to your `package.json`:

```json
{
  "scripts": {
    "develop": "strapi develop",
    "develop:staging": "NODE_ENV=staging strapi develop",
    "start": "strapi start",
    "start:staging": "NODE_ENV=staging strapi start",
    "start:production": "NODE_ENV=production strapi start",
    "build": "strapi build"
  }
}
```

## Database Migration Between Environments

### Export from Local to Staging/Production

Use Strapi's transfer feature or pg_dump:

```bash
# Export local database
pg_dump -h localhost -U postgres -d blog_cms > backup.sql

# Import to Supabase (use Supabase SQL Editor or psql)
psql "postgresql://postgres:PASSWORD@db.xxxx.supabase.co:5432/postgres" < backup.sql
```

### Using Strapi Transfer (Recommended)

```bash
# Export from source
npm run strapi transfer -- --to-url https://your-destination-strapi.com

# Or use the admin panel: Settings > Transfer
```

## Troubleshooting

### SSL Connection Issues

If you get SSL errors with Supabase:
- Ensure `*_DATABASE_SSL=true` is set
- The config already includes `rejectUnauthorized: false` for Supabase compatibility

### Wrong Database Connected

Check the console output when starting Strapi:
```
🔧 DATABASE CONFIG LOADING - Environment: DEVELOPMENT
🗄️  Database: localhost:5432/blog_cms
```

If it shows the wrong environment, verify your `NODE_ENV` is set correctly.

### Permission Denied

After connecting to a fresh Supabase database:
1. Go to Strapi Admin Panel
2. Navigate to **Settings** > **Users & Permissions** > **Roles** > **Public**
3. Enable the API endpoints you need (find, findOne for posts, etc.)
