# UC-03 — Calcul BMR (Métabolisme de Base)

**Objectif** : Calculer le métabolisme de base (BMR) via la formule Mifflin-St Jeor.

---

## Formule — Mifflin-St Jeor (1990)

**Homme :**
```
BMR = (10 × poids) + (6.25 × taille) − (5 × âge) + 5
```

**Femme :**
```
BMR = (10 × poids) + (6.25 × taille) − (5 × âge) − 161
```

Avec : poids en kg, taille en cm, âge en années. Résultat en **kcal/jour**.

**Exemple** (homme, 30 ans, 175 cm, 80 kg) :
```
BMR = (10 × 80) + (6.25 × 175) − (5 × 30) + 5
    = 800 + 1093.75 − 150 + 5
    = 1748.75 ≈ 1749 kcal/jour
```

---

## Pourquoi Mifflin-St Jeor ?

| Formule | Année | Précision |
|---------|-------|-----------|
| Harris-Benedict | 1919 | Référence historique, moins précise |
| **Mifflin-St Jeor** | **1990** | **Recommandée — la plus précise en population générale** |
| Katch-McArdle | 1975 | Requiert le % de masse grasse (non disponible ici) |

L'Academy of Nutrition and Dietetics (2005) recommande Mifflin-St Jeor comme formule de référence.

---

## Entrées

| Champ | Type | Contrainte |
|-------|------|-----------|
| `sexe` | `"homme"` \| `"femme"` | validé par UC-01 |
| `poids` | number | validé par UC-01 |
| `taille` | number | validé par UC-01 |
| `age` | number | validé par UC-01 |

## Sortie

```ts
{
  valeur: number,     // arrondi à l'entier
  unite: "kcal/jour",
  methode: "Mifflin-St Jeor",
  explication: string // phrase explicative avec les valeurs
}
```

## Référence

Mifflin, M. D., et al. (1990). *A new predictive equation for resting energy expenditure in healthy individuals.* The American Journal of Clinical Nutrition, 51(2), 241–247.
