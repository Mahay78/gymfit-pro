import { useState } from 'react';
import { predictGoalDate } from '../utils/analytics';

interface Props {
  currentWeight: number;
  goalWeight: number;
  startWeight: number;
  onSaveGoal: (w: number) => void;
  onShowNotification: (msg: string) => void;
}

export function GoalWeightCard({ currentWeight, goalWeight, startWeight, onSaveGoal, onShowNotification }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(goalWeight));

  const total = Math.max(0.1, startWeight - goalWeight);
  const lost = Math.max(0, startWeight - currentWeight);
  const pct = Math.min(100, Math.max(0, (lost / total) * 100));
  const remaining = Math.max(0, currentWeight - goalWeight);
  const prediction = predictGoalDate(startWeight, currentWeight, goalWeight);

  const handleSave = () => {
    const v = parseFloat(draft);
    if (isNaN(v) || v <= 0) {
      onShowNotification('Peso objetivo inválido');
      return;
    }
    onSaveGoal(v);
    setEditing(false);
    onShowNotification('Objetivo actualizado');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Objetivo</span>
          <h3 className="text-base font-black">Peso Meta: {goalWeight} kg</h3>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="bg-slate-950 border border-slate-800 text-slate-300 hover:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95"
        >
          {editing ? 'Cancelar' : '✏️ Cambiar'}
        </button>
      </div>

      {editing ? (
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            className="flex-1 bg-slate-950 border border-emerald-500/40 p-2.5 rounded-xl text-slate-100 font-bold focus:outline-none text-sm"
          />
          <button onClick={handleSave} className="bg-emerald-500 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs">
            Guardar
          </button>
        </div>
      ) : (
        <>
          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
              <span>Inicio: <strong className="text-slate-200">{startWeight} kg</strong></span>
              <span>Actual: <strong className="text-slate-200">{currentWeight} kg</strong></span>
            </div>
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  pct >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] mt-1.5">
              <span className="text-emerald-400 font-bold">{lost.toFixed(1)} kg perdidos</span>
              <span className="text-amber-400 font-bold">{remaining.toFixed(1)} kg restantes</span>
            </div>
          </div>

          {prediction && (
            <div className="pt-2 border-t border-slate-800">
              <p className="text-[10px] text-slate-400">
                📅 <span className="text-slate-300 font-bold">Predicción:</span>{' '}
                {prediction.date === '—' ? (
                  <span className="text-rose-400">Sin progreso reciente</span>
                ) : prediction.date === '¡Objetivo alcanzado!' ? (
                  <span className="text-emerald-400 font-bold">¡Objetivo alcanzado!</span>
                ) : (
                  <>
                    <span className="text-slate-200 font-bold">{prediction.date}</span>
                    {prediction.weeks !== Infinity && (
                      <span className="text-slate-500"> ({prediction.weeks} semanas)</span>
                    )}
                    <span className={`ml-1 ${prediction.isOnTrack ? 'text-emerald-400' : 'text-amber-400'}`}>
                      · {prediction.ratePerWeek} kg/sem
                    </span>
                  </>
                )}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
