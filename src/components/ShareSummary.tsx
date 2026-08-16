import { useState } from 'react';
import type { HistoryItem } from '../types';
import { ShareCardModal } from './ShareCardModal';
import { shareViaWhatsApp, createChallengeUrl } from '../utils/shareMotivation';
import { calculateStreak } from '../utils/analytics';

interface Props {
  history: HistoryItem[];
  userWeight: number;
  startWeight: number;
  onShowNotification: (msg: string) => void;
}

export function ShareSummary({ history, userWeight, startWeight: _startWeight, onShowNotification }: Props) {
  const [showCardModal, setShowCardModal] = useState(false);
  const latestHistory = history[0];
  const streak = calculateStreak(history);

  // Si aún no hay entrenamientos guardados, usamos una plantilla de ejemplo para que siempre funcione
  const activeWorkoutTitle = latestHistory?.dayTitle || 'Full Body A: Fuerza & Torso';
  const activeVolume = latestHistory?.totalVolume || 3850;
  const activeDuration = latestHistory?.duration || '45 min';
  const activeStreak = streak.current > 0 ? streak.current : 1;

  const handleShareCard = () => {
    if (latestHistory) {
      setShowCardModal(true);
    } else {
      onShowNotification('Completa tu primer entrenamiento para generar tu tarjeta oficial');
    }
  };

  const handleWhatsAppChallenge = () => {
    shareViaWhatsApp({
      athleteName: 'Tu compañero',
      workoutTitle: activeWorkoutTitle,
      volume: activeVolume,
      duration: activeDuration,
      streak: activeStreak,
    });
    onShowNotification('Abriendo WhatsApp con tu reto interactivo...');
  };

  const handleCopyLinkOnly = async () => {
    const url = createChallengeUrl({
      athleteName: 'Tu compañero',
      workoutTitle: activeWorkoutTitle,
      volume: activeVolume,
      duration: activeDuration,
      streak: activeStreak,
    });
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        onShowNotification('¡Enlace del Reto copiado al portapapeles! 📋');
      } else {
        prompt('Copia este enlace para enviarlo por WhatsApp:', url);
      }
    } catch {
      prompt('Copia este enlace para enviarlo por WhatsApp:', url);
    }
  };

  return (
    <>
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Comunidad & Retos</span>
            <h3 className="text-base font-black">Compartir Progreso</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Reta a tus amigos por WhatsApp o genera tu tarjeta</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleWhatsAppChallenge}
            className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 font-black py-3 rounded-2xl text-xs active:scale-95 flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <span>📲</span> Reto WhatsApp
          </button>

          <button
            onClick={handleShareCard}
            className="bg-accent hover:opacity-90 text-slate-950 font-black py-3 rounded-2xl text-xs active:scale-95 flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-accent/20"
          >
            <span>✨</span> Tarjeta Visual
          </button>
        </div>

        <button
          onClick={handleCopyLinkOnly}
          className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 font-bold py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <span>🔗</span> Copiar solo el enlace interactivo
        </button>
      </div>

      {showCardModal && latestHistory && (
        <ShareCardModal
          historyItem={latestHistory}
          userWeight={userWeight}
          onClose={() => setShowCardModal(false)}
        />
      )}
    </>
  );
}
