/**
 * Voice Coach Utility using Web Speech API (SpeechSynthesis)
 * Provides hands-free audio announcements in Spanish for gym sets and rest timers.
 */

export interface VoiceCoachOptions {
  enabled: boolean;
  rate?: number; // 0.8 to 1.2
  pitch?: number; // 0.9 to 1.1
}

let cachedVoice: SpeechSynthesisVoice | null = null;

function getSpanishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  if (cachedVoice) return cachedVoice;

  const voices = window.speechSynthesis.getVoices();
  const esVoice =
    voices.find(v => v.lang.startsWith('es-') || v.lang === 'es' || v.lang === 'es_ES') ||
    voices.find(v => v.name.toLowerCase().includes('spanish') || v.name.toLowerCase().includes('español')) ||
    null;

  if (esVoice) cachedVoice = esVoice;
  return esVoice;
}

export function speakText(text: string, options: VoiceCoachOptions = { enabled: true }) {
  if (!options.enabled) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Cancel any pending utterances

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = options.rate ?? 1.05;
    utterance.pitch = options.pitch ?? 1.0;

    const voice = getSpanishVoice();
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  } catch {
    // Fail gracefully if device has restricted speech synthesis
  }
}

export function announceNextSet(exerciseName: string, setNumber: number, weight: number, reps: number, enabled: boolean) {
  if (!enabled) return;
  const text = `Serie ${setNumber} de ${exerciseName}. ${weight} kilos, ${reps} repeticiones.`;
  speakText(text, { enabled });
}

export function announceRestTimer(seconds: number, enabled: boolean) {
  if (!enabled) return;
  const text = `Descanso iniciado: ${seconds} segundos.`;
  speakText(text, { enabled });
}

export function announceRestEnding(remaining: number, enabled: boolean) {
  if (!enabled) return;
  if (remaining === 10) {
    speakText('10 segundos para la siguiente serie.', { enabled });
  } else if (remaining === 3) {
    speakText('3, 2, 1, ¡a por ello!', { enabled });
  }
}

export function announceWorkoutComplete(durationFormatted: string, totalVolume: number, enabled: boolean) {
  if (!enabled) return;
  const text = `¡Entrenamiento completado en ${durationFormatted}! Has levantado un volumen total de ${totalVolume} kilos. ¡Gran trabajo!`;
  speakText(text, { enabled });
}
