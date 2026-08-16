import { describe, it, expect } from 'vitest';
import { calculateNavyBodyFat } from '../bodyFat';

describe('calculateNavyBodyFat', () => {
  it('should calculate accurate body fat for standard male (height 178, waist 84, neck 38, weight 80)', () => {
    const result = calculateNavyBodyFat({
      gender: 'male',
      heightCm: 178,
      waistCm: 84,
      neckCm: 38,
      weightKg: 80,
    });

    expect(result).not.toBeNull();
    // Male standard body fat should be around 14-16%
    expect(result!.bodyFatPercentage).toBeGreaterThanOrEqual(13);
    expect(result!.bodyFatPercentage).toBeLessThanOrEqual(17);
    expect(result!.fatMassKg + result!.leanMassKg).toBeCloseTo(80, 0);
  });

  it('should calculate accurate body fat for standard female (height 165, waist 70, hips 96, neck 33, weight 60)', () => {
    const result = calculateNavyBodyFat({
      gender: 'female',
      heightCm: 165,
      waistCm: 70,
      hipsCm: 96,
      neckCm: 33,
      weightKg: 60,
    });

    expect(result).not.toBeNull();
    // Female standard body fat should be around 21-24%
    expect(result!.bodyFatPercentage).toBeGreaterThanOrEqual(20);
    expect(result!.bodyFatPercentage).toBeLessThanOrEqual(26);
    expect(result!.category).toBeDefined();
  });

  it('should return null for invalid negative or zero dimensions', () => {
    const result = calculateNavyBodyFat({
      gender: 'male',
      heightCm: 0,
      waistCm: 80,
      neckCm: 38,
      weightKg: 80,
    });
    expect(result).toBeNull();
  });
});
