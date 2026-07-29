export function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    console.warn(`localStorage error for key "${key}"`);
    return fallback;
  }
}

export function safeSetItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn(`No se pudo escribir en localStorage (${key})`);
  }
}

export function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    console.warn(`No se pudo remover ${key} de localStorage`);
  }
}

export function safeClear(): void {
  try {
    localStorage.clear();
  } catch {
    console.warn('No se pudo borrar localStorage');
  }
}
