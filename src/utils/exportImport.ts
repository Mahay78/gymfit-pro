const EXPORT_KEYS = [
  'gymfit_pro_customWeights',
  'gymfit_pro_history_v2',
  'gymfit_pro_measurements',
  'gymfit_pro_dailyWater',
  'gymfit_pro_dailyProtein',
  'gymfit_pro_cardioSessions',
  'gymfit_pro_userWeight',
];

export function exportData(): string {
  const data: Record<string, unknown> = {
    app: 'GymFit Pro',
    version: '1.0',
    exportedAt: new Date().toISOString(),
  };
  for (const key of EXPORT_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) data[key] = JSON.parse(raw);
    } catch { /* ignore */ }
  }
  return JSON.stringify(data, null, 2);
}

export function downloadExport(): void {
  const json = exportData();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gymfit-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importData(json: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const data = JSON.parse(json);
    if (data.app !== 'GymFit Pro') {
      return { ok: false, error: 'El archivo no es un backup de GymFit Pro' };
    }
    let imported = 0;
    for (const key of EXPORT_KEYS) {
      if (key in data) {
        localStorage.setItem(key, JSON.stringify(data[key]));
        imported++;
      }
    }
    return { ok: true, error: `Importados ${imported} registros. Recarga la página.` };
  } catch (e) {
    return { ok: false, error: 'JSON inválido: ' + (e as Error).message };
  }
}
