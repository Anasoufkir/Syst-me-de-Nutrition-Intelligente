<div align="center">

# 🥗 Système de Nutrition Intelligente

**Moteur de recommandations nutritionnelles personnalisées, scientifiquement fondées et réalistes**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![Zod](https://img.shields.io/badge/Zod-3.x-3068b7?style=flat-square)](https://zod.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-1.x-6E9F18?style=flat-square&logo=vitest)](https://vitest.dev/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker)](docker-compose.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

[Démo](#-démo-en-direct) · [Installation](#-installation-rapide) · [Comment ça marche](#-comment-ça-marche) · [API](#-api-reference) · [Tests](#-tests)

</div>

---

> ⚠️ **Disclaimer médical** : Ce système est à visée éducative et préventive uniquement. Il ne remplace pas un avis médical ou nutritionnel professionnel.

---

## 📋 Table des Matières

- [Pourquoi ce projet](#-pourquoi-ce-projet)
- [Démo en direct](#-démo-en-direct)
- [Comment ça marche](#-comment-ça-marche)
- [Le moteur de calcul](#-le-moteur-de-calcul-étape-par-étape)
- [Garde-fous de sécurité](#-garde-fous-de-sécurité)
- [Comparaison de profils](#-comparaison-de-profils)
- [Architecture](#-architecture)
- [Stack Technologique](#-stack-technologique)
- [Installation Rapide](#-installation-rapide)
- [API Reference](#-api-reference)
- [Tests](#-tests)
- [Déploiement](#-déploiement)
- [Contribution](#-contribution)
- [Licence](#-licence)

---

## 🎯 Pourquoi ce projet ?

La plupart des calculateurs nutritionnels en ligne donnent des résultats **génériques et opaques**. Ce projet propose un moteur transparent, explicable et sécurisé :

| Problème courant | Ce que fait ce système |
|-----------------|----------------------|
| "Mangez 2000 kcal" sans explication | Chaque valeur est calculée + justifiée scientifiquement |
| Formules non documentées | Mifflin-St Jeor (1990), classification OMS — références publiées |
| Pas de protection contre les régimes dangereux | Plancher calorique 1200/1500 kcal selon le sexe |
| Résultats identiques pour tout le monde | 8 paramètres personnalisés : sexe, âge, taille, poids, activité, objectif |
| Données de santé stockées | Traitement en mémoire uniquement, aucune persistance |

---

## 🎬 Démo en direct

### Résultat d'analyse — Dashboard complet

![Dashboard résultat nutritionnel](docs/screenshots/result-dashboard.svg)

### Comparaison de 4 profils — même API, résultats uniques

![Comparaison de profils](docs/screenshots/profile-comparison.svg)

### Requête & réponse JSON

![Démo — POST /api/v1/nutrition/analyze](docs/screenshots/demo-analyze.svg)

### Validation — Réponse en cas de profil invalide

![Démo — Erreur de validation 400](docs/screenshots/demo-error.svg)

---

<details>
<summary>📋 Voir les exemples en texte brut</summary>

### Requête

```bash
curl -s -X POST http://localhost:3000/api/v1/nutrition/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "sexe": "homme",
    "age": 30,
    "taille": 175,
    "poids": 80,
    "niveau_activite": "moderement_actif",
    "objectif": "perte_poids"
  }' | jq
```

### Réponse complète

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
        "valeur": 1749,
        "unite": "kcal/jour",
        "methode": "Mifflin-St Jeor",
        "explication": "Énergie minimale au repos pour un homme de 30 ans, 175 cm, 80 kg"
      },
      "tdee": {
        "valeur": 2711,
        "unite": "kcal/jour",
        "facteur_activite": 1.55,
        "niveau": "modérément actif·ve"
      }
    },
    "calories_cibles": {
      "valeur": 2211,
      "unite": "kcal/jour",
      "ajustement": -500,
      "objectif": "perte de poids sécurisée (≈ 0.5 kg/semaine)"
    },
    "macronutriments": {
      "proteines": {
        "valeur": 160,
        "unite": "g",
        "calories": 640,
        "pourcentage": 29,
        "ratio_par_kg": 2.0
      },
      "lipides": {
        "valeur": 74,
        "unite": "g",
        "calories": 663,
        "pourcentage": 30
      },
      "glucides": {
        "valeur": 227,
        "unite": "g",
        "calories": 908,
        "pourcentage": 41
      }
    }
  },
  "disclaimer": "Ces recommandations sont à titre informatif et ne remplacent pas un avis médical, diététique ou nutritionnel professionnel."
}
```

</details>

---

## ⚙️ Comment ça marche

Le moteur exécute **8 use cases en chaîne**, chacun alimentant le suivant :

```mermaid
flowchart TD
    A[Requête HTTP\nPOST /api/v1/nutrition/analyze] --> B

    B{UC-01\nValidation du profil}
    B -- ❌ Invalide --> C[400 Bad Request\nliste des erreurs par champ]
    B -- ✅ Valide --> D

    D[UC-02 · Calcul IMC\npoids ÷ taille²\nClassification OMS]
    D --> E

    E[UC-03 · Calcul BMR\nMifflin-St Jeor\nkcal au repos]
    E --> F

    F[UC-04 · Calcul TDEE\nBMR × facteur d'activité\nDépense réelle quotidienne]
    F --> G

    G{UC-05 · Ajustement calorique\nselon objectif}
    G -- perte_poids --> H1[TDEE − 500 kcal]
    G -- maintien --> H2[TDEE = cible]
    G -- prise_masse --> H3[TDEE + 300 kcal]
    H1 --> I
    H2 --> I
    H3 --> I

    I{Garde-fous\nde sécurité}
    I -- min. physiologique\nnon atteint --> J[Plancher appliqué\n♀ 1200 kcal · ♂ 1500 kcal\n+ avertissement]
    I -- OK --> K

    J --> K[UC-06 · Protéines\npoids × ratio g/kg]
    K --> L[UC-07 · Lipides\n30% des calories\nmin. 40 g garanti]
    L --> M[UC-08 · Glucides\nReste calorique ÷ 4\nVérification cohérence]
    M --> N[✅ 200 OK\nNutritionReport JSON]

    style C fill:#ff6b6b,color:#fff
    style J fill:#ffa94d,color:#fff
    style N fill:#51cf66,color:#fff
```

---

## 🔬 Le Moteur de Calcul — Étape par Étape

Voici comment le système transforme **6 paramètres** en **un plan nutritionnel complet** :

### Profil exemple : Femme, 28 ans, 62 kg, 168 cm, légèrement active, perte de poids

```
┌─────────────────────────────────────────────────────────────────┐
│  ÉTAPE 1 — IMC (UC-02)                                          │
│                                                                 │
│  IMC = 62 ÷ (1.68)² = 21.97  →  ✅ NORMAL (18.5 – 24.9)        │
│                                   Référence : OMS 2000          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  ÉTAPE 2 — BMR / Métabolisme de base (UC-03)                    │
│                                                                 │
│  Mifflin-St Jeor (femme) :                                      │
│  BMR = (10 × 62) + (6.25 × 168) − (5 × 28) − 161              │
│      =  620   +   1050      −   140    − 161                    │
│      =  1369 kcal/jour                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  ÉTAPE 3 — TDEE / Dépense totale (UC-04)                        │
│                                                                 │
│  TDEE = BMR × facteur légèrement active                         │
│       = 1369 × 1.375 = 1882 kcal/jour                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  ÉTAPE 4 — Calories cibles (UC-05)                              │
│                                                                 │
│  Objectif perte de poids → déficit de 500 kcal                 │
│  Cible = 1882 − 500 = 1382 kcal/jour                           │
│                                                                 │
│  🛡️  Vérification plancher femme : 1382 > 1200 ✅ → OK         │
│  Perte estimée : ≈ 0.5 kg / semaine                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  ÉTAPE 5 — Macronutriments (UC-06 / UC-07 / UC-08)              │
│                                                                 │
│  Protéines : 62 kg × 2.0 g/kg = 124 g  →  496 kcal  (36%)     │
│  Lipides   : 1382 × 30% ÷ 9   =  46 g  →  415 kcal  (30%)     │
│  Glucides  : (1382 − 496 − 415) ÷ 4    =  118 g  (34%)        │
│                                                                 │
│  Σ = 496 + 415 + 471 = 1382 kcal ✅                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Garde-fous de Sécurité

Le système refuse les recommandations physiologiquement dangereuses :

```mermaid
graph LR
    A["Calories calculées\n(TDEE ± objectif)"] --> B{Vérification\nplancher}

    B -- "♀ < 1200 kcal" --> C["🔴 Plancher appliqué\n1200 kcal + avertissement"]
    B -- "♂ < 1500 kcal" --> D["🔴 Plancher appliqué\n1500 kcal + avertissement"]
    B -- "Déficit > 500 kcal" --> E["🔴 Déficit plafonné\nà −500 kcal/j"]
    B -- "✅ Dans les bornes" --> F["✅ Valeur retournée\ntelle quelle"]

    G["Lipides calculés"] --> H{min. 40 g ?}
    H -- "< 40 g" --> I["🟡 Minimum appliqué\n40 g + avertissement"]
    H -- "≥ 40 g" --> J["✅ OK"]

    K["Glucides calculés"] --> L{min. 50 g ?}
    L -- "< 50 g" --> M["🟡 Alerte régime\nbasse glucides"]
    L -- "≥ 50 g" --> N["✅ OK"]
```

---

## 📊 Comparaison de Profils

Le système s'adapte à chaque profil. Voici 4 exemples réels :

| Profil | IMC | BMR | TDEE | Calories cibles | Protéines | Lipides | Glucides |
|--------|-----|-----|------|----------------|-----------|---------|---------|
| ♂ 30 ans · 80 kg · 175 cm · modéré · **perte** | 26.1 surpoids | 1749 | 2711 | **2211** | 160 g | 74 g | 227 g |
| ♀ 25 ans · 60 kg · 165 cm · léger · **maintien** | 22.0 normal | 1381 | 1899 | **1899** | 96 g | 63 g | 262 g |
| ♂ 22 ans · 70 kg · 180 cm · très actif · **prise masse** | 21.6 normal | 1787 | 3082 | **3382** | 154 g | 113 g | 435 g |
| ♀ 45 ans · 90 kg · 162 cm · sédentaire · **perte** | 34.3 obésité I | 1572 | 1886 | **1386** | 180 g | 46 g | 91 g |

> Chaque ligne est le résultat d'un appel API — même endpoint, profils différents.

---

## 🏗️ Architecture

```mermaid
graph TD
    Client["🌐 Client\ncurl / app / Swagger UI"]

    subgraph API["API Layer — Express"]
        MW["Middlewares\nHelmet · CORS · Rate Limit · Body Parser"]
        R["Router V1\n/api/v1/nutrition"]
    end

    subgraph Validation["Validation Layer"]
        V["ProfileValidator\nZod Schema — UC-01"]
    end

    subgraph Engine["Nutrition Engine — Core"]
        IMC["IMC Calculator\nUC-02"]
        BMR["BMR Calculator\nMifflin-St Jeor — UC-03"]
        TDEE["TDEE Calculator\nUC-04"]
        CA["Caloric Adjuster\n+ Safety Guards — UC-05"]
        MC["Macro Calculator\nUC-06 · UC-07 · UC-08"]
    end

    RB["Response Builder\nNutritionReport JSON"]

    Client --> MW --> R --> V
    V -- "ValidationError" --> Client
    V -- "UserProfile" --> IMC & BMR
    BMR --> TDEE --> CA --> MC --> RB --> Client
    IMC --> RB
```

Voir [ARCHITECTURE.md](ARCHITECTURE.md) pour les décisions techniques et références scientifiques.

---

## 🛠️ Stack Technologique

| Couche | Technologie | Rôle |
|--------|-------------|------|
| **Runtime** | Node.js 20 LTS | Environnement d'exécution |
| **Langage** | TypeScript 5 strict | Typage statique, zéro `any` |
| **Framework** | Express 4 | Serveur HTTP / Router |
| **Validation** | Zod 3 | Schémas typés, messages en français |
| **Sécurité** | Helmet + express-rate-limit | Headers + protection DoS |
| **Tests** | Vitest + Supertest | Unitaires & intégration |
| **Qualité** | ESLint + Prettier | Lint + formatage |
| **Documentation** | Swagger UI + OpenAPI 3.0 | API interactive |
| **Conteneurisation** | Docker multi-stage | Dev / Prod isolés |
| **CI/CD** | GitHub Actions | Lint · Tests · Build · Audit |

---

## 🚀 Installation Rapide

### Via Docker (recommandé)

```bash
git clone https://github.com/Anasoufkir/Syst-me-de-Nutrition-Intelligente.git
cd Syst-me-de-Nutrition-Intelligente
cp .env.example .env
docker compose up -d
```

![Docker start + health check](docs/screenshots/docker-start.svg)

### Installation manuelle

```bash
git clone https://github.com/Anasoufkir/Syst-me-de-Nutrition-Intelligente.git
cd Syst-me-de-Nutrition-Intelligente
npm install
cp .env.example .env
npm run build
npm start
```

Guide complet → [SETUP.md](SETUP.md)

---

## 📚 API Reference

![Swagger UI](docs/screenshots/swagger-ui.svg)

Documentation interactive : `http://localhost:3000/api/docs` · Spec YAML : [`docs/api/openapi.yaml`](docs/api/openapi.yaml)

### Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET`  | `/api/v1/health` | Health check |
| `POST` | `/api/v1/nutrition/validate` | Validation du profil (UC-01) |
| `POST` | `/api/v1/nutrition/analyze` | Analyse nutritionnelle complète (UC-01→08) |

### Corps de la requête

```typescript
{
  sexe:            "homme" | "femme"
  age:             number   // 15 – 120 ans
  taille:          number   // 100 – 250 cm
  poids:           number   // 30 – 300 kg
  niveau_activite: "sedentaire" | "legerement_actif" | "moderement_actif"
                 | "tres_actif" | "extremement_actif"
  objectif:        "perte_poids" | "maintien" | "prise_masse"
}
```

---

## 🧪 Tests

```bash
npm test              # tous les tests
npm run test:coverage # rapport de couverture (cible ≥ 80%)
```

![Résultats des tests](docs/screenshots/test-results.svg)

### Couverture actuelle

| Module | Tests | Cas couverts |
|--------|-------|-------------|
| `profile.validator` | 9 tests | Champs manquants, bornes min/max, valeurs invalides |
| `imc.calculator` | 7 tests | 8 classifications OMS, arrondi, référence |
| `bmr.calculator` | 5 tests | Formule homme/femme, explication, entier |
| `tdee.calculator` | 8 tests | 5 niveaux d'activité, monotonicité, entier |
| `caloric.adjuster` | 6 tests | 3 objectifs, planchers ♀/♂, avertissement |
| `macro.calculator` | 12 tests | Ratios protéines, 9 kcal/g lipides, reste glucides, cohérence |
| **API (intégration)** | **13 tests** | Happy path, erreurs 400, plancher sécurité, TDEE > BMR |
| **Total** | **60 tests** | |

### Pipeline CI

```mermaid
graph LR
    Push["git push"] --> L["Lint\nESLint + Typecheck"]
    L --> T["Tests\n+ Coverage ≥ 80%"]
    T --> S["Security\nnpm audit"]
    S --> B["Build\ntsc compile"]
    B --> OK["✅ Merge autorisé"]

    L -- ❌ --> FAIL["🔴 PR bloquée"]
    T -- ❌ --> FAIL
    S -- ❌ --> FAIL
    B -- ❌ --> FAIL
```

---

## 🚢 Déploiement

Guides complets dans [DEPLOYMENT.md](DEPLOYMENT.md) :

| Méthode | Commande |
|---------|---------|
| Docker production | `docker compose up -d --build` |
| VPS + PM2 | `pm2 start dist/app.js --name nutrition-api` |
| Nginx reverse proxy | Voir [DEPLOYMENT.md#nginx](DEPLOYMENT.md#reverse-proxy-nginx) |
| HTTPS (Certbot) | Voir [DEPLOYMENT.md#https](DEPLOYMENT.md#https-avec-certbot) |

---

## 🤝 Contribution

Les contributions sont les bienvenues. Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les conventions de code, le format des commits et le processus de PR.

---

## 🔒 Sécurité

Pour signaler une vulnérabilité → [SECURITY.md](SECURITY.md)

---

## 📄 Licence

MIT — voir [LICENSE](LICENSE)

---

<div align="center">

Développé par [Anasoufkir](https://github.com/Anasoufkir)

</div>
