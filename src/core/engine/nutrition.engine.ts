import type { UserProfile } from '../../types/profile.types';
import type { NutritionReport } from '../../types/nutrition.types';
import { calculerIMC } from '../calculators/imc.calculator';
import { calculerBMR } from '../calculators/bmr.calculator';
import { calculerTDEE } from '../calculators/tdee.calculator';
import { ajusterCalories } from '../calculators/caloric.adjuster';
import { calculerMacros } from '../calculators/macro.calculator';

/**
 * Orchestre l'ensemble des calculs nutritionnels UC-02 à UC-08.
 * Reçoit un profil validé et retourne un rapport complet.
 */
export function analyserNutrition(profile: UserProfile): NutritionReport {
  const imc = calculerIMC(profile);
  const bmr = calculerBMR(profile);
  const tdee = calculerTDEE(bmr.valeur, profile.niveau_activite);
  const calories_cibles = ajusterCalories(tdee.valeur, profile.objectif, profile.sexe);
  const macronutriments = calculerMacros(profile.poids, profile.objectif, calories_cibles.valeur);

  return {
    profil: { imc, bmr, tdee },
    calories_cibles,
    macronutriments,
  };
}
