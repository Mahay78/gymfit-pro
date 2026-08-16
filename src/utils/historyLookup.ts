import type { HistoryItem } from '../types';

export interface PreviousExercisePerformance {
  lastDate: string;
  dayTitle: string;
  sets: {
    weight: number;
    reps: number;
    completed: boolean;
    rpe?: number;
  }[];
  bestSet: {
    weight: number;
    reps: number;
  };
}

export function getPreviousPerformance(
  exerciseId: string,
  history: HistoryItem[]
): PreviousExercisePerformance | null {
  for (const item of history) {
    if (!item.exercises) continue;
    const match = item.exercises.find(e => e.id === exerciseId);
    if (match && match.sets && match.sets.length > 0) {
      const completedSets = match.sets.filter(s => s.completed && s.weight > 0 && s.reps > 0);
      if (completedSets.length > 0) {
        let bestSet = completedSets[0];
        let maxVolume = bestSet.weight * bestSet.reps;
        for (const s of completedSets) {
          const vol = s.weight * s.reps;
          if (vol > maxVolume) {
            maxVolume = vol;
            bestSet = s;
          }
        }
        return {
          lastDate: item.date,
          dayTitle: item.dayTitle,
          sets: match.sets,
          bestSet: {
            weight: bestSet.weight,
            reps: bestSet.reps,
          },
        };
      }
    }
  }
  return null;
}
