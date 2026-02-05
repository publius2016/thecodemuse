# Agent Task Coordination

This file coordinates work between multiple Cursor agents working on TheCodeMuse project.

**Last Updated:** 2026-02-04

---

## Project Status

### Infrastructure
- ✅ Local development environment (Docker Compose)
- ✅ Supabase staging database configured
- ✅ Supabase production database configured
- ✅ VPS Docker installed
- ✅ Staging CMS deployed on VPS (port 1437)
- ✅ Staging Frontend deployed on VPS (port 3100)
- ⏳ Nginx configuration (in progress)
- ❌ SSL certificates
- ❌ Production deployment

### Services
- ✅ CMS (Strapi v5) - Working locally and staging
- ✅ Frontend (Next.js 15) - Working locally and staging
- ❌ Email Service - Has TypeScript path alias issue

---

## Active Agents

### Agent 1: CI/CD & Deployment
**Branch:** `feature/cicd-pipeline`
**Focus:** `.github/workflows/`, `scripts/`, `docker-compose.*.yml`

#### Tasks
- [ ] Complete Nginx configuration on VPS
- [ ] Set up SSL with Certbot
- [ ] Create GitHub Actions workflow (`deploy.yml`) with manual trigger
- [ ] Create `scripts/deploy-staging.sh` for VPS
- [ ] Create `scripts/deploy-production.sh` for VPS
- [ ] Add deployment secrets to GitHub (VPS_HOST, VPS_USER, VPS_SSH_KEY)
- [ ] Test end-to-end deployment workflow
- [ ] Document deployment process in DEPLOYMENT_PLAN.md

#### Files Owned
- `.github/workflows/*.yml`
- `scripts/deploy-*.sh`
- `docker-compose.staging.yml`
- `docker-compose.production.yml`
- `DEPLOYMENT_PLAN.md`

---

### Agent 2: Email Service
**Branch:** `fix/email-service`
**Focus:** `muse-email-service/`

#### Tasks
- [ ] Fix TypeScript path alias resolution (@ aliases not compiling)
- [ ] Update tsconfig.json with proper module resolution
- [ ] Verify Dockerfile builds correctly
- [ ] Test email service in Docker locally
- [ ] Add email service to staging deployment
- [ ] Test newsletter signup flow end-to-end (local)
- [ ] Test contact form email flow end-to-end (local)
- [ ] Test email flows in staging environment

#### Files Owned
- `muse-email-service/src/**`
- `muse-email-service/tsconfig.json`
- `muse-email-service/Dockerfile`
- `muse-email-service/package.json`

#### Known Issues
```
Error: Cannot find module '@/config/environment'
Require stack: /app/dist/index.js
```
The TypeScript path aliases (`@/`) are not being resolved during compilation.

---

### Agent 3: Monitoring & Health Checks
**Branch:** `feature/monitoring`
**Focus:** Health endpoints, monitoring scripts, alerting

#### Tasks
- [ ] Verify all services have health endpoints
  - CMS: `/_health` (returns 204)
  - Frontend: `/api/health` (returns 200)
  - Email: `/health` (returns 200)
- [ ] Create monitoring script that checks all endpoints
- [ ] Set up cron job on VPS for periodic health checks
- [ ] Create alerting mechanism (email on failure)
- [ ] Add uptime monitoring (optional: UptimeRobot, Healthchecks.io)
- [ ] Document monitoring setup

#### Files Owned
- `scripts/monitor-health.sh`
- `scripts/alert.sh`
- New monitoring service (if created)

---

### Agent 4: Logging Infrastructure
**Branch:** `feature/logging`
**Focus:** Structured logging, log aggregation

#### Tasks
- [x] Add structured JSON logging to CMS
- [x] Add structured JSON logging to Frontend
- [x] Add structured JSON logging to Email Service
- [x] Configure Docker log drivers
- [x] Set up log rotation on VPS (via Docker log drivers)
- [ ] Create log aggregation solution (optional: Loki, simple file aggregation)
- [x] Add request ID tracking across services
- [x] Document logging standards

#### Files Owned
- `cms/src/utils/logger.ts`
- `frontend/src/lib/logger.ts`
- `muse-email-service/src/utils/logger.ts`
- Log configuration files

---

## Completed Tasks

### 2026-02-04
- [x] VPS Docker & Docker Compose installation
- [x] Directory structure created on VPS (`/opt/thecodemuse/staging/`)
- [x] Repository cloned to VPS
- [x] CMS Dockerfile fixed for production (added src/, tsconfig.json)
- [x] Frontend data fetching fixed (STRAPI_SERVER_URL for Docker network)
- [x] Staging environment connected to Supabase (via connection pooler)
- [x] CMS running on VPS port 1437
- [x] Frontend running on VPS port 3100
- [x] Blog posts displaying correctly in staging

---

## Environment Details

### VPS
- **IP:** (stored in GitHub secrets)
- **OS:** Ubuntu 22.04 LTS
- **Docker:** 29.2.1
- **Nginx:** 1.21.4

### Ports (Staging)
| Service | Internal | External (VPS) |
|---------|----------|----------------|
| CMS | 1337 | 1437 |
| Frontend | 3000 | 3100 |
| Email | 3030 | 3130 |

### Ports (Production - planned)
| Service | Internal | External (VPS) |
|---------|----------|----------------|
| CMS | 1337 | 1537 |
| Frontend | 3000 | 3200 |
| Email | 3030 | 3230 |

### Databases
- **Local Dev:** PostgreSQL on localhost:5432, database `blog_cms`
- **Staging:** Supabase `db.wofucasffcmzwgbggrmo.supabase.co` (via pooler)
- **Production:** Supabase (separate project, credentials in .env)

---

## Coordination Rules

1. **One agent per branch** - Avoid merge conflicts
2. **Update this file** - Mark tasks as complete when done
3. **Don't modify other agents' files** - Respect ownership boundaries
4. **Commit frequently** - Small, focused commits
5. **Test before marking complete** - Verify functionality works

---

## Quick Commands

### Start local development
```bash
cd /Users/msalcido/Documents/thecodemuse
docker compose -f docker-compose.dev.yml up -d
```

### Check staging status (on VPS)
```bash
cd /opt/thecodemuse/staging
docker compose -f docker-compose.staging.yml ps
docker compose -f docker-compose.staging.yml logs -f
```

### Test staging endpoints (on VPS)
```bash
curl http://localhost:1437/api/posts
curl http://localhost:3100/blog
```
