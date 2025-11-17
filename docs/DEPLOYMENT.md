# Déploiement Face B v2

## Architecture

Face B v2 est déployé en parallèle de Face B v1 :
- **v1** : `faceb.nina.fm` (branche `main`, Supabase)
- **v2** : `face-b.nina.fm` (branche `mainV2`, nina-api)

## Configuration serveur

### Variables d'environnement GitHub

À configurer dans les secrets/variables du repo :

**Secrets** :
- `SERVER_HOST` : IP du serveur
- `SERVER_USER` : Utilisateur SSH
- `SSH_PRIVATE_KEY` : Clé privée SSH
- `GITHUB_TOKEN` : Auto-fourni par GitHub Actions

**Variables** :
- `FACEB_V2_API_URL` : URL de l'API Nina.fm (ex: `https://api.nina.fm`)
- `FACEB_V2_SITENAME` : Nom du site (défaut: `Face B • Nina.fm`)

### Nginx

Configuration pour `face-b.nina.fm` (port 3002 en local) :

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name face-b.nina.fm;

    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name face-b.nina.fm;

    # Certificats SSL
    ssl_certificate /etc/letsencrypt/live/face-b.nina.fm/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/face-b.nina.fm/privkey.pem;

    # Proxy vers le conteneur Docker
    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Commandes serveur

```bash
# Créer les répertoires
sudo mkdir -p /var/nina/faceb-v2/deploy

# Certificat SSL
sudo certbot certonly --nginx -d face-b.nina.fm

# Créer la configuration nginx
sudo nano /etc/nginx/sites-available/face-b.nina.fm

# Activer le site
sudo ln -s /etc/nginx/sites-available/face-b.nina.fm /etc/nginx/sites-enabled/

# Tester et recharger nginx
sudo nginx -t
sudo systemctl reload nginx
```

## Workflow CI/CD

Le workflow se déclenche sur push vers `mainV2` :

1. **Test** : Lint du code
2. **Versioning** (si changesets détectés) :
   - Exécute `changeset version`
   - Crée tag Git (format `1.0.0`, sans "v")
   - Génère GitHub Release avec CHANGELOG.md
3. **Build** : Image Docker multi-stage optimisée
4. **Deploy** : Docker Compose sur le serveur
5. **Cleanup** : Nettoyage images anciennes

## Gestion des versions

Utilise `@changesets/cli` :

```bash
# Créer un nouveau changeset
pnpm changeset

# Voir le statut
pnpm changeset status

# Le workflow s'occupe du reste automatiquement
```

## Déploiement manuel

```bash
# Sur le serveur
cd /var/nina/faceb-v2/deploy

# Pull nouvelle image
docker pull ghcr.io/nina-fm/nina.fm-faceb-v2:latest

# Redémarrer
docker compose --env-file /var/nina/faceb-v2/.env.prod up -d --force-recreate

# Vérifier
docker logs nina-faceb-v2 --tail 50
```

## Rollback

```bash
# Lister les versions disponibles
docker images ghcr.io/nina-fm/nina.fm-faceb-v2

# Modifier docker-compose.yml pour utiliser une version spécifique
# Remplacer :latest par :1.0.0 par exemple

# Redémarrer
docker compose up -d --force-recreate
```

## Monitoring

```bash
# Logs en temps réel
docker logs -f nina-faceb-v2

# Status du conteneur
docker ps | grep nina-faceb-v2

# Healthcheck
curl -I http://127.0.0.1:3002
```
