import { z } from 'zod';
import type { UserProfile } from '../../types/profile.types';

const profileSchema = z.object({
  sexe: z.enum(['homme', 'femme'], {
    errorMap: () => ({ message: 'Le sexe doit être "homme" ou "femme"' }),
  }),
  age: z
    .number({ invalid_type_error: "L'âge doit être un nombre" })
    .int("L'âge doit être un entier")
    .min(15, "L'âge minimum est 15 ans")
    .max(120, "L'âge maximum est 120 ans"),
  taille: z
    .number({ invalid_type_error: 'La taille doit être un nombre' })
    .min(100, 'La taille minimum est 100 cm')
    .max(250, 'La taille maximum est 250 cm'),
  poids: z
    .number({ invalid_type_error: 'Le poids doit être un nombre' })
    .min(30, 'Le poids minimum est 30 kg')
    .max(300, 'Le poids maximum est 300 kg'),
  niveau_activite: z.enum(
    ['sedentaire', 'legerement_actif', 'moderement_actif', 'tres_actif', 'extremement_actif'],
    { errorMap: () => ({ message: "Niveau d'activité invalide" }) }
  ),
  objectif: z.enum(['perte_poids', 'maintien', 'prise_masse'], {
    errorMap: () => ({ message: 'Objectif invalide' }),
  }),
});

export interface ValidationSuccess {
  success: true;
  data: UserProfile;
}

export interface ValidationFailure {
  success: false;
  errors: Array<{ field: string; message: string }>;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

export function validateProfile(input: unknown): ValidationResult {
  const result = profileSchema.safeParse(input);

  if (result.success) {
    return { success: true, data: result.data as UserProfile };
  }

  const errors = result.error.issues.map((issue) => ({
    field: issue.path.join('.') || 'unknown',
    message: issue.message,
  }));

  return { success: false, errors };
}
