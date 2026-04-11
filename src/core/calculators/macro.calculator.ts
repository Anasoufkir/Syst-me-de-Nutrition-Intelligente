import type { UserProfile } from '../../types/profile.types';
import type { MacroResult, MacroDetail } from '../../types/nutrition.types';

const RATIO_PROTEINES: Record<UserProfile['objectif'], number> = {
  perte_poids: 2.0,
  maintien:    1.6,
  prise_masse: 2.2,
};

const LIPIDES_MIN_G = 40;
const GLUCIDES_MIN_G = 50;

function arrondir(n: number): number {
  return Math.round(n);
}

/**
 * Calcule les macronutriments (protéines, lipides, glucides).
 * UC-06 : protéines = poids × ratio selon objectif (1 g = 4 kcal)
 * UC-07 : lipides = 30% des calories cibles (1 g = 9 kcal), min 40 g
 * UC-08 : glucides = reste calorique (1 g = 4 kcal), min 50 g
 */
export function calculerMacros(
  poids: number,
  objectif: UserProfile['objectif'],
  caloriesCibles: number
): MacroResult {
  // UC-06 — Protéines
  const ratio = RATIO_PROTEINES[objectif];
  const proteinesG = arrondir(poids * ratio);
  const proteinesCal = proteinesG * 4;
  const proteines: MacroDetail = {
    valeur: proteinesG,
    unite: 'g',
    calories: proteinesCal,
    pourcentage: arrondir((proteinesCal / caloriesCibles) * 100),
    ratio_par_kg: ratio,
  };

  // UC-07 — Lipides
  const lipidesG = Math.max(arrondir((caloriesCibles * 0.30) / 9), LIPIDES_MIN_G);
  const lipidesCal = lipidesG * 9;
  const lipides: MacroDetail = {
    valeur: lipidesG,
    unite: 'g',
    calories: lipidesCal,
    pourcentage: arrondir((lipidesCal / caloriesCibles) * 100),
  };
  if (lipidesG === LIPIDES_MIN_G && (caloriesCibles * 0.30) / 9 < LIPIDES_MIN_G) {
    lipides.avertissement = `Minimum physiologique de ${LIPIDES_MIN_G} g appliqué.`;
  }

  // UC-08 — Glucides
  const glucidesCal = caloriesCibles - proteinesCal - lipidesCal;
  const glucidesG = arrondir(glucidesCal / 4);
  const glucides: MacroDetail = {
    valeur: Math.max(glucidesG, 0),
    unite: 'g',
    calories: Math.max(glucidesCal, 0),
    pourcentage: arrondir((Math.max(glucidesCal, 0) / caloriesCibles) * 100),
  };
  if (glucidesG < GLUCIDES_MIN_G) {
    glucides.avertissement = `Apport en glucides très bas (${glucidesG} g). Régime basse glucides détecté.`;
  }

  return { proteines, lipides, glucides };
}
