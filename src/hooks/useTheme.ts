import { useEffect, useState } from 'react';
import { safeGetItem, safeSetItem } from '../utils/storage';

export type Theme = 'dark' | 'light' | 'auto';

const KEY = 'gymfit_pro_theme';

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => safeGetItem<Theme>(KEY, 'dark'));

  useEffect(() => {
    safeSetItem(KEY, theme);
    const root = document.documentElement;
    if (theme === 'auto') {
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      root.classList.toggle('light', prefersLight);
    } else {
      root.classList.toggle('light', theme === 'light');
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== 'auto') return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('light', e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const cycle = () => {
    setTheme(t => t === 'dark' ? 'light' : t === 'light' ? 'auto' : 'dark');
  };

  return [theme, cycle];
}
