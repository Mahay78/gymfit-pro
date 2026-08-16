import { describe, it, expect } from 'vitest';
import { calculateRpeAutoRegulation } from '../rpeAutoRegulation';

describe('rpeAutoRegulation', () => {
  it('suggests reducing weight when RPE is 9.5 or 10', () => {
    const result = calculateRpeAutoRegulation(100, 10);
    expect(result.badge).toBe('bajar');
    expect(result.adjustedWeight).toBeLessThan(100);
  });

  it('suggests increasing weight when RPE is 6 or below', () => {
    const result = calculateRpeAutoRegulation(80, 6);
    expect(result.badge).toBe('subir');
    expect(result.adjustedWeight).toBeGreaterThan(80);
  });

  it('suggests maintaining weight in optimal zone RPE 7-8.5', () => {
    const result = calculateRpeAutoRegulation(80, 8);
    expect(result.badge).toBe('mantener');
    expect(result.adjustedWeight).toBe(80);
  });
});
