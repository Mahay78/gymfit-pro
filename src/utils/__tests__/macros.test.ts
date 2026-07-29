/**
 * Tests para calculadora de macros
 */
import { describe, it, expect } from 'vitest';
import { calculateMacros } from '../macros';

describe('calculateMacros', () => {
  it('calcula déficit correctamente para hombre', () => {
    const macros = calculateMacros(80, 175, 30, 'male', 1.375, 'cut');
    expect(macros.calories).toBeLessThan(2200);
    expect(macros.protein).toBe(160);
  });

  it('calcula volumen correctamente', () => {
    const macros = calculateMacros(70, 165, 25, 'female', 1.55, 'bulk');
    expect(macros.calories).toBeGreaterThan(macros.protein * 4 + macros.fat * 9 - 200);
  });

  it('mantenimiento usa calorías TDEE', () => {
    const macros = calculateMacros(80, 175, 30, 'male', 1.55, 'maintain');
    expect(macros.calories).toBeGreaterThan(2000);
  });
});
