import { formatTime } from '../utils/format';

interface Props {
  isOnline: boolean;
  workoutActive: boolean;
  workoutPhase: string;
  activeWorkoutTime: number;
}

export function Header({ isOnline, workoutActive, workoutPhase, activeWorkoutTime }: Props) {
  return (
    <header className="sticky top-0 bg-slate-950/70 backdrop-blur-xl border-b border-white/5 z-40 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="relative bg-gradient-to-br from-accent to-accent/70 text-slate-950 p-2 sm:p-2.5 rounded-xl shadow-lg shadow-accent/30 flex-shrink-0 ring-1 ring-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-5.5 sm:w-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent truncate">
              GymFit Pro
            </h1>
            <div className="hidden sm:flex items-center gap-1.5 mt-0.5">
              <p className="text-[10px] text-accent uppercase tracking-widest font-extrabold">
                Ondulado A/B • Esculpido Inteligente
              </p>
              {!isOnline && (
                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold animate-pulse">
                  📡 Offline
                </span>
              )}
            </div>
            {!isOnline && (
              <span className="sm:hidden bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold animate-pulse inline-block mt-0.5">
                📡 Offline
              </span>
            )}
          </div>
        </div>

        {workoutActive && workoutPhase !== 'victory' && (
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-xl flex-shrink-0 ring-1 ring-rose-500/20">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-bold text-rose-400 font-mono tabular-nums">{formatTime(activeWorkoutTime)}</span>
          </div>
        )}
      </div>
    </header>
  );
}
