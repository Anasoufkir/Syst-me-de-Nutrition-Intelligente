# Guide de Contribution

Merci de l'intérêt que vous portez au Système de Nutrition Intelligente ! Ce guide explique comment contribuer efficacement au projet.

---

## Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Environnement de Développement](#environnement-de-développement)
- [Conventions de Code](#conventions-de-code)
- [Format des Commits](#format-des-commits)
- [Processus de Pull Request](#processus-de-pull-request)
- [Signaler un Bug](#signaler-un-bug)
- [Proposer une Fonctionnalité](#proposer-une-fonctionnalité)

---

## Code de Conduite

Ce projet adhère aux principes suivants :
- Respecter tous les contributeurs, quel que soit leur niveau
- Accepter les critiques constructives
- Se concentrer sur ce qui est le mieux pour le projet
- Faire preuve d'empathie envers les autres membres de la communauté

---

## Comment Contribuer

### Types de contributions bienvenues

| Type | Description |
|------|-------------|
| 🐛 Bug fix | Correction d'un comportement incorrect |
| ✨ Feature | Nouvelle fonctionnalité conforme aux use cases |
| 📝 Docs | Amélioration de la documentation |
| ✅ Tests | Ajout ou amélioration de tests |
| ♻️ Refactor | Amélioration du code sans changer le comportement |
| 🔒 Security | Correction d'une vulnérabilité |

### Ce qui n'est PAS accepté
- Modifications des formules scientifiques sans référence publiée
- Ajout de persistance de données médicales sans discussion préalable
- Réduction de la couverture de tests en dessous de 80%

---

## Environnement de Développement

### Prérequis
- Node.js >= 20.x
- npm >= 10.x
- Git

### Installation

```bash
# Fork puis clone du dépôt
git clone https://github.com/<votre-username>/Syst-me-de-Nutrition-Intelligente.git
cd Syst-me-de-Nutrition-Intelligente

# Installer les dépendances
npm install

# Copier la configuration
cp .env.example .env

# Vérifier que tout fonctionne
npm test
npm run build
```

### Scripts disponibles

```bash
npm run dev          # Démarrer en mode développement (hot-reload)
npm run build        # Compiler TypeScript
npm start            # Démarrer la version compilée
npm test             # Lancer les tests
npm run test:watch   # Tests en mode watch
npm run test:coverage# Rapport de couverture
npm run lint         # Vérifier le style de code
npm run lint:fix     # Corriger automatiquement
npm run format       # Formater avec Prettier
npm run typecheck    # Vérification TypeScript sans compilation
```

---

## Conventions de Code

### TypeScript

```typescript
// ✅ Bon : types explicites, fonction pure, explication claire
export function calculerIMC(poids: number, taille: number): IMCResult {
  const tailleEnMetres = taille / 100;
  const imc = poids / (tailleEnMetres ** 2);
  return {
    valeur: Math.round(imc * 10) / 10,
    classification: classerIMC(imc),
    reference: 'Classification OMS 2000',
  };
}

// ❌ Mauvais : any, pas de type de retour, effet de bord
function calcIMC(p: any, t: any) {
  console.log('calcul...');
  return p / (t / 100) ** 2;
}
```

### Règles générales
- **Pas de `any`** — utiliser `unknown` si le type est vraiment inconnu
- **Fonctions pures** pour tous les calculateurs — pas d'effets de bord
- **Nommage en français** pour les variables métier (profil, poids, taille…)
- **Nommage en anglais** pour l'infrastructure (controller, service, middleware…)
- **Limite de ligne** : 100 caractères
- **Indentation** : 2 espaces

### Organisation des fichiers

Chaque calculateur doit suivre ce pattern :

```typescript
// src/core/calculators/xxx.calculator.ts

import type { UserProfile } from '../../types/profile.types';
import type { XxxResult } from '../../types/nutrition.types';

/**
 * Calcule XXX selon la méthode YYY.
 * Référence: Auteur et al., Année
 */
export function calculerXxx(profile: UserProfile): XxxResult {
  // implémentation
}
```

---

## Format des Commits

Ce projet utilise la convention [Conventional Commits](https://www.conventionalcommits.org/).

### Structure

```
<type>(<scope>): <description courte>

[corps optionnel]

[footer optionnel]
```

### Types acceptés

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation uniquement |
| `test` | Ajout ou correction de tests |
| `refactor` | Refactorisation sans changement de comportement |
| `chore` | Tâches de maintenance (deps, config…) |
| `perf` | Amélioration de performance |
| `security` | Correction de vulnérabilité |

### Scopes recommandés

`uc-01` · `uc-02` · `uc-03` · `uc-04` · `uc-05` · `uc-06` · `uc-07` · `uc-08` · `api` · `docs` · `config` · `deps`

### Exemples

```bash
# ✅ Bons commits
git commit -m "feat(uc-02): implement IMC calculator with WHO classification"
git commit -m "fix(uc-05): enforce minimum 1200 kcal safety floor for women"
git commit -m "test(uc-03): add edge cases for BMR with extreme age values"
git commit -m "docs(api): update OpenAPI spec for /analyze endpoint"

# ❌ Mauvais commits
git commit -m "fix bug"
git commit -m "update"
git commit -m "WIP"
```

---

## Processus de Pull Request

### 1. Créer une branche

```bash
# Format: <type>/<uc-xx>-<description-courte>
git checkout -b feat/uc-02-imc-calculator
git checkout -b fix/uc-05-caloric-minimum-guardrail
git checkout -b docs/openapi-spec
```

### 2. Développer et tester

```bash
# Vérifier que les tests passent
npm test

# Vérifier la couverture (> 80% requis)
npm run test:coverage

# Vérifier le style
npm run lint
npm run typecheck
```

### 3. Ouvrir la Pull Request

Titre de la PR : même format que les commits (`feat(uc-02): ...`)

Le corps de la PR doit inclure :

```markdown
## Description
Brève description des changements

## Use Case lié
UC-XX — Nom du use case

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Documentation
- [ ] Refactoring

## Tests
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Couverture > 80%
- [ ] Tests d'intégration si applicable

## Références scientifiques (si calcul modifié)
- Source de la formule utilisée
```

### 4. Critères de merge

- [ ] Tous les tests passent
- [ ] Couverture de code ≥ 80%
- [ ] Lint sans erreur
- [ ] TypeScript sans erreur
- [ ] Au moins 1 review approuvée
- [ ] Pas de conflit avec `main`

---

## Signaler un Bug

Utiliser le [template d'issue bug](https://github.com/Anasoufkir/Syst-me-de-Nutrition-Intelligente/issues/new) avec :

1. **Description** du comportement incorrect
2. **Étapes pour reproduire** (avec les valeurs d'entrée exactes)
3. **Résultat obtenu** vs **résultat attendu**
4. **Environnement** (Node.js version, OS)

---

## Proposer une Fonctionnalité

Avant de coder, ouvrir une issue de type `enhancement` pour discuter :

1. Le problème que la fonctionnalité résout
2. La solution envisagée
3. L'impact sur les formules/calculs existants
4. Les références scientifiques si applicable

---

## Questions ?

Ouvrir une [Discussion GitHub](https://github.com/Anasoufkir/Syst-me-de-Nutrition-Intelligente/discussions) pour toute question générale.
