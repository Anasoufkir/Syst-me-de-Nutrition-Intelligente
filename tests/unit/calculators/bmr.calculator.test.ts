import { describe, it, expect } from 'vitest';
import { calculerBMR } from '../../../src/core/calculators/bmr.calculator';

describe('calculerBMR (UC-03)', () => {
  it('calcule le BMR homme correctement', () => {
    // (10×80) + (6.25×175) - (5×30) + 5 = 1748.75 ≈ 1749
    const result = calculerBMR({ sexe: 'homme', poids: 80, taille: 175, age: 30 });
    expect(result.valeur).toBe(1749);
    expect(result.unite).toBe('kcal/jour');
    expect(result.methode).toBe('Mifflin-St Jeor');
  });

  it('calcule le BMR femme correctement', () => {
    // (10×60) + (6.25×165) - (5×25) - 161 = 1381.25 ≈ 1381
    const result = calculerBMR({ sexe: 'femme', poids: 60, taille: 165, age: 25 });
    expect(result.valeur).toBe(1381);
  });

  it('le BMR femme est inférieur à celui de l\'homme à profil équivalent', () => {
    const homme = calculerBMR({ sexe: 'homme', poids: 70, taille: 170, age: 35 });
    const femme = calculerBMR({ sexe: 'femme', poids: 70, taille: 170, age: 35 });
    expect(homme.valeur).toBeGreaterThan(femme.valeur);
  });

  it('inclut une explication lisible', () => {
    const result = calculerBMR({ sexe: 'homme', poids: 80, taille: 175, age: 30 });
    expect(result.explication).toContain('30 ans');
    expect(result.explication).toContain('175 cm');
    expect(result.explication).toContain('80 kg');
  });

  it('retourne un entier', () => {
    const result = calculerBMR({ sexe: 'femme', poids: 55, taille: 160, age: 28 });
    expect(Number.isInteger(result.valeur)).toBe(true);
  });
});
