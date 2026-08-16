import { useState, useRef } from 'react';
import type { MachineType } from '../types';

interface Props {
  machineType: MachineType;
  currentImage: string;
  defaultImage: string;
  hasOverride: boolean;
  onSave: (dataUrl: string) => void;
  onReset: () => void;
  onClose: () => void;
  onShowNotification: (msg: string) => void;
}

export function ImageEditor({ currentImage, defaultImage: _defaultImage, hasOverride, onSave, onReset, onClose, onShowNotification }: Props) {
  const [url, setUrl] = useState(currentImage);
  const [tab, setTab] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX = 800;
          let { width, height } = img;
          if (width > MAX || height > MAX) {
            if (width > height) {
              height = (height / width) * MAX;
              width = MAX;
            } else {
              width = (width / height) * MAX;
              height = MAX;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('Canvas no soportado');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = () => reject('Error al cargar imagen');
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject('Error al leer archivo');
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onShowNotification('Solo se permiten imágenes');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      onShowNotification('Imagen demasiado grande (max 5MB)');
      return;
    }
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      onSave(compressed);
      onShowNotification('Imagen guardada');
      onClose();
    } catch {
      onShowNotification('Error al procesar la imagen');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSaveUrl = () => {
    if (!url.trim()) {
      onShowNotification('Introduce una URL válida');
      return;
    }
    onSave(url.trim());
    onShowNotification('Imagen actualizada');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-sm space-y-4 shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-black text-sm text-slate-100">Cambiar imagen</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Personaliza la foto de esta máquina</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white w-6 h-6 rounded-full bg-slate-950/50 flex items-center justify-center border border-slate-800">✕</button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setTab('url')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold ${tab === 'url' ? 'bg-accent text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
          >
            🔗 URL
          </button>
          <button
            onClick={() => setTab('upload')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold ${tab === 'upload' ? 'bg-accent text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
          >
            📷 Subir
          </button>
        </div>

        {tab === 'url' ? (
          <div className="space-y-2">
            <input
              type="url"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-accent/50"
            />
            <button
              onClick={handleSaveUrl}
              disabled={uploading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs disabled:opacity-50"
            >
              Guardar URL
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFile}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full bg-slate-950 border-2 border-dashed border-slate-700 hover:border-emerald-500/50 py-8 rounded-xl text-slate-400 text-xs font-bold disabled:opacity-50"
            >
              {uploading ? '⏳ Procesando...' : '📷 Toca para elegir foto o cámara'}
            </button>
            <p className="text-[9px] text-slate-500 text-center">JPG/PNG, max 5MB. Se redimensiona automáticamente.</p>
          </div>
        )}

        {hasOverride && (
          <button
            onClick={() => { onReset(); onShowNotification('Imagen restablecida'); onClose(); }}
            className="w-full bg-rose-500/10 border border-rose-500/30 text-rose-400 py-2 rounded-xl text-xs font-bold hover:bg-rose-500/20"
          >
            🔄 Restablecer imagen original
          </button>
        )}
      </div>
    </div>
  );
}
