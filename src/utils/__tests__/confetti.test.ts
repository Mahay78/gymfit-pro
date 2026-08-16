import { describe, it, expect } from 'vitest';
import { triggerConfetti } from '../confetti';

describe('confetti utility', () => {
  it('runs safely in browser and node environments', () => {
    expect(() => triggerConfetti(100)).not.toThrow();
  });
});
