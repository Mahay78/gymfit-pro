/**
 * Tests para funciones de analytics
 * Ejecutar con: npx vitest run (requiere instalar vitest)
 */
import { describe, it, expect } from 'vitest';
import { calculateStreak, predictGoalDate, getWorkoutStatsSince } from '../analytics';

describe('calculateStreak', () => {
  it('devuelve ceros para historial vacío', () => {
    const result = calculateStreak([]);
    expect(result.current).toBe(0);
    expect(result.longest).toBe(0);
    expect(result.lastWorkoutDaysAgo).toBe(null);
  });

  it('cuenta correctamente racha de 3 días', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    const history = [
      { id: '1', date: formatDateForTest(today), dayTitle: '', duration: '', completedExercises: 0, totalVolume: 0, weight: 0, cardioCompleted: true },
      { id: '2', date: formatDateForTest(yesterday), dayTitle: '', duration: '', completedExercises: 0, totalVolume: 0, weight: 0, cardioCompleted: true },
      { id: '3', date: formatDateForTest(twoDaysAgo), dayTitle: '', duration: '', completedExercises: 0, totalVolume: 0, weight: 0, cardioCompleted: true },
    ];
    const result = calculateStreak(history);
    expect(result.current).toBe(3);
  });
});

describe('predictGoalDate', () => {
  it('devuelve null si startWeight es 0', () => {
    const result = predictGoalDate(0, 80, 75);
    expect(result).toBe(null);
  });

  it('detecta objetivo alcanzado', () => {
    const result = predictGoalDate(85, 74, 75);
    expect(result?.date).toBe('¡Objetivo alcanzado!');
  });

  it('calcula fecha estimada con tasa positiva', () => {
    const result = predictGoalDate(85, 80, 75, new Date(Date.now() - 7 * 86400000));
    expect(result?.ratePerWeek).toBeGreaterThan(0);
  });
});

function formatDateForTest(d: Date): string {
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}
