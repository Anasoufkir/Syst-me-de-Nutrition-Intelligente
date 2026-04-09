# UC-02 — Calcul IMC + Classification OMS

**Objectif** : Calculer l'Indice de Masse Corporelle et le classifier selon les seuils OMS.

---

## Formule

```
IMC = poids(kg) / taille(m)²
```

**Exemple** : poids = 80 kg, taille = 175 cm → IMC = 80 / (1.75)² = **26.1**

---

## Classifications OMS (2000)

| IMC | Classification | Code |
|-----|---------------|------|
| < 16.0 | Maigreur sévère | `maigreur_severe` |
| 16.0 – 16.9 | Maigreur modérée | `maigreur_moderee` |
| 17.0 – 18.4 | Maigreur légère | `maigreur_legere` |
| 18.5 – 24.9 | Poids normal | `normal` |
| 25.0 – 29.9 | Surpoids | `surpoids` |
| 30.0 – 34.9 | Obésité classe I | `obesite_1` |
| 35.0 – 39.9 | Obésité classe II | `obesite_2` |
| ≥ 40.0 | Obésité classe III | `obesite_3` |

---

## Entrées

| Champ | Type | Contrainte |
|-------|------|-----------|
| `poids` | number | validé par UC-01 |
| `taille` | number | validé par UC-01 |

## Sortie

```ts
{
  valeur: number,          // arrondi à 1 décimale
  classification: string,  // code OMS
  reference: string        // "Classification OMS 2000"
}
```

## Cas particuliers

- La valeur IMC est arrondie à **1 décimale**
- Les bornes sont **inclusives** (ex : 25.0 → `surpoids`, pas `normal`)
- Aucun garde-fou requis : les valeurs d'entrée sont déjà validées par UC-01

## Référence

Organisation Mondiale de la Santé (2000). *Obesity: preventing and managing the global epidemic.* WHO Technical Report Series, 894.
