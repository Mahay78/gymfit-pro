import { useRef, useState } from 'react';
import type { Theme } from '../hooks/useTheme';
import type { AccentName } from '../hooks/useAccent';
import { ACCENTS } from '../hooks/useAccent';
import { exportDatabaseToJson, importDatabaseFromJson, exportHistoryToCsv } from '../utils/backupRestore';
import { speakText } from '../utils/voiceCoach';

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
  soundEnabled,
  soundType,
  timerTotal,
  hapticsEnabled,
  theme,
  accent,
  onSoundToggle,
  onSoundTypeChange,
  onTimerTotalChange,
  onHapticsToggle,
  onThemeCycle,
  onAccentChange,
  onPlaySound,
  onResetAll,
  onResetAllImages,
  onShowNotification,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [voiceCoachEnabled, setVoiceCoachEnabled] = useState(true);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const result = await importDatabaseFromJson(text);
      onShowNotification(result.message);
      if (result.success) {
        setTimeout(() => window.location.reload(), 1200);
      }
    } catch {
      onShowNotification('Error al leer el archivo de respaldo');
    }
    e.target.value = '';
  };

  const handleExportCsv = async () => {
    try {
      await exportHistoryToCsv();
      onShowNotification('Historial exportado a Excel / CSV ✓');
    } catch (err: any) {
      onShowNotification(err?.message || 'Error al exportar');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Apariencia */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <h3 className="font-black text-sm text-slate-200">Apariencia</h3>
        <button
          onClick={() => {
            onThemeCycle();
            onShowNotification(
              `Tema: ${themeLabels[theme === 'dark' ? 'light' : theme === 'light' ? 'auto' : 'dark']}`
            );
          }}
          className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs transition-all active:scale-98"
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
                onClick={() => {
                  onAccentChange(a.name);
                  onShowNotification(`Acento: ${a.label}`);
                }}
                className={`w-10 h-10 rounded-full border-2 transition-all active:scale-90 flex items-center justify-center ${
                  accent === a.name ? 'border-slate-200 scale-110' : 'border-slate-800'
                }`}
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

      {/* Sonido, Voz y Vibración */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <h3 className="font-black text-sm text-slate-200">Audio & Entrenador por Voz</h3>

        {/* Voice Coach Hands-Free */}
        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-850">
          <div className="text-xs">
            <p className="font-bold text-slate-200 flex items-center gap-1.5">
              <span>🗣️</span> Entrenador por Voz (Manos Libres)
            </p>
            <p className="text-[10px] text-slate-500">Anuncia series, cargas y cuenta atrás por auriculares.</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                speakText('Probando entrenador por voz de GymFit Pro. Serie 1 de Press Banca: 80 kilos.', {
                  enabled: true,
                });
                onShowNotification('Probando voz en auriculares...');
              }}
              className="px-2 py-1 bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300 rounded-lg active:scale-95"
            >
              Probar
            </button>
            <button
              onClick={() => {
                setVoiceCoachEnabled(prev => !prev);
                onShowNotification(voiceCoachEnabled ? 'Voz desactivada' : 'Voz activada ✓');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                voiceCoachEnabled ? 'bg-accent text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {voiceCoachEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-850">
          <div className="text-xs">
            <p className="font-bold text-slate-200">Alarma Sonora</p>
            <p className="text-[10px] text-slate-500">Alerta al terminar descansos y cardio.</p>
          </div>
          <button
            onClick={() => {
              onSoundToggle();
              onShowNotification(soundEnabled ? 'Sonidos Silenciados' : 'Sonidos Activados');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              soundEnabled ? 'bg-accent text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}
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
              onShowNotification(hapticsEnabled ? 'Vibración desactivada' : 'Vibración activada');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              hapticsEnabled ? 'bg-accent text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {hapticsEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-850">
          <div className="text-xs">
            <p className="font-bold text-slate-200">Avisos en Segundo Plano</p>
            <p className="text-[10px] text-slate-500">Notificar aunque bloquees la pantalla.</p>
          </div>
          <button
            onClick={async () => {
              const { requestNotificationPermission } = await import('../utils/browserNotifications');
              const granted = await requestNotificationPermission();
              onShowNotification(granted ? 'Notificaciones permitidas ✓' : 'Permiso no concedido');
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-850 hover:bg-slate-800 text-accent border border-slate-750 active:scale-95"
          >
            Activar Permiso
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          {soundStyles.map(style => (
            <button
              key={style.id}
              onClick={() => {
                onSoundTypeChange(style.id);
                onPlaySound(style.id);
              }}
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
        <h3 className="font-black text-sm text-slate-200">Duración del Descanso Estándar</h3>
        <div className="grid grid-cols-4 gap-2 text-xs">
          {[60, 90, 120, 150].map(sec => (
            <button
              key={sec}
              onClick={() => {
                onTimerTotalChange(sec);
                onShowNotification(`Descanso: ${sec}s`);
              }}
              className={`py-2 rounded-xl font-bold border transition-all ${
                timerTotal === sec
                  ? 'bg-accent text-slate-950 border-accent/40'
                  : 'bg-slate-950 border-slate-850 text-slate-400'
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>

      {/* Gestión de Datos & Copias de Seguridad */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <h3 className="font-black text-sm text-slate-200">Copia de Seguridad & Exportación</h3>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Guarda una copia completa de tus entrenamientos, pesos personalizados, medidas y récords en tu dispositivo o
          ábrelo en Excel.
        </p>
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={async () => {
              await exportDatabaseToJson();
              onShowNotification('Copia de respaldo (.json) descargada ✓');
            }}
            className="bg-accent/15 border border-accent/30 text-accent py-2.5 rounded-xl text-xs font-bold hover:bg-accent/20 active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
          >
            <span>📥</span> Respaldo JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 py-2.5 rounded-xl text-xs font-bold hover:bg-cyan-500/20 active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
          >
            <span>📤</span> Restaurar
          </button>
          <button
            onClick={handleExportCsv}
            className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-500/20 active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
          >
            <span>📊</span> Excel / CSV
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
      </div>

      {/* Zona de peligro */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl text-xs space-y-2">
        <h3 className="font-black text-sm text-rose-500">Zona de peligro</h3>
        <p className="text-slate-400">Borra tu historial y pesos guardados para reiniciar de cero:</p>
        <div className="flex gap-2 flex-wrap pt-1">
          <button
            onClick={() => {
              if (confirm('¿Seguro que deseas vaciar todos los registros?')) {
                onResetAll();
                onShowNotification('Progreso borrado. Recarga la página.');
              }
            }}
            className="bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 px-4 py-2 rounded-xl font-bold transition-all active:scale-95"
          >
            Restablecer Todo
          </button>
          <button
            onClick={() => {
              if (confirm('¿Restablecer todas las imágenes personalizadas?')) {
                onResetAllImages();
                onShowNotification('Imágenes restablecidas.');
              }
            }}
            className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold transition-all active:scale-95"
          >
            Restablecer Imágenes
          </button>
        </div>
      </div>
    </div>
  );
}
