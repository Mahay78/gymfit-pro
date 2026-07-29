export type Language = 'es' | 'en';

export const translations = {
  es: {
    'app.title': 'GymFit Pro',
    'nav.rutinas': 'Rutinas',
    'nav.entrenar': 'Entrenar',
    'nav.nutricion': 'Nutrición',
    'nav.progreso': 'Progreso',
    'nav.ajustes': 'Ajustes',
    'routine.start': 'Iniciar Rutina',
    'routine.continue': 'Continuar Entrenamiento',
    'workout.warmup': 'Calentamiento',
    'workout.lifting': 'Fuerza',
    'workout.cardio': 'Cardio',
    'workout.complete': '¡Entrenamiento Completado!',
    'progress.streak': 'Racha',
    'progress.goal': 'Objetivo',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
  },
  en: {
    'app.title': 'GymFit Pro',
    'nav.rutinas': 'Routines',
    'nav.entrenar': 'Train',
    'nav.nutricion': 'Nutrition',
    'nav.progreso': 'Progress',
    'nav.ajustes': 'Settings',
    'routine.start': 'Start Routine',
    'routine.continue': 'Continue Workout',
    'workout.warmup': 'Warmup',
    'workout.lifting': 'Lifting',
    'workout.cardio': 'Cardio',
    'workout.complete': 'Workout Complete!',
    'progress.streak': 'Streak',
    'progress.goal': 'Goal',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
  },
} as const;

export function t(lang: Language, key: keyof typeof translations.es): string {
  return translations[lang][key] || translations.es[key] || key;
}
