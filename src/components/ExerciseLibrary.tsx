import { useState, useMemo } from 'react';
import type { MachineType, CustomExercise } from '../types';
import { ROUTINE_WEEK_A, ROUTINE_WEEK_B } from '../data/routines';
import { ROUTINE_FULLBODY } from '../data/fullbody';
import { ROUTINE_PPL } from '../data/ppl';
import { ROUTINE_UPPER_LOWER } from '../data/upperLower';
import { ROUTINE_PPL_UPPER } from '../data/pplUpper';
import { ROUTINE_BRO_SPLIT } from '../data/broSplit';
import { MACHINE_IMAGE_URLS } from '../data/images';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ExerciseEntry {
  id: string;
  name: string;
  alternativeName: string;
  target: string;
  machineType: MachineType;
  muscleGroup: string;
  isCustom?: boolean;
  photo?: string;
}

const ROUTINE_EXERCISES: ExerciseEntry[] = (() => {
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

interface Props {
  onShowMachine: (type: MachineType) => void;
}

export function ExerciseLibrary({ onShowMachine }: Props) {
  const [query, setQuery] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<string | null>(null);
  const [customExercises, setCustomExercises] = useLocalStorage<CustomExercise[]>('gymfit_pro_custom_exercises', []);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newPhoto, setNewPhoto] = useState('');

  const ALL_EXERCISES: ExerciseEntry[] = useMemo(() => {
    const customs: ExerciseEntry[] = customExercises.map(c => ({
      id: c.id,
      name: c.name,
      alternativeName: 'Personalizado',
      target: c.target || 'General',
      machineType: 'legpress',
      muscleGroup: (c.target || 'General').split(/,|y/)[0].trim(),
      isCustom: true,
      photo: c.photo,
    }));
    return [...ROUTINE_EXERCISES, ...customs];
  }, [customExercises]);

  const MUSCLE_GROUPS = useMemo(
    () => Array.from(new Set(ALL_EXERCISES.map(e => e.muscleGroup))).sort(),
    [ALL_EXERCISES]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ALL_EXERCISES.filter(e => {
      if (muscleFilter && e.muscleGroup !== muscleFilter) return false;
      if (q && !e.name.toLowerCase().includes(q) && !e.alternativeName.toLowerCase().includes(q) && !e.target.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [query, muscleFilter, ALL_EXERCISES]);

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    const entry: CustomExercise = {
      id: `custom_${Date.now()}`,
      name,
      target: newTarget.trim() || 'General',
      photo: newPhoto.trim() || undefined,
    };
    setCustomExercises([...customExercises, entry]);
    setNewName(''); setNewTarget(''); setNewPhoto(''); setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setCustomExercises(customExercises.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div>
          <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Catálogo</span>
          <h3 className="text-base font-black">Biblioteca de Ejercicios</h3>
          <p className="text-[11px] text-slate-400">Todos los ejercicios de tu plan + los que agregues tú. Toca para ver foto y plano.</p>
        </div>

        <input
          type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="🔍 Buscar ejercicio..."
          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-accent/50"
        />

        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setMuscleFilter(null)}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
              !muscleFilter ? 'bg-accent text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
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
                  muscleFilter === m ? 'bg-accent text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                {m} ({count})
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full bg-accent/10 border border-accent/30 text-accent py-2.5 rounded-xl text-xs font-bold hover:bg-accent/20 transition-all"
        >
          {showForm ? 'Cancelar' : '➕ Agregar ejercicio propio'}
        </button>

        {showForm && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2 animate-fadeIn">
            <input
              type="text" value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="Nombre (ej: Curl con banda)"
              className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-accent/50"
            />
            <input
              type="text" value={newTarget} onChange={e => setNewTarget(e.target.value)}
              placeholder="Grupo muscular (ej: Bíceps)"
              className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-accent/50"
            />
            <input
              type="text" value={newPhoto} onChange={e => setNewPhoto(e.target.value)}
              placeholder="URL de foto (opcional)"
              className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-accent/50"
            />
            <button
              onClick={handleAdd}
              className="w-full bg-accent text-slate-950 py-2.5 rounded-xl text-xs font-black hover:opacity-90 transition-all"
            >
              Guardar ejercicio
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 library-landscape">
        {filtered.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4 col-span-2">No hay ejercicios que coincidan.</p>
        ) : (
          filtered.map(e => (
            <div
              key={e.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-left hover:border-accent/40 transition-all group relative"
            >
              {e.isCustom && (
                <button
                  onClick={() => handleDelete(e.id)}
                  className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-rose-500/90 text-slate-950 text-[10px] font-black flex items-center justify-center"
                  title="Eliminar ejercicio"
                >
                  ✕
                </button>
              )}
              <div
                onClick={() => !e.isCustom && onShowMachine(e.machineType)}
                className={`relative w-full h-32 bg-slate-950 overflow-hidden ${e.isCustom ? '' : 'cursor-pointer'}`}
              >
                {e.isCustom && e.photo ? (
                  <img src={e.photo} alt={e.name} loading="lazy" className="w-full h-full object-cover opacity-90" />
                ) : e.isCustom ? (
                  <div className="w-full h-full flex items-center justify-center text-3xl opacity-60">💪</div>
                ) : (
                  <img
                    src={MACHINE_IMAGE_URLS[e.machineType]}
                    alt={e.name}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                )}
                <div className="absolute top-2 right-2 bg-accent/90 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  {e.muscleGroup}
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-black text-slate-100">{e.name}</p>
                <p className="text-[10px] text-slate-400 mt-1">🎯 {e.target}</p>
                {!e.isCustom && (
                  <p className="text-[10px] text-slate-500 mt-0.5">Alternativa: <span className="text-accent">{e.alternativeName}</span></p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
