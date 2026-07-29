import { useState, useEffect, useCallback } from 'react';
import { safeGetItem, safeSetItem } from '../utils/storage';

export function useLocalStorage<T>(key: string, fallback: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => safeGetItem(key, fallback));

  useEffect(() => {
    safeSetItem(key, value);
  }, [key, value]);

  return [value, setValue];
}

export function useLocalStorageRaw(key: string, fallback: string): [string, (v: string) => void] {
  const [value, setValue] = useState<string>(() => {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, value);
    } catch { /* ignore */ }
  }, [key, value]);

  const setter = useCallback((v: string) => setValue(v), []);
  return [value, setter];
}
