import type { RoutineDay } from '../types';

export const ROUTINE_WEEK_A: RoutineDay[] = [
  {
    dayId: 1,
    title: "Día 1: Empuje & Cuádriceps (Fuerza)",
    shortTitle: "Día 1",
    description: "Semana A: Enfoque en conservar masa muscular con empujes estables.",
    exercises: [
      {
        id: "wa-d1-e1",
        name: "Prensa de Piernas Inclinada",
        alternativeName: "Prensa Horizontal de Placas",
        target: "Cuádriceps, Glúteos y Femorales",
        setsCount: 4,
        defaultReps: 10,
        defaultWeight: 80,
        machineBase: 40,
        instructions: "Apoya bien la espalda, pies al ancho de hombros en el centro de la plataforma y baja controladamente hasta 90°.",
        machineType: "legpress"
      },
      {
        id: "wa-d1-triceps",
        name: "Extensión de Tríceps en Polea",
        alternativeName: "Patada de Tríceps Unilateral en Polea",
        target: "Tríceps (Cabeza Lateral y Larga)",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 20,
        machineBase: 0,
        instructions: "Mantén codos fijos a los costados del cuerpo. Extiende los brazos hacia abajo usando cuerda o barra.",
        machineType: "tricepspushdown"
      },
      {
        id: "wa-d1-e3",
        name: "Press de Pecho Sentado",
        alternativeName: "Press de Pecho Inclinado en Máquina",
        target: "Pectorales, Deltoides Anterior y Tríceps",
        setsCount: 3,
        defaultReps: 10,
        defaultWeight: 40,
        machineBase: 5,
        instructions: "Ajusta el asiento a la altura del pecho medio. Empuja manteniendo los hombros pegados atrás.",
        machineType: "chestpress"
      },
      {
        id: "wa-d1-e4",
        name: "Extensión de Cuádriceps",
        alternativeName: "Sillón de Prensa Horizontal (Foco Cuádriceps)",
        target: "Aislamiento de Cuádriceps",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 35,
        machineBase: 0,
        instructions: "Alinea la rodilla con el eje de rotación de la máquina. Extiende por completo y sostén 1s arriba.",
        machineType: "legextension"
      },
      {
        id: "wa-d1-e5",
        name: "Elevaciones Laterales en Máquina",
        alternativeName: "Elevaciones Laterales en Polea Baja",
        target: "Deltoides Lateral (Hombros)",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 15,
        machineBase: 0,
        instructions: "Apoya los antebrazos en los rodillos y eleva los codos de forma lateral controlando el descenso.",
        machineType: "lateralraise"
      },
      {
        id: "wa-d1-e6",
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
  },
  {
    dayId: 2,
    title: "Día 2: Tirón & Femoral (Cadena Posterior)",
    shortTitle: "Día 2",
    description: "Semana A: Prioridad en el desarrollo de la espalda, postura firme e isquiotibiales.",
    exercises: [
      {
        id: "wa-d2-e1",
        name: "Curl de Pierna Sentado",
        alternativeName: "Curl de Pierna Tumbado",
        target: "Isquiotibiales (Femorales)",
        setsCount: 4,
        defaultReps: 12,
        defaultWeight: 40,
        machineBase: 0,
        instructions: "Ajusta bien el rodillo superior sobre los muslos. Flexiona las rodillas empujando hacia atrás.",
        machineType: "legcurl"
      },
      {
        id: "wa-d2-e2",
        name: "Remo Sentado con Soporte al Pecho",
        alternativeName: "Remo en Polea Baja con Triángulo",
        target: "Espalda Media, Redondo Mayor y Bíceps",
        setsCount: 4,
        defaultReps: 10,
        defaultWeight: 35,
        machineBase: 5,
        instructions: "Apoya el pecho con firmeza. Tira de los agarres llevando codos hacia atrás y apretando escápulas.",
        machineType: "seatedrow"
      },
      {
        id: "wa-d2-jalon",
        name: "Jalón al Pecho en Polea Alta",
        alternativeName: "Jalón al Pecho en Máquina de Palancas",
        target: "Dorsal Ancho, Redondo Mayor y Bíceps",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 45,
        machineBase: 5,
        instructions: "Sujeta la barra un poco más del ancho de hombros, saca pecho y tira de la barra hacia la clavícula.",
        machineType: "pulldown"
      },
      {
        id: "wa-d2-biceps",
        name: "Curl de Bíceps en Banco Predicador",
        alternativeName: "Curl de Bíceps con Barra Z",
        target: "Bíceps (Cabeza Corta y Braquial)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 15,
        machineBase: 0,
        instructions: "Apoya la parte posterior del brazo en el cojín. Flexiona el codo sin despegar el brazo del banco.",
        machineType: "bicepcurl"
      },
      {
        id: "wa-d2-posterior",
        name: "Contractora Invertida / Deltoides Posterior",
        alternativeName: "Pájaros en Polea Cruzada",
        target: "Deltoides Posterior y Tramo Superior de Espalda",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 25,
        machineBase: 0,
        instructions: "Codos ligeramente flexionados. Abre los brazos hacia atrás apretando la zona de los omóplatos.",
        machineType: "reardelt"
      },
      {
        id: "wa-d2-e6",
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
    title: "Día 3: Tonificación y Balance Completo",
    shortTitle: "Día 3",
    description: "Semana A: Estímulo global. Excelente para vaciar glucógeno antes del fin de semana.",
    exercises: [
      {
        id: "wa-d3-e1",
        name: "Sentadilla Hack en Máquina",
        alternativeName: "Prensa de Piernas (Pies Bajos)",
        target: "Cuádriceps, Glúteos y Gemelos",
        setsCount: 4,
        defaultReps: 10,
        defaultWeight: 50,
        machineBase: 45,
        instructions: "Apoya hombros bajo almohadillas y espalda completa en el respaldo. Baja controlando hasta romper paralelo.",
        machineType: "hacksquat"
      },
      {
        id: "wa-d3-e2",
        name: "Remo en Polea Baja (Agarre Estrecho)",
        alternativeName: "Remo en Máquina de Palancas (Dorsal)",
        target: "Dorsal Ancho y Espalda Media",
        setsCount: 4,
        defaultReps: 12,
        defaultWeight: 40,
        machineBase: 5,
        instructions: "Rodillas semiflexionadas, torso erguido. Tira hacia tu ombligo sin balancear el cuerpo.",
        machineType: "seatedrow"
      },
      {
        id: "wa-d3-e3",
        name: "Press de Pecho Inclinado en Máquina",
        alternativeName: "Press de Pecho Plano en Multipower",
        target: "Pectoral Superior y Hombros",
        setsCount: 3,
        defaultReps: 10,
        defaultWeight: 30,
        machineBase: 10,
        instructions: "Alinea el empuje hacia la zona de la clavícula. Empuja de forma controlada.",
        machineType: "chestpress"
      },
      {
        id: "wa-d3-e4",
        name: "Curl de Bíceps en Banco Predicador (Máquina)",
        alternativeName: "Curl de Bíceps de Pie en Polea Baja",
        target: "Bíceps (Braquial)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 15,
        machineBase: 0,
        instructions: "Apoya axilas and tríceps firmemente en el cojín. Tira controlando con fuerza los bíceps.",
        machineType: "bicepcurl"
      },
      {
        id: "wa-d3-e5",
        name: "Elevación de Talones de Pie (Prensa/Máquina)",
        alternativeName: "Elevación de Gemelos Sentado",
        target: "Gemelos (Gastrocnemio)",
        setsCount: 4,
        defaultReps: 15,
        defaultWeight: 60,
        machineBase: 20,
        instructions: "Apoya metatarsos al borde. Estira lo máximo posible en el fondo y eleva al máximo sosteniendo un segundo.",
        machineType: "calfraise"
      },
      {
        id: "wa-d3-gluteo",
        name: "Prensa con Pies Altos (Énfasis Glúteo)",
        alternativeName: "Empuje de Cadera en Máquina Multipower",
        target: "Glúteos, Femorales y Cuádriceps",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 60,
        machineBase: 40,
        instructions: "Coloca los pies en la parte superior de la plataforma. Baja controlando y empuja concentrando el esfuerzo en los glúteos.",
        machineType: "legpress"
      }
    ]
  }
];

export const ROUTINE_WEEK_B: RoutineDay[] = [
  {
    dayId: 1,
    title: "Día 1: Estimulación Posterior & Empuje Superior",
    shortTitle: "Día 1",
    description: "Semana B: Mayor aislamiento e inclinación enfocada a femorales y glúteos.",
    exercises: [
      {
        id: "wb-d1-e1",
        name: "Prensa con Pies Altos (Énfasis Femoral/Glúteo)",
        alternativeName: "Zancadas en Multipower / Máquina Smith",
        target: "Glúteos, Femorales y Cuádriceps",
        setsCount: 4,
        defaultReps: 12,
        defaultWeight: 70,
        machineBase: 40,
        instructions: "Coloca los pies en la parte superior de la plataforma. Baja controlando para maximizar estiramiento de glúteos.",
        machineType: "legpress"
      },
      {
        id: "wb-d1-e2",
        name: "Press de Pecho Inclinado Convergente",
        alternativeName: "Aperturas Inclinadas en Máquina / Polea",
        target: "Pectoral Mayor Superior y Deltoides",
        setsCount: 4,
        defaultReps: 10,
        defaultWeight: 25,
        machineBase: 10,
        instructions: "Ajusta el asiento para un recorrido natural diagonal hacia arriba. Excelente para delimitar el pecho superior.",
        machineType: "chestpress"
      },
      {
        id: "wb-d1-e3",
        name: "Jalón Dorsal Unilateral en Polea",
        alternativeName: "Remo Unilateral de Pie en Polea Media",
        target: "Dorsal Ancho (Aislamiento Unilateral)",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 20,
        machineBase: 0,
        instructions: "Trabaja un lado a la vez. Tira de la polea alta de rodillas o sentado llevando el codo firmemente al bolsillo lateral.",
        machineType: "pulldown"
      },
      {
        id: "wb-d1-e4",
        name: "Aperturas en Polea para Pecho (Cruce)",
        alternativeName: "Máquina de Aperturas Contractora",
        target: "Pectoral Medio e Inferior",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 15,
        machineBase: 0,
        instructions: "Poleas a altura media. Junta las manos al frente formando un arco, concentrando el bombeo del pecho.",
        machineType: "pecdeck"
      },
      {
        id: "wb-d1-e5",
        name: "Curl de Bíceps en Polea Baja",
        alternativeName: "Curl de Bíceps Concentrado en Máquina",
        target: "Bíceps (Cabeza Corta)",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 15,
        machineBase: 0,
        instructions: "Usa barra recta o barra en W enganchada en polea baja. Mantén codos fijos y realiza flexión completa.",
        machineType: "bicepcurl"
      },
      {
        id: "wb-d1-e6",
        name: "Elevación de Piernas en Silla Romana",
        alternativeName: "Crunch Abdominal en Colchoneta",
        target: "Abdomen Inferior e Iliopsoas",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 0,
        machineBase: 0,
        instructions: "Apoya los antebrazos y espalda. Eleva las rodillas o piernas estiradas enrollando la pelvis hacia arriba.",
        machineType: "captainschair"
      }
    ]
  },
  {
    dayId: 2,
    title: "Día 2: Foco Cuádriceps Unilateral & Tracción Hammer",
    shortTitle: "Día 2",
    description: "Semana B: Excelente trabajo unilateral para corregir desbalances y mantener pulsaciones altas.",
    exercises: [
      {
        id: "wb-d2-e1",
        name: "Extensión de Pierna Unilateral (Una a una)",
        alternativeName: "Zancadas Estáticas en Máquina Multipower",
        target: "Cuádriceps (Énfasis Vasto Medial)",
        setsCount: 4,
        defaultReps: 12,
        defaultWeight: 20,
        machineBase: 0,
        instructions: "Realiza la serie completa con una pierna y luego la otra sin descanso intermedio para elevar gasto.",
        machineType: "legextension"
      },
      {
        id: "wb-d2-e2",
        name: "Remo Hammer Convergente Unilateral",
        alternativeName: "Remo Sentado con un Brazo en Polea Baja",
        target: "Espalda Alta, Dorsal y Trapecios",
        setsCount: 4,
        defaultReps: 10,
        defaultWeight: 25,
        machineBase: 5,
        instructions: "Apoya pecho en la almohadilla. Tira con un brazo a la vez rotando sutilmente el torso al final de la contracción.",
        machineType: "seatedrow"
      },
      {
        id: "wb-d2-e3",
        name: "Contractora Invertida (Pájaros Máquina)",
        alternativeName: "Elevaciones Posteriores Unilaterales en Polea",
        target: "Deltoides Posterior (Hombro de perfil)",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 15,
        machineBase: 0,
        instructions: "Siéntate de frente al respaldo. Abre los brazos manteniendo codos altos para aislar el hombro posterior.",
        machineType: "reardelt"
      },
      {
        id: "wb-d2-e4",
        name: "Press de Hombro Convergente Articulado",
        alternativeName: "Elevaciones de Hombros de Pie en Polea Baja",
        target: "Deltoides Anterior y Tríceps",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 15,
        machineBase: 5,
        instructions: "Ajusta para que la empuñadura quede al nivel del mentón. Empuja de forma controlada.",
        machineType: "shoulderpress"
      },
      {
        id: "wb-d2-e5",
        name: "Extensión de Tríceps por Encima de la Cabeza",
        alternativeName: "Patada de Tríceps con Cuerda en Polea Media",
        target: "Tríceps (Cabeza Larga)",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 15,
        machineBase: 0,
        instructions: "De espaldas a la polea alta o media. Sujeta la cuerda y extiende hacia el frente por encima de tu cabeza.",
        machineType: "tricepspushdown"
      },
      {
        id: "wb-d2-e6",
        name: "Oblicuos en Polea Media (Leñador)",
        alternativeName: "Plancha Lateral con Rotación en Colchoneta",
        target: "Core, Oblicuos y Transverso",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 15,
        machineBase: 0,
        instructions: "Tira de la polea horizontalmente cruzando el torso. Mantén brazos rectos y gira con el abdomen.",
        machineType: "pulldown"
      }
    ]
  },
  {
    dayId: 3,
    title: "Día 3: Vaciamiento y Esculpido Corporal Global",
    shortTitle: "Día 3",
    description: "Semana B: Trabajo global enfocado en máxima tensión muscular para optimizar el cardio de 30m final.",
    exercises: [
      {
        id: "wb-d3-e1",
        name: "Sentadilla en Máquina Smith",
        alternativeName: "Sentadilla de Copa con Mancuerna / Prensa Inclinada",
        target: "Cuádriceps, Glúteos y Femorales",
        setsCount: 4,
        defaultReps: 12,
        defaultWeight: 40,
        machineBase: 20,
        instructions: "Coloca pies ligeramente adelantados para proteger rodillas. Baja lento y firme sintiendo el empuje.",
        machineType: "hacksquat"
      },
      {
        id: "wb-d3-e2",
        name: "Jalón Dorsal con Agarre Cerrado Supino",
        alternativeName: "Remo T-Bar con Soporte de Pecho",
        target: "Dorsal Inferior y Bíceps",
        setsCount: 4,
        defaultReps: 12,
        defaultWeight: 40,
        machineBase: 5,
        instructions: "Manos mirando hacia ti (supino). Tira hacia abajo enfocando la contracción de la parte baja de la espalda.",
        machineType: "pulldown"
      },
      {
        id: "wb-d3-e3",
        name: "Pec Deck Fly (Contractora de Pecho)",
        alternativeName: "Press de Pecho Sentado (Agarre Estrecho)",
        target: "Pectoral Mayor",
        setsCount: 3,
        defaultReps: 12,
        defaultWeight: 25,
        machineBase: 0,
        instructions: "Abre los brazos de forma amplia y junta al frente. Mantén tensión constante en todo el rango.",
        machineType: "pecdeck"
      },
      {
        id: "wb-d3-e4",
        name: "Curl de Femorales Tumbado",
        alternativeName: "Peso Muerto Rumano en Máquina Smith",
        target: "Isquiotibiales (Zona Posterior)",
        setsCount: 3,
        defaultReps: 15,
        defaultWeight: 30,
        machineBase: 0,
        instructions: "Túmbate boca abajo. Flexiona llevando rodillos hacia el glúteo y frena la bajada de forma estricta.",
        machineType: "legcurl"
      },
      {
        id: "wb-d3-e5",
        name: "Elevación de Gemelos Sentado",
        alternativeName: "Elevación de Talones de Pie en Prensa",
        target: "Sóleo (Gemelo Inferior)",
        setsCount: 4,
        defaultReps: 15,
        defaultWeight: 30,
        machineBase: 15,
        instructions: "Apoya los soportes en las rodillas. Baja talones por debajo de la plataforma y eleva con potencia.",
        machineType: "calfraise"
      },
      {
        id: "wb-d3-e6",
        name: "Plancha Abdominal Estática (con apoyo)",
        alternativeName: "Crunch Abdominal Controlado en Polea Alta",
        target: "Abdomen Profundo, Core",
        setsCount: 3,
        defaultReps: 45,
        defaultWeight: 0,
        machineBase: 0,
        instructions: "Apoya antebrazos en el banco acolchado o colchoneta. Mantén cuerpo recto y abdomen contraído.",
        machineType: "plank"
      }
    ]
  }
];
