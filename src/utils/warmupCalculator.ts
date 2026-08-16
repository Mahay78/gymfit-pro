/**
 * Warm-up set pyramid ramping calculation
 */

export interface WarmupSet {
  setNumber: number;
  percentage: number;
  weight: number;
  reps: number;
  purpose: string;
  restSeconds: number;
}

export function calculateWarmupSets(workingWeight: number, barBaseWeight = 0): WarmupSet[] {
  const target = Math.max(0, workingWeight);

  if (target <= 20) {
    return [
      {
        setNumber: 1,
        percentage: 50,
        weight: Math.max(barBaseWeight, Math.round(target * 0.5 * 2) / 2),
        reps: 10,
        purpose: 'Movilidad y activación neural',
        restSeconds: 45,
      },
      {
        setNumber: 2,
        percentage: 80,
        weight: Math.max(barBaseWeight, Math.round(target * 0.8 * 2) / 2),
        reps: 5,
        purpose: 'Ajuste neuromuscular',
        restSeconds: 60,
      },
    ];
  }

  const roundToNearestHalf = (val: number) => Math.max(barBaseWeight, Math.round(val * 2) / 2);

  return [
    {
      setNumber: 1,
      percentage: 50,
      weight: roundToNearestHalf(target * 0.5),
      reps: 10,
      purpose: 'Activación articular y flujo sanguíneo',
      restSeconds: 60,
    },
    {
      setNumber: 2,
      percentage: 70,
      weight: roundToNearestHalf(target * 0.7),
      reps: 5,
      purpose: 'Aceleración y velocidad de barra',
      restSeconds: 75,
    },
    {
      setNumber: 3,
      percentage: 85,
      weight: roundToNearestHalf(target * 0.85),
      reps: 2,
      purpose: 'Preparación del SNC sin generar fatiga',
      restSeconds: 90,
    },
  ];
}
