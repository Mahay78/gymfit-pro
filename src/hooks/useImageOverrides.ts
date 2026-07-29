import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { MachineType } from '../types';

const KEY = 'gymfit_pro_image_overrides';

export function useImageOverrides() {
  const [overrides, setOverrides] = useLocalStorage<Record<string, string>>(KEY, {});

  const setImage = useCallback((type: MachineType, dataUrl: string) => {
    setOverrides(prev => ({ ...prev, [type]: dataUrl }));
  }, [setOverrides]);

  const resetImage = useCallback((type: MachineType) => {
    setOverrides(prev => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
  }, [setOverrides]);

  const resetAll = useCallback(() => {
    setOverrides({});
  }, [setOverrides]);

  const getImage = useCallback((type: MachineType, defaultUrl: string): string => {
    return overrides[type] || defaultUrl;
  }, [overrides]);

  return { overrides, setImage, resetImage, resetAll, getImage };
}
