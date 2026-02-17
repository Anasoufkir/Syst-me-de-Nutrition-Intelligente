# Architecture — Système de Nutrition Intelligente

## Vue d'ensemble

Le Système de Nutrition Intelligente est une **API REST sans état** organisée en couches fonctionnelles indépendantes. Chaque couche a une responsabilité unique, ce qui facilite les tests unitaires, la maintenance et l'évolution du moteur de calcul.

---

## Diagramme d'architecture global

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT                                  │
│              (curl / application frontend / Swagger UI)         │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTPS / HTTP
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Express)                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Router V1                            │    │
│  │  POST /api/v1/nutrition/analyze                         │    │
│  │  POST /api/v1/nutrition/validate                        │    │
│  │  GET  /api/v1/health                                    │    │
│  └──────────────────────────┬──────────────────────────────┘    │
│                             │                                   │
│  ┌──────────────────────────▼──────────────────────────────┐    │
│  │               Middleware Stack                          │    │
│  │  Helmet (security) → Rate Limiter → Body Parser →       │    │
│  │  Request Logger → Error Handler                         │    │
│  └──────────────────────────┬──────────────────────────────┘    │
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                   VALIDATION LAYER                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              ProfileValidator (UC-01)                   │    │
│  │                                                         │    │
│  │  Zod Schema:                                            │    │
│  │  • sexe: "homme" | "femme"                              │    │
│  │  • age: number (15–120)                                 │    │
│  │  • taille: number (100–250 cm)                          │    │
│  │  • poids: number (30–300 kg)                            │    │
│  │  • niveau_activite: ActivityLevel enum                  │    │
│  │  • objectif: Objectif enum                              │    │
│  │                                                         │    │
│  │  → ValidationError si invalide (400)                    │    │
│  └──────────────────────────┬──────────────────────────────┘    │
└─────────────────────────────┼───────────────────────────────────┘
                              │ UserProfile (validated)
┌─────────────────────────────▼───────────────────────────────────┐
│                   NUTRITION ENGINE (Core)                       │
│                                                                 │
│  ┌───────────────┐   ┌───────────────┐   ┌───────────────────┐  │
│  │  IMC Module   │   │  BMR Module   │   │   TDEE Module     │  │
│  │   (UC-02)     │   │   (UC-03)     │   │    (UC-04)        │  │
│  │               │   │               │   │                   │  │
│  │ poids / taille│   │ Mifflin-St    │   │ BMR × Activity    │  │
│  │      ²        │   │ Jeor formula  │   │ Factor            │  │
│  │               │   │               │   │                   │  │
│  │ → IMCResult   │   │ → BMRResult   │   │ → TDEEResult      │  │
│  └───────┬───────┘   └───────┬───────┘   └─────────┬─────────┘  │
│          │                   │                     │             │
│          └───────────────────┼─────────────────────┘             │
│                              │                                   │
│  ┌───────────────────────────▼─────────────────────────────┐    │
│  │           CaloricAdjuster (UC-05)                       │    │
│  │                                                         │    │
│  │  objectif == "prise_masse"   → TDEE + 300..500 kcal     │    │
│  │  objectif == "perte_poids"   → TDEE - 500 kcal          │    │
│  │  objectif == "maintien"      → TDEE                     │    │
│  │                                                         │    │
│  │  Garde-fous:                                            │    │
│  │  • Min absolu: 1200 kcal/j (femme) / 1500 kcal/j (homme)│    │
│  │  • Max déficit: -500 kcal/j                             │    │
│  │                                                         │    │
│  │ → CaloricTarget                                         │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                   │
│  ┌───────────────────────────▼─────────────────────────────┐    │
│  │           MacroCalculator (UC-06/07/08)                 │    │
│  │                                                         │    │
│  │  Protéines (UC-06): 1.6–2.2 g × poids (kg)             │    │
│  │  Lipides   (UC-07): 25–35% calories cibles              │    │
│  │  Glucides  (UC-08): calories restantes / 4              │    │
│  │                                                         │    │
│  │  Vérification cohérence: Σ macros ≈ calories cibles     │    │
│  │                                                         │    │
│  │ → MacroResult                                           │    │
│  └───────────────────────────┬─────────────────────────────┘    │
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│               RESPONSE BUILDER                                  │
│                                                                 │
│  Assemble NutritionReport:                                      │
│  {                                                              │
│    profil: { imc, bmr, tdee },                                  │
│    calories_cibles: { valeur, ajustement, objectif },           │
│    macronutriments: { proteines, lipides, glucides },           │
│    disclaimer: string                                           │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Structure des dossiers (cible V1)

```
Syst-me-de-Nutrition-Intelligente/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   └── nutrition.routes.ts       # Définition des routes
│   │   ├── controllers/
│   │   │   └── nutrition.controller.ts   # Handlers HTTP
│   │   └── middlewares/
│   │       ├── errorHandler.ts           # Gestion centralisée des erreurs
│   │       ├── rateLimiter.ts            # Rate limiting
│   │       └── requestLogger.ts          # Logging des requêtes
│   ├── core/
│   │   ├── validators/
│   │   │   └── profile.validator.ts      # UC-01: Validation du profil
│   │   ├── calculators/
│   │   │   ├── imc.calculator.ts         # UC-02: Calcul IMC
│   │   │   ├── bmr.calculator.ts         # UC-03: Calcul BMR (Mifflin-St Jeor)
│   │   │   ├── tdee.calculator.ts        # UC-04: Calcul TDEE
│   │   │   ├── caloric.adjuster.ts       # UC-05: Ajustement calorique
│   │   │   └── macro.calculator.ts       # UC-06/07/08: Macronutriments
│   │   └── engine/
│   │       └── nutrition.engine.ts       # Orchestrateur des calculs
│   ├── types/
│   │   ├── profile.types.ts              # Types du profil utilisateur
│   │   ├── nutrition.types.ts            # Types des résultats nutritionnels
│   │   └── api.types.ts                  # Types des réponses API
│   ├── utils/
│   │   └── logger.ts                     # Logger applicatif
│   ├── config/
│   │   └── app.config.ts                 # Configuration centralisée
│   └── app.ts                            # Initialisation Express
├── tests/
│   ├── unit/
│   │   ├── validators/
│   │   └── calculators/
│   └── integration/
│       └── nutrition.api.test.ts
├── docs/
│   ├── api/
│   │   └── openapi.yaml                  # Spécification OpenAPI 3.0
│   └── use-cases/
│       └── UC-XX-*.md                    # Spécifications détaillées
├── docker/
│   ├── Dockerfile
│   └── .dockerignore
├── .env.example
├── docker-compose.yml
├── tsconfig.json
├── package.json
└── README.md
```

---

## Flux de données

### Requête d'analyse nutritionnelle

```
POST /api/v1/nutrition/analyze
         │
         ▼
[1] Middleware Stack
    • Helmet (headers sécurité)
    • Rate limiter (100 req/15min)
    • Body parser (JSON)
    • Request logger
         │
         ▼
[2] NutritionController.analyze()
         │
         ▼
[3] ProfileValidator.validate(body)
    ├── OK  → UserProfile typé
    └── KO  → ValidationError (400) avec champs en erreur
         │
         ▼
[4] NutritionEngine.compute(profile)
    ├── imcCalculator.compute()
    ├── bmrCalculator.compute()
    ├── tdeeCalculator.compute()
    ├── caloricAdjuster.adjust()
    └── macroCalculator.compute()
         │
         ▼
[5] ResponseBuilder.build(results)
    → NutritionReport JSON
         │
         ▼
[6] HTTP 200 + NutritionReport
```

---

## Décisions d'architecture

### 1. API REST sans état
**Décision** : Aucune session, aucune persistance de données utilisateur par défaut.  
**Raison** : Simplifie le déploiement, élimine les risques RGPD liés aux données de santé, facilite la scalabilité horizontale.

### 2. TypeScript strict
**Décision** : `strict: true` dans `tsconfig.json`, types explicites pour tous les résultats de calcul.  
**Raison** : Les erreurs de type sur des calculs nutritionnels peuvent avoir des conséquences sur la santé de l'utilisateur. Le typage strict est une protection supplémentaire.

### 3. Validation avec Zod
**Décision** : Zod plutôt que class-validator ou joi.  
**Raison** : Inférence de type TypeScript native, pas besoin de décorateurs, validation et typage en une seule source de vérité.

### 4. Moteur de calcul pur (pure functions)
**Décision** : Chaque calculateur est une fonction pure sans effets de bord.  
**Raison** : Testabilité maximale (les tests unitaires n'ont pas besoin de mocks), déterminisme garanti pour les calculs médicaux.

### 5. Formule Mifflin-St Jeor pour le BMR
**Décision** : Mifflin-St Jeor plutôt que Harris-Benedict.  
**Raison** : Reconnue comme plus précise par l'Academy of Nutrition and Dietetics (2005), notamment pour les personnes en surpoids.

---

## Références scientifiques

| Calcul | Formule | Source |
|--------|---------|--------|
| IMC | poids(kg) / taille(m)² | OMS, 2000 |
| Classification IMC | < 18.5 / 18.5–24.9 / 25–29.9 / ≥ 30 | OMS, 2000 |
| BMR (homme) | 10×poids + 6.25×taille − 5×âge + 5 | Mifflin et al., 1990 |
| BMR (femme) | 10×poids + 6.25×taille − 5×âge − 161 | Mifflin et al., 1990 |
| Facteur sédentaire | BMR × 1.2 | Ainsworth et al., 2011 |
| Facteur légèrement actif | BMR × 1.375 | Ainsworth et al., 2011 |
| Facteur modérément actif | BMR × 1.55 | Ainsworth et al., 2011 |
| Facteur très actif | BMR × 1.725 | Ainsworth et al., 2011 |
| Facteur extrêmement actif | BMR × 1.9 | Ainsworth et al., 2011 |
| Protéines (prise de masse) | 2.0–2.2 g/kg | Morton et al., 2018 (meta-analysis) |
| Protéines (perte de poids) | 1.6–2.0 g/kg | Helms et al., 2014 |
| Lipides minimum | 20–25% des calories | ANSES, 2019 |
