# UC-04 — Calcul TDEE (Dépense Énergétique Totale)

**Objectif** : Calculer la dépense énergétique totale quotidienne (TDEE) en multipliant le BMR par le facteur d'activité.

---

## Formule

```
TDEE = BMR × facteur_activité
```

---

## Facteurs d'activité

| Niveau | Valeur | Description |
|--------|--------|-------------|
| `sedentaire` | 1.2 | Peu ou pas d'exercice, travail de bureau |
| `legerement_actif` | 1.375 | Exercice léger 1–3 jours/semaine |
| `moderement_actif` | 1.55 | Exercice modéré 3–5 jours/semaine |
| `tres_actif` | 1.725 | Exercice intense 6–7 jours/semaine |
| `extremement_actif` | 1.9 | Athlète professionnel / travail physique très intense |

---

## Entrées

| Champ | Type | Contrainte |
|-------|------|-----------|
| `bmr` | number | calculé par UC-03 |
| `niveau_activite` | ActivityLevel enum | validé par UC-01 |

## Sortie

```ts
{
  valeur: number,          // arrondi à l'entier
  unite: "kcal/jour",
  facteur_activite: number,
  niveau: string           // libellé lisible
}
```

## Référence

Ainsworth, B. E., et al. (2011). *Compendium of physical activities.* Medicine & Science in Sports & Exercise, 43(8), 1575–1581.
