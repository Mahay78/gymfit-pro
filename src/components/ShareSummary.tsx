import { useState } from 'react';
import type { HistoryItem } from '../types';
import { calculateStreak } from '../utils/analytics';

interface Props {
  history: HistoryItem[];
  userWeight: number;
  startWeight: number;
  onShowNotification: (msg: string) => void;
}

export function ShareSummary({ history, userWeight, startWeight, onShowNotification }: Props) {
  const [open, setOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const streak = calculateStreak(history);

  const generateSummary = () => {
    const last7 = history.slice(0, 7);
    const totalVolume = last7.reduce((s, h) => s + h.totalVolume, 0);
    const totalWorkouts = last7.length;
    const weightLost = startWeight > 0 ? Math.max(0, startWeight - userWeight) : 0;

    const lines = [
      '🏋️ *Mi semana en GymFit Pro*',
      '',
      `🔥 Racha: ${streak.current} días`,
      `💪 Entrenamientos: ${totalWorkouts}`,
      `📊 Volumen total: ${(totalVolume / 1000).toFixed(1)} toneladas`,
      `⚖️ Peso: ${userWeight} kg${weightLost > 0 ? ` (-${weightLost.toFixed(1)} kg desde inicio)` : ''}`,
      '',
      '¡A por la semana que viene! 💚',
    ];

    const text = lines.join('\n');
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    onShowNotification('Resumen generado. ¡Compártelo!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi progreso en GymFit Pro',
          text: `🔥 Racha: ${streak.current} días · 💪 ${history.length} entrenos · ⚖️ ${userWeight} kg`,
        });
      } catch {
        // usuario canceló
      }
    } else {
      generateSummary();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Compartir</span>
          <h3 className="text-base font-black">Mi Progreso</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Comparte tu racha con amigos</p>
        </div>
        <button
          onClick={handleShare}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs active:scale-95 flex items-center gap-1.5 min-h-[40px]"
        >
          <span>📤</span> Compartir
        </button>
      </div>
    </div>
  );
}
