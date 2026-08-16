import { describe, it, expect } from 'vitest';
import { createChallengeUrl, generateWhatsAppMessage } from '../shareMotivation';

describe('shareMotivation utility', () => {
  it('generates challenge url with parameters', () => {
    const url = createChallengeUrl({
      athleteName: 'Carlos',
      workoutTitle: 'Día 1: Pecho & Espalda',
      volume: 4500,
      duration: '48 min',
      streak: 5,
    });

    expect(url).toContain('challenge=1');
    expect(url).toContain('athlete=Carlos');
    expect(url).toContain('vol=4500');
    expect(url).toContain('dur=48+min');
    expect(url).toContain('streak=5');
  });

  it('generates rich WhatsApp message with call to action', () => {
    const msg = generateWhatsAppMessage({
      athleteName: 'Carlos',
      workoutTitle: 'Día 1: Pecho & Espalda',
      volume: 4500,
      duration: '48 min',
      streak: 5,
    });

    expect(msg).toContain('GymFit Pro');
    expect(msg).toContain('Día 1: Pecho & Espalda');
    expect(msg).toMatch(/4[,.]?500\s*kg/);
    expect(msg).toContain('5 días consecutivos');
    expect(msg).toContain('¿Aceptas el reto de entrenar hoy?');
  });
});
