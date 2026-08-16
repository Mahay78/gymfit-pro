import { useState } from 'react';
import { calculateMacros, type Macros } from '../utils/macros';

interface Props {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activity: number;
  onShowNotification: (msg: string) => void;
}

export function MacrosTracker({ weight, height, age, gender, activity, onShowNotification }: Props) {
  const [goal, setGoal] = useState<'cut' | 'maintain' | 'bulk'>('cut');
  const macros: Macros = calculateMacros(weight, height, age, gender, activity, goal);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
      <div>
        <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Nutrición</span>
        <h3 className="text-base font-black">Macros Diarios Recomendados</h3>
        <p className="text-[10px] text-slate-500">Calculado según tu peso, altura, edad y objetivo</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(['cut', 'maintain', 'bulk'] as const).map(g => (
          <button
            key={g}
            onClick={() => { setGoal(g); onShowNotification(`Objetivo: ${g === 'cut' ? 'Perder grasa' : g === 'maintain' ? 'Mantener' : 'Ganar músculo'}`); }}
            className={`py-2 rounded-xl text-[10px] font-black uppercase ${
              goal === g
                ? 'bg-accent text-slate-950'
                : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            {g === 'cut' ? '🔻 Déficit' : g === 'maintain' ? '⚖️ Mantener' : '📈 Superávit'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-950 p-3 rounded-2xl text-center">
          <p className="text-[9px] text-slate-500 uppercase font-bold">Calorías</p>
          <p className="text-2xl font-black text-accent mt-0.5">{macros.calories}</p>
          <p className="text-[9px] text-slate-500">kcal/día</p>
        </div>
        <div className="bg-slate-950 p-3 rounded-2xl text-center">
          <p className="text-[9px] text-slate-500 uppercase font-bold">Proteína</p>
          <p className="text-2xl font-black text-rose-400 mt-0.5">{macros.protein}g</p>
          <p className="text-[9px] text-slate-500">2g/kg peso</p>
        </div>
        <div className="bg-slate-950 p-3 rounded-2xl text-center">
          <p className="text-[9px] text-slate-500 uppercase font-bold">Carbohidratos</p>
          <p className="text-2xl font-black text-amber-400 mt-0.5">{macros.carbs}g</p>
          <p className="text-[9px] text-slate-500">resto calórico</p>
        </div>
        <div className="bg-slate-950 p-3 rounded-2xl text-center">
          <p className="text-[9px] text-slate-500 uppercase font-bold">Grasas</p>
          <p className="text-2xl font-black text-cyan-400 mt-0.5">{macros.fat}g</p>
          <p className="text-[9px] text-slate-500">0.9g/kg peso</p>
        </div>
      </div>

      <div className="text-[10px] text-slate-500 bg-slate-950 p-2.5 rounded-xl">
        <p>💡 Para déficit: come <strong className="text-slate-300">{Math.round((macros.calories * 0.2 / 9) * 10) / 10} kg de grasa menos/semana</strong></p>
      </div>
    </div>
  );
}
