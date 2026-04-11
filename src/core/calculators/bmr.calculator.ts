import type { UserProfile } from '../../types/profile.types';
import type { BMRResult } from '../../types/nutrition.types';

/**
 * Calcule le métabolisme de base (BMR) via la formule Mifflin-St Jeor.
 * Homme : (10 × poids) + (6.25 × taille) − (5 × âge) + 5
 * Femme : (10 × poids) + (6.25 × taille) − (5 × âge) − 161
 * Référence : Mifflin et al., AJCN 1990
 */
export function calculerBMR(
  profile: Pick<UserProfile, 'sexe' | 'poids' | 'taille' | 'age'>
): BMRResult {
  const base = 10 * profile.poids + 6.25 * profile.taille - 5 * profile.age;
  const constante = profile.sexe === 'homme' ? 5 : -161;
  const valeur = Math.round(base + constante);

  const explication =
    `Énergie minimale au repos pour un${profile.sexe === 'femme' ? 'e' : ''} ` +
    `${profile.sexe} de ${profile.age} ans, ` +
    `${profile.taille} cm, ${profile.poids} kg`;

  return {
    valeur,
    unite: 'kcal/jour',
    methode: 'Mifflin-St Jeor',
    explication,
  };
}
