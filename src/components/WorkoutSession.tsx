import { useState } from 'react';
import type { Workout, WorkoutPhase, SetData, HistoryItem } from '../types';
import { WARMUP_STEPS } from '../data/warmup';
import { CARDIO_OPTIONS } from '../data/cardio';
import { formatTime } from '../utils/format';
import { getPreviousPerformance, type PreviousExercisePerformance } from '../utils/historyLookup';
import { useMachineNotes } from '../hooks/useMachineNotes';
import { calculateRpeAutoRegulation } from '../utils/rpeAutoRegulation';
import { WeightSuggestion } from './WeightSuggestion';
import { HIITTimer } from './HIITTimer';
import { FocusGymMode } from './FocusGymMode';

interface Props {
  workout: Workout | null;
  workoutActive: boolean;
  workoutPhase: WorkoutPhase;
  activeWorkoutTime: number;
  timerLeft: number;
  initialTimerLeft: number;
  timerRunning: boolean;
  timerTotal: number;
  cardioTimeLeft: number;
  cardioTimerRunning: boolean;
  completedWarmupSteps: Record<string, boolean>;
  swappedExercises: Record<string, boolean>;
  dailyWater: number;
  selectedCardioType: string;
  soundEnabled: boolean;
  soundType: string;
  history: HistoryItem[];
  onProceedToLifting: () => void;
  onProceedToCardio: () => void;
  onFinishWorkout: (notes: string) => void;
  onCancelWorkout: () => void;
  onToggleWarmupStep: (id: string) => void;
  onToggleSetCompleted: (exId: string, setIdx: number) => void;
  onToggleSwapExercise: (exId: string) => void;
  onUpdateSetValues: (exId: string, setIdx: number, field: 'weight' | 'reps', delta: number) => void;
  onHandleRpeChange: (exId: string, setIdx: number, rpe: number) => void;
  onSetTimerRunning: (v: boolean) => void;
  onSetTimerLeft: (v: number) => void;
  onSetCardioTimerRunning: (v: boolean) => void;
  onSetSelectedCardioType: (v: string) => void;
  onDailyWaterChange: (v: number) => void;
  onOpenPlateCalculator: (ex: { id: string; name: string; machineBase: number }) => void;
  onOpenWarmupModal?: (ex: { name: string; weight: number; machineBase?: number }) => void;
  onShowMachine: (type: string) => void;
  onShowNotification: (msg: string) => void;
}

function SetRow({
  exId,
  set,
  sIdx,
  prevSet,
  onToggleSetCompleted,
  onUpdateSetValues,
  onHandleRpeChange,
}: {
  exId: string;
  set: SetData;
  sIdx: number;
  prevSet?: { weight: number; reps: number; rpe?: number };
  onToggleSetCompleted: (exId: string, sIdx: number) => void;
  onUpdateSetValues: (exId: string, sIdx: number, field: 'weight' | 'reps', delta: number) => void;
  onHandleRpeChange: (exId: string, sIdx: number, rpe: number) => void;
}) {
  const rpeColor = (r: number) => (r <= 7 ? '#22c55e' : r === 8 ? '#eab308' : r === 9 ? '#f97316' : '#ef4444');

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${
        set.completed
          ? 'bg-emerald-950/20 border-emerald-500/30'
          : 'bg-slate-950 border-slate-850 hover:border-slate-800'
      }`}
    >
      <div className={`grid grid-cols-12 items-center p-2.5 gap-1 ${set.completed ? 'opacity-65' : ''}`}>
        <div className="col-span-2 text-left pl-1">
          <span className="font-bold text-xs text-slate-200">#{set.setNumber}</span>
          {prevSet && (
            <p className="text-[9px] text-slate-500 font-mono leading-none mt-0.5" title="Marca sesión anterior">
              {prevSet.weight}k×{prevSet.reps}
            </p>
          )}
        </div>

        <div className="col-span-4 flex items-center justify-center gap-1">
          <button
            type="button"
            disabled={set.completed}
            onClick={() => onUpdateSetValues(exId, sIdx, 'weight', -2.5)}
            className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-900 text-sm font-black rounded-xl border border-slate-800 active:scale-90 transition-transform disabled:opacity-30"
          >
            −
          </button>
          <span className="font-mono font-black min-w-[32px] text-center text-sm text-slate-100">{set.weight}</span>
          <button
            type="button"
            disabled={set.completed}
            onClick={() => onUpdateSetValues(exId, sIdx, 'weight', 2.5)}
            className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-900 text-sm font-black rounded-xl border border-slate-800 active:scale-90 transition-transform disabled:opacity-30"
          >
            +
          </button>
        </div>

        <div className="col-span-3 flex items-center justify-center gap-1">
          <button
            type="button"
            disabled={set.completed}
            onClick={() => onUpdateSetValues(exId, sIdx, 'reps', -1)}
            className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-900 text-sm font-black rounded-xl border border-slate-800 active:scale-90 transition-transform disabled:opacity-30"
          >
            −
          </button>
          <span className="font-mono font-black min-w-[24px] text-center text-sm text-slate-100">{set.reps}</span>
          <button
            type="button"
            disabled={set.completed}
            onClick={() => onUpdateSetValues(exId, sIdx, 'reps', 1)}
            className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-900 text-sm font-black rounded-xl border border-slate-800 active:scale-90 transition-transform disabled:opacity-30"
          >
            +
          </button>
        </div>

        <div className="col-span-3 flex justify-end pr-1">
          <button
            type="button"
            onClick={() => onToggleSetCompleted(exId, sIdx)}
            aria-label={set.completed ? 'Desmarcar serie' : 'Completar serie'}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black transition-all active:scale-90 ${
              set.completed
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 border border-slate-750 text-slate-600 hover:text-slate-400 hover:border-slate-600'
            }`}
          >
            ✓
          </button>
        </div>
      </div>

      <div className="px-3 pb-2.5 pt-0.5">
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase font-bold text-slate-500 whitespace-nowrap">Esfuerzo</span>
          <input
            type="range"
            min={6}
            max={10}
            step={1}
            value={set.rpe}
            disabled={set.completed}
            onChange={e => onHandleRpeChange(exId, sIdx, parseInt(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer disabled:opacity-40"
            style={{
              accentColor: rpeColor(set.rpe),
              background: `linear-gradient(to right, ${rpeColor(set.rpe)} ${((set.rpe - 6) / 4) * 100}%, #334155 ${
                ((set.rpe - 6) / 4) * 100
              }%)`,
            }}
          />
          <span className="text-[10px] font-black font-mono w-14 text-right" style={{ color: rpeColor(set.rpe) }}>
            RPE {set.rpe}
          </span>
        </div>

        {set.completed && (() => {
          const autoReg = calculateRpeAutoRegulation(set.weight, set.rpe);
          if (autoReg.delta === 0) return null;
          return (
            <div
              className={`mt-1 px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1.5 ${
                autoReg.badge === 'bajar'
                  ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                  : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              }`}
            >
              <span>{autoReg.badge === 'bajar' ? '⚠️' : '⚡'}</span>
              <span>{autoReg.reason}</span>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function ExerciseCard({
  ex,
  exIdx,
  isSwapped,
  prevPerf,
  history,
  machineNote,
  onSetMachineNote,
  onShowMachine,
  onOpenPlateCalculator,
  onOpenWarmupModal,
  onToggleSwapExercise,
  onToggleSetCompleted,
  onUpdateSetValues,
  onHandleRpeChange,
  onShowNotification,
}: {
  ex: Workout['exercises'][0];
  exIdx: number;
  isSwapped: boolean;
  prevPerf: PreviousExercisePerformance | null;
  history: HistoryItem[];
  machineNote: string;
  onSetMachineNote: (text: string) => void;
  onShowMachine: (type: string) => void;
  onOpenPlateCalculator: (ex: { id: string; name: string; machineBase: number }) => void;
  onOpenWarmupModal?: (ex: { name: string; weight: number; machineBase?: number }) => void;
  onToggleSwapExercise: (exId: string) => void;
  onToggleSetCompleted: (exId: string, sIdx: number) => void;
  onUpdateSetValues: (exId: string, sIdx: number, field: 'weight' | 'reps', delta: number) => void;
  onHandleRpeChange: (exId: string, sIdx: number, rpe: number) => void;
  onShowNotification: (msg: string) => void;
}) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const allDone = ex.sets.every(s => s.completed);
  const activeName = isSwapped ? ex.alternativeName : ex.name;

  return (
    <div
      className={`bg-slate-900 border rounded-3xl p-4 sm:p-5 shadow-xl transition-all ${
        allDone ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-slate-800'
      }`}
    >
      <div className="pb-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-slate-100">
              {exIdx + 1}. {activeName}
            </h3>
            {allDone && (
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-black">
                COMPLETO
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Objetivo: {ex.target}</p>

          {/* Ghost Performance (Previous Session Summary) */}
          {prevPerf && (
            <div className="inline-flex items-center gap-1.5 mt-1 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-850 text-[10px]">
              <span className="text-accent font-bold">🎯 Anterior:</span>
              <span className="text-slate-200 font-mono font-bold">
                {prevPerf.bestSet.weight}kg × {prevPerf.bestSet.reps}
              </span>
              <span className="text-slate-500">({prevPerf.lastDate})</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              onShowMachine(ex.machineType);
              onShowNotification(`Abriendo plano anatómico de ${activeName}`);
            }}
            className="px-2 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-[10px] text-accent font-black shadow-sm flex items-center gap-1 active:scale-95"
          >
            <span>📐</span> Plano
          </button>

          <button
            type="button"
            onClick={() => onOpenPlateCalculator({ id: ex.id, name: activeName, machineBase: ex.machineBase })}
            className="px-2 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-[10px] text-slate-300 font-bold flex items-center gap-1 active:scale-95"
            title="Calculadora de Discos"
          >
            <span>⚖️</span> Discos
          </button>

          {onOpenWarmupModal && (
            <button
              type="button"
              onClick={() =>
                onOpenWarmupModal({
                  name: activeName,
                  weight: ex.sets[0]?.weight || 60,
                  machineBase: ex.machineBase,
                })
              }
              className="px-2 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-[10px] text-amber-400 font-bold flex items-center gap-1 active:scale-95"
              title="Series de Aproximación"
            >
              <span>🔥</span> Calentamiento
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowNoteInput(prev => !prev)}
            className={`px-2 py-1 rounded-xl text-[10px] font-bold border transition-all active:scale-95 flex items-center gap-1 ${
              machineNote
                ? 'bg-sky-500/15 border-sky-500/30 text-sky-400'
                : 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-400'
            }`}
            title="Ajuste ergonómico de máquina"
          >
            <span>📝</span> {machineNote ? 'Ajustes ✓' : 'Ajustes'}
          </button>

          <button
            type="button"
            onClick={() => onToggleSwapExercise(ex.id)}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold border transition-all active:scale-95 ${
              isSwapped
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                : 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-400'
            }`}
          >
            {isSwapped ? 'Alternativa activa' : 'Ocupada'}
          </button>
        </div>
      </div>

      {/* Machine Setup Ergonomics Note Input */}
      {showNoteInput && (
        <div className="mt-3 p-3 bg-slate-950 rounded-2xl border border-slate-850 space-y-1.5 animate-fadeIn">
          <label className="text-[10px] font-bold text-slate-400 block uppercase">
            Ajustes de máquina (Asiento, Respaldo, Pin...)
          </label>
          <input
            type="text"
            value={machineNote}
            onChange={e => onSetMachineNote(e.target.value)}
            placeholder="Ej. Asiento en nivel 4, tope en 2..."
            className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-accent"
          />
        </div>
      )}

      <div className="mt-3 space-y-2">
        <div className="grid grid-cols-12 text-[9px] text-slate-500 uppercase font-bold text-center px-1">
          <span className="col-span-2 text-left pl-1">Serie</span>
          <span className="col-span-4">Carga (kg)</span>
          <span className="col-span-3">Reps</span>
          <span className="col-span-3 text-right pr-1">Listo</span>
        </div>

        {ex.sets.map((set, sIdx) => (
          <SetRow
            key={sIdx}
            exId={ex.id}
            set={set}
            sIdx={sIdx}
            prevSet={prevPerf?.sets?.[sIdx]}
            onToggleSetCompleted={onToggleSetCompleted}
            onUpdateSetValues={onUpdateSetValues}
            onHandleRpeChange={onHandleRpeChange}
          />
        ))}

        <WeightSuggestion
          exerciseId={ex.id}
          currentWeight={ex.sets[0]?.weight || 0}
          history={history}
          onApply={() => {}}
        />
      </div>
    </div>
  );
}

function PhaseIndicator({ workoutPhase }: { workoutPhase: WorkoutPhase }) {
  const phases = [
    { key: 'warmup', label: '1. Calentamiento', num: '1' },
    { key: 'lifting', label: '2. Pesas / Máquinas', num: '2' },
    { key: 'cardio', label: '3. Cardio Final', num: '3' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex justify-between items-center text-xs phase-indicator">
      {phases.map((p, i) => (
        <div key={p.key} className="flex items-center gap-1.5">
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] ${
              workoutPhase === p.key ? 'bg-accent text-slate-950' : 'bg-slate-850 text-slate-400'
            }`}
          >
            {p.num}
          </span>
          <span className={workoutPhase === p.key ? 'font-bold text-accent' : 'text-slate-400'}>{p.label}</span>
          {i < phases.length - 1 && <div className="w-4 h-px bg-slate-800" />}
        </div>
      ))}
    </div>
  );
}

function VictoryScreen({ activeWorkoutTime, onFinish }: { activeWorkoutTime: number; onFinish: (notes: string) => void }) {
  const [notes, setNotes] = useState('');

  return (
    <div className="bg-slate-900 border-2 border-accent/40 rounded-3xl p-6 text-center space-y-5 shadow-2xl relative overflow-hidden animate-bounceIn">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
      <div className="text-5xl animate-bounce">🏆</div>
      <div className="space-y-1">
        <h2 className="text-xl font-black text-accent">¡ENTRENAMIENTO COMPLETADO!</h2>
        <p className="text-xs text-slate-400">Has completado las 3 fases: Calentamiento, Fuerza y Cardio Final.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-xs pt-2">
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-850">
          <p className="text-slate-500 uppercase font-extrabold text-[9px]">Gasto Estimado</p>
          <p className="text-base font-black text-accent mt-1">~550 kcal</p>
        </div>
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-850">
          <p className="text-slate-500 uppercase font-extrabold text-[9px]">Tiempo Total</p>
          <p className="text-base font-black text-slate-200 mt-1">{formatTime(activeWorkoutTime)}</p>
        </div>
      </div>

      <div className="text-left bg-slate-950/60 p-4 rounded-xl border border-slate-800">
        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Notas de la sesión (opcional)</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="¿Cómo te sentiste? ¿Molestias? ¿Sensaciones?..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <button
          onClick={async () => {
            const { shareViaWhatsApp } = await import('../utils/shareMotivation');
            shareViaWhatsApp({
              athleteName: 'Tu compañero',
              workoutTitle: 'Entrenamiento Completado 🏆',
              volume: 4500,
              duration: formatTime(activeWorkoutTime),
            });
          }}
          className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 font-black py-3 rounded-xl text-xs active:scale-98 transition-all flex items-center justify-center gap-1.5"
        >
          <span>📲</span> Compartir Reto en WhatsApp
        </button>

        <button
          onClick={() => onFinish(notes)}
          className="w-full bg-accent hover:opacity-90 text-slate-950 font-black py-3.5 rounded-xl text-xs shadow-lg active:scale-98 transition-all"
        >
          Guardar y Ver Progreso
        </button>
      </div>
    </div>
  );
}

function WarmupPhase({
  completedSteps,
  onToggleStep,
  onProceed,
}: {
  completedSteps: Record<string, boolean>;
  onToggleStep: (id: string) => void;
  onProceed: () => void;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
      <div className="border-b border-slate-800 pb-3">
        <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Fase de Inicio</span>
        <h3 className="text-base font-black">Calentamiento de Prevención y Activación</h3>
        <p className="text-xs text-slate-400 mt-1">Completa los pasos marcando cada casilla para habilitar el bloque de pesas.</p>
      </div>
      <div className="space-y-3">
        {WARMUP_STEPS.map(step => (
          <div
            key={step.id}
            onClick={() => onToggleStep(step.id)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
              completedSteps[step.id]
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100'
                : 'bg-slate-950 border-slate-850 text-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center ${
                completedSteps[step.id] ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-750'
              }`}
            >
              {completedSteps[step.id] && '✓'}
            </div>
            <div className="flex-1 text-xs">
              <div className="flex justify-between font-bold">
                <span>{step.title}</span>
                <span className="text-slate-500 font-mono text-[10px]">{step.duration}</span>
              </div>
              <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onProceed}
        className="w-full bg-accent hover:opacity-90 text-slate-950 font-black py-3.5 rounded-xl text-xs transition-colors"
      >
        Completar Calentamiento → Ir a Máquinas
      </button>
    </div>
  );
}

function LiftingPhase({
  workout,
  timerLeft,
  initialTimerLeft,
  swappedExercises,
  history,
  onToggleSetCompleted,
  onToggleSwapExercise,
  onUpdateSetValues,
  onHandleRpeChange,
  onSetTimerRunning,
  onSetTimerLeft,
  onOpenPlateCalculator,
  onOpenWarmupModal,
  onShowMachine,
  onProceedToCardio,
  onShowNotification,
}: {
  workout: Workout;
  timerLeft: number;
  initialTimerLeft: number;
  swappedExercises: Record<string, boolean>;
  history: HistoryItem[];
  onToggleSetCompleted: (exId: string, sIdx: number) => void;
  onToggleSwapExercise: (exId: string) => void;
  onUpdateSetValues: (exId: string, sIdx: number, field: 'weight' | 'reps', delta: number) => void;
  onHandleRpeChange: (exId: string, sIdx: number, rpe: number) => void;
  onSetTimerRunning: (v: boolean) => void;
  onSetTimerLeft: (v: number) => void;
  onOpenPlateCalculator: (ex: { id: string; name: string; machineBase: number }) => void;
  onOpenWarmupModal?: (ex: { name: string; weight: number; machineBase?: number }) => void;
  onShowMachine: (type: string) => void;
  onProceedToCardio: () => void;
  onShowNotification: (msg: string) => void;
}) {
  const { notes: machineNotes, setExerciseNote } = useMachineNotes();

  return (
    <div className="space-y-4 lifting-landscape">
      {timerLeft > 0 && (
        <div className="bg-slate-900 border border-accent/20 rounded-2xl p-4 flex items-center justify-between shadow-lg relative overflow-hidden animate-slideUp">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" className="stroke-slate-800" strokeWidth="3" fill="transparent" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="stroke-accent transition-all duration-1000"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={125.6}
                  strokeDashoffset={125.6 - (125.6 * timerLeft) / (initialTimerLeft || 1)}
                />
              </svg>
              <span className="text-xs font-black text-accent font-mono">{timerLeft}s</span>
            </div>
            <div>
              <p className="text-[9px] text-accent uppercase font-bold">Descanso entre series</p>
              <p className="text-xs font-semibold text-slate-200">¡Recupérate para la próxima carga!</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onSetTimerLeft(timerLeft + 30)}
              className="bg-slate-850 text-slate-300 px-2.5 py-1 rounded-lg text-xs font-bold active:scale-95"
            >
              +30s
            </button>
            <button
              onClick={() => {
                onSetTimerRunning(false);
                onSetTimerLeft(0);
              }}
              className="bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-lg text-xs font-bold active:scale-95"
            >
              Saltar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {workout.exercises.map((ex, exIdx) => {
          const isSwapped = swappedExercises[ex.id];
          const prevPerf = getPreviousPerformance(ex.id, history);

          return (
            <ExerciseCard
              key={ex.id}
              ex={ex}
              exIdx={exIdx}
              isSwapped={isSwapped}
              prevPerf={prevPerf}
              history={history}
              machineNote={machineNotes[ex.id] || ''}
              onSetMachineNote={note => setExerciseNote(ex.id, note)}
              onShowMachine={onShowMachine}
              onOpenPlateCalculator={onOpenPlateCalculator}
              onOpenWarmupModal={onOpenWarmupModal}
              onToggleSwapExercise={onToggleSwapExercise}
              onToggleSetCompleted={onToggleSetCompleted}
              onUpdateSetValues={onUpdateSetValues}
              onHandleRpeChange={onHandleRpeChange}
              onShowNotification={onShowNotification}
            />
          );
        })}
      </div>

      <button
        onClick={onProceedToCardio}
        className="w-full bg-gradient-to-r from-accent to-accent/70 text-slate-950 font-black py-4 rounded-2xl text-xs transition-all shadow-lg active:scale-98"
      >
        Terminar Fuerza → Iniciar Cardio Final (30 min)
      </button>
    </div>
  );
}

function CardioPhase({
  cardioTimeLeft,
  cardioTimerRunning,
  selectedCardioType,
  onSetCardioTimerRunning,
  onSetCardioTimeLeft,
  onSetSelectedCardioType,
  onFinish,
}: {
  cardioTimeLeft: number;
  cardioTimerRunning: boolean;
  selectedCardioType: string;
  onSetCardioTimerRunning: (v: boolean) => void;
  onSetCardioTimeLeft: (v: number) => void;
  onSetSelectedCardioType: (v: string) => void;
  onFinish: (notes: string) => void;
}) {
  const [showHiit, setShowHiit] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 text-left animate-fadeIn">
      <div className="border-b border-slate-800 pb-3">
        <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Fase Final de Oxidación</span>
        <h3 className="text-base font-black">Cardio Guiado de 30 Minutos</h3>
        <p className="text-xs text-slate-400 mt-1">
          Con el glucógeno bajo por las pesas, estos 30 minutos maximizan la quema de ácidos grasos.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-400">Selecciona tu máquina de cardio</label>
        <select
          value={selectedCardioType}
          onChange={e => onSetSelectedCardioType(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs text-slate-100 font-bold focus:outline-none"
        >
          {CARDIO_OPTIONS.map(opt => (
            <option key={opt.id} value={opt.name}>
              {opt.name} ({opt.avgCals})
            </option>
          ))}
        </select>
      </div>

      <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl text-center space-y-3">
        <div className="text-4xl font-mono font-black text-accent">{formatTime(cardioTimeLeft)}</div>
        <p className="text-[11px] text-slate-400">Mantén una intensidad moderada (RPE 6/10, ritmo conversacional).</p>

        <div className="flex gap-2 justify-center">
          <button
            onClick={() => onSetCardioTimerRunning(!cardioTimerRunning)}
            className={`px-6 py-2.5 rounded-xl font-black text-xs transition-all active:scale-95 ${
              cardioTimerRunning
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
            }`}
          >
            {cardioTimerRunning ? 'Pausar Cardio' : 'Reanudar Cardio'}
          </button>
          <button
            onClick={() => onSetCardioTimeLeft(Math.max(0, cardioTimeLeft - 300))}
            className="px-3 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl font-bold text-xs active:scale-95"
          >
            -5 min
          </button>
        </div>
      </div>

      {showHiit && <HIITTimer onClose={() => setShowHiit(false)} />}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowHiit(true)}
          className="flex-1 py-3 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl font-bold text-xs active:scale-95"
        >
          ⏱️ Temporizador HIIT / Intervalos
        </button>
      </div>

      <button
        onClick={() => onFinish('')}
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl text-xs shadow-lg active:scale-98 transition-all"
      >
        Finalizar Sesión Completa
      </button>
    </div>
  );
}

export function WorkoutSession({
  workout,
  workoutActive,
  workoutPhase,
  activeWorkoutTime,
  timerLeft,
  initialTimerLeft,
  timerTotal: _timerTotal,
  cardioTimeLeft,
  cardioTimerRunning,
  completedWarmupSteps,
  swappedExercises,
  dailyWater,
  selectedCardioType,
  history,
  onProceedToLifting,
  onProceedToCardio,
  onFinishWorkout,
  onToggleWarmupStep,
  onToggleSetCompleted,
  onToggleSwapExercise,
  onUpdateSetValues,
  onHandleRpeChange,
  onSetTimerRunning,
  onSetTimerLeft,
  onSetCardioTimerRunning,
  onSetSelectedCardioType,
  onDailyWaterChange,
  onOpenPlateCalculator,
  onOpenWarmupModal,
  onShowMachine,
  onShowNotification,
}: Props) {
  const [showFocusMode, setShowFocusMode] = useState(false);

  if (!workoutActive) {
    return (
      <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 animate-fadeIn">
        <div className="bg-slate-850 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl">🏋️</div>
        <h3 className="text-lg font-bold">Sin entrenamiento activo</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Selecciona una rutina y un día en la pestaña Rutinas para comenzar tu entrenamiento de 3 fases.
        </p>
      </div>
    );
  }

  if (workoutPhase === 'victory') {
    return <VictoryScreen activeWorkoutTime={activeWorkoutTime} onFinish={onFinishWorkout} />;
  }

  return (
    <div className="space-y-4 animate-fadeIn workout-landscape">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <PhaseIndicator workoutPhase={workoutPhase} />
        </div>
        {workoutPhase === 'lifting' && (
          <button
            onClick={() => setShowFocusMode(true)}
            className="px-3 py-3 bg-black hover:bg-neutral-900 border border-emerald-500/40 text-emerald-400 font-black rounded-3xl text-xs flex items-center gap-1.5 active:scale-95 shadow-lg shadow-emerald-500/10 transition-all flex-shrink-0"
            title="Modo Focus OLED"
          >
            <span>🖤</span> Focus OLED
          </button>
        )}
      </div>

      {showFocusMode && workout && (
        <FocusGymMode
          workout={workout}
          timerLeft={timerLeft}
          activeWorkoutTime={activeWorkoutTime}
          onToggleSetCompleted={onToggleSetCompleted}
          onUpdateSetValues={onUpdateSetValues}
          onClose={() => setShowFocusMode(false)}
        />
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <span className="text-xl">💧</span>
          <div>
            <p className="font-bold text-slate-200">Hidratación en la Sesión</p>
            <p className="text-[10px] text-slate-500">
              Agua bebida hoy: {dailyWater} vaso(s) ({(dailyWater * 250) / 1000}L)
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            onDailyWaterChange(dailyWater + 1);
            onShowNotification('¡Excelente! Mantente hidratado.');
          }}
          className="bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] active:scale-95"
        >
          + Beber 250ml
        </button>
      </div>

      {workoutPhase === 'warmup' && (
        <WarmupPhase
          completedSteps={completedWarmupSteps}
          onToggleStep={onToggleWarmupStep}
          onProceed={onProceedToLifting}
        />
      )}

      {workoutPhase === 'lifting' && (
        <LiftingPhase
          workout={workout!}
          timerLeft={timerLeft}
          initialTimerLeft={initialTimerLeft}
          swappedExercises={swappedExercises}
          history={history}
          onToggleSetCompleted={onToggleSetCompleted}
          onToggleSwapExercise={onToggleSwapExercise}
          onUpdateSetValues={onUpdateSetValues}
          onHandleRpeChange={onHandleRpeChange}
          onSetTimerRunning={onSetTimerRunning}
          onSetTimerLeft={onSetTimerLeft}
          onOpenPlateCalculator={onOpenPlateCalculator}
          onOpenWarmupModal={onOpenWarmupModal}
          onShowMachine={onShowMachine}
          onProceedToCardio={onProceedToCardio}
          onShowNotification={onShowNotification}
        />
      )}

      {workoutPhase === 'cardio' && (
        <CardioPhase
          cardioTimeLeft={cardioTimeLeft}
          cardioTimerRunning={cardioTimerRunning}
          selectedCardioType={selectedCardioType}
          onSetCardioTimerRunning={onSetCardioTimerRunning}
          onSetCardioTimeLeft={onSetTimerLeft}
          onSetSelectedCardioType={onSetSelectedCardioType}
          onFinish={onFinishWorkout}
          soundEnabled={true}
        />
      )}
    </div>
  );
}
