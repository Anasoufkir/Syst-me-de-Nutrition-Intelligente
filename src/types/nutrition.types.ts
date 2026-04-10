export interface IMCResult {
  valeur: number;
  classification: string;
  reference: string;
}

export interface BMRResult {
  valeur: number;
  unite: 'kcal/jour';
  methode: string;
  explication: string;
}

export interface TDEEResult {
  valeur: number;
  unite: 'kcal/jour';
  facteur_activite: number;
  niveau: string;
}

export interface CaloricTarget {
  valeur: number;
  unite: 'kcal/jour';
  ajustement: number;
  objectif: string;
  avertissement?: string;
}

export interface MacroDetail {
  valeur: number;
  unite: 'g';
  calories: number;
  pourcentage: number;
  ratio_par_kg?: number;
  avertissement?: string;
}

export interface MacroResult {
  proteines: MacroDetail;
  lipides: MacroDetail;
  glucides: MacroDetail;
}

export interface NutritionReport {
  profil: {
    imc: IMCResult;
    bmr: BMRResult;
    tdee: TDEEResult;
  };
  calories_cibles: CaloricTarget;
  macronutriments: MacroResult;
}
