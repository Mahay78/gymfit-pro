import { useState } from 'react';
import type { MachineType } from '../types';
import { MACHINE_IMAGE_URLS } from '../data/images';
import { useImageOverrides } from '../hooks/useImageOverrides';
import { ImageEditor } from './ImageEditor';

interface Props {
  type: MachineType;
  onShowNotification?: (msg: string) => void;
}

interface MachineInfo {
  name: string;
  primary: string;
  secondary: string;
  movement: string;
}

const MACHINE_INFO: Record<MachineType, MachineInfo> = {
  legpress:       { name: 'PRENSA DE PIERNAS',     primary: 'Cuádriceps',   secondary: 'Glúteos',       movement: 'Empuje' },
  pulldown:       { name: 'JALÓN AL PECHO',        primary: 'Dorsal',       secondary: 'Bíceps',        movement: 'Tirón abajo' },
  chestpress:     { name: 'PRESS DE PECHO',        primary: 'Pectoral',     secondary: 'Tríceps',       movement: 'Empuje' },
  legextension:   { name: 'EXTENSIÓN CUÁDRICEPS',  primary: 'Cuádriceps',   secondary: '—',             movement: 'Extensión' },
  lateralraise:   { name: 'ELEVACIONES LATERALES', primary: 'Deltoides',    secondary: 'Trapecio',      movement: 'Elevación' },
  crunch:         { name: 'CRUNCH EN MÁQUINA',     primary: 'Abdomen',      secondary: 'Oblicuos',      movement: 'Flexión' },
  legcurl:        { name: 'CURL FEMORAL',          primary: 'Isquiotibiales', secondary: 'Gemelos',     movement: 'Flexión' },
  seatedrow:      { name: 'REMO SENTADO',          primary: 'Dorsal',       secondary: 'Romboides',     movement: 'Tirón' },
  pecdeck:        { name: 'CONTRACTORA / PEC DECK', primary: 'Pectoral',    secondary: 'Deltoides',     movement: 'Cierre' },
  hyperextension: { name: 'HIPEREXTENSIONES',      primary: 'Lumbares',     secondary: 'Glúteos',       movement: 'Extensión' },
  bicepcurl:      { name: 'CURL DE BÍCEPS',        primary: 'Bíceps',       secondary: 'Antebrazo',     movement: 'Flexión' },
  calfraise:      { name: 'ELEVACIÓN GEMELOS',     primary: 'Gemelos',      secondary: 'Sóleo',         movement: 'Elevación' },
  hacksquat:      { name: 'HACK SQUAT',            primary: 'Cuádriceps',   secondary: 'Glúteos',       movement: 'Empuje' },
  shoulderpress:  { name: 'PRESS DE HOMBRO',       primary: 'Deltoides',    secondary: 'Tríceps',       movement: 'Empuje arriba' },
  tricepspushdown:{ name: 'EXTENSIÓN TRÍCEPS',     primary: 'Tríceps',      secondary: '—',             movement: 'Empuje abajo' },
  captainschair:  { name: 'SILLA ROMANA',          primary: 'Abdomen',      secondary: 'Iliopsoas',     movement: 'Elevación' },
  plank:          { name: 'PLANCHA ABDOMINAL',     primary: 'Core',         secondary: 'Oblicuos',      movement: 'Isométrico' },
};

const W = 320, H = 260;

function Frame({ title, primary, secondary, movement, children }: MachineInfo & { children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <defs>
        <pattern id={`grid-${title}`} width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M 14 0 L 0 0 0 14" fill="none" stroke="#0f172a" strokeWidth="1" />
        </pattern>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
          <polygon points="0 0, 9 5, 0 10" fill="#fbbf24" />
        </marker>
        <marker id="arrow-cyan" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
          <polygon points="0 0, 9 5, 0 10" fill="#22d3ee" />
        </marker>
      </defs>

      <rect width={W} height={H} fill="#020617" rx="10" />
      <rect width={W} height={H} fill={`url(#grid-${title})`} rx="10" />

      <rect x="0" y="0" width={W} height="26" fill="#0f172a" rx="10" />
      <rect x="0" y="16" width={W} height="10" fill="#0f172a" />
      <circle cx="14" cy="13" r="4" fill="#10b981" filter="url(#glow)" />
      <text x="24" y="17" fontSize="9" fontWeight="bold" fill="#10b981" letterSpacing="1">{title}</text>

      <g>{children}</g>

      {primary !== '—' && (
        <g>
          <rect x="10" y={H - 50} width="105" height="18" rx="9" fill="#022c22" stroke="#10b981" strokeWidth="1" />
          <circle cx="22" cy={H - 41} r="4" fill="#10b981" filter="url(#glow)" />
          <text x="32" y={H - 38} fontSize="8" fontWeight="bold" fill="#10b981">{primary}</text>
        </g>
      )}

      {secondary !== '—' && (
        <g>
          <rect x="120" y={H - 50} width="105" height="18" rx="9" fill="#0c1929" stroke="#475569" strokeWidth="1" />
          <circle cx="132" cy={H - 41} r="4" fill="#475569" />
          <text x="142" y={H - 38} fontSize="8" fontWeight="bold" fill="#94a3b8">{secondary}</text>
        </g>
      )}

      {movement !== '—' && (
        <g>
          <rect x={W - 95} y={H - 50} width="85" height="18" rx="9" fill="#1c1407" stroke="#fbbf24" strokeWidth="1" />
          <path d={`M ${W - 82} ${H - 38} l 8 -3 l 0 6 z`} fill="#fbbf24" />
          <text x={W - 70} y={H - 38} fontSize="8" fontWeight="bold" fill="#fbbf24">{movement}</text>
        </g>
      )}

      <text x={W - 8} y={H - 8} fontSize="6" fill="#475569" textAnchor="end">GymFit Pro</text>
    </svg>
  );
}

function Muscle({ cx, cy, rx = 18, ry = 10, fill = '#10b981', opacity = 0.5 }: { cx: number; cy: number; rx?: number; ry?: number; fill?: string; opacity?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} opacity={opacity} filter="url(#glow)" />;
}

function Arrow({ d }: { d: string }) {
  return <path d={d} fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#arrow)" />;
}

export function MachineDiagram({ type, onShowNotification }: Props) {
  const [useSvg, setUseSvg] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const info = MACHINE_INFO[type];
  const defaultImgUrl = MACHINE_IMAGE_URLS[type];
  const { getImage, setImage, resetImage } = useImageOverrides();
  const currentImage = getImage(type, defaultImgUrl);
  const hasOverride = currentImage !== defaultImgUrl;
  const notify = onShowNotification || (() => {});

  if (!useSvg) {
    return (
      <>
        <div className="relative w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl animate-fadeIn">
          <div className="px-3 pt-2 pb-1 flex items-center justify-between gap-2">
            <p className="text-[9px] text-emerald-400 uppercase tracking-widest font-black">Foto real</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEditor(true)}
                className="text-[9px] text-cyan-400 hover:text-cyan-300 uppercase font-bold tracking-wider active:scale-95"
                title="Cambiar imagen"
              >
                ✏️ Editar
              </button>
              <button
                type="button"
                onClick={() => setUseSvg(true)}
                className="text-[9px] text-slate-400 hover:text-emerald-400 uppercase font-bold tracking-wider active:scale-95"
              >
                Diagrama →
              </button>
            </div>
          </div>
          <img
            src={currentImage}
            alt={info.name}
            loading="lazy"
            className="w-full h-56 object-cover rounded-b-2xl"
            onError={() => setUseSvg(true)}
          />
          {hasOverride && (
            <div className="absolute top-2 right-2 bg-cyan-500/90 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
              Personalizada
            </div>
          )}
        </div>
        {showEditor && (
          <ImageEditor
            machineType={type}
            currentImage={currentImage}
            defaultImage={defaultImgUrl}
            hasOverride={hasOverride}
            onSave={(url) => setImage(type, url)}
            onReset={() => resetImage(type)}
            onClose={() => setShowEditor(false)}
            onShowNotification={notify}
          />
        )}
      </>
    );
  }

  switch (type) {
    case 'legpress':
    case 'hacksquat':
      return <LegPressSquat info={info} isHack={type === 'hacksquat'} />;
    case 'pulldown':
      return <Pulldown info={info} />;
    case 'chestpress':
      return <ChestPress info={info} />;
    case 'legextension':
      return <LegExtension info={info} />;
    case 'lateralraise':
      return <LateralRaise info={info} />;
    case 'crunch':
      return <Crunch info={info} />;
    case 'legcurl':
      return <LegCurl info={info} />;
    case 'seatedrow':
      return <SeatedRow info={info} />;
    case 'pecdeck':
      return <PecDeck info={info} />;
    case 'hyperextension':
      return <Hyperextension info={info} />;
    case 'bicepcurl':
      return <BicepCurl info={info} />;
    case 'calfraise':
      return <CalfRaise info={info} />;
    case 'shoulderpress':
      return <ShoulderPress info={info} />;
    case 'tricepspushdown':
      return <TricepsPushdown info={info} />;
    case 'captainschair':
      return <CaptainsChair info={info} />;
    case 'plank':
      return <Plank info={info} />;
    default:
      return <Frame {...info}><text x={W/2} y={H/2} fill="#94a3b8" textAnchor="middle">Diagrama no disponible</text></Frame>;
  }
}

function LegPressSquat({ info, isHack }: { info: MachineInfo; isHack: boolean }) {
  return (
    <Frame {...info}>
      {/* Pista/sled rails */}
      <path d="M 40 100 L 280 180" stroke="#334155" strokeWidth="3" />
      <path d="M 40 110 L 280 190" stroke="#334155" strokeWidth="2" />

      {/* Asiento inclinado */}
      <path d="M 50 100 L 130 50 L 130 60 L 50 110 Z" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
      <rect x="50" y="98" width="80" height="14" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />

      {/* Plataforma de pies */}
      <line x1="180" y1="135" x2="260" y2="175" stroke="#f8fafc" strokeWidth="5" strokeLinecap="round" />

      {/* Peso/Stack con glow */}
      <g>
        <circle cx="240" cy="100" r="14" fill="#020617" stroke="#10b981" strokeWidth="3" filter="url(#glow)" />
        <circle cx="240" cy="100" r="6" fill="#10b981" />
        <circle cx="240" cy="80" r="10" fill="#020617" stroke="#10b981" strokeWidth="2" />
      </g>

      {/* Cuerpo (stick figure) */}
      <g stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Cabeza */}
        <circle cx="62" cy="78" r="8" fill="#020617" />
        {/* Torso inclinado */}
        <line x1="62" y1="86" x2="115" y2="105" />
        {/* Cadera */}
        <circle cx="118" cy="107" r="3" fill="#22d3ee" />
        {/* Pierna superior (muslo) */}
        <line x1="118" y1="107" x2="180" y2="135" />
        {/* Pierna inferior (pantorrilla) */}
        <line x1="180" y1="135" x2="220" y2="158" />
        {/* Pie */}
        <line x1="220" y1="158" x2="240" y2="168" strokeWidth="3.5" />
      </g>

      {/* Músculo: cuádriceps (muslo) */}
      <g>
        <ellipse cx="148" cy="120" rx="22" ry="8" fill="#10b981" opacity="0.5" filter="url(#glow)" transform="rotate(30 148 120)" />
        <ellipse cx="148" cy="120" rx="18" ry="5" fill="#10b981" opacity="0.4" transform="rotate(30 148 120)" />
      </g>

      {/* Músculo: glúteo (cadera) */}
      <circle cx="115" cy="105" r="9" fill="#34d399" opacity="0.5" filter="url(#glow)" />

      {/* Flecha de empuje */}
      <Arrow d="M 250 130 Q 285 145 280 175" />
    </Frame>
  );
}

function Pulldown({ info }: { info: MachineInfo }) {
  return (
    <Frame {...info}>
      {/* Estructura vertical */}
      <path d="M 60 50 L 60 200" stroke="#475569" strokeWidth="4" />
      <path d="M 260 50 L 260 200" stroke="#475569" strokeWidth="4" />
      <path d="M 60 50 L 260 50" stroke="#475569" strokeWidth="3" />

      {/* Peso/Stack */}
      <g>
        <rect x="80" y="70" width="22" height="80" fill="#020617" stroke="#10b981" strokeWidth="2" filter="url(#glow)" />
        <rect x="84" y="78" width="14" height="6" fill="#10b981" />
        <rect x="84" y="90" width="14" height="6" fill="#10b981" />
        <rect x="84" y="102" width="14" height="6" fill="#10b981" />
      </g>

      {/* Cable */}
      <line x1="160" y1="55" x2="160" y2="100" stroke="#64748b" strokeWidth="1.5" strokeDasharray="2 2" />

      {/* Barra */}
      <g stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round">
        <line x1="120" y1="100" x2="200" y2="100" />
        <line x1="120" y1="100" x2="115" y2="108" />
        <line x1="200" y1="100" x2="205" y2="108" />
      </g>

      {/* Asiento con almohadilla */}
      <rect x="135" y="160" width="50" height="14" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      {/* Pierna anclaje */}
      <rect x="155" y="174" width="10" height="20" fill="#475569" />

      {/* Cuerpo */}
      <g stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="160" cy="135" r="8" fill="#020617" />
        <line x1="160" y1="143" x2="160" y2="160" />
        {/* Brazos extendidos arriba */}
        <line x1="160" y1="148" x2="120" y2="100" />
        <line x1="160" y1="148" x2="200" y2="100" />
      </g>

      {/* Músculo: Dorsal (espalda) */}
      <g>
        <path d="M 150 148 Q 145 158 152 165 L 168 165 Q 175 158 170 148 Z" fill="#10b981" opacity="0.5" filter="url(#glow)" />
        <ellipse cx="160" cy="155" rx="10" ry="8" fill="#10b981" opacity="0.4" />
      </g>

      {/* Músculo: Bíceps */}
      <ellipse cx="138" cy="120" rx="4" ry="8" fill="#34d399" opacity="0.5" filter="url(#glow)" transform="rotate(-50 138 120)" />
      <ellipse cx="182" cy="120" rx="4" ry="8" fill="#34d399" opacity="0.5" filter="url(#glow)" transform="rotate(50 182 120)" />

      {/* Flecha: tirar hacia abajo */}
      <Arrow d="M 220 75 L 220 110" />
    </Frame>
  );
}

function ChestPress({ info }: { info: MachineInfo }) {
  return (
    <Frame {...info}>
      {/* Asiento */}
      <rect x="50" y="100" width="60" height="60" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      {/* Respaldo */}
      <rect x="50" y="100" width="60" height="50" rx="3" fill="#334155" stroke="#475569" strokeWidth="1.5" />

      {/* Peso/Stack */}
      <g>
        <rect x="20" y="60" width="20" height="100" fill="#020617" stroke="#10b981" strokeWidth="2" filter="url(#glow)" />
        <rect x="24" y="70" width="12" height="5" fill="#10b981" />
        <rect x="24" y="82" width="12" height="5" fill="#10b981" />
        <rect x="24" y="94" width="12" height="5" fill="#10b981" />
      </g>

      {/* Brazos de la máquina */}
      <path d="M 110 130 L 180 100" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
      <path d="M 110 145 L 180 125" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
      {/* Agarraderas */}
      <circle cx="180" cy="100" r="5" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
      <circle cx="180" cy="125" r="5" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />

      {/* Cuerpo */}
      <g stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="65" cy="85" r="7" fill="#020617" />
        <line x1="65" y1="92" x2="80" y2="125" />
        {/* Brazos extendidos al frente */}
        <line x1="78" y1="115" x2="180" y2="100" />
        <line x1="80" y1="120" x2="180" y2="125" />
      </g>

      {/* Músculo: Pectoral */}
      <g>
        <path d="M 58 100 Q 65 95 78 100 L 80 115 Q 70 118 60 115 Z" fill="#10b981" opacity="0.5" filter="url(#glow)" />
        <ellipse cx="68" cy="108" rx="9" ry="6" fill="#10b981" opacity="0.4" />
      </g>

      {/* Músculo: Tríceps */}
      <ellipse cx="125" cy="108" rx="6" ry="4" fill="#34d399" opacity="0.5" filter="url(#glow)" transform="rotate(-15 125 108)" />
      <ellipse cx="125" cy="123" rx="6" ry="4" fill="#34d399" opacity="0.5" filter="url(#glow)" transform="rotate(-15 125 123)" />

      {/* Flecha: empuje al frente */}
      <Arrow d="M 200 80 L 250 75" />
      <Arrow d="M 200 110 L 250 115" />
    </Frame>
  );
}

function LegExtension({ info }: { info: MachineInfo }) {
  return (
    <Frame {...info}>
      {/* Asiento */}
      <rect x="80" y="100" width="50" height="60" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      <rect x="80" y="100" width="50" height="50" rx="3" fill="#334155" />

      {/* Eje de rotación */}
      <circle cx="130" cy="130" r="6" fill="#10b981" filter="url(#glow)" stroke="#10b981" strokeWidth="2" />

      {/* Brazo de la máquina */}
      <path d="M 130 130 L 220 100" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
      <rect x="195" y="95" width="35" height="14" rx="3" fill="#475569" />

      {/* Peso/Stack */}
      <g>
        <rect x="240" y="50" width="18" height="100" fill="#020617" stroke="#10b981" strokeWidth="2" filter="url(#glow)" />
        <rect x="244" y="60" width="10" height="5" fill="#10b981" />
        <rect x="244" y="72" width="10" height="5" fill="#10b981" />
        <rect x="244" y="84" width="10" height="5" fill="#10b981" />
      </g>

      {/* Cuerpo */}
      <g stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="100" cy="78" r="7" fill="#020617" />
        <line x1="100" y1="85" x2="105" y2="125" />
        {/* Muslo horizontal */}
        <line x1="105" y1="125" x2="130" y2="130" />
        {/* Pierna inferior (extendida) */}
        <line x1="130" y1="130" x2="200" y2="100" />
        {/* Tobillo */}
        <circle cx="200" cy="100" r="2.5" fill="#22d3ee" />
      </g>

      {/* Músculo: cuádriceps */}
      <g>
        <path d="M 110 128 Q 120 122 128 128" stroke="#10b981" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.6" filter="url(#glow)" />
        <ellipse cx="118" cy="125" rx="11" ry="5" fill="#10b981" opacity="0.4" />
      </g>

      {/* Flecha: extensión */}
      <Arrow d="M 145 95 Q 180 80 215 75" />
    </Frame>
  );
}

function LateralRaise({ info }: { info: MachineInfo }) {
  return (
    <Frame {...info}>
      {/* Asiento central */}
      <rect x="130" y="110" width="60" height="55" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      {/* Respaldo */}
      <rect x="140" y="100" width="40" height="50" rx="3" fill="#334155" />

      {/* Almohadillas de brazos (en posición elevada) */}
      <rect x="70" y="105" width="35" height="14" rx="5" fill="#475569" stroke="#64748b" strokeWidth="1.5" transform="rotate(-15 87 112)" />
      <rect x="215" y="105" width="35" height="14" rx="5" fill="#475569" stroke="#64748b" strokeWidth="1.5" transform="rotate(15 232 112)" />

      {/* Cuerpo */}
      <g stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="160" cy="80" r="7" fill="#020617" />
        <line x1="160" y1="87" x2="160" y2="135" />
        {/* Brazos horizontales */}
        <line x1="160" y1="100" x2="100" y2="115" />
        <line x1="160" y1="100" x2="220" y2="115" />
      </g>

      {/* Músculo: Deltoides (ambos hombros) */}
      <g>
        <ellipse cx="148" cy="90" rx="9" ry="6" fill="#10b981" opacity="0.5" filter="url(#glow)" />
        <ellipse cx="172" cy="90" rx="9" ry="6" fill="#10b981" opacity="0.5" filter="url(#glow)" />
      </g>

      {/* Flechas hacia arriba */}
      <Arrow d="M 87 130 L 87 100" />
      <Arrow d="M 232 130 L 232 100" />
    </Frame>
  );
}

function Crunch({ info }: { info: MachineInfo }) {
  return (
    <Frame {...info}>
      {/* Asiento */}
      <rect x="130" y="120" width="60" height="40" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      {/* Respaldo */}
      <rect x="140" y="100" width="40" height="40" rx="3" fill="#334155" />

      {/* Almohadilla de pecho */}
      <rect x="130" y="80" width="80" height="14" rx="5" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
      {/* Soporte vertical */}
      <path d="M 145 94 L 145 100" stroke="#475569" strokeWidth="3" />

      {/* Peso/Stack */}
      <g>
        <rect x="220" y="80" width="18" height="70" fill="#020617" stroke="#10b981" strokeWidth="2" filter="url(#glow)" />
        <rect x="224" y="90" width="10" height="5" fill="#10b981" />
        <rect x="224" y="102" width="10" height="5" fill="#10b981" />
        <rect x="224" y="114" width="10" height="5" fill="#10b981" />
      </g>

      {/* Cuerpo */}
      <g stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="170" cy="55" r="7" fill="#020617" />
        {/* Torso inclinado (flexión) */}
        <line x1="170" y1="62" x2="160" y2="105" />
        {/* Piernas sentadas */}
        <line x1="160" y1="105" x2="220" y2="145" />
        <line x1="220" y1="145" x2="240" y2="160" />
      </g>

      {/* Músculo: Abdomen */}
      <g>
        <ellipse cx="165" cy="88" rx="12" ry="16" fill="#10b981" opacity="0.5" filter="url(#glow)" />
        <ellipse cx="165" cy="88" rx="8" ry="12" fill="#10b981" opacity="0.4" />
        <line x1="165" y1="78" x2="165" y2="98" stroke="#022c22" strokeWidth="1.5" />
        <line x1="157" y1="82" x2="173" y2="82" stroke="#022c22" strokeWidth="1.2" />
        <line x1="157" y1="88" x2="173" y2="88" stroke="#022c22" strokeWidth="1.2" />
        <line x1="157" y1="94" x2="173" y2="94" stroke="#022c22" strokeWidth="1.2" />
      </g>

      {/* Flecha de flexión */}
      <Arrow d="M 195 50 Q 215 45 230 60" />
    </Frame>
  );
}

function LegCurl({ info }: { info: MachineInfo }) {
  return (
    <Frame {...info}>
      {/* Banco horizontal */}
      <rect x="40" y="120" width="160" height="20" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      {/* Almohadilla superior (rodillo) */}
      <circle cx="180" cy="100" r="14" fill="#475569" stroke="#64748b" strokeWidth="2" />
      {/* Brazo con rodillo */}
      <path d="M 175 115 L 180 100" stroke="#475569" strokeWidth="3" />
      {/* Eje */}
      <circle cx="100" cy="130" r="6" fill="#10b981" filter="url(#glow)" stroke="#10b981" strokeWidth="2" />
      <path d="M 100 130 L 180 100" stroke="#475569" strokeWidth="3" />

      {/* Peso/Stack */}
      <g>
        <rect x="220" y="60" width="18" height="80" fill="#020617" stroke="#10b981" strokeWidth="2" filter="url(#glow)" />
        <rect x="224" y="70" width="10" height="5" fill="#10b981" />
        <rect x="224" y="82" width="10" height="5" fill="#10b981" />
        <rect x="224" y="94" width="10" height="5" fill="#10b981" />
      </g>

      {/* Cuerpo tumbado boca abajo */}
      <g stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="55" cy="113" r="6" fill="#020617" />
        <line x1="55" y1="119" x2="100" y2="130" />
        {/* Muslo */}
        <line x1="100" y1="130" x2="160" y2="115" />
        {/* Pierna inferior (curvada) */}
        <path d="M 160 115 Q 175 100 180 95" />
      </g>

      {/* Músculo: isquiotibiales (parte posterior del muslo) */}
      <g>
        <path d="M 110 132 Q 130 122 150 118" stroke="#10b981" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.6" filter="url(#glow)" />
        <ellipse cx="130" cy="125" rx="20" ry="5" fill="#10b981" opacity="0.4" />
      </g>

      {/* Flecha de flexión */}
      <Arrow d="M 195 85 Q 200 100 195 120" />
    </Frame>
  );
}

function SeatedRow({ info }: { info: MachineInfo }) {
  return (
    <Frame {...info}>
      {/* Asiento */}
      <rect x="130" y="120" width="60" height="50" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      {/* Almohadilla de pecho */}
      <rect x="140" y="95" width="40" height="35" rx="3" fill="#334155" stroke="#475569" strokeWidth="1.5" />

      {/* Peso/Stack */}
      <g>
        <rect x="50" y="70" width="18" height="80" fill="#020617" stroke="#10b981" strokeWidth="2" filter="url(#glow)" />
        <rect x="54" y="80" width="10" height="5" fill="#10b981" />
        <rect x="54" y="92" width="10" height="5" fill="#10b981" />
        <rect x="54" y="104" width="10" height="5" fill="#10b981" />
      </g>

      {/* Cable horizontal */}
      <line x1="80" y1="115" x2="125" y2="115" stroke="#64748b" strokeWidth="1.5" strokeDasharray="2 2" />
      {/* Agarraderas */}
      <rect x="115" y="108" width="14" height="14" rx="2" fill="#475569" stroke="#cbd5e1" strokeWidth="2" />

      {/* Cuerpo */}
      <g stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="160" cy="78" r="7" fill="#020617" />
        <line x1="160" y1="85" x2="160" y2="120" />
        {/* Brazos extendidos al frente */}
        <line x1="160" y1="100" x2="130" y2="115" />
        <line x1="160" y1="100" x2="130" y2="125" />
      </g>

      {/* Músculo: Dorsal */}
      <g>
        <path d="M 150 90 Q 145 105 155 120 L 175 120 Q 180 105 170 90 Z" fill="#10b981" opacity="0.5" filter="url(#glow)" />
        <ellipse cx="160" cy="105" rx="11" ry="10" fill="#10b981" opacity="0.4" />
      </g>

      {/* Flecha: tirón */}
      <Arrow d="M 70 110 L 110 113" />
    </Frame>
  );
}

function PecDeck({ info }: { info: MachineInfo }) {
  return (
    <Frame {...info}>
      {/* Asiento central */}
      <rect x="135" y="115" width="50" height="50" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      {/* Respaldo */}
      <rect x="145" y="90" width="30" height="50" rx="3" fill="#334155" />

      {/* Brazos de la máquina con almohadillas */}
      <path d="M 160 130 L 80 110" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
      <path d="M 160 130 L 240 110" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="80" cy="110" rx="14" ry="8" fill="#475569" stroke="#cbd5e1" strokeWidth="1.5" transform="rotate(-20 80 110)" />
      <ellipse cx="240" cy="110" rx="14" ry="8" fill="#475569" stroke="#cbd5e1" strokeWidth="1.5" transform="rotate(20 240 110)" />

      {/* Peso/Stack */}
      <g>
        <rect x="140" y="35" width="40" height="20" fill="#020617" stroke="#10b981" strokeWidth="2" filter="url(#glow)" />
      </g>

      {/* Cuerpo (vista frontal) */}
      <g stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="160" cy="80" r="7" fill="#020617" />
        <line x1="160" y1="87" x2="160" y2="140" />
        {/* Brazos abiertos */}
        <line x1="160" y1="100" x2="80" y2="110" />
        <line x1="160" y1="100" x2="240" y2="110" />
      </g>

      {/* Músculo: Pectoral (pecho, ambos lados) */}
      <g>
        <ellipse cx="148" cy="100" rx="9" ry="7" fill="#10b981" opacity="0.5" filter="url(#glow)" />
        <ellipse cx="172" cy="100" rx="9" ry="7" fill="#10b981" opacity="0.5" filter="url(#glow)" />
        <line x1="160" y1="93" x2="160" y2="107" stroke="#022c22" strokeWidth="1.5" />
      </g>

      {/* Flechas convergentes (cierre) */}
      <Arrow d="M 60 130 L 90 130" />
      <Arrow d="M 260 130 L 230 130" />
    </Frame>
  );
}

function Hyperextension({ info }: { info: MachineInfo }) {
  return (
    <Frame {...info}>
      {/* Banco inclinado */}
      <path d="M 40 180 L 200 110 L 200 125 L 40 195 Z" fill="#334155" stroke="#475569" strokeWidth="1.5" />
      {/* Almohadilla para tobillos */}
      <rect x="50" y="160" width="30" height="14" rx="3" fill="#475569" />

      {/* Cuerpo (inclinado hacia abajo) */}
      <g stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="200" cy="50" r="7" fill="#020617" />
        {/* Torso recto */}
        <line x1="200" y1="57" x2="160" y2="110" />
        {/* Piernas */}
        <line x1="160" y1="110" x2="80" y2="160" />
        <line x1="80" y1="160" x2="55" y2="170" />
      </g>

      {/* Músculo: Lumbares/Glúteos */}
      <g>
        <ellipse cx="180" cy="85" rx="11" ry="8" fill="#10b981" opacity="0.5" filter="url(#glow)" transform="rotate(-35 180 85)" />
        <circle cx="160" cy="110" r="10" fill="#34d399" opacity="0.5" filter="url(#glow)" />
      </g>

      {/* Flecha de extensión (hacia arriba) */}
      <Arrow d="M 220 50 Q 250 40 270 55" />
    </Frame>
  );
}

function BicepCurl({ info }: { info: MachineInfo }) {
  return (
    <Frame {...info}>
      {/* Banco predicador */}
      <path d="M 60 180 L 180 100 L 180 115 L 60 195 Z" fill="#334155" stroke="#475569" strokeWidth="1.5" />
      {/* Cojín */}
      <ellipse cx="120" cy="135" rx="30" ry="10" fill="#475569" stroke="#cbd5e1" strokeWidth="1.5" transform="rotate(-30 120 135)" />

      {/* Peso/Stack */}
      <g>
        <rect x="220" y="60" width="18" height="80" fill="#020617" stroke="#10b981" strokeWidth="2" filter="url(#glow)" />
        <rect x="224" y="70" width="10" height="5" fill="#10b981" />
        <rect x="224" y="82" width="10" height="5" fill="#10b981" />
        <rect x="224" y="94" width="10" height="5" fill="#10b981" />
      </g>

      {/* Brazo con curl */}
      <g stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Antebrazo en curl */}
        <path d="M 125 130 Q 145 110 165 105" />
        {/* Mano */}
        <circle cx="170" cy="103" r="4" fill="#22d3ee" />
        {/* Agarradera */}
        <rect x="170" y="100" width="20" height="6" rx="2" fill="#475569" stroke="#cbd5e1" strokeWidth="1.5" />
      </g>

      {/* Músculo: Bíceps */}
      <g>
        <ellipse cx="145" cy="118" rx="11" ry="7" fill="#10b981" opacity="0.5" filter="url(#glow)" transform="rotate(-35 145 118)" />
        <ellipse cx="148" cy="116" rx="7" ry="4" fill="#10b981" opacity="0.4" />
      </g>

      {/* Flecha de flexión */}
      <Arrow d="M 195 95 Q 210 100 220 115" />
    </Frame>
  );
}

function CalfRaise({ info }: { info: MachineInfo }) {
  return (
    <Frame {...info}>
      {/* Estructura vertical */}
      <path d="M 100 50 L 100 200" stroke="#475569" strokeWidth="3" />
      <path d="M 220 50 L 220 200" stroke="#475569" strokeWidth="3" />
      <path d="M 100 50 L 220 50" stroke="#475569" strokeWidth="3" />

      {/* Almohadillas de hombros */}
      <rect x="110" y="100" width="100" height="14" rx="5" fill="#475569" stroke="#64748b" strokeWidth="1.5" />

      {/* Plataforma para pies */}
      <path d="M 80 175 L 240 175 L 240 185 L 80 185 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />

      {/* Peso/Stack */}
      <g>
        <rect x="260" y="60" width="16" height="100" fill="#020617" stroke="#10b981" strokeWidth="2" filter="url(#glow)" />
        <rect x="263" y="70" width="10" height="4" fill="#10b981" />
        <rect x="263" y="80" width="10" height="4" fill="#10b981" />
        <rect x="263" y="90" width="10" height="4" fill="#10b981" />
      </g>

      {/* Cuerpo de pie */}
      <g stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="160" cy="80" r="7" fill="#020617" />
        {/* Piernas rectas */}
        <line x1="160" y1="87" x2="160" y2="170" />
        <line x1="155" y1="170" x2="155" y2="180" />
        <line x1="165" y1="170" x2="165" y2="180" />
      </g>

      {/* Músculo: Gemelos (pantorrilla) */}
      <g>
        <ellipse cx="158" cy="140" rx="10" ry="14" fill="#10b981" opacity="0.5" filter="url(#glow)" />
        <ellipse cx="158" cy="140" rx="7" ry="11" fill="#10b981" opacity="0.4" />
        <line x1="158" y1="128" x2="158" y2="152" stroke="#022c22" strokeWidth="1" />
      </g>

      {/* Flecha de elevación (hombro hacia arriba = cuerpo sube) */}
      <Arrow d="M 70 90 L 70 60" />
    </Frame>
  );
}

function ShoulderPress({ info }: { info: MachineInfo }) {
  return (
    <Frame {...info}>
      {/* Asiento */}
      <rect x="130" y="120" width="60" height="50" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      {/* Respaldo */}
      <rect x="140" y="100" width="40" height="50" rx="3" fill="#334155" />

      {/* Brazos de la máquina (empuñaduras a la altura de hombros) */}
      <path d="M 160 130 L 220 100" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
      <path d="M 160 130 L 100 100" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
      <circle cx="100" cy="100" r="5" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
      <circle cx="220" cy="100" r="5" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />

      {/* Peso/Stack */}
      <g>
        <rect x="240" y="60" width="18" height="80" fill="#020617" stroke="#10b981" strokeWidth="2" filter="url(#glow)" />
        <rect x="244" y="70" width="10" height="5" fill="#10b981" />
        <rect x="244" y="82" width="10" height="5" fill="#10b981" />
        <rect x="244" y="94" width="10" height="5" fill="#10b981" />
      </g>

      {/* Cuerpo */}
      <g stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="160" cy="80" r="7" fill="#020617" />
        <line x1="160" y1="87" x2="160" y2="125" />
        {/* Brazos a 90° */}
        <line x1="160" y1="100" x2="100" y2="100" />
        <line x1="160" y1="100" x2="220" y2="100" />
      </g>

      {/* Músculo: Deltoides */}
      <g>
        <ellipse cx="148" cy="92" rx="9" ry="7" fill="#10b981" opacity="0.5" filter="url(#glow)" />
        <ellipse cx="172" cy="92" rx="9" ry="7" fill="#10b981" opacity="0.5" filter="url(#glow)" />
      </g>

      {/* Músculo: Tríceps */}
      <ellipse cx="120" cy="100" rx="6" ry="3" fill="#34d399" opacity="0.5" filter="url(#glow)" />
      <ellipse cx="200" cy="100" rx="6" ry="3" fill="#34d399" opacity="0.5" filter="url(#glow)" />

      {/* Flechas hacia arriba */}
      <Arrow d="M 100 75 L 100 50" />
      <Arrow d="M 220 75 L 220 50" />
    </Frame>
  );
}

function TricepsPushdown({ info }: { info: MachineInfo }) {
  return (
    <Frame {...info}>
      {/* Estructura vertical */}
      <path d="M 80 50 L 80 200" stroke="#475569" strokeWidth="3" />
      <path d="M 80 50 L 160 50" stroke="#475569" strokeWidth="2" />

      {/* Polea */}
      <circle cx="160" cy="55" r="8" fill="#020617" stroke="#10b981" strokeWidth="2" filter="url(#glow)" />
      {/* Cable */}
      <line x1="160" y1="63" x2="160" y2="110" stroke="#64748b" strokeWidth="1.5" strokeDasharray="2 2" />
      {/* Cuerda/barra */}
      <rect x="148" y="108" width="24" height="8" rx="2" fill="#475569" stroke="#cbd5e1" strokeWidth="1.5" />

      {/* Peso/Stack */}
      <g>
        <rect x="195" y="60" width="18" height="100" fill="#020617" stroke="#10b981" strokeWidth="2" filter="url(#glow)" />
        <rect x="199" y="70" width="10" height="5" fill="#10b981" />
        <rect x="199" y="82" width="10" height="5" fill="#10b981" />
        <rect x="199" y="94" width="10" height="5" fill="#10b981" />
      </g>

      {/* Cuerpo (de pie) */}
      <g stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="100" cy="80" r="7" fill="#020617" />
        <line x1="100" y1="87" x2="100" y2="170" />
        {/* Brazos flexionados a 90° */}
        <line x1="100" y1="100" x2="160" y2="100" />
        <line x1="160" y1="100" x2="160" y2="113" />
      </g>

      {/* Músculo: Tríceps (parte posterior del brazo) */}
      <g>
        <ellipse cx="135" cy="103" rx="15" ry="6" fill="#10b981" opacity="0.5" filter="url(#glow)" />
        <ellipse cx="135" cy="103" rx="11" ry="4" fill="#10b981" opacity="0.4" />
      </g>

      {/* Flecha hacia abajo (empuje) */}
      <Arrow d="M 175 120 L 175 160" />
    </Frame>
  );
}

function CaptainsChair({ info }: { info: MachineInfo }) {
  return (
    <Frame {...info}>
      {/* Estructura */}
      <path d="M 80 50 L 80 200" stroke="#475569" strokeWidth="3" />
      <path d="M 200 50 L 200 200" stroke="#475569" strokeWidth="3" />
      <path d="M 80 50 L 200 50" stroke="#475569" strokeWidth="3" />

      {/* Reposabrazos */}
      <rect x="90" y="80" width="100" height="14" rx="3" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
      {/* Respaldo */}
      <rect x="125" y="95" width="30" height="80" rx="3" fill="#334155" stroke="#475569" strokeWidth="1.5" />

      {/* Cuerpo (colgado, piernas elevadas) */}
      <g stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="140" cy="60" r="7" fill="#020617" />
        <line x1="140" y1="67" x2="140" y2="100" />
        {/* Piernas elevadas (flexionadas) */}
        <line x1="140" y1="100" x2="180" y2="80" />
        <line x1="180" y1="80" x2="200" y2="110" />
      </g>

      {/* Músculo: Abdomen */}
      <g>
        <ellipse cx="140" cy="85" rx="11" ry="14" fill="#10b981" opacity="0.5" filter="url(#glow)" />
        <ellipse cx="140" cy="85" rx="7" ry="10" fill="#10b981" opacity="0.4" />
        <line x1="140" y1="75" x2="140" y2="95" stroke="#022c22" strokeWidth="1.2" />
        <line x1="132" y1="80" x2="148" y2="80" stroke="#022c22" strokeWidth="1" />
        <line x1="132" y1="86" x2="148" y2="86" stroke="#022c22" strokeWidth="1" />
        <line x1="132" y1="92" x2="148" y2="92" stroke="#022c22" strokeWidth="1" />
      </g>

      {/* Flecha de elevación */}
      <Arrow d="M 220 130 L 250 90" />
    </Frame>
  );
}

function Plank({ info }: { info: MachineInfo }) {
  return (
    <Frame {...info}>
      {/* Suelo */}
      <line x1="20" y1="180" x2="300" y2="180" stroke="#475569" strokeWidth="3" />
      <line x1="20" y1="183" x2="300" y2="183" stroke="#475569" strokeWidth="1" opacity="0.4" />

      {/* Cuerpo en plancha */}
      <g stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Cabeza */}
        <circle cx="55" cy="155" r="6" fill="#020617" />
        {/* Torso recto */}
        <line x1="55" y1="161" x2="160" y2="120" />
        {/* Piernas rectas */}
        <line x1="160" y1="120" x2="270" y2="178" />
        {/* Brazo de apoyo */}
        <line x1="70" y1="160" x2="70" y2="180" />
        <line x1="65" y1="160" x2="75" y2="160" />
        {/* Pies */}
        <circle cx="270" cy="178" r="3" fill="#22d3ee" />
      </g>

      {/* Músculo: Core/Abdomen */}
      <g>
        <ellipse cx="110" cy="140" rx="22" ry="9" fill="#10b981" opacity="0.5" filter="url(#glow)" transform="rotate(-20 110 140)" />
        <ellipse cx="110" cy="140" rx="16" ry="6" fill="#10b981" opacity="0.4" transform="rotate(-20 110 140)" />
        <line x1="95" y1="138" x2="125" y2="142" stroke="#022c22" strokeWidth="1" />
        <line x1="95" y1="143" x2="125" y2="147" stroke="#022c22" strokeWidth="1" />
      </g>

      {/* Texto isométrico */}
      <g>
        <rect x="115" y="50" width="90" height="20" rx="10" fill="#1c1407" stroke="#fbbf24" strokeWidth="1" />
        <text x="160" y="63" fontSize="9" fontWeight="bold" fill="#fbbf24" textAnchor="middle">30-60 seg</text>
      </g>
    </Frame>
  );
}
