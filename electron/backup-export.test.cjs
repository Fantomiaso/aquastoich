const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { backupExportDirectory, backupDocument, backupBaseName, writeUniqueBackup } = require('./backup-export.cjs');

const state = { aquariums: [{ id: 'tank-1' }], journal: [{ id: 'reading-1' }], rows: [] };

test('uninstaller backup argument supports paths with spaces', () => {
  const value = backupExportDirectory(['AquaStoich.exe', '--export-backup-dir=C:\\Users\\Test User\\Documents\\AquaStoich Backups']);
  assert.equal(value, path.resolve('C:\\Users\\Test User\\Documents\\AquaStoich Backups'));
});

test('uninstaller backup document preserves complete local state', () => {
  const result = backupDocument({
    stateText: JSON.stringify(state), locale: 'ru', theme: 'dark', applicationVersion: '0.1.3-alpha.1',
    createdAt: '2026-10-05T12:34:56.000Z',
  });
  assert.equal(result.format, 'aquastoich-backup');
  assert.equal(result.schemaVersion, 1);
  assert.deepEqual(result.state, state);
  assert.equal(result.locale, 'ru');
  assert.equal(result.theme, 'dark');
});

test('uninstaller backup refuses missing or incomplete saved data', () => {
  assert.throws(() => backupDocument({ stateText: null }));
  assert.throws(() => backupDocument({ stateText: '{}' }));
});

test('uninstaller backup never overwrites an earlier file', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'aquastoich-backup-test-'));
  try {
    const date = new Date('2026-10-05T12:34:56.000Z');
    assert.equal(backupBaseName(date), 'AquaStoich-backup-before-uninstall-2026-10-05T123456Z.json');
    const document = backupDocument({ stateText: JSON.stringify(state), applicationVersion: 'test' });
    const first = await writeUniqueBackup(directory, document, date);
    const second = await writeUniqueBackup(directory, document, date);
    assert.notEqual(first, second);
    assert.deepEqual(JSON.parse(await fs.readFile(first, 'utf8')).state, state);
    assert.deepEqual(JSON.parse(await fs.readFile(second, 'utf8')).state, state);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
