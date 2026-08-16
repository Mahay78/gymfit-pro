import { useCallback, useRef } from 'react';

export function useSoundEffects() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback((typeToPlay: string) => {
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) return;

      const playBeep = (freq: number, duration: number, delay = 0) => {
        setTimeout(() => {
          if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
          }
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + duration);
        }, delay);
      };

      if (typeToPlay === 'classic') {
        playBeep(880, 0.4, 0);
      } else if (typeToPlay === 'chime') {
        playBeep(523.25, 0.25, 0);
        playBeep(659.25, 0.25, 120);
        playBeep(783.99, 0.25, 240);
        playBeep(1046.50, 0.4, 360);
      } else if (typeToPlay === 'digital') {
        playBeep(987.77, 0.15, 0);
        playBeep(987.77, 0.15, 180);
      }
    } catch {
      // AudioContext not supported or permission denied
    }
  }, [getAudioContext]);

  return { playSound };
}
