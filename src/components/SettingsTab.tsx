import { useRef } from 'react';
import type { Theme } from '../hooks/useTheme';
import type { AccentName } from '../hooks/useAccent';
import { ACCENTS } from '../hooks/useAccent';
import { downloadExport, importData } from '../utils/exportImport';

interface Props {
  soundEnabled: boolean;
  soundType: string;
  timerTotal: number;
  hapticsEnabled: boolean;
  theme: Theme;
  accent: AccentName;
  onSoundToggle: () => void;
  onSoundTypeChange: (t: string) => void;
  onTimerTotalChange: (t: number) => void;
  onHapticsToggle: () => void;
  onThemeCycle: () => void;
  onAccentChange: (a: AccentName) => void;
  onPlaySound: (type: string) => void;
  onResetAll: () => void;
  onResetAllImages: () => void;
  onShowNotification: (msg: string) => void;
}

const soundStyles = [
  { id: 'chime', label: 'Trino' },
  { id: 'classic', label: 'Clásico' },
  { id: 'digital', label: 'Digital' },
];

const themeLabels: Record<Theme, string> = {
  dark: 'Oscuro',
  light: 'Claro',
  auto: 'Automático',
};

const themeIcons: Record<Theme, string> = {
  dark: '🌙',
  light: '☀️',
  auto: '🌓',
};

export function SettingsTab({
  soundEnabled, soundType, timerTotal, hapticsEnabled, theme, accent,
  onSoundToggle, onSoundTypeChange, onTimerTotalChange,
  onHapticsToggle, onThemeCycle, onAccentChange,
  onPlaySound, onResetAll, onResetAllImages, onShowNotification,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const result = await importData(text);
    onShowNotification(result.ok ? result.error! : `Error: ${result.error}`);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Apariencia */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <h3 className="font-black text-sm text-slate-200">Apariencia</h3>
        <button
          onClick={() => {
            onThemeCycle();
            onShowNotification(`Tema: ${themeLabels[theme === 'dark' ? 'light' : theme === 'light' ? 'auto' : 'dark']}`);
          }}
          className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs transition-all"
        >
          <div>
            <p className="font-bold text-slate-200">Tema de la app</p>
            <p className="text-[10px] text-slate-500">Cambiar entre oscuro, claro o automático</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900">
            <span>{themeIcons[theme]}</span>
            <span className="font-bold text-slate-200">{themeLabels[theme]}</span>
          </div>
        </button>

        <div>
          <p className="text-[10px] text-slate-500 mb-2">Color de acento</p>
          <div className="flex gap-2 flex-wrap">
            {ACCENTS.map(a => (
              <button
                key={a.name}
                onClick={() => { onAccentChange(a.name); onShowNotification(`Acento: ${a.label}`); }}
                className={`w-10 h-10 rounded-full border-2 transition-all active:scale-90 ${accent === a.name ? 'border-slate-200 scale-110' : 'border-slate-800'}`}
                style={{ backgroundColor: a.hex }}
                title={a.label}
                aria-label={`Acento ${a.label}`}
              >
                {accent === a.name && <span className="text-slate-950 font-black text-sm">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sonido y Vibración */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <h3 className="font-black text-sm text-slate-200">Sonido y Vibración</h3>

        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-850">
          <div className="text-xs">
            <p className="font-bold text-slate-200">Alarma Sonora</p>
            <p className="text-[10px] text-slate-500">Alerta al terminar descansos y cardio.</p>
          </div>
          <button
            onClick={() => {
              onSoundToggle();
              onShowNotification(soundEnabled ? "Sonidos Silenciados" : "Sonidos Activados");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${soundEnabled ? 'bg-accent text-slate-950' : 'bg-slate-800 text-slate-400'}`}
          >
            {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-850">
          <div className="text-xs">
            <p className="font-bold text-slate-200">Vibración Háptica</p>
            <p className="text-[10px] text-slate-500">Feedback táctil al completar series (móvil).</p>
          </div>
          <button
            onClick={() => {
              onHapticsToggle();
              onShowNotification(hapticsEnabled ? "Vibración desactivada" : "Vibración activada");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${hapticsEnabled ? 'bg-accent text-slate-950' : 'bg-slate-800 text-slate-400'}`}
          >
            {hapticsEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          {soundStyles.map(style => (
            <button
              key={style.id}
              onClick={() => { onSoundTypeChange(style.id); onPlaySound(style.id); }}
              className={`p-2.5 rounded-xl border font-bold transition-all ${
                soundType === style.id
                  ? 'bg-accent text-slate-950 border-accent/40'
                  : 'bg-slate-950 border-slate-850 text-slate-300'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Descanso */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <h3 className="font-black text-sm text-slate-200">Duración del Descanso</h3>
        <div className="grid grid-cols-4 gap-2 text-xs">
          {[60, 90, 120, 150].map(sec => (
            <button
              key={sec}
              onClick={() => { onTimerTotalChange(sec); onShowNotification(`Descanso: ${sec}s`); }}
              className={`py-2 rounded-xl font-bold border ${timerTotal === sec ? 'bg-accent text-slate-950 border-accent/40' : 'bg-slate-950 border-slate-850'}`}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>

      {/* Datos */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <h3 className="font-black text-sm text-slate-200">Mis Datos</h3>
        <p className="text-[10px] text-slate-500">Exporta o importa tu progreso (incluye pesos, historial, medidas).</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => { downloadExport(); onShowNotification("Backup descargado"); }}
            className="bg-accent/10 border border-accent/30 text-accent py-2.5 rounded-xl text-xs font-bold hover:bg-accent/15"
          >
            📥 Exportar
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 py-2.5 rounded-xl text-xs font-bold hover:bg-cyan-500/20"
          >
            📤 Importar
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl text-xs space-y-2">
        <h3 className="font-black text-sm text-rose-500">Zona de peligro</h3>
        <p className="text-slate-400">Borra tu historial y pesos guardados para reiniciar de cero:</p>
        <button
          onClick={() => {
            if (confirm("¿Seguro que deseas vaciar todos los registros?")) {
              onResetAll();
              onShowNotification("Progreso borrado. Recarga la página.");
            }
          }}
          className="bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 px-4 py-2 rounded-xl font-bold transition-all"
        >
          Restablecer Todo de Cero
        </button>
        <button
          onClick={() => {
            if (confirm("¿Restablecer todas las imágenes personalizadas?")) {
              onResetAllImages();
              onShowNotification("Imágenes restablecidas.");
            }
          }}
          className="bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 px-4 py-2 rounded-xl font-bold transition-all"
        >
          Restablecer Imágenes
        </button>
      </div>
    </div>
  );
}
