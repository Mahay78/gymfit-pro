import { describe, it, expect } from 'vitest';
import { calculateMacros } from '../macros';

describe('calculateMacros', () => {
  it('calculates cut correctly for male', () => {
    const macros = calculateMacros(80, 175, 30, 'male', 1.375, 'cut');
    expect(macros.calories).toBeLessThan(2200);
    expect(macros.protein).toBe(160);
    expect(macros.fat).toBe(72);
    expect(macros.carbs).toBeGreaterThan(50);
  });

  it('calculates bulk correctly for female', () => {
    const macros = calculateMacros(70, 165, 25, 'female', 1.55, 'bulk');
    expect(macros.calories).toBeGreaterThan(2000);
    expect(macros.protein).toBe(140);
    expect(macros.fat).toBe(63);
  });

  it('uses TDEE for maintain', () => {
    const macros = calculateMacros(80, 175, 30, 'male', 1.55, 'maintain');
    const bmr = (10 * 80) + (6.25 * 175) - (5 * 30) + 5;
    const tdee = Math.round(bmr * 1.55);
    expect(macros.calories).toBe(tdee);
  });

  it('male has higher BMR than female with same stats', () => {
    const maleMacros = calculateMacros(80, 175, 30, 'male', 1.375, 'maintain');
    const femaleMacros = calculateMacros(80, 175, 30, 'female', 1.375, 'maintain');
    expect(maleMacros.calories).toBeGreaterThan(femaleMacros.calories);
  });

  it('protein scales with weight', () => {
    const macros80 = calculateMacros(80, 175, 30, 'male', 1.375, 'cut');
    const macros70 = calculateMacros(70, 175, 30, 'male', 1.375, 'cut');
    expect(macros80.protein).toBe(160);
    expect(macros70.protein).toBe(140);
  });

  it('fat scales with weight', () => {
    const macros80 = calculateMacros(80, 175, 30, 'male', 1.375, 'cut');
    const macros70 = calculateMacros(70, 175, 30, 'male', 1.375, 'cut');
    expect(macros80.fat).toBe(72);
    expect(macros70.fat).toBe(63);
  });

  it('carbs never below 50', () => {
    const macros = calculateMacros(50, 150, 20, 'female', 1.2, 'cut');
    expect(macros.carbs).toBeGreaterThanOrEqual(50);
  });

  it('bulk has more calories than cut', () => {
    const cut = calculateMacros(80, 175, 30, 'male', 1.375, 'cut');
    const bulk = calculateMacros(80, 175, 30, 'male', 1.375, 'bulk');
    expect(bulk.calories).toBeGreaterThan(cut.calories);
  });
});