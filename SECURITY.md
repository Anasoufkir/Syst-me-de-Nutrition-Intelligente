# Politique de Sécurité

## Versions supportées

| Version | Support sécurité |
|---------|-----------------|
| 1.x.x (à venir) | ✅ Supportée |
| 0.x.x (alpha) | ⚠️ Mises à jour best-effort |

---

## Signaler une Vulnérabilité

**Ne pas ouvrir une issue publique pour signaler une vulnérabilité de sécurité.**

Pour signaler une vulnérabilité :

1. Ouvrir un **rapport privé** via [GitHub Security Advisories](https://github.com/Anasoufkir/Syst-me-de-Nutrition-Intelligente/security/advisories/new)
2. Inclure :
   - Description de la vulnérabilité
   - Étapes pour reproduire
   - Impact potentiel estimé
   - Suggestion de correction (optionnel)

**Délai de réponse** : 72h pour un accusé de réception, 14 jours pour une évaluation complète.

---

## Mesures de Sécurité en Place

### Protection des entrées

- **Validation stricte** avec Zod : chaque champ du profil est validé en type, bornes et format avant tout traitement
- **Pas d'évaluation dynamique** : aucun `eval()`, `Function()`, ou équivalent
- **Pas d'injection SQL** : pas de base de données par défaut, aucune requête dynamique

### Protection du serveur HTTP

- **Helmet.js** : headers HTTP de sécurité (CSP, HSTS, X-Frame-Options, etc.)
- **Rate Limiting** : max 100 requêtes / 15 minutes par IP — protection contre les abus et DoS applicatif
- **CORS configuré** : origines autorisées explicitement via variable d'environnement
- **Body size limit** : taille maximale des payloads JSON limitée (prévention des attaques par payload surdimensionné)

### Données personnelles (RGPD)

- **Aucune persistance par défaut** : les données biométriques ne sont pas stockées
- **Traitement en mémoire uniquement** : les calculs sont effectués à la volée, sans journalisation des données personnelles
- **Logs anonymisés** : les logs de requêtes n'incluent pas le corps de la requête (données biométriques)

### Dépendances

- **npm audit** intégré au CI : les dépendances avec vulnérabilités critiques bloquent le build
- **Dependabot activé** : mises à jour automatiques des dépendances
- **Lockfile committé** : `package-lock.json` versionné pour garantir la reproductibilité des builds

### Conteneurisation

- **Image Alpine** : surface d'attaque minimale (image Docker minimale)
- **Utilisateur non-root** : le processus Node.js tourne sous un utilisateur dédié sans privilèges
- **Secrets via variables d'environnement** : aucun secret en dur dans le code ou l'image

---

## Bonnes Pratiques pour les Contributeurs

### Ne jamais committer

- Fichiers `.env` ou contenant des secrets
- Clés API, tokens, mots de passe
- Données personnelles réelles (même pour les tests)

### Tests de sécurité

```bash
# Vérifier les vulnérabilités des dépendances
npm audit

# Corriger automatiquement les vulnérabilités non-critiques
npm audit fix

# Vérifier le code avec ESLint (inclut des règles de sécurité)
npm run lint
```

### Variables d'environnement

- Utiliser `.env.example` comme référence
- Ne jamais inclure de valeurs réelles dans `.env.example`
- Documenter chaque variable avec son rôle et ses valeurs acceptées

---

## Considérations Spécifiques au Domaine Médical

Ce projet traite des **données biométriques** (poids, taille, âge) qui peuvent être considérées comme des données de santé selon le RGPD (Article 9).

Recommandations pour les déploiements en production :

1. **Évaluer si les données constituent des données de santé** au sens du RGPD selon votre cas d'usage
2. **Mettre en place une politique de confidentialité** si des données sont collectées
3. **Ne pas journaliser les données biométriques** dans les logs applicatifs
4. **Utiliser HTTPS** exclusivement en production (jamais HTTP)
5. **Considérer le chiffrement en transit et au repos** si des données sont persistées
