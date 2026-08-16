import { useState } from 'react';
import type { Workout } from '../types';
import { formatTime } from '../utils/format';

interface Props {
  workout: Workout;
  timerLeft: number;
  activeWorkoutTime: number;
  onToggleSetCompleted: (exId: string, sIdx: number) => void;
  onUpdateSetValues: (exId: string, sIdx: number, field: 'weight' | 'reps', delta: number) => void;
  onClose: () => void;
}

export function FocusGymMode({
  workout,
  timerLeft,
  activeWorkoutTime,
  onToggleSetCompleted,
  onUpdateSetValues,
  onClose,
}: Props) {
  // Encontrar el primer ejercicio con series pendientes
  const activeExIdx = workout.exercises.findIndex(e => e.sets.some(s => !s.completed));
  const currentEx = activeExIdx !== -1 ? workout.exercises[activeExIdx] : workout.exercises[0];
  const pendingSetIdx = currentEx?.sets.findIndex(s => !s.completed);
  const currentSetIdx = pendingSetIdx !== -1 ? pendingSetIdx : 0;
  const currentSet = currentEx?.sets[currentSetIdx];

  const [voiceOn, setVoiceOn] = useState(true);

  if (!currentEx || !currentSet) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between p-6 select-none animate-fadeIn">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-mono font-black text-emerald-400 tracking-wider">
            FOCUS GYM • OLED MODE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceOn(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              voiceOn ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'border-white/10 text-white/40'
            }`}
          >
            {voiceOn ? '🗣️ Voz ON' : '🗣️ Voz OFF'}
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center text-sm border border-white/10 active:scale-95"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main Focus Center */}
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 my-auto">
        {timerLeft > 0 ? (
          /* Huge Rest Timer */
          <div className="space-y-3 animate-pop">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Descanso en Curso
            </span>
            <div className="text-8xl sm:text-9xl font-mono font-black text-emerald-400 tracking-tighter tabular-nums drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]">
              {timerLeft}s
            </div>
            <p className="text-sm text-neutral-400 font-medium">Prepárate para la serie #{currentSet.setNumber}</p>
          </div>
        ) : (
          /* Active Set View */
          <div className="w-full max-w-sm space-y-6">
            <div>
              <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold block mb-1">
                Ejercicio {activeExIdx + 1} de {workout.exercises.length}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {currentEx.name}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">Serie #{currentSet.setNumber} de {currentEx.sets.length}</p>
            </div>

            {/* Huge Weight & Reps adjustments */}
            <div className="grid grid-cols-2 gap-4">
              {/* Weight */}
              <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-3xl space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Carga (kg)</span>
                <div className="text-4xl font-mono font-black text-emerald-400">{currentSet.weight}</div>
                <div className="flex gap-2 justify-center pt-1">
                  <button
                    onClick={() => onUpdateSetValues(currentEx.id, currentSetIdx, 'weight', -2.5)}
                    className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-2xl text-xl font-black active:scale-90"
                  >
                    −
                  </button>
                  <button
                    onClick={() => onUpdateSetValues(currentEx.id, currentSetIdx, 'weight', 2.5)}
                    className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-2xl text-xl font-black active:scale-90"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Reps */}
              <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-3xl space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Reps</span>
                <div className="text-4xl font-mono font-black text-white">{currentSet.reps}</div>
                <div className="flex gap-2 justify-center pt-1">
                  <button
                    onClick={() => onUpdateSetValues(currentEx.id, currentSetIdx, 'reps', -1)}
                    className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-2xl text-xl font-black active:scale-90"
                  >
                    −
                  </button>
                  <button
                    onClick={() => onUpdateSetValues(currentEx.id, currentSetIdx, 'reps', 1)}
                    className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-2xl text-xl font-black active:scale-90"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Giant Complete Button */}
            <button
              onClick={() => onToggleSetCompleted(currentEx.id, currentSetIdx)}
              className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-base rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>✓</span> COMPLETAR SERIE #{currentSet.setNumber}
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-white/10 pt-3 flex items-center justify-between text-xs text-neutral-500 font-mono">
        <span>⏱️ Tiempo Total: {formatTime(activeWorkoutTime)}</span>
        <span>🔥 0% Distracción</span>
      </div>
    </div>
  );
}
