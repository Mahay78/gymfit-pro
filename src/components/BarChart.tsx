interface BarItem {
  label: string;
  value: number;
}

interface Props {
  data: BarItem[];
  unit: string;
  color?: string;
  height?: number;
}

export function BarChart({ data, unit, color = '#10b981', height = 160 }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 text-center" style={{ height }}>
        <p className="text-sm text-slate-500">Sin datos aún</p>
      </div>
    );
  }

  const W = 320;
  const H = height;
  const padTop = 10;
  const padBottom = 24;
  const padLeft = 32;
  const padRight = 8;
  const innerW = W - padLeft - padRight;
  const innerH = H - padTop - padBottom;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const barW = Math.min(20, (innerW / data.length) * 0.7);
  const gap = innerW / data.length;

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-3" style={{ height: H + 12 }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
          const y = padTop + (1 - p) * innerH;
          const val = Math.round(maxVal * p);
          return (
            <g key={i}>
              <line x1={padLeft} y1={y} x2={W - padRight} y2={y} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2 3" />
              <text x={padLeft - 4} y={y + 3} fontSize="7" fill="#64748b" textAnchor="end">{val}</text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const h = (d.value / maxVal) * innerH;
          const x = padLeft + i * gap + (gap - barW) / 2;
          const y = padTop + innerH - h;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={h} fill={color} rx="2" opacity="0.85" />
              <rect x={x} y={y} width={barW} height="3" fill={color} rx="1" />
              <text x={x + barW / 2} y={H - padBottom + 14} fontSize="7" fill="#64748b" textAnchor="middle">{d.label}</text>
            </g>
          );
        })}
      </svg>
      <p className="text-[9px] text-slate-500 text-center mt-1">Unidad: {unit}</p>
    </div>
  );
}
