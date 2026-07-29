interface Notification {
  id: number;
  message: string;
}

interface Props {
  notifications: Notification[];
  onDismiss: (id: number) => void;
}

export function NotificationBanner({ notifications, onDismiss }: Props) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4">
      {notifications.map(note => (
        <div key={note.id} className="bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between border border-emerald-400/25">
          <span className="font-bold text-xs">{note.message}</span>
          <button onClick={() => onDismiss(note.id)} className="text-slate-950 hover:text-white ml-2 text-xs font-bold">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
