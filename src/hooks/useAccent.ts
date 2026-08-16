import { useEffect, useState } from 'react';
import { safeGetItem, safeSetItem } from '../utils/storage';

export type AccentName = 'emerald' | 'cyan' | 'rose' | 'violet' | 'amber';

export const ACCENTS: { name: AccentName; label: string; hex: string }[] = [
  { name: 'emerald', label: 'Esmeralda', hex: '#10b981' },
  { name: 'cyan', label: 'Cian', hex: '#06b6d4' },
  { name: 'rose', label: 'Rosa', hex: '#f43f5e' },
  { name: 'violet', label: 'Violeta', hex: '#8b5cf6' },
  { name: 'amber', label: 'Ámbar', hex: '#f59e0b' },
];

const KEY = 'gymfit_pro_accent';

export function useAccent(): [AccentName, (a: AccentName) => void] {
  const [accent, setAccent] = useState<AccentName>(() => safeGetItem<AccentName>(KEY, 'emerald'));

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
    safeSetItem(KEY, accent);
  }, [accent]);

  return [accent, setAccent];
}
