#!/bin/bash
# Migrate local PostgreSQL data to Supabase staging

# Load credentials from .env
source .env

# Local database settings (with defaults)
LOCAL_DB_HOST="${DEV_DATABASE_HOST:-localhost}"
LOCAL_DB_USER="${DEV_DATABASE_USERNAME:-postgres}"
LOCAL_DB_NAME="${DEV_DATABASE_NAME:-blog_cms}"

echo "🚀 Migrating data from local PostgreSQL to Supabase staging..."
echo "   Source: $LOCAL_DB_USER@$LOCAL_DB_HOST/$LOCAL_DB_NAME"
echo "   Target: $STAGING_DATABASE_HOST/$STAGING_DATABASE_NAME"

# Export from local and import to staging in one pipeline
pg_dump -h "$LOCAL_DB_HOST" -U "$LOCAL_DB_USER" -d "$LOCAL_DB_NAME" \
    --data-only \
    --disable-triggers \
    --no-owner \
    --no-acl \
    -T strapi_core_store_settings \
    -T strapi_database_schema \
    -T strapi_migrations_internal \
    -T i18n_locale \
    | PGPASSWORD="$STAGING_DATABASE_PASSWORD" psql \
        "postgresql://$STAGING_DATABASE_USERNAME@$STAGING_DATABASE_HOST:$STAGING_DATABASE_PORT/$STAGING_DATABASE_NAME?sslmode=require"

if [ $? -eq 0 ]; then
    echo "✅ Migration complete!"
else
    echo "❌ Migration failed"
    exit 1
fi
