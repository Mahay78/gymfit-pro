export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function formatDate(): string {
  return new Date().toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}
