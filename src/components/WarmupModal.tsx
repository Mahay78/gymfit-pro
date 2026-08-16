import { calculateWarmupSets } from '../utils/warmupCalculator';

interface Props {
  exerciseName: string;
  workingWeight: number;
  machineBase?: number;
  onClose: () => void;
}

export function WarmupModal({ exerciseName, workingWeight, machineBase = 0, onClose }: Props) {
  const warmupSets = calculateWarmupSets(workingWeight, machineBase);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden mobile-bottom-sheet text-left">
        <div className="w-12 h-1.5 bg-slate-700/60 rounded-full mx-auto my-2 sm:hidden flex-shrink-0" />
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Aproximación Progresiva</span>
            <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
              <span>🔥</span> Series de Calentamiento
            </h3>
            <p className="text-xs text-slate-400 font-medium truncate">{exerciseName} • Objetivo: {workingWeight} kg</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar aproximación"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center text-sm font-bold active:scale-95 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-850">
            💡 <strong>Objetivo:</strong> Preparar tus tendones, articulaciones y sistema nervioso para mover <strong>{workingWeight}kg</strong> sin generar fatiga previa.
          </p>

          <div className="space-y-2.5">
            {warmupSets.map((ws, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl flex items-center justify-between gap-3 hover:border-slate-750 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-black text-xs font-mono">
                    W{ws.setNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-slate-100">{ws.weight} kg</span>
                      <span className="text-slate-400 font-bold text-xs">× {ws.reps} reps</span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-1.5 py-0.5 rounded">
                        {ws.percentage}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{ws.purpose}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 font-mono text-[10px] text-slate-500">
                  <span>⏱️ {ws.restSeconds}s desc.</span>
                </div>
              </div>
            ))}

            {/* Target Working Set Banner */}
            <div className="bg-gradient-to-r from-accent/10 to-transparent border border-accent/30 p-3.5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent text-slate-950 flex items-center justify-center font-black text-xs">
                  ⚡
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-accent">{workingWeight} kg</span>
                    <span className="text-slate-200 font-bold text-xs">Series Efectivas (100%)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">¡A dar tu máximo esfuerzo!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl active:scale-98 transition-all"
          >
            Listo para entrenar
          </button>
        </div>
      </div>
    </div>
  );
}
