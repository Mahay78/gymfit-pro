import { useRef } from 'react';
import type { HistoryItem } from '../types';

interface Props {
  historyItem: HistoryItem;
  userWeight?: number;
  onClose: () => void;
}

export function ShareCardModal({ historyItem, userWeight, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    const text = `🏋️ Acabo de completar "${historyItem.dayTitle}" en GymFit Pro!\n⏱️ Duración: ${historyItem.duration}\n📊 Volumen total: ${historyItem.totalVolume} kg levantados\n✅ ${historyItem.completedExercises} ejercicios completados`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GymFit Pro — Resumen de Entrenamiento',
          text,
        });
      } catch {
        // User cancelled or not supported
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('¡Resumen copiado al portapapeles!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-sm flex flex-col shadow-2xl overflow-hidden mobile-bottom-sheet text-left">
        <div className="w-12 h-1.5 bg-slate-700/60 rounded-full mx-auto my-2 sm:hidden flex-shrink-0" />
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Tarjeta de Logro</span>
            <h3 className="text-sm font-black text-slate-100">Compartir Entrenamiento</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center text-sm font-bold active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Visual Share Card */}
        <div className="p-4 flex flex-col items-center">
          <div
            ref={cardRef}
            className="w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-accent/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden space-y-4"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

            {/* Brand */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-accent text-slate-950 flex items-center justify-center font-black text-sm">
                  ⚡
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-tight text-slate-100">GymFit Pro</h4>
                  <p className="text-[9px] text-accent font-bold">BURN & TONE</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-mono font-bold">{historyItem.date}</span>
            </div>

            {/* Workout Title */}
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Sesión Realizada</span>
              <h3 className="text-base font-black text-slate-100 mt-0.5 leading-tight">{historyItem.dayTitle}</h3>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-[9px] font-sans text-slate-400 uppercase font-bold block">Volumen Total</span>
                <span className="text-base font-black text-accent">{historyItem.totalVolume} kg</span>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-[9px] font-sans text-slate-400 uppercase font-bold block">Duración</span>
                <span className="text-base font-black text-slate-100">{historyItem.duration}</span>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-[9px] font-sans text-slate-400 uppercase font-bold block">Ejercicios</span>
                <span className="text-base font-black text-cyan-400">{historyItem.completedExercises} compl.</span>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-[9px] font-sans text-slate-400 uppercase font-bold block">Peso Corporal</span>
                <span className="text-base font-black text-amber-400">{userWeight || historyItem.weight} kg</span>
              </div>
            </div>

            {/* Footer Badge */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="text-slate-400 font-medium">Fuerza • Déficit • Consistencia</span>
              <span className="text-emerald-400 font-bold">100% Completado ✓</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 py-3 bg-accent hover:opacity-90 text-slate-950 font-black text-xs rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>📲</span> Compartir / Copiar
          </button>
        </div>
      </div>
    </div>
  );
}
