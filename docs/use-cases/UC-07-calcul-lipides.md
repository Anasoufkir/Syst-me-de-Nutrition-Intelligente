# UC-07 — Calcul des Lipides

**Objectif** : Calculer les besoins en lipides avec un minimum physiologique garanti.

---

## Formule

```
lipides(g) = (calories_cibles × 0.30) / 9
```

**Valeur calorique** : 1 g de lipide = **9 kcal**

---

## Règles

- Cible : **30%** des calories totales (milieu de la fourchette ANSES 25–35%)
- **Minimum absolu** : 40 g/jour (protection des fonctions hormonales et absorption des vitamines liposolubles A, D, E, K)
- Si le calcul donne moins de 40 g, le minimum est appliqué avec avertissement

---

## Entrées

| Champ | Type |
|-------|------|
| `calories_cibles` | number (calculé par UC-05) |

## Sortie

```ts
{
  valeur: number,       // grammes, arrondi à l'entier
  unite: "g",
  calories: number,     // valeur × 9
  pourcentage: number,  // % des calories cibles
  avertissement?: string
}
```

## Référence

ANSES (2019). *Actualisation des repères du PNNS : révision des repères de consommations alimentaires.* Rapport d'expertise collective.
