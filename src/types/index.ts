export type MachineType =
  | 'legpress' | 'pulldown' | 'chestpress' | 'legextension'
  | 'lateralraise' | 'crunch' | 'legcurl' | 'seatedrow'
  | 'pecdeck' | 'reardelt' | 'hyperextension' | 'bicepcurl'
  | 'calfraise' | 'hacksquat' | 'shoulderpress' | 'tricepspushdown'
  | 'captainschair' | 'plank';

export interface Exercise {
  id: string;
  name: string;
  alternativeName: string;
  target: string;
  setsCount: number;
  defaultReps: number;
  defaultWeight: number;
  machineBase: number;
  instructions: string;
  machineType: MachineType;
}

export interface CustomExercise {
  id: string;
  name: string;
  target: string;
  photo?: string;
  note?: string;
}

export interface RoutineDay {
  dayId: number;
  title: string;
  shortTitle: string;
  description: string;
  exercises: Exercise[];
}

export interface WarmupStep {
  id: string;
  title: string;
  desc: string;
  duration: string;
}

export interface CardioOption {
  id: string;
  name: string;
  details: string;
  avgCals: string;
}

export interface SetData {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
  rpe: number;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  alternativeName: string;
  target: string;
  machineBase: number;
  machineType: MachineType;
  sets: SetData[];
}

export interface Workout {
  week: string;
  dayIndex: number;
  title: string;
  exercises: WorkoutExercise[];
}

export interface HistoryItem {
  id: string;
  date: string;
  dayTitle: string;
  duration: string;
  completedExercises: number;
  totalVolume: number;
  weight: number;
  cardioCompleted: boolean;
  notes?: string;
  exercises?: { id: string; name: string; sets: { weight: number; reps: number; completed: boolean; rpe?: number }[] }[];
}

export interface BodyMeasurement {
  date: string;
  waist: number;
  hips: number;
  chest: number;
  thigh: number;
}

export interface CardioSession {
  id: string;
  date: string;
  type: string;
  duration: number;
  calories: number;
}

export interface PlateResult {
  weightPerSide: number;
  plates: { size: number; count: number }[];
  unresolved: number;
  error?: string;
}

export type TabId = 'rutinas' | 'entrenar' | 'deficit' | 'progreso' | 'ajustes';
export type WorkoutPhase = 'warmup' | 'lifting' | 'cardio' | 'victory';
export type RoutineType = 'ab-split' | 'fullbody' | 'ppl' | 'upper-lower' | 'ppl-upper' | 'bro-split';
export type AbWeek = 'A' | 'B';

export interface UserProfile {
  name: string;
  goalWeight: number;
  startWeight: number;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  height: number;
  birthYear: number;
}

export const ROUTINE_TYPE_INFO: Record<RoutineType, { name: string; short: string; description: string; frequency: string; level: string }> = {
  'ab-split': {
    name: 'A/B Empuje-Tirón',
    short: 'A/B',
    description: 'Ondulado de 2 semanas: empuje, tirón y pierna con mayor densidad.',
    frequency: '3 días/semana',
    level: 'Intermedio',
  },
  'fullbody': {
    name: 'Full Body 3D',
    short: 'Full Body',
    description: 'Todo el cuerpo cada sesión. Ideal para pérdida de grasa y principiantes.',
    frequency: '3 días/semana',
    level: 'Principiante',
  },
  'ppl': {
    name: 'Empuje-Tirón-Pierna',
    short: 'PPL',
    description: 'Por zonas musculares. Más volumen por grupo. Para intermedios/avanzados.',
    frequency: '3 días/semana',
    level: 'Intermedio-Avanzado',
  },
  'upper-lower': {
    name: 'Tren Superior/Inferior',
    short: 'Upper/Lower',
    description: 'Alterna tren superior e inferior. 4 días por semana con alta frecuencia.',
    frequency: '4 días/semana',
    level: 'Intermedio',
  },
  'ppl-upper': {
    name: 'PPL + Tren Superior',
    short: 'PPL+Upper',
    description: 'Empuje, Tirón, Pierna, Tren Superior. 4 días para más volumen.',
    frequency: '4 días/semana',
    level: 'Intermedio-Avanzado',
  },
  'bro-split': {
    name: 'Bro Split (5 días)',
    short: 'Bro Split',
    description: 'Un grupo muscular por día. Para avanzados con buena recuperación.',
    frequency: '5 días/semana',
    level: 'Avanzado',
  },
};

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}
