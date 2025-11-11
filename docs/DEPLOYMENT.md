# Nina.fm Face B - Deployment Guide

## Docker Deployment

### Prerequisites

- Docker and Docker Compose installed on server
- GitHub Actions secrets configured
- Network `nina-network` exists

### GitHub Secrets Required

Go to: `https://github.com/Nina-fm/nina.fm-faceb/settings/secrets/actions`

Add the following **Secrets**:

- `SERVER_HOST`: IP or hostname of production server
- `SERVER_USER`: `nina`
- `SSH_PRIVATE_KEY`: SSH private key for deployment

### GitHub Variables Required

Go to: `https://github.com/Nina-fm/nina.fm-faceb/settings/variables/actions`

Add the following **Variables**:

- `SITE_URL`: `https://www.nina.fm`
- `SUPABASE_URL`: `https://fsomngzmdtaaqfgpdfed.supabase.co`
- `SUPABASE_KEY`: (Supabase anon key)
- `STREAM_API_URL`: `https://prog.nina.fm/api/live-info`
- `STREAM_API_URL_FALLBACK`: `http://flux.nina.fm/status-json.xsl`

### Server Setup

1. **Stop PM2 process** (if running):

```bash
pm2 stop nina-face-b
pm2 delete nina-face-b
pm2 save
```

2. **Ensure nina-network exists**:

```bash
docker network create nina-network 2>/dev/null || echo "Network already exists"
```

3. **Create deployment directory**:

```bash
mkdir -p /var/nina/faceb/deploy
```

### Deployment Process

Deployment is automatic on push to `main` branch:

```bash
git add .
git commit -m "feat: dockerize Face B admin"
git push origin main
```

GitHub Actions will:

1. Run tests (lint + build)
2. Build Docker image
3. Push to GitHub Container Registry (ghcr.io)
4. Pull image on production server
5. Deploy with docker-compose
6. Verify healthcheck passes

### Manual Deployment

If needed, deploy manually:

```bash
# On production server
cd /var/nina/faceb/deploy

# Pull latest image
docker pull ghcr.io/nina-fm/nina.fm-faceb:latest

# Start/restart container
docker-compose --env-file /var/nina/faceb/.env.prod up -d --wait

# Check logs
docker logs nina-faceb --tail 50
```

### Verify Deployment

```bash
# Check container status
docker ps | grep nina-faceb

# Check healthcheck
curl http://localhost:3002/

# Check Supabase connection
docker logs nina-faceb | grep -i supabase
```

### Nginx Configuration

Face B should be proxied via nginx (if needed):

```nginx
server {
    listen 80;
    server_name faceb.nina.fm;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Rollback

To rollback to a previous version:

```bash
# List available tags
docker images ghcr.io/nina-fm/nina.fm-faceb

# Pull specific version
docker pull ghcr.io/nina-fm/nina.fm-faceb:main-<commit-sha>

# Update docker-compose.yml to use specific tag
# Then restart
docker-compose up -d --wait
```

### Troubleshooting

**Container won't start:**

```bash
docker logs nina-faceb
docker inspect nina-faceb
```

**Port conflict:**

```bash
# Check what's using port 3002
sudo lsof -i :3002
# Stop PM2 if still running
pm2 stop nina-face-b
```

**Healthcheck failing:**

```bash
docker exec nina-faceb curl http://localhost:3002/
```

**Supabase connection issues:**

```bash
docker exec nina-faceb env | grep SUPABASE
```

**Network issues:**

```bash
docker network inspect nina-network
docker network connect nina-network nina-faceb
```
