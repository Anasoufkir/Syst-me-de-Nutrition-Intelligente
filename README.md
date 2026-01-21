<div align="center">

# 🥗 Système de Nutrition Intelligente

**Application de recommandations nutritionnelles personnalisées, scientifiquement fondées et réalistes**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0--alpha-blue?style=flat-square)](CHANGELOG.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

[Documentation](#-documentation) · [Installation](#-installation-rapide) · [API](#-api) · [Contribuer](CONTRIBUTING.md) · [Signaler un bug](https://github.com/Anasoufkir/Syst-me-de-Nutrition-Intelligente/issues)

</div>

---

> ⚠️ **Disclaimer médical** : Ce système est à visée éducative et préventive uniquement. Il ne remplace en aucun cas un avis médical, diététique ou nutritionnel professionnel. Consultez un professionnel de santé avant de modifier votre alimentation.

---

## 📋 Table des Matières

- [À Propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Stack Technologique](#-stack-technologique)
- [Installation Rapide](#-installation-rapide)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [API](#-api)
- [Tests](#-tests)
- [Déploiement](#-déploiement)
- [Contribution](#-contribution)
- [Sécurité](#-sécurité)
- [Changelog](#-changelog)
- [Licence](#-licence)

---

## 🎯 À Propos

Le **Système de Nutrition Intelligente** est une application backend conçue pour générer des plans nutritionnels personnalisés à partir de données biométriques et des objectifs de l'utilisateur. Le moteur de calcul s'appuie sur des formules scientifiquement validées (Mifflin-St Jeor, classification OMS) avec des garde-fous de sécurité intégrés.

### Pourquoi ce projet ?

| Problème | Solution apportée |
|----------|-------------------|
| Recommandations génériques inadaptées | Calculs personnalisés basés sur le profil biométrique exact |
| Manque de transparence des calculs | Chaque recommandation est accompagnée de son explication |
| Risques liés aux régimes extrêmes | Garde-fous de sécurité sur l'ajustement calorique |
| Complexité des formules nutritionnelles | Moteur unifié couvrant IMC → macronutriments |

---

## ✨ Fonctionnalités

### V1 — Moteur de calcul nutritionnel

| Use Case | Fonctionnalité | Formule/Méthode | Statut |
|----------|---------------|-----------------|--------|
| UC-01 | Validation du profil utilisateur | Contraintes métier + bornes physiologiques | ✅ Spécifié |
| UC-02 | Calcul IMC + classification OMS | IMC = poids / taille² | ✅ Spécifié |
| UC-03 | Calcul BMR (Métabolisme de base) | Mifflin-St Jeor | ✅ Spécifié |
| UC-04 | Calcul TDEE (Dépense énergétique totale) | BMR × facteur d'activité | ✅ Spécifié |
| UC-05 | Ajustement calorique sécurisé | Déficit/surplus ±500 kcal max | ✅ Spécifié |
| UC-06 | Macros — Protéines | 1.6–2.2 g/kg selon objectif | ✅ Spécifié |
| UC-07 | Macros — Lipides | Minimum physiologique garanti | ✅ Spécifié |
| UC-08 | Macros — Glucides | Reste calorique + contrôle cohérence | ✅ Spécifié |

### Fonctionnalités transversales
- **Sortie structurée** : Chaque résultat inclut valeur + explication + référence scientifique
- **Garde-fous de sécurité** : Limites physiologiques pour protéger l'utilisateur
- **Validation stricte** : Rejet des profils incohérents avec messages d'erreur explicites
- **Sans état** : Aucune donnée personnelle persistée par défaut

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    API REST (Express)                │
│              POST /api/v1/nutrition/analyze          │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│              Validation Layer (UC-01)               │
│         ProfileValidator — Zod Schema               │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│            Nutrition Engine (Core)                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐ │
│  │ IMC Calc │ │ BMR Calc │ │    TDEE Calculator   │ │
│  │  UC-02   │ │  UC-03   │ │       UC-04          │ │
│  └────┬─────┘ └────┬─────┘ └──────────┬───────────┘ │
│       │            │                  │              │
│  ┌────▼────────────▼──────────────────▼───────────┐  │
│  │         Caloric Adjuster (UC-05)               │  │
│  │         + Safety Guard-rails                   │  │
│  └────────────────────┬───────────────────────────┘  │
│                       │                              │
│  ┌────────────────────▼───────────────────────────┐  │
│  │        Macro Calculator (UC-06/07/08)          │  │
│  │     Proteins │ Lipids │ Carbohydrates          │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│            Structured Response Builder              │
│    { value, unit, explanation, scientific_ref }     │
└─────────────────────────────────────────────────────┘
```

Voir [ARCHITECTURE.md](ARCHITECTURE.md) pour la documentation complète.

---

## 🛠️ Stack Technologique

| Couche | Technologie | Version | Rôle |
|--------|-------------|---------|------|
| **Runtime** | Node.js | 20 LTS | Environnement d'exécution |
| **Langage** | TypeScript | 5.x | Typage statique |
| **Framework** | Express | 4.x | Serveur HTTP / Router |
| **Validation** | Zod | 3.x | Validation des schémas |
| **Tests** | Vitest | 1.x | Tests unitaires & intégration |
| **Linting** | ESLint + Prettier | 8.x / 3.x | Qualité & formatage du code |
| **Documentation** | Swagger UI | 5.x | Documentation API interactive |
| **Conteneurisation** | Docker | 24.x | Environnement reproductible |

---

## 🚀 Installation Rapide

### Prérequis

- [Node.js](https://nodejs.org/) >= 20.x
- [npm](https://www.npmjs.com/) >= 10.x (ou [pnpm](https://pnpm.io/) >= 9.x)
- [Docker](https://www.docker.com/) >= 24.x *(optionnel)*

### Via Docker (recommandé)

```bash
# Cloner le dépôt
git clone https://github.com/Anasoufkir/Syst-me-de-Nutrition-Intelligente.git
cd Syst-me-de-Nutrition-Intelligente

# Copier et configurer les variables d'environnement
cp .env.example .env

# Lancer avec Docker Compose
docker compose up -d

# L'API est disponible sur http://localhost:3000
# Swagger UI disponible sur http://localhost:3000/api/docs
```

### Installation manuelle

```bash
# Cloner le dépôt
git clone https://github.com/Anasoufkir/Syst-me-de-Nutrition-Intelligente.git
cd Syst-me-de-Nutrition-Intelligente

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env

# Compiler TypeScript
npm run build

# Démarrer le serveur
npm start
```

Pour un guide d'installation complet, voir [SETUP.md](SETUP.md).

---

## ⚙️ Configuration

Copier `.env.example` vers `.env` et adapter les valeurs :

```env
# Serveur
PORT=3000
NODE_ENV=development

# API
API_VERSION=v1
API_PREFIX=/api

# Sécurité
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Logs
LOG_LEVEL=info
```

Voir [.env.example](.env.example) pour la liste complète des variables.

---

## 📖 Utilisation

### Exemple de requête

```bash
curl -X POST http://localhost:3000/api/v1/nutrition/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "sexe": "homme",
    "age": 30,
    "taille": 175,
    "poids": 80,
    "niveau_activite": "moderement_actif",
    "objectif": "perte_poids"
  }'
```

### Exemple de réponse

```json
{
  "status": "success",
  "data": {
    "profil": {
      "imc": {
        "valeur": 26.1,
        "classification": "surpoids",
        "reference": "Classification OMS 2000"
      },
      "bmr": {
        "valeur": 1847,
        "unite": "kcal/jour",
        "methode": "Mifflin-St Jeor",
        "explication": "Énergie minimale au repos pour un homme de 30 ans, 175 cm, 80 kg"
      },
      "tdee": {
        "valeur": 2862,
        "unite": "kcal/jour",
        "facteur_activite": 1.55,
        "niveau": "modérément actif"
      },
      "calories_cibles": {
        "valeur": 2362,
        "ajustement": -500,
        "objectif": "perte de poids sécurisée (0.5 kg/semaine)"
      },
      "macronutriments": {
        "proteines": { "valeur": 144, "unite": "g", "pourcentage": 24 },
        "lipides":   { "valeur": 65,  "unite": "g", "pourcentage": 25 },
        "glucides":  { "valeur": 296, "unite": "g", "pourcentage": 51 }
      }
    }
  },
  "disclaimer": "Ces recommandations sont à titre informatif et ne remplacent pas un avis médical."
}
```

---

## 📚 API

La documentation complète de l'API est disponible au format **OpenAPI 3.0** :

- **Swagger UI** (interactif) : `http://localhost:3000/api/docs`
- **Fichier YAML** : [`docs/api/openapi.yaml`](docs/api/openapi.yaml)

### Endpoints V1

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/v1/nutrition/analyze` | Analyse nutritionnelle complète |
| `POST` | `/api/v1/nutrition/validate` | Validation du profil uniquement |
| `GET`  | `/api/v1/health` | Health check |
| `GET`  | `/api/docs` | Swagger UI |

---

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Tests en mode watch (développement)
npm run test:watch

# Couverture de code
npm run test:coverage

# Tests d'intégration uniquement
npm run test:integration
```

### Stratégie de tests

| Type | Outil | Couverture cible |
|------|-------|-----------------|
| Unitaires | Vitest | > 80% |
| Intégration | Vitest + Supertest | Tous les endpoints |
| Contrats API | Zod | 100% des inputs |

---

## 🚢 Déploiement

Voir [DEPLOYMENT.md](DEPLOYMENT.md) pour les guides complets :

- [Déploiement Docker](DEPLOYMENT.md#docker)
- [Déploiement sur VPS](DEPLOYMENT.md#vps)
- [Variables d'environnement de production](DEPLOYMENT.md#variables-de-production)
- [Monitoring & logs](DEPLOYMENT.md#monitoring)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour :

- Le processus de contribution
- Les conventions de code
- Le format des commits
- Le processus de review

---

## 🔒 Sécurité

Pour signaler une vulnérabilité de sécurité, voir [SECURITY.md](SECURITY.md).

Ce projet applique :
- Rate limiting sur tous les endpoints
- Validation stricte des entrées (Zod)
- Aucune persistance de données personnelles par défaut
- Headers de sécurité (Helmet.js)

---

## 📝 Changelog

Voir [CHANGELOG.md](CHANGELOG.md) pour l'historique des versions.

---

## 📄 Licence

Ce projet est sous licence **MIT** — voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">

Développé avec ❤️ par [Anasoufkir](https://github.com/Anasoufkir)

</div>
