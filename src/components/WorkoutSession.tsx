import { useState } from 'react';
import type { Workout, WorkoutPhase, SetData, HistoryItem } from '../types';
import { WARMUP_STEPS } from '../data/warmup';
import { CARDIO_OPTIONS } from '../data/cardio';
import { formatTime } from '../utils/format';
import { WeightSuggestion } from './WeightSuggestion';
import { HIITTimer } from './HIITTimer';

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
  onShowMachine: (type: string) => void;
  onShowNotification: (msg: string) => void;
}

function SetRow({
  exId, set, sIdx,
  onToggleSetCompleted, onUpdateSetValues, onHandleRpeChange,
}: {
  exId: string; set: SetData; sIdx: number;
  onToggleSetCompleted: (exId: string, sIdx: number) => void;
  onUpdateSetValues: (exId: string, sIdx: number, field: 'weight' | 'reps', delta: number) => void;
  onHandleRpeChange: (exId: string, sIdx: number, rpe: number) => void;
}) {
  return (
    <div className={`grid grid-cols-12 items-center p-2 rounded-xl border text-center text-xs ${set.completed ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-950 border-slate-850'}`}>
      <span className="col-span-1 text-left pl-1 font-bold text-[10px]">#{set.setNumber}</span>

      <div className="col-span-4 flex items-center justify-center gap-1">
        <button type="button" disabled={set.completed} onClick={() => onUpdateSetValues(exId, sIdx, 'weight', -2.5)}
          className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-900 text-sm font-bold rounded border border-slate-800 active:scale-95 transition-transform">−</button>
        <span className="font-mono font-bold min-w-[28px] text-sm">{set.weight}</span>
        <button type="button" disabled={set.completed} onClick={() => onUpdateSetValues(exId, sIdx, 'weight', 2.5)}
          className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-900 text-sm font-bold rounded border border-slate-800 active:scale-95 transition-transform">+</button>
      </div>

      <div className="col-span-3 flex items-center justify-center gap-1">
        <button type="button" disabled={set.completed} onClick={() => onUpdateSetValues(exId, sIdx, 'reps', -1)}
          className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-900 text-sm font-bold rounded border border-slate-800 active:scale-95 transition-transform">−</button>
        <span className="font-mono font-bold min-w-[20px] text-sm">{set.reps}</span>
        <button type="button" disabled={set.completed} onClick={() => onUpdateSetValues(exId, sIdx, 'reps', 1)}
          className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-900 text-sm font-bold rounded border border-slate-800 active:scale-95 transition-transform">+</button>
      </div>

      <div className="col-span-2 flex items-center justify-center">
        <select disabled={set.completed} value={set.rpe}
          onChange={(e) => onHandleRpeChange(exId, sIdx, parseInt(e.target.value))}
          className="bg-slate-900 text-[10px] text-slate-300 rounded p-1 border border-slate-800 font-mono font-bold focus:outline-none min-h-[32px]">
          {[6, 7, 8, 9, 10].map(r => <option key={r} value={r}>RPE {r}</option>)}
        </select>
      </div>

      <div className="col-span-2 flex justify-center">
        <button type="button" onClick={() => onToggleSetCompleted(exId, sIdx)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all active:scale-95 ${set.completed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 border border-slate-700 text-transparent'}`}>
          ✓
        </button>
      </div>
    </div>
  );
}

export function WorkoutSession({
  workout, workoutActive, workoutPhase, activeWorkoutTime,
  timerLeft, initialTimerLeft, _timerRunning, _timerTotal,
  cardioTimeLeft, cardioTimerRunning, completedWarmupSteps, swappedExercises,
  dailyWater, selectedCardioType, soundEnabled, soundType, history,
  onProceedToLifting, onProceedToCardio, onFinishWorkout, _onCancelWorkout,
  onToggleWarmupStep, onToggleSetCompleted, onToggleSwapExercise,
  onUpdateSetValues, onHandleRpeChange,
  onSetTimerRunning, onSetTimerLeft, onSetCardioTimerRunning,
  onSetSelectedCardioType, onDailyWaterChange,
  onOpenPlateCalculator, onShowMachine, onShowNotification,
}: Props) {
  if (!workoutActive) {
    return (
      <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 animate-fadeIn">
        <div className="bg-slate-850 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl">🏋️</div>
        <h3 className="text-lg font-bold">Sin entrenamiento activo</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Selecciona la semana (A o B) y un día en la pestaña Rutinas para comenzar tu entrenamiento de 3 fases.
        </p>
      </div>
    );
  }

  if (workoutPhase === 'victory') {
    return <VictoryScreen activeWorkoutTime={activeWorkoutTime} onFinish={onFinishWorkout} />;
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <PhaseIndicator workoutPhase={workoutPhase} />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <span className="text-xl">💧</span>
          <div>
            <p className="font-bold text-slate-200">Hidratación en la Sesión</p>
            <p className="text-[10px] text-slate-500">Agua bebida hoy: {dailyWater} vaso(s) ({(dailyWater * 250) / 1000}L)</p>
          </div>
        </div>
        <button onClick={() => { onDailyWaterChange(dailyWater + 1); onShowNotification("Excelente! Mantente hidratado."); }}
          className="bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 px-3 py-1.5 rounded-xl font-bold transition-all text-[11px]">
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
          timerTotal={timerTotal}
          swappedExercises={swappedExercises}
          soundEnabled={soundEnabled}
          soundType={soundType}
          history={history}
          onToggleSetCompleted={onToggleSetCompleted}
          onToggleSwapExercise={onToggleSwapExercise}
          onUpdateSetValues={onUpdateSetValues}
          onHandleRpeChange={onHandleRpeChange}
          onSetTimerRunning={onSetTimerRunning}
          onSetTimerLeft={onSetTimerLeft}
          onOpenPlateCalculator={onOpenPlateCalculator}
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
          onSetCardioTimeLeft={onSetCardioTimerRunning}
          onSetSelectedCardioType={onSetSelectedCardioType}
          onFinish={onFinishWorkout}
        />
      )}
    </div>
  );
}

function PhaseIndicator({ workoutPhase }: { workoutPhase: string }) {
  const phases = [
    { key: 'warmup', num: 1, label: 'Warmup' },
    { key: 'lifting', num: 2, label: 'Fuerza' },
    { key: 'cardio', num: 3, label: 'Cardio' },
  ];
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex justify-between items-center text-xs">
      {phases.map((p, i) => (
        <div key={p.key} className="flex items-center gap-1.5">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] ${
            workoutPhase === p.key ? 'bg-emerald-500 text-slate-950' : 'bg-slate-850 text-slate-400'
          }`}>{p.num}</span>
          <span className={workoutPhase === p.key ? 'font-bold text-emerald-400' : 'text-slate-400'}>{p.label}</span>
          {i < phases.length - 1 && <div className="w-4 h-px bg-slate-800" />}
        </div>
      ))}
    </div>
  );
}

function VictoryScreen({ activeWorkoutTime, onFinish }: { activeWorkoutTime: number; onFinish: (notes: string) => void }) {
  const [notes, setNotes] = useState('');

  return (
    <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 text-center space-y-5 shadow-2xl relative overflow-hidden animate-bounceIn">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
      <div className="text-5xl animate-bounce">🏆</div>
      <div className="space-y-1">
        <h2 className="text-xl font-black text-emerald-400">ENTRENAMIENTO COMPLETADO!</h2>
        <p className="text-xs text-slate-400">Has completado las 3 fases: Calentamiento, Fuerza y Cardio Final.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-xs pt-2">
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-850">
          <p className="text-slate-500 uppercase font-extrabold text-[9px]">Gasto Estimado</p>
          <p className="text-base font-black text-emerald-400 mt-1">~550 kcal</p>
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
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Cómo te sentiste? Molestias? PRs?..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none"
          rows={3}
        />
      </div>

      <div className="text-xs text-slate-300 max-w-md mx-auto bg-slate-950/60 p-4 rounded-xl border border-slate-800 leading-relaxed">
        Recomendación de recuperación: Bebe un vaso de agua adicional, consume al menos 30g de proteína de alta calidad para reparar el tejido muscular y mantente activo el resto del día.
      </div>

      <button
        onClick={() => onFinish(notes)}
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs shadow-lg"
      >
        Guardar y Ver Progreso
      </button>
    </div>
  );
}

function WarmupPhase({
  completedSteps, onToggleStep, onProceed,
}: {
  completedSteps: Record<string, boolean>;
  onToggleStep: (id: string) => void;
  onProceed: () => void;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
      <div className="border-b border-slate-800 pb-3">
        <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Fase de Inicio</span>
        <h3 className="text-base font-black">Calentamiento de Prevención y Activación</h3>
        <p className="text-xs text-slate-400 mt-1">Completa los siguientes pasos marcando cada casilla para habilitar el bloque de pesas.</p>
      </div>
      <div className="space-y-3">
        {WARMUP_STEPS.map((step) => (
          <div key={step.id} onClick={() => onToggleStep(step.id)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
              completedSteps[step.id] ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100' : 'bg-slate-950 border-slate-850 text-slate-300'
            }`}>
            <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center ${
              completedSteps[step.id] ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-750'
            }`}>
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
      <button onClick={onProceed}
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl text-xs transition-colors">
        Completar Calentamiento → Ir a Máquinas
      </button>
    </div>
  );
}

function LiftingPhase({
  workout, timerLeft, initialTimerLeft, _timerTotal,
  swappedExercises, _soundEnabled, _soundType, history,
  onToggleSetCompleted, onToggleSwapExercise,
  onUpdateSetValues, onHandleRpeChange,
  onSetTimerRunning, onSetTimerLeft,
  onOpenPlateCalculator, onShowMachine,
  onProceedToCardio, onShowNotification,
}: {
  workout: Workout;
  timerLeft: number;
  initialTimerLeft: number;
  timerTotal: number;
  swappedExercises: Record<string, boolean>;
  soundEnabled: boolean;
  soundType: string;
  history: HistoryItem[];
  onToggleSetCompleted: (exId: string, sIdx: number) => void;
  onToggleSwapExercise: (exId: string) => void;
  onUpdateSetValues: (exId: string, sIdx: number, field: 'weight' | 'reps', delta: number) => void;
  onHandleRpeChange: (exId: string, sIdx: number, rpe: number) => void;
  onSetTimerRunning: (v: boolean) => void;
  onSetTimerLeft: (v: number) => void;
  onOpenPlateCalculator: (ex: { id: string; name: string; machineBase: number }) => void;
  onShowMachine: (type: string) => void;
  onProceedToCardio: () => void;
  onShowNotification: (msg: string) => void;
}) {
  return (
    <div className="space-y-4">
      {timerLeft > 0 && (
        <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" className="stroke-slate-800" strokeWidth="3" fill="transparent" />
                <circle cx="24" cy="24" r="20"
                  className="stroke-emerald-500 transition-all duration-1000" strokeWidth="3" fill="transparent"
                  strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * timerLeft) / (initialTimerLeft || 1)} />
              </svg>
              <span className="text-xs font-black text-emerald-400 font-mono">{timerLeft}s</span>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 uppercase font-bold">Descanso entre series</p>
              <p className="text-xs font-semibold text-slate-200">Recupérate para la próxima carga!</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onSetTimerLeft(timerLeft + 30)} className="bg-slate-850 text-slate-300 px-2.5 py-1 rounded-lg text-xs font-bold">+30s</button>
            <button onClick={() => { onSetTimerRunning(false); onSetTimerLeft(0); }} className="bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-lg text-xs font-bold">Saltar</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {workout.exercises.map((ex, exIdx) => {
          const allDone = ex.sets.every(s => s.completed);
          const isSwapped = swappedExercises[ex.id];
          const activeName = isSwapped ? ex.alternativeName : ex.name;

          return (
            <div key={ex.id} className={`bg-slate-900 border rounded-3xl p-5 shadow-lg ${allDone ? 'border-emerald-500/20 bg-emerald-950/5' : 'border-slate-800'}`}>
              <div className="pb-3 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-black text-slate-100">{exIdx + 1}. {activeName}</h3>
                  <p className="text-[11px] text-slate-400">Objetivo: {ex.target}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => { onShowMachine(ex.machineType); onShowNotification(`Abriendo plano de ${ex.name}`); }}
                    className="p-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg text-[10px] text-emerald-400 flex items-center gap-1 font-black shadow-sm">
                    Plano
                  </button>
                  <button type="button" onClick={() => onOpenPlateCalculator({ id: ex.id, name: ex.name, machineBase: ex.machineBase })}
                    className="p-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg text-[10px] text-slate-300 flex items-center gap-1 font-semibold"
                    title="Calculadora de Discos">
                    Discos
                  </button>
                  <button type="button" onClick={() => onToggleSwapExercise(ex.id)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold border transition-all ${
                      isSwapped ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' : 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-400'
                    }`}>
                    {isSwapped ? 'Máquina Swapped' : 'Ocupada'}
                  </button>
                  {allDone && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Hecho</span>}
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="grid grid-cols-12 text-[9px] text-slate-500 uppercase font-bold text-center">
                  <span className="col-span-1 text-left pl-1">Serie</span>
                  <span className="col-span-4">Carga (kg)</span>
                  <span className="col-span-3">Reps</span>
                  <span className="col-span-2">RPE</span>
                  <span className="col-span-2">Log</span>
                </div>
                {ex.sets.map((set, sIdx) => (
                  <SetRow key={sIdx} exId={ex.id} set={set} sIdx={sIdx}
                    onToggleSetCompleted={onToggleSetCompleted}
                    onUpdateSetValues={onUpdateSetValues}
                    onHandleRpeChange={onHandleRpeChange} />
                ))}
                <WeightSuggestion
                  exerciseId={ex.id}
                  currentWeight={ex.sets[0]?.weight || 0}
                  history={history}
                  onApply={() => { /* handled via individual set controls */ }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onProceedToCardio}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black py-4 rounded-2xl text-xs transition-all shadow-lg">
        Terminar Fuerza → Iniciar Cardio Final (30 min)
      </button>
    </div>
  );
}

function CardioPhase({
  cardioTimeLeft, cardioTimerRunning, selectedCardioType,
  onSetCardioTimerRunning, onSetCardioTimeLeft,
  onSetSelectedCardioType, onFinish, soundEnabled,
}: {
  cardioTimeLeft: number;
  cardioTimerRunning: boolean;
  selectedCardioType: string;
  onSetCardioTimerRunning: (v: boolean) => void;
  onSetCardioTimeLeft: (v: boolean) => void;
  onSetSelectedCardioType: (v: string) => void;
  onFinish: (notes: string) => void;
  soundEnabled: boolean;
}) {
  const [showHiit, setShowHiit] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
      <div className="border-b border-slate-800 pb-3">
        <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Fase Final de Oxidación</span>
        <h3 className="text-base font-black">Cardio Guiado de 30 Minutos</h3>
        <p className="text-xs text-slate-400 mt-1">Con el glucógeno bajo por las pesas, estos 30 minutos maximizan la quema de ácidos grasos.</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-400">Selecciona tu máquina de cardio</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          {CARDIO_OPTIONS.map(opt => (
            <div key={opt.id} onClick={() => onSetSelectedCardioType(opt.name)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedCardioType === opt.name ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200' : 'bg-slate-950 border-slate-850 text-slate-400'
              }`}>
              <p className="font-bold text-slate-200">{opt.name}</p>
              <p className="text-[10px] text-slate-500 mt-1">{opt.details}</p>
              <p className="text-[9px] text-emerald-400 font-bold mt-1">Quema est.: {opt.avgCals} kcal</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6 text-center space-y-3">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Tiempo Restante de Cardio</p>
        <p className="text-4xl font-black font-mono text-emerald-400">{formatTime(cardioTimeLeft)}</p>
        <div className="flex justify-center gap-3">
          <button onClick={() => onSetCardioTimerRunning(!cardioTimerRunning)}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
              cardioTimerRunning ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
            }`}>
            {cardioTimerRunning ? 'Pausar Tiempo' : 'Reanudar Tiempo'}
          </button>
          <button onClick={() => { if (confirm("¿Confirmas que terminaste la sesión de cardio?")) { onSetCardioTimeLeft(false); onSetCardioTimerRunning(false); } }}
            className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold">
            Omitir / Finalizar
          </button>
        </div>
      </div>

      <button
        onClick={() => setShowHiit(true)}
        className="w-full bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-rose-500/30 hover:border-rose-500/60 text-rose-300 hover:text-rose-200 font-black py-3.5 rounded-2xl text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <span className="text-base">🔥</span> HIIT Timer (Intervalos)
      </button>

      <button onClick={onFinish}
        className="w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-2xl text-xs shadow-lg">
        Terminar Todo y Registrar Entrenamiento
      </button>

      {showHiit && (
        <HIITTimer
          onClose={() => setShowHiit(false)}
          onShowNotification={() => {}}
          soundEnabled={soundEnabled}
        />
      )}
    </div>
  );
}
