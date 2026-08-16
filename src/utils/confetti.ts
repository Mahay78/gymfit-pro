/**
 * Lightweight native HTML5 Canvas Confetti burst utility (0 npm dependencies).
 */

export function triggerConfetti(durationMs: number = 2500) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Create overlay canvas if not exists
  let canvas = document.getElementById('gymfit-confetti-canvas') as HTMLCanvasElement | null;
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'gymfit-confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#10b981', '#34d399', '#22d3ee', '#f59e0b', '#ec4899', '#a855f7', '#3b82f6'];
  const particleCount = 75;
  const particles: Array<{
    x: number;
    y: number;
    size: number;
    color: string;
    speedX: number;
    speedY: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
  }> = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 80,
      y: canvas.height * 0.4 + (Math.random() - 0.5) * 40,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 14,
      speedY: -(Math.random() * 12 + 6),
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
    });
  }

  const startTime = Date.now();

  function render() {
    if (!ctx || !canvas) return;
    const elapsed = Date.now() - startTime;
    if (elapsed > durationMs) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.speedY += 0.35; // Gravity
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, 1 - elapsed / durationMs);

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
