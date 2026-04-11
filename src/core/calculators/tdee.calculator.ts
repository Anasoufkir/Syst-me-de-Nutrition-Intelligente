import type { UserProfile } from '../../types/profile.types';
import type { TDEEResult } from '../../types/nutrition.types';

const FACTEURS_ACTIVITE: Record<UserProfile['niveau_activite'], { facteur: number; libelle: string }> = {
  sedentaire:          { facteur: 1.2,   libelle: 'sédentaire' },
  legerement_actif:    { facteur: 1.375, libelle: 'légèrement actif·ve' },
  moderement_actif:    { facteur: 1.55,  libelle: 'modérément actif·ve' },
  tres_actif:          { facteur: 1.725, libelle: 'très actif·ve' },
  extremement_actif:   { facteur: 1.9,   libelle: 'extrêmement actif·ve' },
};

/**
 * Calcule la dépense énergétique totale (TDEE).
 * Formule : BMR × facteur d'activité
 * Référence : Ainsworth et al., Med Sci Sports Exerc 2011
 */
export function calculerTDEE(
  bmr: number,
  niveau_activite: UserProfile['niveau_activite']
): TDEEResult {
  const { facteur, libelle } = FACTEURS_ACTIVITE[niveau_activite];

  return {
    valeur: Math.round(bmr * facteur),
    unite: 'kcal/jour',
    facteur_activite: facteur,
    niveau: libelle,
  };
}
