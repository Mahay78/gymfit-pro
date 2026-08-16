import type { HistoryItem } from '../types';
import { calculateWeeklyMuscleVolume } from '../utils/muscleAnalytics';

interface Props {
  history: HistoryItem[];
}

export function MuscleHeatmap({ history }: Props) {
  const muscleVolumes = calculateWeeklyMuscleVolume(history);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Hipertrofia Semanal</span>
          <h3 className="text-base font-black text-slate-100 flex items-center gap-1.5">
            <span>🔥</span> Volumen por Grupo Muscular
          </h3>
          <p className="text-[11px] text-slate-400">Series efectivas completadas en los últimos 7 días.</p>
        </div>
      </div>

      {/* Guide tags */}
      <div className="flex items-center justify-between text-[10px] font-bold bg-slate-950 p-2.5 rounded-xl border border-slate-850">
        <span className="flex items-center gap-1 text-amber-400">
          <span className="w-2 h-2 rounded-full bg-amber-400" /> &lt;8: Mantenimiento
        </span>
        <span className="flex items-center gap-1 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" /> 10-20: Rango Óptimo
        </span>
        <span className="flex items-center gap-1 text-rose-400">
          <span className="w-2 h-2 rounded-full bg-rose-400" /> &gt;22: Fatiga Alta
        </span>
      </div>

      {/* Muscle Bars */}
      <div className="space-y-3">
        {muscleVolumes.map(mv => (
          <div key={mv.muscle} className="space-y-1.5 bg-slate-950/60 p-3 rounded-2xl border border-slate-850">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">{mv.muscle}</span>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${mv.color}15`,
                    color: mv.color,
                    border: `1px solid ${mv.color}30`,
                  }}
                >
                  {mv.status}
                </span>
                <span className="font-mono font-black text-slate-100">{mv.sets} series</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${mv.percentage}%`,
                  backgroundColor: mv.color,
                  boxShadow: `0 0 8px ${mv.color}50`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
