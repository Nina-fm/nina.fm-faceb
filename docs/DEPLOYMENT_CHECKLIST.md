# Configuration Face B v2 pour le déploiement

## Checklist avant le premier déploiement

### 1. Secrets GitHub

Dans **Settings → Secrets and variables → Actions** :

- [x] `SERVER_HOST` : Déjà configuré (réutilisé de l'API)
- [x] `SERVER_USER` : Déjà configuré
- [x] `SSH_PRIVATE_KEY` : Déjà configuré
- [x] `GITHUB_TOKEN` : Auto-fourni

### 2. Variables GitHub

**Aucune variable spécifique à configurer !** 

Les secrets sont réutilisés de l'API :
- `SERVER_HOST`, `SERVER_USER`, `SSH_PRIVATE_KEY` : Déjà configurés ✅
- `GITHUB_TOKEN` : Auto-fourni par GitHub Actions ✅

L'URL de l'API est hard-codée : `https://api.nina.fm`

### 3. Configuration serveur

```bash
# SSH sur le serveur
ssh user@server

# Créer les répertoires
sudo mkdir -p /var/nina/faceb-v2/deploy
sudo chown -R $USER:$USER /var/nina/faceb-v2

# Certificat SSL
sudo certbot certonly --nginx -d face-b.nina.fm
```

### 4. Configuration Nginx

Créer `/etc/nginx/sites-available/face-b.nina.fm` :

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name face-b.nina.fm;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name face-b.nina.fm;

    ssl_certificate /etc/letsencrypt/live/face-b.nina.fm/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/face-b.nina.fm/privkey.pem;

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

Activer :

```bash
sudo ln -s /etc/nginx/sites-available/face-b.nina.fm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Premier déploiement

```bash
# Créer un changeset pour la première release
cd nina.fm-faceb-v2
pnpm changeset

# Choisir "minor" pour 0.1.0
# Décrire : "Initial production deployment"

# Commit et push sur mainV2
git add .
git commit -m "chore: prepare first production deployment"
git push origin mainV2

# Le workflow GitHub Actions va :
# - Créer la version 0.1.0
# - Builder l'image Docker
# - Déployer sur le serveur
# - Créer le tag et la release GitHub
```

## URLs

- **v1 (actuelle)** : https://faceb.nina.fm
- **v2 (nouvelle)** : https://face-b.nina.fm

## Notes

- Les deux versions tournent en parallèle
- v1 utilise Supabase, v2 utilise nina-api
- Le réseau Docker `nina-network` est partagé avec l'API
- Port local : 3002 (mappé depuis 3000 du conteneur)
