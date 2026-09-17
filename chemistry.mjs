import { EXTENDED_PRODUCTS } from './builtin-catalog.mjs';

// Concentrations are mg/L. A dry ingredient's amount is grams; a bottled
// product's amount is millilitres. All calculations describe the water being
// prepared, before biological uptake or precipitation. pH is estimated for
// water after exchange with its surroundings under the selected dissolved CO2.

export const IONS = {
  Ca: { label: 'Ca', molarMass: 40.078, charge: 2 },
  Mg: { label: 'Mg', molarMass: 24.305, charge: 2 },
  K: { label: 'K', molarMass: 39.0983, charge: 1 },
  Na: { label: 'Na', molarMass: 22.98977, charge: 1 },
  NH4: { label: 'NH₄', molarMass: 18.03846, charge: 1 },
  NO2: { label: 'NO₂', molarMass: 46.0055, charge: -1 },
  NO3: { label: 'NO₃', molarMass: 62.0049, charge: -1 },
  PO4: { label: 'PO₄', molarMass: 94.9714, charge: -1 }, // H2PO4- at aquarium pH
  HCO3: { label: 'HCO₃', molarMass: 61.0168, charge: -1 },
  CO3: { label: 'CO₃', molarMass: 60.0089, charge: -2 },
  SO4: { label: 'SO₄', molarMass: 96.06, charge: -2 },
  Cl: { label: 'Cl', molarMass: 35.45, charge: -1 },
  Fe: { label: 'Fe', molarMass: 55.845, charge: 0 },
  Mn: { label: 'Mn', molarMass: 54.938, charge: 0 },
  B: { label: 'B', molarMass: 10.81, charge: 0 },
  Mo: { label: 'Mo', molarMass: 95.95, charge: 0 },
  Cu: { label: 'Cu', molarMass: 63.546, charge: 0 },
  Zn: { label: 'Zn', molarMass: 65.38, charge: 0 },
  Co: { label: 'Co', molarMass: 58.933, charge: 0 },
};

const GH_MEG_PER_DEGREE = 0.35663;
const KH_MEG_PER_DEGREE = 0.35663;
// Ideal, dilute aqueous equilibria at 25 °C. The default effective CO2 level
// is a user-calibrated assumption for standing water, not atmospheric equilibrium.
const CARBON_PKA1 = 6.35;
const CARBON_PKA2 = 10.33;
const PHOSPHATE_PKA1 = 2.15;
const PHOSPHATE_PKA2 = 7.198;
const PHOSPHATE_PKA3 = 12.35;
export const DEFAULT_PH_CO2_MG_L = 5;

export const PRODUCTS = [
  { id: 'watersci-gh', name: 'WaterSci Remineral GH+', short: 'GH+', type: 'liquid', group: 'Реминерализаторы', composition: { Ca: 27.54, Mg: 6.48 }, unknownCounterions: true, note: 'Анионы не раскрыты. По опубликованным Ca и Mg: 5,35 °dGH на 1 мл/л; в карточке указано 8 °dGH.', source: 'https://plantaqua.ru/products/62116684' },
  { id: 'watersci-kh', name: 'WaterSci Remineral KH+', short: 'KH+', type: 'liquid', group: 'Реминерализаторы', composition: { Na: 26.21, K: 7.65, HCO3: 69.57, SO4: 9.40 }, note: 'По опубликованному HCO₃: 3,20 °dKH на 1 мл/л; в карточке указано 4 °dKH.', source: 'https://xn--80aafzh6aw.xn--p1ai/catalog/vse_dlya_akvariuma/sredstva_dlya_vody/sredstva_dlya_vody_v_akvariume/30536/' },
  { id: 'mgso4', name: 'Сульфат магния', short: 'MgSO₄', type: 'dry', group: 'Соли', variants: [
    { id: 'hepta', name: 'MgSO₄·7H₂O', molarMass: 246.47, formula: { Mg: 1, SO4: 1 } },
    { id: 'anhydrous', name: 'MgSO₄ безводный', molarMass: 120.365, formula: { Mg: 1, SO4: 1 } },
  ] },
  { id: 'ca-no3', name: 'Нитрат кальция', short: 'Ca(NO₃)₂', type: 'dry', group: 'Соли', variants: [
    { id: 'tetra', name: 'Ca(NO₃)₂·4H₂O', molarMass: 236.15, formula: { Ca: 1, NO3: 2 } },
    { id: 'anhydrous', name: 'Ca(NO₃)₂ безводный', molarMass: 164.09, formula: { Ca: 1, NO3: 2 } },
  ] },
  { id: 'kno3', name: 'Нитрат калия', short: 'KNO₃', type: 'dry', group: 'Соли', variants: [{ id: 'standard', name: 'KNO₃', molarMass: 101.1032, formula: { K: 1, NO3: 1 } }] },
  { id: 'kh2po4', name: 'Дигидрофосфат калия', aliases: 'Монофосфат калия', short: 'KH₂PO₄', type: 'dry', group: 'Соли', variants: [{ id: 'standard', name: 'KH₂PO₄', molarMass: 136.0855, formula: { K: 1, PO4: 1 } }] },
  { id: 'nahco3', name: 'Гидрокарбонат натрия', aliases: 'Пищевая сода', short: 'NaHCO₃', type: 'dry', group: 'Соли', variants: [{ id: 'standard', name: 'NaHCO₃', molarMass: 84.0066, formula: { Na: 1, HCO3: 1 } }] },
  { id: 'k2co3', name: 'Карбонат калия', aliases: 'Поташ', short: 'K₂CO₃', type: 'dry', group: 'Соли', variants: [{ id: 'standard', name: 'K₂CO₃', molarMass: 138.205, formula: { K: 2, CO3: 1 } }] },
  { id: 'aquaerus-fe', name: 'AQUAERUS ЖЕЛЕЗО', short: 'Fe', type: 'liquid', group: 'Удобрения', composition: { Fe: 7.0, Mn: 1.3 }, unknownCounterions: true, note: 'Общее Fe и Mn; доли DTPA и глюконата не опубликованы.', source: 'https://zaisy.ru/catalog/ryby/sredstva_po_ukhodu_za_akvariumom/udobreniya_dlya_rasteniy/150745/' },
  { id: 'aquaerus-micro', name: 'AQUAERUS МИКРО+', short: 'Микро+', type: 'liquid', group: 'Удобрения', composition: { K: 7.920, Fe: 1.372, Mg: 0.915, Mn: 0.475, B: 0.082, Mo: 0.035, Cu: 0.052, Zn: 0.017, Co: 0.008 }, unknownCounterions: true, note: 'Анионы перечислены без количеств, поэтому их вклад в баланс неизвестен.', source: 'https://plantaqua.ru/products/35828202' },
];
PRODUCTS.push(...EXTENDED_PRODUCTS);

export const PRODUCT_BY_ID = Object.fromEntries(PRODUCTS.map(product => [product.id, product]));
const BUILTIN_COUNT = PRODUCTS.length;

export function setCustomProducts(definitions) {
  for (const product of PRODUCTS.splice(BUILTIN_COUNT)) delete PRODUCT_BY_ID[product.id];
  if (!Array.isArray(definitions)) return;
  for (const product of definitions) {
    if (!product || !/^custom-[a-z0-9-]+$/.test(product.id) || PRODUCT_BY_ID[product.id]
      || !['dry', 'liquid'].includes(product.type) || !product.name) continue;
    if (product.type === 'dry' && !product.composition && !product.variants?.[0]) continue;
    if (product.type === 'liquid' && !product.composition) continue;
    PRODUCTS.push(product);
    PRODUCT_BY_ID[product.id] = product;
  }
}

export const TARGETS = [
  { id: 'GH', label: 'GH', unit: '°dGH', scale: 5 },
  { id: 'KH', label: 'KH', unit: '°dKH', scale: 3 },
  { id: 'Ca', label: 'Ca', unit: 'мг/л', scale: 30 },
  { id: 'Mg', label: 'Mg', unit: 'мг/л', scale: 8 },
  { id: 'K', label: 'K', unit: 'мг/л', scale: 10 },
  { id: 'NO3', label: 'NO₃', unit: 'мг/л', scale: 10 },
  { id: 'PO4', label: 'PO₄', unit: 'мг/л', scale: 1 },
  { id: 'Fe', label: 'Fe', unit: 'мг/л', scale: 0.1 },
];

// Ratios use the displayed mg/L concentrations. Chelated micronutrients are
// excluded because their free-ion fraction is not known.
export const RATIO_IONS = ['Ca', 'Mg', 'K', 'Na', 'Cl', 'SO4', 'NO3', 'PO4', 'HCO3', 'CO3'];
const RATIO_SCALES = { Ca: 30, Mg: 8, K: 10, Na: 20, Cl: 20, SO4: 20, NO3: 10, PO4: 1, HCO3: 60, CO3: 30 };
const filled = value => value !== '' && value != null;
const validLimit = value => filled(value) && Number.isFinite(number(value, NaN)) && number(value) >= 0;

// undefined means no constraint; null means an invalid value or range.
export function targetLimits(value, range = {}) {
  const hasTarget = filled(value);
  const hasMin = filled(range?.min);
  const hasMax = filled(range?.max);
  if (!hasTarget && !hasMin && !hasMax) return undefined;
  if ([value, range?.min, range?.max].some(item => filled(item) && !validLimit(item))) return null;
  const target = hasTarget ? number(value) : null;
  const min = hasMin ? number(range.min) : null;
  const max = hasMax ? number(range.max) : null;
  if (min != null && max != null && min > max || target != null && (min != null && target < min || max != null && target > max)) return null;
  return { target, min, max, ranged: hasMin || hasMax };
}

export function ratioLimits(ratio) {
  const ranged = filled(ratio.min) || filled(ratio.max);
  if (ranged) {
    if ((filled(ratio.min) && !validLimit(ratio.min)) || (filled(ratio.max) && !validLimit(ratio.max))) return null;
    const min = filled(ratio.min) ? number(ratio.min) : null;
    const max = filled(ratio.max) ? number(ratio.max) : null;
    return min != null && max != null && min > max ? null : { min, max, ranged: true };
  }
  return validLimit(ratio.target) ? { min: number(ratio.target), max: number(ratio.target), ranged: false } : null;
}

// Reverse A:B to B:A while preserving the same admissible concentrations.
// An exact zero cannot be represented by a finite reciprocal.
export function invertRatio(ratio) {
  const limits = ratioLimits(ratio);
  const blank = value => value === '' || value == null;
  if (!limits && ![ratio.target, ratio.min, ratio.max].every(blank)) return null;
  if (limits && (!limits.ranged && limits.min === 0 || limits.ranged && limits.max === 0)) return null;
  const reciprocal = value => Number((1 / value).toPrecision(12));
  return {
    ...ratio, numerator: ratio.denominator, denominator: ratio.numerator,
    target: validLimit(ratio.target) && number(ratio.target) > 0 ? reciprocal(number(ratio.target)) : '',
    min: limits?.ranged && limits.max != null ? reciprocal(limits.max) : '',
    max: limits?.ranged && limits.min != null && limits.min > 0 ? reciprocal(limits.min) : '',
  };
}

export function activeRatios(state) {
  return (state.ratios ?? []).filter(ratio => ratioLimits(ratio) !== null && ratio.numerator !== ratio.denominator
    && RATIO_IONS.includes(ratio.numerator) && RATIO_IONS.includes(ratio.denominator));
}

export function actualRatio(result, ratio) {
  const denominator = result.ions[ratio.denominator] ?? 0;
  return denominator > 1e-9 ? (result.ions[ratio.numerator] ?? 0) / denominator : null;
}

export function ratioTargetSatisfied(result, ratio) {
  const actual = actualRatio(result, ratio);
  return validLimit(ratio.target) && actual !== null
    && Math.abs(actual - number(ratio.target)) <= Math.max(0.02, number(ratio.target) * 0.01);
}

export function ratioSatisfied(result, ratio) {
  const limits = ratioLimits(ratio);
  const actual = actualRatio(result, ratio);
  if (!limits || actual === null) return false;
  if (!limits.ranged) return ratioTargetSatisfied(result, ratio);
  const epsilon = 1e-4 * Math.max(1, limits.min ?? 0, limits.max ?? 0);
  return (limits.min == null || actual >= limits.min - epsilon) && (limits.max == null || actual <= limits.max + epsilon);
}

export function number(value, fallback = 0) {
  const parsed = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function productComposition(product, variantId = undefined, purity = 100) {
  if (product.type === 'liquid') return { ...product.composition }; // mg per mL
  const fraction = Math.max(0, Math.min(100, number(purity, 100))) / 100;
  const variant = product.variants?.find(item => item.id === variantId) ?? product.variants?.[0];
  if (!variant && product.composition) return Object.fromEntries(Object.entries(product.composition).map(([ion, mgPerG]) => [ion, mgPerG * fraction]));
  if (variant.composition) return Object.fromEntries(Object.entries(variant.composition).map(([ion, mgPerG]) => [ion, mgPerG * fraction]));
  return Object.fromEntries(Object.entries(variant.formula).map(([ion, count]) => [ion, 1000 * count * IONS[ion].molarMass / variant.molarMass * fraction])); // mg per g
}

export function stockGramsPerL(row) {
  const grams = number(row.stockGrams);
  const millilitres = number(row.stockMl);
  return grams > 0 && millilitres > 0 ? grams * 1000 / millilitres : 0;
}

export function displayDoseToAmount(row, product) {
  const dose = Math.max(0, number(row.dose));
  return product.type === 'dry' && row.doseMode === 'stock' ? dose * stockGramsPerL(row) / 1000 : dose;
}

export function amountToDisplayDose(amount, row, product) {
  if (product.type === 'dry' && row.doseMode === 'stock') {
    const concentration = stockGramsPerL(row);
    return concentration > 0 ? amount * 1000 / concentration : 0;
  }
  return amount;
}

export function emptyIons() {
  return Object.fromEntries(Object.keys(IONS).map(key => [key, 0]));
}

export function addedIons(rows, volume) {
  const ions = emptyIons();
  const byProduct = [];
  for (const row of rows) {
    const product = PRODUCT_BY_ID[row.id];
    if (!product || !row.enabled) continue;
    const amount = displayDoseToAmount(row, product);
    const composition = productComposition(product, row.variant, row.purity);
    const contribution = {};
    for (const [ion, mgPerUnit] of Object.entries(composition)) {
      contribution[ion] = amount * mgPerUnit / volume;
      ions[ion] += contribution[ion];
    }
    const variant = product.variants?.find(item => item.id === row.variant) ?? product.variants?.[0];
    const acidMeq = amount * number(variant?.acidMeqPerUnit ?? product.acidMeqPerUnit) / volume;
    byProduct.push({ id: row.id, amount, contribution, product, variantId: row.variant, acidMeq });
  }
  return { ions, byProduct };
}

export function ghFromIons(ions) {
  return ((ions.Ca ?? 0) * 2 / IONS.Ca.molarMass + (ions.Mg ?? 0) * 2 / IONS.Mg.molarMass) / GH_MEG_PER_DEGREE;
}

export function khFromIons(ions) {
  return ((ions.HCO3 ?? 0) / IONS.HCO3.molarMass + (ions.CO3 ?? 0) * 2 / IONS.CO3.molarMass) / KH_MEG_PER_DEGREE;
}

export function khFromProduct(item) {
  return khFromIons(item.contribution) - (item.acidMeq ?? 0) / KH_MEG_PER_DEGREE;
}

const acidMeqFromProducts = items => items.reduce((sum, item) => sum + (item.acidMeq ?? 0), 0);

function phosphateAlkalinityFraction(ph) {
  const h = 10 ** -ph;
  const k1 = 10 ** -PHOSPHATE_PKA1;
  const k2 = 10 ** -PHOSPHATE_PKA2;
  const k3 = 10 ** -PHOSPHATE_PKA3;
  const denominator = h ** 3 + k1 * h * h + k1 * k2 * h + k1 * k2 * k3;
  return (k1 * k2 * h + 2 * k1 * k2 * k3 - h ** 3) / denominator;
}

const waterAlkalinity = ph => 10 ** (ph - 14) - 10 ** -ph;
const ionMolesPerL = (ions, ion) => Math.max(0, number(ions?.[ion])) / IONS[ion].molarMass / 1000;

export function estimatePH(state, additions, acidMeq = 0) {
  const co2MgL = number(state.phCO2 ?? DEFAULT_PH_CO2_MG_L, NaN);
  if (!Number.isFinite(co2MgL) || co2MgL <= 0) return null;
  const co2 = co2MgL / 44.0095 / 1000;
  const finalAlkalinity = ((Math.max(0, number(state.sourceKH)) + khFromIons(additions)) * KH_MEG_PER_DEGREE - acidMeq) / 1000;
  if (finalAlkalinity < 1e-6) return null;
  const totalPhosphate = ionMolesPerL(state.source, 'PO4') + ionMolesPerL(additions, 'PO4');
  const k1 = 10 ** -CARBON_PKA1;
  const k2 = 10 ** -CARBON_PKA2;
  const difference = ph => {
    const h = 10 ** -ph;
    return co2 * (k1 / h + 2 * k1 * k2 / (h * h))
      + totalPhosphate * phosphateAlkalinityFraction(ph) + waterAlkalinity(ph) - finalAlkalinity;
  };
  let lower = 3;
  let upper = 12;
  if (difference(lower) > 0 || difference(upper) < 0) return null;
  for (let iteration = 0; iteration < 70; iteration++) {
    const middle = (lower + upper) / 2;
    if (difference(middle) < 0) lower = middle;
    else upper = middle;
  }
  return (lower + upper) / 2;
}

export function chargeBalance(byProduct, volume) {
  let knownCations = 0;
  let knownAnions = 0;
  let unknownAnions = 0;
  let unknownCations = 0;
  for (const item of byProduct) {
    let cation = 0;
    let anion = 0;
    for (const [ion, mgL] of Object.entries(item.contribution)) {
      const descriptor = IONS[ion];
      const variant = item.product.variants?.find(entry => entry.id === item.variantId) ?? item.product.variants?.[0];
      const charge = variant?.ionCharges?.[ion] ?? item.product.ionCharges?.[ion] ?? descriptor.charge;
      const meq = mgL * Math.abs(charge) / descriptor.molarMass;
      if (charge > 0) cation += meq;
      else if (charge < 0) anion += meq;
    }
    cation += item.acidMeq ?? 0; // H+ supplied by an acid before neutralization
    knownCations += cation;
    knownAnions += anion;
    if (item.product.unknownCounterions) {
      unknownAnions += Math.max(0, cation - anion);
      unknownCations += Math.max(0, anion - cation);
    }
  }
  return { knownCations, knownAnions, unknownAnions, unknownCations, unaccounted: knownCations + unknownCations - knownAnions - unknownAnions };
}

function calculatePrepared(state) {
  const volume = Math.max(0.001, number(state.volume, 1));
  const { ions: additions, byProduct } = addedIons(state.rows ?? [], volume);
  const ions = emptyIons();
  for (const ion of Object.keys(IONS)) ions[ion] = Math.max(0, number(state.source?.[ion])) + additions[ion];
  const gh = Math.max(0, number(state.sourceGH)) + ghFromIons(additions);
  const acidMeq = acidMeqFromProducts(byProduct);
  const kh = Math.max(0, number(state.sourceKH)) + khFromIons(additions) - acidMeq / KH_MEG_PER_DEGREE;
  return { ions, additions, gh, kh, ph: estimatePH(state, additions, acidMeq), byProduct, balance: chargeBalance(byProduct, volume), baseline: { GH: Math.max(0, number(state.sourceGH)), KH: Math.max(0, number(state.sourceKH)), ions: state.source ?? {} } };
}

export function calculate(state) {
  const prepared = calculatePrepared(state);
  if (state.mode !== 'change') return prepared;
  const tankVolume = Math.max(0.001, number(state.tankVolume, 1));
  const changeVolume = Math.max(0, Math.min(tankVolume, number(state.volume)));
  const share = changeVolume / tankVolume;
  const retained = 1 - share;
  const baselineIons = emptyIons();
  const ions = emptyIons();
  const additions = emptyIons();
  for (const ion of Object.keys(IONS)) {
    baselineIons[ion] = retained * Math.max(0, number(state.tank?.[ion])) + share * Math.max(0, number(state.source?.[ion]));
    additions[ion] = share * prepared.additions[ion];
    ions[ion] = baselineIons[ion] + additions[ion];
  }
  const baselineGH = retained * Math.max(0, number(state.tankGH)) + share * Math.max(0, number(state.sourceGH));
  const baselineKH = retained * Math.max(0, number(state.tankKH)) + share * Math.max(0, number(state.sourceKH));
  const byProduct = prepared.byProduct.map(item => ({ ...item, acidMeq: item.acidMeq * share,
    contribution: Object.fromEntries(Object.entries(item.contribution).map(([ion, value]) => [ion, value * share])) }));
  const gh = baselineGH + ghFromIons(additions);
  const acidMeq = acidMeqFromProducts(byProduct);
  const kh = baselineKH + khFromIons(additions) - acidMeq / KH_MEG_PER_DEGREE;
  const ph = estimatePH({ sourceKH: baselineKH, source: baselineIons, phCO2: state.phCO2 }, additions, acidMeq);
  return { ions, additions, gh, kh, ph, byProduct, balance: chargeBalance(byProduct, tankVolume), baseline: { GH: baselineGH, KH: baselineKH, ions: baselineIons }, prepared, share };
}

export function calibratePHCO2(result, measuredPH) {
  const ph = number(measuredPH, NaN);
  if (!Number.isFinite(ph) || ph < 4 || ph > 10 || result.kh <= 0) return null;
  const h = 10 ** -ph;
  const k1 = 10 ** -CARBON_PKA1;
  const k2 = 10 ** -CARBON_PKA2;
  const alkalinity = result.kh * KH_MEG_PER_DEGREE / 1000;
  const phosphate = ionMolesPerL(result.ions, 'PO4') * phosphateAlkalinityFraction(ph);
  const co2Moles = (alkalinity - phosphate - waterAlkalinity(ph)) / (k1 / h + 2 * k1 * k2 / (h * h));
  const mgL = co2Moles * 44.0095 * 1000;
  return Number.isFinite(mgL) && mgL > 0 ? mgL : null;
}

export function metric(result, id) {
  if (id === 'GH') return result.gh;
  if (id === 'KH') return result.kh;
  return result.ions[id] ?? 0;
}

const solverMessages = {
  ru: {
    invalid: labels => `Проверьте целевой диапазон: ${labels}. Цель должна находиться между границами «от» и «до».`,
    empty: 'Задайте хотя бы одну цель.', auto: 'Выберите хотя бы одно вещество в режиме «Авто».',
    ratioOnly: 'Одного соотношения недостаточно для определения дозы. Задайте абсолютную цель или ручную дозу.',
    impossible: labels => `Цели недостижимы одновременно выбранными веществами: ${labels}. Показано ближайшее неотрицательное решение.`,
    relaxed: labels => `Точная цель ${labels} недостижима при заданных параметрах. Дозы подобраны в допустимом диапазоне.`,
  },
  en: {
    invalid: labels => `Check the target range for ${labels}. The target must lie between the lower and upper bounds.`,
    empty: 'Set at least one target.', auto: 'Choose at least one substance in Auto mode.',
    ratioOnly: 'A ratio alone cannot determine a dose. Set an absolute target or a manual dose.',
    impossible: labels => `These targets cannot all be reached with the selected substances: ${labels}. The closest nonnegative solution is shown.`,
    relaxed: labels => `The exact target for ${labels} cannot be reached with these settings. Doses were fitted within the allowed range.`,
  },
  de: {
    invalid: labels => `Zielbereich für ${labels} prüfen. Das Ziel muss zwischen Unter- und Obergrenze liegen.`,
    empty: 'Mindestens einen Zielwert eingeben.', auto: 'Mindestens einen Stoff im Automatikmodus auswählen.',
    ratioOnly: 'Ein Verhältnis allein bestimmt keine Dosis. Einen absoluten Zielwert oder eine manuelle Dosis eingeben.',
    impossible: labels => `Diese Ziele sind mit den gewählten Stoffen nicht gleichzeitig erreichbar: ${labels}. Die nächste nichtnegative Lösung wird angezeigt.`,
    relaxed: labels => `Das exakte Ziel für ${labels} ist mit diesen Einstellungen nicht erreichbar. Die Dosierungen liegen im zulässigen Bereich.`,
  },
  es: {
    invalid: labels => `Compruebe el rango objetivo de ${labels}. El objetivo debe estar entre los límites inferior y superior.`,
    empty: 'Establezca al menos un objetivo.', auto: 'Elija al menos una sustancia en modo automático.',
    ratioOnly: 'Una proporción sola no determina la dosis. Establezca un objetivo absoluto o una dosis manual.',
    impossible: labels => `No se pueden alcanzar todos estos objetivos con las sustancias elegidas: ${labels}. Se muestra la solución no negativa más cercana.`,
    relaxed: labels => `El objetivo exacto de ${labels} no es alcanzable con estos ajustes. Las dosis se ajustaron dentro del rango permitido.`,
  },
};

// Try exact water targets and ratios first; relax them to permitted bounds only
// when necessary. Manual rows stay fixed in both passes.
export function solveTargets(state, locale = 'ru') {
  const words = solverMessages[locale] ?? solverMessages.ru;
  const targetSpecs = TARGETS.map(target => ({ ...target,
    limits: targetLimits(state.targets?.[target.id], state.targetRanges?.[target.id]) }));
  const invalid = targetSpecs.filter(target => target.limits === null);
  if (invalid.length) return { state, targets: [], warning: words.invalid(invalid.map(target => target.label).join(', ')) };
  const activeTargets = targetSpecs.filter(target => target.limits);
  const makeAbsoluteTargets = relaxed => activeTargets.flatMap(target => {
    const { limits, id, label, scale } = target;
    if (limits.target != null && !relaxed.has(id)) return [{ id, label, scale, bound: limits.target, kind: 'absolute' }];
    return [limits.min == null ? null : { id, label, scale, bound: limits.min, kind: 'lower' },
      limits.max == null ? null : { id, label, scale, bound: limits.max, kind: 'upper' }].filter(Boolean);
  });
  const ratios = activeRatios(state);
  const makeRatioTargets = relaxed => ratios.flatMap(ratio => {
    const limits = ratioLimits(ratio);
    const make = (kind, bound) => ({ kind, ratio, bound,
      label: `${IONS[ratio.numerator].label}:${IONS[ratio.denominator].label}`,
      scale: Math.max(1, RATIO_SCALES[ratio.numerator], bound * RATIO_SCALES[ratio.denominator]),
    });
    if (!limits.ranged || validLimit(ratio.target) && !relaxed.has(ratio)) return [make('ratio', limits.ranged ? number(ratio.target) : limits.min)];
    return limits.ranged
      ? [limits.min == null ? null : make('lower', limits.min), limits.max == null ? null : make('upper', limits.max)].filter(Boolean)
      : [make('ratio', limits.min)];
  });
  const preferredTargets = [...makeAbsoluteTargets(new Set()), ...makeRatioTargets(new Set())];
  const autoRows = (state.rows ?? []).filter(row => row.enabled && row.mode === 'auto' && !row.locked && PRODUCT_BY_ID[row.id]);
  if (!preferredTargets.length || !autoRows.length) return { state, targets: preferredTargets, warning: !preferredTargets.length ? words.empty : words.auto };

  const fixedState = { ...state, rows: state.rows.map(row => row.mode === 'auto' && !row.locked ? { ...row, dose: 0 } : row) };
  const fixedResult = calculate(fixedState);
  const baselineResult = calculate({ ...state, rows: [] });
  const constrainedMetric = (result, target) => target.ratio
    ? (result.ions[target.ratio.numerator] ?? 0) - target.bound * (result.ions[target.ratio.denominator] ?? 0)
    : metric(result, target.id);
  if (!activeTargets.length && preferredTargets.every(target =>
    (fixedResult.ions[target.ratio.numerator] ?? 0) < 1e-9 && (fixedResult.ions[target.ratio.denominator] ?? 0) < 1e-9)) {
    return { state, targets: preferredTargets, warning: words.ratioOnly };
  }
  const unitResults = autoRows.map(row => {
    const product = PRODUCT_BY_ID[row.id];
    const unitState = { ...fixedState, rows: [{ ...row, doseMode: product.type === 'dry' ? 'dry' : undefined, dose: 1, enabled: true }] };
    return calculate(unitState);
  });
  const solvePass = (targets, absoluteWeight = 1, seed = null) => {
    const scale = target => target.scale / (target.ratio ? 1 : absoluteWeight);
    const desired = targets.map(target => ((target.ratio ? 0 : target.bound) - constrainedMetric(fixedResult, target)) / scale(target));
    const columns = unitResults.map(unitResult => targets.map((target, i) => (constrainedMetric(unitResult, target) - constrainedMetric(baselineResult, target)) / scale(target)));
    const norms = columns.map(column => Math.sqrt(column.reduce((sum, value) => sum + value * value, 0)));
    const normalized = columns.map((column, j) => column.map(value => norms[j] > 0 ? value / norms[j] : 0));
    const x = autoRows.map((row, j) => seed && norms[j] > 0 ? displayDoseToAmount(seed.rows.find(item => item === row || item.id === row.id), PRODUCT_BY_ID[row.id]) * norms[j] : 0);
    const residual = desired.map((value, i) => value - normalized.reduce((sum, column, j) => sum + column[i] * x[j], 0));
    for (let iteration = 0; iteration < 10000; iteration++) {
      let greatestChange = 0;
      for (let j = 0; j < x.length; j++) {
        if (norms[j] < 1e-12) continue;
        const column = normalized[j];
        // Each coordinate has a convex piecewise quadratic objective.
        const derivative = step => column.reduce((sum, value, i) => {
          const r = residual[i] - value * step;
          const kind = targets[i].kind;
          return sum - ((kind === 'lower' && r <= 0) || (kind === 'upper' && r >= 0) ? 0 : value * r);
        }, 0);
        let low = -x[j];
        let high = 0;
        const atZero = derivative(0);
        if (atZero < -1e-14) {
          low = 0;
          high = 1;
          while (derivative(high) < 0 && high < 1e12) high *= 2;
        } else if (atZero > 1e-14) {
          if (derivative(low) >= 0) high = low;
        } else continue;
        for (let step = 0; step < 48 && high - low > 1e-12; step++) {
          const mid = (low + high) / 2;
          if (derivative(mid) < 0) low = mid;
          else high = mid;
        }
        const change = high;
        if (change) {
          x[j] = Math.max(0, x[j] + change);
          for (let i = 0; i < residual.length; i++) residual[i] -= column[i] * change;
          greatestChange = Math.max(greatestChange, Math.abs(change));
        }
      }
      if (greatestChange < 1e-10) break;
    }
    const solvedRows = state.rows.map(row => {
      const index = autoRows.indexOf(row);
      if (index < 0) return row;
      const calculated = norms[index] > 0 ? x[index] / norms[index] : 0;
      const amount = calculated < 1e-7 ? 0 : calculated;
      return { ...row, dose: amountToDisplayDose(amount, row, PRODUCT_BY_ID[row.id]) };
    });
    const solvedState = { ...state, rows: solvedRows };
    return { state: solvedState, result: calculate(solvedState), targets };
  };
  const tolerance = target => Math.max(target.scale * 0.01, 0.001);
  const exactMisses = result => activeTargets.filter(target => target.limits.target != null
    && Math.abs(metric(result, target.id) - target.limits.target) > tolerance(target));
  const rangeMisses = result => activeTargets.filter(target => {
    const value = metric(result, target.id);
    return target.limits.min != null && value < target.limits.min - tolerance(target)
      || target.limits.max != null && value > target.limits.max + tolerance(target);
  });
  const preferred = solvePass(preferredTargets);
  const preferredMisses = ratios.filter(ratio => {
    const limits = ratioLimits(ratio);
    return limits.ranged && validLimit(ratio.target)
      ? !ratioTargetSatisfied(preferred.result, ratio) || !ratioSatisfied(preferred.result, ratio)
      : !ratioSatisfied(preferred.result, ratio);
  });
  if (!exactMisses(preferred.result).length && !rangeMisses(preferred.result).length && !preferredMisses.length)
    return { state: preferred.state, targets: preferredTargets, warning: '' };

  const canRelaxRatios = ratios.filter(ratio => ratioLimits(ratio).ranged && validLimit(ratio.target));
  const canRelaxTargets = activeTargets.filter(target => target.limits.target != null && target.limits.ranged);
  const relaxedRatios = new Set(preferredMisses.filter(ratio => canRelaxRatios.includes(ratio)));
  const relaxedTargets = new Set(exactMisses(preferred.result).filter(target => canRelaxTargets.includes(target)).map(target => target.id));
  if (exactMisses(preferred.result).length && !relaxedRatios.size && !relaxedTargets.size)
    canRelaxRatios.forEach(ratio => relaxedRatios.add(ratio));
  const constraints = () => [...makeAbsoluteTargets(relaxedTargets), ...makeRatioTargets(relaxedRatios)];
  let fallbackTargets = constraints();
  let fallback = solvePass(fallbackTargets, activeTargets.length ? 100 : 1, preferred.state);
  const requiredMisses = result => exactMisses(result).filter(target => !relaxedTargets.has(target.id)).length
    || rangeMisses(result).length || ratios.some(ratio => !ratioSatisfied(result, ratio));
  if (requiredMisses(fallback.result) && (relaxedRatios.size < canRelaxRatios.length || relaxedTargets.size < canRelaxTargets.length)) {
    canRelaxRatios.forEach(ratio => relaxedRatios.add(ratio));
    canRelaxTargets.forEach(target => relaxedTargets.add(target.id));
    fallbackTargets = constraints();
    fallback = solvePass(fallbackTargets, activeTargets.length ? 100 : 1, fallback.state);
  }
  const misses = [
    ...exactMisses(fallback.result).filter(target => !relaxedTargets.has(target.id)),
    ...rangeMisses(fallback.result),
    ...ratios.filter(ratio => !ratioSatisfied(fallback.result, ratio)).map(ratio => ({ label: `${IONS[ratio.numerator].label}:${IONS[ratio.denominator].label}` })),
  ];
  if (misses.length) return { state: fallback.state, targets: fallbackTargets, warning: words.impossible([...new Set(misses.map(item => item.label))].join(', ')) };
  const relaxed = [
    ...exactMisses(fallback.result).filter(target => relaxedTargets.has(target.id)).map(target => target.label),
    ...ratios.filter(ratio => relaxedRatios.has(ratio) && !ratioTargetSatisfied(fallback.result, ratio))
      .map(ratio => `${IONS[ratio.numerator].label}:${IONS[ratio.denominator].label}`),
  ];
  return { state: fallback.state, targets: fallbackTargets, warning: relaxed.length ? words.relaxed(relaxed.join(', ')) : '' };
}
