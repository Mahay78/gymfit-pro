interface Point {
  date: string;
  value: number;
}

interface Props {
  data: Point[];
  label: string;
  unit: string;
  color?: string;
  height?: number;
  showArea?: boolean;
}

export function LineChart({ data, label, unit, color = '#10b981', height = 160, showArea = true }: Props) {
  if (data.length < 2) {
    return (
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 text-center" style={{ height }}>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm text-slate-400 mt-2">Necesitas al menos 2 registros para ver la gráfica</p>
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const values = sorted.map(d => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;
  const padTop = 20;
  const padBottom = 30;
  const padLeft = 40;
  const padRight = 16;
  const W = 320;
  const H = height;
  const innerW = W - padLeft - padRight;
  const innerH = H - padTop - padBottom;

  const xFor = (i: number) => padLeft + (i / (sorted.length - 1)) * innerW;
  const yFor = (v: number) => padTop + (1 - (v - minVal) / range) * innerH;

  const pathD = sorted.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i).toFixed(1)} ${yFor(p.value).toFixed(1)}`).join(' ');
  const areaD = `${pathD} L ${xFor(sorted.length - 1).toFixed(1)} ${(H - padBottom).toFixed(1)} L ${padLeft} ${(H - padBottom).toFixed(1)} Z`;

  const yTicks = 4;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => minVal + (range * i) / yTicks);
  const trend = values[values.length - 1] - values[0];
  const trendColor = trend < 0 ? '#10b981' : trend > 0 ? '#f59e0b' : '#94a3b8';
  const trendText = trend < 0 ? `↓ ${Math.abs(trend).toFixed(1)}${unit}` : trend > 0 ? `↑ ${trend.toFixed(1)}${unit}` : 'Sin cambios';

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-3" style={{ height: H + 12 }}>
      <div className="flex justify-between items-center mb-1 px-1">
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{label}</p>
        <p className="text-[10px] font-bold" style={{ color: trendColor }}>{trendText}</p>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {yTickValues.map((v, i) => (
          <g key={i}>
            <line x1={padLeft} y1={yFor(v)} x2={W - padRight} y2={yFor(v)} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2 3" />
            <text x={padLeft - 4} y={yFor(v) + 3} fontSize="8" fill="#64748b" textAnchor="end">{Math.round(v * 10) / 10}</text>
          </g>
        ))}
        {showArea && <path d={areaD} fill={`url(#grad-${label})`} />}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {sorted.map((p, i) => (
          <g key={i}>
            <circle cx={xFor(i)} cy={yFor(p.value)} r="3" fill={color} />
            <circle cx={xFor(i)} cy={yFor(p.value)} r="6" fill={color} opacity="0.2" />
          </g>
        ))}
        {sorted.length <= 6 && sorted.map((p, i) => (
          <text key={i} x={xFor(i)} y={H - padBottom + 14} fontSize="7" fill="#64748b" textAnchor="middle">
            {p.date.split(' ')[0]}
          </text>
        ))}
        {sorted.length > 6 && [0, Math.floor(sorted.length / 2), sorted.length - 1].map((i, k) => (
          <text key={k} x={xFor(i)} y={H - padBottom + 14} fontSize="7" fill="#64748b" textAnchor="middle">
            {sorted[i].date.split(' ')[0]}
          </text>
        ))}
      </svg>
    </div>
  );
}
