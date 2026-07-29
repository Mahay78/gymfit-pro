import type { RoutineDay } from '../types';

export const ROUTINE_UPPER_LOWER: RoutineDay[] = [
  {
    dayId: 1,
    title: "Día 1: Tren Superior A (Fuerza)",
    shortTitle: "Upper A",
    description: "Tren superior enfocado en fuerza: pecho, espalda, hombros y brazos.",
    exercises: [
      {
        id: "ul-d1-e1",
        name: "Press de Pecho Sentado",
        alternativeName: "Press Plano en Multipower",
        target: "Pectorales, Deltoides Anterior y Tríceps",
        setsCount: 4,
        defaultReps: 8,
        defaultWeight: 45,
        machineBase: 5,
        instructions: "Ajusta el asiento a la altura del pecho medio. Empuja con peso desafiante manteniendo forma.",
        machineType: "chestpress"
      },
      {
        id: "ul-d1-e2",
        name: "Jalón al Pecho en Polea Alta",
        alternativeName: "Jalón al Pecho en Máquina de Palancas",
        target: "Dorsal Ancho, Bíceps y Espalda Alta",
        setsCount: 4,
        defaultReps: 8,
        defaultWeight: 50,
        machineBase: 5,
        instructions: "Agarre un poco más ancho que hombros. Tira hacia la clavícula contrayendo escápulas.",
        machineType: "pulldown"
      },
      {
        id: "ul-d1-e3",
        name: "Press de Hombro Sentado",
        alternativeName: "Press Militar en Máquina",
        target: "Deltoides Anterior, Lateral y Tríceps",
        setsCount: 3,
        defaultReps: 10,
        defaultWeight: 25,
        machineBase: 10,
        instructions: "Empuja vertical sin bloquear codos. Baja controlando a la altura de orejas.",
        machineType: "shoulderpress"
      },
      {
        id: "ul-d1-e4",
        name: "Remo Sentado con Soporte al Pecho",
        alternativeName: "Remo en Polea Baja con Triángulo",
        target: "Espalda Media, Redondo Mayor y Bíceps",
        setsCount: 3,
        defaultReps: 10,
        defaultWeight: 40,
        machineBase: 5,
        instructions: "Tira llevando codos atrás apretando escápulas. Sin balancear cuerpo.",
        machineType: "seatedrow"
      },
      {
        id: "ul-d1-e5",
        name: "Curl de Bíceps en Banco Predicador",
        alternativeName: "Curl de Bíceps en Polea Baja",
        target: "Bíceps (Braquial)",
        setsCount: 3,
        defaultReps: 10,
        defaultWeight: 17,
        machineBase: 0,
        instructions: "Apoya axilas y tríceps. Tira controlando con fuerza los bíceps.",
        machineType: "bicepcurl"
      },
      {
        id: "ul-d1-e6",
        name: "Extensión de Tríceps en Polea",
        alternativeName: "Patada de Tríceps Unilateral",
        target: "Tríceps (Cabeza Lateral y Larga)",
        setsCount: 3,
        defaultReps: 10,
        defaultWeight: 22,
        machineBase: 0,
        instructions: "Codos fijos al costado. Extiende los brazos controlando el retorno.",
        machineType: "tricepspushdown"
      }
    ]
  },
  {
    dayId: 2,
    title: "Día 2: Tren Inferior A (Fuerza)",
    shortTitle: "Lower A",
    description: "Tren inferior enfocado en fuerza: cuádriceps, femorales y glúteos.",
    exercises: [
      {
        id: "ul-d2-e1",
        name: "Prensa de Piernas Inclinada",
        alternativeName: "Hack Squat en Máquina",
        target: "Cuádriceps, Glúteos y Femorales",
        setsCount: 4,
        defaultReps: 10,
        defaultWeight: 90,
        machineBase: 40,
        instructions: "Pies al ancho de hombros. Baja hasta 90° sin despegar la espalda.",
        machineType: "legpress"
      },
      {
        id: "ul-d2-e2",
        name: "Sentadilla Hack en Máquina",
        alternativeName: "Prensa con Pies Altos",
        target: "Glúteos, Femorales y Cuádriceps",
        setsCount: 3,
        defaultReps: 10,
        defaultWeight: 60,
        machineBase: 45,
        instructions: "Baja controlando hasta paralelo. Mantén espalda apoyada completamente.",
        machineType: "hacksquat"
      },
      {
        id: "ul-d2-e3",
        name: "Curl de Pierna Sentado",
        alternativeName: "Curl de Pierna Tumbado",
        target: "Isquiotibiales (Femorales)",
        setsCount: 3,
        defaultReps: 10,
        defaultWeight: 45,
        machineBase: 0,
        instructions: "Ajuste correcto del rodillo. Flexiona empujando hacia atrás.",
        machineType: "legcurl"
      },
      {
        id: "ul-d2-e4",
        name: "Extensión de Cuádriceps",
        alternativeName: "Sillón de Prensa Horizontal",
        target: "Aislamiento de Cuádriceps",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 40,
        machineBase: 0,
        instructions: "Alinea rodilla con el eje. Extiende por completo y sostén 1 segundo.",
        machineType: "legextension"
      },
      {
        id: "ul-d2-e5",
        name: "Elevación de Talones de Pie",
        alternativeName: "Elevación de Gemelos Sentado",
        target: "Gemelos (Gastrocnemio) y Sóleo",
        setsCount: 4,
        defaultReps: 12,
        defaultWeight: 70,
        machineBase: 20,
        instructions: "Estira abajo, sube arriba con pausa. Rango completo.",
        machineType: "calfraise"
      },
      {
        id: "ul-d2-e6",
        name: "Hiperextensiones Lumbar en Banco",
        alternativeName: "Extensión de Cadera en Polea Baja",
        target: "Lumbares, Glúteos e Isquiotibiales",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 0,
        machineBase: 0,
        instructions: "Sube hasta alineación total. Controla el descenso sin caer de golpe.",
        machineType: "hyperextension"
      }
    ]
  },
  {
    dayId: 3,
    title: "Día 3: Tren Superior B (Volumen)",
    shortTitle: "Upper B",
    description: "Tren superior con más repeticiones: variación de ejercicios para hipertrofia.",
    exercises: [
      {
        id: "ul-d3-e1",
        name: "Press de Pecho Inclinado en Máquina",
        alternativeName: "Press de Pecho Plano en Multipower",
        target: "Pectoral Superior y Deltoides",
        setsCount: 4,
        defaultReps: 12,
        defaultWeight: 35,
        machineBase: 10,
        instructions: "Empuja hacia la clavícula. Control total sin bloquear codos.",
        machineType: "chestpress"
      },
      {
        id: "ul-d3-e2",
        name: "Remo en Polea Baja (Agarre Estrecho)",
        alternativeName: "Remo en Máquina de Palancas (Dorsal)",
        target: "Dorsal Ancho y Espalda Media",
        setsCount: 4,
        defaultReps: 12,
        defaultWeight: 45,
        machineBase: 5,
        instructions: "Tira hacia el ombligo contrayendo dorsales. Sin balancear.",
        machineType: "seatedrow"
      },
      {
        id: "ul-d3-e3",
        name: "Elevaciones Laterales en Máquina",
        alternativeName: "Elevaciones Laterales con Polea Baja",
        target: "Deltoides Lateral (Hombros)",
        setsCount: 4,
        defaultReps: 15,
        defaultWeight: 12,
        machineBase: 0,
        instructions: "Sube hasta 90° controlando el descenso. Sin impulso.",
        machineType: "lateralraise"
      },
      {
        id: "ul-d3-e4",
        name: "Contractora / Pec Deck",
        alternativeName: "Aperturas de Pecho en Poleas Medias",
        target: "Aislamiento de Pectorales (parte interna)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 30,
        machineBase: 0,
        instructions: "Codos semiflexionados. Junta los brazos apretando el pecho.",
        machineType: "pecdeck"
      },
      {
        id: "ul-d3-e5",
        name: "Curl de Bíceps en Polea Baja",
        alternativeName: "Curl de Bíceps Concentrado en Máquina",
        target: "Bíceps (Cabeza Corta)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 17,
        machineBase: 0,
        instructions: "Codos fijos al costado. Flexión completa y controlada.",
        machineType: "bicepcurl"
      },
      {
        id: "ul-d3-e6",
        name: "Extensión de Tríceps en Polea",
        alternativeName: "Patada de Tríceps Unilateral",
        target: "Tríceps (Cabeza Lateral y Larga)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 22,
        machineBase: 0,
        instructions: "Codos fijos. Extiende abajo controlando el retorno.",
        machineType: "tricepspushdown"
      }
    ]
  },
  {
    dayId: 4,
    title: "Día 4: Tren Inferior B (Hipertrofia)",
    shortTitle: "Lower B",
    description: "Tren inferior con más repeticiones y variación para hipertrofia.",
    exercises: [
      {
        id: "ul-d4-e1",
        name: "Prensa de Piernas (Pies Altos)",
        alternativeName: "Zancadas en Multipower",
        target: "Glúteos, Femorales y Cuádriceps",
        setsCount: 4,
        defaultReps: 12,
        defaultWeight: 80,
        machineBase: 40,
        instructions: "Pies arriba en la plataforma. Maximiza estiramiento de glúteos.",
        machineType: "legpress"
      },
      {
        id: "ul-d4-e2",
        name: "Extensión de Cuádriceps Unilateral",
        alternativeName: "Zancadas Estáticas en Máquina Multipower",
        target: "Cuádriceps (Énfasis Vasto Medial)",
        setsCount: 4,
        defaultReps: 12,
        defaultWeight: 25,
        machineBase: 0,
        instructions: "Serie completa con una pierna y luego la otra sin descanso.",
        machineType: "legextension"
      },
      {
        id: "ul-d4-e3",
        name: "Curl Femoral Tumbado",
        alternativeName: "Curl Femoral Sentado",
        target: "Isquiotibiales",
        setsCount: 4,
        defaultReps: 12,
        defaultWeight: 35,
        machineBase: 0,
        instructions: "Boca abajo o sentado. Flexiona llevando talones al glúteo.",
        machineType: "legcurl"
      },
      {
        id: "ul-d4-e4",
        name: "Remo Hammer Convergente Unilateral",
        alternativeName: "Remo Sentado con un Brazo en Polea Baja",
        target: "Espalda Alta, Dorsal y Trapecios",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 25,
        machineBase: 5,
        instructions: "Tira con un brazo rotando sutilmente al final del movimiento.",
        machineType: "seatedrow"
      },
      {
        id: "ul-d4-e5",
        name: "Elevación de Gemelos Sentado",
        alternativeName: "Elevación de Talones de Pie en Prensa",
        target: "Sóleo (Gemelo Inferior)",
        setsCount: 4,
        defaultReps: 15,
        defaultWeight: 40,
        machineBase: 15,
        instructions: "Apoya rodillas. Baja talones abajo del nivel y sube con potencia.",
        machineType: "calfraise"
      },
      {
        id: "ul-d4-e6",
        name: "Crunch Abdominal en Máquina",
        alternativeName: "Elevación de Rodillas en Silla Romana",
        target: "Core, Recto Abdominal",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 30,
        machineBase: 0,
        instructions: "Sujeta agarres superiores. Flexiona el torso contrayendo abdomen.",
        machineType: "crunch"
      }
    ]
  }
];
