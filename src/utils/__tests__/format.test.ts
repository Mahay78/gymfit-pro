import { describe, it, expect, vi } from 'vitest';
import { formatTime, formatDate } from '../format';

describe('formatTime', () => {
  it('formats seconds to MM:SS', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(30)).toBe('00:30');
    expect(formatTime(60)).toBe('01:00');
    expect(formatTime(90)).toBe('01:30');
    expect(formatTime(3599)).toBe('59:59');
    expect(formatTime(3600)).toBe('60:00');
    expect(formatTime(3661)).toBe('61:01');
  });
});

describe('formatDate', () => {
  it('returns formatted date in Spanish locale', () => {
    const mockDate = new Date('2025-01-15T10:00:00');
    vi.setSystemTime(mockDate);
    
    const result = formatDate();
    
    expect(result).toContain('15');
    expect(result).toContain('ene');
    expect(result).toContain('2025');
    
    vi.useRealTimers();
  });
});