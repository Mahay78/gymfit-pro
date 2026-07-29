import type { HistoryItem, BodyMeasurement, CardioSession, Achievement } from '../types';
import { calculateAchievements } from '../data/achievements';

interface Props {
  history: HistoryItem[];
  bodyMeasurements: BodyMeasurement[];
  cardioSessions: CardioSession[];
  startWeight: number;
  currentWeight: number;
}

export function Achievements({ history, bodyMeasurements, cardioSessions, startWeight, currentWeight }: Props) {
  const achievements = calculateAchievements(history, bodyMeasurements, cardioSessions, startWeight, currentWeight);
  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Tu colección</p>
        <p className="text-xs font-bold text-slate-300">
          {unlocked.length} / {achievements.length}
        </p>
      </div>

      {unlocked.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {unlocked.map(a => (
            <div
              key={a.id}
              className="bg-gradient-to-br from-emerald-500/20 to-emerald-900/10 border border-emerald-500/30 rounded-2xl p-3 text-center"
            >
              <div className="text-3xl mb-1">{a.icon}</div>
              <p className="text-[10px] font-black text-emerald-400 uppercase">{a.name}</p>
              <p className="text-[9px] text-slate-400 mt-1 leading-tight">{a.description}</p>
            </div>
          ))}
        </div>
      )}

      {locked.length > 0 && (
        <>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider pt-2">Por desbloquear</p>
          <div className="grid grid-cols-3 gap-2">
            {locked.map(a => (
              <div
                key={a.id}
                className="bg-slate-950 border border-slate-850 rounded-2xl p-3 text-center opacity-50"
              >
                <div className="text-3xl mb-1 grayscale">🔒</div>
                <p className="text-[10px] font-black text-slate-500 uppercase">{a.name}</p>
                <p className="text-[9px] text-slate-600 mt-1 leading-tight">{a.description}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {unlocked.length === 0 && (
        <p className="text-xs text-slate-500 text-center py-3">
          Completa tu primer entrenamiento para empezar a desbloquear logros.
        </p>
      )}
    </div>
  );
}
