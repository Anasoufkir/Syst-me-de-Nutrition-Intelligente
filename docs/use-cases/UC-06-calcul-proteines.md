# UC-06 — Calcul des Protéines

**Objectif** : Calculer les besoins en protéines selon l'objectif et le poids corporel.

---

## Formule

```
protéines(g) = poids(kg) × ratio(g/kg)
```

## Ratios selon l'objectif

| Objectif | Ratio | Justification |
|----------|-------|---------------|
| `perte_poids` | 2.0 g/kg | Préserver la masse musculaire en déficit |
| `maintien` | 1.6 g/kg | Apport suffisant pour l'entretien musculaire |
| `prise_masse` | 2.2 g/kg | Optimiser la synthèse protéique |

**Valeur calorique** : 1 g de protéine = **4 kcal**

---

## Entrées

| Champ | Type |
|-------|------|
| `poids` | number (kg) |
| `objectif` | ObjectifEnum |

## Sortie

```ts
{
  valeur: number,        // grammes, arrondi à l'entier
  unite: "g",
  calories: number,      // valeur × 4
  pourcentage: number,   // % des calories cibles
  ratio_par_kg: number
}
```

## Référence

Morton, R. W., et al. (2018). *A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults.* British Journal of Sports Medicine, 52(6), 376–384.
