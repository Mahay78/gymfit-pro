import type { TabId } from '../types';

interface Props {
  activeTab?: TabId;
  workoutActive?: boolean;
  onTabChange?: (tab: TabId) => void;
  setActiveTab?: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; shortLabel: string; icon: string }[] = [
  {
    id: 'entrenar',
    label: 'Entrenar',
    shortLabel: 'Entrenar',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    id: 'progreso',
    label: 'Progreso',
    shortLabel: 'Progreso',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    id: 'deficit',
    label: 'Nutrición',
    shortLabel: 'Nutrición',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  },
  {
    id: 'ajustes',
    label: 'Ajustes',
    shortLabel: 'Ajustes',
    icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  },
];

export function Navigation({ activeTab = 'entrenar', workoutActive = false, onTabChange, setActiveTab }: Props) {
  const handleTabClick = (tabId: TabId) => {
    if (typeof onTabChange === 'function') {
      onTabChange(tabId);
    } else if (typeof setActiveTab === 'function') {
      setActiveTab(tabId);
    }
  };

  // Normalizar rutinas/entrenar
  const currentTab = activeTab === 'rutinas' ? 'entrenar' : activeTab;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/92 backdrop-blur-2xl border-t border-white/5 z-40 px-2 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] safe-bottom nav-landscape">
      <div className="max-w-md mx-auto flex items-center justify-between gap-1 sm:gap-2">
        {tabs.map(tab => {
          const active = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center flex-1 py-2 px-1 min-h-[56px] rounded-2xl active:scale-95 transition-all ${
                active ? 'text-accent' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {active && (
                <span className="absolute top-0.5 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full bg-gradient-to-r from-accent to-accent/70 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              )}
              {tab.id === 'entrenar' && workoutActive && (
                <span className="absolute top-1.5 right-1/4 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              )}
              <span
                className={`relative flex items-center justify-center w-12 h-8 rounded-xl transition-colors ${
                  active ? 'bg-accent/15' : ''
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={active ? 2.2 : 1.75}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
              </span>
              <span className={`text-[10px] mt-0.5 font-bold truncate max-w-full ${active ? 'text-accent font-black' : ''}`}>
                {tab.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
