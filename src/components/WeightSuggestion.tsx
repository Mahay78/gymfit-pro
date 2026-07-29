import type { HistoryItem } from '../types';
import { getRPERecommendation } from '../utils/training';

interface Props {
  exerciseId: string;
  currentWeight: number;
  history: HistoryItem[];
  onApply?: (weight: number) => void;
}

export function WeightSuggestion({ exerciseId, currentWeight, history, onApply }: Props) {
  const rec = getRPERecommendation(exerciseId, currentWeight, history);
  if (!rec) return null;

  const colorMap = {
    increase: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
    maintain: { bg: 'bg-slate-800/40', border: 'border-slate-700', text: 'text-slate-400' },
    decrease: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  };
  const c = colorMap[rec.action];

  if (rec.action === 'maintain' && rec.lastRPE === 0) return null;

  return (
    <div className={`mt-2 p-2 rounded-lg ${c.bg} border ${c.border} text-[10px]`}>
      <div className="flex items-center justify-between gap-2">
        <p className={`flex-1 ${c.text}`}>
          💡 {rec.message}
        </p>
        {onApply && rec.action !== 'maintain' && rec.suggestedWeight !== rec.currentWeight && (
          <button
            onClick={() => onApply(rec.suggestedWeight)}
            className={`${c.text} font-black px-2 py-0.5 rounded border ${c.border} hover:opacity-80`}
          >
            Aplicar {rec.suggestedWeight}kg
          </button>
        )}
      </div>
    </div>
  );
}
