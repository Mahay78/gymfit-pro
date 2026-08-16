import { useState } from 'react';
import type { HistoryItem } from '../types';
import { ShareCardModal } from './ShareCardModal';
import { shareViaWhatsApp } from '../utils/shareMotivation';
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

  const handleShareCard = () => {
    if (latestHistory) {
      setShowCardModal(true);
    } else {
      onShowNotification('Completa tu primer entrenamiento para generar tu tarjeta');
    }
  };

  const handleWhatsAppChallenge = () => {
    if (!latestHistory) {
      onShowNotification('Completa un entrenamiento antes de retar a tus amigos');
      return;
    }

    shareViaWhatsApp({
      athleteName: 'Tu compañero',
      workoutTitle: latestHistory.dayTitle,
      volume: latestHistory.totalVolume,
      duration: latestHistory.duration,
      streak: streak.current > 0 ? streak.current : undefined,
    });
    onShowNotification('Abriendo WhatsApp para enviar el reto...');
  };

  return (
    <>
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Comunidad & Retos</span>
            <h3 className="text-base font-black">Compartir Progreso</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Reta a tus amigos o exporta tu tarjeta visual</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleWhatsAppChallenge}
            className="bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-black py-3 rounded-2xl text-xs active:scale-95 flex items-center justify-center gap-1.5 transition-all shadow-sm"
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
