export const BACKUP_FORMAT = 'aquastoich-backup';
export const BACKUP_SCHEMA_VERSION = 1;

export function makeBackup({ state, locale = 'en', theme = 'light', createdAt = new Date().toISOString() }) {
  if (!state || typeof state !== 'object' || Array.isArray(state)) throw new Error('Invalid application state');
  return {
    format: BACKUP_FORMAT,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    applicationVersion: '0.1.3a',
    createdAt,
    locale,
    theme,
    state,
  };
}

export function parseBackup(text) {
  let backup;
  try { backup = JSON.parse(text); } catch { throw new Error('Backup file is not valid JSON'); }
  if (!backup || backup.format !== BACKUP_FORMAT || backup.schemaVersion !== BACKUP_SCHEMA_VERSION) {
    throw new Error('Unsupported AquaStoich backup format');
  }
  if (!backup.state || typeof backup.state !== 'object' || Array.isArray(backup.state)
    || !Array.isArray(backup.state.aquariums) || !Array.isArray(backup.state.journal)
    || !Array.isArray(backup.state.rows)) throw new Error('Backup does not contain complete AquaStoich data');
  const locale = ['en', 'ru', 'de', 'es'].includes(backup.locale) ? backup.locale : 'en';
  const theme = ['light', 'dark', 'colorblind'].includes(backup.theme) ? backup.theme : 'light';
  return { ...backup, locale, theme };
}

export function backupFileName(date = new Date()) {
  const stamp = date.toISOString().slice(0, 10);
  return `AquaStoich-backup-${stamp}.json`;
}
