# Guide d'Installation Détaillé

Ce guide couvre toutes les méthodes d'installation du Système de Nutrition Intelligente pour les environnements de développement et de production.

---

## Table des Matières

- [Prérequis](#prérequis)
- [Installation via Docker](#installation-via-docker-recommandé)
- [Installation manuelle](#installation-manuelle)
- [Vérification de l'installation](#vérification-de-linstallation)
- [Configuration avancée](#configuration-avancée)
- [Résolution de problèmes](#résolution-de-problèmes)

---

## Prérequis

### Versions requises

| Outil | Version minimale | Version recommandée | Vérification |
|-------|-----------------|---------------------|--------------|
| Node.js | 18.x | **20.x LTS** | `node --version` |
| npm | 9.x | **10.x** | `npm --version` |
| Git | 2.x | dernière | `git --version` |
| Docker | 23.x | **24.x** | `docker --version` *(optionnel)* |
| Docker Compose | 2.x | **2.20+** | `docker compose version` *(optionnel)* |

### Installer Node.js (si absent)

**Via nvm (recommandé) :**
```bash
# Installer nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

# Installer et utiliser Node.js 20 LTS
nvm install 20
nvm use 20
nvm alias default 20
```

**Via le gestionnaire de paquets système :**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS (Homebrew)
brew install node@20
```

---

## Installation via Docker (recommandé)

La méthode Docker garantit un environnement identique en développement et en production.

### Étape 1 — Cloner le dépôt

```bash
git clone https://github.com/Anasoufkir/Syst-me-de-Nutrition-Intelligente.git
cd Syst-me-de-Nutrition-Intelligente
```

### Étape 2 — Configurer l'environnement

```bash
cp .env.example .env
```

Éditer `.env` si nécessaire (les valeurs par défaut fonctionnent pour le développement).

### Étape 3 — Lancer avec Docker Compose

```bash
# Mode développement (avec hot-reload)
docker compose --profile dev up

# Mode production
docker compose up -d
```

### Étape 4 — Vérifier

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Swagger UI
open http://localhost:3000/api/docs
```

### Commandes Docker utiles

```bash
# Voir les logs en temps réel
docker compose logs -f app

# Arrêter les conteneurs
docker compose down

# Reconstruire après modification du code
docker compose up --build

# Entrer dans le conteneur
docker compose exec app sh
```

---

## Installation Manuelle

### Étape 1 — Cloner le dépôt

```bash
git clone https://github.com/Anasoufkir/Syst-me-de-Nutrition-Intelligente.git
cd Syst-me-de-Nutrition-Intelligente
```

### Étape 2 — Installer les dépendances

```bash
npm install
```

> Si vous utilisez pnpm : `pnpm install`

### Étape 3 — Configurer l'environnement

```bash
cp .env.example .env
```

Variables minimales à configurer dans `.env` :

```env
PORT=3000
NODE_ENV=development
```

### Étape 4 — Compiler TypeScript

```bash
npm run build
```

Les fichiers compilés se trouvent dans `dist/`.

### Étape 5 — Démarrer le serveur

```bash
# Production (fichiers compilés)
npm start

# Développement (hot-reload avec ts-node)
npm run dev
```

### Étape 6 — Vérifier

```bash
curl -X GET http://localhost:3000/api/v1/health
# Réponse attendue: {"status":"ok","version":"1.0.0"}
```

---

## Vérification de l'Installation

### Health check

```bash
curl http://localhost:3000/api/v1/health
```

Réponse attendue :
```json
{
  "status": "ok",
  "version": "1.0.0",
  "environment": "development"
}
```

### Test d'analyse complète

```bash
curl -X POST http://localhost:3000/api/v1/nutrition/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "sexe": "femme",
    "age": 25,
    "taille": 165,
    "poids": 60,
    "niveau_activite": "moderement_actif",
    "objectif": "maintien"
  }'
```

### Lancer les tests

```bash
# Tous les tests
npm test

# Avec rapport de couverture
npm run test:coverage
```

### Accéder à la documentation API

Ouvrir dans le navigateur : `http://localhost:3000/api/docs`

---

## Configuration Avancée

### Variables d'environnement complètes

Voir [.env.example](.env.example) pour la liste complète avec descriptions.

### Changer le port

```env
PORT=8080
```

### Mode de logs

```env
# Niveaux disponibles: error, warn, info, debug
LOG_LEVEL=debug
```

### Rate limiting

```env
# Fenêtre en millisecondes (défaut: 15 minutes)
RATE_LIMIT_WINDOW_MS=900000
# Nombre de requêtes max par fenêtre
RATE_LIMIT_MAX=100
```

### TypeScript en développement

Le projet utilise `ts-node` avec `--esm` en développement. Si vous avez des problèmes de résolution de modules :

```bash
# Vérifier la configuration TypeScript
npm run typecheck

# Compiler manuellement pour vérifier les erreurs
npx tsc --noEmit
```

---

## Résolution de Problèmes

### `npm install` échoue

```bash
# Vider le cache npm
npm cache clean --force

# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Port déjà utilisé

```bash
# Trouver le processus qui utilise le port 3000
lsof -i :3000
# ou
ss -tlnp | grep 3000

# Tuer le processus (remplacer PID par le numéro trouvé)
kill -9 <PID>
```

### Erreur TypeScript `Cannot find module`

```bash
# Recompiler depuis zéro
rm -rf dist/
npm run build
```

### Docker : permission denied

```bash
# Linux : ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker
```

### Les tests échouent

```bash
# Vérifier la version de Node.js
node --version  # Doit être >= 20.x

# Nettoyer les artifacts de build
npm run clean
npm run build
npm test
```

---

## Prochaines étapes

- Consulter la [documentation API](docs/api/openapi.yaml) pour les endpoints disponibles
- Lire [CONTRIBUTING.md](CONTRIBUTING.md) pour contribuer au projet
- Voir [DEPLOYMENT.md](DEPLOYMENT.md) pour déployer en production
