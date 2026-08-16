import type { HistoryItem } from '../types';

export type MuscleGroup = 'Pecho' | 'Espalda' | 'Cuádriceps' | 'Isquios/Glúteo' | 'Hombros' | 'Brazos' | 'Core';

export interface MuscleVolumeStatus {
  muscle: MuscleGroup;
  sets: number;
  status: 'Bajo' | 'Óptimo' | 'Alto';
  color: string;
  percentage: number; // 0 to 100 for gauge
}

const EXERCISE_MUSCLE_MAP: Record<string, MuscleGroup> = {
  // Pecho
  'press-banca': 'Pecho',
  'press-inclinado': 'Pecho',
  'peck-deck': 'Pecho',
  'aperturas': 'Pecho',
  'fondos': 'Pecho',
  'press-plano-maquina': 'Pecho',
  'press-inclinado-mancuernas': 'Pecho',

  // Espalda
  'jalon-pecho': 'Espalda',
  'remo-gironda': 'Espalda',
  'remo-mancuerna': 'Espalda',
  'pullover': 'Espalda',
  'dominadas': 'Espalda',
  'remo-barra': 'Espalda',
  'jalon-agarre-estrecho': 'Espalda',

  // Cuádriceps
  'prensa-inclinada': 'Cuádriceps',
  'extension-cuadriceps': 'Cuádriceps',
  'sentadilla-hack': 'Cuádriceps',
  'sentadilla': 'Cuádriceps',
  'zancadas': 'Cuádriceps',

  // Isquios / Glúteo
  'femoral-tumbado': 'Isquios/Glúteo',
  'femoral-sentado': 'Isquios/Glúteo',
  'peso-muerto-rumano': 'Isquios/Glúteo',
  'hip-thrust': 'Isquios/Glúteo',
  'patada-gluteo': 'Isquios/Glúteo',

  // Hombros
  'press-militar': 'Hombros',
  'elevaciones-laterales': 'Hombros',
  'pajaros': 'Hombros',
  'press-hombros-maquina': 'Hombros',
  'face-pull': 'Hombros',

  // Brazos
  'curl-biceps-barra': 'Brazos',
  'curl-biceps-mancuernas': 'Brazos',
  'curl-martillo': 'Brazos',
  'triceps-polea': 'Brazos',
  'press-frances': 'Brazos',
  'extension-triceps-cuerda': 'Brazos',

  // Core
  'plancha': 'Core',
  'crunch-polea': 'Core',
  'elevacion-piernas': 'Core',
  'rueda-abdominal': 'Core',
};

export function getExerciseMuscleGroup(exerciseId: string, exerciseName: string): MuscleGroup {
  const normalizedId = exerciseId.toLowerCase();
  if (EXERCISE_MUSCLE_MAP[normalizedId]) return EXERCISE_MUSCLE_MAP[normalizedId];

  const nameLower = exerciseName.toLowerCase();
  if (nameLower.includes('press') || nameLower.includes('pecho') || nameLower.includes('peck')) return 'Pecho';
  if (nameLower.includes('remo') || nameLower.includes('jalon') || nameLower.includes('jalón') || nameLower.includes('espalda') || nameLower.includes('dominada')) return 'Espalda';
  if (nameLower.includes('prensa') || nameLower.includes('cuad') || nameLower.includes('sentadilla') || nameLower.includes('extensi')) return 'Cuádriceps';
  if (nameLower.includes('femoral') || nameLower.includes('rumano') || nameLower.includes('hip') || nameLower.includes('glute')) return 'Isquios/Glúteo';
  if (nameLower.includes('lateral') || nameLower.includes('hombro') || nameLower.includes('militar') || nameLower.includes('pajaro')) return 'Hombros';
  if (nameLower.includes('curl') || nameLower.includes('triceps') || nameLower.includes('biceps') || nameLower.includes('brazo')) return 'Brazos';
  if (nameLower.includes('abs') || nameLower.includes('core') || nameLower.includes('plancha') || nameLower.includes('crunch')) return 'Core';

  return 'Espalda';
}

export function calculateWeeklyMuscleVolume(history: HistoryItem[]): MuscleVolumeStatus[] {
  const muscleGroups: MuscleGroup[] = ['Pecho', 'Espalda', 'Cuádriceps', 'Isquios/Glúteo', 'Hombros', 'Brazos', 'Core'];
  const counts: Record<MuscleGroup, number> = {
    'Pecho': 0,
    'Espalda': 0,
    'Cuádriceps': 0,
    'Isquios/Glúteo': 0,
    'Hombros': 0,
    'Brazos': 0,
    'Core': 0,
  };

  // Filtrar últimos 7 días de entrenamientos
  const last7Workouts = history.slice(0, 7);

  last7Workouts.forEach(workout => {
    if (workout.exercises && Array.isArray(workout.exercises)) {
      workout.exercises.forEach(ex => {
        const group = getExerciseMuscleGroup(ex.id, ex.name);
        const completedSets = ex.sets ? ex.sets.filter(s => s.completed).length : 3;
        counts[group] += completedSets;
      });
    } else {
      // Estimación si no hay desglose individual
      counts['Pecho'] += 3;
      counts['Espalda'] += 3;
      counts['Cuádriceps'] += 3;
    }
  });

  return muscleGroups.map(muscle => {
    const sets = counts[muscle];
    // Rango óptimo estándar de hipertrofia: 10-20 series/semana
    let status: 'Bajo' | 'Óptimo' | 'Alto' = 'Óptimo';
    let color = '#10b981'; // Esmeralda

    if (sets < 8) {
      status = 'Bajo';
      color = '#f59e0b'; // Ámbar
    } else if (sets > 22) {
      status = 'Alto';
      color = '#f43f5e'; // Rosa/Rojo
    }

    const percentage = Math.min(100, Math.round((sets / 20) * 100));

    return { muscle, sets, status, color, percentage };
  });
}
