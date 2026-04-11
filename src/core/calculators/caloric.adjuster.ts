import type { UserProfile } from '../../types/profile.types';
import type { CaloricTarget } from '../../types/nutrition.types';

const AJUSTEMENTS: Record<UserProfile['objectif'], { delta: number; libelle: string }> = {
  perte_poids: { delta: -500, libelle: 'perte de poids sécurisée (≈ 0.5 kg/semaine)' },
  maintien:    { delta: 0,    libelle: 'maintien du poids actuel' },
  prise_masse: { delta: 300,  libelle: 'prise de masse musculaire progressive' },
};

const CALORIES_MIN: Record<UserProfile['sexe'], number> = {
  femme: 1200,
  homme: 1500,
};

/**
 * Calcule les calories cibles avec garde-fous de sécurité.
 * Déficit maximum : −500 kcal/j. Minimum absolu selon le sexe.
 */
export function ajusterCalories(
  tdee: number,
  objectif: UserProfile['objectif'],
  sexe: UserProfile['sexe']
): CaloricTarget {
  const { delta, libelle } = AJUSTEMENTS[objectif];
  const minimum = CALORIES_MIN[sexe];
  const calcule = tdee + delta;
  const valeur = Math.max(calcule, minimum);

  const result: CaloricTarget = {
    valeur,
    unite: 'kcal/jour',
    ajustement: valeur === minimum && calcule < minimum ? minimum - tdee : delta,
    objectif: libelle,
  };

  if (calcule < minimum) {
    result.avertissement =
      `Le calcul donnait ${calcule} kcal/j. ` +
      `Le minimum de sécurité de ${minimum} kcal/j a été appliqué.`;
  }

  return result;
}
