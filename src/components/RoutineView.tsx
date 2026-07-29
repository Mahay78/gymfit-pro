import type { RoutineDay, RoutineType, AbWeek } from '../types';
import { ROUTINE_TYPE_INFO } from '../types';
import { ROUTINE_WEEK_A, ROUTINE_WEEK_B } from '../data/routines';
import { ROUTINE_FULLBODY } from '../data/fullbody';
import { ROUTINE_PPL } from '../data/ppl';
import { ROUTINE_UPPER_LOWER } from '../data/upperLower';
import { ROUTINE_PPL_UPPER } from '../data/pplUpper';
import { ROUTINE_BRO_SPLIT } from '../data/broSplit';

interface Props {
  selectedRoutineType: RoutineType;
  selectedWeek: AbWeek;
  selectedDay: number;
  customWeights: Record<string, number>;
  workoutActive: boolean;
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
  workoutActive, onSelectRoutineType, onSelectWeek, onSelectDay,
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
  const currentDay = routineSource[safeDay];

  const handleSelectWeek = (week: AbWeek) => {
    onSelectWeek(week);
    onShowNotification(week === 'A' ? "Semana A: Fuerza base y densidad." : "Semana B: Tensión y bombeo de grasa.");
  };

  const handleSelectType = (type: RoutineType) => {
    onSelectRoutineType(type);
    const info = ROUTINE_TYPE_INFO[type];
    onShowNotification(`${info.short}: ${info.description}`);
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
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/15'
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
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/15'
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
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/10'
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
            <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[9px] px-2 py-0.5 rounded uppercase">
              {selectedRoutineType === 'fullbody' ? 'Full Body'
                : selectedRoutineType === 'ppl' ? 'PPL'
                : `Semana ${selectedWeek}`}
            </span>
            <h3 className="text-base font-extrabold text-slate-200">{currentDay.title}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">{currentDay.description}</p>
        </div>

        <div className="space-y-3">
          {currentDay.exercises.map((ex, idx) => (
            <div key={ex.id} className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-slate-800 transition-colors animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between gap-4 w-full">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-850 text-slate-400 font-bold text-xs w-5 h-5 rounded-md flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-slate-100">{ex.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400">Zona: <strong className="text-slate-300">{ex.target}</strong></p>
                  <p className="text-[11px] text-slate-500">Alternativa: <span className="text-emerald-400 font-medium">{ex.alternativeName}</span></p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onShowMachine(ex.machineType);
                        onShowNotification(`Mostrando plano de ${ex.name}`);
                      }}
                      className="bg-slate-850 hover:bg-slate-800 border border-slate-700 text-emerald-400 text-[10px] font-black px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      Ver Foto y Plano
                    </button>
                  </div>
                </div>

                <div className="flex md:flex-col justify-between md:justify-center items-end bg-slate-900/50 p-2.5 rounded-xl border border-slate-850 self-start md:self-auto min-w-[130px] text-xs">
                  <div>Series: <span className="text-slate-100 font-extrabold">{ex.setsCount}</span></div>
                  <div>Reps: <span className="text-slate-100 font-extrabold">{ex.defaultReps}</span></div>
                  <div>Carga base: <span className="text-emerald-400 font-extrabold">{customWeights[ex.id] || ex.defaultWeight} kg</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            if (workoutActive) {
              onSetActiveTab('entrenar');
            } else {
              onStartWorkout(safeDay);
            }
          }}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg text-xs"
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
