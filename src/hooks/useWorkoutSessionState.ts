import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  Workout,
  WorkoutPhase,
  HistoryItem,
  CardioSession,
  RoutineType,
  AbWeek,
  RoutineDay,
} from '../types';
import { ROUTINE_WEEK_A, ROUTINE_WEEK_B } from '../data/routines';
import { ROUTINE_FULLBODY } from '../data/fullbody';
import { ROUTINE_PPL } from '../data/ppl';
import { ROUTINE_UPPER_LOWER } from '../data/upperLower';
import { ROUTINE_PPL_UPPER } from '../data/pplUpper';
import { ROUTINE_BRO_SPLIT } from '../data/broSplit';
import { applyOverrides, type RoutineOverrides } from '../utils/routineOverrides';
import { calculateProgressionSuggestions } from '../utils/progression';
import { formatDate } from '../utils/format';
import { sendBrowserNotification } from '../utils/browserNotifications';

interface UseWorkoutSessionStateProps {
  customWeights: Record<string, number>;
  setCustomWeights: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  routineOverrides: RoutineOverrides;
  selectedRoutineType: RoutineType;
  selectedWeek: AbWeek;
  userWeight: number;
  timerTotal: number;
  soundEnabled: boolean;
  soundType: string;
  playSound: (type: string) => void;
  haptics: {
    light: () => void;
    medium: () => void;
    heavy: () => void;
    success: () => void;
    warning: () => void;
  };
  showNotification: (msg: string) => void;
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  setCardioSessions: React.Dispatch<React.SetStateAction<CardioSession[]>>;
  setActiveTab: (tab: any) => void;
}

export function useWorkoutSessionState({
  customWeights,
  setCustomWeights,
  routineOverrides,
  selectedRoutineType,
  selectedWeek,
  userWeight,
  timerTotal,
  soundEnabled,
  soundType,
  playSound,
  haptics,
  showNotification,
  history,
  setHistory,
  setCardioSessions,
  setActiveTab,
}: UseWorkoutSessionStateProps) {
  const [workoutActive, setWorkoutActive] = useState(false);
  const [workoutPhase, setWorkoutPhase] = useState<WorkoutPhase>('warmup');
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [swappedExercises, setSwappedExercises] = useState<Record<string, boolean>>({});
  const [completedWarmupSteps, setCompletedWarmupSteps] = useState<Record<string, boolean>>({});
  const [activeWorkoutTime, setActiveWorkoutTime] = useState(0);

  const [timerLeft, setTimerLeft] = useState(0);
  const [initialTimerLeft, setInitialTimerLeft] = useState(timerTotal);
  const [timerRunning, setTimerRunning] = useState(false);

  const [cardioTimeLeft, setCardioTimeLeft] = useState(1800);
  const [cardioTimerRunning, setCardioTimerRunning] = useState(false);
  const [selectedCardioType, setSelectedCardioType] = useState('Cinta Inclinada (LISS)');

  const activeWorkoutInterval = useRef<number | null>(null);
  const timerInterval = useRef<number | null>(null);
  const cardioTimerInterval = useRef<number | null>(null);

  const timerEndTimeRef = useRef<number | null>(null);
  const cardioEndTimeRef = useRef<number | null>(null);
  const workoutStartTimeRef = useRef<number | null>(null);
  const workoutBaseElapsedRef = useRef<number>(0);

  // Sincronizar título de pestaña para visualización en multitasking / split-screen
  useEffect(() => {
    if (timerRunning && timerLeft > 0) {
      document.title = `⏱️ (${timerLeft}s) Descanso — GymFit Pro`;
    } else if (cardioTimerRunning && cardioTimeLeft > 0) {
      const mins = Math.floor(cardioTimeLeft / 60);
      const secs = (cardioTimeLeft % 60).toString().padStart(2, '0');
      document.title = `🏃 (${mins}:${secs}) Cardio — GymFit Pro`;
    } else if (workoutActive) {
      document.title = `🏋️ Entrenando — GymFit Pro`;
    } else {
      document.title = 'GymFit Pro — Burn & Tone';
    }
  }, [timerRunning, timerLeft, cardioTimerRunning, cardioTimeLeft, workoutActive]);

  // Active workout timer con precisión timestamp
  useEffect(() => {
    if (workoutActive && workoutPhase !== 'victory') {
      workoutStartTimeRef.current = Date.now();
      workoutBaseElapsedRef.current = activeWorkoutTime;

      activeWorkoutInterval.current = window.setInterval(() => {
        if (workoutStartTimeRef.current) {
          const deltaSecs = Math.floor((Date.now() - workoutStartTimeRef.current) / 1000);
          setActiveWorkoutTime(workoutBaseElapsedRef.current + deltaSecs);
        }
      }, 1000);
    } else {
      if (activeWorkoutInterval.current) clearInterval(activeWorkoutInterval.current);
    }
    return () => {
      if (activeWorkoutInterval.current) clearInterval(activeWorkoutInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workoutActive, workoutPhase]);

  // Rest timer con timestamp delta (precisión 100% en segundo plano al cambiar a Spotify/YouTube)
  useEffect(() => {
    if (timerRunning && timerLeft > 0) {
      if (!timerEndTimeRef.current) {
        timerEndTimeRef.current = Date.now() + timerLeft * 1000;
      }

      const checkTimer = () => {
        if (!timerEndTimeRef.current) return;
        const remaining = Math.max(0, Math.ceil((timerEndTimeRef.current - Date.now()) / 1000));
        setTimerLeft(remaining);

        if (remaining <= 0) {
          timerEndTimeRef.current = null;
          showNotification('Descanso finalizado! Alístate para la siguiente serie.');
          sendBrowserNotification('⏰ ¡Descanso Finalizado!', 'Es hora de iniciar tu siguiente serie.');
          if (soundEnabled) playSound(soundType);
          haptics.warning();
          setTimerRunning(false);
          if (timerInterval.current) clearInterval(timerInterval.current);
        }
      };

      timerInterval.current = window.setInterval(checkTimer, 500);

      const handleVisibility = () => {
        if (document.visibilityState === 'visible') {
          checkTimer();
        }
      };
      document.addEventListener('visibilitychange', handleVisibility);

      return () => {
        if (timerInterval.current) clearInterval(timerInterval.current);
        document.removeEventListener('visibilitychange', handleVisibility);
      };
    } else {
      timerEndTimeRef.current = null;
      if (timerInterval.current) clearInterval(timerInterval.current);
    }
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerRunning, showNotification, soundEnabled, soundType, playSound, haptics]);

  // Cardio timer con timestamp delta
  useEffect(() => {
    if (cardioTimerRunning && cardioTimeLeft > 0) {
      if (!cardioEndTimeRef.current) {
        cardioEndTimeRef.current = Date.now() + cardioTimeLeft * 1000;
      }

      const checkCardio = () => {
        if (!cardioEndTimeRef.current) return;
        const remaining = Math.max(0, Math.ceil((cardioEndTimeRef.current - Date.now()) / 1000));
        setCardioTimeLeft(remaining);

        if (remaining <= 0) {
          cardioEndTimeRef.current = null;
          showNotification('Felicidades! Completaste tus 30 minutos de cardio post-pesas.');
          sendBrowserNotification('🔥 ¡Cardio Completado!', 'Completaste 30 minutos de cardio. ¡Gran trabajo!');
          if (soundEnabled) playSound(soundType);
          haptics.success();
          setCardioTimerRunning(false);
          if (cardioTimerInterval.current) clearInterval(cardioTimerInterval.current);
        }
      };

      cardioTimerInterval.current = window.setInterval(checkCardio, 500);

      const handleVisibility = () => {
        if (document.visibilityState === 'visible') {
          checkCardio();
        }
      };
      document.addEventListener('visibilitychange', handleVisibility);

      return () => {
        if (cardioTimerInterval.current) clearInterval(cardioTimerInterval.current);
        document.removeEventListener('visibilitychange', handleVisibility);
      };
    } else {
      cardioEndTimeRef.current = null;
      if (cardioTimerInterval.current) clearInterval(cardioTimerInterval.current);
    }
    return () => {
      if (cardioTimerInterval.current) clearInterval(cardioTimerInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardioTimerRunning, showNotification, soundEnabled, soundType, playSound, haptics]);

  const startWorkout = useCallback(
    (dayIndex: number) => {
      const routineSource: RoutineDay[] =
        selectedRoutineType === 'fullbody'
          ? ROUTINE_FULLBODY
          : selectedRoutineType === 'ppl'
          ? ROUTINE_PPL
          : selectedRoutineType === 'upper-lower'
          ? ROUTINE_UPPER_LOWER
          : selectedRoutineType === 'ppl-upper'
          ? ROUTINE_PPL_UPPER
          : selectedRoutineType === 'bro-split'
          ? ROUTINE_BRO_SPLIT
          : selectedWeek === 'A'
          ? ROUTINE_WEEK_A
          : ROUTINE_WEEK_B;

      const editedSource = applyOverrides(routineSource, routineOverrides, selectedRoutineType, selectedWeek);
      const targetDay = editedSource[Math.min(dayIndex, editedSource.length - 1)];

      const exercisesProgress = targetDay.exercises.map(ex => ({
        id: ex.id,
        name: ex.name,
        alternativeName: ex.alternativeName,
        target: ex.target,
        machineBase: ex.machineBase ?? 0,
        machineType: ex.machineType,
        sets: Array.from({ length: ex.setsCount }, (_, i) => ({
          setNumber: i + 1,
          weight: customWeights[ex.id] || ex.defaultWeight,
          reps: ex.defaultReps,
          completed: false,
          rpe: 8,
        })),
      }));

      const weekLabel =
        selectedRoutineType === 'fullbody'
          ? 'Full Body'
          : selectedRoutineType === 'ppl'
          ? 'PPL'
          : selectedRoutineType === 'upper-lower'
          ? 'Upper/Lower'
          : selectedRoutineType === 'ppl-upper'
          ? 'PPL+Upper'
          : selectedRoutineType === 'bro-split'
          ? 'Bro Split'
          : `Semana ${selectedWeek}`;

      setCurrentWorkout({
        week: weekLabel,
        dayIndex,
        title: `${weekLabel} • ${targetDay.title}`,
        exercises: exercisesProgress,
      });

      setCompletedWarmupSteps({});
      setSwappedExercises({});
      setActiveWorkoutTime(0);
      setWorkoutPhase('warmup');
      setCardioTimeLeft(1800);
      setCardioTimerRunning(false);
      setWorkoutActive(true);
      setActiveTab('entrenar');
      showNotification('Rutina iniciada! Comienza con el calentamiento previo.');
      if (soundEnabled) playSound(soundType);
    },
    [
      selectedRoutineType,
      selectedWeek,
      customWeights,
      routineOverrides,
      soundEnabled,
      soundType,
      playSound,
      showNotification,
      setActiveTab,
    ]
  );

  const proceedToLifting = useCallback(() => {
    setWorkoutPhase('lifting');
    showNotification('Calentamiento listo. A entrenar en las máquinas!');
  }, [showNotification]);

  const proceedToCardio = useCallback(() => {
    setWorkoutPhase('cardio');
    setCardioTimerRunning(true);
    showNotification('Trabajo de fuerza finalizado! Es hora de los 30 minutos de cardio.');
  }, [showNotification]);

  const finishWorkout = useCallback(
    (notes: string = '') => {
      if (!currentWorkout) return;
      let totalVolume = 0;
      let completedExercisesCount = 0;
      const exercisesData: { id: string; name: string; sets: { weight: number; reps: number; completed: boolean; rpe: number }[] }[] = [];

      currentWorkout.exercises.forEach(ex => {
        let exCompleted = false;
        const setsData: { weight: number; reps: number; completed: boolean; rpe: number }[] = [];
        ex.sets.forEach(set => {
          if (set.completed) {
            totalVolume += set.weight * set.reps;
            exCompleted = true;
          }
          setsData.push({ weight: set.weight, reps: set.reps, completed: set.completed, rpe: set.rpe });
        });
        if (exCompleted) completedExercisesCount++;
        exercisesData.push({ id: ex.id, name: ex.name, sets: setsData });
      });

      const minutesTotal = Math.round(activeWorkoutTime / 60);
      const newHistoryItem: HistoryItem = {
        id: `h-${Date.now()}`,
        date: formatDate(),
        dayTitle: currentWorkout.title,
        duration: `${minutesTotal} min`,
        completedExercises: completedExercisesCount,
        totalVolume,
        weight: userWeight,
        cardioCompleted: true,
        notes: notes || undefined,
        exercises: exercisesData,
      };

      const minutesOfCardio = Math.round((1800 - cardioTimeLeft) / 60);
      if (minutesOfCardio > 0) {
        const estimatedCalories = Math.round(minutesOfCardio * 9);
        setCardioSessions(prev => [
          {
            id: `c-${Date.now()}`,
            date: formatDate(),
            type: selectedCardioType,
            duration: minutesOfCardio,
            calories: estimatedCalories,
          },
          ...prev,
        ]);
      }

      setHistory(prev => [newHistoryItem, ...prev]);

      const updatedHistory = [newHistoryItem, ...history];
      const suggestions = calculateProgressionSuggestions(currentWorkout, updatedHistory);
      if (suggestions.length > 0) {
        suggestions.forEach(s => {
          showNotification(`📈 ${s.exerciseName}: Sube a ${s.suggestedWeight}kg (${s.reason})`);
        });
      }

      setWorkoutPhase('victory');
      showNotification('Felicidades! Entrenamiento de 3 fases completado.');
    },
    [
      currentWorkout,
      activeWorkoutTime,
      cardioTimeLeft,
      selectedCardioType,
      userWeight,
      history,
      showNotification,
      setCardioSessions,
      setHistory,
    ]
  );

  const cancelWorkout = useCallback(() => {
    if (confirm('¿Estás seguro de que deseas abandonar este entrenamiento? Se perderán las marcas de hoy.')) {
      setWorkoutActive(false);
      setCurrentWorkout(null);
      setTimerRunning(false);
      setCardioTimerRunning(false);
      setTimerLeft(0);
      setActiveTab('rutinas');
    }
  }, [setActiveTab]);

  const toggleSwapExercise = useCallback((exId: string) => {
    setSwappedExercises(prev => ({ ...prev, [exId]: !prev[exId] }));
  }, []);

  const handleRpeChange = useCallback(
    (exerciseId: string, setIdx: number, newRpe: number) => {
      if (!currentWorkout) return;
      setCurrentWorkout(prev =>
        prev
          ? {
              ...prev,
              exercises: prev.exercises.map(ex =>
                ex.id === exerciseId
                  ? { ...ex, sets: ex.sets.map((s, i) => (i === setIdx ? { ...s, rpe: newRpe } : s)) }
                  : ex
              ),
            }
          : prev
      );
    },
    [currentWorkout]
  );

  const toggleWarmupStep = useCallback((stepId: string) => {
    setCompletedWarmupSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  }, []);

  const updateSetValues = useCallback(
    (exerciseId: string, setIdx: number, field: 'weight' | 'reps', delta: number) => {
      if (!currentWorkout) return;
      setCurrentWorkout(prev => {
        if (!prev) return prev;
        const updatedExercises = prev.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return {
              ...ex,
              sets: ex.sets.map((set, sIdx) => {
                if (sIdx === setIdx) {
                  const newValue = Math.max(0, parseInt(String(set[field])) + delta);
                  return { ...set, [field]: newValue };
                }
                return set;
              }),
            };
          }
          return ex;
        });
        if (field === 'weight') {
          const changedEx = updatedExercises.find(e => e.id === exerciseId);
          if (changedEx) {
            const newWeight = changedEx.sets[setIdx].weight;
            setCustomWeights(prevWeight => ({ ...prevWeight, [exerciseId]: newWeight }));
          }
        }
        return { ...prev, exercises: updatedExercises };
      });
    },
    [currentWorkout, setCustomWeights]
  );

  const toggleSetCompleted = useCallback(
    (exerciseId: string, setIdx: number) => {
      if (!currentWorkout) return;
      let startedTimer = false;
      setCurrentWorkout(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          exercises: prev.exercises.map(ex => {
            if (ex.id === exerciseId) {
              return {
                ...ex,
                sets: ex.sets.map((set, sIdx) => {
                  if (sIdx === setIdx) {
                    const nextCompleted = !set.completed;
                    if (nextCompleted) startedTimer = true;
                    return { ...set, completed: nextCompleted };
                  }
                  return set;
                }),
              };
            }
            return ex;
          }),
        };
      });
      if (startedTimer) {
        setTimerLeft(timerTotal);
        setInitialTimerLeft(timerTotal);
        setTimerRunning(true);
        haptics.success();
      } else {
        haptics.light();
      }
    },
    [currentWorkout, timerTotal, haptics]
  );

  return {
    workoutActive,
    workoutPhase,
    currentWorkout,
    swappedExercises,
    completedWarmupSteps,
    activeWorkoutTime,
    timerLeft,
    initialTimerLeft,
    timerRunning,
    cardioTimeLeft,
    cardioTimerRunning,
    selectedCardioType,
    setTimerRunning,
    setTimerLeft,
    setCardioTimerRunning,
    setSelectedCardioType,
    startWorkout,
    proceedToLifting,
    proceedToCardio,
    finishWorkout,
    cancelWorkout,
    toggleSwapExercise,
    handleRpeChange,
    toggleWarmupStep,
    updateSetValues,
    toggleSetCompleted,
  };
}
