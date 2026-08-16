import type { HistoryItem, BodyMeasurement, CardioSession } from '../types';
import { LineChart } from './LineChart';
import { BarChart } from './BarChart';
import { MonthlyStats } from './MonthlyStats';
import { PRTracker } from './PRTracker';
import { AttendanceCalendar } from './AttendanceCalendar';
import { ExerciseLibrary } from './ExerciseLibrary';
import { StreakCard } from './StreakCard';
import { GoalWeightCard } from './GoalWeightCard';
import { ShareSummary } from './ShareSummary';
import { Achievements } from './Achievements';
import { MuscleHeatmap } from './MuscleHeatmap';
import { getWorkoutStatsSince } from '../utils/analytics';

interface Props {
  userWeight: number;
  startWeight: number;
  goalWeight: number;
  history: HistoryItem[];
  bodyMeasurements: BodyMeasurement[];
  cardioSessions: CardioSession[];
  customWeights: Record<string, number>;
  newWeightInput: string;
  newWaist: string;
  newHips: string;
  newChest: string;
  newThigh: string;
  onWeightInputChange: (v: string) => void;
  onAddWeight: () => void;
  onGoalWeightChange: (w: number) => void;
  onWaistChange: (v: string) => void;
  onHipsChange: (v: string) => void;
  onChestChange: (v: string) => void;
  onThighChange: (v: string) => void;
  onAddMeasurement: () => void;
  onDeleteMeasurement: (index: number) => void;
  onShowNotification: (msg: string) => void;
  onShowMachine: (type: string) => void;
  onStartWorkout: () => void;
  onOpen1RMCalculator?: (exerciseName?: string, weight?: number) => void;
}

export function ProgressTab({
  userWeight, startWeight, goalWeight, history, bodyMeasurements, cardioSessions, customWeights,
  newWeightInput, newWaist, newHips, newChest, newThigh,
  onWeightInputChange, onAddWeight, onGoalWeightChange,
  onWaistChange, onHipsChange, onChestChange, onThighChange,
  onAddMeasurement, onDeleteMeasurement, onShowNotification,
  onShowMachine, onStartWorkout, onOpen1RMCalculator,
}: Props) {
  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeightInput);
    if (isNaN(val) || val <= 0) {
      onShowNotification("Introduce un peso válido");
      return;
    }
    onAddWeight();
  };

  const handleMeasurementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWaist && !newHips && !newChest && !newThigh) {
      onShowNotification("Introduce al menos una medida");
      return;
    }
    onAddMeasurement();
  };

  const weightChartData = history
    .filter(h => h.weight > 0)
    .map(h => ({ date: h.date, value: h.weight }))
    .reverse();

  const volumeChartData = history
    .slice(0, 10)
    .map(h => ({ label: h.date.split(' ')[0], value: h.totalVolume }))
    .reverse();

  const waistChartData = bodyMeasurements
    .filter(m => m.waist > 0)
    .map(m => ({ date: m.date, value: m.waist }))
    .reverse();

const lastQuarterStats = getWorkoutStatsSince(history, 3);
const lastMonthStats = getWorkoutStatsSince(history, 1);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Racha y motivación */}
      <StreakCard history={history} onStartWorkout={onStartWorkout} />

      {/* Compartir */}
      <ShareSummary history={history} userWeight={userWeight} startWeight={startWeight} onShowNotification={onShowNotification} />

      {/* Peso objetivo */}
      {startWeight > 0 && (
        <GoalWeightCard
          currentWeight={userWeight}
          goalWeight={goalWeight}
          startWeight={startWeight}
          onSaveGoal={onGoalWeightChange}
          onShowNotification={onShowNotification}
        />
      )}

      {/* Logros */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <h3 className="font-black text-sm text-slate-200 mb-3">🏆 Logros</h3>
        <Achievements
          history={history}
          bodyMeasurements={bodyMeasurements}
          cardioSessions={cardioSessions}
          startWeight={startWeight}
          currentWeight={userWeight}
        />
      </div>

      {/* Comparación temporal */}
      {(lastMonthStats || lastQuarterStats) && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <h3 className="font-black text-sm text-slate-200 mb-3">📈 Evolución</h3>
          <div className="space-y-3">
            {lastMonthStats && (
              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl">
                <div>
                  <p className="text-xs text-slate-300 font-bold">Último mes</p>
                  <p className="text-[10px] text-slate-500">Hace 30 días</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-accent">{lastMonthStats.workoutCount} entrenos</p>
                  <p className="text-[10px] text-slate-400">{(lastMonthStats.totalVolume / 1000).toFixed(1)}t</p>
                </div>
              </div>
            )}
            {lastQuarterStats && (
              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl">
                <div>
                  <p className="text-xs text-slate-300 font-bold">Hace 3 meses</p>
                  <p className="text-[10px] text-slate-500">Trimestre pasado</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-cyan-400">{lastQuarterStats.workoutCount} entrenos</p>
                  <p className="text-[10px] text-slate-400">{(lastQuarterStats.totalVolume / 1000).toFixed(1)}t</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Estadísticas mensuales */}
      <div>
        <h2 className="text-xs font-black text-accent uppercase tracking-wider mb-2 px-1">Resumen del Mes</h2>
        <MonthlyStats history={history} />
      </div>

      {/* Calendario de asistencia */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div>
          <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Asistencia</span>
          <h3 className="text-base font-black">Calendario de Entrenamientos</h3>
        </div>
        <AttendanceCalendar history={history} />
      </div>

      {/* Gráfica de peso corporal */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Control de Peso</span>
            <h3 className="text-base font-black">Peso Corporal: {userWeight} kg</h3>
          </div>
        </div>
        <LineChart data={weightChartData} label="Tendencia de peso" unit=" kg" color="#10b981" />
        <form onSubmit={handleWeightSubmit} className="flex gap-2 text-xs">
          <input
            type="number" inputMode="decimal" step="0.1" value={newWeightInput ?? ''}
            onChange={(e) => onWeightInputChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 px-3 py-2.5 rounded-xl text-slate-200 font-bold w-full max-w-[120px] focus:outline-none"
            placeholder="Ej. 79.5"
          />
          <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold">
            Guardar peso actual
          </button>
        </form>
      </div>

      {/* Gráfica de volumen por sesión */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div>
          <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Volumen de Entrenamiento</span>
          <h3 className="text-base font-black">Últimas 10 sesiones</h3>
          <p className="text-[11px] text-slate-400">Mantener volumen estable = músculo preservado en déficit.</p>
        </div>
        <BarChart data={volumeChartData} unit="kg" color="#22d3ee" />
      </div>

      {/* Mapa de Calor y Volumen Muscular Semanal */}
      <MuscleHeatmap history={history} />

      {/* Records personales */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div>
          <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Records Personales</span>
          <h3 className="text-base font-black">🏆 Tus mejores marcas</h3>
          <p className="text-[11px] text-slate-400">1RM estimado con fórmula Epley. La flecha indica tendencia.</p>
        </div>
        <PRTracker history={history} customWeights={customWeights} onOpen1RMCalculator={onOpen1RMCalculator} />
      </div>

      {/* Medidas corporales */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div>
          <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Monitoreo de Volumen</span>
          <h3 className="text-base font-black">Registro de Medidas Corporales (cm)</h3>
        </div>

        {waistChartData.length >= 2 && (
          <LineChart data={waistChartData} label="Cintura" unit=" cm" color="#f59e0b" />
        )}

        <form onSubmit={handleMeasurementSubmit} className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Cintura (cm)</label>
            <input type="number" inputMode="decimal" value={newWaist ?? ''} onChange={(e) => onWaistChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-slate-100" placeholder="Ej. 88" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Cadera (cm)</label>
            <input type="number" inputMode="decimal" value={newHips ?? ''} onChange={(e) => onHipsChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-slate-100" placeholder="Ej. 102" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Pecho (cm)</label>
            <input type="number" inputMode="decimal" value={newChest ?? ''} onChange={(e) => onChestChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-slate-100" placeholder="Ej. 98" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Muslo (cm)</label>
            <input type="number" inputMode="decimal" value={newThigh ?? ''} onChange={(e) => onThighChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-slate-100" placeholder="Ej. 60" />
          </div>
          <div className="col-span-2 sm:col-span-4 pt-2">
            <button type="submit" className="w-full bg-slate-800 hover:bg-slate-750 border border-slate-700 font-extrabold py-2.5 rounded-xl text-slate-100">
              Guardar Perímetros
            </button>
          </div>
        </form>

        <div className="space-y-2.5 pt-2 border-t border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400">Historial de Medidas</p>
          {bodyMeasurements.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-2">No has registrado medidas todavía.</p>
          ) : (
            <div className="space-y-1.5">
              {bodyMeasurements.map((m, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-850 p-3 rounded-2xl flex justify-between items-center text-xs animate-fadeIn">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-slate-400 min-w-[80px]">{m.date}</span>
                    <span>Cintura: <strong className="text-amber-400 font-mono">{m.waist}cm</strong></span>
                    <span>Cadera: <strong className="text-slate-200 font-mono">{m.hips}cm</strong></span>
                    <span>Pecho: <strong className="text-slate-200 font-mono">{m.chest}cm</strong></span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("¿Eliminar esta medición?")) {
                        onDeleteMeasurement(idx);
                        onShowNotification("Medición eliminada");
                      }
                    }}
                    className="text-rose-400 hover:text-rose-300 text-[10px] font-bold px-1.5 py-0.5 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Biblioteca de ejercicios */}
      <ExerciseLibrary onShowMachine={(t) => onShowMachine(t)} />

      {/* Historial completo de entrenamientos */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <h3 className="font-bold text-sm text-slate-200">Historial Completo</h3>
        <p className="text-[11px] text-slate-400">Todos tus entrenamientos con notas.</p>

        {history.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">No hay entrenamientos registrados aún.</p>
        ) : (
          <div className="space-y-2">
            {history.map(h => (
              <div key={h.id} className="bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-300 text-[11px]">{h.dayTitle}</span>
                  <span className="text-slate-500 text-[10px]">{h.date}</span>
                </div>
                <div className="flex gap-3 text-[10px]">
                  <span className="text-slate-400">⏱️ {h.duration}</span>
                  <span className="text-accent font-mono font-bold">📊 {h.totalVolume} kg</span>
                  <span className="text-cyan-400">✅ {h.completedExercises} ej</span>
                  {h.weight > 0 && <span className="text-amber-400">⚖️ {h.weight}kg</span>}
                </div>
                {h.notes && (
                  <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800 mt-1">💬 {h.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
