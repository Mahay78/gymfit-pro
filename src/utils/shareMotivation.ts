export interface ChallengeShareData {
  athleteName?: string;
  workoutTitle: string;
  volume: number;
  duration: string;
  streak?: number;
}

export function createChallengeUrl(data: ChallengeShareData): string {
  let baseUrl = 'https://mahay78.github.io/gymfit-pro/';

  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    // Si ya está en un dominio público real (no localhost), usar el dominio actual
    if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      const pathname = window.location.pathname;
      const cleanPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
      baseUrl = `${origin}${cleanPath}`;
    }
  }

  const params = new URLSearchParams({
    challenge: '1',
    athlete: data.athleteName || 'Tu compañero',
    workout: data.workoutTitle,
    vol: data.volume.toString(),
    dur: data.duration,
  });

  if (data.streak) {
    params.set('streak', data.streak.toString());
  }

  return `${baseUrl}?${params.toString()}`;
}

export function generateWhatsAppMessage(data: ChallengeShareData): string {
  const challengeUrl = createChallengeUrl(data);
  const streakText = data.streak ? `\n🔥 Racha activa: *${data.streak} días consecutivos*` : '';

  return (
    `🏋️ *¡Acabo de completar mi entrenamiento en GymFit Pro!*\n\n` +
    `⚡ Sesión: *${data.workoutTitle}*\n` +
    `📊 Volumen total levantado: *${data.volume.toLocaleString()} kg*\n` +
    `⏱️ Tiempo: *${data.duration}*` +
    streakText +
    `\n\n🎯 *¿Aceptas el reto de entrenar hoy?* Abre mi reto aquí:\n👉 ${challengeUrl}`
  );
}

export function shareViaWhatsApp(data: ChallengeShareData): string {
  const message = generateWhatsAppMessage(data);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;

  if (typeof window !== 'undefined') {
    // Intentar copiar al portapapeles por seguridad
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message).catch(() => {});
    }

    // Abrir WhatsApp
    const win = window.open(whatsappUrl, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = whatsappUrl;
    }
  }

  return message;
}

export function parseChallengeFromUrl(): ChallengeShareData | null {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('challenge') !== '1') return null;

  const athleteName = urlParams.get('athlete') || 'Tu compañero';
  const workoutTitle = urlParams.get('workout') || 'Entrenamiento de Fuerza';
  const volume = parseInt(urlParams.get('vol') || '0', 10);
  const duration = urlParams.get('dur') || '45 min';
  const streak = urlParams.get('streak') ? parseInt(urlParams.get('streak')!, 10) : undefined;

  return {
    athleteName,
    workoutTitle,
    volume,
    duration,
    streak,
  };
}

export function clearChallengeUrl() {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.delete('challenge');
  url.searchParams.delete('athlete');
  url.searchParams.delete('workout');
  url.searchParams.delete('vol');
  url.searchParams.delete('dur');
  url.searchParams.delete('streak');

  window.history.replaceState({}, document.title, url.pathname + (url.search ? `?${url.search}` : ''));
}
