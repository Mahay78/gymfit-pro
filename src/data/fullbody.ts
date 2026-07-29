import type { RoutineDay } from '../types';

export const ROUTINE_FULLBODY: RoutineDay[] = [
  {
    dayId: 1,
    title: "Día 1: Tren Superior + Cuádriceps",
    shortTitle: "Día 1",
    description: "Full Body: Pecho, espalda, hombros y piernas. Mayor gasto calórico y estimulo hormonal.",
    exercises: [
      {
        id: "fb-d1-e1",
        name: "Press de Pecho Sentado",
        alternativeName: "Press Plano en Máquina Smith",
        target: "Pectorales, Deltoides Anterior y Tríceps",
        setsCount: 3,
        defaultReps: 10,
        defaultWeight: 40,
        machineBase: 5,
        instructions: "Ajusta el asiento a la altura del pecho medio. Empuja manteniendo los hombros pegados atrás sin bloquear codos.",
        machineType: "chestpress"
      },
      {
        id: "fb-d1-e2",
        name: "Jalón al Pecho en Polea Alta",
        alternativeName: "Remo en Máquina de Palancas",
        target: "Dorsal Ancho, Bíceps y Espalda Alta",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 45,
        machineBase: 5,
        instructions: "Sujeta la barra un poco más del ancho de hombros, saca pecho y tira hacia la clavícula controlando el descenso.",
        machineType: "pulldown"
      },
      {
        id: "fb-d1-e3",
        name: "Press de Hombro Sentado",
        alternativeName: "Elevaciones Laterales en Máquina",
        target: "Deltoides Anterior, Lateral y Tríceps",
        setsCount: 3,
        defaultReps: 10,
        defaultWeight: 20,
        machineBase: 10,
        instructions: "Manos a la altura de las orejas. Empuja de forma vertical sin bloquear los codos bruscamente.",
        machineType: "shoulderpress"
      },
      {
        id: "fb-d1-e4",
        name: "Prensa de Piernas Inclinada",
        alternativeName: "Sentadilla Hack en Máquina",
        target: "Cuádriceps, Glúteos y Femorales",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 80,
        machineBase: 40,
        instructions: "Pies al ancho de hombros en el centro de la plataforma. Baja controladamente hasta 90° sin despegar la espalda.",
        machineType: "legpress"
      },
      {
        id: "fb-d1-e5",
        name: "Curl de Bíceps en Banco Predicador",
        alternativeName: "Curl de Bíceps en Polea Baja",
        target: "Bíceps (Braquial)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 15,
        machineBase: 0,
        instructions: "Apoya axilas y tríceps firmemente en el cojín. Tira controlando con fuerza los bíceps sin balancear el cuerpo.",
        machineType: "bicepcurl"
      },
      {
        id: "fb-d1-e6",
        name: "Extensión de Tríceps en Polea",
        alternativeName: "Patada de Tríceps Unilateral",
        target: "Tríceps (Cabeza Lateral y Larga)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 18,
        machineBase: 0,
        instructions: "Mantén codos fijos a los costados. Extiende los brazos usando cuerda o barra, controlando el retorno.",
        machineType: "tricepspushdown"
      }
    ]
  },
  {
    dayId: 2,
    title: "Día 2: Tren Inferior + Core (Variación)",
    shortTitle: "Día 2",
    description: "Full Body: Pierna completa, espalda, hombros y abdomen. Enfoque en cadena posterior.",
    exercises: [
      {
        id: "fb-d2-e1",
        name: "Sentadilla Hack en Máquina",
        alternativeName: "Prensa con Pies Altos",
        target: "Cuádriceps, Glúteos y Femorales",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 50,
        machineBase: 45,
        instructions: "Apoya hombros bajo almohadillas y espalda completa en el respaldo. Baja controlando hasta romper paralelo.",
        machineType: "hacksquat"
      },
      {
        id: "fb-d2-e2",
        name: "Remo Sentado con Soporte al Pecho",
        alternativeName: "Remo en Polea Baja con Triángulo",
        target: "Espalda Media, Dorsal, Redondo Mayor y Bíceps",
        setsCount: 3,
        defaultReps: 10,
        defaultWeight: 35,
        machineBase: 5,
        instructions: "Apoya el pecho con firmeza. Tira de los agarres llevando codos hacia atrás y apretando escápulas.",
        machineType: "seatedrow"
      },
      {
        id: "fb-d2-e3",
        name: "Extensión de Cuádriceps",
        alternativeName: "Sillón de Prensa Horizontal",
        target: "Aislamiento de Cuádriceps",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 35,
        machineBase: 0,
        instructions: "Alinea la rodilla con el eje de rotación de la máquina. Extiende por completo y sostén 1 segundo arriba.",
        machineType: "legextension"
      },
      {
        id: "fb-d2-e4",
        name: "Curl de Pierna Sentado",
        alternativeName: "Curl de Pierna Tumbado",
        target: "Isquiotibiales (Femorales)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 35,
        machineBase: 0,
        instructions: "Ajusta bien el rodillo superior sobre los muslos. Flexiona las rodillas empujando hacia atrás de forma controlada.",
        machineType: "legcurl"
      },
      {
        id: "fb-d2-e5",
        name: "Elevaciones Laterales en Máquina",
        alternativeName: "Elevaciones Laterales en Polea Baja",
        target: "Deltoides Lateral (Hombros)",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 12,
        machineBase: 0,
        instructions: "Apoya los antebrazos en los rodillos y eleva los codos de forma lateral controlando el descenso.",
        machineType: "lateralraise"
      },
      {
        id: "fb-d2-e6",
        name: "Crunch Abdominal en Máquina",
        alternativeName: "Elevación de Rodillas en Silla Romana",
        target: "Core, Recto Abdominal",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 25,
        machineBase: 0,
        instructions: "Sujeta los agarres superiores, apoya lumbar y flexiona el torso concentrando fuerza en el abdomen.",
        machineType: "crunch"
      }
    ]
  },
  {
    dayId: 3,
    title: "Día 3: Metabólico Global + Gemelos",
    shortTitle: "Día 3",
    description: "Full Body: Trabajo global para vaciar glucógeno y optimizar el cardio de 30 min final.",
    exercises: [
      {
        id: "fb-d3-e1",
        name: "Press de Pecho Inclinado en Máquina",
        alternativeName: "Press de Pecho Plano en Multipower",
        target: "Pectoral Superior y Deltoides Anterior",
        setsCount: 3,
        defaultReps: 10,
        defaultWeight: 30,
        machineBase: 10,
        instructions: "Alinea el empuje hacia la zona de la clavícula. Empuja de forma controlada sin perder contacto con el respaldo.",
        machineType: "chestpress"
      },
      {
        id: "fb-d3-e2",
        name: "Jalón Dorsal Unilateral en Polea",
        alternativeName: "Remo Unilateral de Pie en Polea Media",
        target: "Dorsal Ancho (Trabajo Unilateral)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 20,
        machineBase: 0,
        instructions: "Trabaja un lado a la vez. Tira llevando el codo firmemente al bolsillo lateral sin girar el cuerpo.",
        machineType: "pulldown"
      },
      {
        id: "fb-d3-e3",
        name: "Contractora / Pec Deck",
        alternativeName: "Aperturas de Pecho en Poleas Medias",
        target: "Aislamiento de Pectorales",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 25,
        machineBase: 0,
        instructions: "Codos semiflexionados. Junta los brazos sintiendo la compresión interna del pecho y controla la apertura.",
        machineType: "pecdeck"
      },
      {
        id: "fb-d3-e4",
        name: "Prensa de Piernas (Variante)",
        alternativeName: "Hack Squat con Pies Altos",
        target: "Glúteos, Femorales y Cuádriceps",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 70,
        machineBase: 40,
        instructions: "Coloca los pies en la parte superior de la plataforma. Baja controlando para maximizar estiramiento de glúteos.",
        machineType: "legpress"
      },
      {
        id: "fb-d3-e5",
        name: "Curl de Bíceps en Polea Baja",
        alternativeName: "Curl de Bíceps Concentrado en Máquina",
        target: "Bíceps (Cabeza Corta)",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 12,
        machineBase: 0,
        instructions: "Usa barra recta o barra en W enganchada en polea baja. Mantén codos fijos y realiza flexión completa.",
        machineType: "bicepcurl"
      },
      {
        id: "fb-d3-e6",
        name: "Elevación de Talones de Pie",
        alternativeName: "Elevación de Gemelos Sentado",
        target: "Gemelos (Gastrocnemio) y Sóleo",
        setsCount: 4,
        defaultReps: 15,
        defaultWeight: 55,
        machineBase: 20,
        instructions: "Apoya metatarsos al borde. Estira lo máximo posible en el fondo y eleva al máximo sosteniendo 1 segundo arriba.",
        machineType: "calfraise"
      }
    ]
  }
];
