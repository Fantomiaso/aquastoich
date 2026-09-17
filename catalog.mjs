import { IONS, productComposition } from './chemistry.mjs';

const ATOMIC_MASS = { H: 1.00794, O: 15.9994, N: 14.0067, P: 30.97376, S: 32.065, C: 12.0107, Cl: 35.45, Ca: 40.078, Mg: 24.305, K: 39.0983, Na: 22.98977, Fe: 55.845, Mn: 54.938, Cu: 63.546, Zn: 65.38, Co: 58.933, B: 10.81, Mo: 95.95 };
const CATIONS = [
  { ion: 'Ca', atoms: { Ca: 1 }, charge: 2 }, { ion: 'Mg', atoms: { Mg: 1 }, charge: 2 },
  { ion: 'K', atoms: { K: 1 }, charge: 1 }, { ion: 'Na', atoms: { Na: 1 }, charge: 1 },
  { ion: 'Fe', atoms: { Fe: 1 }, charge: 2 }, { ion: 'Fe', atoms: { Fe: 1 }, charge: 3 },
  { ion: 'Mn', atoms: { Mn: 1 }, charge: 2 }, { ion: 'Cu', atoms: { Cu: 1 }, charge: 2 },
  { ion: 'Zn', atoms: { Zn: 1 }, charge: 2 }, { ion: 'Co', atoms: { Co: 1 }, charge: 2 },
  { ion: 'NH4', atoms: { N: 1, H: 4 }, charge: 1 },
];
const ANIONS = [
  { ion: 'NO3', atoms: { N: 1, O: 3 }, charge: 1 },
  { ion: 'NO2', atoms: { N: 1, O: 2 }, charge: 1 },
  { ion: 'SO4', atoms: { S: 1, O: 4 }, charge: 2 },
  { ion: 'HCO3', atoms: { H: 1, C: 1, O: 3 }, charge: 1 },
  { ion: 'CO3', atoms: { C: 1, O: 3 }, charge: 2 },
  { ion: 'PO4', atoms: { H: 2, P: 1, O: 4 }, charge: 1 },
  { ion: 'PO4', atoms: { H: 1, P: 1, O: 4 }, charge: 2 },
  { ion: 'PO4', atoms: { P: 1, O: 4 }, charge: 3 },
  { ion: 'Cl', atoms: { Cl: 1 }, charge: 1 },
];
const FORMULA_NAMES = {
  KNO3: 'Нитрат калия', KH2PO4: 'Дигидрофосфат калия', NaHCO3: 'Гидрокарбонат натрия',
  K2CO3: 'Карбонат калия', K2SO4: 'Сульфат калия', CaCl2: 'Хлорид кальция',
  MgCl2: 'Хлорид магния', MgSO4: 'Сульфат магния', CaNO32: 'Нитрат кальция',
  Na2CO3: 'Карбонат натрия', NaNO3: 'Нитрат натрия', NaCl: 'Хлорид натрия',
};

export function normalizeFormula(value) {
  return String(value ?? '').trim().replace(/[₀-₉]/g, c => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(c)))
    .replace(/[⋅•*]/g, '·').replace(/\s+/g, '');
}

function atomsFromSegment(segment) {
  let position = 0;
  const read = nested => {
    const result = {};
    while (position < segment.length && segment[position] !== ')') {
      let atoms;
      if (segment[position] === '(') {
        position++;
        atoms = read(true);
        if (segment[position] !== ')') throw new Error('Проверьте скобки в формуле.');
        position++;
      } else {
        const match = /^[A-Z][a-z]?/.exec(segment.slice(position));
        if (!match || !ATOMIC_MASS[match[0]]) throw new Error(`Неизвестный элемент в формуле: ${segment.slice(position)}.`);
        atoms = { [match[0]]: 1 };
        position += match[0].length;
      }
      const digits = /^\d+/.exec(segment.slice(position));
      const multiplier = digits ? Number(digits[0]) : 1;
      if (!Number.isInteger(multiplier) || multiplier < 1 || multiplier > 1000) throw new Error('Неверный индекс в формуле.');
      if (digits) position += digits[0].length;
      for (const [atom, count] of Object.entries(atoms)) result[atom] = (result[atom] ?? 0) + count * multiplier;
    }
    if (nested && position >= segment.length) throw new Error('Проверьте скобки в формуле.');
    return result;
  };
  const atoms = read(false);
  if (position !== segment.length) throw new Error('Проверьте запись формулы.');
  return atoms;
}

function addAtoms(target, source, factor = 1) {
  for (const [atom, count] of Object.entries(source)) target[atom] = (target[atom] ?? 0) + count * factor;
  return target;
}

function sameAtoms(left, right) {
  return Object.keys({ ...left, ...right }).every(atom => (left[atom] ?? 0) === (right[atom] ?? 0));
}

export function parseSaltFormula(input) {
  const normalized = normalizeFormula(input);
  const segments = normalized.split('·');
  if (!segments[0] || segments.some(segment => !segment)) throw new Error('Укажите формулу вещества.');
  const saltAtoms = atomsFromSegment(segments[0]);
  const allAtoms = { ...saltAtoms };
  for (const segment of segments.slice(1)) {
    const match = /^(\d+)?(.+)$/.exec(segment);
    if (!match) throw new Error('Гидрат записывается как ·H2O или ·7H2O.');
    addAtoms(allAtoms, atomsFromSegment(match[2]), Number(match[1] ?? 1));
  }
  const molarMass = Object.entries(allAtoms).reduce((sum, [atom, count]) => sum + ATOMIC_MASS[atom] * count, 0);
  for (const cation of CATIONS) for (const anion of ANIONS) {
    if (!IONS[cation.ion] || !IONS[anion.ion]) continue;
    for (let c = 1; c <= 6; c++) for (let a = 1; a <= 6; a++) {
      if (c * cation.charge !== a * anion.charge) continue;
      const candidate = addAtoms(addAtoms({}, cation.atoms, c), anion.atoms, a);
      if (sameAtoms(saltAtoms, candidate)) return {
        normalized, molarMass, ions: { [cation.ion]: c, [anion.ion]: a },
        ionCharges: { [cation.ion]: cation.charge, [anion.ion]: -anion.charge },
      };
    }
  }
  throw new Error('Эта формула пока не разбирается автоматически. Укажите ионный состав вручную.');
}

export function suggestChemicalName(formula) {
  return FORMULA_NAMES[normalizeFormula(formula).replace(/[()]/g, '').split('·')[0]] ?? '';
}

export function parseManualComposition(text) {
  const result = {};
  for (const pair of String(text ?? '').split(/[;,\n]+/).map(value => value.trim()).filter(Boolean)) {
    const match = /^([A-Za-z][A-Za-z0-9]*)\s*=\s*([0-9]+(?:[.,][0-9]+)?)$/.exec(pair);
    if (!match || !IONS[match[1]]) throw new Error(`Неизвестный ион или значение: ${pair}. Используйте запись Ca=120; NO3=300.`);
    const value = Number(match[2].replace(',', '.'));
    if (!Number.isFinite(value) || value < 0) throw new Error(`Неверная концентрация: ${pair}.`);
    result[match[1]] = value;
  }
  if (!Object.keys(result).length) throw new Error('Укажите хотя бы один ион в ручном составе.');
  return result;
}

export function customProductFromForm(form) {
  const kind = form.kind;
  if (!['substance', 'dry-mixture', 'liquid-mixture'].includes(kind)) throw new Error('Выберите тип вещества или смеси.');
  const name = String(form.name ?? '').trim();
  if (!name) throw new Error('Укажите химическое название или название готовой смеси.');
  if (kind === 'substance') {
    const forms = Array.isArray(form.forms) && form.forms.length ? form.forms : [{ formula: form.formula, solubility: form.solubility }];
    const manual = String(form.manualComposition ?? '').trim();
    if (manual && forms.length > 1) throw new Error('Ручной ионный состав можно задать только для одной формы. Для других форм создайте отдельные записи.');
    const variants = forms.map((item, index) => {
      let parsed;
      try { parsed = parseSaltFormula(item.formula); }
      catch (error) {
        if (!manual || !normalizeFormula(item.formula)) throw error;
        parsed = { normalized: normalizeFormula(item.formula), ions: {}, ionCharges: {}, molarMass: 0 };
      }
      const solubility = Number(item.solubility);
      if (!Number.isFinite(solubility) || solubility <= 0) throw new Error(`Укажите растворимость формы ${index + 1} при 20 °C.`);
      return { id: `form-${index + 1}`, name: parsed.normalized, formula: parsed.ions, molarMass: parsed.molarMass,
        ionCharges: parsed.ionCharges, solubilityGPerL: solubility,
        ...(manual ? { composition: parseManualComposition(manual) } : {}) };
    });
    const bases = new Set(variants.map(item => normalizeFormula(item.name).split('·')[0]));
    if (bases.size !== 1) throw new Error('Формы одного вещества должны иметь одинаковую основную формулу до знака ·. Для разных солей создайте смесь.');
    if (new Set(variants.map(item => item.name)).size !== variants.length) throw new Error('Одна и та же форма указана дважды.');
    return { id: form.id || `custom-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`,
      custom: true, kind, type: 'dry', group: 'Мои вещества', name, aliases: String(form.aliases ?? '').trim(),
      short: variants[0].name.split('·')[0], formulaText: variants.map(item => item.name).join(' / '), variants,
      solubilityGPerL: variants[0].solubilityGPerL, solubilityTemperatureC: 20,
      unknownCounterions: Boolean(manual), manualComposition: manual,
      note: manual ? 'Ионный состав указан вручную.' : 'Ионный состав каждой формы рассчитан по её формуле. Растворимость указана отдельно для каждой формы.' };
  }
  const solubility = Number(form.solubility);
  if (!Number.isFinite(solubility) || solubility <= 0) throw new Error('Укажите растворимость при 20 °C в г/л.');
  const components = Array.isArray(form.components) ? form.components.filter(item => String(item.formula ?? '').trim()) : [];
  if (!components.length || components.some(item => !normalizeFormula(item.formula))) throw new Error('Укажите формулу каждого компонента.');
  const type = kind === 'liquid-mixture' ? 'liquid' : 'dry';
  const manual = String(form.manualComposition ?? '').trim();
  const composition = manual ? parseManualComposition(manual) : {};
  const ionCharges = {};
  let totalPercent = 0;
  if (!manual) for (const item of components) {
    const amount = Number(item.amount);
    if (!Number.isFinite(amount) || amount <= 0) throw new Error('Количество каждого компонента должно быть больше нуля.');
    if (type === 'dry') totalPercent += amount;
    const parsed = parseSaltFormula(item.formula);
    const factor = type === 'dry' ? amount / 100 : amount / 1000;
    for (const [ion, count] of Object.entries(parsed.ions)) {
      const mgPerG = 1000 * count * IONS[ion].molarMass / parsed.molarMass;
      composition[ion] = (composition[ion] ?? 0) + mgPerG * factor;
      ionCharges[ion] = parsed.ionCharges[ion];
    }
  }
  if (!manual && type === 'dry' && totalPercent > 100.00001) throw new Error('Сумма долей сухой смеси не может превышать 100%.');
  if (manual && !components.every(item => normalizeFormula(item.formula))) throw new Error('Формула обязательна даже при ручном ионном составе.');
  const formulaText = components.map(item => normalizeFormula(item.formula)).join(' + ');
  const product = {
    id: form.id || `custom-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`,
    custom: true, name, aliases: String(form.aliases ?? '').trim(), short: formulaText.length <= 14 ? formulaText : 'Смесь',
    formulaText, solubilityGPerL: solubility, solubilityTemperatureC: 20,
    type, group: kind === 'substance' ? 'Мои вещества' : 'Мои смеси', composition, ionCharges,
    unknownCounterions: Boolean(manual), note: manual ? 'Ионный состав введён вручную.' : `Состав рассчитан по формулам: ${formulaText}.`,
    components: components.map(item => ({ formula: normalizeFormula(item.formula), amount: Number(item.amount) })), kind,
    manualComposition: manual,
  };
  return product;
}

export const EFFECTS = [
  ['GH', 'GH', '+'], ['GH-', 'GH', '−'], ['KH', 'KH', '+'], ['KH-', 'KH', '−'], ['pH-', 'pH', '−'],
  ['Ca', 'Ca²⁺', '+'], ['Ca-', 'Ca²⁺', '−'], ['Mg', 'Mg²⁺', '+'], ['Mg-', 'Mg²⁺', '−'],
  ['macro', 'Макроэлементы', '+'], ['K', 'K⁺', '+'], ['NO3', 'NO₃⁻', '+'], ['PO4', 'PO₄ (Σ)', '+'], ['Fe', 'Fe (Σ)', '+'],
  ['NO3-', 'NO₃⁻', '−'], ['PO4-', 'PO₄ (Σ)', '−'], ['NH4-', 'NH₄⁺', '−'], ['NO2-', 'NO₂⁻', '−'],
  ['micro', 'Микроэлементы', '+'], ['SO4', 'SO₄²⁻', '+'], ['Cl', 'Cl⁻', '+'], ['Na', 'Na⁺', '+'],
  ['NH4', 'NH₄⁺', '+'], ['NO2', 'NO₂⁻', '+'], ['HCO3', 'HCO₃⁻', '+'], ['CO3', 'CO₃²⁻', '+'],
  ['Mn', 'Mn (Σ)', '+'], ['Cu', 'Cu (Σ)', '+'], ['Cu-', 'Cu (Σ)', '−'], ['B', 'B (Σ)', '+'], ['Zn', 'Zn (Σ)', '+'], ['Zn-', 'Zn (Σ)', '−'],
];

export const effectParts = key => {
  const [, label, action] = EFFECTS.find(([id]) => id === key) ?? [key, key, ''];
  return { label, action };
};

export function productEffects(product) {
  if (product.referenceOnly) return product.effects ?? [];
  const compositions = product.variants?.length
    ? product.variants.map(variant => productComposition(product, variant.id))
    : [productComposition(product)];
  const composition = Object.fromEntries(compositions.flatMap(item => Object.entries(item)).filter(([, value]) => value > 0));
  const positive = ion => (composition[ion] ?? 0) > 1e-9;
  const effects = [];
  if (positive('Ca') || positive('Mg')) effects.push('GH');
  if (positive('HCO3') || positive('CO3')) effects.push('KH');
  if ((product.acidMeqPerUnit ?? 0) > 0 || product.variants?.some(variant => (variant.acidMeqPerUnit ?? 0) > 0)) effects.push('KH-', 'pH-');
  if (['K', 'NO3', 'PO4', 'NH4'].some(positive)) effects.push('macro');
  for (const ion of ['Ca', 'Mg', 'K', 'NO3', 'PO4', 'Fe', 'SO4', 'Cl', 'Na', 'NH4', 'NO2', 'HCO3', 'CO3', 'Mn', 'Cu', 'B', 'Zn']) if (positive(ion)) effects.push(ion);
  if (['Mn', 'B', 'Mo', 'Cu', 'Zn', 'Co'].some(positive)) effects.push('micro');
  return effects;
}

export const CATALOG_SORTS = [
  ['name', 'По названию'], ['effect', 'По эффекту'], ['type', 'По типу'],
];

export function productKind(product) {
  if (product.referenceOnly) return product.type === 'media' ? 'Фильтрующий материал' : 'Смесь';
  if (product.type === 'liquid') return 'Раствор';
  if (product.kind === 'dry-mixture' || product.type === 'dry' && !product.variants?.length) return 'Смесь';
  return 'Вещество';
}

const EFFECT_PRIORITY = ['KH-', 'GH-', 'pH-', 'NO3-', 'PO4-', 'NH4-', 'NO2-', 'Ca-', 'Mg-', 'Cu-', 'Zn-',
  'GH', 'KH', 'NO3', 'PO4', 'K', 'Fe', 'NH4', 'Ca', 'Mg', 'micro', 'SO4', 'Cl', 'Na', 'macro'];
const labelForEffect = key => {
  const { label, action } = effectParts(key);
  return action ? `${action} · ${label}` : label;
};

export function primaryEffect(product, selectedEffect = '') {
  const effects = productEffects(product);
  const key = selectedEffect && effects.includes(selectedEffect)
    ? selectedEffect : EFFECT_PRIORITY.find(item => effects.includes(item)) ?? effects[0];
  return key ? labelForEffect(key) : 'Прочее';
}

export function sortedProducts(products, mode = 'name', selectedEffect = '', locale = 'ru', nameOf = product => product.name) {
  const collator = new Intl.Collator(locale, { sensitivity: 'base', numeric: true });
  const kindOrder = { 'Вещество': 0, 'Смесь': 1, 'Раствор': 2, 'Фильтрующий материал': 3 };
  return [...products].sort((left, right) => {
    if (mode === 'effect') {
      const compared = collator.compare(primaryEffect(left, selectedEffect), primaryEffect(right, selectedEffect));
      if (compared) return compared;
    }
    if (mode === 'type') {
      const compared = (kindOrder[productKind(left)] ?? 9) - (kindOrder[productKind(right)] ?? 9);
      if (compared) return compared;
    }
    return collator.compare(nameOf(left), nameOf(right));
  });
}
