/**
 * 1RM (One Rep Max) calculation utilities
 */

export interface OneRepMaxResult {
  epley: number;
  brzycki: number;
  lombardi: number;
  wathan: number;
  average: number;
  percentages: {
    percentage: number;
    weight: number;
    estimatedReps: number;
    zoneName: string;
  }[];
}

export function calculateOneRepMax(weight: number, reps: number): OneRepMaxResult {
  const w = Math.max(0, weight);
  const r = Math.max(1, Math.min(30, reps));

  if (r === 1) {
    const percentages = getPercentages(w);
    return {
      epley: Math.round(w * 10) / 10,
      brzycki: Math.round(w * 10) / 10,
      lombardi: Math.round(w * 10) / 10,
      wathan: Math.round(w * 10) / 10,
      average: Math.round(w * 10) / 10,
      percentages,
    };
  }

  // Common formulas
  const epley = w * (1 + r / 30);
  const brzycki = r < 37 ? w * (36 / (37 - r)) : epley;
  const lombardi = w * Math.pow(r, 0.1);
  const wathan = (100 * w) / (48.8 + 53.8 * Math.exp(-0.075 * r));

  const average = (epley + brzycki + lombardi + wathan) / 4;

  const roundedAverage = Math.round(average * 10) / 10;
  const percentages = getPercentages(roundedAverage);

  return {
    epley: Math.round(epley * 10) / 10,
    brzycki: Math.round(brzycki * 10) / 10,
    lombardi: Math.round(lombardi * 10) / 10,
    wathan: Math.round(wathan * 10) / 10,
    average: roundedAverage,
    percentages,
  };
}

function getPercentages(oneRepMax: number) {
  const percentageTable = [
    { percentage: 100, estimatedReps: 1, zoneName: 'Fuerza Máxima (1RM)' },
    { percentage: 95, estimatedReps: 2, zoneName: 'Fuerza Extrema' },
    { percentage: 90, estimatedReps: 3, zoneName: 'Fuerza Pura' },
    { percentage: 85, estimatedReps: 5, zoneName: 'Fuerza / Hipertrofia Miofibrilar' },
    { percentage: 80, estimatedReps: 8, zoneName: 'Hipertrofia Densa' },
    { percentage: 75, estimatedReps: 10, zoneName: 'Hipertrofia Óptima' },
    { percentage: 70, estimatedReps: 12, zoneName: 'Hipertrofia Sarcoplasmática' },
    { percentage: 65, estimatedReps: 15, zoneName: 'Resistencia Muscular' },
    { percentage: 60, estimatedReps: 20, zoneName: 'Bombeo y Capilarización' },
  ];

  return percentageTable.map(p => ({
    ...p,
    weight: Math.round((oneRepMax * (p.percentage / 100)) * 2) / 2, // Round to nearest 0.5 kg
  }));
}
