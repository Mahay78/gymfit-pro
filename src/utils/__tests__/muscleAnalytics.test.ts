import { describe, it, expect } from 'vitest';
import { getExerciseMuscleGroup, calculateWeeklyMuscleVolume } from '../muscleAnalytics';

describe('muscleAnalytics', () => {
  it('correctly categorizes exercises into muscle groups', () => {
    expect(getExerciseMuscleGroup('press-banca', 'Press Banca')).toBe('Pecho');
    expect(getExerciseMuscleGroup('jalon-pecho', 'Jalón al Pecho')).toBe('Espalda');
    expect(getExerciseMuscleGroup('prensa-inclinada', 'Prensa Inclinada')).toBe('Cuádriceps');
    expect(getExerciseMuscleGroup('femoral-tumbado', 'Curl Femoral')).toBe('Isquios/Glúteo');
    expect(getExerciseMuscleGroup('press-militar', 'Press Militar')).toBe('Hombros');
    expect(getExerciseMuscleGroup('curl-biceps-barra', 'Curl de Bíceps')).toBe('Brazos');
    expect(getExerciseMuscleGroup('plancha', 'Plancha Abdominal')).toBe('Core');
  });

  it('calculates weekly volume based on history', () => {
    const fakeHistory = [
      {
        id: 1,
        date: '2026-08-16',
        dayTitle: 'Día 1',
        duration: '45 min',
        completedExercises: 3,
        totalVolume: 3500,
        weight: 80,
        exercises: [
          {
            id: 'press-banca',
            name: 'Press Banca',
            sets: [
              { weight: 80, reps: 10, completed: true, rpe: 8 },
              { weight: 80, reps: 10, completed: true, rpe: 8 },
              { weight: 80, reps: 10, completed: true, rpe: 8 },
            ],
          },
        ],
      },
    ];

    const volume = calculateWeeklyMuscleVolume(fakeHistory as any);
    const pechoVolume = volume.find(v => v.muscle === 'Pecho');
    expect(pechoVolume).toBeDefined();
    expect(pechoVolume?.sets).toBe(3);
  });
});
