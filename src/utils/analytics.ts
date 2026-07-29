import type { HistoryItem } from '../types';

export interface StreakInfo {
  current: number;
  longest: number;
  lastWorkoutDaysAgo: number | null;
  trainedThisWeek: number;
  perfectWeek: boolean;
}

function parseDate(s: string): Date | null {
  const m = s.match(/(\d+)\s+(\w+)\s+(\d+)/);
  if (!m) return null;
  const monthMap: Record<string, number> = {
    ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
    jul: 6, ago: 7, sep: 8, sept: 8, oct: 9, nov: 10, dic: 11,
  };
  return new Date(parseInt(m[3]), monthMap[m[2].toLowerCase()] ?? 0, parseInt(m[1]));
}

export function calculateStreak(history: HistoryItem[]): StreakInfo {
  if (history.length === 0) {
    return { current: 0, longest: 0, lastWorkoutDaysAgo: null, trainedThisWeek: 0, perfectWeek: false };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = new Set<string>();
  history.forEach(h => {
    const d = parseDate(h.date);
    if (d) {
      d.setHours(0, 0, 0, 0);
      dates.add(d.getTime().toString());
    }
  });

  // Current streak
  let current = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (dates.has(d.getTime().toString())) current++;
    else if (i > 0) break;
  }

  // Longest streak (iterar todos los días)
  const sortedDates = Array.from(dates).map(Number).sort();
  let longest = 0;
  let runLen = 0;
  let prevDate: number | null = null;
  for (const d of sortedDates) {
    if (prevDate === null) {
      runLen = 1;
    } else {
      const dayDiff = (d - prevDate) / 86400000;
      if (dayDiff === 1) {
        runLen++;
      } else {
        runLen = 1;
      }
    }
    longest = Math.max(longest, runLen);
    prevDate = d;
  }

  // Last workout days ago
  const lastDate = sortedDates[sortedDates.length - 1];
  const lastWorkoutDaysAgo = lastDate !== undefined
    ? Math.floor((today.getTime() - lastDate) / 86400000)
    : null;

  // Trained this week (lunes-domingo)
  const monday = new Date(today);
  const dayOfWeek = (today.getDay() + 6) % 7; // lunes = 0
  monday.setDate(today.getDate() - dayOfWeek);
  let trainedThisWeek = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    if (dates.has(d.getTime().toString())) trainedThisWeek++;
  }

  return {
    current,
    longest,
    lastWorkoutDaysAgo,
    trainedThisWeek,
    perfectWeek: trainedThisWeek >= 3,
  };
}

export function predictGoalDate(
  startWeight: number,
  currentWeight: number,
  goalWeight: number,
  startDate: Date | null = null
): { weeks: number; date: string; ratePerWeek: number; isOnTrack: boolean } | null {
  if (startWeight === 0 || startWeight <= goalWeight) return null;
  if (currentWeight <= goalWeight) {
    return { weeks: 0, date: '¡Objetivo alcanzado!', ratePerWeek: 0, isOnTrack: true };
  }

  const start = startDate || new Date(Date.now() - 30 * 86400000);
  const daysPassed = Math.max(1, (Date.now() - start.getTime()) / 86400000);
  const weightLost = startWeight - currentWeight;
  const ratePerWeek = (weightLost / daysPassed) * 7;

  if (ratePerWeek <= 0) return { weeks: Infinity, date: '—', ratePerWeek, isOnTrack: false };

  const remainingWeight = currentWeight - goalWeight;
  const weeks = remainingWeight / ratePerWeek;
  const date = new Date(Date.now() + weeks * 7 * 86400000);
  return {
    weeks: Math.round(weeks),
    date: date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
    ratePerWeek: Math.round(ratePerWeek * 100) / 100,
    isOnTrack: ratePerWeek >= 0.3 && ratePerWeek <= 1.0,
  };
}

export function getWorkoutStatsSince(
  history: HistoryItem[],
  monthsAgo: number
): { totalVolume: number; workoutCount: number; daysSince: number } | null {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - monthsAgo);

  let totalVolume = 0;
  let workoutCount = 0;
  let mostRecent: Date | null = null;

  history.forEach(h => {
    const d = parseDate(h.date);
    if (!d) return;
    if (d >= cutoff) {
      totalVolume += h.totalVolume;
      workoutCount++;
      if (!mostRecent || d > mostRecent) mostRecent = d;
    }
  });

  if (workoutCount === 0) return null;

  return {
    totalVolume,
    workoutCount,
    daysSince: mostRecent ? Math.floor((Date.now() - mostRecent.getTime()) / 86400000) : 0,
  };
}
