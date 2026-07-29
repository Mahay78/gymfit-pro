import { useState, useEffect, useRef, useCallback } from 'react';
import type { TabId, WorkoutPhase, Workout, HistoryItem, BodyMeasurement, CardioSession, MachineType, RoutineType, AbWeek, RoutineDay } from './types';
import { ROUTINE_WEEK_A, ROUTINE_WEEK_B } from './data/routines';
import { ROUTINE_FULLBODY } from './data/fullbody';
import { ROUTINE_PPL } from './data/ppl';
import { ROUTINE_UPPER_LOWER } from './data/upperLower';
import { ROUTINE_PPL_UPPER } from './data/pplUpper';
import { ROUTINE_BRO_SPLIT } from './data/broSplit';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { useHaptics } from './hooks/useHaptics';
import { useImageOverrides } from './hooks/useImageOverrides';
import { safeClear, safeGetItem, safeSetItem } from './utils/storage';
import { formatDate } from './utils/format';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { NotificationBanner } from './components/NotificationBanner';
import { RoutineView } from './components/RoutineView';
import { WorkoutSession } from './components/WorkoutSession';
import { NutritionTab } from './components/NutritionTab';
import { ProgressTab } from './components/ProgressTab';
import { SettingsTab } from './components/SettingsTab';
import { MachineModal } from './components/MachineModal';
import { PlateCalculator } from './components/PlateCalculator';
import { Onboarding } from './components/Onboarding';
import { UpdatePrompt } from './components/UpdatePrompt';

export default function App() {
  const isOnline = useNetworkStatus();
  const { isInstallable, installApp, dismissPrompt } = usePWAInstall();
  const [theme, cycleTheme] = useTheme();
  const [showOnboarding, setShowOnboarding] = useState(() => !safeGetItem('gymfit_pro_onboarded', false));

  const [activeTab, setActiveTab] = useState<TabId>('rutinas');
  const [selectedRoutineType, setSelectedRoutineType] = useState<RoutineType>('fullbody');
  const [selectedWeek, setSelectedWeek] = useState<AbWeek>('A');
  const [selectedDay, setSelectedDay] = useState(0);

  const [workoutActive, setWorkoutActive] = useState(false);
  const [workoutPhase, setWorkoutPhase] = useState<WorkoutPhase>('warmup');
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [swappedExercises, setSwappedExercises] = useState<Record<string, boolean>>({});
  const [activeMachineType, setActiveMachineType] = useState<MachineType | null>(null);

  const [customWeights, setCustomWeights] = useLocalStorage<Record<string, number>>('gymfit_pro_customWeights', {});
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('gymfit_pro_history_v2', []);

  const [bodyMeasurements, setBodyMeasurements] = useLocalStorage<BodyMeasurement[]>('gymfit_pro_measurements', []);

  const [dailyWater, setDailyWater] = useLocalStorage<number>('gymfit_pro_dailyWater', 0);
  const [dailyProtein, setDailyProtein] = useLocalStorage<number>('gymfit_pro_dailyProtein', 0);

  const [cardioSessions, setCardioSessions] = useLocalStorage<CardioSession[]>('gymfit_pro_cardioSessions', []);

  const [userWeight, setUserWeight] = useLocalStorage<number>('gymfit_pro_userWeight', 80);
  const [startWeight, setStartWeight] = useLocalStorage<number>('gymfit_pro_startWeight', 80);
  const [goalWeight, setGoalWeight] = useLocalStorage<number>('gymfit_pro_goalWeight', 75);

  const [timerTotal, setTimerTotal] = useState(90);
  const [timerLeft, setTimerLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [initialTimerLeft, setInitialTimerLeft] = useState(90);
  const [cardioTimeLeft, setCardioTimeLeft] = useState(1800);
  const [cardioTimerRunning, setCardioTimerRunning] = useState(false);
  const [selectedCardioType, setSelectedCardioType] = useState("Cinta Inclinada (LISS)");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(() => safeGetItem('gymfit_pro_haptics', true));
  const haptics = useHaptics(hapticsEnabled);
  const { resetAll: resetAllImages } = useImageOverrides();
  const [soundType, setSoundType] = useState('chime');

  const [activePlateCalculator, setActivePlateCalculator] = useState<{ id: string; name: string; machineBase: number } | null>(null);
  const [notifications, setNotifications] = useState<{ id: number; message: string }[]>([]);
  const [activeWorkoutTime, setActiveWorkoutTime] = useState(0);

  const [completedWarmupSteps, setCompletedWarmupSteps] = useState<Record<string, boolean>>({});
  const [userHeight, setUserHeight] = useState(175);
  const [userAge, setUserAge] = useState(28);
  const [userGender, setUserGender] = useState('male');
  const [userActivity, setUserActivity] = useState(1.375);
  const [tdee, setTdee] = useState(2300);
  const [deficitCalories, setDeficitCalories] = useState(1800);

  const [newWeightInput, setNewWeightInput] = useState('80');
  const [newWaist, setNewWaist] = useState('');
  const [newHips, setNewHips] = useState('');
  const [newChest, setNewChest] = useState('');
  const [newThigh, setNewThigh] = useState('');

  const activeWorkoutInterval = useRef<number | null>(null);
  const timerInterval = useRef<number | null>(null);
  const cardioTimerInterval = useRef<number | null>(null);

  const proteinGoal = Math.round(userWeight * 2);

  // Initialize default weights for all exercises
  useEffect(() => {
    const initialWeights = { ...customWeights };
    let changed = false;
    [...ROUTINE_WEEK_A, ...ROUTINE_WEEK_B, ...ROUTINE_FULLBODY, ...ROUTINE_PPL, ...ROUTINE_UPPER_LOWER, ...ROUTINE_PPL_UPPER, ...ROUTINE_BRO_SPLIT].forEach(day => {
      day.exercises.forEach(ex => {
        if (initialWeights[ex.id] === undefined) {
          initialWeights[ex.id] = ex.defaultWeight;
          changed = true;
        }
      });
    });
    if (changed) setCustomWeights(initialWeights);
  }, []);

  useEffect(() => { safeSetItem('gymfit_pro_haptics', hapticsEnabled); }, [hapticsEnabled]);

  // Calculate TDEE
  useEffect(() => {
    const weight = parseFloat(String(userWeight)) || 80;
    const height = userHeight || 175;
    const age = userAge || 28;
    let bmr = userGender === 'male'
      ? (10 * weight) + (6.25 * height) - (5 * age) + 5
      : (10 * weight) + (6.25 * height) - (5 * age) - 161;
    const calculatedTdee = Math.round(bmr * (parseFloat(String(userActivity)) || 1.375));
    setTdee(calculatedTdee);
    setDeficitCalories(Math.round(calculatedTdee * 0.8));
  }, [userWeight, userHeight, userAge, userGender, userActivity]);

  // Active workout timer
  useEffect(() => {
    if (workoutActive && workoutPhase !== 'victory') {
      activeWorkoutInterval.current = window.setInterval(() => {
        setActiveWorkoutTime(prev => prev + 1);
      }, 1000);
    } else {
      if (activeWorkoutInterval.current) clearInterval(activeWorkoutInterval.current);
    }
    return () => { if (activeWorkoutInterval.current) clearInterval(activeWorkoutInterval.current); };
  }, [workoutActive, workoutPhase]);

  // Rest timer
  useEffect(() => {
    if (timerRunning && timerLeft > 0) {
      timerInterval.current = window.setInterval(() => {
        setTimerLeft(prev => {
          if (prev <= 1) {
            showNotification("Descanso finalizado! Alístate para la siguiente serie.");
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerInterval.current) clearInterval(timerInterval.current);
    }
    return () => { if (timerInterval.current) clearInterval(timerInterval.current); };
  }, [timerRunning, timerLeft]);

  // Cardio timer
  useEffect(() => {
    if (cardioTimerRunning && cardioTimeLeft > 0) {
      cardioTimerInterval.current = window.setInterval(() => {
        setCardioTimeLeft(prev => {
          if (prev <= 1) {
            showNotification("Felicidades! Completaste tus 30 minutos de cardio post-pesas. Gran trabajo!");
            setCardioTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (cardioTimerInterval.current) clearInterval(cardioTimerInterval.current);
    }
    return () => { if (cardioTimerInterval.current) clearInterval(cardioTimerInterval.current); };
  }, [cardioTimerRunning, cardioTimeLeft]);

  const playSynthesizedSound = useCallback((typeToPlay: string) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playBeep = (freq: number, duration: number, delay: number = 0) => {
        setTimeout(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + duration);
        }, delay);
      };
      if (typeToPlay === 'classic') playBeep(880, 0.4, 0);
      else if (typeToPlay === 'chime') {
        playBeep(523.25, 0.25, 0);
        playBeep(659.25, 0.25, 120);
        playBeep(783.99, 0.25, 240);
        playBeep(1046.50, 0.4, 360);
      } else if (typeToPlay === 'digital') {
        playBeep(987.77, 0.15, 0);
        playBeep(987.77, 0.15, 180);
      }
    } catch { /* AudioContext not supported */ }
  }, []);

  const showNotification = useCallback((message: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  }, []);

  const startWorkout = useCallback((dayIndex: number) => {
    const routineSource: RoutineDay[] =
      selectedRoutineType === 'fullbody' ? ROUTINE_FULLBODY
      : selectedRoutineType === 'ppl' ? ROUTINE_PPL
      : selectedRoutineType === 'upper-lower' ? ROUTINE_UPPER_LOWER
      : selectedRoutineType === 'ppl-upper' ? ROUTINE_PPL_UPPER
      : selectedRoutineType === 'bro-split' ? ROUTINE_BRO_SPLIT
      : selectedWeek === 'A' ? ROUTINE_WEEK_A
      : ROUTINE_WEEK_B;
    const targetDay = routineSource[Math.min(dayIndex, routineSource.length - 1)];
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
    const weekLabel = selectedRoutineType === 'fullbody' ? 'Full Body'
      : selectedRoutineType === 'ppl' ? 'PPL'
      : selectedRoutineType === 'upper-lower' ? 'Upper/Lower'
      : selectedRoutineType === 'ppl-upper' ? 'PPL+Upper'
      : selectedRoutineType === 'bro-split' ? 'Bro Split'
      : `Semana ${selectedWeek}`;
    setCurrentWorkout({
      week: weekLabel,
      dayIndex,
      title: `${weekLabel} • ${targetDay.title}`,
      exercises: exercisesProgress,
    });
    setCompletedWarmupSteps({});
    setSwappedExercises({});
    setWorkoutPhase('warmup');
    setCardioTimeLeft(1800);
    setCardioTimerRunning(false);
    setWorkoutActive(true);
    setActiveTab('entrenar');
    showNotification('Rutina iniciada! Comienza con el calentamiento previo.');
    if (soundEnabled) playSynthesizedSound(soundType);
  }, [selectedRoutineType, selectedWeek, customWeights, soundEnabled, soundType, playSynthesizedSound, showNotification]);

  const proceedToLifting = useCallback(() => {
    setWorkoutPhase('lifting');
    showNotification('Calentamiento listo. A entrenar en las máquinas!');
  }, [showNotification]);

  const proceedToCardio = useCallback(() => {
    setWorkoutPhase('cardio');
    setCardioTimerRunning(true);
    showNotification('Trabajo de fuerza finalizado! Es hora de los 30 minutos de cardio.');
  }, [showNotification]);

  const finishWorkout = useCallback((notes: string = '') => {
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
      setCardioSessions(prev => [{
        id: `c-${Date.now()}`,
        date: formatDate(),
        type: selectedCardioType,
        duration: minutesOfCardio,
        calories: estimatedCalories,
      }, ...prev]);
    }
    setHistory([newHistoryItem, ...history]);
    setWorkoutPhase('victory');
    showNotification('Felicidades! Entrenamiento de 3 fases completado.');
  }, [currentWorkout, activeWorkoutTime, cardioTimeLeft, selectedCardioType, userWeight, history, showNotification]);

  const cancelWorkout = useCallback(() => {
    if (confirm("Estas seguro de que deseas abandonar este entrenamiento? Se perderan las marcas de hoy.")) {
      setWorkoutActive(false);
      setCurrentWorkout(null);
      setTimerRunning(false);
      setCardioTimerRunning(false);
      setTimerLeft(0);
      setActiveTab('rutinas');
    }
  }, []);

  const toggleSwapExercise = useCallback((exId: string) => {
    setSwappedExercises(prev => ({ ...prev, [exId]: !prev[exId] }));
  }, []);

  const handleRpeChange = useCallback((exerciseId: string, setIdx: number, newRpe: number) => {
    if (!currentWorkout) return;
    setCurrentWorkout(prev => prev ? {
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, sets: ex.sets.map((s, i) => i === setIdx ? { ...s, rpe: newRpe } : s) } : ex
      ),
    } : prev);
  }, [currentWorkout]);

  const toggleWarmupStep = useCallback((stepId: string) => {
    setCompletedWarmupSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  }, []);

  const updateSetValues = useCallback((exerciseId: string, setIdx: number, field: 'weight' | 'reps', delta: number) => {
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
          setCustomWeights(prev => ({ ...prev, [exerciseId]: newWeight }));
        }
      }
      return { ...prev, exercises: updatedExercises };
    });
  }, [currentWorkout]);

  const toggleSetCompleted = useCallback((exerciseId: string, setIdx: number) => {
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
  }, [currentWorkout, timerTotal]);

  const handleOpenPlateCalculator = useCallback((ex: { id: string; name: string; machineBase: number }) => {
    setActivePlateCalculator(ex);
  }, []);

  const handleAddMeasurement = useCallback(() => {
    if (!newWaist && !newHips && !newChest && !newThigh) return;
    const newRecord: BodyMeasurement = {
      date: formatDate(),
      waist: parseFloat(newWaist) || 0,
      hips: parseFloat(newHips) || 0,
      chest: parseFloat(newChest) || 0,
      thigh: parseFloat(newThigh) || 0,
    };
    setBodyMeasurements([newRecord, ...bodyMeasurements]);
    setNewWaist('');
    setNewHips('');
    setNewChest('');
    setNewThigh('');
    showNotification("Mediciones corporales guardadas!");
  }, [newWaist, newHips, newChest, newThigh, bodyMeasurements, showNotification]);

  const handleDeleteMeasurement = useCallback((index: number) => {
    setBodyMeasurements(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddWeight = useCallback(() => {
    const val = parseFloat(newWeightInput);
    if (!isNaN(val) && val > 0) {
      setUserWeight(val);
      if (startWeight === 80 && val !== 80) setStartWeight(val);
      showNotification(`Peso corporal actualizado a ${val} kg`);
      setNewWeightInput('');
    }
  }, [newWeightInput, showNotification, startWeight, setStartWeight]);

  const handleDeleteCardioSession = useCallback((id: string) => {
    setCardioSessions(prev => prev.filter(c => c.id !== id));
  }, []);

  const handleResetAll = useCallback(() => {
    safeClear();
    setHistory([]);
    setCardioSessions([]);
    setBodyMeasurements([]);
    setDailyWater(0);
    setDailyProtein(0);
    setCustomWeights({});
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased text-left">
      {isInstallable && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-50 p-4 shadow-xl flex items-center justify-between gap-3 animate-slideUp">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="bg-slate-950/20 w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              📲
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm">Instalar GymFit Pro</p>
              <p className="text-xs text-emerald-100 font-medium truncate">Funciona offline • Acceso directo</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={dismissPrompt}
              className="px-2.5 py-1.5 text-[11px] font-bold text-emerald-100 hover:text-white active:scale-95"
            >
              No
            </button>
            <button
              onClick={installApp}
              className="px-4 py-2 bg-slate-950 text-emerald-400 font-black text-xs rounded-xl shadow-md active:scale-95 min-h-[36px]"
            >
              Instalar
            </button>
          </div>
        </div>
      )}

      <NotificationBanner notifications={notifications} onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} />

      <Header isOnline={isOnline} workoutActive={workoutActive} workoutPhase={workoutPhase} activeWorkoutTime={activeWorkoutTime} />

      <main className="flex-grow max-w-5xl w-full mx-auto p-4 pb-28">
        {activeTab === 'rutinas' && (
          <RoutineView
            selectedRoutineType={selectedRoutineType}
            selectedWeek={selectedWeek}
            selectedDay={selectedDay}
            customWeights={customWeights}
            workoutActive={workoutActive}
            onSelectRoutineType={setSelectedRoutineType}
            onSelectWeek={setSelectedWeek}
            onSelectDay={setSelectedDay}
            onStartWorkout={startWorkout}
            onShowMachine={(type) => setActiveMachineType(type as MachineType)}
            onShowNotification={showNotification}
            onSetActiveTab={(tab) => setActiveTab(tab as TabId)}
          />
        )}

        {activeTab === 'entrenar' && (
          <WorkoutSession
            workout={currentWorkout}
            workoutActive={workoutActive}
            workoutPhase={workoutPhase}
            activeWorkoutTime={activeWorkoutTime}
            timerLeft={timerLeft}
            initialTimerLeft={initialTimerLeft}
            timerRunning={timerRunning}
            timerTotal={timerTotal}
            cardioTimeLeft={cardioTimeLeft}
            cardioTimerRunning={cardioTimerRunning}
            completedWarmupSteps={completedWarmupSteps}
            swappedExercises={swappedExercises}
            dailyWater={dailyWater}
            selectedCardioType={selectedCardioType}
            soundEnabled={soundEnabled}
            soundType={soundType}
            history={history}
            onProceedToLifting={proceedToLifting}
            onProceedToCardio={proceedToCardio}
            onFinishWorkout={finishWorkout}
            onCancelWorkout={cancelWorkout}
            onToggleWarmupStep={toggleWarmupStep}
            onToggleSetCompleted={toggleSetCompleted}
            onToggleSwapExercise={toggleSwapExercise}
            onUpdateSetValues={updateSetValues}
            onHandleRpeChange={handleRpeChange}
            onSetTimerRunning={setTimerRunning}
            onSetTimerLeft={setTimerLeft}
            onSetCardioTimerRunning={setCardioTimerRunning}
            onSetSelectedCardioType={setSelectedCardioType}
            onDailyWaterChange={setDailyWater}
            onOpenPlateCalculator={handleOpenPlateCalculator}
            onShowMachine={(type) => setActiveMachineType(type as MachineType)}
            onShowNotification={showNotification}
          />
        )}

        {activeTab === 'deficit' && (
          <NutritionTab
            userWeight={userWeight}
            userHeight={userHeight}
            userAge={userAge}
            userGender={userGender}
            userActivity={userActivity}
            tdee={tdee}
            deficitCalories={deficitCalories}
            dailyProtein={dailyProtein}
            dailyWater={dailyWater}
            cardioSessions={cardioSessions}
            proteinGoal={proteinGoal}
            onUserWeightChange={setUserWeight}
            onUserHeightChange={setUserHeight}
            onUserAgeChange={setUserAge}
            onUserGenderChange={setUserGender}
            onUserActivityChange={setUserActivity}
            onDailyProteinChange={setDailyProtein}
            onDailyWaterChange={setDailyWater}
            onDeleteCardioSession={handleDeleteCardioSession}
            onShowNotification={showNotification}
          />
        )}

        {activeTab === 'progreso' && (
          <ProgressTab
            userWeight={userWeight}
            startWeight={startWeight}
            goalWeight={goalWeight}
            history={history}
            bodyMeasurements={bodyMeasurements}
            cardioSessions={cardioSessions}
            customWeights={customWeights}
            newWeightInput={newWeightInput}
            newWaist={newWaist}
            newHips={newHips}
            newChest={newChest}
            newThigh={newThigh}
            onWeightInputChange={setNewWeightInput}
            onAddWeight={handleAddWeight}
            onGoalWeightChange={setGoalWeight}
            onWaistChange={setNewWaist}
            onHipsChange={setNewHips}
            onChestChange={setNewChest}
            onThighChange={setNewThigh}
            onAddMeasurement={handleAddMeasurement}
            onDeleteMeasurement={handleDeleteMeasurement}
            onShowNotification={showNotification}
            onStartWorkout={() => { setActiveTab('entrenar'); if (!workoutActive) startWorkout(selectedDay); }}
          />
        )}

        {activeTab === 'ajustes' && (
          <SettingsTab
            soundEnabled={soundEnabled}
            soundType={soundType}
            timerTotal={timerTotal}
            hapticsEnabled={hapticsEnabled}
            theme={theme}
            onSoundToggle={() => setSoundEnabled(!soundEnabled)}
            onSoundTypeChange={setSoundType}
            onTimerTotalChange={setTimerTotal}
            onHapticsToggle={() => setHapticsEnabled(!hapticsEnabled)}
            onThemeCycle={cycleTheme}
            onPlaySound={playSynthesizedSound}
            onResetAll={handleResetAll}
            onResetAllImages={resetAllImages}
            onShowNotification={showNotification}
          />
        )}
      </main>

      {showOnboarding && (
        <Onboarding onComplete={() => { safeSetItem('gymfit_pro_onboarded', true); setShowOnboarding(false); }} />
      )}

      <UpdatePrompt />

      {activeMachineType && (
        <MachineModal machineType={activeMachineType} onClose={() => setActiveMachineType(null)} />
      )}

      {activePlateCalculator && (
        <PlateCalculator
          exercise={activePlateCalculator}
          customWeights={customWeights}
          onApply={(id, weight) => {
            setCustomWeights(prev => ({ ...prev, [id]: weight }));
            if (currentWorkout) {
              setCurrentWorkout(prev => prev ? {
                ...prev,
                exercises: prev.exercises.map(ex =>
                  ex.id === id ? { ...ex, sets: ex.sets.map(s => s.completed ? s : { ...s, weight }) } : ex
                ),
              } : prev);
            }
          }}
          onClose={() => setActivePlateCalculator(null)}
            onShowNotification={showNotification}
            onShowMachine={(type) => setActiveMachineType(type as MachineType)}
          />
        )}

      <Navigation activeTab={activeTab} workoutActive={workoutActive} onTabChange={setActiveTab} />
    </div>
  );
}
