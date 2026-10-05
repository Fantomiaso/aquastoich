import test from 'node:test';
import assert from 'node:assert/strict';
import { BACKUP_FORMAT, backupFileName, makeBackup, parseBackup } from './storage-backup.mjs';

const state = { aquariums: [{ id: 'tank-1', name: 'Tank' }], journal: [{ id: 'm-1', values: { GH: 6 } }], rows: [] };

test('full local backup preserves aquarium profiles and journal', () => {
  const backup = makeBackup({ state, locale: 'ru', theme: 'dark', createdAt: '2026-10-05T10:00:00.000Z' });
  const restored = parseBackup(JSON.stringify(backup));
  assert.equal(restored.format, BACKUP_FORMAT);
  assert.equal(restored.locale, 'ru');
  assert.equal(restored.theme, 'dark');
  assert.deepEqual(restored.state, state);
});

test('backup import rejects unrelated and incomplete JSON', () => {
  assert.throws(() => parseBackup('{broken'));
  assert.throws(() => parseBackup(JSON.stringify({ format: BACKUP_FORMAT, schemaVersion: 1, state: {} })));
});

test('backup filename is stable and contains the date', () => {
  assert.equal(backupFileName(new Date('2026-10-05T23:59:00Z')), 'AquaStoich-backup-2026-10-05.json');
});
