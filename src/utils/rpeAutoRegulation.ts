export interface RpeSuggestion {
  adjustedWeight: number;
  delta: number;
  reason: string;
  badge: 'subir' | 'mantener' | 'bajar';
}

export function calculateRpeAutoRegulation(currentWeight: number, rpe: number, _targetRpe: number = 8): RpeSuggestion {
  if (currentWeight <= 0) {
    return { adjustedWeight: 0, delta: 0, reason: 'Sin carga', badge: 'mantener' };
  }

  // Si el esfuerzo fue excesivo (RPE >= 9.5), bajar 5% (redondeado a 2.5kg)
  if (rpe >= 9.5) {
    const rawDelta = currentWeight * 0.05;
    const delta = -Math.max(2.5, Math.round(rawDelta / 2.5) * 2.5);
    return {
      adjustedWeight: Math.max(0, currentWeight + delta),
      delta,
      reason: 'Fatiga muy alta (cerca del fallo). Baja peso para mantener técnica.',
      badge: 'bajar',
    };
  }

  // Si fue muy ligero (RPE <= 6), subir carga
  if (rpe <= 6) {
    const rawDelta = currentWeight * 0.05;
    const delta = Math.max(2.5, Math.round(rawDelta / 2.5) * 2.5);
    return {
      adjustedWeight: currentWeight + delta,
      delta,
      reason: 'Carga muy ligera (RPE bajo). Tienes margen para subir.',
      badge: 'subir',
    };
  }

  // Si está en el rango óptimo (RPE 7-8.5), mantener
  return {
    adjustedWeight: currentWeight,
    delta: 0,
    reason: `RPE ${rpe} en zona óptima de estímulo. Mantén la carga.`,
    badge: 'mantener',
  };
}
