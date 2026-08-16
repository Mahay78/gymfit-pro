import { useState } from 'react';

interface Props {
  onComplete: () => void;
}

const slides = [
  {
    icon: '🏋️',
    title: 'Bienvenido a GymFit Pro',
    text: 'Tu compañero de entrenamiento para perder grasa y mantener músculo. Diseñado para ser simple y efectivo.',
  },
  {
    icon: '📋',
    title: 'Rutinas inteligentes',
    text: 'Tienes dos opciones: Full Body 3 días (ideal para pérdida de grasa) o A/B Empuje-Tirón. Empieza con la que prefieras.',
  },
  {
    icon: '📊',
    title: 'Mide tu progreso',
    text: 'Registra peso, medidas y notas. Verás gráficas de tendencia, records personales y rachas de entrenamiento.',
  },
  {
    icon: '🔥',
    title: 'Mantén el músculo',
    text: 'Cardio post-pesas de 30 min para quemar grasa sin perder músculo. La clave de un déficit saludable.',
  },
];

export function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const slide = slides[step];
  const isLast = step === slides.length - 1;

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col p-6 animate-fadeIn">
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4 sm:space-y-6">
        <div className="text-5xl sm:text-7xl animate-bounce">{slide.icon}</div>
        <h1 className="text-xl sm:text-2xl font-black text-accent">{slide.title}</h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{slide.text}</p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === step ? 'w-8 bg-emerald-500' : 'w-1.5 bg-slate-700'
            }`}
          />
        ))}
      </div>

      <div className="flex gap-3">
        {!isLast && (
          <button
            onClick={onComplete}
            className="flex-1 py-3 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-300 min-h-[48px]"
          >
            Saltar
          </button>
        )}
        <button
          onClick={() => isLast ? onComplete() : setStep(step + 1)}
          className={`flex-1 py-3 rounded-xl text-sm font-black transition-all min-h-[48px] ${
            isLast
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-100'
          }`}
        >
          {isLast ? '¡Comenzar!' : 'Siguiente →'}
        </button>
      </div>
    </div>
  );
}
