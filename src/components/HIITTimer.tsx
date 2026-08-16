import { useState, useEffect, useRef } from 'react';

interface Props {
  onClose: () => void;
  onShowNotification: (msg: string) => void;
  soundEnabled: boolean;
}

const PRESETS = [
  { name: 'Tabata', work: 20, rest: 10, rounds: 8, color: 'rose' },
  { name: 'EMOM', work: 50, rest: 10, rounds: 10, color: 'amber' },
  { name: 'HIIT Classic', work: 30, rest: 30, rounds: 10, color: 'emerald' },
  { name: 'Sprint', work: 40, rest: 20, rounds: 6, color: 'cyan' },
];

export function HIITTimer({ onClose, onShowNotification, soundEnabled }: Props) {
  const [preset, setPreset] = useState(0);
  const [workTime, setWorkTime] = useState(PRESETS[0].work);
  const [restTime, setRestTime] = useState(PRESETS[0].rest);
  const [rounds, setRounds] = useState(PRESETS[0].rounds);
  const [currentRound, setCurrentRound] = useState(1);
  const [isWork, setIsWork] = useState(true);
  const [timeLeft, setTimeLeft] = useState(PRESETS[0].work);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const totalSeconds = (workTime + restTime) * rounds;
  const elapsed = ((currentRound - 1) * (workTime + restTime)) + (isWork ? workTime - timeLeft : workTime);
  const progress = (elapsed / totalSeconds) * 100;

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev > 1) return prev - 1;
        // Cambiar de fase
        if (isWork) {
          setIsWork(false);
          playBeep(soundEnabled, 'rest');
          return restTime;
        } else {
          if (currentRound >= rounds) {
            setIsRunning(false);
            setIsFinished(true);
            playBeep(soundEnabled, 'end');
            onShowNotification('¡HIIT completado! 💪');
            return 0;
          }
          setCurrentRound(r => r + 1);
          setIsWork(true);
          playBeep(soundEnabled, 'work');
          return workTime;
        }
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isWork, currentRound, workTime, restTime, rounds, soundEnabled, onShowNotification]);

  const handleStart = () => {
    if (timeLeft === 0 || isFinished) {
      setCurrentRound(1);
      setIsWork(true);
      setTimeLeft(workTime);
      setIsFinished(false);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentRound(1);
    setIsWork(true);
    setTimeLeft(workTime);
    setIsFinished(false);
  };

  const handlePreset = (idx: number) => {
    setPreset(idx);
    setWorkTime(PRESETS[idx].work);
    setRestTime(PRESETS[idx].rest);
    setRounds(PRESETS[idx].rounds);
    setCurrentRound(1);
    setIsWork(true);
    setTimeLeft(PRESETS[idx].work);
    setIsRunning(false);
    setIsFinished(false);
  };

  const colorMap: Record<string, { bg: string; border: string; text: string; ring: string }> = {
    emerald: { bg: 'bg-emerald-500', border: 'border-emerald-500/30', text: 'text-emerald-400', ring: 'stroke-emerald-500' },
    cyan: { bg: 'bg-cyan-500', border: 'border-cyan-500/30', text: 'text-cyan-400', ring: 'stroke-cyan-500' },
    rose: { bg: 'bg-rose-500', border: 'border-rose-500/30', text: 'text-rose-400', ring: 'stroke-rose-500' },
    amber: { bg: 'bg-amber-500', border: 'border-amber-500/30', text: 'text-amber-400', ring: 'stroke-amber-500' },
  };
  const currentColorMap = isWork ? colorMap.emerald : colorMap.cyan;
  const C = isFinished ? colorMap.amber : currentColorMap;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-black text-base text-slate-100">🔥 HIIT Timer</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Intervalos de alta intensidad</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white w-7 h-7 rounded-full bg-slate-950/50 flex items-center justify-center border border-slate-800 text-sm">✕</button>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-4 gap-1.5">
          {PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => handlePreset(i)}
              className={`py-2 rounded-lg text-[10px] font-black uppercase transition-all active:scale-95 ${
                preset === i
                  ? `bg-${p.color}-500 text-slate-950`
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
              style={preset === i ? { backgroundColor: getHexColor(p.color) } : {}}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Timer principal */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-slate-800">
            <div
              className={`h-full transition-all duration-1000 ${isFinished ? 'bg-amber-500' : isWork ? 'bg-emerald-500' : 'bg-cyan-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className={`text-[10px] font-black uppercase tracking-widest ${C.text}`}>
            {isFinished ? '✓ COMPLETADO' : isWork ? '⚡ TRABAJO' : '💤 DESCANSO'}
          </p>
          <p className="text-6xl font-black text-slate-100 my-2 font-mono tabular-nums">
            {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
          </p>
          <p className="text-[10px] text-slate-500">
            Ronda <strong className={C.text}>{currentRound}</strong> de {rounds} · {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')} / {Math.floor(totalSeconds / 60)}:{(totalSeconds % 60).toString().padStart(2, '0')}
          </p>
        </div>

        {/* Controles */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleStart}
            className={`${isRunning ? 'bg-amber-500' : isFinished ? 'bg-emerald-500' : 'bg-emerald-500'} text-slate-950 font-black py-3 rounded-xl text-sm active:scale-95 min-h-[48px]`}
          >
            {isRunning ? '⏸ Pausar' : isFinished ? '🔁 Repetir' : '▶ Iniciar'}
          </button>
          <button
            onClick={handleReset}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-black py-3 rounded-xl text-sm active:scale-95 min-h-[48px]"
          >
            ⟲ Reset
          </button>
        </div>

        {/* Configuración */}
        {!isRunning && !isFinished && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <p className="text-[9px] text-slate-500 uppercase font-bold">Configuración</p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[9px] text-slate-500 block">Trabajo (s)</label>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setWorkTime(Math.max(5, workTime - 5)); setTimeLeft(workTime); }} className="w-7 h-7 bg-slate-800 rounded text-xs">−</button>
                  <span className="flex-1 text-center text-xs font-bold">{workTime}</span>
                  <button onClick={() => { setWorkTime(workTime + 5); setTimeLeft(workTime); }} className="w-7 h-7 bg-slate-800 rounded text-xs">+</button>
                </div>
              </div>
              <div>
                <label className="text-[9px] text-slate-500 block">Descanso (s)</label>
                <div className="flex items-center gap-1">
                  <button onClick={() => setRestTime(Math.max(5, restTime - 5))} className="w-7 h-7 bg-slate-800 rounded text-xs">−</button>
                  <span className="flex-1 text-center text-xs font-bold">{restTime}</span>
                  <button onClick={() => setRestTime(restTime + 5)} className="w-7 h-7 bg-slate-800 rounded text-xs">+</button>
                </div>
              </div>
              <div>
                <label className="text-[9px] text-slate-500 block">Rondas</label>
                <div className="flex items-center gap-1">
                  <button onClick={() => setRounds(Math.max(1, rounds - 1))} className="w-7 h-7 bg-slate-800 rounded text-xs">−</button>
                  <span className="flex-1 text-center text-xs font-bold">{rounds}</span>
                  <button onClick={() => setRounds(rounds + 1)} className="w-7 h-7 bg-slate-800 rounded text-xs">+</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="text-[10px] text-slate-500 text-center">
          {isFinished
            ? '🎉 ¡Quemaste muchas calorías! Calentamiento post-HIIT recomendado.'
            : 'Entrena al máximo en cada intervalo. La suma de pausas es tiempo perdido.'}
        </p>
      </div>
    </div>
  );
}

function getHexColor(name: string): string {
  const map: Record<string, string> = {
    emerald: '#10b981',
    cyan: '#06b6d4',
    rose: '#f43f5e',
    amber: '#f59e0b',
  };
  return map[name] || '#10b981';
}

function playBeep(soundEnabled: boolean, type: 'work' | 'rest' | 'end') {
  if (!soundEnabled || typeof window === 'undefined') return;
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    if (type === 'work') {
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'rest') {
      osc.frequency.value = 440;
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } else {
      [523, 659, 784].forEach((freq, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g);
        g.connect(audioCtx.destination);
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.08, audioCtx.currentTime + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.12 + 0.15);
        o.start(audioCtx.currentTime + i * 0.12);
        o.stop(audioCtx.currentTime + i * 0.12 + 0.15);
      });
    }
  } catch { /* noop */ }
}
