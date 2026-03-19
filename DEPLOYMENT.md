# Guide de Déploiement

Ce guide couvre le déploiement du Système de Nutrition Intelligente en environnement de production.

---

## Table des Matières

- [Prérequis](#prérequis)
- [Déploiement Docker](#déploiement-docker)
- [Déploiement sur VPS](#déploiement-sur-vps-ubuntudebian)
- [Variables de Production](#variables-de-production)
- [Reverse Proxy (Nginx)](#reverse-proxy-nginx)
- [HTTPS avec Certbot](#https-avec-certbot)
- [Monitoring & Logs](#monitoring--logs)
- [Mises à Jour](#mises-à-jour)
- [Rollback](#rollback)

---

## Prérequis

| Composant | Minimum | Recommandé |
|-----------|---------|------------|
| CPU | 1 vCPU | 2 vCPU |
| RAM | 512 MB | 1 GB |
| Disque | 5 GB | 10 GB |
| OS | Ubuntu 22.04 | Ubuntu 22.04 LTS |
| Docker | 24.x | dernière stable |
| Nginx | 1.24 | dernière stable |

---

## Déploiement Docker

### 1. Préparer le serveur

```bash
# Mettre à jour le système
sudo apt-get update && sudo apt-get upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Vérifier l'installation
docker --version
docker compose version
```

### 2. Déployer l'application

```bash
# Cloner le dépôt
git clone https://github.com/Anasoufkir/Syst-me-de-Nutrition-Intelligente.git
cd Syst-me-de-Nutrition-Intelligente

# Configurer l'environnement de production
cp .env.example .env
nano .env  # Adapter les valeurs (voir section Variables de Production)

# Construire et démarrer
docker compose up -d --build

# Vérifier que le service tourne
docker compose ps
docker compose logs app
```

### 3. Vérifier le déploiement

```bash
curl http://localhost:3000/api/v1/health
# Attendu : {"status":"ok","version":"1.0.0","environment":"production"}
```

---

## Déploiement sur VPS (Ubuntu/Debian)

### 1. Installer Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Doit afficher v20.x.x
```

### 2. Créer un utilisateur dédié

```bash
sudo useradd -m -s /bin/bash nutrition
sudo su - nutrition
```

### 3. Déployer l'application

```bash
# En tant qu'utilisateur nutrition
git clone https://github.com/Anasoufkir/Syst-me-de-Nutrition-Intelligente.git app
cd app
npm ci --only=production=false
npm run build
npm prune --production  # Supprimer les devDependencies
cp .env.example .env
# Éditer .env avec les valeurs de production
```

### 4. Configurer PM2 (gestionnaire de processus)

```bash
# Installer PM2 globalement
sudo npm install -g pm2

# Démarrer l'application
pm2 start dist/app.js --name "nutrition-api" --env production

# Sauvegarder la configuration PM2
pm2 save

# Démarrer PM2 au démarrage du système
pm2 startup systemd
# Exécuter la commande affichée par PM2
```

### 5. Vérifier

```bash
pm2 status
pm2 logs nutrition-api
curl http://localhost:3000/api/v1/health
```

---

## Variables de Production

Voici les variables critiques à configurer en production :

```env
# Environnement
NODE_ENV=production
PORT=3000

# Sécurité
CORS_ORIGINS=https://votre-domaine.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Logs
LOG_LEVEL=warn
LOG_FORMAT=json

# Swagger (désactiver en production)
SWAGGER_ENABLED=false
```

---

## Reverse Proxy (Nginx)

### Installation

```bash
sudo apt-get install -y nginx
```

### Configuration

```nginx
# /etc/nginx/sites-available/nutrition-api
server {
    listen 80;
    server_name api.votre-domaine.com;

    # Redirection HTTPS (activée après Certbot)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Limiter la taille des requêtes
    client_max_body_size 1m;
}
```

```bash
# Activer la configuration
sudo ln -s /etc/nginx/sites-available/nutrition-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## HTTPS avec Certbot

```bash
# Installer Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtenir un certificat SSL (remplacer le domaine)
sudo certbot --nginx -d api.votre-domaine.com

# Renouvellement automatique (vérifier)
sudo systemctl status certbot.timer
```

Certbot modifiera automatiquement la configuration Nginx pour activer HTTPS et la redirection HTTP → HTTPS.

---

## Monitoring & Logs

### Logs avec Docker

```bash
# Voir les logs en temps réel
docker compose logs -f app

# Voir les 100 dernières lignes
docker compose logs --tail=100 app

# Exporter les logs
docker compose logs app > nutrition-api.log
```

### Logs avec PM2

```bash
# Logs en temps réel
pm2 logs nutrition-api

# Logs des erreurs uniquement
pm2 logs nutrition-api --err

# Rotation des logs (configurer une fois)
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Health check automatique

```bash
# Créer un script de vérification
cat > /usr/local/bin/check-nutrition-api.sh << 'EOF'
#!/bin/bash
response=$(curl -sf http://localhost:3000/api/v1/health)
if [ $? -ne 0 ]; then
  echo "$(date): API down - restarting..." >> /var/log/nutrition-api-monitor.log
  pm2 restart nutrition-api
fi
EOF
chmod +x /usr/local/bin/check-nutrition-api.sh

# Planifier via cron (toutes les 5 minutes)
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/check-nutrition-api.sh") | crontab -
```

---

## Mises à Jour

### Avec Docker

```bash
cd Syst-me-de-Nutrition-Intelligente

# Récupérer les dernières modifications
git pull origin main

# Reconstruire et redémarrer sans downtime
docker compose up -d --build

# Vérifier
docker compose ps
curl http://localhost:3000/api/v1/health
```

### Avec PM2

```bash
cd app

# Récupérer et construire
git pull origin main
npm ci --only=production=false
npm run build
npm prune --production

# Redémarrer sans downtime
pm2 reload nutrition-api

# Vérifier
pm2 status
curl http://localhost:3000/api/v1/health
```

---

## Rollback

### Avec Docker

```bash
# Lister les images disponibles
docker images | grep nutrition

# Revenir à une image précédente (remplacer le tag)
docker compose down
docker tag nutrition-api:previous nutrition-api:latest
docker compose up -d
```

### Avec Git + PM2

```bash
# Identifier le commit stable précédent
git log --oneline -10

# Revenir au commit précédent
git checkout <commit-hash>
npm run build
pm2 reload nutrition-api
```

---

## Checklist de Déploiement

Avant chaque mise en production :

- [ ] `npm test` passe avec couverture ≥ 80%
- [ ] `npm run lint` sans erreur
- [ ] `npm run typecheck` sans erreur
- [ ] `npm audit` — aucune vulnérabilité critique
- [ ] `.env` configuré avec les valeurs de production
- [ ] `SWAGGER_ENABLED=false` en production
- [ ] `NODE_ENV=production`
- [ ] HTTPS configuré et certificat valide
- [ ] Health check répond correctement
- [ ] Logs accessibles et rotation configurée
