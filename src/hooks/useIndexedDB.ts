import { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../utils/db';
import type { HistoryItem, BodyMeasurement, CardioSession, RoutineOverrides, UserProfileRecord } from '../types';

type SetStateAction<T> = T | ((prev: T) => T);

function useIndexedDB<T>(key: string, fallback: T, getFromDB: (db: typeof db) => Promise<T>, setInDB: (db: typeof db, value: T) => Promise<void>): [T, React.Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);
  const savingRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    getFromDB(db).then(data => {
      if (mounted) {
        setValue(data);
        setLoaded(true);
      }
    }).catch(() => {
      if (mounted) {
        setValue(fallback);
        setLoaded(true);
      }
    });
    return () => { mounted = false; };
  }, [key, getFromDB]);

  const setValueCallback = useCallback((action: SetStateAction<T>) => {
    setValue(prev => {
      const next = typeof action === 'function' ? (action as (prev: T) => T)(prev) : action;
      if (!savingRef.current && loaded) {
        savingRef.current = true;
        setInDB(db, next).finally(() => { savingRef.current = false; });
      }
      return next;
    });
  }, [loaded, setInDB]);

  return [value, setValueCallback];
}

export function useCustomWeights(): [Record<string, number>, React.Dispatch<SetStateAction<Record<string, number>>>] {
  return useIndexedDB(
    'customWeights',
    {},
    async (db) => {
      const records = await db.customWeights.toArray();
      return Object.fromEntries(records.map(r => [r.id, r.weight]));
    },
    async (db, value) => {
      await db.transaction('rw', db.customWeights, async () => {
        await db.customWeights.clear();
        await db.customWeights.bulkPut(Object.entries(value).map(([id, weight]) => ({ id, weight })));
      });
    }
  );
}

export function useHistory(): [HistoryItem[], React.Dispatch<SetStateAction<HistoryItem[]>>] {
  return useIndexedDB(
    'history',
    [],
    async (db) => db.history.orderBy('date').reverse().toArray(),
    async (db, value) => {
      await db.transaction('rw', db.history, async () => {
        await db.history.clear();
        if (value.length > 0) await db.history.bulkPut(value);
      });
    }
  );
}

export function useBodyMeasurements(): [BodyMeasurement[], React.Dispatch<SetStateAction<BodyMeasurement[]>>] {
  return useIndexedDB(
    'bodyMeasurements',
    [],
    async (db) => db.bodyMeasurements.orderBy('date').reverse().toArray(),
    async (db, value) => {
      await db.transaction('rw', db.bodyMeasurements, async () => {
        await db.bodyMeasurements.clear();
        if (value.length > 0) await db.bodyMeasurements.bulkPut(value);
      });
    }
  );
}

export function useCardioSessions(): [CardioSession[], React.Dispatch<SetStateAction<CardioSession[]>>] {
  return useIndexedDB(
    'cardioSessions',
    [],
    async (db) => db.cardioSessions.orderBy('date').reverse().toArray(),
    async (db, value) => {
      await db.transaction('rw', db.cardioSessions, async () => {
        await db.cardioSessions.clear();
        if (value.length > 0) await db.cardioSessions.bulkPut(value);
      });
    }
  );
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfileRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    db.userProfile.get('profile').then(p => {
      if (mounted) {
        setProfile(p || {
          id: 'profile',
          userWeight: 80,
          startWeight: 80,
          goalWeight: 75,
          userHeight: 175,
          userAge: 28,
          userGender: 'male',
          userActivity: 1.375,
          dailyWater: 0,
          dailyProtein: 0,
          hapticsEnabled: true,
          onboarded: false,
          pwaDismissed: false,
          soundType: 'chime',
          soundEnabled: true,
          timerTotal: 90,
        });
        setLoaded(true);
      }
    });
    return () => { mounted = false; };
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfileRecord>) => {
    if (!profile) return;
    const next = { ...profile, ...updates };
    setProfile(next);
    await db.userProfile.put(next);
  }, [profile]);

  return [profile, updateProfile, loaded] as const;
}

export function useRoutineOverrides(): [Record<string, RoutineOverrides[string]>, React.Dispatch<SetStateAction<Record<string, RoutineOverrides[string]>>>] {
  return useIndexedDB(
    'routineOverrides',
    {},
    async (db) => {
      const records = await db.routineOverrides.toArray();
      return Object.fromEntries(records.map(r => [r.key, r.value]));
    },
    async (db, value) => {
      await db.transaction('rw', db.routineOverrides, async () => {
        await db.routineOverrides.clear();
        await db.routineOverrides.bulkPut(Object.entries(value).map(([key, value]) => ({ key, value })));
      });
    }
  );
}