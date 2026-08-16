import { describe, it, expect } from 'vitest';
import { calculateOneRepMax } from '../oneRepMax';

describe('calculateOneRepMax', () => {
  it('should return exact weight for 1 rep', () => {
    const result = calculateOneRepMax(100, 1);
    expect(result.average).toBe(100);
    expect(result.epley).toBe(100);
    expect(result.brzycki).toBe(100);
    expect(result.percentages[0].weight).toBe(100);
  });

  it('should calculate realistic 1RM for standard 100kg x 10 reps', () => {
    const result = calculateOneRepMax(100, 10);
    // Epley: 100 * (1 + 10/30) = 133.3
    expect(result.epley).toBeCloseTo(133.3, 1);
    // Average should be around 133-134
    expect(result.average).toBeGreaterThan(130);
    expect(result.average).toBeLessThan(140);
    expect(result.percentages.length).toBe(9);
  });

  it('should handle zero or negative weights gracefully', () => {
    const result = calculateOneRepMax(0, 5);
    expect(result.average).toBe(0);
    expect(result.percentages[0].weight).toBe(0);
  });
});
