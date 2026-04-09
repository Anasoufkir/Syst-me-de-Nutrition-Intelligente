# UC-05 — Ajustement Calorique Sécurisé

**Objectif** : Calculer les calories cibles en fonction de l'objectif, avec des garde-fous de sécurité.

---

## Règles d'ajustement

| Objectif | Ajustement | Justification |
|----------|-----------|---------------|
| `perte_poids` | TDEE − 500 kcal | Déficit créant ~0.5 kg/semaine de perte |
| `maintien` | TDEE | Aucun ajustement |
| `prise_masse` | TDEE + 300 kcal | Surplus modéré pour éviter prise de gras excessive |

---

## Garde-fous de sécurité

| Condition | Minimum absolu |
|-----------|---------------|
| Femme | **1 200 kcal/jour** |
| Homme | **1 500 kcal/jour** |

Si l'ajustement calculé descend en dessous du minimum, la valeur minimum est appliquée et une note d'avertissement est incluse dans la réponse.

**Déficit maximum autorisé** : −500 kcal/jour (jamais plus, quel que soit l'objectif).

---

## Entrées

| Champ | Type |
|-------|------|
| `tdee` | number (calculé par UC-04) |
| `objectif` | `"perte_poids"` \| `"maintien"` \| `"prise_masse"` |
| `sexe` | `"homme"` \| `"femme"` (pour le minimum de sécurité) |

## Sortie

```ts
{
  valeur: number,
  unite: "kcal/jour",
  ajustement: number,   // valeur signée : -500, 0, +300
  objectif: string,     // description lisible
  avertissement?: string // présent si le minimum de sécurité a été appliqué
}
```

## Référence

Hall, K. D., et al. (2012). *Quantification of the effect of energy imbalance on bodyweight.* The Lancet, 378(9793), 826–837.
