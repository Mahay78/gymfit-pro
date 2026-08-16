import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'gymfit_pro_machine_notes';

export function useMachineNotes() {
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // Quota exceeded
    }
  }, [notes]);

  const setExerciseNote = useCallback((exerciseId: string, noteText: string) => {
    setNotes(prev => ({
      ...prev,
      [exerciseId]: noteText.trim(),
    }));
  }, []);

  const getExerciseNote = useCallback((exerciseId: string) => {
    return notes[exerciseId] || '';
  }, [notes]);

  return {
    notes,
    setExerciseNote,
    getExerciseNote,
  };
}
