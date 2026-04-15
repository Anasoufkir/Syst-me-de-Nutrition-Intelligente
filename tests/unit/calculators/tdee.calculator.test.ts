import { describe, it, expect } from 'vitest';
import { calculerTDEE } from '../../../src/core/calculators/tdee.calculator';

describe('calculerTDEE (UC-04)', () => {
  it('applique le facteur 1.2 pour sédentaire', () => {
    const result = calculerTDEE(1749, 'sedentaire');
    expect(result.valeur).toBe(Math.round(1749 * 1.2));
    expect(result.facteur_activite).toBe(1.2);
  });

  it('applique le facteur 1.375 pour légèrement actif', () => {
    const result = calculerTDEE(1749, 'legerement_actif');
    expect(result.valeur).toBe(Math.round(1749 * 1.375));
    expect(result.facteur_activite).toBe(1.375);
  });

  it('applique le facteur 1.55 pour modérément actif', () => {
    const result = calculerTDEE(1749, 'moderement_actif');
    expect(result.valeur).toBe(Math.round(1749 * 1.55));
    expect(result.facteur_activite).toBe(1.55);
  });

  it('applique le facteur 1.725 pour très actif', () => {
    const result = calculerTDEE(1749, 'tres_actif');
    expect(result.valeur).toBe(Math.round(1749 * 1.725));
    expect(result.facteur_activite).toBe(1.725);
  });

  it('applique le facteur 1.9 pour extrêmement actif', () => {
    const result = calculerTDEE(1749, 'extremement_actif');
    expect(result.valeur).toBe(Math.round(1749 * 1.9));
    expect(result.facteur_activite).toBe(1.9);
  });

  it('retourne les métadonnées correctes', () => {
    const result = calculerTDEE(1749, 'moderement_actif');
    expect(result.unite).toBe('kcal/jour');
    expect(result.niveau).toBeTruthy();
  });

  it('un TDEE plus actif est toujours supérieur à un moins actif', () => {
    const sedentaire = calculerTDEE(1500, 'sedentaire');
    const tresActif = calculerTDEE(1500, 'tres_actif');
    expect(tresActif.valeur).toBeGreaterThan(sedentaire.valeur);
  });

  it('retourne un entier', () => {
    const result = calculerTDEE(1749, 'legerement_actif');
    expect(Number.isInteger(result.valeur)).toBe(true);
  });
});
