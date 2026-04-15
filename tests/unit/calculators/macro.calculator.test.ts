import { describe, it, expect } from 'vitest';
import { calculerMacros } from '../../../src/core/calculators/macro.calculator';

describe('calculerMacros (UC-06/07/08)', () => {
  describe('UC-06 — Protéines', () => {
    it('utilise un ratio de 2.0 g/kg pour perte_poids', () => {
      const result = calculerMacros(80, 'perte_poids', 2000);
      expect(result.proteines.valeur).toBe(160); // 80 × 2.0
      expect(result.proteines.ratio_par_kg).toBe(2.0);
    });

    it('utilise un ratio de 1.6 g/kg pour maintien', () => {
      const result = calculerMacros(80, 'maintien', 2500);
      expect(result.proteines.valeur).toBe(128); // 80 × 1.6
      expect(result.proteines.ratio_par_kg).toBe(1.6);
    });

    it('utilise un ratio de 2.2 g/kg pour prise_masse', () => {
      const result = calculerMacros(80, 'prise_masse', 2800);
      expect(result.proteines.valeur).toBe(176); // 80 × 2.2
      expect(result.proteines.ratio_par_kg).toBe(2.2);
    });

    it('les calories protéines = valeur × 4', () => {
      const result = calculerMacros(75, 'maintien', 2200);
      expect(result.proteines.calories).toBe(result.proteines.valeur * 4);
    });
  });

  describe('UC-07 — Lipides', () => {
    it('cible 30% des calories pour les lipides', () => {
      const result = calculerMacros(70, 'maintien', 2000);
      const attendu = Math.round((2000 * 0.30) / 9);
      expect(result.lipides.valeur).toBe(attendu);
    });

    it('les calories lipides = valeur × 9', () => {
      const result = calculerMacros(70, 'maintien', 2000);
      expect(result.lipides.calories).toBe(result.lipides.valeur * 9);
    });

    it('applique le minimum de 40 g si nécessaire', () => {
      // Calories très basses → lipides calculés < 40 g
      const result = calculerMacros(50, 'perte_poids', 800);
      expect(result.lipides.valeur).toBeGreaterThanOrEqual(40);
    });
  });

  describe('UC-08 — Glucides', () => {
    it('les glucides représentent le reste calorique', () => {
      const result = calculerMacros(70, 'maintien', 2000);
      const resteCalories =
        2000 - result.proteines.calories - result.lipides.calories;
      expect(result.glucides.calories).toBeCloseTo(Math.max(resteCalories, 0), 0);
    });

    it('les calories glucides = valeur × 4', () => {
      const result = calculerMacros(70, 'maintien', 2000);
      expect(result.glucides.calories).toBe(result.glucides.valeur * 4);
    });

    it('ajoute un avertissement si glucides < 50 g', () => {
      // Profil extrême : beaucoup de protéines + lipides min → peu de glucides
      const result = calculerMacros(100, 'prise_masse', 1300);
      if (result.glucides.valeur < 50) {
        expect(result.glucides.avertissement).toBeDefined();
      }
    });
  });

  describe('Cohérence globale', () => {
    it('la somme des pourcentages est proche de 100%', () => {
      const result = calculerMacros(75, 'maintien', 2200);
      const total =
        result.proteines.pourcentage +
        result.lipides.pourcentage +
        result.glucides.pourcentage;
      expect(total).toBeGreaterThanOrEqual(95);
      expect(total).toBeLessThanOrEqual(105);
    });

    it('toutes les valeurs de macros sont positives', () => {
      const result = calculerMacros(70, 'perte_poids', 1800);
      expect(result.proteines.valeur).toBeGreaterThan(0);
      expect(result.lipides.valeur).toBeGreaterThan(0);
      expect(result.glucides.valeur).toBeGreaterThanOrEqual(0);
    });
  });
});
