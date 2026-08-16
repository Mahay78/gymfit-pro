import type { ChallengeShareData } from '../utils/shareMotivation';

interface Props {
  data: ChallengeShareData;
  onAccept: () => void;
  onClose: () => void;
}

export function ChallengeModal({ data, onAccept, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none text-left">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-accent/40 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 shadow-2xl overflow-hidden mobile-bottom-sheet relative space-y-5">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

        {/* Grab bar */}
        <div className="w-12 h-1.5 bg-slate-700/60 rounded-full mx-auto -mt-2 sm:hidden flex-shrink-0" />

        {/* Celebration Header */}
        <div className="text-center space-y-1">
          <div className="text-5xl animate-bounce mb-2">🔥</div>
          <span className="text-[10px] text-accent font-black uppercase tracking-widest bg-accent/10 border border-accent/20 px-3 py-1 rounded-full inline-block">
            RETO DE ENTRENAMIENTO ACTIVADO
          </span>
          <h2 className="text-xl font-black text-white mt-1">¡{data.athleteName} te ha desafiado!</h2>
        </div>

        {/* Stats Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            Tu compañero acaba de completar su sesión en <strong>GymFit Pro</strong> con estas marcas:
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] font-sans text-slate-400 uppercase font-bold block">Sesión</span>
              <span className="font-bold text-slate-200 truncate block">{data.workoutTitle}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] font-sans text-slate-400 uppercase font-bold block">Volumen Movido</span>
              <span className="font-black text-accent">{data.volume.toLocaleString()} kg</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] font-sans text-slate-400 uppercase font-bold block">Duración</span>
              <span className="font-bold text-slate-200">{data.duration}</span>
            </div>
            {data.streak && (
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9px] font-sans text-slate-400 uppercase font-bold block">Racha Activa</span>
                <span className="font-black text-amber-400">🔥 {data.streak} días</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-center text-slate-400 font-medium">
          ¿Aceptas el reto de entrenar hoy y no quedarte atrás?
        </p>

        {/* Action buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onAccept}
            className="w-full py-3.5 bg-gradient-to-r from-accent to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-accent/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>💪</span> ¡ACEPTO EL RETO! → ELEGIR RUTINA
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 font-bold text-xs rounded-xl active:scale-95 transition-all"
          >
            Quizás más tarde
          </button>
        </div>
      </div>
    </div>
  );
}
