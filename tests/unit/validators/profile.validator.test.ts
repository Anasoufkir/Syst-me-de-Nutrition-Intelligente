import { describe, it, expect } from 'vitest';
import { validateProfile } from '../../../src/core/validators/profile.validator';

const validProfile = {
  sexe: 'homme',
  age: 30,
  taille: 175,
  poids: 80,
  niveau_activite: 'moderement_actif',
  objectif: 'maintien',
};

describe('validateProfile (UC-01)', () => {
  it('accepte un profil complet et valide', () => {
    const result = validateProfile(validProfile);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sexe).toBe('homme');
      expect(result.data.age).toBe(30);
    }
  });

  it('rejette un profil sans champs obligatoires', () => {
    const result = validateProfile({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it('rejette un âge hors bornes (< 15)', () => {
    const result = validateProfile({ ...validProfile, age: 10 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const ageError = result.errors.find((e) => e.field === 'age');
      expect(ageError).toBeDefined();
    }
  });

  it('rejette un âge hors bornes (> 120)', () => {
    const result = validateProfile({ ...validProfile, age: 150 });
    expect(result.success).toBe(false);
  });

  it('rejette une taille hors bornes (< 100 cm)', () => {
    const result = validateProfile({ ...validProfile, taille: 50 });
    expect(result.success).toBe(false);
  });

  it('rejette un poids hors bornes (< 30 kg)', () => {
    const result = validateProfile({ ...validProfile, poids: 20 });
    expect(result.success).toBe(false);
  });

  it('rejette un niveau_activite invalide', () => {
    const result = validateProfile({ ...validProfile, niveau_activite: 'ultra_actif' });
    expect(result.success).toBe(false);
  });

  it('rejette un objectif invalide', () => {
    const result = validateProfile({ ...validProfile, objectif: 'secher' });
    expect(result.success).toBe(false);
  });

  it('accepte sexe femme', () => {
    const result = validateProfile({ ...validProfile, sexe: 'femme' });
    expect(result.success).toBe(true);
  });
});
