const fs = require('node:fs/promises');
const path = require('node:path');

const BACKUP_FORMAT = 'aquastoich-backup';
const BACKUP_SCHEMA_VERSION = 1;
const SUPPORTED_LOCALES = new Set(['en', 'ru', 'de', 'es']);
const SUPPORTED_THEMES = new Set(['light', 'dark', 'colorblind']);

function backupExportDirectory(argv) {
  const prefix = '--export-backup-dir=';
  const argument = argv.find(value => value.startsWith(prefix));
  if (!argument) return null;
  const directory = argument.slice(prefix.length).trim();
  return directory ? path.resolve(directory) : null;
}

function backupDocument({ stateText, locale, theme, applicationVersion, createdAt = new Date().toISOString() }) {
  if (!stateText) throw new Error('No saved AquaStoich data was found');
  let state;
  try {
    state = JSON.parse(stateText);
  } catch {
    throw new Error('Saved AquaStoich data is not valid JSON');
  }
  if (!state || typeof state !== 'object' || Array.isArray(state)
    || !Array.isArray(state.aquariums) || !Array.isArray(state.journal)
    || !Array.isArray(state.rows)) {
    throw new Error('Saved AquaStoich data is incomplete');
  }
  return {
    format: BACKUP_FORMAT,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    applicationVersion,
    createdAt,
    locale: SUPPORTED_LOCALES.has(locale) ? locale : 'en',
    theme: SUPPORTED_THEMES.has(theme) ? theme : 'light',
    state,
  };
}

function backupBaseName(date = new Date()) {
  const stamp = date.toISOString().replace(/\.\d{3}Z$/, 'Z').replaceAll(':', '');
  return `AquaStoich-backup-before-uninstall-${stamp}.json`;
}

async function writeUniqueBackup(directory, document, date = new Date()) {
  await fs.mkdir(directory, { recursive: true });
  const original = backupBaseName(date);
  const extension = path.extname(original);
  const stem = original.slice(0, -extension.length);
  for (let suffix = 0; suffix < 1000; suffix += 1) {
    const fileName = suffix === 0 ? original : `${stem}-${suffix + 1}${extension}`;
    const destination = path.join(directory, fileName);
    try {
      await fs.writeFile(destination, `${JSON.stringify(document, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
      return destination;
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error;
    }
  }
  throw new Error('Unable to create a unique backup filename');
}

module.exports = { backupExportDirectory, backupDocument, backupBaseName, writeUniqueBackup };
