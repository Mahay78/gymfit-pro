import { useState, useId } from 'react';
import { calculateNavyBodyFat } from '../utils/bodyFat';

interface Props {
  userGender: string;
  userHeight: number;
  userWeight: number;
  initialWaist?: number;
  initialHips?: number;
  onSave?: (result: { bodyFat: number; leanMass: number; waist: number }) => void;
  onClose?: () => void;
}

export function BodyFatCalculator({
  userGender,
  userHeight,
  userWeight,
  initialWaist = 84,
  initialHips = 96,
  onSave,
  onClose,
}: Props) {
  const [gender, setGender] = useState(userGender || 'male');
  const [height, setHeight] = useState(userHeight > 0 ? userHeight : 175);
  const [weight, setWeight] = useState(userWeight > 0 ? userWeight : 80);
  const [waist, setWaist] = useState(initialWaist > 0 ? initialWaist : 84);
  const [neck, setNeck] = useState(gender === 'male' ? 38 : 33);
  const [hips, setHips] = useState(initialHips > 0 ? initialHips : 96);

  const waistId = useId();
  const neckId = useId();
  const hipsId = useId();

  const result = calculateNavyBodyFat({
    gender,
    heightCm: height,
    waistCm: waist,
    neckCm: neck,
    hipsCm: hips,
    weightKg: weight,
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-5 text-left animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-accent text-[10px] font-bold uppercase tracking-wider">Composición Corporal</span>
          <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
            <span>🧬</span> % Grasa Corporal (U.S. Navy)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Estima grasa y masa magra mediante perímetros antropométricos.</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center text-sm font-bold active:scale-95"
          >
            ✕
          </button>
        )}
      </div>

      {/* Sex Selector */}
      <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
        <button
          type="button"
          onClick={() => setGender('male')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            gender === 'male' ? 'bg-accent text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          👨 Hombre
        </button>
        <button
          type="button"
          onClick={() => setGender('female')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            gender === 'female' ? 'bg-accent text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          👩 Mujer
        </button>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
          <label className="block text-[11px] font-bold text-slate-400">
            Peso actual
          </label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={e => setWeight(parseFloat(e.target.value) || 0)}
              className="w-full font-mono font-bold text-sm bg-transparent text-slate-100 focus:outline-none"
            />
            <span className="text-slate-500 font-bold text-[11px]">kg</span>
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
          <label className="block text-[11px] font-bold text-slate-400">
            Altura
          </label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={height}
              onChange={e => setHeight(parseInt(e.target.value) || 0)}
              className="w-full font-mono font-bold text-sm bg-transparent text-slate-100 focus:outline-none"
            />
            <span className="text-slate-500 font-bold text-[11px]">cm</span>
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
          <label htmlFor={waistId} className="block text-[11px] font-bold text-slate-400">
            Cintura (ombligo)
          </label>
          <div className="flex items-center gap-1">
            <input
              id={waistId}
              type="number"
              step="0.5"
              value={waist}
              onChange={e => setWaist(parseFloat(e.target.value) || 0)}
              className="w-full font-mono font-bold text-sm bg-transparent text-slate-100 focus:outline-none"
            />
            <span className="text-slate-500 font-bold text-[11px]">cm</span>
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
          <label htmlFor={neckId} className="block text-[11px] font-bold text-slate-400">
            Cuello (manzana)
          </label>
          <div className="flex items-center gap-1">
            <input
              id={neckId}
              type="number"
              step="0.5"
              value={neck}
              onChange={e => setNeck(parseFloat(e.target.value) || 0)}
              className="w-full font-mono font-bold text-sm bg-transparent text-slate-100 focus:outline-none"
            />
            <span className="text-slate-500 font-bold text-[11px]">cm</span>
          </div>
        </div>

        {gender === 'female' && (
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1 col-span-2 sm:col-span-4">
            <label htmlFor={hipsId} className="block text-[11px] font-bold text-slate-400">
              Cadera (máx glúteo)
            </label>
            <div className="flex items-center gap-1">
              <input
                id={hipsId}
                type="number"
                step="0.5"
                value={hips}
                onChange={e => setHips(parseFloat(e.target.value) || 0)}
                className="w-full font-mono font-bold text-sm bg-transparent text-slate-100 focus:outline-none"
              />
              <span className="text-slate-500 font-bold text-[11px]">cm</span>
            </div>
          </div>
        )}
      </div>

      {/* Result Cards */}
      {result ? (
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Grasa Estimada</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-black font-mono" style={{ color: result.categoryColor }}>
                  {result.bodyFatPercentage}%
                </span>
                <span className="text-xs font-bold text-slate-400">grasa</span>
              </div>
              <span
                className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${result.categoryColor}25`, color: result.categoryColor }}
              >
                {result.category}
              </span>
            </div>

            <div className="text-right space-y-2 font-mono">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-sans">Masa Magra</p>
                <p className="text-base font-black text-emerald-400">{result.leanMassKg} kg</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-sans">Masa Grasa</p>
                <p className="text-sm font-bold text-slate-300">{result.fatMassKg} kg</p>
              </div>
            </div>
          </div>

          {/* Progress Bar of Body Composition */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>Músculo & Huesos ({Math.round(100 - result.bodyFatPercentage)}%)</span>
              <span>Grasa ({result.bodyFatPercentage}%)</span>
            </div>
            <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${100 - result.bodyFatPercentage}%` }}
              />
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${result.bodyFatPercentage}%`, backgroundColor: result.categoryColor }}
              />
            </div>
          </div>

          {onSave && (
            <button
              type="button"
              onClick={() => onSave({ bodyFat: result.bodyFatPercentage, leanMass: result.leanMassKg, waist })}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-accent font-bold text-xs rounded-xl border border-slate-700 active:scale-98 transition-all"
            >
              Guardar en mi perfil
            </button>
          )}
        </div>
      ) : (
        <p className="text-xs text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
          ⚠️ Introduce medidas válidas (la cintura debe ser mayor que el cuello).
        </p>
      )}
    </div>
  );
}
