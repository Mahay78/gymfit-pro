import type { MachineType } from '../types';
import { MachineDiagram } from './MachineDiagram';

interface Props {
  machineType: MachineType;
  onClose: () => void;
}

export function MachineModal({ machineType, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-black text-sm text-slate-100 flex items-center gap-1.5">
              Plano Técnico de la Máquina
            </h4>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">Estructura & Anatomía Activa</p>
          </div>
          <button onClick={onClose}
            className="text-slate-400 hover:text-white font-extrabold text-xs bg-slate-950/50 w-6 h-6 rounded-full flex items-center justify-center border border-slate-800">
            ✕
          </button>
        </div>

        <div className="py-2">
          <MachineDiagram type={machineType} />
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 text-xs space-y-2 text-left">
          <p className="font-bold text-emerald-400">Instrucciones de Ajuste Ergonómico:</p>
          <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px] leading-relaxed">
            <li>Alinea las articulaciones móviles con el eje de giro indicado de la máquina.</li>
            <li>Modifica la altura del asiento para que el esfuerzo se concentre en el músculo objetivo (marcado en neón esmeralda).</li>
            <li>Mantén el movimiento controlado: realiza la contracción en 1-2 segundos y controla el retorno negativo lentamente.</li>
          </ul>
        </div>

        <button onClick={onClose}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs transition-colors">
          Hecho, Entendido
        </button>
      </div>
    </div>
  );
}
