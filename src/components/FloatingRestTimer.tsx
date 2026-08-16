interface Props {
  timerLeft: number;
  onAddSeconds: (sec: number) => void;
  onNavigateToWorkout: () => void;
  onSkipTimer: () => void;
}

export function FloatingRestTimer({
  timerLeft,
  onAddSeconds,
  onNavigateToWorkout,
  onSkipTimer,
}: Props) {
  if (timerLeft <= 0) return null;

  return (
    <aside
      aria-label="Temporizador de descanso en segundo plano"
      className="fixed bottom-20 right-4 z-40 bg-slate-900/95 border border-accent/50 rounded-2xl p-3 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-slideUp select-none max-w-[280px]"
    >
      <button
        onClick={onNavigateToWorkout}
        className="flex items-center gap-2 text-left active:scale-95 transition-transform flex-1"
        title="Volver a la pantalla de entrenamiento"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping flex-shrink-0" />
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block leading-none">Descanso</span>
          <span className="text-lg font-mono font-black text-accent leading-none">{timerLeft}s</span>
        </div>
      </button>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onAddSeconds(15)}
          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg active:scale-90 transition-transform"
          title="Añadir 15 segundos"
        >
          +15s
        </button>
        <button
          onClick={onSkipTimer}
          className="w-7 h-7 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 text-xs font-bold rounded-lg flex items-center justify-center active:scale-90 transition-transform"
          title="Saltar descanso"
        >
          ✕
        </button>
      </div>
    </aside>
  );
}
