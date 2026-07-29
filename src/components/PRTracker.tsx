import type { HistoryItem, Exercise } from '../types';
import { ROUTINE_WEEK_A, ROUTINE_WEEK_B } from '../data/routines';
import { ROUTINE_FULLBODY } from '../data/fullbody';
import { ROUTINE_PPL } from '../data/ppl';
import { ROUTINE_UPPER_LOWER } from '../data/upperLower';
import { ROUTINE_PPL_UPPER } from '../data/pplUpper';
import { ROUTINE_BRO_SPLIT } from '../data/broSplit';

interface PR {
  exerciseId: string;
  exerciseName: string;
  oneRepMax: number;
  bestVolume: number;
  date: string;
  trend: 'up' | 'down' | 'same';
}

interface Props {
  history: HistoryItem[];
  customWeights: Record<string, number>;
}

const ALL_EXERCISES: Exercise[] = [
  ...ROUTINE_WEEK_A.flatMap(d => d.exercises),
  ...ROUTINE_WEEK_B.flatMap(d => d.exercises),
  ...ROUTINE_FULLBODY.flatMap(d => d.exercises),
  ...ROUTINE_PPL.flatMap(d => d.exercises),
  ...ROUTINE_UPPER_LOWER.flatMap(d => d.exercises),
  ...ROUTINE_PPL_UPPER.flatMap(d => d.exercises),
  ...ROUTINE_BRO_SPLIT.flatMap(d => d.exercises),
];

const uniqueExercises = Array.from(new Map(ALL_EXERCISES.map(e => [e.id, e])).values());

export function PRTracker({ history, customWeights }: Props) {
  const prs = calculatePRs(history, customWeights);
  const recentPRs = prs.slice(0, 6);

  if (prs.length === 0) {
    return (
      <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6 text-center">
        <p className="text-2xl mb-2">🏆</p>
        <p className="text-xs text-slate-400">Aún no hay records personales.</p>
        <p className="text-[10px] text-slate-500 mt-1">Completa entrenamientos para empezar a registrar tus PRs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recentPRs.map(pr => (
        <div key={pr.exerciseId} className="bg-slate-950 border border-slate-850 rounded-xl p-3 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-100 truncate">{pr.exerciseName}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Último: {pr.date}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-base font-black text-emerald-400 font-mono">{pr.oneRepMax}kg</p>
              <p className="text-[9px] text-slate-500 uppercase">1RM est.</p>
            </div>
            {pr.trend === 'up' && <span className="text-emerald-400 text-sm">↑</span>}
            {pr.trend === 'down' && <span className="text-rose-400 text-sm">↓</span>}
            {pr.trend === 'same' && <span className="text-slate-500 text-sm">=</span>}
          </div>
        </div>
      ))}
      <p className="text-[9px] text-slate-500 text-center pt-2">
        Mostrando {recentPRs.length} de {prs.length} ejercicios. 1RM estimado por fórmula Epley.
      </p>
    </div>
  );
}

function calculatePRs(history: HistoryItem[], _customWeights: Record<string, number>): PR[] {
  const exerciseStats: Record<string, { name: string; entries: { date: string; weight: number; reps: number }[] }> = {};

  history.forEach(h => {
    h.exercises?.forEach(ex => {
      if (!ex.sets) return;
      ex.sets.forEach(set => {
        if (set.completed && set.weight > 0 && set.reps > 0) {
          if (!exerciseStats[ex.id]) {
            exerciseStats[ex.id] = { name: ex.name, entries: [] };
          }
          exerciseStats[ex.id].entries.push({
            date: h.date,
            weight: set.weight,
            reps: set.reps,
          });
        }
      });
    });
  });

  const prs: PR[] = [];
  uniqueExercises.forEach(ex => {
    const stats = exerciseStats[ex.id];
    if (!stats || stats.entries.length === 0) return;

    let bestOneRM = 0;
    let bestVolume = 0;
    let bestDate = '';
    let lastOneRM = 0;
    let firstOneRM = 0;

    stats.entries.forEach((entry, i) => {
      const oneRM = Math.round(entry.weight * (1 + entry.reps / 30) * 10) / 10;
      const vol = entry.weight * entry.reps;
      if (oneRM > bestOneRM) {
        bestOneRM = oneRM;
        bestDate = entry.date;
      }
      if (vol > bestVolume) bestVolume = vol;
      if (i === 0) firstOneRM = oneRM;
      if (i === stats.entries.length - 1) lastOneRM = oneRM;
    });

    const trend: 'up' | 'down' | 'same' =
      lastOneRM > firstOneRM + 0.5 ? 'up' : lastOneRM < firstOneRM - 0.5 ? 'down' : 'same';

    prs.push({
      exerciseId: ex.id,
      exerciseName: stats.name,
      oneRepMax: bestOneRM,
      bestVolume: Math.round(bestVolume),
      date: bestDate,
      trend,
    });
  });

  return prs.sort((a, b) => b.oneRepMax - a.oneRepMax);
}
