import type { WarmupStep } from '../types';

export const WARMUP_STEPS: WarmupStep[] = [
  {
    id: "w1",
    title: "Cardio de Activación",
    desc: "5 minutos en Elíptica o Cinta plana a ritmo muy suave (RPE 4/10) para elevar temperatura corporal.",
    duration: "5 min"
  },
  {
    id: "w2",
    title: "Movilidad de Cadera",
    desc: "15 rotaciones suaves hacia afuera y adentro con cada pierna.",
    duration: "2 min"
  },
  {
    id: "w3",
    title: "Movilidad de Hombros",
    desc: "Circunducciones amplias de brazos hacia adelante y hacia atrás (10 repeticiones por lado).",
    duration: "2 min"
  },
  {
    id: "w4",
    title: "Aproximación en Máquina",
    desc: "Realiza 1 serie de 12 repeticiones con el 40% de tu peso de trabajo en la primera máquina del día.",
    duration: "2 min"
  }
];
