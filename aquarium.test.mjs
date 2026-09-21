import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateAquariumVolume } from './aquarium.mjs';
import { JOURNAL_TESTS, journalComparison, journalComponents, journalDifference, journalEntriesInPeriod, journalPeriodBounds, journalSeries } from './journal.mjs';
import { journalTable, journalXlsx } from './journal-export.mjs';
import { MAX_LIGHT_CHANNELS, validLightChannels } from './light-channels.mjs';

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

test('journal chart filters standard and manual periods chronologically', () => {
  const entries = [
    { id: 'old', at: '2026-08-01T12:00', location: 'aquarium', values: { GH: 4 } },
    { id: 'source', at: '2026-09-19T12:00', location: 'source', values: { GH: 2 } },
    { id: 'new', at: '2026-09-20T12:00', location: 'aquarium', values: { GH: 6 } },
    { id: 'middle', at: '2026-09-18T12:00', location: 'aquarium', values: { GH: 5 } },
  ];
  const week = journalSeries(entries, { testId: 'GH', period: 'week', location: 'aquarium', now: new Date('2026-09-21T12:00') });
  assert.deepEqual(week.map(entry => entry.id), ['middle', 'new']);
  const manual = journalSeries(entries, { testId: 'GH', period: 'manual', location: 'aquarium', from: '2026-08-01', to: '2026-09-18' });
  assert.deepEqual(manual.map(entry => entry.id), ['old', 'middle']);
  assert.deepEqual(journalEntriesInPeriod(entries, { period: 'week', location: 'aquarium', now: new Date('2026-09-21T12:00') })
    .map(entry => entry.id), ['middle', 'new']);
  assert.equal(journalPeriodBounds('manual', new Date(), '2026-09-20', '2026-09-19'), null);
});

test('chart comparison and complex-parameter components use the selected readings', () => {
  const first = { at: '2026-09-18T12:00', values: { GH: 5, Ca: 30, Mg: 6 } };
  const second = { at: '2026-09-20T12:00', values: { GH: 6, Ca: 35, Mg: 7 } };
  assert.deepEqual(journalComponents(first, 'GH'), [{ id: 'Ca', value: 30 }, { id: 'Mg', value: 6 }]);
  assert.deepEqual(journalComparison(first, second, 'GH'), { firstValue: 5, secondValue: 6, delta: 1, days: 2, perDay: 0.5 });
  assert.equal(journalComparison(second, first, 'GH'), null);
  assert.equal(journalComparison(first, null, 'GH'), null);
});

test('TDS readings are available in the journal and exported to Excel', () => {
  const testDefinition = JOURNAL_TESTS.find(item => item.id === 'TDS');
  assert.equal(testDefinition.unit, 'ppm');
  const entries = [{ at: '2026-09-16T12:00', location: 'aquarium', values: { TDS: 142 }, notes: { TDS: 'meter scale 0.5' } }];
  const table = journalTable(entries, JOURNAL_TESTS, 'Tank 1');
  assert.ok(table.headers.includes('TDS (ppm)'));
  assert.ok(table.rows[0].includes(142));
  assert.ok(new TextDecoder().decode(journalXlsx(entries, JOURNAL_TESTS, 'Tank 1')).includes('meter scale 0.5'));
});

test('Excel export includes measurement notes and lighting as separate columns', () => {
  const entries = [{ at: '2026-09-16T12:00', location: 'aquarium', note: 'change',
    values: { NO3: 8 }, notes: { NO3: 'after feeding' },
    light: { fixture: 'LED 100', powerW: 30, intensityPercent: 70, durationHours: 8,
      channels: [{ id: 'red', value: 75 }, { id: 'custom:plant', name: 'Plant', value: 40 }] } }];
  const table = journalTable(entries, [{ id: 'NO3', label: 'NO₃', unit: 'mg/L' }], 'Tank 1');
  assert.ok(table.headers.includes('NO₃ note'));
  assert.ok(table.headers.includes('Channel 2 (%)'));
  assert.ok(table.rows[0].includes('after feeding'));
  assert.ok(table.rows[0].includes(30));
  assert.ok(table.rows[0].includes('Red'));
  assert.ok(table.rows[0].includes('Plant'));
  assert.ok(table.rows[0].includes(75));
  const bytes = journalXlsx(entries, [{ id: 'NO3', label: 'NO₃', unit: 'mg/L' }], 'Tank 1');
  assert.equal(new DataView(bytes.buffer).getUint32(0, true), 0x04034b50);
  assert.equal(new DataView(bytes.buffer).getUint32(bytes.length - 22, true), 0x06054b50);
  assert.ok(new TextDecoder().decode(bytes).includes('after feeding'));
});

test('lighting starts without channels and accepts at most eight valid unique channels', () => {
  assert.equal(validLightChannels([]), true);
  const channels = Array.from({ length: MAX_LIGHT_CHANNELS }, (_, index) => ({ id: `custom:${index}`, name: `Channel ${index}`, value: index * 10 }));
  assert.equal(validLightChannels(channels), true);
  assert.equal(validLightChannels([...channels, { id: 'red', value: 50 }]), false);
  assert.equal(validLightChannels([{ id: 'red', value: 50 }, { id: 'red', value: 30 }]), false);
  assert.equal(validLightChannels([{ id: 'blue', value: '' }]), false);
  assert.equal(validLightChannels([{ id: 'blue', value: 101 }]), false);
});
