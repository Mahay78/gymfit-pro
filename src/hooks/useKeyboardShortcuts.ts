import { useEffect } from 'react';

export interface ShortcutHandlers {
  onCompleteSet?: () => void;
  onNextSet?: () => void;
  onPrevSet?: () => void;
  onWeightUp?: () => void;
  onWeightDown?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';
      if (isInput) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlers.onCompleteSet?.();
          break;
        case 'ArrowUp':
          if (e.shiftKey) handlers.onWeightUp?.();
          else handlers.onNextSet?.();
          break;
        case 'ArrowDown':
          if (e.shiftKey) handlers.onWeightDown?.();
          else handlers.onPrevSet?.();
          break;
        case 'Escape':
          handlers.onEscape?.();
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handlers, enabled]);
}
