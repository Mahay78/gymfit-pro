import type { RoutineDay } from '../types';

export const ROUTINE_PPL_UPPER: RoutineDay[] = [
  {
    dayId: 1,
    title: "Día 1: Empuje (Pecho + Hombro + Tríceps)",
    shortTitle: "Empuje",
    description: "Día Push: tren superior de empuje con buen volumen para hipertrofia.",
    exercises: [
      {
        id: "pplu-d1-e1",
        name: "Press de Pecho Sentado",
        alternativeName: "Press Plano en Multipower",
        target: "Pectorales, Deltoides Anterior y Tríceps",
        setsCount: 4,
        defaultReps: 8,
        defaultWeight: 50,
        machineBase: 5,
        instructions: "Ajusta el asiento. Empuja con peso desafiante.",
        machineType: "chestpress"
      },
      {
        id: "pplu-d1-e2",
        name: "Press de Hombro Sentado",
        alternativeName: "Press Militar en Máquina",
        target: "Deltoides Anterior, Lateral y Tríceps",
        setsCount: 3,
        defaultReps: 10,
        defaultWeight: 28,
        machineBase: 10,
        instructions: "Empuja vertical. Controla la bajada.",
        machineType: "shoulderpress"
      },
      {
        id: "pplu-d1-e3",
        name: "Contractora / Pec Deck",
        alternativeName: "Aperturas de Pecho en Poleas Medias",
        target: "Aislamiento de Pectorales",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 32,
        machineBase: 0,
        instructions: "Codos semiflexionados. Aprieta el pecho.",
        machineType: "pecdeck"
      },
      {
        id: "pplu-d1-e4",
        name: "Elevaciones Laterales en Máquina",
        alternativeName: "Elevaciones Laterales con Polea Baja",
        target: "Deltoides Lateral (Hombros)",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 13,
        machineBase: 0,
        instructions: "Hasta 90°. Sin impulso.",
        machineType: "lateralraise"
      },
      {
        id: "pplu-d1-e5",
        name: "Extensión de Tríceps en Polea",
        alternativeName: "Patada de Tríceps Unilateral",
        target: "Tríceps (Cabeza Lateral y Larga)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 22,
        machineBase: 0,
        instructions: "Codos fijos. Extiende abajo controlando.",
        machineType: "tricepspushdown"
      }
    ]
  },
  {
    dayId: 2,
    title: "Día 2: Tirón (Espalda + Bíceps)",
    shortTitle: "Tirón",
    description: "Día Pull: espalda completa con bíceps al final.",
    exercises: [
      {
        id: "pplu-d2-e1",
        name: "Jalón al Pecho en Polea Alta",
        alternativeName: "Jalón al Pecho en Máquina de Palancas",
        target: "Dorsal Ancho, Bíceps y Espalda Alta",
        setsCount: 4,
        defaultReps: 8,
        defaultWeight: 55,
        machineBase: 5,
        instructions: "Agarre ancho. Tira a la clavícula contrayendo dorsales.",
        machineType: "pulldown"
      },
      {
        id: "pplu-d2-e2",
        name: "Remo Sentado con Soporte al Pecho",
        alternativeName: "Remo en Polea Baja con Triángulo",
        target: "Espalda Media, Redondo Mayor y Bíceps",
        setsCount: 4,
        defaultReps: 10,
        defaultWeight: 45,
        machineBase: 5,
        instructions: "Tira con codos cerca al cuerpo apretando escápulas.",
        machineType: "seatedrow"
      },
      {
        id: "pplu-d2-e3",
        name: "Remo en Polea Baja (Agarre Estrecho)",
        alternativeName: "Remo en Máquina de Palancas (Dorsal)",
        target: "Dorsal Ancho y Espalda Media",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 40,
        machineBase: 5,
        instructions: "Tira hacia el ombligo. Sin balancear.",
        machineType: "seatedrow"
      },
      {
        id: "pplu-d2-e4",
        name: "Curl de Bíceps en Banco Predicador",
        alternativeName: "Curl de Bíceps en Polea Baja",
        target: "Bíceps (Braquial)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 18,
        machineBase: 0,
        instructions: "Apoya axilas. Tira controlando con bíceps.",
        machineType: "bicepcurl"
      },
      {
        id: "pplu-d2-e5",
        name: "Curl de Bíceps en Polea Baja",
        alternativeName: "Curl de Bíceps Concentrado en Máquina",
        target: "Bíceps (Cabeza Corta)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 18,
        machineBase: 0,
        instructions: "Codos fijos. Flexión completa con pausa.",
        machineType: "bicepcurl"
      }
    ]
  },
  {
    dayId: 3,
    title: "Día 3: Pierna + Core",
    shortTitle: "Pierna",
    description: "Día Legs: cuádriceps, femorales, gemelos y abdomen.",
    exercises: [
      {
        id: "pplu-d3-e1",
        name: "Prensa de Piernas Inclinada",
        alternativeName: "Hack Squat en Máquina",
        target: "Cuádriceps, Glúteos y Femorales",
        setsCount: 4,
        defaultReps: 10,
        defaultWeight: 90,
        machineBase: 40,
        instructions: "Pies al ancho de hombros. Baja hasta 90° sin despegar espalda.",
        machineType: "legpress"
      },
      {
        id: "pplu-d3-e2",
        name: "Sentadilla Hack en Máquina",
        alternativeName: "Prensa con Pies Altos",
        target: "Glúteos, Femorales y Cuádriceps",
        setsCount: 3,
        defaultReps: 10,
        defaultWeight: 65,
        machineBase: 45,
        instructions: "Espalda apoyada. Baja hasta paralelo.",
        machineType: "hacksquat"
      },
      {
        id: "pplu-d3-e3",
        name: "Extensión de Cuádriceps",
        alternativeName: "Sillón de Prensa Horizontal",
        target: "Aislamiento de Cuádriceps",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 40,
        machineBase: 0,
        instructions: "Pausa 1s arriba. Excéntrica lenta.",
        machineType: "legextension"
      },
      {
        id: "pplu-d3-e4",
        name: "Curl de Pierna Sentado",
        alternativeName: "Curl de Pierna Tumbado",
        target: "Isquiotibiales (Femorales)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 45,
        machineBase: 0,
        instructions: "Pausa arriba. Controla el descenso.",
        machineType: "legcurl"
      },
      {
        id: "pplu-d3-e5",
        name: "Elevación de Talones de Pie",
        alternativeName: "Elevación de Gemelos Sentado",
        target: "Gemelos (Gastrocnemio) y Sóleo",
        setsCount: 4,
        defaultReps: 15,
        defaultWeight: 70,
        machineBase: 20,
        instructions: "Pausa arriba. Rango completo.",
        machineType: "calfraise"
      },
      {
        id: "pplu-d3-e6",
        name: "Crunch Abdominal en Máquina",
        alternativeName: "Elevación de Rodillas en Silla Romana",
        target: "Core, Recto Abdominal",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 30,
        machineBase: 0,
        instructions: "Sujeta agarres. Flexiona el torso contrayendo abdomen.",
        machineType: "crunch"
      }
    ]
  },
  {
    dayId: 4,
    title: "Día 4: Tren Superior Completo",
    shortTitle: "Upper",
    description: "Tren superior completo extra para más volumen. Pecho, espalda, hombros y brazos.",
    exercises: [
      {
        id: "pplu-d4-e1",
        name: "Press de Pecho Inclinado en Máquina",
        alternativeName: "Press de Pecho Plano en Multipower",
        target: "Pectoral Superior y Deltoides",
        setsCount: 3,
        defaultReps: 10,
        defaultWeight: 35,
        machineBase: 10,
        instructions: "Empuja hacia la clavícula. Controla el descenso.",
        machineType: "chestpress"
      },
      {
        id: "pplu-d4-e2",
        name: "Remo Hammer Convergente Unilateral",
        alternativeName: "Remo Sentado con un Brazo en Polea Baja",
        target: "Espalda Alta, Dorsal y Trapecios",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 25,
        machineBase: 5,
        instructions: "Tira con un brazo a la vez. Rotación sutil al final.",
        machineType: "seatedrow"
      },
      {
        id: "pplu-d4-e3",
        name: "Contractora Invertida (Pájaros Máquina)",
        alternativeName: "Elevaciones Posteriores Unilaterales en Polea",
        target: "Deltoides Posterior (Hombro de perfil)",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 15,
        machineBase: 0,
        instructions: "De frente al respaldo. Abre brazos con codos altos.",
        machineType: "reardelt"
      },
      {
        id: "pplu-d4-e4",
        name: "Curl de Bíceps en Polea Baja",
        alternativeName: "Curl de Bíceps Concentrado en Máquina",
        target: "Bíceps (Cabeza Corta)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 18,
        machineBase: 0,
        instructions: "Codos fijos. Flexión completa.",
        machineType: "bicepcurl"
      },
      {
        id: "pplu-d4-e5",
        name: "Extensión de Tríceps en Polea",
        alternativeName: "Patada de Tríceps con Cuerda en Polea Media",
        target: "Tríceps (Cabeza Larga)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 22,
        machineBase: 0,
        instructions: "Codos fijos al costado. Extiende abajo con cuerda.",
        machineType: "tricepspushdown"
      },
      {
        id: "pplu-d4-e6",
        name: "Jalón Dorsal Unilateral en Polea",
        alternativeName: "Remo Unilateral de Pie en Polea Media",
        target: "Dorsal Ancho (Aislamiento Unilateral)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 22,
        machineBase: 0,
        instructions: "Trabaja un lado a la vez. Tira llevando codo al bolsillo lateral.",
        machineType: "pulldown"
      }
    ]
  }
];
