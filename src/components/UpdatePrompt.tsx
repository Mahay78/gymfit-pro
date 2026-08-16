import { useEffect, useState } from 'react';

export function UpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const onControllerChange = () => {
      window.location.reload();
    };

    let registration: ServiceWorkerRegistration | undefined;
    const checkForUpdate = async () => {
      try {
        registration = await navigator.serviceWorker.getRegistration();
        if (!registration) return;

        registration.addEventListener('updatefound', () => {
          const newWorker = registration?.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setShowPrompt(true);
            }
          });
        });
      } catch {
        // SW no disponible, ignorar
      }
    };

    checkForUpdate();

    return () => {
      if (registration) {
        navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      }
    };
  }, []);

  if (!showPrompt) return null;

  const handleUpdate = () => {
    navigator.serviceWorker.getRegistration().then(reg => {
      reg?.waiting?.postMessage({ type: 'SKIP_WAITING' });
    });
    window.location.reload();
  };

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-accent text-slate-950 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideUp max-w-sm">
      <div className="flex-1">
        <p className="font-black text-xs">Nueva versión disponible</p>
        <p className="text-[10px] opacity-80">Actualiza para obtener las últimas mejoras</p>
      </div>
      <button
        onClick={handleUpdate}
        className="bg-slate-950 text-accent font-black text-xs px-3 py-1.5 rounded-lg active:scale-95"
      >
        Actualizar
      </button>
      <button
        onClick={() => setShowPrompt(false)}
        className="text-slate-950 opacity-60 hover:opacity-100 text-xs px-1"
        aria-label="Cerrar"
      >
        ✕
      </button>
    </div>
  );
}
