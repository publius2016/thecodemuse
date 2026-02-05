# Deployment Plan: VPS Staging & Production Setup

This document outlines the plan for setting up CI/CD pipelines and environments on a shared VPS.

## Current Architecture

The application consists of three microservices:

1. **Frontend** (Next.js) - Port 3000
2. **CMS** (Strapi v5) - Port 1337
3. **Email Service** (Express.js) - Port 3030

## VPS Requirements

- **Docker & Docker Compose**: Container orchestration
- **Git**: Code deployment
- **Nginx**: Reverse proxy (already installed)
- **Node.js** (optional): For non-Docker deployments

## Recommended Setup

### 1. Environment Structure

```
/opt/thecodemuse/
├── staging/
│   ├── docker-compose.yml
│   ├── .env.staging
│   └── nginx/staging.conf
├── production/
│   ├── docker-compose.yml
│   ├── .env.production
│   └── nginx/production.conf
└── shared/
    └── scripts/
        ├── deploy-staging.sh
        └── deploy-production.sh
```

### 2. Docker Compose Per Environment

Each environment gets its own compose file with environment-specific:
- Port mappings (to avoid conflicts)
- Database connections (Supabase staging vs production)
- API keys and secrets
- Resource limits

**Port Allocation:**
| Service | Staging | Production |
|---------|---------|------------|
| Frontend | 3100 | 3200 |
| CMS | 1437 | 1537 |
| Email Service | 3130 | 3230 |

### 3. CI/CD with GitHub Actions (Manual Trigger)

Create `.github/workflows/deploy.yml` with `workflow_dispatch` for manual deployments:

```yaml
name: Deploy to VPS

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        type: choice
        options:
          - staging
          - production
      service:
        description: 'Service to deploy (or all)'
        required: true
        type: choice
        options:
          - all
          - frontend
          - cms
          - email-service

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/thecodemuse/${{ inputs.environment }}
            git pull origin main
            docker compose pull
            docker compose up -d --build ${{ inputs.service != 'all' && inputs.service || '' }}
```

### 4. Nginx Configuration

Route traffic based on subdomain:

```nginx
# Staging
server {
    server_name staging.thecodemuse.com;
    
    location / {
        proxy_pass http://localhost:3100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api/cms {
        proxy_pass http://localhost:1437;
    }
}

# Production
server {
    server_name thecodemuse.com www.thecodemuse.com;
    
    location / {
        proxy_pass http://localhost:3200;
        # ... same proxy settings
    }
    
    location /api/cms {
        proxy_pass http://localhost:1537;
    }
}
```

### 5. SSL with Certbot

```bash
sudo certbot --nginx -d staging.thecodemuse.com
sudo certbot --nginx -d thecodemuse.com -d www.thecodemuse.com
```

## Implementation Steps

### Phase 1: Supabase Database Setup
- [ ] Create Supabase project for staging
- [ ] Create Supabase project for production
- [ ] Configure CMS environment variables for each
- [ ] Set up environment switching in CMS config

### Phase 2: VPS Preparation
- [ ] Install Docker & Docker Compose on VPS
- [ ] Create directory structure
- [ ] Set up SSH keys for GitHub Actions
- [ ] Configure firewall rules

### Phase 3: Docker Configuration
- [ ] Create production-ready Dockerfiles
- [ ] Create environment-specific compose files
- [ ] Test local builds

### Phase 4: Nginx & SSL
- [ ] Configure Nginx virtual hosts
- [ ] Set up SSL certificates
- [ ] Test routing

### Phase 5: GitHub Actions
- [ ] Create deployment workflow
- [ ] Add VPS secrets to GitHub
- [ ] Test manual deployments

### Phase 6: Monitoring & Logging
- [ ] Set up container logging
- [ ] Configure health checks
- [ ] Set up basic monitoring

## Environment Variables

### Required Secrets (GitHub Actions)
- `VPS_HOST`: VPS IP or hostname
- `VPS_USER`: SSH username
- `VPS_SSH_KEY`: Private SSH key

### Per-Environment Variables
Each `.env.{environment}` file needs:
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
- `EMAIL_SERVICE_API_KEY`
- `MAILGUN_USER`, `MAILGUN_PASSWORD`
- `STRAPI_ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `APP_KEYS`
- `NEXT_PUBLIC_STRAPI_URL`

## Resource Considerations (2 CPU, 8GB RAM)

Suggested container limits:
- Frontend: 512MB RAM, 0.5 CPU
- CMS: 1GB RAM, 0.5 CPU
- Email Service: 256MB RAM, 0.25 CPU

This leaves headroom for:
- Nginx
- System processes
- Both staging AND production running simultaneously

## Notes

- Manual trigger deployments via GitHub Actions UI
- Zero-downtime deployments with Docker Compose rolling updates
- Database hosted externally on Supabase (no local DB management needed on VPS)
- Logs accessible via `docker compose logs -f [service]`
