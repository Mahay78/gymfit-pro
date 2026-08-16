import { useState } from 'react';
import type { RoutineDay, RoutineType, AbWeek } from '../types';
import { ROUTINE_TYPE_INFO } from '../types';
import { ROUTINE_WEEK_A, ROUTINE_WEEK_B } from '../data/routines';
import { ROUTINE_FULLBODY } from '../data/fullbody';
import { ROUTINE_PPL } from '../data/ppl';
import { ROUTINE_UPPER_LOWER } from '../data/upperLower';
import { ROUTINE_PPL_UPPER } from '../data/pplUpper';
import { ROUTINE_BRO_SPLIT } from '../data/broSplit';
import { applyOverrides, overrideKey, type RoutineOverrides } from '../utils/routineOverrides';

interface Props {
  selectedRoutineType: RoutineType;
  selectedWeek: AbWeek;
  selectedDay: number;
  customWeights: Record<string, number>;
  workoutActive: boolean;
  overrides: RoutineOverrides;
  onOverridesChange: (next: RoutineOverrides) => void;
  onSelectRoutineType: (type: RoutineType) => void;
  onSelectWeek: (week: AbWeek) => void;
  onSelectDay: (day: number) => void;
  onStartWorkout: (dayIndex: number) => void;
  onShowMachine: (type: string) => void;
  onShowNotification: (msg: string) => void;
  onSetActiveTab: (tab: string) => void;
}

export function RoutineView({
  selectedRoutineType, selectedWeek, selectedDay, customWeights,
  workoutActive, overrides, onOverridesChange,
  onSelectRoutineType, onSelectWeek, onSelectDay,
  onStartWorkout, onShowMachine, onShowNotification,
  onSetActiveTab,
}: Props) {
  const routineSource: RoutineDay[] =
    selectedRoutineType === 'fullbody' ? ROUTINE_FULLBODY
    : selectedRoutineType === 'ppl' ? ROUTINE_PPL
    : selectedRoutineType === 'upper-lower' ? ROUTINE_UPPER_LOWER
    : selectedRoutineType === 'ppl-upper' ? ROUTINE_PPL_UPPER
    : selectedRoutineType === 'bro-split' ? ROUTINE_BRO_SPLIT
    : selectedWeek === 'A' ? ROUTINE_WEEK_A
    : ROUTINE_WEEK_B;
  const safeDay = Math.min(selectedDay, routineSource.length - 1);
  const editedSource = applyOverrides(routineSource, overrides, selectedRoutineType, selectedWeek);
  const currentDay = editedSource[safeDay];
  const [editing, setEditing] = useState(false);

  const handleSelectWeek = (week: AbWeek) => {
    onSelectWeek(week);
    onShowNotification(week === 'A' ? "Semana A: Fuerza base y densidad." : "Semana B: Tensión y bombeo de grasa.");
  };

  const handleSelectType = (type: RoutineType) => {
    onSelectRoutineType(type);
    const info = ROUTINE_TYPE_INFO[type];
    onShowNotification(`${info.short}: ${info.description}`);
  };

  const dayKey = overrideKey(selectedRoutineType, selectedWeek, currentDay.dayId);
  const dayOverride = overrides[dayKey] || { removed: [], edited: {} };

  const removeExercise = (exId: string) => {
    const next: RoutineOverrides = {
      ...overrides,
      [dayKey]: { ...dayOverride, removed: [...dayOverride.removed, exId] },
    };
    onOverridesChange(next);
    onShowNotification('Ejercicio quitado de la plantilla.');
  };

  const changeField = (exId: string, field: 'setsCount' | 'defaultReps', delta: number) => {
    const current = dayOverride.edited[exId] || {};
    const base = currentDay.exercises.find(e => e.id === exId);
    const value = (current[field] ?? base?.[field] ?? 0) + delta;
    const clamped = field === 'setsCount' ? Math.max(1, Math.min(8, value)) : Math.max(1, Math.min(30, value));
    const next: RoutineOverrides = {
      ...overrides,
      [dayKey]: { ...dayOverride, edited: { ...dayOverride.edited, [exId]: { ...current, [field]: clamped } } },
    };
    onOverridesChange(next);
  };

  const resetDay = () => {
    const next = { ...overrides };
    delete next[dayKey];
    onOverridesChange(next);
    onShowNotification('Plantilla del día restablecida.');
  };

  const resetAll = () => {
    onOverridesChange({});
    onShowNotification('Todas las plantillas restablecidas.');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Selector de tipo de rutina */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <p className="text-[10px] text-slate-400 uppercase font-bold text-center mb-2.5 tracking-wider">
          Tipo de Rutina
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(['fullbody', 'ppl', 'upper-lower', 'ppl-upper', 'bro-split', 'ab-split'] as RoutineType[]).map(type => {
            const info = ROUTINE_TYPE_INFO[type];
            return (
              <button
                key={type}
                onClick={() => handleSelectType(type)}
                className={`py-3 px-2 rounded-2xl font-black text-xs transition-all border flex flex-col items-center justify-center gap-0.5 min-h-[64px] ${
                  selectedRoutineType === type
                    ? 'bg-accent text-slate-950 border-accent/40 shadow-md shadow-accent/15'
                    : 'bg-slate-950 hover:bg-slate-850 border-slate-850 text-slate-400'
                }`}
              >
                <span className="text-sm">{info.short}</span>
                <span className="text-[9px] font-medium opacity-80 leading-tight">{info.level}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-500 text-center mt-2.5 px-2">
          {ROUTINE_TYPE_INFO[selectedRoutineType].description}
        </p>
      </div>

      {/* Selector de semana (solo A/B) */}
      {selectedRoutineType === 'ab-split' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
          <p className="text-[10px] text-slate-400 uppercase font-bold text-center mb-2.5 tracking-wider">
            Semana de Ondulación
          </p>
          <div className="grid grid-cols-2 gap-3">
            {(['A', 'B'] as AbWeek[]).map(week => (
              <button
                key={week}
                onClick={() => handleSelectWeek(week)}
                className={`py-3 px-3 rounded-2xl font-black text-xs transition-all border flex flex-col items-center justify-center gap-1 ${
                  selectedWeek === week
                    ? 'bg-accent text-slate-950 border-accent/40 shadow-md shadow-accent/15'
                    : 'bg-slate-950 hover:bg-slate-850 border-slate-850 text-slate-400'
                }`}
              >
                <span className="text-sm">Semana {week}</span>
                <span className="text-[9px] font-medium opacity-80">
                  {week === 'A' ? 'Fuerza & Densidad' : 'Bombeo & Esculpido'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {routineSource.map((day, idx) => (
          <button
            key={day.dayId}
            onClick={() => onSelectDay(idx)}
            className={`py-3 px-2 rounded-2xl font-bold text-xs transition-all border flex flex-col items-center justify-center gap-1 ${
              safeDay === idx
                ? 'bg-accent text-slate-950 border-accent/40 shadow-lg shadow-accent/10'
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
            }`}
          >
            <span>{day.shortTitle}</span>
            <span className="text-[9px] font-normal uppercase opacity-75">
              {idx === 0 ? "Lunes" : idx === 1 ? "Miércoles" : "Viernes"}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-accent/15 text-accent font-bold text-[9px] px-2 py-0.5 rounded uppercase">
              {selectedRoutineType === 'fullbody' ? 'Full Body'
                : selectedRoutineType === 'ppl' ? 'PPL'
                : `Semana ${selectedWeek}`}
            </span>
            <h3 className="text-base font-extrabold text-slate-200">{currentDay.title}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">{currentDay.description}</p>
        </div>

        {/* Botón Principal Superior de Iniciar */}
        <button
          onClick={() => {
            if (workoutActive) {
              onSetActiveTab('entrenar');
            } else {
              onStartWorkout(safeDay);
            }
          }}
          className="w-full bg-accent hover:opacity-90 text-slate-950 font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/25 text-xs active:scale-95"
        >
          <span>🏋️</span>
          {workoutActive
            ? 'Continuar Entrenamiento Activo'
            : `Iniciar Entrenamiento • ${currentDay.shortTitle}`}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className={`flex-1 py-2 rounded-xl text-[11px] font-black transition-all ${editing ? 'bg-accent text-slate-950' : 'bg-slate-950 border border-slate-800 text-slate-300'}`}
          >
            {editing ? '✓ Terminar edición' : '✎ Editar plantilla'}
          </button>
          {Object.keys(overrides).length > 0 && (
            <button onClick={resetAll} className="px-3 py-2 rounded-xl text-[10px] font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400">
              Restablecer todo
            </button>
          )}
        </div>

        <div className="space-y-3">
          {currentDay.exercises.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-4">Día vacío. Edita para agregar o restablece la plantilla.</p>
          )}
          {currentDay.exercises.map((ex, idx) => {
            const overrideSets = dayOverride.edited[ex.id]?.setsCount;
            const overrideReps = dayOverride.edited[ex.id]?.defaultReps;
            return (
            <div key={ex.id} className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-slate-800 transition-colors stagger-in" style={{ animationDelay: `${idx * 45}ms` }}>
              <div className="flex flex-col md:flex-row justify-between gap-4 w-full">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-850 text-slate-400 font-bold text-xs w-5 h-5 rounded-md flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-slate-100">{ex.name}</h4>
                    {editing && (
                      <button onClick={() => removeExercise(ex.id)} className="ml-auto w-6 h-6 rounded-full bg-rose-500/90 text-slate-950 text-[10px] font-black flex items-center justify-center" title="Quitar ejercicio">✕</button>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">Zona: <strong className="text-slate-300">{ex.target}</strong></p>
                  <p className="text-[11px] text-slate-500">Alternativa: <span className="text-accent font-medium">{ex.alternativeName}</span></p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onShowMachine(ex.machineType);
                        onShowNotification(`Mostrando plano de ${ex.name}`);
                      }}
                      className="bg-slate-850 hover:bg-slate-800 border border-slate-700 text-accent text-[10px] font-black px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      Ver Foto y Plano
                    </button>
                  </div>
                </div>

                <div className="flex md:flex-col justify-between md:justify-center items-end bg-slate-900/50 p-2.5 rounded-xl border border-slate-850 self-start md:self-auto min-w-[130px] text-xs gap-1">
                  {editing ? (
                    <>
                      <div className="flex items-center gap-1">
                        <span>Series:</span>
                        <button onClick={() => changeField(ex.id, 'setsCount', -1)} className="w-6 h-6 bg-slate-850 rounded text-xs font-bold">−</button>
                        <span className="text-slate-100 font-extrabold w-4 text-center">{overrideSets ?? ex.setsCount}</span>
                        <button onClick={() => changeField(ex.id, 'setsCount', 1)} className="w-6 h-6 bg-slate-850 rounded text-xs font-bold">+</button>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Reps:</span>
                        <button onClick={() => changeField(ex.id, 'defaultReps', -1)} className="w-6 h-6 bg-slate-850 rounded text-xs font-bold">−</button>
                        <span className="text-slate-100 font-extrabold w-4 text-center">{overrideReps ?? ex.defaultReps}</span>
                        <button onClick={() => changeField(ex.id, 'defaultReps', 1)} className="w-6 h-6 bg-slate-850 rounded text-xs font-bold">+</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>Series: <span className="text-slate-100 font-extrabold">{ex.setsCount}</span></div>
                      <div>Reps: <span className="text-slate-100 font-extrabold">{ex.defaultReps}</span></div>
                    </>
                  )}
                  <div>Carga base: <span className="text-accent font-extrabold">{customWeights[ex.id] || ex.defaultWeight} kg</span></div>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {editing && (
          <button onClick={resetDay} className="w-full bg-rose-500/10 border border-rose-500/30 text-rose-400 py-2 rounded-xl text-[11px] font-bold">
            Restablecer este día a la plantilla original
          </button>
        )}

        <button
          onClick={() => {
            if (workoutActive) {
              onSetActiveTab('entrenar');
            } else {
              onStartWorkout(safeDay);
            }
          }}
          className="w-full bg-accent hover:opacity-90 text-slate-950 font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg text-xs"
        >
          {workoutActive
            ? "Continuar Entrenamiento Activo"
            : selectedRoutineType === 'fullbody'
              ? `Iniciar Full Body • ${currentDay.shortTitle}`
              : selectedRoutineType === 'ppl'
                ? `Iniciar PPL • ${currentDay.shortTitle}`
                : `Iniciar Rutina Semana ${selectedWeek} • ${currentDay.shortTitle}`}
        </button>
      </div>
    </div>
  );
}
