/**
 * U.S. Navy Body Fat Formula and Lean Mass Calculations
 */

export interface BodyFatResult {
  bodyFatPercentage: number;
  fatMassKg: number;
  leanMassKg: number;
  category: string;
  categoryColor: string;
}

export function calculateNavyBodyFat({
  gender,
  heightCm,
  waistCm,
  neckCm,
  hipsCm = 0,
  weightKg,
}: {
  gender: string;
  heightCm: number;
  waistCm: number;
  neckCm: number;
  hipsCm?: number;
  weightKg: number;
}): BodyFatResult | null {
  if (heightCm <= 0 || waistCm <= 0 || neckCm <= 0 || weightKg <= 0) {
    return null;
  }

  let bodyFat = 0;

  if (gender === 'female') {
    if (hipsCm <= 0 || (waistCm + hipsCm - neckCm) <= 0) return null;
    // Navy formula for women: 495 / (1.29579 - 0.35004 * log10(waist + hips - neck) + 0.22100 * log10(height)) - 450
    const logWaistHipsNeck = Math.log10(waistCm + hipsCm - neckCm);
    const logHeight = Math.log10(heightCm);
    const denom = 1.29579 - (0.35004 * logWaistHipsNeck) + (0.22100 * logHeight);
    if (denom <= 0) return null;
    bodyFat = (495 / denom) - 450;
  } else {
    if ((waistCm - neckCm) <= 0) return null;
    // Navy formula for men: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
    const logWaistNeck = Math.log10(waistCm - neckCm);
    const logHeight = Math.log10(heightCm);
    const denom = 1.0324 - (0.19077 * logWaistNeck) + (0.15456 * logHeight);
    if (denom <= 0) return null;
    bodyFat = (495 / denom) - 450;
  }

  const clampedFat = Math.max(3, Math.min(60, Math.round(bodyFat * 10) / 10));
  const fatMass = Math.round(((weightKg * clampedFat) / 100) * 10) / 10;
  const leanMass = Math.round((weightKg - fatMass) * 10) / 10;

  let category = 'Aceptable';
  let categoryColor = '#3b82f6';

  if (gender === 'female') {
    if (clampedFat < 14) { category = 'Grasa Esencial'; categoryColor = '#f59e0b'; }
    else if (clampedFat <= 20) { category = 'Atleta'; categoryColor = '#10b981'; }
    else if (clampedFat <= 24) { category = 'Fitness / Definido'; categoryColor = '#06b6d4'; }
    else if (clampedFat <= 31) { category = 'Aceptable / Promedio'; categoryColor = '#8b5cf6'; }
    else { category = 'Elevado / Sobregrasa'; categoryColor = '#ef4444'; }
  } else {
    if (clampedFat < 6) { category = 'Grasa Esencial'; categoryColor = '#f59e0b'; }
    else if (clampedFat <= 13) { category = 'Atleta / Muy Definido'; categoryColor = '#10b981'; }
    else if (clampedFat <= 17) { category = 'Fitness / Definido'; categoryColor = '#06b6d4'; }
    else if (clampedFat <= 24) { category = 'Aceptable / Promedio'; categoryColor = '#8b5cf6'; }
    else { category = 'Elevado / Sobregrasa'; categoryColor = '#ef4444'; }
  }

  return {
    bodyFatPercentage: clampedFat,
    fatMassKg: fatMass,
    leanMassKg: leanMass,
    category,
    categoryColor,
  };
}
