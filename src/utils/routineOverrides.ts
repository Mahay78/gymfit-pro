import type { RoutineDay, RoutineType, AbWeek } from '../types';

export interface RoutineOverride {
  removed: string[];
  edited: Record<string, { setsCount?: number; defaultReps?: number }>;
}

export type RoutineOverrides = Record<string, RoutineOverride>;

export function overrideKey(routineType: RoutineType, week: AbWeek, dayId: number): string {
  const wk = routineType === 'ab-split' ? `${week}:` : '';
  return `${routineType}:${wk}${dayId}`;
}

export function applyOverrides(
  routineSource: RoutineDay[],
  overrides: RoutineOverrides,
  routineType: RoutineType,
  week: AbWeek,
): RoutineDay[] {
  return routineSource.map(day => {
    const ov = overrides[overrideKey(routineType, week, day.dayId)];
    if (!ov) return day;
    const exercises = day.exercises
      .filter(ex => !ov.removed.includes(ex.id))
      .map(ex => {
        const e = ov.edited[ex.id];
        if (!e) return ex;
        return {
          ...ex,
          setsCount: e.setsCount ?? ex.setsCount,
          defaultReps: e.defaultReps ?? ex.defaultReps,
        };
      });
    return { ...day, exercises };
  });
}
