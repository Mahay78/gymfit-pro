import { useCallback } from 'react';

export function useHaptics(enabled: boolean) {
  const trigger = useCallback((duration: number = 30) => {
    if (!enabled) return;
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(duration);
      } catch { /* noop */ }
    }
  }, [enabled]);

  const light = useCallback(() => trigger(15), [trigger]);
  const medium = useCallback(() => trigger(40), [trigger]);
  const heavy = useCallback(() => trigger(80), [trigger]);
  const success = useCallback(() => {
    if (!enabled) return;
    if ('vibrate' in navigator) {
      try { navigator.vibrate([30, 50, 30]); } catch { /* noop */ }
    }
  }, [enabled]);

  return { light, medium, heavy, success };
}
