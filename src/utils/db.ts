import Dexie from 'dexie';
import type { HistoryItem, BodyMeasurement, CardioSession, RoutineOverrides } from '../types';

interface CustomWeightRecord {
  id: string;
  weight: number;
}

interface UserProfileRecord {
  id: string;
  userWeight: number;
  startWeight: number;
  goalWeight: number;
  userHeight: number;
  userAge: number;
  userGender: string;
  userActivity: number;
  dailyWater: number;
  dailyProtein: number;
  hapticsEnabled: boolean;
  onboarded: boolean;
  pwaDismissed: boolean;
  soundType: string;
  soundEnabled: boolean;
  timerTotal: number;
}

interface RoutineOverrideRecord {
  key: string;
  value: RoutineOverrides[string];
}

export class GymFitDB extends Dexie {
  customWeights!: Dexie.Table<CustomWeightRecord, string>;
  history!: Dexie.Table<HistoryItem, string>;
  bodyMeasurements!: Dexie.Table<BodyMeasurement, string>;
  cardioSessions!: Dexie.Table<CardioSession, string>;
  userProfile!: Dexie.Table<UserProfileRecord, string>;
  routineOverrides!: Dexie.Table<RoutineOverrideRecord, string>;

  constructor() {
    super('GymFitProDB');
    this.version(1).stores({
      customWeights: 'id',
      history: 'id, date',
      bodyMeasurements: 'id, date',
      cardioSessions: 'id, date',
      userProfile: 'id',
      routineOverrides: 'key',
    });
  }
}

export const db = new GymFitDB();

export async function migrateFromLocalStorage() {
  const migrated = localStorage.getItem('gymfit_pro_migrated_v1');
  if (migrated) return;

  try {
    const customWeights = JSON.parse(localStorage.getItem('gymfit_pro_customWeights') || '{}');
    const history = JSON.parse(localStorage.getItem('gymfit_pro_history_v2') || '[]');
    const bodyMeasurements = JSON.parse(localStorage.getItem('gymfit_pro_measurements') || '[]');
    const cardioSessions = JSON.parse(localStorage.getItem('gymfit_pro_cardioSessions') || '[]');
    const userWeight = Number(localStorage.getItem('gymfit_pro_userWeight') || 80);
    const startWeight = Number(localStorage.getItem('gymfit_pro_startWeight') || 80);
    const goalWeight = Number(localStorage.getItem('gymfit_pro_goalWeight') || 75);
    const userHeight = Number(localStorage.getItem('gymfit_pro_userHeight') || 175);
    const userAge = Number(localStorage.getItem('gymfit_pro_userAge') || 28);
    const userGender = localStorage.getItem('gymfit_pro_userGender') || 'male';
    const userActivity = Number(localStorage.getItem('gymfit_pro_userActivity') || 1.375);
    const dailyWater = Number(localStorage.getItem('gymfit_pro_dailyWater') || 0);
    const dailyProtein = Number(localStorage.getItem('gymfit_pro_dailyProtein') || 0);
    const hapticsEnabled = localStorage.getItem('gymfit_pro_haptics') !== 'false';
    const onboarded = localStorage.getItem('gymfit_pro_onboarded') === 'true';
    const pwaDismissed = localStorage.getItem('gymfit_pwa_dismissed') === 'true';
    const soundType = localStorage.getItem('gymfit_pro_soundType') || 'chime';
    const soundEnabled = localStorage.getItem('gymfit_pro_soundEnabled') !== 'false';
    const timerTotal = Number(localStorage.getItem('gymfit_pro_timerTotal') || 90);
    const routineOverrides = JSON.parse(localStorage.getItem('gymfit_pro_routine_overrides') || '{}');

    await db.transaction('rw', [
      db.customWeights,
      db.history,
      db.bodyMeasurements,
      db.cardioSessions,
      db.userProfile,
      db.routineOverrides,
    ], async () => {
      await Promise.all([
        db.customWeights.bulkPut(Object.entries(customWeights).map(([id, weight]) => ({ id, weight: Number(weight) }))),
        db.history.bulkPut(history),
        db.bodyMeasurements.bulkPut(bodyMeasurements.map((m, i) => ({ ...m, id: m.id || `m-${i}` }))),
        db.cardioSessions.bulkPut(cardioSessions),
        db.userProfile.put({
          id: 'profile',
          userWeight,
          startWeight,
          goalWeight,
          userHeight,
          userAge,
          userGender,
          userActivity,
          dailyWater,
          dailyProtein,
          hapticsEnabled,
          onboarded,
          pwaDismissed,
          soundType,
          soundEnabled,
          timerTotal,
        }),
        db.routineOverrides.bulkPut(Object.entries(routineOverrides).map(([key, value]) => ({ key, value }))),
      ]);
    });

    localStorage.setItem('gymfit_pro_migrated_v1', 'true');
    console.log('Migration to IndexedDB completed');
  } catch (error) {
    console.warn('Migration failed, continuing with localStorage fallback:', error);
  }
}