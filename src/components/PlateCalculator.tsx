import { useState } from 'react';
import type { PlateResult } from '../types';

interface Props {
  exercise: { id: string; name: string; machineBase: number };
  customWeights: Record<string, number>;
  onApply: (id: string, weight: number) => void;
  onClose: () => void;
  onShowNotification: (msg: string) => void;
}

function calculatePlates(target: number, base: number): PlateResult {
  const weightPerSide = (target - base) / 2;
  if (weightPerSide <= 0) {
    return { error: "El peso objetivo es menor o igual al peso base de la máquina.", weightPerSide: 0, plates: [], unresolved: 0 };
  }

  const availablePlates = [20, 15, 10, 5, 2.5];
  const platesUsed: { size: number; count: number }[] = [];
  let tempWeight = weightPerSide;

  availablePlates.forEach(plate => {
    const count = Math.floor(tempWeight / plate);
    if (count > 0) {
      platesUsed.push({ size: plate, count });
      tempWeight -= count * plate;
    }
  });

  return { weightPerSide, plates: platesUsed, unresolved: tempWeight };
}

export function PlateCalculator({ exercise, customWeights, onApply, onClose, onShowNotification }: Props) {
  const [targetWeight, setTargetWeight] = useState(customWeights[exercise.id] || 40);
  const result = calculatePlates(targetWeight, exercise.machineBase || 0);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl my-auto">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-black text-sm text-slate-100">Calculadora de Discos</h4>
            <p className="text-[10px] text-slate-400">{exercise.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-xs">Cerrar</button>
        </div>

        <div className="space-y-3">
          <div className="text-xs">
            <label className="block text-slate-400 mb-1 font-semibold">Peso Objetivo (kg)</label>
            <div className="flex gap-2 items-center">
              <input type="number" inputMode="decimal" value={targetWeight}
                onChange={(e) => setTargetWeight(parseInt(e.target.value) || 0)}
                className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 font-mono font-bold w-full" />
              <span className="text-xs text-slate-400 whitespace-nowrap">Peso Base: {exercise.machineBase || 0}kg</span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3 text-xs text-left">
            <p className="font-bold text-accent text-center">A cargar a CADA lado de la máquina:</p>
            {result.error ? (
              <p className="text-rose-400 text-center font-bold text-[11px]">{result.error}</p>
            ) : result.plates.length > 0 ? (
              <div className="space-y-1.5">
                {result.plates.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-900 px-3 py-2 rounded-xl">
                    <span className="font-bold text-slate-200">Discos de {p.size} kg</span>
                    <span className="bg-accent text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full">
                      {p.count} unidad(es)
                    </span>
                  </div>
                ))}
                <p className="text-[10px] text-slate-500 text-center pt-2">
                  Total por lateral: {result.weightPerSide} kg | Peso Total: {targetWeight} kg
                </p>
              </div>
            ) : (
              <p className="text-slate-500 text-center">No necesitas añadir discos extra para esta carga.</p>
            )}
          </div>
        </div>

        <button onClick={() => { onApply(exercise.id, targetWeight); onClose(); onShowNotification(`Carga de ${targetWeight}kg aplicada a este ejercicio`); }}
          className="w-full bg-accent text-slate-950 font-black py-2.5 rounded-xl text-xs">
          Aplicar este peso a la rutina
        </button>
      </div>
    </div>
  );
}
