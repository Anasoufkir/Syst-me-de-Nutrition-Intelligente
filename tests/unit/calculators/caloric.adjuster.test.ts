import { describe, it, expect } from 'vitest';
import { ajusterCalories } from '../../../src/core/calculators/caloric.adjuster';

describe('ajusterCalories (UC-05)', () => {
  it('applique un déficit de 500 kcal pour perte_poids', () => {
    const result = ajusterCalories(2500, 'perte_poids', 'homme');
    expect(result.valeur).toBe(2000);
    expect(result.ajustement).toBe(-500);
  });

  it('ne modifie pas les calories pour maintien', () => {
    const result = ajusterCalories(2200, 'maintien', 'femme');
    expect(result.valeur).toBe(2200);
    expect(result.ajustement).toBe(0);
  });

  it('ajoute 300 kcal pour prise_masse', () => {
    const result = ajusterCalories(2400, 'prise_masse', 'homme');
    expect(result.valeur).toBe(2700);
    expect(result.ajustement).toBe(300);
  });

  it('applique le minimum de 1500 kcal pour un homme', () => {
    const result = ajusterCalories(1800, 'perte_poids', 'homme');
    expect(result.valeur).toBe(1500);
    expect(result.avertissement).toBeDefined();
  });

  it('applique le minimum de 1200 kcal pour une femme', () => {
    const result = ajusterCalories(1500, 'perte_poids', 'femme');
    expect(result.valeur).toBe(1200);
    expect(result.avertissement).toBeDefined();
  });

  it("n'ajoute pas d'avertissement quand le minimum n'est pas déclenché", () => {
    const result = ajusterCalories(2500, 'perte_poids', 'homme');
    expect(result.avertissement).toBeUndefined();
  });
});
