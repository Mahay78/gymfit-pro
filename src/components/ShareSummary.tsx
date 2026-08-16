import { useState } from 'react';
import type { HistoryItem } from '../types';
import { ShareCardModal } from './ShareCardModal';

interface Props {
  history: HistoryItem[];
  userWeight: number;
  startWeight: number;
  onShowNotification: (msg: string) => void;
}

export function ShareSummary({ history, userWeight, startWeight: _startWeight, onShowNotification }: Props) {
  const [showCardModal, setShowCardModal] = useState(false);

  const latestHistory = history[0];

  const handleShare = async () => {
    if (latestHistory) {
      setShowCardModal(true);
    } else {
      onShowNotification('Completa tu primer entrenamiento para generar tu tarjeta');
    }
  };

  return (
    <>
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Tarjeta Social</span>
            <h3 className="text-base font-black">Mi Progreso & Racha</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Genera tu tarjeta visual de logros</p>
          </div>
          <button
            onClick={handleShare}
            className="bg-accent hover:opacity-90 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs active:scale-95 flex items-center gap-1.5 min-h-[40px] shadow-lg shadow-accent/20 transition-all"
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
