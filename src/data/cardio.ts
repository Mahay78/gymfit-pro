import type { CardioOption } from '../types';

export const CARDIO_OPTIONS: CardioOption[] = [
  {
    id: "co1",
    name: "Cinta Inclinada (LISS)",
    details: "Inclinación: 10% a 12% | Velocidad: 4.0 - 5.0 km/h. Ideal para quemar grasa sin impacto en las rodillas.",
    avgCals: "250-300"
  },
  {
    id: "co2",
    name: "Elíptica de Resistencia",
    details: "Nivel de resistencia: Medio (RPE 6/10) | Cadencia constante de 60-70 RPM. Excelente estímulo global.",
    avgCals: "280-330"
  },
  {
    id: "co3",
    name: "Bicicleta Estática",
    details: "Mantener cadencia fluida arriba de 75 RPM. Excelente opción si sientes fatiga en articulaciones.",
    avgCals: "220-270"
  }
];
