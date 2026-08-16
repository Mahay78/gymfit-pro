import { describe, it, expect, vi, beforeEach } from 'vitest';
import { speakText, announceNextSet, announceRestTimer, announceRestEnding } from '../voiceCoach';

describe('voiceCoach utility', () => {
  let mockSpeak: any;
  let mockCancel: any;

  beforeEach(() => {
    mockSpeak = vi.fn();
    mockCancel = vi.fn();

    (globalThis as any).window = globalThis;

    (globalThis as any).SpeechSynthesisUtterance = vi.fn().mockImplementation(function (this: any, text: string) {
      this.text = text;
      this.lang = 'es-ES';
    });

    Object.defineProperty(globalThis, 'speechSynthesis', {
      writable: true,
      value: {
        speak: mockSpeak,
        cancel: mockCancel,
        getVoices: vi.fn().mockReturnValue([]),
      },
    });
  });

  it('speaks text when enabled', () => {
    speakText('Hola gimnasio', { enabled: true });
    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalled();
  });

  it('does not speak when disabled', () => {
    speakText('Hola gimnasio', { enabled: false });
    expect(mockSpeak).not.toHaveBeenCalled();
  });

  it('announces set with proper Spanish format', () => {
    announceNextSet('Press Banca', 1, 80, 8, true);
    expect(mockSpeak).toHaveBeenCalled();
  });

  it('announces rest timer correctly', () => {
    announceRestTimer(90, true);
    expect(mockSpeak).toHaveBeenCalled();
  });

  it('announces 10 seconds reminder', () => {
    announceRestEnding(10, true);
    expect(mockSpeak).toHaveBeenCalled();
  });
});
