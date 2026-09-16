import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateAquariumVolume } from './aquarium.mjs';
import { journalDifference } from './journal.mjs';
import { journalTable, journalXlsx } from './journal-export.mjs';

test('working volume subtracts glass, average substrate and top gap', () => {
  assert.equal(estimateAquariumVolume({ shape: 'rect', lengthCm: 100, widthCm: 40, heightCm: 50,
    glassMm: 10, substrateCm: 5, topGapCm: 2 }), 156.408);
  const cylinder = estimateAquariumVolume({ shape: 'cylinder', diameterCm: 50, heightCm: 50,
    glassMm: 5, substrateCm: 3, topGapCm: 2 });
  assert.ok(Math.abs(cylinder - Math.PI * 24.5 ** 2 * 44.5 / 1000) < 1e-9);
  assert.equal(estimateAquariumVolume({ lengthCm: 40, widthCm: 20, heightCm: 10,
    glassMm: 8, substrateCm: 8, topGapCm: 2 }), null);
});

test('journal differences never cross aquarium profiles', () => {
  const entries = [
    { id: 'a', aquariumId: 'tank-a', at: '2026-09-14T12:00', location: 'aquarium', values: { NO3: 10 } },
    { id: 'b', aquariumId: 'tank-b', at: '2026-09-15T12:00', location: 'aquarium', values: { NO3: 100 } },
    { id: 'c', aquariumId: 'tank-a', at: '2026-09-16T12:00', location: 'aquarium', values: { NO3: 6 } }
  ];
  assert.equal(journalDifference(entries, entries[2], 'NO3').previous.id, 'a');
});

test('Excel export includes measurement notes and lighting as separate columns', () => {
  const entries = [{ at: '2026-09-16T12:00', location: 'aquarium', note: 'change',
    values: { NO3: 8 }, notes: { NO3: 'after feeding' },
    light: { fixture: 'LED 100', powerW: 30, intensityPercent: 70, durationHours: 8 } }];
  const table = journalTable(entries, [{ id: 'NO3', label: 'NO₃', unit: 'mg/L' }], 'Tank 1');
  assert.ok(table.headers.includes('NO₃ note'));
  assert.ok(table.rows[0].includes('after feeding'));
  assert.ok(table.rows[0].includes(30));
  const bytes = journalXlsx(entries, [{ id: 'NO3', label: 'NO₃', unit: 'mg/L' }], 'Tank 1');
  assert.equal(new DataView(bytes.buffer).getUint32(0, true), 0x04034b50);
  assert.equal(new DataView(bytes.buffer).getUint32(bytes.length - 22, true), 0x06054b50);
  assert.ok(new TextDecoder().decode(bytes).includes('after feeding'));
});
