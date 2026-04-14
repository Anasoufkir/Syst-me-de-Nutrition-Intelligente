import { describe, it, expect } from 'vitest';
import { calculerIMC } from '../../../src/core/calculators/imc.calculator';

describe('calculerIMC (UC-02)', () => {
  it('calcule correctement un IMC normal', () => {
    const result = calculerIMC({ poids: 70, taille: 175 });
    expect(result.valeur).toBe(22.9);
    expect(result.classification).toBe('normal');
  });

  it('classifie surpoids à IMC 25+', () => {
    const result = calculerIMC({ poids: 80, taille: 175 });
    expect(result.valeur).toBe(26.1);
    expect(result.classification).toBe('surpoids');
  });

  it('classifie obésité classe I (IMC 30–34.9)', () => {
    const result = calculerIMC({ poids: 95, taille: 175 });
    expect(result.classification).toBe('obesite_1');
  });

  it('classifie maigreur légère (IMC 17–18.4)', () => {
    const result = calculerIMC({ poids: 52, taille: 175 });
    expect(result.classification).toBe('maigreur_legere');
  });

  it('classifie maigreur sévère (IMC < 16)', () => {
    const result = calculerIMC({ poids: 44, taille: 175 });
    expect(result.classification).toBe('maigreur_severe');
  });

  it('inclut la référence OMS', () => {
    const result = calculerIMC({ poids: 70, taille: 175 });
    expect(result.reference).toBe('Classification OMS 2000');
  });

  it('arrondit à 1 décimale', () => {
    const result = calculerIMC({ poids: 73, taille: 178 });
    const decimales = result.valeur.toString().split('.')[1]?.length ?? 0;
    expect(decimales).toBeLessThanOrEqual(1);
  });
});
