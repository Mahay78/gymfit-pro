import type { HistoryItem, WorkoutExercise } from '../types';

export interface ProgressionSuggestion {
  exerciseId: string;
  exerciseName: string;
  currentWeight: number;
  suggestedWeight: number;
  reason: string;
  completedSessions: number;
}

function getExerciseHistory(history: HistoryItem[], exerciseId: string): { weight: number; reps: number; completed: boolean; date: string }[] {
  const sessions: { weight: number; reps: number; completed: boolean; date: string }[] = [];
  
  history.forEach(h => {
    const ex = h.exercises?.find(e => e.id === exerciseId);
    if (ex) {
      ex.sets.forEach(set => {
        if (set.completed) {
          sessions.push({
            weight: set.weight,
            reps: set.reps,
            completed: true,
            date: h.date,
          });
        }
      });
    }
  });
  
  return sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function getTargetRepsForExercise(exerciseId: string): number {
  const targetRepsMap: Record<string, number> = {
    'press-plano-maquina': 8,
    'press-inclinado-maquina': 8,
    'press-militar-maquina': 8,
    'jalon-pecho': 10,
    'jalon-peso-cuerpo': 8,
    'remo-maquina': 10,
    'remo-gironda': 10,
    'sentadilla-hack': 10,
    'prensa-45': 12,
    'extension-cuadriceps': 12,
    'curl-femoral': 12,
    'elevaciones-laterales': 15,
    'face-pulls': 15,
    'curl-biceps': 12,
    'extensiones-triceps': 12,
    'crunch-maquina': 15,
    'hip-thrust': 10,
    'peso-muerto-rumano': 8,
    'press-inclinado-mancuernas': 8,
    'aperturas-maquina': 12,
    'remo-unilateral': 10,
    'pull-over': 12,
    'press-plano-mancuernas': 8,
    'press-militar-mancuernas': 8,
    'dominadas': 8,
    'remo-bar': 8,
    'sentadilla-libre': 8,
    'zancadas': 10,
    'peso-muerto': 6,
    'press-banca': 8,
    'press-inclinado': 8,
    'fondo-paralelas': 10,
    'curl-martillo': 10,
    'pushdown-triceps': 12,
    'elevaciones-frontales': 12,
    'pantorrillas': 15,
    'plancha': 30,
    'captain-chair': 12,
  };
  
  return targetRepsMap[exerciseId] || 10;
}

export function calculateProgressionSuggestions(
  currentWorkout: { exercises: WorkoutExercise[] },
  history: HistoryItem[]
): ProgressionSuggestion[] {
  const suggestions: ProgressionSuggestion[] = [];
  
  currentWorkout.exercises.forEach(ex => {
    const targetReps = getTargetRepsForExercise(ex.id);
    const exerciseHistory = getExerciseHistory(history, ex.id);
    
    if (exerciseHistory.length === 0) return;
    
    const currentWeight = ex.sets[0]?.weight || 0;
    if (currentWeight === 0) return;
    
    const recentSessions = exerciseHistory.slice(-4);
    let consecutivePerfectSessions = 0;
    
    for (let i = recentSessions.length - 1; i >= 0; i--) {
      const session = recentSessions[i];
      const allSetsHitTarget = recentSessions
        .filter(s => s.date === session.date)
        .every(s => s.reps >= targetReps && s.completed);
      
      if (allSetsHitTarget && session.weight >= currentWeight) {
        consecutivePerfectSessions++;
      } else {
        break;
      }
    }
    
    if (consecutivePerfectSessions >= 2) {
      const increment = ['elevaciones-laterales', 'face-pulls', 'curl-biceps', 'extensiones-triceps', 'elevaciones-frontales', 'pantorrillas', 'curl-martillo', 'pushdown-triceps'].includes(ex.id) 
        ? 1.25 
        : 2.5;
      
      suggestions.push({
        exerciseId: ex.id,
        exerciseName: ex.name,
        currentWeight,
        suggestedWeight: currentWeight + increment,
        reason: `Completaste ${consecutivePerfectSessions} sesiones consecutivas con ${targetReps}+ reps en todas las series`,
        completedSessions: consecutivePerfectSessions,
      });
    }
  });
  
  return suggestions;
}

export function getWeightProgressionTip(exerciseId: string, currentWeight: number, targetReps: number, completedReps: number[]): string | null {
  const allHitTarget = completedReps.every(r => r >= targetReps);
  const avgReps = completedReps.reduce((a, b) => a + b, 0) / completedReps.length;
  
  if (allHitTarget && avgReps >= targetReps + 2) {
    const increment = ['elevaciones-laterales', 'face-pulls', 'curl-biceps', 'extensiones-triceps', 'elevaciones-frontales', 'pantorrillas', 'curl-martillo', 'pushdown-triceps'].includes(exerciseId) 
      ? 1.25 
      : 2.5;
    return `Considera subir a ${currentWeight + increment}kg la próxima semana (promedio ${avgReps.toFixed(1)} reps)`;
  }
  
  if (!allHitTarget && avgReps < targetReps - 1) {
    const decrement = ['elevaciones-laterales', 'face-pulls', 'curl-biceps', 'extensiones-triceps', 'elevaciones-frontales', 'pantorrillas', 'curl-martillo', 'pushdown-triceps'].includes(exerciseId) 
      ? 1.25 
      : 2.5;
    return `Considera bajar a ${Math.max(0, currentWeight - decrement)}kg (promedio ${avgReps.toFixed(1)} reps)`;
  }
  
  return null;
}