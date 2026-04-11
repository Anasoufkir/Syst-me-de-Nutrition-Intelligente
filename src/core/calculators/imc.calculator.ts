import type { UserProfile } from '../../types/profile.types';
import type { IMCResult } from '../../types/nutrition.types';

function classerIMC(imc: number): string {
  if (imc < 16.0) return 'maigreur_severe';
  if (imc < 17.0) return 'maigreur_moderee';
  if (imc < 18.5) return 'maigreur_legere';
  if (imc < 25.0) return 'normal';
  if (imc < 30.0) return 'surpoids';
  if (imc < 35.0) return 'obesite_1';
  if (imc < 40.0) return 'obesite_2';
  return 'obesite_3';
}

/**
 * Calcule l'IMC et sa classification OMS.
 * Formule : poids(kg) / taille(m)²
 * Référence : OMS (2000)
 */
export function calculerIMC(profile: Pick<UserProfile, 'poids' | 'taille'>): IMCResult {
  const tailleM = profile.taille / 100;
  const imc = profile.poids / (tailleM * tailleM);
  const valeur = Math.round(imc * 10) / 10;

  return {
    valeur,
    classification: classerIMC(valeur),
    reference: 'Classification OMS 2000',
  };
}
