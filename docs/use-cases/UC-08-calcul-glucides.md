# UC-08 — Calcul des Glucides

**Objectif** : Calculer les glucides comme reste calorique après protéines et lipides, avec vérification de cohérence.

---

## Formule

```
calories_glucides = calories_cibles − calories_protéines − calories_lipides
glucides(g) = calories_glucides / 4
```

**Valeur calorique** : 1 g de glucide = **4 kcal**

---

## Vérification de cohérence

Après calcul, vérifier que :

1. `glucides(g) >= 50 g/jour` — minimum physiologique (fonctionnement cérébral)
2. `Σ calories macros ≈ calories_cibles` — tolérance ±5 kcal (arrondi)

Si `glucides < 50 g`, un avertissement est inclus (régime très basse glucides détecté).

---

## Entrées

| Champ | Type |
|-------|------|
| `calories_cibles` | number (UC-05) |
| `calories_proteines` | number (UC-06) |
| `calories_lipides` | number (UC-07) |

## Sortie

```ts
{
  valeur: number,       // grammes, arrondi à l'entier
  unite: "g",
  calories: number,
  pourcentage: number,
  avertissement?: string
}
```

## Référence

Institute of Medicine (2005). *Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids.* National Academies Press.
