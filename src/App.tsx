import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import type { TabId, MachineType, RoutineType, AbWeek, BodyMeasurement } from './types';
import { ROUTINE_WEEK_A, ROUTINE_WEEK_B } from './data/routines';
import { ROUTINE_FULLBODY } from './data/fullbody';
import { ROUTINE_PPL } from './data/ppl';
import { ROUTINE_UPPER_LOWER } from './data/upperLower';
import { ROUTINE_PPL_UPPER } from './data/pplUpper';
import { ROUTINE_BRO_SPLIT } from './data/broSplit';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { usePWAInstall } from './hooks/usePWAInstall';
import {
  useCustomWeights,
  useHistory,
  useBodyMeasurements,
  useCardioSessions,
  useUserProfile,
  useRoutineOverrides,
} from './hooks/useIndexedDB';
import { migrateFromLocalStorage, db } from './utils/db';
import { useTheme } from './hooks/useTheme';
import { useAccent } from './hooks/useAccent';
import { useHaptics } from './hooks/useHaptics';
import { useImageOverrides } from './hooks/useImageOverrides';
import { useSoundEffects } from './hooks/useSoundEffects';
import { useNotificationBanner } from './hooks/useNotificationBanner';
import { useNutritionCalculator } from './hooks/useNutritionCalculator';
import { useWorkoutSessionState } from './hooks/useWorkoutSessionState';
import { useWakeLock } from './hooks/useWakeLock';
import { safeClear } from './utils/storage';
import { formatDate } from './utils/format';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { NotificationBanner } from './components/NotificationBanner';
import { MachineModal } from './components/MachineModal';
import { PlateCalculator } from './components/PlateCalculator';
import { OneRepMaxModal } from './components/OneRepMaxModal';
import { WarmupModal } from './components/WarmupModal';
import { Onboarding } from './components/Onboarding';
import { UpdatePrompt } from './components/UpdatePrompt';

const RoutineView = lazy(() => import('./components/RoutineView').then(m => ({ default: m.RoutineView })));
const WorkoutSession = lazy(() => import('./components/WorkoutSession').then(m => ({ default: m.WorkoutSession })));
const NutritionTab = lazy(() => import('./components/NutritionTab').then(m => ({ default: m.NutritionTab })));
const ProgressTab = lazy(() => import('./components/ProgressTab').then(m => ({ default: m.ProgressTab })));
const SettingsTab = lazy(() => import('./components/SettingsTab').then(m => ({ default: m.SettingsTab })));

function TabLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-fadeIn" role="status" aria-label="Cargando pestaña">
      <div className="h-8 bg-slate-800/50 rounded-xl animate-pulse w-3/4" />
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-slate-800/50 rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-slate-800/50 rounded-3xl animate-pulse" />
    </div>
  );
}

export default function App() {
  const isOnline = useNetworkStatus();
  const { isInstallable, installApp, dismissPrompt } = usePWAInstall();
  const [theme, cycleTheme] = useTheme();
  const [accent, setAccent] = useAccent();

  const [routineOverrides, setRoutineOverrides] = useRoutineOverrides();
  const [customWeights, setCustomWeights] = useCustomWeights();
  const [history, setHistory] = useHistory();
  const [bodyMeasurements, setBodyMeasurements] = useBodyMeasurements();
  const [cardioSessions, setCardioSessions] = useCardioSessions();
  const [profile, updateProfile, profileLoaded] = useUserProfile();
  const [dismissedOnboarding, setDismissedOnboarding] = useState(false);

  const showOnboarding = profileLoaded && !profile?.onboarded && !dismissedOnboarding;
  const [activeTab, setActiveTab] = useState<TabId>('rutinas');
  const [selectedRoutineType, setSelectedRoutineType] = useState<RoutineType>('fullbody');
  const [selectedWeek, setSelectedWeek] = useState<AbWeek>('A');
  const [selectedDay, setSelectedDay] = useState(0);

  const [activeMachineType, setActiveMachineType] = useState<MachineType | null>(null);
  const [activePlateCalculator, setActivePlateCalculator] = useState<{ id: string; name: string; machineBase: number } | null>(null);
  const [active1RMData, setActive1RMData] = useState<{ name?: string; weight?: number } | null>(null);
  const [activeWarmupData, setActiveWarmupData] = useState<{ name: string; weight: number; machineBase?: number } | null>(null);

  const soundEnabled = profile?.soundEnabled ?? true;
  const soundType = profile?.soundType ?? 'chime';
  const timerTotal = profile?.timerTotal ?? 90;
  const hapticsEnabled = profile?.hapticsEnabled ?? true;

  const haptics = useHaptics(hapticsEnabled);
  const { resetAll: resetAllImages } = useImageOverrides();
  const { playSound } = useSoundEffects();
  const { notifications, showNotification, dismissNotification } = useNotificationBanner();

  const userWeight = profile?.userWeight ?? 80;
  const startWeight = profile?.startWeight ?? 80;
  const goalWeight = profile?.goalWeight ?? 75;
  const userHeight = profile?.userHeight ?? 175;
  const userAge = profile?.userAge ?? 28;
  const userGender = profile?.userGender ?? 'male';
  const userActivity = profile?.userActivity ?? 1.375;
  const dailyWater = profile?.dailyWater ?? 0;
  const dailyProtein = profile?.dailyProtein ?? 0;

  const { tdee, deficitCalories, proteinGoal } = useNutritionCalculator({
    userWeight,
    userHeight,
    userAge,
    userGender,
    userActivity,
  });

  const workout = useWorkoutSessionState({
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
  });

  useWakeLock(workout.workoutActive);

  const [newWeightInput, setNewWeightInput] = useState('');
  const [newWaist, setNewWaist] = useState('');
  const [newHips, setNewHips] = useState('');
  const [newChest, setNewChest] = useState('');
  const [newThigh, setNewThigh] = useState('');

  // Initialize default weights for all exercises
  useEffect(() => {
    setCustomWeights(prev => {
      const updated = { ...prev };
      let changed = false;
      [
        ...ROUTINE_WEEK_A,
        ...ROUTINE_WEEK_B,
        ...ROUTINE_FULLBODY,
        ...ROUTINE_PPL,
        ...ROUTINE_UPPER_LOWER,
        ...ROUTINE_PPL_UPPER,
        ...ROUTINE_BRO_SPLIT,
      ].forEach(day => {
        day.exercises.forEach(ex => {
          if (updated[ex.id] === undefined) {
            updated[ex.id] = ex.defaultWeight;
            changed = true;
          }
        });
      });
      return changed ? updated : prev;
    });
  }, [setCustomWeights]);

  // Migrate from localStorage on first load
  useEffect(() => {
    migrateFromLocalStorage();
  }, []);

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
    showNotification('Mediciones corporales guardadas!');
  }, [newWaist, newHips, newChest, newThigh, bodyMeasurements, showNotification, setBodyMeasurements]);

  const handleDeleteMeasurement = useCallback(
    (index: number) => {
      setBodyMeasurements(prev => prev.filter((_, i) => i !== index));
    },
    [setBodyMeasurements]
  );

  const handleAddWeight = useCallback(() => {
    const val = parseFloat(newWeightInput);
    if (!isNaN(val) && val > 0) {
      updateProfile({ userWeight: val, startWeight: startWeight === 80 && val !== 80 ? val : startWeight });
      showNotification(`Peso corporal actualizado a ${val} kg`);
      setNewWeightInput('');
    }
  }, [newWeightInput, showNotification, startWeight, updateProfile]);

  const handleDeleteCardioSession = useCallback(
    (id: string) => {
      setCardioSessions(prev => prev.filter(c => c.id !== id));
    },
    [setCardioSessions]
  );

  const handleResetAll = useCallback(() => {
    safeClear();
    db.delete().then(() => {
      window.location.reload();
    });
    setHistory([]);
    setCardioSessions([]);
    setBodyMeasurements([]);
    updateProfile({ dailyWater: 0, dailyProtein: 0 });
    setCustomWeights({});
  }, [setHistory, setCardioSessions, setBodyMeasurements, updateProfile, setCustomWeights]);

  const setUserWeight = useCallback((val: number) => updateProfile({ userWeight: val }), [updateProfile]);
  const setUserHeight = useCallback((val: number) => updateProfile({ userHeight: val }), [updateProfile]);
  const setUserAge = useCallback((val: number) => updateProfile({ userAge: val }), [updateProfile]);
  const setUserGender = useCallback((val: string) => updateProfile({ userGender: val }), [updateProfile]);
  const setUserActivity = useCallback((val: number) => updateProfile({ userActivity: val }), [updateProfile]);
  const setDailyWater = useCallback((val: number) => updateProfile({ dailyWater: val }), [updateProfile]);
  const setDailyProtein = useCallback((val: number) => updateProfile({ dailyProtein: val }), [updateProfile]);
  const setGoalWeight = useCallback((val: number) => updateProfile({ goalWeight: val }), [updateProfile]);
  const setTimerTotal = useCallback((val: number) => updateProfile({ timerTotal: val }), [updateProfile]);
  const setSoundType = useCallback((val: string) => updateProfile({ soundType: val }), [updateProfile]);
  const toggleSound = useCallback(() => updateProfile({ soundEnabled: !soundEnabled }), [soundEnabled, updateProfile]);
  const toggleHaptics = useCallback(() => updateProfile({ hapticsEnabled: !hapticsEnabled }), [hapticsEnabled, updateProfile]);

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

      <NotificationBanner notifications={notifications} onDismiss={dismissNotification} />

      <Header
        isOnline={isOnline}
        workoutActive={workout.workoutActive}
        workoutPhase={workout.workoutPhase}
        activeWorkoutTime={workout.activeWorkoutTime}
        onOpen1RMCalculator={() => setActive1RMData({ weight: 80 })}
      />

      <main className="flex-grow max-w-md w-full mx-auto px-3.5 py-4 pb-32">
        {activeTab === 'rutinas' && (
          <Suspense fallback={<TabLoadingSkeleton />}>
            <RoutineView
              selectedRoutineType={selectedRoutineType}
              selectedWeek={selectedWeek}
              selectedDay={selectedDay}
              customWeights={customWeights}
              workoutActive={workout.workoutActive}
              overrides={routineOverrides}
              onOverridesChange={setRoutineOverrides}
              onSelectRoutineType={setSelectedRoutineType}
              onSelectWeek={setSelectedWeek}
              onSelectDay={setSelectedDay}
              onStartWorkout={workout.startWorkout}
              onShowMachine={type => setActiveMachineType(type as MachineType)}
              onShowNotification={showNotification}
              onSetActiveTab={tab => setActiveTab(tab as TabId)}
            />
          </Suspense>
        )}

        {activeTab === 'entrenar' && (
          <Suspense fallback={<TabLoadingSkeleton />}>
            <WorkoutSession
              workout={workout.currentWorkout}
              workoutActive={workout.workoutActive}
              workoutPhase={workout.workoutPhase}
              activeWorkoutTime={workout.activeWorkoutTime}
              timerLeft={workout.timerLeft}
              initialTimerLeft={workout.initialTimerLeft}
              timerRunning={workout.timerRunning}
              timerTotal={timerTotal}
              cardioTimeLeft={workout.cardioTimeLeft}
              cardioTimerRunning={workout.cardioTimerRunning}
              completedWarmupSteps={workout.completedWarmupSteps}
              swappedExercises={workout.swappedExercises}
              dailyWater={dailyWater}
              selectedCardioType={workout.selectedCardioType}
              soundEnabled={soundEnabled}
              soundType={soundType}
              history={history}
              onProceedToLifting={workout.proceedToLifting}
              onProceedToCardio={workout.proceedToCardio}
              onFinishWorkout={workout.finishWorkout}
              onCancelWorkout={workout.cancelWorkout}
              onToggleWarmupStep={workout.toggleWarmupStep}
              onToggleSetCompleted={workout.toggleSetCompleted}
              onToggleSwapExercise={workout.toggleSwapExercise}
              onUpdateSetValues={workout.updateSetValues}
              onHandleRpeChange={workout.handleRpeChange}
              onSetTimerRunning={workout.setTimerRunning}
              onSetTimerLeft={workout.setTimerLeft}
              onSetCardioTimerRunning={workout.setCardioTimerRunning}
              onSetSelectedCardioType={workout.setSelectedCardioType}
              onDailyWaterChange={setDailyWater}
              onOpenPlateCalculator={handleOpenPlateCalculator}
              onOpenWarmupModal={setActiveWarmupData}
              onShowMachine={type => setActiveMachineType(type as MachineType)}
              onShowNotification={showNotification}
            />
          </Suspense>
        )}

        {activeTab === 'deficit' && (
          <Suspense fallback={<TabLoadingSkeleton />}>
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
          </Suspense>
        )}

        {activeTab === 'progreso' && (
          <Suspense fallback={<TabLoadingSkeleton />}>
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
              onShowMachine={type => setActiveMachineType(type as MachineType)}
              onOpen1RMCalculator={(name, weight) => setActive1RMData({ name, weight: weight || 80 })}
              onStartWorkout={() => {
                setActiveTab('rutinas');
              }}
            />
          </Suspense>
        )}

        {activeTab === 'ajustes' && (
          <Suspense fallback={<TabLoadingSkeleton />}>
            <SettingsTab
              soundEnabled={soundEnabled}
              soundType={soundType}
              timerTotal={timerTotal}
              hapticsEnabled={hapticsEnabled}
              theme={theme}
              accent={accent}
              onSoundToggle={toggleSound}
              onSoundTypeChange={setSoundType}
              onTimerTotalChange={setTimerTotal}
              onHapticsToggle={toggleHaptics}
              onThemeCycle={cycleTheme}
              onAccentChange={setAccent}
              onPlaySound={playSound}
              onResetAll={handleResetAll}
              onResetAllImages={resetAllImages}
              onShowNotification={showNotification}
            />
          </Suspense>
        )}
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} workoutActive={workout.workoutActive} />

      {activeMachineType && <MachineModal machineType={activeMachineType} onClose={() => setActiveMachineType(null)} />}

      {activePlateCalculator && (
        <PlateCalculator
          exercise={activePlateCalculator}
          customWeights={customWeights}
          onApply={(id, weight) => {
            setCustomWeights(prev => ({ ...prev, [id]: weight }));
            showNotification(`Carga actualizada a ${weight} kg`);
          }}
          onClose={() => setActivePlateCalculator(null)}
          onShowNotification={showNotification}
        />
      )}

      {active1RMData && (
        <OneRepMaxModal
          exerciseName={active1RMData.name}
          initialWeight={active1RMData.weight}
          onClose={() => setActive1RMData(null)}
        />
      )}

      {activeWarmupData && (
        <WarmupModal
          exerciseName={activeWarmupData.name}
          workingWeight={activeWarmupData.weight}
          machineBase={activeWarmupData.machineBase}
          onClose={() => setActiveWarmupData(null)}
        />
      )}

      {showOnboarding && (
        <Onboarding
          onComplete={() => {
            updateProfile({ onboarded: true });
            setDismissedOnboarding(true);
          }}
        />
      )}

      <UpdatePrompt />
    </div>
  );
}
