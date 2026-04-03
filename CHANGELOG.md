# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Versionnement Sémantique](https://semver.org/lang/fr/).

---

## [Unreleased]

### En cours
- Implémentation des use cases UC-01 à UC-08 (moteur de calcul V1)
- Mise en place du projet Node.js / TypeScript
- Configuration ESLint, Prettier, Vitest

---

## [0.2.0] — 2026-04-16

### Ajouté
- `README.md` professionnel avec badges, tableau des fonctionnalités, exemples d'API
- `ARCHITECTURE.md` — diagrammes ASCII de l'architecture, décisions techniques, références scientifiques
- `CONTRIBUTING.md` — guide de contribution, conventions de commits, processus PR
- `SETUP.md` — guide d'installation détaillé (Docker, manuel, troubleshooting)
- `SECURITY.md` — politique de sécurité et bonnes pratiques
- `DEPLOYMENT.md` — guides de déploiement (Docker, VPS, variables de production)
- `CHANGELOG.md` — historique des versions (ce fichier)
- `.env.example` — modèle de configuration avec descriptions
- `docker-compose.yml` — configuration multi-services (production + développement)
- `docker/Dockerfile` — Dockerfile multi-stage (dev / builder / production)
- `docs/api/openapi.yaml` — spécification OpenAPI 3.0 complète (tous les endpoints)

---

## [0.1.0] — 2026-01-05

### Ajouté
- Structure initiale du projet
- `README.md` de base avec objectifs V1
- `docs/use-cases.md` — liste des 8 use cases
- `docs/use-cases/UC-01-validation-profil.md` — spécification détaillée UC-01
- `docs/definition-of-done.md` — critères de Definition of Done
- `.gitattributes` — configuration des fins de ligne

---

[Unreleased]: https://github.com/Anasoufkir/Syst-me-de-Nutrition-Intelligente/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/Anasoufkir/Syst-me-de-Nutrition-Intelligente/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Anasoufkir/Syst-me-de-Nutrition-Intelligente/releases/tag/v0.1.0
