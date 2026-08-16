import type { HistoryItem } from '../types';
import { calculateStreak } from '../utils/analytics';

interface Props {
  history: HistoryItem[];
  onStartWorkout: () => void;
}

export function StreakCard({ history, onStartWorkout }: Props) {
  const streak = calculateStreak(history);
  const hasInactive = streak.lastWorkoutDaysAgo !== null && streak.lastWorkoutDaysAgo >= 3;
  const isUrgent = streak.lastWorkoutDaysAgo !== null && streak.lastWorkoutDaysAgo >= 5;

  return (
    <div className={`rounded-3xl p-5 border shadow-xl ${
      isUrgent
        ? 'bg-gradient-to-br from-rose-500/10 to-amber-500/5 border-rose-500/30'
        : streak.current >= 3
          ? 'bg-gradient-to-br from-amber-500/15 to-amber-900/5 border-amber-500/30'
          : 'bg-slate-900 border-slate-800'
    }`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{streak.current >= 3 ? '🔥' : '🎯'}</span>
            <div>
              <p className="text-2xl font-black text-slate-100 leading-none">
                {streak.current} <span className="text-xs text-slate-400">días</span>
              </p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-0.5">Racha actual</p>
            </div>
          </div>
          {streak.longest > streak.current && (
            <p className="text-[10px] text-slate-500 mt-2">Mejor racha: <strong className="text-slate-300">{streak.longest} días</strong></p>
          )}
          {streak.lastWorkoutDaysAgo !== null && (
            <p className="text-[10px] text-slate-500 mt-1">
              Último entreno: hace <strong className={hasInactive ? 'text-rose-400' : 'text-slate-300'}>{streak.lastWorkoutDaysAgo} días</strong>
            </p>
          )}
          {streak.perfectWeek && (
            <p className="text-[10px] text-accent mt-1">🌟 ¡Semana perfecta! 3/3 días</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={onStartWorkout}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs active:scale-95 min-h-[40px]"
          >
            {hasInactive ? 'Retomar ya' : 'Entrenar hoy'}
          </button>
        </div>
      </div>
      {hasInactive && (
        <div className="mt-3 pt-3 border-t border-slate-800/50">
          <p className="text-[10px] text-rose-300">
            ⚠️ {isUrgent ? 'Llevas más de 5 días sin entrenar. ¡Tu racha está en riesgo!' : 'No rompas tu racha. ¡Vuelve hoy!'}
          </p>
        </div>
      )}
    </div>
  );
}
