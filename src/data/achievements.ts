import type { Achievement, HistoryItem, BodyMeasurement } from '../types';

export const ALL_ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first_workout', name: 'Primer paso', description: 'Completaste tu primer entrenamiento', icon: '🎯' },
  { id: 'streak_3', name: 'Constante', description: '3 días seguidos entrenando', icon: '🔥' },
  { id: 'streak_7', name: 'En racha', description: '7 días seguidos entrenando', icon: '⚡' },
  { id: 'streak_30', name: 'Dedicación total', description: '30 días seguidos entrenando', icon: '💎' },
  { id: 'workouts_10', name: '10 entrenos', description: 'Has completado 10 entrenamientos', icon: '💪' },
  { id: 'workouts_50', name: '50 entrenos', description: 'Has completado 50 entrenamientos', icon: '🏆' },
  { id: 'workouts_100', name: 'Centenario', description: 'Has completado 100 entrenamientos', icon: '👑' },
  { id: 'first_pr', name: 'Primer PR', description: 'Rompe tu primer record personal', icon: '🌟' },
  { id: 'pr_streak_3', name: 'En llamas', description: 'Rompes 3 PRs seguidos', icon: '🚀' },
  { id: 'volume_10k', name: '10 toneladas', description: '10,000 kg movidos en total', icon: '🏋️' },
  { id: 'volume_50k', name: '50 toneladas', description: '50,000 kg movidos en total', icon: '💪' },
  { id: 'volume_100k', name: '100 toneladas', description: '100,000 kg movidos en total', icon: '🦾' },
  { id: 'weight_loss_5', name: '5 kg menos', description: 'Has perdido 5 kg desde el inicio', icon: '⬇️' },
  { id: 'weight_loss_10', name: '10 kg menos', description: 'Has perdido 10 kg desde el inicio', icon: '🏅' },
  { id: 'weight_log_10', name: 'Constancia con la báscula', description: '10 registros de peso corporal', icon: '⚖️' },
  { id: 'cardio_10', name: 'Cardio lover', description: '10 sesiones de cardio completadas', icon: '🏃' },
  { id: 'cardio_streak', name: 'Maratón', description: 'Cardio 5 veces en 1 semana', icon: '⏱️' },
  { id: 'notes_first', name: 'Autoconocimiento', description: 'Añadiste tu primera nota', icon: '📝' },
  { id: 'full_complete', name: 'Full Body completo', description: 'Completaste todos los ejercicios de Full Body', icon: '✅' },
  { id: 'week_complete', name: 'Semana perfecta', description: 'Entrenaste los 3 días de la semana', icon: '🌟' },
];

export function calculateAchievements(
  history: HistoryItem[],
  bodyMeasurements: BodyMeasurement[],
  cardioSessions: { id: string; date: string }[],
  startWeight: number,
  currentWeight: number
): Achievement[] {
  const totalWorkouts = history.length;
  const totalVolume = history.reduce((s, h) => s + h.totalVolume, 0);
  const hasNotes = history.some(h => h.notes);
  const fullComplete = history.length > 0;
  const cardioCount = cardioSessions.length;
  const weightLoss = startWeight > 0 ? startWeight - currentWeight : 0;

  // Streak actual
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dates = new Set<string>();
  history.forEach(h => {
    const d = parseDate(h.date);
    if (d) {
      d.setHours(0, 0, 0, 0);
      dates.add(d.getTime().toString());
    }
  });
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    if (dates.has(d.getTime().toString())) streak++;
    else if (i > 0) break;
  }

  // PRs
  const prsByExercise = new Map<string, number>();
  history.forEach(h => {
    h.exercises?.forEach(ex => {
      ex.sets.forEach(set => {
        if (set.completed && set.weight > 0 && set.reps > 0) {
          const oneRM = Math.round(set.weight * (1 + set.reps / 30) * 10) / 10;
          const current = prsByExercise.get(ex.id) || 0;
          if (oneRM > current) prsByExercise.set(ex.id, oneRM);
        }
      });
    });
  });
  const prCount = prsByExercise.size;

  // Cardio 5 en 1 semana
  const cardioByWeek = new Map<string, number>();
  cardioSessions.forEach(c => {
    const d = parseDate(c.date);
    if (d) {
      const week = getWeekKey(d);
      cardioByWeek.set(week, (cardioByWeek.get(week) || 0) + 1);
    }
  });
  const has5CardioWeek = Array.from(cardioByWeek.values()).some(v => v >= 5);

  // Semana perfecta: 3 workouts
  const workoutsByWeek = new Map<string, number>();
  history.forEach(h => {
    const d = parseDate(h.date);
    if (d) {
      const week = getWeekKey(d);
      workoutsByWeek.set(week, (workoutsByWeek.get(week) || 0) + 1);
    }
  });
  const hasPerfectWeek = Array.from(workoutsByWeek.values()).some(v => v >= 3);

  return ALL_ACHIEVEMENTS.map(a => {
    const unlocked =
      (a.id === 'first_workout' && totalWorkouts >= 1) ||
      (a.id === 'streak_3' && streak >= 3) ||
      (a.id === 'streak_7' && streak >= 7) ||
      (a.id === 'streak_30' && streak >= 30) ||
      (a.id === 'workouts_10' && totalWorkouts >= 10) ||
      (a.id === 'workouts_50' && totalWorkouts >= 50) ||
      (a.id === 'workouts_100' && totalWorkouts >= 100) ||
      (a.id === 'first_pr' && prCount >= 1) ||
      (a.id === 'pr_streak_3' && prCount >= 3) ||
      (a.id === 'volume_10k' && totalVolume >= 10000) ||
      (a.id === 'volume_50k' && totalVolume >= 50000) ||
      (a.id === 'volume_100k' && totalVolume >= 100000) ||
      (a.id === 'weight_loss_5' && weightLoss >= 5) ||
      (a.id === 'weight_loss_10' && weightLoss >= 10) ||
      (a.id === 'weight_log_10' && bodyMeasurements.length >= 10) ||
      (a.id === 'cardio_10' && cardioCount >= 10) ||
      (a.id === 'cardio_streak' && has5CardioWeek) ||
      (a.id === 'notes_first' && hasNotes) ||
      (a.id === 'full_complete' && fullComplete) ||
      (a.id === 'week_complete' && hasPerfectWeek);
    return { ...a, unlocked };
  });
}

function parseDate(s: string): Date | null {
  const m = s.match(/(\d+)\s+(\w+)\s+(\d+)/);
  if (!m) return null;
  const monthMap: Record<string, number> = {
    ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
    jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
  };
  return new Date(parseInt(m[3]), monthMap[m[2].toLowerCase()] ?? 0, parseInt(m[1]));
}

function getWeekKey(d: Date): string {
  const year = d.getFullYear();
  const onejan = new Date(year, 0, 1);
  const week = Math.ceil((((d.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
  return `${year}-W${week}`;
}
