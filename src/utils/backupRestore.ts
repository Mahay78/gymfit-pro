import { db } from './db';
import type { HistoryItem, BodyMeasurement, CardioSession, UserProfile } from '../types';

export interface DatabaseBackup {
  version: number;
  exportedAt: string;
  app: 'GymFitPro';
  data: {
    history: HistoryItem[];
    customWeights: { id: string; weight: number }[];
    bodyMeasurements: BodyMeasurement[];
    cardioSessions: CardioSession[];
    userProfile: UserProfile[];
    routineOverrides: { key: string; value: any }[];
  };
}

export async function exportDatabaseToJson(): Promise<string> {
  const [history, customWeights, bodyMeasurements, cardioSessions, userProfile, routineOverrides] =
    await Promise.all([
      db.history.toArray(),
      db.customWeights.toArray(),
      db.bodyMeasurements.toArray(),
      db.cardioSessions.toArray(),
      db.userProfile.toArray(),
      db.routineOverrides.toArray(),
    ]);

  const backup: DatabaseBackup = {
    version: 2,
    exportedAt: new Date().toISOString(),
    app: 'GymFitPro',
    data: {
      history,
      customWeights,
      bodyMeasurements,
      cardioSessions,
      userProfile,
      routineOverrides,
    },
  };

  const jsonString = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gymfit_pro_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);

  return jsonString;
}

export async function importDatabaseFromJson(jsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || parsed.app !== 'GymFitPro' || !parsed.data) {
      return { success: false, message: 'Archivo de respaldo inválido o incompatible.' };
    }

    const { history, customWeights, bodyMeasurements, cardioSessions, userProfile, routineOverrides } = parsed.data;

    await db.transaction('rw', [db.history, db.customWeights, db.bodyMeasurements, db.cardioSessions, db.userProfile, db.routineOverrides], async () => {
      await Promise.all([
        db.history.clear(),
        db.customWeights.clear(),
        db.bodyMeasurements.clear(),
        db.cardioSessions.clear(),
        db.userProfile.clear(),
        db.routineOverrides.clear(),
      ]);

      if (Array.isArray(history) && history.length > 0) await db.history.bulkAdd(history);
      if (Array.isArray(customWeights) && customWeights.length > 0) await db.customWeights.bulkAdd(customWeights);
      if (Array.isArray(bodyMeasurements) && bodyMeasurements.length > 0) await db.bodyMeasurements.bulkAdd(bodyMeasurements);
      if (Array.isArray(cardioSessions) && cardioSessions.length > 0) await db.cardioSessions.bulkAdd(cardioSessions);
      if (Array.isArray(userProfile) && userProfile.length > 0) await db.userProfile.bulkAdd(userProfile);
      if (Array.isArray(routineOverrides) && routineOverrides.length > 0) await db.routineOverrides.bulkAdd(routineOverrides);
    });

    return { success: true, message: '¡Datos restaurados correctamente!' };
  } catch (err: any) {
    return { success: false, message: `Error al restaurar: ${err?.message || 'Error desconocido'}` };
  }
}

export async function exportHistoryToCsv(): Promise<string> {
  const history = await db.history.orderBy('id').reverse().toArray();
  if (!history || history.length === 0) {
    throw new Error('No hay entrenamientos en el historial para exportar.');
  }

  const rows: string[] = [
    'Fecha,Rutina,Duracion,Volumen Total (kg),Ejercicios Completados,Peso Corporal (kg),Cardio',
  ];

  history.forEach(h => {
    const cardio = h.cardioCompleted ? 'Si' : 'No';
    const dayTitleClean = `"${(h.dayTitle || '').replace(/"/g, '""')}"`;
    rows.push(`${h.date},${dayTitleClean},${h.duration},${h.totalVolume},${h.completedExercises},${h.weight},${cardio}`);
  });

  const csvContent = rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gymfit_pro_historial_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  return csvContent;
}
