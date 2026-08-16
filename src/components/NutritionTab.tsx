import type { CardioSession } from '../types';
import { MacrosTracker } from './MacrosTracker';
import { BodyFatCalculator } from './BodyFatCalculator';

interface Props {
  userWeight: number;
  userHeight: number;
  userAge: number;
  userGender: string;
  userActivity: number;
  tdee: number;
  deficitCalories: number;
  dailyProtein: number;
  dailyWater: number;
  cardioSessions: CardioSession[];
  proteinGoal: number;
  onUserWeightChange: (w: number) => void;
  onUserHeightChange: (h: number) => void;
  onUserAgeChange: (a: number) => void;
  onUserGenderChange: (g: string) => void;
  onUserActivityChange: (a: number) => void;
  onDailyProteinChange: (p: number) => void;
  onDailyWaterChange: (w: number) => void;
  onDeleteCardioSession: (id: string) => void;
  onShowNotification: (msg: string) => void;
}

export function NutritionTab({
  userWeight, userHeight, userAge, userGender, userActivity,
  tdee, deficitCalories, dailyProtein, dailyWater,
  cardioSessions, proteinGoal,
  onUserWeightChange, onUserHeightChange, onUserAgeChange,
  onUserGenderChange, onUserActivityChange,
  onDailyProteinChange, onDailyWaterChange,
  onDeleteCardioSession, onShowNotification,
}: Props) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div>
          <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Macros de Definición</span>
          <h3 className="text-base font-black">Meta de Proteína & Hidratación Diaria</h3>
          <p className="text-xs text-slate-400 mt-1">Esencial para conservar el músculo mientras eliminas grasa de manera efectiva.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">Batidos / Pollo</span>
              <span className="font-mono text-accent font-bold">{dailyProtein}g / {proteinGoal}g</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((dailyProtein / (proteinGoal || 1)) * 100))}%` }}
              />
            </div>
            <div className="flex gap-1.5 justify-center">
              <button onClick={() => onDailyProteinChange(dailyProtein + 25)} className="bg-accent/10 border border-accent/20 text-[10px] font-black text-accent px-2 py-1 rounded">
                +25g (Batido)
              </button>
              <button onClick={() => onDailyProteinChange(dailyProtein + 40)} className="bg-accent/10 border border-accent/20 text-[10px] font-black text-accent px-2 py-1 rounded">
                +40g (Comida)
              </button>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">Agua Diaria</span>
              <span className="font-mono text-sky-400 font-bold">{dailyWater * 250}ml / 2500ml</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-500 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round(((dailyWater * 250) / 2500) * 100))}%` }}
              />
            </div>
            <div className="flex justify-center">
              <button onClick={() => onDailyWaterChange(dailyWater + 1)} className="bg-sky-500/10 border border-sky-500/20 text-[10px] font-black text-sky-400 px-4 py-1 rounded">
                +1 Vaso (250ml)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Nutrición del Plan</span>
          <h3 className="text-base font-black">Calculadora de Calorías</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-bold">Peso actual (kg)</label>
            <input type="number" inputMode="decimal" value={userWeight ?? 80} onChange={(e) => onUserWeightChange(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-slate-100 font-bold focus:outline-none" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-bold">Altura (cm)</label>
            <input type="number" inputMode="numeric" value={userHeight ?? 175} onChange={(e) => onUserHeightChange(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-slate-100 font-bold focus:outline-none" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-bold">Edad (años)</label>
            <input type="number" inputMode="numeric" value={userAge ?? 28} onChange={(e) => onUserAgeChange(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-slate-100 font-bold focus:outline-none" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-bold">Género</label>
            <select value={userGender ?? 'male'} onChange={(e) => onUserGenderChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-slate-100 font-bold focus:outline-none">
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          <label className="block text-slate-400 mb-1 font-bold">Nivel de Actividad</label>
          <select value={userActivity ?? 1.375} onChange={(e) => onUserActivityChange(parseFloat(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 font-bold focus:outline-none">
            <option value={1.2}>Sedentario (Poco o ningún ejercicio)</option>
            <option value={1.375}>Actividad ligera (Gimnasio 1-3 veces/semana)</option>
            <option value={1.55}>Actividad moderada (Gimnasio 3-5 veces/semana + pasos)</option>
            <option value={1.725}>Muy activo (Entrenamiento pesado diario)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Calorías de Mantenimiento</p>
            <p className="text-lg font-black text-slate-200 mt-1">{tdee} kcal</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-950/30 to-emerald-900/10 border border-accent/30 p-3.5 rounded-2xl text-center">
            <p className="text-[10px] text-accent font-bold uppercase">Objetivo Pérdida de Grasa</p>
            <p className="text-xl font-black text-accent mt-1">{deficitCalories} kcal</p>
          </div>
        </div>
      </div>

      {/* Estimador de Grasa Corporal U.S. Navy */}
      <BodyFatCalculator
        userGender={userGender}
        userHeight={userHeight}
        userWeight={userWeight}
        onSave={({ bodyFat, waist }) => {
          onShowNotification(`% Grasa guardado: ${bodyFat}% (Cintura: ${waist} cm)`);
        }}
      />

      {/* Calculadora de macros */}
      <MacrosTracker
        weight={userWeight}
        height={userHeight}
        age={userAge}
        gender={userGender as 'male' | 'female'}
        activity={userActivity}
        onShowNotification={onShowNotification}
      />

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <h3 className="text-base font-black">Historial de Cardio Realizado</h3>
        <p className="text-xs text-slate-400">Sesiones de cardio registradas después de tus pesas.</p>

        <div className="space-y-2">
          {cardioSessions.map(c => (
            <div key={c.id} className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex items-center justify-between text-xs animate-fadeIn">
              <div>
                <p className="font-bold text-slate-200">{c.type}</p>
                <p className="text-[10px] text-slate-500">{c.date} • {c.duration} mins</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent font-bold font-mono">-{c.calories} kcal</span>
                <button
                  onClick={() => {
                    if (confirm("¿Eliminar esta sesión de cardio?")) {
                      onDeleteCardioSession(c.id);
                      onShowNotification("Sesión de cardio eliminada");
                    }
                  }}
                  className="text-rose-400 hover:text-rose-300 text-[10px] font-bold px-1.5 py-0.5 rounded"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          {cardioSessions.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-3">No hay sesiones de cardio registradas.</p>
          )}
        </div>
      </div>
    </div>
  );
}
