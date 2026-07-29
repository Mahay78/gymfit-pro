import { useState, useMemo } from 'react';
import type { MachineType } from '../types';
import { ROUTINE_WEEK_A, ROUTINE_WEEK_B } from '../data/routines';
import { ROUTINE_FULLBODY } from '../data/fullbody';
import { ROUTINE_PPL } from '../data/ppl';
import { ROUTINE_UPPER_LOWER } from '../data/upperLower';
import { ROUTINE_PPL_UPPER } from '../data/pplUpper';
import { ROUTINE_BRO_SPLIT } from '../data/broSplit';
import { MACHINE_IMAGE_URLS } from '../data/images';

interface ExerciseEntry {
  id: string;
  name: string;
  alternativeName: string;
  target: string;
  machineType: MachineType;
  muscleGroup: string;
}

const ALL_EXERCISES: ExerciseEntry[] = (() => {
  const map = new Map<string, ExerciseEntry>();
  const add = (e: { id: string; name: string; alternativeName: string; target: string; machineType: MachineType }) => {
    if (!map.has(e.id)) {
      const muscle = e.target.split(/,|y/)[0].trim();
      map.set(e.id, { ...e, muscleGroup: muscle });
    }
  };
  [...ROUTINE_WEEK_A, ...ROUTINE_WEEK_B, ...ROUTINE_FULLBODY, ...ROUTINE_PPL, ...ROUTINE_UPPER_LOWER, ...ROUTINE_PPL_UPPER, ...ROUTINE_BRO_SPLIT].forEach(day => {
    day.exercises.forEach(add);
  });
  return Array.from(map.values());
})();

const MUSCLE_GROUPS = Array.from(new Set(ALL_EXERCISES.map(e => e.muscleGroup))).sort();

interface Props {
  onShowMachine: (type: MachineType) => void;
}

export function ExerciseLibrary({ onShowMachine }: Props) {
  const [query, setQuery] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ALL_EXERCISES.filter(e => {
      if (muscleFilter && e.muscleGroup !== muscleFilter) return false;
      if (q && !e.name.toLowerCase().includes(q) && !e.alternativeName.toLowerCase().includes(q) && !e.target.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [query, muscleFilter]);

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div>
          <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Catálogo</span>
          <h3 className="text-base font-black">Biblioteca de Ejercicios</h3>
          <p className="text-[11px] text-slate-400">Todos los ejercicios disponibles en tu plan. Toca para ver foto y plano.</p>
        </div>

        <input
          type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="🔍 Buscar ejercicio..."
          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500/50"
        />

        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setMuscleFilter(null)}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
              !muscleFilter ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            Todos ({ALL_EXERCISES.length})
          </button>
          {MUSCLE_GROUPS.map(m => {
            const count = ALL_EXERCISES.filter(e => e.muscleGroup === m).length;
            return (
              <button
                key={m}
                onClick={() => setMuscleFilter(m)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  muscleFilter === m ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                {m} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4 col-span-2">No hay ejercicios que coincidan.</p>
        ) : (
          filtered.map(e => (
            <button
              key={e.id}
              onClick={() => onShowMachine(e.machineType)}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-left hover:border-emerald-500/40 transition-all group"
            >
              <div className="relative w-full h-32 bg-slate-950 overflow-hidden">
                <img
                  src={MACHINE_IMAGE_URLS[e.machineType]}
                  alt={e.name}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute top-2 right-2 bg-emerald-500/90 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  {e.muscleGroup}
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-black text-slate-100">{e.name}</p>
                <p className="text-[10px] text-slate-400 mt-1">🎯 {e.target}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Alternativa: <span className="text-emerald-400">{e.alternativeName}</span></p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
