import { describe, it, expect } from 'vitest';
import { calculateStreak, predictGoalDate, getWorkoutStatsSince } from '../analytics';
import type { HistoryItem } from '../../types';

function createHistory(dates: string[]): HistoryItem[] {
  return dates.map((date, i) => ({
    id: `h-${i}`,
    date,
    dayTitle: 'Test Workout',
    duration: '60 min',
    completedExercises: 3,
    totalVolume: 1000,
    weight: 80,
    cardioCompleted: true,
  }));
}

describe('calculateStreak', () => {
  it('returns zeros for empty history', () => {
    const result = calculateStreak([]);
    expect(result.current).toBe(0);
    expect(result.longest).toBe(0);
    expect(result.lastWorkoutDaysAgo).toBeNull();
    expect(result.trainedThisWeek).toBe(0);
    expect(result.perfectWeek).toBe(false);
  });

  it('calculates current streak correctly', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    const history = createHistory([
      today.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      yesterday.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      twoDaysAgo.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
    ]);

    const result = calculateStreak(history);
    expect(result.current).toBe(3);
  });

  it('calculates longest streak correctly', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dates = [
      today.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      new Date(today.getTime() - 1 * 86400000).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      new Date(today.getTime() - 2 * 86400000).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      new Date(today.getTime() - 10 * 86400000).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      new Date(today.getTime() - 11 * 86400000).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      new Date(today.getTime() - 12 * 86400000).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      new Date(today.getTime() - 13 * 86400000).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
    ];
    const history = createHistory(dates);
    const result = calculateStreak(history);
    expect(result.longest).toBe(4);
  });
});

describe('predictGoalDate', () => {
  it('returns null if startWeight is 0', () => {
    const result = predictGoalDate(0, 80, 75);
    expect(result).toBeNull();
  });

  it('returns null if startWeight <= goalWeight', () => {
    const result = predictGoalDate(75, 70, 75);
    expect(result).toBeNull();
  });

  it('detects goal achieved', () => {
    const result = predictGoalDate(85, 74, 75);
    expect(result?.date).toBe('¡Objetivo alcanzado!');
    expect(result?.weeks).toBe(0);
  });

  it('calculates estimated date with positive rate', () => {
    const startDate = new Date(Date.now() - 14 * 86400000);
    const result = predictGoalDate(85, 83, 75, startDate);
    expect(result?.ratePerWeek).toBeGreaterThan(0);
    expect(result?.weeks).toBeGreaterThan(0);
  });

  it('returns not on track for very slow rate', () => {
    const startDate = new Date(Date.now() - 30 * 86400000);
    const result = predictGoalDate(85, 84.5, 75, startDate);
    expect(result?.isOnTrack).toBe(false);
  });

  it('returns not on track for too fast rate', () => {
    const startDate = new Date(Date.now() - 7 * 86400000);
    const result = predictGoalDate(85, 80, 75, startDate);
    expect(result?.isOnTrack).toBe(false);
  });
});

describe('getWorkoutStatsSince', () => {
  it('returns null for empty history', () => {
    const result = getWorkoutStatsSince([], 1);
    expect(result).toBeNull();
  });

  it('filters by date correctly', () => {
    const today = new Date();
    const oldDate = new Date(today);
    oldDate.setMonth(today.getMonth() - 2);
    const recentDate = new Date(today);
    recentDate.setDate(today.getDate() - 5);

    const history = createHistory([
      oldDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      recentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
    ]);

    const result = getWorkoutStatsSince(history, 1);
    expect(result?.workoutCount).toBe(1);
    expect(result?.totalVolume).toBe(1000);
  });

  it('returns correct daysSince', () => {
    const today = new Date();
    const recentDate = new Date(today);
    recentDate.setDate(today.getDate() - 3);

    const history = createHistory([
      recentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
    ]);

    const result = getWorkoutStatsSince(history, 1);
    expect(result?.daysSince).toBeLessThanOrEqual(5);
  });
});