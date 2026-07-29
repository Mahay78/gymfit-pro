import type { RoutineDay } from '../types';

export const ROUTINE_PPL: RoutineDay[] = [
  {
    dayId: 1,
    title: "Día 1: Empuje (Pecho + Hombro + Tríceps)",
    shortTitle: "Empuje",
    description: "Día Push: Trabajo completo de tren superior de empuje. 4 series por ejercicio principal.",
    exercises: [
      {
        id: "ppl-d1-e1",
        name: "Press de Pecho Sentado",
        alternativeName: "Press Plano en Multipower",
        target: "Pectorales, Deltoides Anterior y Tríceps",
        setsCount: 4,
        defaultReps: 10,
        defaultWeight: 40,
        machineBase: 5,
        instructions: "Ajusta el asiento a la altura del pecho medio. Empuja manteniendo los hombros pegados atrás sin bloquear codos.",
        machineType: "chestpress"
      },
      {
        id: "ppl-d1-e2",
        name: "Press de Hombro Sentado",
        alternativeName: "Press Militar en Máquina",
        target: "Deltoides Anterior, Lateral y Tríceps",
        setsCount: 3,
        defaultReps: 10,
        defaultWeight: 25,
        machineBase: 10,
        instructions: "Manos a la altura de las orejas. Empuja de forma vertical sin bloquear los codos bruscamente.",
        machineType: "shoulderpress"
      },
      {
        id: "ppl-d1-e3",
        name: "Elevaciones Laterales en Máquina",
        alternativeName: "Elevaciones Laterales con Polea Baja",
        target: "Deltoides Lateral (Hombros)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 12,
        machineBase: 0,
        instructions: "Apoya los antebrazos en los rodillos y eleva los codos de forma lateral controlando el descenso.",
        machineType: "lateralraise"
      },
      {
        id: "ppl-d1-e4",
        name: "Contractora / Pec Deck",
        alternativeName: "Aperturas de Pecho en Poleas Medias",
        target: "Aislamiento de Pectorales (parte interna)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 25,
        machineBase: 0,
        instructions: "Codos semiflexionados. Junta los brazos sintiendo la compresión interna del pecho.",
        machineType: "pecdeck"
      },
      {
        id: "ppl-d1-e5",
        name: "Extensión de Tríceps en Polea",
        alternativeName: "Patada de Tríceps Unilateral",
        target: "Tríceps (Cabeza Lateral y Larga)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 20,
        machineBase: 0,
        instructions: "Mantén codos fijos a los costados del cuerpo. Extiende los brazos hacia abajo usando cuerda o barra.",
        machineType: "tricepspushdown"
      },
      {
        id: "ppl-d1-e6",
        name: "Press de Pecho Inclinado en Máquina",
        alternativeName: "Press de Pecho Plano en Multipower (pecho superior)",
        target: "Pectoral Superior y Deltoides",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 25,
        machineBase: 10,
        instructions: "Alinea el empuje hacia la zona de la clavícula. Empuja de forma controlada.",
        machineType: "chestpress"
      }
    ]
  },
  {
    dayId: 2,
    title: "Día 2: Tirón (Espalda + Bíceps)",
    shortTitle: "Tirón",
    description: "Día Pull: Trabajo completo de tren superior de tirón. Espalda ancha, media y baja.",
    exercises: [
      {
        id: "ppl-d2-e1",
        name: "Jalón al Pecho en Polea Alta",
        alternativeName: "Jalón al Pecho en Máquina de Palancas",
        target: "Dorsal Ancho, Bíceps y Espalda Alta",
        setsCount: 4,
        defaultReps: 10,
        defaultWeight: 45,
        machineBase: 5,
        instructions: "Sujeta la barra un poco más del ancho de hombros, saca pecho y tira hacia la clavícula controlando el descenso.",
        machineType: "pulldown"
      },
      {
        id: "ppl-d2-e2",
        name: "Remo Sentado con Soporte al Pecho",
        alternativeName: "Remo en Polea Baja con Triángulo",
        target: "Espalda Media, Redondo Mayor y Bíceps",
        setsCount: 4,
        defaultReps: 10,
        defaultWeight: 40,
        machineBase: 5,
        instructions: "Apoya el pecho con firmeza. Tira de los agarres llevando codos hacia atrás y apretando escápulas.",
        machineType: "seatedrow"
      },
      {
        id: "ppl-d2-e3",
        name: "Remo en Polea Baja (Agarre Estrecho)",
        alternativeName: "Remo en Máquina de Palancas (Dorsal)",
        target: "Dorsal Ancho y Espalda Media",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 40,
        machineBase: 5,
        instructions: "Rodillas semiflexionadas, torso erguido. Tira hacia tu ombligo sin balancear el cuerpo.",
        machineType: "seatedrow"
      },
      {
        id: "ppl-d2-e4",
        name: "Curl de Bíceps en Banco Predicador",
        alternativeName: "Curl de Bíceps en Polea Baja",
        target: "Bíceps (Braquial)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 15,
        machineBase: 0,
        instructions: "Apoya axilas y tríceps firmemente en el cojín. Tira controlando con fuerza los bíceps.",
        machineType: "bicepcurl"
      },
      {
        id: "ppl-d2-e5",
        name: "Curl de Bíceps en Polea Baja",
        alternativeName: "Curl de Bíceps Concentrado en Máquina",
        target: "Bíceps (Cabeza Corta)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 15,
        machineBase: 0,
        instructions: "Usa barra recta o barra en W. Mantén codos fijos y realiza flexión completa.",
        machineType: "bicepcurl"
      },
      {
        id: "ppl-d2-e6",
        name: "Hiperextensiones Lumbar en Banco",
        alternativeName: "Extensión de Cadera en Polea Baja",
        target: "Lumbares, Glúteos e Isquiotibiales",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 0,
        machineBase: 0,
        instructions: "Torso recto, baja controladamente y elévalo hasta que tu cuerpo quede alineado.",
        machineType: "hyperextension"
      }
    ]
  },
  {
    dayId: 3,
    title: "Día 3: Pierna + Core",
    shortTitle: "Pierna",
    description: "Día Legs: Cuádriceps, isquiotibiales, gemelos y core. Mayor gasto calórico.",
    exercises: [
      {
        id: "ppl-d3-e1",
        name: "Prensa de Piernas Inclinada",
        alternativeName: "Hack Squat en Máquina",
        target: "Cuádriceps, Glúteos y Femorales",
        setsCount: 4,
        defaultReps: 12,
        defaultWeight: 80,
        machineBase: 40,
        instructions: "Pies al ancho de hombros en el centro de la plataforma. Baja controladamente hasta 90° sin despegar la espalda.",
        machineType: "legpress"
      },
      {
        id: "ppl-d3-e2",
        name: "Sentadilla Hack en Máquina",
        alternativeName: "Prensa con Pies Altos",
        target: "Glúteos, Femorales y Cuádriceps",
        setsCount: 3,
        defaultReps: 10,
        defaultWeight: 60,
        machineBase: 45,
        instructions: "Apoya hombros bajo almohadillas y espalda completa en el respaldo. Baja controlando hasta romper paralelo.",
        machineType: "hacksquat"
      },
      {
        id: "ppl-d3-e3",
        name: "Extensión de Cuádriceps",
        alternativeName: "Sillón de Prensa Horizontal",
        target: "Aislamiento de Cuádriceps",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 35,
        machineBase: 0,
        instructions: "Alinea la rodilla con el eje de rotación. Extiende por completo y sostén 1 segundo arriba.",
        machineType: "legextension"
      },
      {
        id: "ppl-d3-e4",
        name: "Curl de Pierna Sentado",
        alternativeName: "Curl de Pierna Tumbado",
        target: "Isquiotibiales (Femorales)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 40,
        machineBase: 0,
        instructions: "Ajusta bien el rodillo superior sobre los muslos. Flexiona las rodillas empujando hacia atrás.",
        machineType: "legcurl"
      },
      {
        id: "ppl-d3-e5",
        name: "Elevación de Talones de Pie",
        alternativeName: "Elevación de Gemelos Sentado",
        target: "Gemelos (Gastrocnemio) y Sóleo",
        setsCount: 4,
        defaultReps: 15,
        defaultWeight: 60,
        machineBase: 20,
        instructions: "Apoya metatarsos al borde. Estira lo máximo posible en el fondo y eleva al máximo sosteniendo 1 segundo arriba.",
        machineType: "calfraise"
      },
      {
        id: "ppl-d3-e6",
        name: "Crunch Abdominal en Máquina",
        alternativeName: "Elevación de Rodillas en Silla Romana",
        target: "Core, Recto Abdominal",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 30,
        machineBase: 0,
        instructions: "Sujeta los agarres superiores, apoya lumbar y flexiona el torso concentrando fuerza en el abdomen.",
        machineType: "crunch"
      }
    ]
  }
];
