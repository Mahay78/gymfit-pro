import { describe, it, expect } from 'vitest';
import { calculateProgressionSuggestions, getWeightProgressionTip } from '../progression';
import type { HistoryItem, WorkoutExercise } from '../../types';

function createMockHistory(exerciseId: string, sessions: { weight: number; reps: number; date: string }[]): HistoryItem[] {
  return sessions.map((s, i) => ({
    id: `h-${i}`,
    date: s.date,
    dayTitle: 'Test Workout',
    duration: '60 min',
    completedExercises: 3,
    totalVolume: s.weight * s.reps,
    weight: 80,
    cardioCompleted: true,
    exercises: [{
      id: exerciseId,
      name: 'Test Exercise',
      sets: [
        { weight: s.weight, reps: s.reps, completed: true, rpe: 8 },
      ],
    }],
  }));
}

function createMockWorkout(exerciseId: string, weight: number): { exercises: WorkoutExercise[] } {
  return {
    exercises: [{
      id: exerciseId,
      name: 'Test Exercise',
      alternativeName: 'Alt',
      target: 'Chest',
      machineBase: 0,
      machineType: 'chestpress',
      sets: [
        { setNumber: 1, weight, reps: 8, completed: true, rpe: 8 },
        { setNumber: 2, weight, reps: 8, completed: true, rpe: 8 },
        { setNumber: 3, weight, reps: 8, completed: true, rpe: 8 },
      ],
    }],
  };
}

describe('calculateProgressionSuggestions', () => {
  it('returns empty array for empty history', () => {
    const workout = createMockWorkout('press-plano-maquina', 50);
    const suggestions = calculateProgressionSuggestions(workout, []);
    expect(suggestions).toEqual([]);
  });

  it('suggests progression after 2 consecutive perfect sessions', () => {
    const history = createMockHistory('press-plano-maquina', [
      { weight: 50, reps: 8, date: '15 ene 2025' },
      { weight: 50, reps: 8, date: '22 ene 2025' },
    ]);
    const workout = createMockWorkout('press-plano-maquina', 50);
    const suggestions = calculateProgressionSuggestions(workout, history);
    
    expect(suggestions.length).toBe(1);
    expect(suggestions[0].exerciseId).toBe('press-plano-maquina');
    expect(suggestions[0].currentWeight).toBe(50);
    expect(suggestions[0].suggestedWeight).toBe(52.5);
    expect(suggestions[0].completedSessions).toBe(2);
  });

  it('uses 1.25kg increment for isolation exercises', () => {
    const history = createMockHistory('elevaciones-laterales', [
      { weight: 10, reps: 15, date: '15 ene 2025' },
      { weight: 10, reps: 15, date: '22 ene 2025' },
    ]);
    const workout = createMockWorkout('elevaciones-laterales', 10);
    const suggestions = calculateProgressionSuggestions(workout, history);
    
    expect(suggestions.length).toBe(1);
    expect(suggestions[0].suggestedWeight).toBe(11.25);
  });

  it('does not suggest if only 1 perfect session', () => {
    const history = createMockHistory('press-plano-maquina', [
      { weight: 50, reps: 8, date: '22 ene 2025' },
    ]);
    const workout = createMockWorkout('press-plano-maquina', 50);
    const suggestions = calculateProgressionSuggestions(workout, history);
    
    expect(suggestions).toEqual([]);
  });

  it('does not suggest if reps below target', () => {
    const history = createMockHistory('press-plano-maquina', [
      { weight: 50, reps: 6, date: '15 ene 2025' },
      { weight: 50, reps: 6, date: '22 ene 2025' },
    ]);
    const workout = createMockWorkout('press-plano-maquina', 50);
    const suggestions = calculateProgressionSuggestions(workout, history);
    
    expect(suggestions).toEqual([]);
  });

  it('does not suggest if weight decreased', () => {
    const history = createMockHistory('press-plano-maquina', [
      { weight: 50, reps: 8, date: '15 ene 2025' },
      { weight: 47.5, reps: 8, date: '22 ene 2025' },
    ]);
    const workout = createMockWorkout('press-plano-maquina', 50);
    const suggestions = calculateProgressionSuggestions(workout, history);
    
    expect(suggestions).toEqual([]);
  });
});

describe('getWeightProgressionTip', () => {
  it('suggests increase when all reps exceed target by 2+', () => {
    const tip = getWeightProgressionTip('press-plano-maquina', 50, 8, [10, 10, 10]);
    expect(tip).toContain('52.5kg');
    expect(tip).toContain('próxima semana');
  });

  it('suggests decrease when average reps below target - 1', () => {
    const tip = getWeightProgressionTip('press-plano-maquina', 50, 8, [6, 6, 6]);
    expect(tip).toContain('47.5kg');
  });

  it('uses 1.25kg for isolation exercises', () => {
    const tip = getWeightProgressionTip('elevaciones-laterales', 10, 15, [17, 17, 17]);
    expect(tip).toContain('11.25kg');
  });

  it('returns null when reps are on target', () => {
    const tip = getWeightProgressionTip('press-plano-maquina', 50, 8, [8, 8, 9]);
    expect(tip).toBeNull();
  });

  it('returns null when reps slightly below target', () => {
    const tip = getWeightProgressionTip('press-plano-maquina', 50, 8, [7, 7, 8]);
    expect(tip).toBeNull();
  });
});