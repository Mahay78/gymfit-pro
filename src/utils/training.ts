import type { HistoryItem } from '../types';

interface RPERecommendation {
  currentWeight: number;
  suggestedWeight: number;
  lastRPE: number;
  action: 'increase' | 'maintain' | 'decrease';
  message: string;
}

export function getRPERecommendation(
  exerciseId: string,
  currentWeight: number,
  history: HistoryItem[]
): RPERecommendation | null {
  const entries: { date: string; weight: number; reps: number; rpe: number }[] = [];

  history.forEach(h => {
    h.exercises?.forEach(ex => {
      if (ex.id !== exerciseId) return;
      ex.sets.forEach(set => {
        if (set.completed && set.rpe) {
          entries.push({ date: h.date, weight: set.weight, reps: set.reps, rpe: set.rpe });
        }
      });
    });
  });

  if (entries.length < 3) {
    return {
      currentWeight,
      suggestedWeight: currentWeight,
      lastRPE: 0,
      action: 'maintain',
      message: 'Necesitas más historial para sugerir cambios.',
    };
  }

  entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recent = entries.slice(0, Math.min(6, entries.length));
  const avgRPE = recent.reduce((s, e) => s + e.rpe, 0) / recent.length;
  const lastRPE = recent[0].rpe;
  const lastWeight = recent[0].weight;

  let action: RPERecommendation['action'] = 'maintain';
  let suggested = currentWeight;
  let message = '';

  if (avgRPE < 7.5 && currentWeight >= lastWeight) {
    suggested = Math.round((currentWeight + 2.5) * 2) / 2;
    action = 'increase';
    message = `RPE promedio ${avgRPE.toFixed(1)} es bajo. Sube a ${suggested}kg para progresar.`;
  } else if (avgRPE > 9) {
    suggested = Math.max(0, Math.round((currentWeight - 2.5) * 2) / 2);
    action = 'decrease';
    message = `RPE ${avgRPE.toFixed(1)} es muy alto. Baja a ${suggested}kg para mantener técnica.`;
  } else {
    message = `RPE ${avgRPE.toFixed(1)} en rango óptimo. Mantén ${currentWeight}kg.`;
  }

  return {
    currentWeight,
    suggestedWeight: suggested,
    lastRPE,
    action,
    message,
  };
}
