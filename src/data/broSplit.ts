import type { RoutineDay } from '../types';

export const ROUTINE_BRO_SPLIT: RoutineDay[] = [
  {
    dayId: 1,
    title: "Día 1: Pecho",
    shortTitle: "Pecho",
    description: "Día completo de pecho. Volumen alto: 5 ejercicios diferentes para máxima estimulación.",
    exercises: [
      {
        id: "bs-d1-e1",
        name: "Press de Pecho Sentado",
        alternativeName: "Press Plano en Multipower",
        target: "Pectorales, Deltoides Anterior y Tríceps",
        setsCount: 4,
        defaultReps: 10,
        defaultWeight: 45,
        machineBase: 5,
        instructions: "Ajusta el asiento. Empuja con peso desafiante y forma perfecta.",
        machineType: "chestpress"
      },
      {
        id: "bs-d1-e2",
        name: "Press de Pecho Inclinado en Máquina",
        alternativeName: "Press de Pecho Plano en Multipower",
        target: "Pectoral Superior y Deltoides",
        setsCount: 4,
        defaultReps: 10,
        defaultWeight: 35,
        machineBase: 10,
        instructions: "Empuja hacia la clavícula. Controla excéntrica.",
        machineType: "chestpress"
      },
      {
        id: "bs-d1-e3",
        name: "Contractora / Pec Deck",
        alternativeName: "Aperturas de Pecho en Poleas Medias",
        target: "Aislamiento de Pectorales",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 30,
        machineBase: 0,
        instructions: "Codos semiflexionados. Aprieta el pecho en la contracción.",
        machineType: "pecdeck"
      },
      {
        id: "bs-d1-e4",
        name: "Aperturas en Polea para Pecho (Cruce)",
        alternativeName: "Máquina de Aperturas Contractora",
        target: "Pectoral Medio e Inferior",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 18,
        machineBase: 0,
        instructions: "Poleas a altura media. Junta las manos al frente formando arco.",
        machineType: "pecdeck"
      },
      {
        id: "bs-d1-e5",
        name: "Press de Hombro Sentado",
        alternativeName: "Press Militar en Multipower",
        target: "Deltoides Anterior (extra para pecho)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 22,
        machineBase: 10,
        instructions: "Aperturas y press complementan el día. Peso moderado.",
        machineType: "shoulderpress"
      }
    ]
  },
  {
    dayId: 2,
    title: "Día 2: Espalda",
    shortTitle: "Espalda",
    description: "Día completo de espalda. Grosor, anchura y detalle de dorsales.",
    exercises: [
      {
        id: "bs-d2-e1",
        name: "Jalón al Pecho en Polea Alta",
        alternativeName: "Jalón al Pecho en Máquina de Palancas",
        target: "Dorsal Ancho (anchura)",
        setsCount: 4,
        defaultReps: 10,
        defaultWeight: 50,
        machineBase: 5,
        instructions: "Agarre ancho. Tira hacia la clavícula contrayendo dorsales.",
        machineType: "pulldown"
      },
      {
        id: "bs-d2-e2",
        name: "Remo Sentado con Soporte al Pecho",
        alternativeName: "Remo en Polea Baja con Triángulo",
        target: "Espalda Media (grosor)",
        setsCount: 4,
        defaultReps: 10,
        defaultWeight: 45,
        machineBase: 5,
        instructions: "Tira con codos cerca al cuerpo apretando escápulas.",
        machineType: "seatedrow"
      },
      {
        id: "bs-d2-e3",
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
        id: "bs-d2-e4",
        name: "Remo en Polea Baja (Agarre Estrecho)",
        alternativeName: "Remo en Máquina de Palancas (Dorsal)",
        target: "Dorsal Ancho y Espalda Media",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 40,
        machineBase: 5,
        instructions: "Agarre cerrado. Tira hacia el ombligo.",
        machineType: "seatedrow"
      },
      {
        id: "bs-d2-e5",
        name: "Jalón Dorsal con Agarre Cerrado Supino",
        alternativeName: "Remo T-Bar con Soporte de Pecho",
        target: "Dorsal Inferior y Bíceps",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 40,
        machineBase: 5,
        instructions: "Manos hacia ti (supino). Tira abajo enfocando parte baja de la espalda.",
        machineType: "pulldown"
      }
    ]
  },
  {
    dayId: 3,
    title: "Día 3: Pierna",
    shortTitle: "Pierna",
    description: "Día completo de pierna. Cuádriceps, isquiotibiales, gemelos y glúteos.",
    exercises: [
      {
        id: "bs-d3-e1",
        name: "Prensa de Piernas Inclinada",
        alternativeName: "Hack Squat en Máquina",
        target: "Cuádriceps, Glúteos y Femorales",
        setsCount: 4,
        defaultReps: 10,
        defaultWeight: 95,
        machineBase: 40,
        instructions: "Pies al ancho de hombros. Empuje explosivo, bajada controlada.",
        machineType: "legpress"
      },
      {
        id: "bs-d3-e2",
        name: "Sentadilla Hack en Máquina",
        alternativeName: "Sentadilla de Copa con Mancuerna",
        target: "Cuádriceps, Glúteos y Femorales",
        setsCount: 4,
        defaultReps: 10,
        defaultWeight: 65,
        machineBase: 45,
        instructions: "Espalda apoyada completamente. Baja hasta paralelo.",
        machineType: "hacksquat"
      },
      {
        id: "bs-d3-e3",
        name: "Extensión de Cuádriceps",
        alternativeName: "Sillón de Prensa Horizontal",
        target: "Aislamiento de Cuádriceps",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 40,
        machineBase: 0,
        instructions: "Sostén 1 segundo arriba. Excéntrica lenta de 2-3 segundos.",
        machineType: "legextension"
      },
      {
        id: "bs-d3-e4",
        name: "Curl de Pierna Sentado",
        alternativeName: "Curl de Pierna Tumbado",
        target: "Isquiotibiales (Femorales)",
        setsCount: 4,
        defaultReps: 12,
        defaultWeight: 45,
        machineBase: 0,
        instructions: "Pausa arriba. Controla el descenso.",
        machineType: "legcurl"
      },
      {
        id: "bs-d3-e5",
        name: "Elevación de Talones de Pie",
        alternativeName: "Elevación de Gemelos Sentado",
        target: "Gemelos (Gastrocnemio)",
        setsCount: 5,
        defaultReps: 15,
        defaultWeight: 70,
        machineBase: 20,
        instructions: "Pausa arriba 1-2 segundos. Estira abajo.",
        machineType: "calfraise"
      }
    ]
  },
  {
    dayId: 4,
    title: "Día 4: Hombro y Brazo",
    shortTitle: "Hombro/Brazo",
    description: "Día de hombros completo + brazos (bíceps y tríceps).",
    exercises: [
      {
        id: "bs-d4-e1",
        name: "Press de Hombro Sentado",
        alternativeName: "Press Militar en Máquina",
        target: "Deltoides Anterior, Lateral y Tríceps",
        setsCount: 4,
        defaultReps: 10,
        defaultWeight: 25,
        machineBase: 10,
        instructions: "Empuja vertical sin bloquear codos. Baja controlando.",
        machineType: "shoulderpress"
      },
      {
        id: "bs-d4-e2",
        name: "Elevaciones Laterales en Máquina",
        alternativeName: "Elevaciones Laterales con Polea Baja",
        target: "Deltoides Lateral (Hombros)",
        setsCount: 4,
        defaultReps: 15,
        defaultWeight: 12,
        machineBase: 0,
        instructions: "Hasta 90°. Sin impulso. Control total.",
        machineType: "lateralraise"
      },
      {
        id: "bs-d4-e3",
        name: "Contractora Invertida (Pájaros Máquina)",
        alternativeName: "Elevaciones Posteriores Unilaterales en Polea",
        target: "Deltoides Posterior (Hombro de perfil)",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 15,
        machineBase: 0,
        instructions: "De frente al respaldo. Abre brazos con codos altos.",
        machineType: "pecdeck"
      },
      {
        id: "bs-d4-e4",
        name: "Curl de Bíceps en Banco Predicador",
        alternativeName: "Curl de Bíceps en Polea Baja",
        target: "Bíceps (Braquial)",
        setsCount: 4,
        defaultReps: 10,
        defaultWeight: 18,
        machineBase: 0,
        instructions: "Cuerpo firme. Tira controlando la excéntrica.",
        machineType: "bicepcurl"
      },
      {
        id: "bs-d4-e5",
        name: "Curl de Bíceps en Polea Baja",
        alternativeName: "Curl de Bíceps Concentrado en Máquina",
        target: "Bíceps (Cabeza Corta)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 18,
        machineBase: 0,
        instructions: "Codos fijos. Flexión completa con pausa.",
        machineType: "bicepcurl"
      },
      {
        id: "bs-d4-e6",
        name: "Extensión de Tríceps en Polea",
        alternativeName: "Patada de Tríceps con Cuerda en Polea Media",
        target: "Tríceps (Cabeza Larga)",
        setsCount: 4,
        defaultReps: 12,
        defaultWeight: 20,
        machineBase: 0,
        instructions: "Codos fijos al costado. Extiende abajo con cuerda.",
        machineType: "tricepspushdown"
      }
    ]
  },
  {
    dayId: 5,
    title: "Día 5: Core y Cardio",
    shortTitle: "Core/Cardio",
    description: "Día final: core completo + cardio opcional para mantener déficit calórico.",
    exercises: [
      {
        id: "bs-d5-e1",
        name: "Crunch Abdominal en Máquina",
        alternativeName: "Elevación de Rodillas en Silla Romana",
        target: "Core, Recto Abdominal",
        setsCount: 3,
        defaultReps: 20,
        defaultWeight: 30,
        machineBase: 0,
        instructions: "Sujeta agarres. Flexiona el torso contrayendo abdomen.",
        machineType: "crunch"
      },
      {
        id: "bs-d5-e2",
        name: "Rotaciones de Torso en Máquina",
        alternativeName: "Giros Rusos en el Suelo con Disco",
        target: "Oblicuos y Rotadores del Tronco",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 25,
        machineBase: 0,
        instructions: "Mantén pelvis fija. Gira el torso contrayendo oblicuos.",
        machineType: "crunch"
      },
      {
        id: "bs-d5-e3",
        name: "Elevación de Piernas en Silla Romana",
        alternativeName: "Crunch Abdominal en Colchoneta",
        target: "Abdomen Inferior e Iliopsoas",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 0,
        machineBase: 0,
        instructions: "Antebrazos apoyados. Eleva piernas enrollando pelvis.",
        machineType: "captainschair"
      },
      {
        id: "bs-d5-e4",
        name: "Hiperextensiones Lumbar en Banco",
        alternativeName: "Extensión de Cadera en Polea Baja",
        target: "Lumbares, Glúteos e Isquiotibiales",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 0,
        machineBase: 0,
        instructions: "Sube hasta alineación. Controla el descenso.",
        machineType: "hyperextension"
      },
      {
        id: "bs-d5-e5",
        name: "Plancha Abdominal Estática (con apoyo)",
        alternativeName: "Crunch Abdominal Controlado en Polea Alta",
        target: "Abdomen Profundo, Core",
        setsCount: 3,
        defaultReps: 45,
        defaultWeight: 0,
        machineBase: 0,
        instructions: "Mantén cuerpo recto 30-60 segundos. Abdomen contraído.",
        machineType: "plank"
      }
    ]
  }
];
