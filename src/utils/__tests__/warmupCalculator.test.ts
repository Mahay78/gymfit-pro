import { describe, it, expect } from 'vitest';
import { calculateWarmupSets } from '../warmupCalculator';

describe('calculateWarmupSets', () => {
  it('should calculate 3 ramping sets for 100kg working weight', () => {
    const sets = calculateWarmupSets(100, 20);
    expect(sets.length).toBe(3);
    expect(sets[0].weight).toBe(50);
    expect(sets[0].reps).toBe(10);
    expect(sets[1].weight).toBe(70);
    expect(sets[1].reps).toBe(5);
    expect(sets[2].weight).toBe(85);
    expect(sets[2].reps).toBe(2);
  });

  it('should respect bar base weight minimums', () => {
    const sets = calculateWarmupSets(30, 20);
    expect(sets[0].weight).toBeGreaterThanOrEqual(20);
  });
});
