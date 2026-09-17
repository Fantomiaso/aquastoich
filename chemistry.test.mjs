import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCT_BY_ID, productComposition, calculate, solveTargets, stockGramsPerL, actualRatio, ratioLimits, ratioSatisfied, targetLimits, invertRatio } from './chemistry.mjs';

const close = (actual, expected, tolerance = 1e-3) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≠ ${expected}`);
const row = (id, dose, extra = {}) => ({ id, enabled: true, mode: 'manual', dose, doseMode: 'dry', purity: 100, ...extra });
const state = rows => ({ volume: 100, sourceGH: 0, sourceKH: 0, source: {}, targets: {}, rows });

test('соли дают стехиометрические ионы и нулевую невязку заряда', () => {
  const result = calculate(state([row('mgso4', 1, { variant: 'hepta' }), row('ca-no3', 1, { variant: 'tetra' }), row('kno3', 1), row('kh2po4', 1), row('nahco3', 1), row('k2co3', 1)]));
  close(result.ions.Mg, 24.305 / 246.47 * 10);
  close(result.ions.SO4, 96.06 / 246.47 * 10);
  close(result.balance.unaccounted, 0, 1e-5);
  assert.ok(result.kh > 0);
});

test('формы гидратов не смешиваются', () => {
  const hepta = productComposition(PRODUCT_BY_ID.mgso4, 'hepta').Mg;
  const dry = productComposition(PRODUCT_BY_ID.mgso4, 'anhydrous').Mg;
  assert.ok(dry > hepta * 2);
});

test('GH и KH WaterSci вычисляются из заявленного ионного состава', () => {
  const result = calculate({ ...state([row('watersci-gh', 1), row('watersci-kh', 1)]), volume: 1 });
  close(result.gh, 5.35, 0.02);
  close(result.kh, 3.20, 0.02);
  assert.ok(result.balance.unknownAnions > 0);
  close(result.balance.unaccounted, 0, 1e-3); // published KH+ concentrations are rounded
});

test('подбор целей GH и KH и обратный пересчёт ручной дозы', () => {
  const input = { ...state([row('watersci-gh', 0, { mode: 'auto' }), row('watersci-kh', 0, { mode: 'auto' })]), targets: { GH: 6, KH: 3 } };
  const solved = solveTargets(input);
  assert.equal(solved.warning, '');
  close(calculate(solved.state).gh, 6, 0.01);
  close(calculate(solved.state).kh, 3, 0.01);
  const changed = { ...solved.state, rows: [{ ...solved.state.rows[0], mode: 'manual', dose: 50 }, solved.state.rows[1]] };
  assert.ok(calculate(changed).gh < 6);
});

test('подбор Ca/Mg работает с солями и сообщает о несовместимой цели', () => {
  const input = { ...state([row('ca-no3', 0, { mode: 'auto', variant: 'tetra' }), row('mgso4', 0, { mode: 'auto', variant: 'hepta' })]), targets: { Ca: 30, Mg: 8 } };
  const solved = solveTargets(input);
  assert.equal(solved.warning, '');
  close(calculate(solved.state).ions.Ca, 30, 0.01);
  close(calculate(solved.state).ions.Mg, 8, 0.01);
  const impossible = solveTargets({ ...input, targets: { Ca: 30, Mg: 8, NO3: 0 } });
  assert.ok(impossible.warning.includes('недостижимы'));
});

test('маточник переводит граммы в миллилитры дозы', () => {
  const ingredient = row('kno3', 10, { doseMode: 'stock', stockGrams: 50, stockMl: 500 });
  close(stockGramsPerL(ingredient), 100);
  const result = calculate(state([ingredient]));
  close(result.byProduct[0].amount, 1);
});

test('AQUAERUS ЖЕЛЕЗО: 1 мл на 70 л даёт 0,1 мг/л Fe', () => {
  const result = calculate({ ...state([row('aquaerus-fe', 1)]), volume: 70 });
  close(result.ions.Fe, 0.1);
  close(result.ions.Mn, 1.3 / 70);
});

test('изменение цели Ca:Mg меняет дозы при сохранении GH', () => {
  const input = { ...state([row('watersci-gh', 0, { mode: 'auto' }), row('mgso4', 0, { mode: 'auto', variant: 'hepta' })]), targets: { GH: 6 }, ratios: [{ numerator: 'Ca', denominator: 'Mg', target: 4 }] };
  const solved = solveTargets(input);
  assert.equal(solved.warning, '');
  close(calculate(solved.state).gh, 6, 0.01);
  close(actualRatio(calculate(solved.state), input.ratios[0]), 4, 0.02);
  assert.ok(solved.state.rows[1].dose > 0);
  const changed = solveTargets({ ...input, ratios: [{ numerator: 'Ca', denominator: 'Mg', target: 3 }] });
  assert.ok(changed.state.rows[1].dose > solved.state.rows[1].dose);
});

test('KH+ и поташ подбираются по KH и K:Na', () => {
  const input = { ...state([row('watersci-kh', 0, { mode: 'auto' }), row('k2co3', 0, { mode: 'auto' })]), targets: { KH: 3 }, ratios: [{ numerator: 'K', denominator: 'Na', target: 1 }] };
  const solved = solveTargets(input);
  assert.equal(solved.warning, '');
  close(calculate(solved.state).kh, 3, 0.01);
  close(actualRatio(calculate(solved.state), input.ratios[0]), 1, 0.02);
});

test('невыполнимое и недоопределённое соотношения отмечаются', () => {
  const input = { ...state([row('watersci-gh', 0, { mode: 'auto' })]), targets: { GH: 6 }, ratios: [{ numerator: 'Ca', denominator: 'Mg', target: 2 }] };
  assert.ok(solveTargets(input).warning.includes('недостижимы'));
  assert.ok(solveTargets({ ...input, targets: {} }).warning.includes('недостаточно'));
});

test('ручная доза задаёт масштаб для подбора только по соотношению', () => {
  const ratio = { numerator: 'Ca', denominator: 'Mg', target: 4 };
  const input = { ...state([row('watersci-gh', 100), row('mgso4', 0, { mode: 'auto', variant: 'hepta' })]), targets: {}, ratios: [ratio] };
  const solved = solveTargets(input);
  assert.equal(solved.warning, '');
  close(actualRatio(calculate(solved.state), ratio), 4, 0.02);
  close(solved.state.rows[0].dose, 100);
});

test('точная пропорция внутри допуска определяет дозу монофосфата', () => {
  const ratio = { numerator: 'PO4', denominator: 'NO3', target: 0.1, min: 0.08, max: 0.12 };
  const input = { ...state([row('kno3', 0, { mode: 'auto' }), row('kh2po4', 0, { mode: 'auto' })]), targets: { NO3: 10 }, ratios: [ratio] };
  const solved = solveTargets(input);
  assert.equal(solved.warning, '');
  close(calculate(solved.state).ions.NO3, 10, 0.01);
  assert.ok(ratioSatisfied(calculate(solved.state), ratio));
  close(actualRatio(calculate(solved.state), ratio), 0.1, 0.001);
  const higher = solveTargets({ ...input, ratios: [{ ...ratio, min: 0.2, max: 0.3 }] });
  assert.ok(higher.warning.includes('Точная цель'));
  assert.ok(higher.state.rows[1].dose > solved.state.rows[1].dose);
  close(actualRatio(calculate(higher.state), ratio), 0.2, 0.001);
});

test('при конфликте с целями NO₃ и PO₄ используется допустимое соотношение', () => {
  const ratio = { numerator: 'NO3', denominator: 'PO4', target: 12, min: 10, max: 15 };
  const input = { ...state([row('kno3', 0, { mode: 'auto' }), row('kh2po4', 0, { mode: 'auto' })]), targets: { NO3: 10, PO4: 0.7 }, ratios: [ratio] };
  const solved = solveTargets(input);
  const result = calculate(solved.state);
  close(result.ions.NO3, 10, 0.01);
  close(result.ions.PO4, 0.7, 0.001);
  close(actualRatio(result, ratio), 10 / 0.7, 0.01);
  assert.ok(ratioSatisfied(result, ratio));
  assert.ok(solved.warning.includes('Точная цель'));
});

test('при совместимости цели и диапазона выбирается точное отношение NO₃:PO₄', () => {
  const ratio = { numerator: 'NO3', denominator: 'PO4', target: 12, min: 10, max: 15 };
  const input = { ...state([row('kno3', 0, { mode: 'auto' }), row('kh2po4', 0, { mode: 'auto' })]), targets: { NO3: 10 }, ratios: [ratio] };
  const solved = solveTargets(input);
  assert.equal(solved.warning, '');
  close(calculate(solved.state).ions.NO3, 10, 0.01);
  close(actualRatio(calculate(solved.state), ratio), 12, 0.02);
});

test('ослабление одной пропорции сохраняет достижимую точную цель другой', () => {
  const caMg = { numerator: 'Ca', denominator: 'Mg', target: 4, min: 3, max: 5 };
  const nitratePhosphate = { numerator: 'NO3', denominator: 'PO4', target: 12, min: 10, max: 15 };
  const input = { ...state([
    row('watersci-gh', 0, { mode: 'auto' }), row('mgso4', 0, { mode: 'auto', variant: 'hepta' }),
    row('kno3', 0, { mode: 'auto' }), row('kh2po4', 0, { mode: 'auto' }),
  ]), targets: { GH: 6, NO3: 10, PO4: 0.7 }, ratios: [caMg, nitratePhosphate] };
  const solved = solveTargets(input);
  const result = calculate(solved.state);
  close(result.gh, 6, 0.01);
  close(result.ions.NO3, 10, 0.01);
  close(result.ions.PO4, 0.7, 0.001);
  close(actualRatio(result, caMg), 4, 0.02);
  close(actualRatio(result, nitratePhosphate), 10 / 0.7, 0.01);
  assert.ok(solved.warning.includes('NO₃:PO₄'));
  assert.ok(!solved.warning.includes('Ca:Mg'));
});

test('допуск параметра применяется только при конфликте точных целей', () => {
  const rows = [row('kno3', 0, { mode: 'auto' }), row('kh2po4', 0, { mode: 'auto' })];
  const input = { ...state(rows), targets: { NO3: 10, PO4: 1 }, targetRanges: { PO4: { min: 0.5, max: 1.5 } },
    ratios: [{ numerator: 'NO3', denominator: 'PO4', target: 20, min: 15, max: 25 }] };
  const relaxed = solveTargets(input);
  const actual = calculate(relaxed.state);
  close(actual.ions.NO3, 10, 0.01);
  close(actual.ions.PO4, 0.5, 0.01);
  assert.match(relaxed.warning, /PO₄/);
  const exact = solveTargets({ ...input, ratios: [{ numerator: 'NO3', denominator: 'PO4', target: 10, min: 8, max: 12 }] });
  close(calculate(exact.state).ions.PO4, 1, 0.01);
  assert.equal(exact.warning, '');
});

test('параметр может задаваться только односторонним диапазоном', () => {
  assert.deepEqual(targetLimits('', { min: 5 }), { target: null, min: 5, max: null, ranged: true });
  assert.equal(targetLimits(4, { min: 5, max: 10 }), null);
  assert.equal(targetLimits('', { min: 10, max: 5 }), null);
  const input = { ...state([row('kno3', 0, { mode: 'auto' })]), targetRanges: { NO3: { min: 5, max: 10 } } };
  const solved = solveTargets(input);
  close(calculate(solved.state).ions.NO3, 5, 0.01);
  assert.equal(solved.warning, '');
});

test('односторонние границы и несовместимый диапазон', () => {
  const ratio = { numerator: 'PO4', denominator: 'NO3', min: 0.1, max: '' };
  assert.deepEqual(ratioLimits(ratio), { min: 0.1, max: null, ranged: true });
  const input = { ...state([row('kno3', 0, { mode: 'auto' })]), targets: { NO3: 10 }, ratios: [ratio] };
  assert.ok(solveTargets(input).warning.includes('недостижимы'));
  assert.equal(ratioLimits({ ...ratio, max: 0.05 }), null);
  const upper = { numerator: 'PO4', denominator: 'NO3', max: 0.1 };
  const manual = { ...state([row('kh2po4', 0.1), row('kno3', 0, { mode: 'auto' })]), targets: {}, ratios: [upper] };
  const solved = solveTargets(manual);
  assert.equal(solved.warning, '');
  assert.ok(solved.state.rows[1].dose > 0);
  assert.ok(ratioSatisfied(calculate(solved.state), upper));
});

test('обратная запись NO₃:PO₄ сохраняет точную цель и диапазон', () => {
  const exact = invertRatio({ numerator: 'PO4', denominator: 'NO3', target: 0.1 });
  assert.equal(exact.numerator, 'NO3');
  assert.equal(exact.denominator, 'PO4');
  close(exact.target, 10);
  const range = invertRatio({ numerator: 'PO4', denominator: 'NO3', min: 0.05, max: 0.1 });
  close(range.min, 10);
  close(range.max, 20);
  assert.equal(invertRatio({ numerator: 'PO4', denominator: 'NO3', target: 0 }), null);
});

test('pH после отстаивания рассчитывается по KH и растворённому CO₂', () => {
  const base = { ...state([]), sourcePH: 7, sourceKH: 3, phCO2: 3 };
  close(calculate(base).ph, 7.55, 0.06);
  const bicarbonate = calculate({ ...base, rows: [row('nahco3', 0.2)] });
  const carbonate = calculate({ ...base, rows: [row('k2co3', 0.2)] });
  assert.ok(bicarbonate.ph > calculate(base).ph);
  assert.ok(carbonate.ph > bicarbonate.ph);
  const phosphate = calculate({ ...base, rows: [row('kh2po4', 0.2)] });
  assert.ok(phosphate.ph < calculate(base).ph);
  assert.ok(calculate({ ...base, phCO2: 6 }).ph < calculate(base).ph);
});

test('pH оценивается для подменной воды без исходного pH, но требует KH и CO₂', () => {
  const prepared = calculate(state([row('nahco3', 10)]));
  assert.ok(prepared.ph > 7 && prepared.ph < 8);
  assert.equal(calculate({ ...state([]), sourcePH: 7 }).ph, null);
  assert.equal(calculate({ ...state([]), sourceKH: 3, phCO2: '' }).ph, null);
  const kh = calculate({ ...state([row('watersci-kh', 1)]), volume: 1, phCO2: 3 });
  assert.ok(kh.ph >= 7.4 && kh.ph <= 7.8);
});

test('вклады всех выбранных веществ складываются в итог каждого иона', () => {
  const result = calculate(state([row('watersci-gh', 1), row('ca-no3', 1, { variant: 'tetra' }), row('mgso4', 1, { variant: 'hepta' })]));
  assert.equal(result.byProduct.length, 3);
  assert.equal(result.byProduct[2].contribution.Ca ?? 0, 0);
  for (const ion of ['Ca', 'Mg', 'NO3', 'SO4']) {
    const fromRows = result.byProduct.reduce((sum, item) => sum + (item.contribution[ion] ?? 0), 0);
    close(fromRows, result.additions[ion], 1e-9);
  }
});
