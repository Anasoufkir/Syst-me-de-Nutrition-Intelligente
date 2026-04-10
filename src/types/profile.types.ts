export type Sexe = 'homme' | 'femme';

export type NiveauActivite =
  | 'sedentaire'
  | 'legerement_actif'
  | 'moderement_actif'
  | 'tres_actif'
  | 'extremement_actif';

export type Objectif = 'perte_poids' | 'maintien' | 'prise_masse';

export interface UserProfile {
  sexe: Sexe;
  age: number;
  taille: number; // cm
  poids: number;  // kg
  niveau_activite: NiveauActivite;
  objectif: Objectif;
}
