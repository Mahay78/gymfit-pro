import { describe, it, expect } from 'vitest';
import { ROUTINE_WEEK_A, ROUTINE_WEEK_B } from '../../data/routines';
import { ROUTINE_FULLBODY } from '../../data/fullbody';
import { ROUTINE_PPL } from '../../data/ppl';
import { ROUTINE_UPPER_LOWER } from '../../data/upperLower';
import { ROUTINE_PPL_UPPER } from '../../data/pplUpper';
import { ROUTINE_BRO_SPLIT } from '../../data/broSplit';
import { WARMUP_STEPS } from '../../data/warmup';
import { CARDIO_OPTIONS } from '../../data/cardio';
import type { MachineType, RoutineDay } from '../../types';

const VALID_MACHINE_TYPES: MachineType[] = [
  'legpress', 'pulldown', 'chestpress', 'legextension',
  'lateralraise', 'crunch', 'legcurl', 'seatedrow',
  'pecdeck', 'reardelt', 'hyperextension', 'bicepcurl',
  'calfraise', 'hacksquat', 'shoulderpress', 'tricepspushdown',
  'captainschair', 'plank'
];

describe('Exercise Library & Routine Validation', () => {
  const allRoutines: { name: string; days: RoutineDay[] }[] = [
    { name: 'Semana A', days: ROUTINE_WEEK_A },
    { name: 'Semana B', days: ROUTINE_WEEK_B },
    { name: 'Full Body', days: ROUTINE_FULLBODY },
    { name: 'PPL', days: ROUTINE_PPL },
    { name: 'Upper / Lower', days: ROUTINE_UPPER_LOWER },
    { name: 'PPL + Upper', days: ROUTINE_PPL_UPPER },
    { name: 'Bro Split', days: ROUTINE_BRO_SPLIT },
  ];

  it('should have valid days and non-empty exercises in every routine', () => {
    allRoutines.forEach(({ name, days }) => {
      expect(days.length, `Routine ${name} should have at least 1 day`).toBeGreaterThan(0);
      days.forEach(day => {
        expect(day.dayId).toBeDefined();
        expect(day.title.length).toBeGreaterThan(3);
        expect(day.exercises.length, `Day ${day.title} in ${name} has no exercises`).toBeGreaterThan(0);
      });
    });
  });

  it('should have valid machineTypes for every exercise', () => {
    allRoutines.forEach(({ name, days }) => {
      days.forEach(day => {
        day.exercises.forEach(ex => {
          expect(
            VALID_MACHINE_TYPES.includes(ex.machineType),
            `Exercise ${ex.name} (id: ${ex.id}) in ${name} has invalid machineType "${ex.machineType}"`
          ).toBe(true);
        });
      });
    });
  });

  it('should have realistic sets, reps, and positive weights', () => {
    allRoutines.forEach(({ days }) => {
      days.forEach(day => {
        day.exercises.forEach(ex => {
          expect(ex.setsCount).toBeGreaterThanOrEqual(1);
          expect(ex.setsCount).toBeLessThanOrEqual(6);
          expect(ex.defaultReps).toBeGreaterThanOrEqual(4);
          expect(ex.defaultReps).toBeLessThanOrEqual(60); // Up to 60s for isometric exercises like Plank
          expect(ex.defaultWeight).toBeGreaterThanOrEqual(0);
          expect(ex.instructions.length).toBeGreaterThan(10);
        });
      });
    });
  });

  it('should have valid warmup steps and cardio options', () => {
    expect(WARMUP_STEPS.length).toBeGreaterThan(0);
    WARMUP_STEPS.forEach(step => {
      expect(step.id).toBeDefined();
      expect(step.title.length).toBeGreaterThan(0);
      expect(step.duration.length).toBeGreaterThan(0);
    });

    expect(CARDIO_OPTIONS.length).toBeGreaterThan(0);
    CARDIO_OPTIONS.forEach(opt => {
      expect(opt.id).toBeDefined();
      expect(opt.name.length).toBeGreaterThan(0);
    });
  });
});
