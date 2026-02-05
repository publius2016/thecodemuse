# Logging Infrastructure Documentation

This document describes the structured logging infrastructure implemented across all services in TheCodeMuse project.

## Overview

All services now use structured JSON logging with:
- **Request ID tracking** for tracing requests across services
- **Structured JSON format** for easy parsing and aggregation
- **Log rotation** to prevent disk space issues
- **Environment-aware log levels** (debug in development, info in production)
- **Docker log driver configuration** for containerized deployments

## Services

### 1. Email Service (`muse-email-service`)

**Location:** `muse-email-service/src/utils/logger.ts`

**Features:**
- Winston-based structured JSON logging
- Request ID middleware (`addRequestId`) automatically adds UUID v4 to all requests
- Logs to both console (human-readable in dev, JSON in prod) and files
- Separate error log file
- Exception and rejection handlers

**Usage:**
```typescript
import { logger, createRequestLogger } from '@/utils/logger';

// Basic logging
logger.info('Service started', { port: 3000 });

// With request ID (in middleware/controllers)
const requestLogger = createRequestLogger(req.requestId);
requestLogger.info('Email sent', { email: 'user@example.com' });
```

**Configuration:**
- `LOG_LEVEL`: Log level (error, warn, info, debug) - default: `info`
- `LOG_FILE`: Path to log file - default: `logs/email-service.log`

**Log Files:**
- `logs/email-service.log` - All logs
- `logs/error.log` - Error logs only
- `logs/exceptions.log` - Uncaught exceptions
- `logs/rejections.log` - Unhandled promise rejections

### 2. CMS (Strapi)

**Location:** `cms/src/utils/logger.ts`, `cms/src/middlewares/request-id.ts`

**Features:**
- Winston-based structured JSON logging
- Request ID middleware (`global::request-id`) adds UUID to all API requests
- Wraps Strapi's built-in logger with structured logging
- Logs to both console and files

**Usage:**
```typescript
// In controllers/services
strapi.log.info('Newsletter signup created', {
  email: 'user@example.com',
  requestId: ctx.state.requestId
});

// Or use the enhanced logger from context
ctx.state.logger.info('Newsletter signup created', {
  email: 'user@example.com'
});
```

**Configuration:**
- `LOG_LEVEL`: Log level - default: `debug` (dev), `info` (prod)
- `LOG_DIR`: Log directory - default: `logs`

**Log Files:**
- `logs/strapi.log` - All logs
- `logs/error.log` - Error logs only
- `logs/exceptions.log` - Uncaught exceptions
- `logs/rejections.log` - Unhandled promise rejections

**Middleware:**
The request ID middleware is registered in `config/middlewares.ts`:
```typescript
'global::request-id', // Request ID middleware for tracing
```

### 3. Frontend (Next.js)

**Location:** `frontend/src/lib/logger.ts`, `frontend/src/middleware.ts`

**Features:**
- Winston-based structured JSON logging
- Next.js middleware adds request ID to all requests
- Server-side file logging, client-side console logging only
- Request ID propagation via headers

**Usage:**
```typescript
import { logger, createRequestLogger, getRequestId } from '@/lib/logger';

// Server-side (API routes, server components)
const requestId = getRequestId(headers);
const requestLogger = createRequestLogger(requestId);
requestLogger.info('API request processed', { path: '/api/health' });

// Client-side (browser console only)
logger.info('User action', { action: 'click', button: 'submit' });
```

**Configuration:**
- `LOG_LEVEL` or `NEXT_PUBLIC_LOG_LEVEL`: Log level - default: `debug` (dev), `info` (prod)
- `LOG_DIR`: Log directory (server-side only) - default: `logs`

**Log Files (Server-side only):**
- `logs/frontend.log` - All logs
- `logs/error.log` - Error logs only
- `logs/exceptions.log` - Uncaught exceptions
- `logs/rejections.log` - Unhandled promise rejections

**Middleware:**
The Next.js middleware (`src/middleware.ts`) automatically:
- Generates or extracts request ID from headers
- Adds `X-Request-ID` header to requests and responses
- Enables request tracing across the frontend

## Request ID Tracking

Request IDs are UUID v4 strings that enable tracing requests across all services:

1. **Frontend** generates/reads request ID in middleware
2. **Frontend** sends request ID in `X-Request-ID` header to CMS/Email Service
3. **CMS** extracts request ID from header or generates new one
4. **Email Service** extracts request ID from header or generates new one
5. All logs include the request ID for correlation

**Example Flow:**
```
Frontend Request → X-Request-ID: abc-123-def
  ↓
CMS API Call → X-Request-ID: abc-123-def (propagated)
  ↓
Email Service → X-Request-ID: abc-123-def (propagated)
```

All logs for this request will include `requestId: "abc-123-def"`.

## Docker Logging

### Log Drivers

All services use Docker's `json-file` log driver with rotation:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"      # Rotate when log file reaches 10MB
    max-file: "5"         # Keep 5 rotated log files
    labels: "service=cms" # Label for filtering
```

### Log Volumes

Log files are stored in Docker volumes:
- `cms_logs` / `cms_staging_logs` - CMS logs
- `frontend_logs` / `frontend_staging_logs` - Frontend logs
- `email_logs` / `email_staging_logs` - Email service logs

### Viewing Logs

**View all logs:**
```bash
docker compose -f docker-compose.dev.yml logs -f
```

**View specific service logs:**
```bash
docker compose -f docker-compose.dev.yml logs -f cms
docker compose -f docker-compose.dev.yml logs -f frontend
docker compose -f docker-compose.dev.yml logs -f email-service
```

**View logs with request ID filter:**
```bash
docker compose -f docker-compose.dev.yml logs | grep "abc-123-def"
```

**Access log files directly:**
```bash
# Find volume mount point
docker volume inspect thecodemuse_cms_logs

# Or exec into container
docker compose -f docker-compose.dev.yml exec cms ls -la /app/logs
```

## Log Levels

Log levels follow standard conventions:

- **error**: Error events that might still allow the application to continue
- **warn**: Warning messages for potentially harmful situations
- **info**: Informational messages highlighting progress (default in production)
- **debug**: Detailed information for debugging (default in development)

**Environment-based defaults:**
- Development: `debug`
- Staging: `info`
- Production: `info`

## Log Format

### JSON Structure

All logs follow this structure:
```json
{
  "timestamp": "2026-02-04 12:34:56.789",
  "level": "info",
  "message": "Email sent successfully",
  "service": "muse-email-service",
  "environment": "development",
  "requestId": "abc-123-def-456",
  "email": "user@example.com",
  "operation": "sendWelcomeEmail"
}
```

### Console Format (Development)

In development, console logs are human-readable:
```
2026-02-04 12:34:56 [abc-123-def] [info]: Email sent successfully {
  "email": "user@example.com",
  "operation": "sendWelcomeEmail"
}
```

### File Format (All Environments)

Log files always use JSON format for easy parsing and aggregation.

## Log Rotation

### Application-Level Rotation

Winston handles log rotation:
- Max file size: 5MB
- Max files: 10 (keeps 10 rotated files)
- Separate rotation for error logs (5 files)

### Docker-Level Rotation

Docker handles container log rotation:
- Max file size: 10MB
- Max files: 5 (dev) / 10 (staging)
- Automatic rotation when limits reached

## Best Practices

### 1. Always Include Request ID

When logging in request handlers, include the request ID:
```typescript
logger.info('Processing request', {
  requestId: req.requestId,
  path: req.path,
  method: req.method
});
```

### 2. Use Appropriate Log Levels

- **error**: Only for actual errors that need attention
- **warn**: For potentially problematic situations
- **info**: For important business events
- **debug**: For detailed debugging information

### 3. Include Context

Always include relevant context in logs:
```typescript
// Good
logger.info('User registered', {
  userId: user.id,
  email: user.email,
  source: 'newsletter'
});

// Bad
logger.info('User registered');
```

### 4. Don't Log Sensitive Data

Never log:
- Passwords
- API keys
- Credit card numbers
- Full authentication tokens (log partial if needed)

### 5. Use Structured Data

Always use objects for metadata:
```typescript
// Good
logger.error('Database query failed', {
  query: 'SELECT * FROM users',
  error: error.message,
  duration: 1234
});

// Bad
logger.error(`Database query failed: ${error.message}`);
```

## Troubleshooting

### Logs Not Appearing

1. Check log level configuration:
   ```bash
   echo $LOG_LEVEL
   ```

2. Verify log directory exists and is writable:
   ```bash
   docker compose exec cms ls -la /app/logs
   ```

3. Check Docker log driver:
   ```bash
   docker inspect <container> | grep -A 10 LogConfig
   ```

### Request IDs Not Propagating

1. Verify middleware is registered (CMS):
   ```typescript
   // config/middlewares.ts
   'global::request-id',
   ```

2. Check Next.js middleware is active:
   ```typescript
   // frontend/src/middleware.ts should exist
   ```

3. Verify headers are being passed:
   ```bash
   curl -H "X-Request-ID: test-123" http://localhost:1337/api/posts
   ```

### Log Files Growing Too Large

1. Check rotation is working:
   ```bash
   docker compose exec cms ls -lh /app/logs
   ```

2. Verify Docker log rotation:
   ```bash
   docker system df -v
   ```

3. Manually rotate if needed:
   ```bash
   docker compose exec cms sh -c 'mv logs/app.log logs/app.log.old'
   ```

## Future Enhancements

Potential improvements:
- [ ] Centralized log aggregation (Loki, ELK stack)
- [ ] Log alerting for critical errors
- [ ] Log analytics dashboard
- [ ] Request tracing visualization
- [ ] Performance metrics from logs

## Related Files

- `muse-email-service/src/utils/logger.ts` - Email service logger
- `muse-email-service/src/index.ts` - Request ID middleware integration
- `cms/src/utils/logger.ts` - CMS structured logger
- `cms/src/middlewares/request-id.ts` - CMS request ID middleware
- `cms/config/middlewares.ts` - Middleware registration
- `frontend/src/lib/logger.ts` - Frontend logger
- `frontend/src/middleware.ts` - Next.js request ID middleware
- `docker-compose.dev.yml` - Development Docker logging config
- `docker-compose.staging.yml` - Staging Docker logging config
