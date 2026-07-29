import type { HistoryItem } from '../types';

interface Props {
  history: HistoryItem[];
}

export function MonthlyStats({ history }: Props) {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const thisMonthItems = history.filter(h => {
    const d = parseDate(h.date);
    return d && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const workoutsThisMonth = thisMonthItems.length;
  const totalVolumeThisMonth = thisMonthItems.reduce((sum, h) => sum + h.totalVolume, 0);
  const avgVolume = workoutsThisMonth > 0 ? Math.round(totalVolumeThisMonth / workoutsThisMonth) : 0;

  const streak = calculateStreak(history);

  const last7Days = getLast7Days(history);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4">
        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Entrenamientos mes</p>
        <p className="text-2xl font-black text-emerald-400 mt-1">{workoutsThisMonth}</p>
        <p className="text-[9px] text-slate-500 mt-1">de 12 posibles</p>
        <div className="mt-2 h-1.5 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${Math.min(100, (workoutsThisMonth / 12) * 100)}%` }}
          />
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4">
        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Volumen total</p>
        <p className="text-2xl font-black text-cyan-400 mt-1">{(totalVolumeThisMonth / 1000).toFixed(1)}t</p>
        <p className="text-[9px] text-slate-500 mt-1">≈ {avgVolume} kg/sesión</p>
      </div>

      <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4">
        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Racha actual</p>
        <p className="text-2xl font-black text-amber-400 mt-1">{streak} 🔥</p>
        <p className="text-[9px] text-slate-500 mt-1">días consecutivos</p>
      </div>

      <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4">
        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Últimos 7 días</p>
        <div className="flex gap-1 mt-2 justify-between">
          {last7Days.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div className={`w-full h-6 rounded ${day.done ? 'bg-emerald-500' : 'bg-slate-900'}`} />
              <span className="text-[8px] text-slate-500">{day.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function parseDate(s: string): Date | null {
  const months: Record<string, number> = {
    ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
    jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
  };
  const m = s.match(/(\d+)\s+(\w+)\s+(\d+)/);
  if (!m) return null;
  return new Date(parseInt(m[3]), months[m[2].toLowerCase()] ?? 0, parseInt(m[1]));
}

function calculateStreak(history: HistoryItem[]): number {
  if (history.length === 0) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dates = new Set<string>();
  history.forEach(h => {
    const d = parseDate(h.date);
    if (d) {
      d.setHours(0, 0, 0, 0);
      dates.add(d.getTime().toString());
    }
  });
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (dates.has(d.getTime().toString())) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

function getLast7Days(history: HistoryItem[]): { label: string; done: boolean }[] {
  const result: { label: string; done: boolean }[] = [];
  const today = new Date();
  const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const dates = new Set<string>();
  history.forEach(h => {
    const d = parseDate(h.date);
    if (d) dates.add(d.getTime().toString());
  });
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    d.setHours(0, 0, 0, 0);
    result.push({
      label: days[d.getDay()],
      done: dates.has(d.getTime().toString()),
    });
  }
  return result;
}
