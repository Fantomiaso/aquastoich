import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate, calibratePHCO2, setCustomProducts, PRODUCT_BY_ID, PRODUCTS, productComposition, solveTargets } from './chemistry.mjs';
import { parseSaltFormula, customProductFromForm, effectParts, productEffects } from './catalog.mjs';
import { getPresets, mergePresets, normalizeUserPreset } from './presets.mjs';
import { journalDifference } from './journal.mjs';

const near = (actual, expected, tolerance = 1e-3) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≠ ${expected}`);
const row = (id, dose, extra = {}) => ({ id, dose, enabled: true, mode: 'manual', doseMode: 'dry', purity: 100, ...extra });
const base = rows => ({ mode: 'prepare', volume: 20, sourceGH: 0, sourceKH: 0, sourcePH: '', source: {}, phCO2: 5, targets: {}, rows });

test('effect direction is separate from ionic charge', () => {
  assert.deepEqual(effectParts('Ca'), { label: 'Ca²⁺', action: '+' });
  assert.deepEqual(effectParts('NO3-'), { label: 'NO₃⁻', action: '−' });
  assert.deepEqual(effectParts('PO4'), { label: 'PO₄ (Σ)', action: '+' });
});

test('подмена смешивает аквариум и приготовленную воду по объёмам', () => {
  const input = { ...base([]), mode: 'change', tankVolume: 100, tankGH: 10, tankKH: 4, tank: { Ca: 40, NO3: 20 }, sourceGH: 2, sourceKH: 1, source: { Ca: 5, NO3: 0 } };
  const result = calculate(input);
  near(result.gh, 8.4);
  near(result.kh, 3.4);
  near(result.ions.Ca, 33);
  near(result.ions.NO3, 16);
  near(result.prepared.gh, 2);
  near(result.share, 0.2);
});

test('доза в подмене рассчитывается на объём порции, цель задаётся для аквариума', () => {
  const input = { ...base([row('mgso4', 0, { mode: 'auto', variant: 'hepta' })]), mode: 'change', tankVolume: 100,
    tankGH: 6, tankKH: 2, tank: { Mg: 5 }, targets: { Mg: 6 } };
  const solved = solveTargets(input);
  assert.equal(solved.warning, '');
  near(calculate(solved.state).ions.Mg, 6, 0.01);
  assert.ok(solved.state.rows[0].dose > 0);
  near(calculate(solved.state).prepared.ions.Mg, 10, 0.01);
});

test('зафиксированная доза остаётся прежней при новом подборе', () => {
  const input = { ...base([row('mgso4', 1, { mode: 'auto', locked: true, variant: 'hepta' }), row('watersci-gh', 0, { mode: 'auto' })]), targets: { GH: 5 } };
  const solved = solveTargets(input);
  near(solved.state.rows[0].dose, 1);
  near(calculate(solved.state).gh, 5, 0.01);
});

test('калибровка по измеренному pH воспроизводит замер', () => {
  const input = { ...base([row('nahco3', 3)]), volume: 10 };
  const result = calculate(input);
  const co2 = calibratePHCO2(result, 7.6);
  assert.ok(co2 > 0);
  near(calculate({ ...input, phCO2: co2 }).ph, 7.6, 1e-6);
  assert.equal(calibratePHCO2(result, 12), null);
});

test('формулы гидратов и пользовательские вещества определяют ионы и эффекты', () => {
  const hydrated = parseSaltFormula('Ca(NO₃)₂·4H₂O');
  near(hydrated.molarMass, 236.15, 0.02);
  assert.deepEqual(hydrated.ions, { Ca: 1, NO3: 2 });
  const product = customProductFromForm({ kind: 'substance', name: 'Сульфат калия', formula: 'K2SO4', solubility: 110 });
  assert.ok(productEffects(product).includes('K'));
  assert.ok(productEffects(product).includes('SO4'));
  assert.ok(productEffects(product).includes('macro'));
  setCustomProducts([product]);
  const result = calculate(base([row(product.id, 1)]));
  assert.ok(result.ions.K > 0 && result.ions.SO4 > 0);
  near(result.balance.unaccounted, 0, 1e-5);
  setCustomProducts([]);
  assert.equal(PRODUCT_BY_ID[product.id], undefined);
});

test('смесь из формул и ручной состав требуют растворимости', () => {
  const mix = customProductFromForm({ kind: 'liquid-mixture', name: 'Мой макрораствор', solubility: 300,
    components: [{ formula: 'KNO3', amount: 50 }, { formula: 'KH2PO4', amount: 5 }] });
  assert.ok(mix.composition.NO3 > mix.composition.PO4);
  assert.throws(() => customProductFromForm({ kind: 'substance', name: 'Новая соль', formula: 'KNO3' }), /растворимость/);
  const manual = customProductFromForm({ kind: 'liquid-mixture', name: 'Микро', solubility: 100,
    components: [{ formula: 'Fe-DTPA', amount: 10 }], manualComposition: 'Fe=7; Mn=1.3' });
  near(manual.composition.Fe, 7);
  assert.equal(manual.unknownCounterions, true);
});

test('несколько сухих форм имеют свои составы и растворимости', () => {
  near(parseSaltFormula('MgSO4·H2O').molarMass, 138.38, 0.03);
  const product = customProductFromForm({ kind: 'substance', name: 'Сульфат магния',
    forms: [{ formula: 'MgSO4', solubility: 350 }, { formula: 'MgSO4·7H2O', solubility: 710 }] });
  assert.equal(product.variants.length, 2);
  assert.equal(product.variants[0].solubilityGPerL, 350);
  assert.equal(product.variants[1].solubilityGPerL, 710);
  assert.ok(productComposition(product, 'form-1').Mg > productComposition(product, 'form-2').Mg);
  setCustomProducts([product]);
  const anhydrous = calculate(base([row(product.id, 1, { variant: 'form-1' })]));
  const hydrated = calculate(base([row(product.id, 1, { variant: 'form-2' })]));
  assert.ok(anhydrous.ions.Mg > hydrated.ions.Mg);
  near(anhydrous.balance.unaccounted, 0, 1e-5);
  near(hydrated.balance.unaccounted, 0, 1e-5);
  assert.throws(() => customProductFromForm({ kind: 'substance', name: 'Смесь',
    forms: [{ formula: 'MgSO4', solubility: 350 }, { formula: 'KNO3', solubility: 300 }] }), /одинаковую основную формулу/);
  setCustomProducts([]);
});

test('расширенная база содержит солевые формы и проверенные готовые составы', () => {
  assert.ok(PRODUCTS.length >= 45);
  const chloride = PRODUCT_BY_ID.mgcl2;
  assert.equal(chloride.variants.length, 2);
  near(calculate(base([row('mgcl2', 1, { variant: 'hexahydrate' })])).balance.unaccounted, 0, 1e-5);
  near(PRODUCT_BY_ID['aquayer-nitrate'].composition.NO3, 72);
  near(PRODUCT_BY_ID['dennerle-npk'].composition.PO4, 4);
  near(PRODUCT_BY_ID['seachem-equilibrium'].composition.Ca, 80.6);
});

test('несколько пресетов пересекаются или предупреждают о несовместимости', () => {
  const compatible = mergePresets(['slow-planted', 'co2-planted']);
  assert.equal(compatible.conflicts.length, 0);
  assert.deepEqual(compatible.targets.find(item => item.id === 'GH'), { id: 'GH', target: 6, min: 4, max: 8 });
  assert.deepEqual(compatible.targets.find(item => item.id === 'NO3'), { id: 'NO3', target: 11.5, min: 10, max: 15 });
  const nutrient = compatible.ratios.find(ratio => ratio.numerator === 'NO3');
  near(nutrient.min, 12);
  near(nutrient.max, 15);
  const incompatible = mergePresets(['snails', 'softwater']);
  assert.ok(incompatible.conflicts.some(item => item.includes('Ca:Mg')));
  const ratioConflict = incompatible.conflicts.find(item => item.includes('Ca:Mg'));
  assert.ok(ratioConflict.includes('нижняя граница 4:1'));
  assert.ok(ratioConflict.includes('верхней 3:1'));
  assert.ok(incompatible.conflicts.some(item => item.includes('GH:') && item.includes('Диапазоны не пересекаются')));
});

test('пользовательский пресет объединяет цели и пропорции с выбранным встроенным', () => {
  const custom = normalizeUserPreset({ id: 'user-my-plant', name: 'My planted tank', targets: { GH: [7, 5, 9], NO3: [12, 10, 20] },
    ratios: [{ pair: 'NO3:PO4', target: 12, min: 10, max: 16 }] });
  const merged = mergePresets(['community', custom.id], 'en', [custom]);
  assert.equal(merged.conflicts.length, 0);
  assert.deepEqual(merged.targets.find(item => item.id === 'GH'), { id: 'GH', target: 7, min: 5, max: 9 });
  assert.deepEqual(merged.targets.find(item => item.id === 'NO3'), { id: 'NO3', target: 11, min: 10, max: 20 });
  assert.equal(merged.ratios.find(item => item.numerator === 'NO3').target, 12);
  assert.equal(getPresets([custom]).at(-1).name, 'My planted tank');
});

test('встроенный пресет редактируется через локальное переопределение и восстанавливается', () => {
  const edited = normalizeUserPreset({ id: 'community', name: 'Общий пресноводный', targets: { GH: [8, 7, 9] }, ratios: [] });
  assert.equal(getPresets([edited]).find(item => item.id === 'community').edited, true);
  assert.equal(mergePresets(['community'], 'ru', [edited]).targets.find(item => item.id === 'GH').target, 8);
  assert.equal(mergePresets(['community']).targets.find(item => item.id === 'GH').target, 7);
});

test('редактор отвергает пустые, ошибочные и противоречивые границы', () => {
  const preset = { id: 'user-check', name: 'Check', targets: {}, ratios: [] };
  assert.throws(() => normalizeUserPreset(preset), /preset-empty/);
  assert.throws(() => normalizeUserPreset({ ...preset, targets: { GH: [10, 2, 8] } }), /preset-bounds/);
  assert.throws(() => normalizeUserPreset({ ...preset, targets: { GH: ['abc', '', ''] } }), /preset-number/);
  assert.throws(() => normalizeUserPreset({ ...preset, ratios: [{ pair: 'Ca:Ca', target: 3, min: '', max: '' }] }), /preset-pair/);
});

test('несовместимые точные цели дают предупреждение с именами пресетов', () => {
  const first = normalizeUserPreset({ id: 'user-first', name: 'First', targets: { GH: [5, '', ''] }, ratios: [{ pair: 'Ca:Mg', target: 3, min: '', max: '' }] });
  const second = normalizeUserPreset({ id: 'user-second', name: 'Second', targets: { GH: [7, '', ''] }, ratios: [{ pair: 'Ca:Mg', target: 5, min: '', max: '' }] });
  const merged = mergePresets([first.id, second.id], 'en', [first, second]);
  assert.equal(merged.conflicts.length, 2);
  assert.ok(merged.conflicts.every(item => item.includes('First') && item.includes('Second')));
  assert.equal(merged.targets.length, 0);
  assert.equal(merged.ratios.length, 0);
});

test('журнал считает разницу и скорость в сутки только для той же воды и теста', () => {
  const entries = [
    { id: 'a', at: '2026-09-14T12:00', location: 'aquarium', values: { NO3: 10 } },
    { id: 'b', at: '2026-09-15T12:00', location: 'source', values: { NO3: 2 } },
    { id: 'c', at: '2026-09-16T12:00', location: 'aquarium', values: { NO3: 6 } },
  ];
  const diff = journalDifference(entries, entries[2], 'NO3');
  near(diff.delta, -4);
  near(diff.absolute, 4);
  near(diff.perDay, -2);
  assert.equal(diff.previous.id, 'a');
});
