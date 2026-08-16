import { describe, it, expect, vi, beforeEach } from 'vitest';
import { safeGetItem, safeSetItem, safeRemoveItem, safeClear } from '../storage';

const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem(key: string) {
    return this.store[key] ?? null;
  },
  setItem(key: string, value: string) {
    this.store[key] = value;
  },
  removeItem(key: string) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  },
};

beforeEach(() => {
  mockLocalStorage.clear();
  vi.stubGlobal('localStorage', mockLocalStorage);
});

describe('safeGetItem', () => {
  it('returns fallback for missing key', () => {
    expect(safeGetItem('missing', 'default')).toBe('default');
    expect(safeGetItem('missing', 42)).toBe(42);
    expect(safeGetItem('missing', { a: 1 })).toEqual({ a: 1 });
  });

  it('returns parsed value for existing key', () => {
    mockLocalStorage.setItem('test', JSON.stringify({ foo: 'bar' }));
    expect(safeGetItem('test', { foo: 'baz' })).toEqual({ foo: 'bar' });
  });

  it('returns fallback for invalid JSON', () => {
    mockLocalStorage.setItem('test', 'not-json');
    expect(safeGetItem('test', 'fallback')).toBe('fallback');
  });

  it('returns fallback when localStorage throws', () => {
    vi.stubGlobal('localStorage', {
      getItem() { throw new Error('Quota exceeded'); },
      setItem() {},
      removeItem() {},
      clear() {},
    });
    expect(safeGetItem('test', 'fallback')).toBe('fallback');
  });
});

describe('safeSetItem', () => {
  it('stores stringified value', () => {
    safeSetItem('test', { a: 1, b: 'two' });
    expect(mockLocalStorage.getItem('test')).toBe(JSON.stringify({ a: 1, b: 'two' }));
  });

  it('handles circular references gracefully', () => {
    const circular: any = { a: 1 };
    circular.self = circular;
    expect(() => safeSetItem('test', circular)).not.toThrow();
  });

  it('does not throw when localStorage fails', () => {
    vi.stubGlobal('localStorage', {
      getItem() { return null; },
      setItem() { throw new Error('Quota exceeded'); },
      removeItem() {},
      clear() {},
    });
    expect(() => safeSetItem('test', 'value')).not.toThrow();
  });
});

describe('safeRemoveItem', () => {
  it('removes existing key', () => {
    mockLocalStorage.setItem('test', 'value');
    safeRemoveItem('test');
    expect(mockLocalStorage.getItem('test')).toBeNull();
  });

  it('does not throw for missing key', () => {
    expect(() => safeRemoveItem('missing')).not.toThrow();
  });
});

describe('safeClear', () => {
  it('clears all items', () => {
    mockLocalStorage.setItem('a', '1');
    mockLocalStorage.setItem('b', '2');
    safeClear();
    expect(mockLocalStorage.getItem('a')).toBeNull();
    expect(mockLocalStorage.getItem('b')).toBeNull();
  });
});