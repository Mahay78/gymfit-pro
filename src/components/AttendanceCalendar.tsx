import { useState } from 'react';
import type { HistoryItem } from '../types';

interface Props {
  history: HistoryItem[];
}

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function parseDate(s: string): Date | null {
  const monthMap: Record<string, number> = {
    ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
    jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
  };
  const m = s.match(/(\d+)\s+(\w+)\s+(\d+)/);
  if (!m) return null;
  return new Date(parseInt(m[3]), monthMap[m[2].toLowerCase()] ?? 0, parseInt(m[1]));
}

export function AttendanceCalendar({ history }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const trainedDates = new Set<string>();
  history.forEach(h => {
    const d = parseDate(h.date);
    if (d) trainedDates.add(d.toDateString());
  });

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const monthWorkouts = history.filter(h => {
    const d = parseDate(h.date);
    return d && d.getMonth() === viewMonth && d.getFullYear() === viewYear;
  }).length;

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };
  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };
  const goToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={goPrev} className="text-slate-400 hover:text-accent p-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button onClick={goToday} className="text-sm font-black text-slate-100">
          {months[viewMonth]} {viewYear}
        </button>
        <button onClick={goNext} className="text-slate-400 hover:text-accent p-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="text-center text-xs text-slate-400">
        {monthWorkouts} entrenamiento{monthWorkouts !== 1 ? 's' : ''} este mes
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(d => (
          <div key={d} className="text-center text-[9px] font-bold text-slate-500 uppercase py-1">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const cellDate = new Date(viewYear, viewMonth, day);
          const trained = trainedDates.has(cellDate.toDateString());
          const isToday = cellDate.toDateString() === today.toDateString();
          return (
            <div
              key={i}
              className={`aspect-square flex items-center justify-center text-[10px] rounded-lg font-bold transition-all ${
                trained
                  ? 'bg-accent text-slate-950 shadow-md shadow-accent/20'
                  : isToday
                    ? 'bg-slate-800 text-accent border border-accent/40'
                    : 'text-slate-500'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span>Entrenado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border border-accent/40 bg-slate-800" />
          <span>Hoy</span>
        </div>
      </div>
    </div>
  );
}
