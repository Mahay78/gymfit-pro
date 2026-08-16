import { useState, useId } from 'react';
import { calculateOneRepMax } from '../utils/oneRepMax';

interface Props {
  initialWeight?: number;
  initialReps?: number;
  exerciseName?: string;
  onClose: () => void;
}

export function OneRepMaxModal({
  initialWeight = 80,
  initialReps = 8,
  exerciseName,
  onClose,
}: Props) {
  const [weight, setWeight] = useState(initialWeight > 0 ? initialWeight : 80);
  const [reps, setReps] = useState(initialReps > 0 ? initialReps : 8);
  const [activeFormula, setActiveFormula] = useState<'average' | 'epley' | 'brzycki' | 'wathan'>('average');

  const weightInputId = useId();
  const repsInputId = useId();

  const results = calculateOneRepMax(weight, reps);

  const displayMax =
    activeFormula === 'epley'
      ? results.epley
      : activeFormula === 'brzycki'
      ? results.brzycki
      : activeFormula === 'wathan'
      ? results.wathan
      : results.average;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden mobile-bottom-sheet text-left">
        <div className="w-12 h-1.5 bg-slate-700/60 rounded-full mx-auto my-2 sm:hidden flex-shrink-0" />
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Herramienta de Carga</span>
            <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
              <span>🎯</span> Calculadora 1RM
            </h3>
            {exerciseName && <p className="text-xs text-slate-400 font-medium truncate">{exerciseName}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar calculadora 1RM"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center text-sm font-bold active:scale-95 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Input Controls */}
          <div className="grid grid-cols-2 gap-3">
            {/* Weight Input */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
              <label htmlFor={weightInputId} className="text-[11px] font-bold text-slate-400 block">
                Peso Levantado (kg)
              </label>
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => setWeight(w => Math.max(0, w - 2.5))}
                  className="w-8 h-8 bg-slate-900 rounded-lg text-slate-300 font-bold border border-slate-800 active:scale-90"
                >
                  -
                </button>
                <input
                  id={weightInputId}
                  type="number"
                  step="0.5"
                  min="0"
                  value={weight}
                  onChange={e => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-16 text-center font-mono font-black text-base bg-transparent focus:outline-none text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setWeight(w => w + 2.5)}
                  className="w-8 h-8 bg-slate-900 rounded-lg text-slate-300 font-bold border border-slate-800 active:scale-90"
                >
                  +
                </button>
              </div>
            </div>

            {/* Reps Input */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
              <label htmlFor={repsInputId} className="text-[11px] font-bold text-slate-400 block">
                Repeticiones
              </label>
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => setReps(r => Math.max(1, r - 1))}
                  className="w-8 h-8 bg-slate-900 rounded-lg text-slate-300 font-bold border border-slate-800 active:scale-90"
                >
                  -
                </button>
                <input
                  id={repsInputId}
                  type="number"
                  min="1"
                  max="30"
                  value={reps}
                  onChange={e => setReps(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                  className="w-12 text-center font-mono font-black text-base bg-transparent focus:outline-none text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setReps(r => Math.min(30, r + 1))}
                  className="w-8 h-8 bg-slate-900 rounded-lg text-slate-300 font-bold border border-slate-800 active:scale-90"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Primary Result Banner */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-accent/30 rounded-2xl p-4 text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Repetición Máxima Estimada
            </span>
            <div className="flex items-baseline justify-center gap-1.5 my-1">
              <span className="text-4xl font-black font-mono text-accent">{displayMax}</span>
              <span className="text-sm font-bold text-slate-400">kg</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Basado en {weight} kg × {reps} {reps === 1 ? 'repetición' : 'repeticiones'}
            </p>

            {/* Formula Selector Tabs */}
            <div className="flex items-center justify-center gap-1 mt-3 bg-slate-950/70 p-1 rounded-xl border border-slate-800/80">
              <button
                type="button"
                onClick={() => setActiveFormula('average')}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all ${
                  activeFormula === 'average' ? 'bg-accent text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Promedio
              </button>
              <button
                type="button"
                onClick={() => setActiveFormula('epley')}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all ${
                  activeFormula === 'epley' ? 'bg-accent text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Epley
              </button>
              <button
                type="button"
                onClick={() => setActiveFormula('brzycki')}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all ${
                  activeFormula === 'brzycki' ? 'bg-accent text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Brzycki
              </button>
              <button
                type="button"
                onClick={() => setActiveFormula('wathan')}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all ${
                  activeFormula === 'wathan' ? 'bg-accent text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Wathan
              </button>
            </div>
          </div>

          {/* Percentages & Training Zones Table */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold text-slate-300">Zonas de Intensidad & Cargas</span>
              <span className="text-[10px] text-slate-400">Reps aprox.</span>
            </div>

            <div className="bg-slate-950 rounded-2xl border border-slate-850 divide-y divide-slate-850/80 overflow-hidden">
              {results.percentages.map(item => (
                <div
                  key={item.percentage}
                  className="flex items-center justify-between px-3.5 py-2 hover:bg-slate-900/60 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`font-mono font-black text-[11px] px-1.5 py-0.5 rounded ${
                        item.percentage >= 90
                          ? 'bg-rose-500/20 text-rose-400'
                          : item.percentage >= 80
                          ? 'bg-amber-500/20 text-amber-400'
                          : item.percentage >= 70
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-cyan-500/20 text-cyan-400'
                      }`}
                    >
                      {item.percentage}%
                    </span>
                    <span className="text-slate-300 truncate text-[11px] font-medium">{item.zoneName}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono font-bold flex-shrink-0">
                    <span className="text-slate-400 text-[11px]">~{item.estimatedReps} reps</span>
                    <span className="text-accent min-w-[50px] text-right">{item.weight} kg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl active:scale-98 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
