import { IONS, PRODUCTS, PRODUCT_BY_ID, TARGETS, RATIO_IONS, DEFAULT_PH_CO2_MG_L, activeRatios, actualRatio, ratioLimits, ratioSatisfied, ratioTargetSatisfied, targetLimits, invertRatio, number, stockGramsPerL, displayDoseToAmount, calculate, calibratePHCO2, ghFromIons, khFromIons, khFromProduct, productComposition, setCustomProducts, solveTargets } from './chemistry.mjs';
import { EFFECTS, CATALOG_SORTS, customProductFromForm, effectParts, normalizeFormula, primaryEffect, productEffects, productKind, sortedProducts, suggestChemicalName } from './catalog.mjs';
import { PRESETS, getPresets, mergePresets, normalizeUserPreset } from './presets.mjs';
import { JOURNAL_TESTS, journalDifference } from './journal.mjs';
import { getLocale, intlLocale, startLocalization, translate } from './localization.mjs';
import { estimateAquariumVolume, makeAquarium } from './aquarium.mjs';
import { journalXlsx } from './journal-export.mjs';
import { LIGHT_CHANNELS, MAX_LIGHT_CHANNELS, channelName, validLightChannels } from './light-channels.mjs';

const STORAGE_KEY = 'rem-aquarium-v1';
const $ = selector => document.querySelector(selector);
const SOURCE_IONS = ['Ca', 'Mg', 'K', 'Na', 'NH4', 'NO2', 'NO3', 'PO4', 'HCO3', 'CO3', 'SO4', 'Cl', 'Fe', 'Mn'];
const SUMMARY_GROUPS = [
  { title: 'Катионы', ions: [['Ca', 'Ca²⁺ · кальций'], ['Mg', 'Mg²⁺ · магний'], ['K', 'K⁺ · калий'], ['Na', 'Na⁺ · натрий'], ['NH4', 'NH₄⁺ · аммоний']] },
  { title: 'Кислотные остатки', ions: [['Cl', 'Cl⁻ · хлорид'], ['SO4', 'SO₄²⁻ · сульфат'], ['NO2', 'NO₂⁻ · нитрит'], ['NO3', 'NO₃⁻ · нитрат'], ['PO4', 'PO₄ · фосфат'], ['HCO3', 'HCO₃⁻ · гидрокарбонат'], ['CO3', 'CO₃²⁻ · карбонат']] },
  { title: 'Микроэлементы', ions: [['Fe', 'Fe · железо'], ['Mn', 'Mn · марганец'], ['B', 'B · бор'], ['Mo', 'Mo · молибден'], ['Cu', 'Cu · медь'], ['Zn', 'Zn · цинк'], ['Co', 'Co · кобальт']] },
];
const makeRow = id => ({ id, enabled: true, mode: 'auto', locked: false, dose: 0, doseMode: PRODUCT_BY_ID[id].preferDry ? 'dry' : 'stock', variant: PRODUCT_BY_ID[id].variants?.[0]?.id, purity: 100, stockGrams: 25, stockMl: 500, desiredMl: 5 });
const defaultRatios = () => [
  { id: 'ca-mg', numerator: 'Ca', denominator: 'Mg', target: '' },
  { id: 'k-na', numerator: 'K', denominator: 'Na', target: '' },
  { id: 'no3-po4', numerator: 'NO3', denominator: 'PO4', target: '' },
];
const initialState = () => {
  const aquarium = makeAquarium(`${translate('Аквариум')} 1`);
  return { mode: 'prepare', volume: 100, tankVolume: 100, tankGH: '', tankKH: '', tankPH: '', tankTDS: '', tank: {}, aquariums: [aquarium], activeAquariumId: aquarium.id, sourceGH: 0, sourceKH: 0, sourcePH: '', sourceTDS: '', phCO2: DEFAULT_PH_CO2_MG_L, measuredPH: '', calibration: null, phModelV2: true, source: {}, targets: { GH: 6, KH: 3 }, targetRanges: {}, ratios: defaultRatios(), selectedPresets: [], userPresets: [], presetBackups: {}, presetTargetBackups: {}, presetWaterTargetsV1: true, customProducts: [], journal: [], customTests: [], customLightChannels: [], ratioPresetsV4: true, rows: [makeRow('watersci-gh'), makeRow('watersci-kh')] };
};

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored || !Array.isArray(stored.rows)) return initialState();
    setCustomProducts(stored.customProducts ?? []);
    const ratios = Array.isArray(stored.ratios) ? [...stored.ratios] : defaultRatios();
    if (!stored.ratioPresetsV3) {
      const oldIndex = ratios.findIndex(ratio => ratio.id === 'po4-no3' && ratio.numerator === 'PO4' && ratio.denominator === 'NO3');
      if (oldIndex >= 0) {
        const old = ratios[oldIndex];
        const entered = [old.target, old.min, old.max].filter(value => value !== '' && value != null).map(value => number(value, NaN));
        const converted = entered.some(value => value >= 1)
          ? { ...old, numerator: 'NO3', denominator: 'PO4' }
          : invertRatio(old);
        if (converted) ratios[oldIndex] = { ...converted, id: 'no3-po4' };
      }
      if (!ratios.some(ratio => ratio.numerator === 'NO3' && ratio.denominator === 'PO4')) ratios.push(defaultRatios()[2]);
    }
    // Correct values saved by the short-lived V3 migration: entries such as
    // 12:1 were inverted even though they were already intended as NO₃:PO₄.
    if (stored.ratioPresetsV3 && !stored.ratioPresetsV4) {
      const index = ratios.findIndex(ratio => ratio.id === 'no3-po4' && ratio.numerator === 'NO3' && ratio.denominator === 'PO4');
      if (index >= 0) {
        const ratio = ratios[index];
        const entered = [ratio.target, ratio.min, ratio.max].filter(value => value !== '' && value != null).map(value => number(value, NaN));
        if (entered.length && entered.every(value => value > 0 && value < 1)) {
          const restored = invertRatio(ratio);
          if (restored) ratios[index] = { ...ratio, target: restored.target, min: restored.min, max: restored.max };
        }
      }
    }
    const base = initialState();
    const aquariums = Array.isArray(stored.aquariums) && stored.aquariums.length
      ? stored.aquariums : [makeAquarium(`${translate('Аквариум')} 1`, stored)];
    const activeAquariumId = aquariums.some(item => item.id === stored.activeAquariumId)
      ? stored.activeAquariumId : aquariums[0].id;
    const active = aquariums.find(item => item.id === activeAquariumId);
    const userPresets = (Array.isArray(stored.userPresets) ? stored.userPresets : []).flatMap(item => {
      try { return [normalizeUserPreset(item)]; } catch { return []; }
    });
    const targets = { ...(stored.targets ?? {}) };
    const targetRanges = { ...(stored.targetRanges ?? {}) };
    const presetTargetBackups = { ...(stored.presetTargetBackups ?? {}) };
    if (!stored.presetWaterTargetsV1 && stored.selectedPresets?.length) {
      for (const item of mergePresets(stored.selectedPresets, getLocale(), userPresets).targets) {
        presetTargetBackups[item.id] = { target: targets[item.id] ?? '', range: { ...(targetRanges[item.id] ?? {}) } };
        targets[item.id] = item.target;
        targetRanges[item.id] = { min: item.min, max: item.max };
      }
    }
    return { ...base, ...stored, mode: stored.mode === 'change' ? 'change' : 'prepare',
      aquariums, activeAquariumId, tankVolume: active.tankVolume, tankGH: active.tankGH,
      tankKH: active.tankKH, tankPH: active.tankPH, tankTDS: active.tankTDS ?? '', tank: { ...(active.tank ?? {}) },
      customProducts: stored.customProducts ?? [],
      journal: (stored.journal ?? []).map(entry => ({ ...entry, aquariumId: entry.aquariumId ?? activeAquariumId })),
      customTests: stored.customTests ?? [], customLightChannels: Array.isArray(stored.customLightChannels) ? stored.customLightChannels : [], selectedPresets: stored.selectedPresets ?? [], userPresets,
      phCO2: stored.phModelV2 && stored.phCO2 != null ? stored.phCO2 : DEFAULT_PH_CO2_MG_L,
      phModelV2: true, source: stored.source ?? {}, targets, targetRanges, presetTargetBackups, presetWaterTargetsV1: true, ratios,
      ratioPresetsV3: true, ratioPresetsV4: true,
      rows: stored.rows.filter(row => PRODUCT_BY_ID[row.id]).map(row => ({ ...makeRow(row.id), ...row })) };
  } catch { return initialState(); }
}

let state = loadState();
let solverWarning = '';
let selectedResultId = null;
let editingMeasurementId = null;
let journalDraft = { values: {}, notes: {} };
let lightChannelDraft = [];
let editingProductId = null;
let componentDraft = [{ formula: '', amount: '' }];
let additionalForms = [];
let presetDraft = null;
let presetOriginalName = '';
const nf = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 3 });
const fmt = (value, digits = 3) => new Intl.NumberFormat(intlLocale(), { maximumFractionDigits: digits }).format(Math.abs(value) < 1e-9 ? 0 : value);
const raw = value => Number.isFinite(value) ? String(Math.round(value * 1e8) / 1e8) : '0';
const rawDose = value => Number.isFinite(value) ? String(Math.round(value * 1e5) / 1e5) : '0';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const effectTag = key => {
  const { label, action } = effectParts(key);
  return `<span class="effect-tag"><span class="effect-action ${action === '−' ? 'decrease' : ''}" aria-label="${action === '−' ? translate('Снижает') : translate('Повышает')}">${action}</span><span>${esc(translate(label))}</span></span>`;
};

const activeAquarium = () => state.aquariums.find(item => item.id === state.activeAquariumId) ?? state.aquariums[0];
function syncAquariumProfile() {
  const profile = activeAquarium();
  if (!profile) return;
  for (const key of ['tankVolume', 'tankGH', 'tankKH', 'tankPH', 'tankTDS']) profile[key] = state[key];
  profile.tank = { ...state.tank };
}
function applyAquariumProfile(profile) {
  if (!profile) return;
  state.activeAquariumId = profile.id;
  for (const key of ['tankVolume', 'tankGH', 'tankKH', 'tankPH', 'tankTDS']) state[key] = profile[key] ?? '';
  state.tank = { ...(profile.tank ?? {}) };
}
function save() { try { syncAquariumProfile(); localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* private browsing */ } }
function getRow(id) { return state.rows.find(row => row.id === id); }
function hasConstraints() { return TARGETS.some(target => !!targetLimits(state.targets?.[target.id], state.targetRanges?.[target.id])) || activeRatios(state).length > 0; }
function missingTankInputs() {
  if (state.mode !== 'change') return [];
  const ids = new Set(TARGETS.filter(target => !!targetLimits(state.targets?.[target.id], state.targetRanges?.[target.id])).map(target => target.id));
  activeRatios(state).forEach(ratio => { ids.add(ratio.numerator); ids.add(ratio.denominator); });
  return [...ids].filter(id => id === 'GH' ? state.tankGH === '' || state.tankGH == null
    : id === 'KH' ? state.tankKH === '' || state.tankKH == null
      : id === 'TDS' ? state.tankTDS === '' || state.tankTDS == null : state.tank?.[id] === '' || state.tank?.[id] == null);
}

function renderRatios() {
  const options = selected => RATIO_IONS.map(ion => `<option value="${ion}" ${selected === ion ? 'selected' : ''}>${IONS[ion].label}</option>`).join('');
  $('#ratio-fields').innerHTML = state.ratios.map(ratio => `<div class="ratio-item" data-ratio-row="${esc(ratio.id)}"><div class="ratio-input-row"><select aria-label="Первый ион" data-ratio="${esc(ratio.id)}" data-key="numerator">${options(ratio.numerator)}</select><span class="ratio-separator">:</span><select aria-label="Второй ион" data-ratio="${esc(ratio.id)}" data-key="denominator">${options(ratio.denominator)}</select><span class="ratio-equals">=</span><input aria-label="Целевое соотношение к одному" title="Программа сначала подбирает точную цель; диапазон используется при конфликте с остальными целями" data-ratio="${esc(ratio.id)}" data-key="target" type="number" min="0" step="any" placeholder="—" value="${esc(ratio.target ?? '')}"><span class="ratio-one">:1</span><button type="button" data-ratio-remove="${esc(ratio.id)}" aria-label="Удалить соотношение" class="ratio-remove">×</button></div><details class="ratio-range" ${ratio.min !== '' && ratio.min != null || ratio.max !== '' && ratio.max != null ? 'open' : ''}><summary>Допустимый диапазон</summary><div class="ratio-range-fields"><label>от <input aria-label="Нижняя граница соотношения к одному" data-ratio="${esc(ratio.id)}" data-key="min" type="number" min="0" step="any" placeholder="—" value="${esc(ratio.min ?? '')}"></label><label>до <input aria-label="Верхняя граница соотношения к одному" data-ratio="${esc(ratio.id)}" data-key="max" type="number" min="0" step="any" placeholder="—" value="${esc(ratio.max ?? '')}"></label><span>:1</span></div></details></div>`).join('');
}

function buildStaticFields() {
  $('#target-fields').innerHTML = TARGETS.map(target => `<div class="target-item"><label class="field"><span>${target.label}</span><div class="input-unit"><input data-target="${target.id}" type="number" min="0" step="any" placeholder="—"><span>${target.unit}</span></div></label><details class="target-range" ${state.targetRanges?.[target.id]?.min !== '' && state.targetRanges?.[target.id]?.min != null || state.targetRanges?.[target.id]?.max !== '' && state.targetRanges?.[target.id]?.max != null ? 'open' : ''}><summary aria-label="Допустимый диапазон" title="Допустимый диапазон">Диапазон</summary><div class="target-range-fields"><label>min <input aria-label="${translate('Нижняя граница')}: ${target.label}" data-target-bound="${target.id}" data-bound="min" type="number" min="0" step="any" placeholder="—"></label><label>max <input aria-label="${translate('Верхняя граница')}: ${target.label}" data-target-bound="${target.id}" data-bound="max" type="number" min="0" step="any" placeholder="—"></label></div></details></div>`).join('');
  $('#source-fields').innerHTML = SOURCE_IONS.map(ion => `<label class="field"><span>${IONS[ion].label}</span><div class="input-unit"><input data-source="${ion}" type="number" min="0" step="any" placeholder="0"><span>мг/л</span></div></label>`).join('');
  $('#tank-fields').innerHTML = SOURCE_IONS.map(ion => `<label class="field"><span>${IONS[ion].label}</span><div class="input-unit"><input data-tank="${ion}" type="number" min="0" step="any" placeholder="—"><span>мг/л</span></div></label>`).join('');
  for (const id of ['catalog-effect', 'database-effect']) $('#'+id).innerHTML = `<option value="">Все эффекты</option>${EFFECTS.map(([key, label, action]) => `<option value="${key}">${action} · ${esc(translate(label))}</option>`).join('')}`;
  for (const id of ['catalog-sort', 'database-sort']) $('#'+id).innerHTML = CATALOG_SORTS.map(([key, label]) => `<option value="${key}">${label}</option>`).join('');
  renderCatalog();
  renderPresets();
}

function renderCatalog() {
  const search = $('#catalog-search').value.trim().toLowerCase();
  const effect = $('#catalog-effect').value;
  const sortMode = $('#catalog-sort').value;
  const selected = $('#catalog').value;
  const available = sortedProducts(PRODUCTS.filter(product => !product.referenceOnly
    && (!search || `${product.name} ${translate(product.name)} ${product.aliases ?? ''} ${translate(product.aliases ?? '')} ${product.formulaText ?? product.short} ${product.variants?.map(item => item.name).join(' ') ?? ''}`.toLowerCase().includes(search))
    && (!effect || productEffects(product).includes(effect))), sortMode, effect, intlLocale(), product => translate(product.name));
  const option = product => `<option value="${esc(product.id)}" ${state.rows.some(row => row.id === product.id) ? 'disabled' : ''}>${esc(translate(product.name))}${product.aliases ? ` · ${esc(translate(product.aliases))}` : ''}</option>`;
  if (sortMode === 'name') $('#catalog').innerHTML = available.map(option).join('');
  else {
    const groupOf = product => sortMode === 'effect' ? primaryEffect(product, effect) : productKind(product);
    const groups = [...new Set(available.map(groupOf))];
    $('#catalog').innerHTML = groups.map(group => `<optgroup label="${esc(group)}">${available.filter(product => groupOf(product) === group).map(option).join('')}</optgroup>`).join('');
  }
  if ([...$('#catalog').options].some(option => option.value === selected && !option.disabled)) $('#catalog').value = selected;
  else $('#catalog').selectedIndex = [...$('#catalog').options].findIndex(option => !option.disabled);
  $('#add-product').disabled = !$('#catalog').value;
}

function renderPresets() {
  const shown = value => value === '' || value == null ? '—' : fmt(value);
  $('#preset-list').innerHTML = getPresets(state.userPresets).map(preset => {
    const targetPreview = Object.entries(preset.targets ?? {}).map(([id, [target, min, max]]) => `${IONS[id]?.label ?? id} ${shown(target)}${min !== '' && min != null || max !== '' && max != null ? ` [${shown(min)}–${shown(max)}]` : ''}`);
    const ratioPreview = (preset.ratios ?? []).map(({ pair, target, min, max }) => `${pair.split(':').map(id => IONS[id]?.label ?? id).join(':')} ${shown(target)}:1${min !== '' && min != null || max !== '' && max != null ? ` [${shown(min)}–${shown(max)}]` : ''}`);
    const preview = [...targetPreview, ...ratioPreview].join(' · ');
    const name = preset.userNamed ? preset.name : translate(preset.name);
    return `<div class="preset-option"><label class="check-line"><input type="checkbox" data-preset="${esc(preset.id)}" ${state.selectedPresets.includes(preset.id) ? 'checked' : ''}><span>${esc(name)}${preset.edited || preset.custom ? ` <i>${translate('мой')}</i>` : ''}<small>${esc(preview)}</small></span></label><button type="button" class="text-button preset-edit" data-preset-edit="${esc(preset.id)}" aria-label="${translate('Изменить пресет')}: ${esc(name)}">${translate('Изменить')}</button></div>`;
  }).join('');
  const merged = mergePresets(state.selectedPresets, getLocale(), state.userPresets);
  $('#preset-warning').innerHTML = [...merged.conflicts.map(value => `${translate('Несовместимо:')} ${esc(value)}`), ...merged.notices.map(esc)].join('<br>');
  $('#preset-warning').classList.toggle('conflict', merged.conflicts.length > 0);
}

function readPresetForm() {
  if (!presetDraft) return null;
  const targets = {};
  for (const checkbox of $('#preset-target-editor').querySelectorAll('[data-preset-target-enabled]:checked')) {
    const id = checkbox.dataset.presetTargetEnabled;
    targets[id] = ['target', 'min', 'max'].map(key => $('#preset-target-editor').querySelector(`[data-preset-target-id="${id}"][data-preset-value="${key}"]`).value);
  }
  const ratios = [...$('#preset-ratio-editor').querySelectorAll('[data-preset-ratio-row]')].map(row => {
    const value = key => row.querySelector(`[data-preset-ratio-key="${key}"]`).value;
    return { pair: `${value('numerator')}:${value('denominator')}`, target: value('target'), min: value('min'), max: value('max') };
  });
  return { ...presetDraft, name: $('#preset-name').value, targets, ratios };
}

function renderPresetEditor() {
  const editor = $('#preset-editor');
  editor.hidden = !presetDraft;
  if (!presetDraft) return;
  const builtIn = PRESETS.some(item => item.id === presetDraft.id);
  $('#preset-editor-title').textContent = translate(builtIn ? 'Изменить пресет' : state.userPresets.some(item => item.id === presetDraft.id) ? 'Изменить пресет' : 'Новый пресет');
  $('#preset-name').value = presetDraft.name;
  $('#preset-target-editor').innerHTML = TARGETS.map(item => {
    const values = presetDraft.targets[item.id] ?? ['', '', ''];
    return `<div class="preset-target-row" data-preset-target-row="${item.id}"><label><input type="checkbox" data-preset-target-enabled="${item.id}" ${Object.hasOwn(presetDraft.targets, item.id) ? 'checked' : ''}>${item.label}</label>${['target', 'min', 'max'].map((key, index) => `<input type="number" min="0" step="any" placeholder="—" data-preset-target-id="${item.id}" data-preset-value="${key}" aria-label="${esc(`${item.label}: ${translate(key === 'target' ? 'Цель' : key === 'min' ? 'Нижняя граница' : 'Верхняя граница')}`)}" value="${esc(values[index] ?? '')}" ${Object.hasOwn(presetDraft.targets, item.id) ? '' : 'disabled'}>`).join('')}</div>`;
  }).join('');
  const options = selected => RATIO_IONS.map(ion => `<option value="${ion}" ${ion === selected ? 'selected' : ''}>${IONS[ion].label}</option>`).join('');
  $('#preset-ratio-editor').innerHTML = presetDraft.ratios.map((item, index) => {
    const [numerator, denominator] = item.pair.split(':');
    return `<div class="preset-ratio-row" data-preset-ratio-row="${index}"><div class="preset-ratio-pair"><select data-preset-ratio-key="numerator" aria-label="${translate('Первый ион')}">${options(numerator)}</select><span>:</span><select data-preset-ratio-key="denominator" aria-label="${translate('Второй ион')}">${options(denominator)}</select><button type="button" class="icon-button" data-preset-ratio-remove="${index}" aria-label="${translate('Удалить соотношение')}">×</button></div><div class="preset-ratio-values">${['target', 'min', 'max'].map(key => `<label><span>${translate(key === 'target' ? 'Цель' : key)}</span><input type="number" min="0" step="any" placeholder="—" data-preset-ratio-key="${key}" value="${esc(item[key] ?? '')}"></label>`).join('')}</div></div>`;
  }).join('');
  $('#preset-reset').hidden = !builtIn || !state.userPresets.some(item => item.id === presetDraft.id);
  $('#preset-delete').hidden = builtIn || !state.userPresets.some(item => item.id === presetDraft.id);
  $('#preset-editor-error').textContent = '';
}

function startPresetEditor(id = null) {
  if (id) {
    const preset = getPresets(state.userPresets).find(item => item.id === id);
    if (!preset) return;
    const name = preset.userNamed ? preset.name : translate(preset.name);
    presetDraft = { id, name, userNamed: Boolean(preset.userNamed), targets: structuredClone(preset.targets), ratios: structuredClone(preset.ratios) };
    presetOriginalName = name;
  } else {
    presetDraft = { id: `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, name: '', userNamed: true, targets: {}, ratios: [] };
    presetOriginalName = '';
  }
  renderPresetEditor();
  $('#preset-name').focus();
}

const presetErrors = {
  'preset-id': 'Недопустимый идентификатор пресета.', 'preset-name': 'Введите название пресета (до 80 символов).',
  'preset-target': 'Неизвестный параметр воды.', 'preset-ratio': 'Проверьте список пропорций.',
  'preset-number': 'Введите неотрицательное число.', 'preset-empty-row': 'Введите цель или границу диапазона.',
  'preset-bounds': 'Цель должна находиться в диапазоне min–max.', 'preset-pair': 'Выберите разные ионы без повторения пары.',
  'preset-empty': 'Добавьте хотя бы один параметр или соотношение.',
};

function savePresetEditor() {
  if (!presetDraft) return;
  const input = readPresetForm();
  const builtIn = PRESETS.find(item => item.id === input.id);
  const prior = state.userPresets.find(item => item.id === input.id);
  input.userNamed = !builtIn || input.name.trim() !== presetOriginalName || Boolean(prior?.userNamed);
  if (builtIn && !input.userNamed) input.name = builtIn.name;
  let preset;
  try { preset = normalizeUserPreset(input); }
  catch (reason) {
    const label = presetErrors[reason.message] ?? 'Проверьте данные пресета.';
    $('#preset-editor-error').textContent = `${reason.field ? `${reason.field}: ` : ''}${translate(label)}`;
    return;
  }
  state.userPresets = state.userPresets.filter(item => item.id !== preset.id);
  state.userPresets.push(preset);
  if (!state.selectedPresets.includes(preset.id)) state.selectedPresets.push(preset.id);
  presetDraft = null;
  renderPresetEditor();
  applySelectedPresets();
}

function renderMode() {
  document.querySelectorAll('[data-calc-mode]').forEach(button => {
    const active = button.dataset.calcMode === state.mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  $('#tank-panel').hidden = state.mode !== 'change';
  $('#source-heading').textContent = state.mode === 'change' ? 'Исходная вода для подмены' : 'Исходная вода';
  $('#volume-label').textContent = state.mode === 'change' ? 'Объём подменяемой воды' : 'Объём приготовляемой воды';
  $('#target-scope').textContent = state.mode === 'change' ? 'Цели после подмены в аквариуме' : 'Целевые параметры';
  $('#measured-ph-label').textContent = state.mode === 'change' ? 'Фактический pH в аквариуме после подмены' : 'Фактический pH после смешивания';
  $('.ph-note').textContent = state.mode === 'change'
    ? 'pH после подмены — оценка по итоговому KH, фосфату и CO₂ при 25 °C. Измеренный pH можно использовать для калибровки.'
    : 'pH приготовленной воды — оценка по KH, фосфату и CO₂ при 25 °C. Измеренный pH после смешивания можно использовать для калибровки.';
}

function syncStaticFields() {
  $('#volume').value = raw(number(state.volume, 100));
  $('#tank-volume').value = raw(number(state.tankVolume, 100));
  $('#tank-gh').value = state.tankGH ?? '';
  $('#tank-kh').value = state.tankKH ?? '';
  $('#tank-ph').value = state.tankPH ?? '';
  $('#tank-tds').value = state.tankTDS ?? '';
  $('#source-gh').value = raw(number(state.sourceGH));
  $('#source-kh').value = raw(number(state.sourceKH));
  $('#source-ph').value = state.sourcePH ?? '';
  $('#source-tds').value = state.sourceTDS ?? '';
  $('#ph-co2').value = state.phCO2 ?? DEFAULT_PH_CO2_MG_L;
  $('#measured-ph').value = state.measuredPH ?? '';
  document.querySelectorAll('[data-target]').forEach(input => { input.value = state.targets[input.dataset.target] ?? ''; });
  document.querySelectorAll('[data-target-bound]').forEach(input => { input.value = state.targetRanges?.[input.dataset.targetBound]?.[input.dataset.bound] ?? ''; });
  document.querySelectorAll('[data-source]').forEach(input => { input.value = state.source[input.dataset.source] ?? ''; });
  document.querySelectorAll('[data-tank]').forEach(input => { input.value = state.tank[input.dataset.tank] ?? ''; });
  renderMode();
}

function rowHtml(row) {
  const product = PRODUCT_BY_ID[row.id];
  const dry = product.type === 'dry';
  const doseUnit = dry && row.doseMode === 'dry' ? 'г' : 'мл';
  const disabled = row.locked ? 'disabled' : '';
  const variantField = product.variants?.length
    ? `<label class="mini-field"><span>Форма соли</span><select data-row="${row.id}" data-key="variant" ${disabled}>${product.variants.map(item => `<option value="${esc(item.id)}" ${row.variant === item.id ? 'selected' : ''}>${esc(item.name)}</option>`).join('')}</select></label>`
    : `<label class="mini-field"><span>Формула</span><input value="${esc(product.formulaText ?? product.short)}" readonly></label>`;
  const options = dry ? `<details class="reagent-options" ${row.optionsOpen ? 'open' : ''}><summary>Форма и маточник <span data-stock-display="${row.id}">${row.doseMode === 'stock' ? `${fmt(stockGramsPerL(row), 1)} г/л` : 'сухое внесение'}</span></summary><div class="option-grid"><label class="mini-field"><span>Внесение</span><select data-row="${row.id}" data-key="doseMode" ${disabled}><option value="stock" ${row.doseMode === 'stock' ? 'selected' : ''}>Маточник</option><option value="dry" ${row.doseMode === 'dry' ? 'selected' : ''}>Сухая соль</option></select></label>${variantField}<label class="mini-field"><span>Чистота, %</span><input data-row="${row.id}" data-key="purity" type="number" min="0" max="100" step="any" value="${esc(row.purity)}" ${disabled}></label></div>${row.doseMode === 'stock' ? `<div class="option-grid stock-grid"><label class="mini-field"><span>Навеска, г</span><input data-row="${row.id}" data-key="stockGrams" type="number" min="0" step="any" value="${esc(rawDose(number(row.stockGrams)))}" ${disabled}></label><label class="mini-field"><span>Раствор, мл</span><input data-row="${row.id}" data-key="stockMl" type="number" min="0.001" step="any" value="${esc(row.stockMl)}" ${disabled}></label><label class="mini-field"><span>Удобная доза, мл</span><input data-row="${row.id}" data-key="desiredMl" type="number" min="0.001" step="any" value="${esc(row.desiredMl)}" ${disabled}></label></div><button type="button" class="text-button" data-action="fit-stock" data-id="${row.id}" ${disabled}>Подобрать навеску</button>` : ''}</details>` : '';
  const info = product.note ? `<details class="reagent-info"><summary>${row.id.startsWith('watersci') ? 'Состав ≠ заявленная прибавка' : 'О составе'}</summary><p>${esc(product.note)}</p>${product.source ? `<a href="${esc(product.source)}" target="_blank" rel="noopener noreferrer">Источник ↗</a>` : ''}</details>` : '';
  return `<article class="reagent ${row.locked ? 'locked' : ''}" data-card="${row.id}"><div class="reagent-line"><div class="reagent-identity"><span class="formula">${esc(product.short)}</span><div class="reagent-name"><h3>${esc(translate(product.name))}</h3>${product.aliases ? `<span class="reagent-alias">${esc(translate(product.aliases))}</span>` : ''}<label class="lock-line"><input type="checkbox" data-row="${row.id}" data-key="locked" ${row.locked ? 'checked' : ''}> Зафиксировать</label></div></div><label class="mini-field mode-field"><span>Режим</span><select data-row="${row.id}" data-key="mode" ${disabled}><option value="auto" ${row.mode === 'auto' ? 'selected' : ''}>Авто</option><option value="manual" ${row.mode === 'manual' ? 'selected' : ''}>Вручную</option></select></label><label class="mini-field dose-field"><span>Доза</span><div class="input-unit"><input data-row="${row.id}" data-key="dose" type="number" min="0" step="any" value="${esc(rawDose(number(row.dose)))}" ${disabled}><span>${doseUnit}</span></div></label><button class="icon-button" type="button" data-action="remove" data-id="${row.id}" aria-label="Удалить ${esc(translate(product.name))}" ${disabled}>×</button></div><div class="reagent-footer"><span data-contribution="${row.id}"></span>${info}</div>${options}</article>`;
}

function renderRows() {
  const openIds = new Set([...document.querySelectorAll('.reagent-options[open]')].map(element => element.closest('[data-card]')?.dataset.card));
  state.rows.forEach(row => { if (document.querySelector(`[data-card="${row.id}"]`)) row.optionsOpen = openIds.has(row.id); });
  $('#reagents').innerHTML = state.rows.length ? state.rows.map(rowHtml).join('') : '<div class="empty">Выберите вещество из базы, чтобы начать расчёт.</div>';
  $('#reagent-count').textContent = `${state.rows.length} из ${PRODUCTS.length}`;
  renderCatalog();
}

function recalculate({ solve = true, render = false } = {}) {
  if (solve) {
    const hasAuto = state.rows.some(row => row.mode === 'auto' && !row.locked);
    const missing = missingTankInputs();
    const invalidTargets = TARGETS.filter(target => targetLimits(state.targets?.[target.id], state.targetRanges?.[target.id]) === null);
    if (invalidTargets.length) solverWarning = solveTargets(state, getLocale()).warning;
    else if (targetLimits(state.targets?.TDS, state.targetRanges?.TDS) && (state.sourceTDS === '' || state.sourceTDS == null)) solverWarning = 'Для подбора TDS укажите TDS исходной воды.';
    else if (missing.length) solverWarning = `Для подбора после подмены укажите в аквариуме: ${missing.map(id => IONS[id]?.label ?? id).join(', ')}.`;
    else if (state.mode === 'change' && (number(state.tankVolume) <= 0 || number(state.volume) > number(state.tankVolume))) solverWarning = 'Объём подмены должен быть больше нуля и не превышать объём воды в аквариуме.';
    else if (hasConstraints() && hasAuto) {
      const solution = solveTargets(state, getLocale());
      state = solution.state;
      solverWarning = solution.warning;
    } else solverWarning = '';
  }
  save();
  if (render) renderRows();
  syncDoseInputs();
  renderResults();
}

function syncDoseInputs() {
  state.rows.forEach(row => {
    const input = document.querySelector(`[data-row="${row.id}"][data-key="dose"]`);
    if (input && document.activeElement !== input) input.value = rawDose(number(row.dose));
    const stock = document.querySelector(`[data-stock-display="${row.id}"]`);
    if (stock) stock.textContent = row.doseMode === 'stock' ? `${fmt(stockGramsPerL(row), 1)} г/л` : 'сухое внесение';
  });
}

function renderIonTable(result) {
  const expanded = new Set([...$('#ion-table').querySelectorAll('[data-ion-detail]:not([hidden])')].map(row => row.dataset.ionDetail));
  $('#ion-table').innerHTML = SUMMARY_GROUPS.map(group => {
    const rows = group.ions.filter(([ion]) => group.title !== 'Микроэлементы' || ['Fe', 'Mn'].includes(ion) || result.ions[ion] > 0);
    return `<tr class="group-row"><th colspan="4">${group.title}</th></tr>${rows.map(([ion, label]) => {
      const open = expanded.has(ion);
      const contributions = result.byProduct.map(item => {
        const row = getRow(item.id);
        const unit = item.product.type === 'dry' && row.doseMode === 'dry' ? 'г' : 'мл';
        const amount = item.contribution[ion] ?? 0;
        return `<div class="ion-source-line ${amount < 1e-9 ? 'zero' : ''}"><span>${esc(item.product.name)} <small>${fmt(number(row.dose), 5)} ${unit}</small></span><strong>+${fmt(amount, 4)}</strong></div>`;
      }).join('');
      const base = state.mode === 'change'
        ? `<div class="ion-source-line source"><span>Аквариум, оставшаяся вода</span><strong>${fmt((1 - result.share) * number(state.tank?.[ion]), 4)}</strong></div><div class="ion-source-line source"><span>Исходная вода для подмены</span><strong>${fmt(result.share * number(state.source[ion]), 4)}</strong></div>`
        : `<div class="ion-source-line source"><span>Исходная вода</span><strong>${fmt(number(state.source[ion]), 4)}</strong></div>`;
      const breakdown = `<div class="ion-breakdown">${base}${contributions || '<div class="ion-source-line zero"><span>Вещества не добавлены</span><strong>0</strong></div>'}<div class="ion-source-line total"><span>Итого, мг/л</span><strong>${fmt(result.ions[ion], 4)}</strong></div></div>`;
      return `<tr class="ion-summary-row" data-ion-toggle="${ion}" data-open="${open}"><th scope="row"><button type="button" class="ion-expand" aria-expanded="${open}" aria-controls="ion-detail-${ion}"><span class="ion-chevron" aria-hidden="true">▸</span>${label}</button></th><td>${fmt(result.baseline.ions[ion] ?? 0)}</td><td>${fmt(result.additions[ion])}</td><td>${fmt(result.ions[ion])}</td></tr><tr class="ion-detail-row" data-ion-detail="${ion}" id="ion-detail-${ion}" ${open ? '' : 'hidden'}><td colspan="4">${breakdown}</td></tr>`;
    }).join('')}`;
  }).join('');
}

function renderResultBreakdown(result, cards) {
  const panel = $('#result-breakdown');
  const phPanel = $('#ph-breakdown');
  const phButton = $('#ph-result');
  phButton.setAttribute('aria-expanded', String(selectedResultId === 'pH'));
  phPanel.hidden = selectedResultId !== 'pH';
  panel.hidden = !selectedResultId || selectedResultId === 'pH';
  if (!selectedResultId) {
    panel.innerHTML = '';
    phPanel.innerHTML = '';
    return;
  }
  if (selectedResultId === 'pH') {
    const startingPH = state.mode === 'change' ? state.tankPH : state.sourcePH;
    const sourcePH = startingPH === '' || startingPH == null ? NaN : number(startingPH, NaN);
    const lines = result.byProduct.map(item => {
      const without = calculate({ ...state, rows: state.rows.filter(row => row.id !== item.id) }).ph;
      const change = result.ph == null || without == null ? null : result.ph - without;
      return `<div class="ion-source-line ${change != null && Math.abs(change) < 0.0005 ? 'zero' : ''}"><span>${esc(item.product.name)} <small>без него: ${without == null ? '—' : fmt(without, 3)}</small></span><strong>${change == null ? '—' : Math.abs(change) < 0.0005 ? '0' : `${change > 0 ? '+' : ''}${fmt(change, 3)}`}</strong></div>`;
    }).join('');
    phPanel.innerHTML = `<div class="result-breakdown-heading"><strong>pH ${state.mode === 'change' ? 'после подмены' : 'приготовленной воды'}</strong><span>влияние каждого вещества</span></div><div class="ion-source-line source"><span>pH ${state.mode === 'change' ? 'аквариума до подмены' : 'исходной воды'}</span><strong>${Number.isFinite(sourcePH) ? fmt(sourcePH, 2) : '—'}</strong></div><div class="ion-source-line"><span>Принятый CO₂</span><strong>${fmt(number(state.phCO2), 2)} мг/л</strong></div><div class="ion-source-line"><span>Итоговый KH</span><strong>${fmt(result.kh, 2)} °dKH</strong></div>${lines}<div class="ion-source-line total"><span>Итоговый pH</span><strong>${result.ph == null ? '—' : `≈ ${fmt(result.ph, 2)}`}</strong></div><p class="fine-print">Изменение вычислено без указанного вещества при остальных тех же дозах. pH нелинеен: эти изменения не складываются.</p>`;
    return;
  }
  const card = cards.find(item => item.id === selectedResultId);
  if (!card) { selectedResultId = null; panel.hidden = true; panel.innerHTML = ''; return; }
  const contribution = item => card.id === 'GH' ? ghFromIons(item.contribution) : card.id === 'KH' ? khFromProduct(item) : card.id === 'TDS' ? item.tdsContribution : item.contribution[card.id] ?? 0;
  const source = card.id === 'GH' ? result.baseline.GH : card.id === 'KH' ? result.baseline.KH : card.id === 'TDS' ? result.baseline.TDS : number(result.baseline.ions[card.id]);
  const precision = card.id === 'Fe' || card.id === 'PO4' ? 4 : 3;
  const lines = result.byProduct.map(item => {
    const row = getRow(item.id);
    const unit = item.product.type === 'dry' && row.doseMode === 'dry' ? 'г' : 'мл';
    const value = contribution(item);
    return `<div class="ion-source-line ${Math.abs(value) < 1e-9 ? 'zero' : ''}"><span>${esc(item.product.name)} <small>${fmt(number(row.dose), 5)} ${unit}</small></span><strong>${value > 1e-9 ? '+' : ''}${fmt(value, precision)} ${card.unit}</strong></div>`;
  }).join('');
  const sourceLines = state.mode === 'change' ? (() => {
    const tankValue = card.id === 'GH' ? number(state.tankGH) : card.id === 'KH' ? number(state.tankKH) : card.id === 'TDS' ? number(state.tankTDS) : number(state.tank?.[card.id]);
    const sourceValue = card.id === 'GH' ? number(state.sourceGH) : card.id === 'KH' ? number(state.sourceKH) : card.id === 'TDS' ? number(state.sourceTDS) : number(state.source?.[card.id]);
    const hasTankValue = card.id !== 'TDS' || state.tankTDS !== '' && state.tankTDS != null;
    const hasSourceValue = card.id !== 'TDS' || state.sourceTDS !== '' && state.sourceTDS != null;
    return `<div class="ion-source-line source"><span>Аквариум, оставшаяся вода</span><strong>${hasTankValue ? fmt((1 - result.share) * tankValue, precision) : '—'} ${card.unit}</strong></div><div class="ion-source-line source"><span>Исходная вода для подмены</span><strong>${hasSourceValue ? fmt(result.share * sourceValue, precision) : '—'} ${card.unit}</strong></div>`;
  })() : `<div class="ion-source-line source"><span>Исходная вода</span><strong>${card.id === 'TDS' && (state.sourceTDS === '' || state.sourceTDS == null) ? '—' : fmt(source, precision)} ${card.unit}</strong></div>`;
  panel.innerHTML = `<div class="result-breakdown-heading"><strong>${card.label}</strong><span>вклад в итог</span></div>${sourceLines}${lines || '<div class="ion-source-line zero"><span>Вещества не добавлены</span><strong>0</strong></div>'}<div class="ion-source-line total"><span>Итого</span><strong>${card.value == null ? '—' : `${card.id === 'TDS' ? '≈ ' : ''}${fmt(card.value, precision)}`} ${card.unit}</strong></div>`;
}

function renderResults() {
  const result = calculate(state);
  const hasTDS = state.sourceTDS !== '' && state.sourceTDS != null && (state.mode !== 'change' || state.tankTDS !== '' && state.tankTDS != null);
  const startingPH = state.mode === 'change' ? state.tankPH : state.sourcePH;
  const hasSourcePH = startingPH !== '' && startingPH != null && Number.isFinite(number(startingPH, NaN));
  $('#ph-result').innerHTML = `<span>pH ${state.mode === 'change' ? 'аквариума' : 'исходной'} <strong>${hasSourcePH ? fmt(number(startingPH), 2) : '—'}</strong></span><span class="ph-arrow" aria-hidden="true">→</span><span>${state.mode === 'change' ? 'После подмены' : 'После смешивания'} <strong>${result.ph === null ? '—' : `≈ ${fmt(result.ph, 2)}`}</strong></span><span class="result-chevron" aria-hidden="true">▸</span>`;
  $('#prepared-summary').hidden = state.mode !== 'change';
  if (state.mode === 'change') $('#prepared-summary').innerHTML = `<strong>Приготовленная подменная вода</strong><span>GH ${fmt(result.prepared.gh, 2)} °dGH · KH ${fmt(result.prepared.kh, 2)} °dKH · TDS ${state.sourceTDS === '' || state.sourceTDS == null ? '—' : `≈ ${fmt(result.prepared.tds, 1)} ppm`} · pH ${result.prepared.ph == null ? '—' : `≈ ${fmt(result.prepared.ph, 2)}`}</span><small>Карточки ниже — результат во всём аквариуме после подмены.</small>`;
  $('#calibration-status').textContent = state.calibration ? `Последний замер: pH ${fmt(state.calibration.measuredPH, 2)}; калиброванный CO₂ ${fmt(state.calibration.co2, 2)} мг/л.` : '';
  const cards = [
    { label: 'Общая жёсткость', value: result.gh, unit: '°dGH', id: 'GH', accent: true },
    { label: 'Карбонатная жёсткость', value: result.kh, unit: '°dKH', id: 'KH', accent: true },
    { label: 'TDS', value: hasTDS ? result.tds : null, unit: 'ppm', id: 'TDS', accent: true },
    { label: 'Кальций', value: result.ions.Ca, unit: 'мг/л', id: 'Ca' },
    { label: 'Магний', value: result.ions.Mg, unit: 'мг/л', id: 'Mg' },
    { label: 'Калий', value: result.ions.K, unit: 'мг/л', id: 'K' },
    { label: 'Нитрат', value: result.ions.NO3, unit: 'мг/л', id: 'NO3' },
    { label: 'Фосфат', value: result.ions.PO4, unit: 'мг/л', id: 'PO4' },
    { label: 'Железо', value: result.ions.Fe, unit: 'мг/л', id: 'Fe' },
  ];
  $('#result-cards').innerHTML = cards.map(card => {
    if (card.id === 'TDS' && card.value == null) return `<button type="button" class="result-card ${selectedResultId === 'TDS' ? 'selected' : ''}" data-result-id="TDS" aria-expanded="${selectedResultId === 'TDS'}" aria-controls="result-breakdown"><span>TDS</span><strong>— <small>ppm</small></strong><em>${translate('Нужен замер TDS')}</em></button>`;
    const limits = targetLimits(state.targets[card.id], state.targetRanges?.[card.id]);
    const hasTarget = limits?.target != null;
    const delta = hasTarget ? card.value - limits.target : 0;
    const precision = card.id === 'Fe' || card.id === 'PO4' ? 3 : 2;
    const open = selectedResultId === card.id;
    const tolerance = Math.max((TARGETS.find(item => item.id === card.id)?.scale ?? 1) * 0.01, 0.001);
    const inRange = limits && (limits.min == null || card.value >= limits.min - tolerance) && (limits.max == null || card.value <= limits.max + tolerance);
    const range = limits?.ranged ? ` · ${translate('допуск')} ${limits.min == null ? '—' : fmt(limits.min, precision)}–${limits.max == null ? '—' : fmt(limits.max, precision)}` : '';
    const description = limits ? `${hasTarget ? `${translate('цель')} ${fmt(limits.target, precision)}` : ''}${range}${hasTarget && Math.abs(delta) > tolerance ? ` · Δ ${delta > 0 ? '+' : ''}${fmt(delta, precision)}` : ''}`.replace(/^ · /, '') : translate('без цели');
    return `<button type="button" class="result-card ${card.accent ? 'accent' : ''} ${open ? 'selected' : ''}" data-result-id="${card.id}" aria-expanded="${open}" aria-controls="result-breakdown"><span>${card.label}</span><strong>${card.id === 'TDS' ? '≈ ' : ''}${fmt(card.value, precision)} <small>${card.unit}</small></strong><em class="${limits ? !inRange ? 'off-target' : hasTarget && Math.abs(delta) > tolerance ? 'within-range' : 'on-target' : ''}" title="${esc(description)}">${esc(description)}</em></button>`;
  }).join('');
  renderResultBreakdown(result, cards);
  renderIonTable(result);
  $('.table-note').textContent = result.byProduct.some(item => item.acidMeq > 0)
    ? 'При внесении кислоты HCO₃/CO₃ перераспределяются и выделяют CO₂: здесь показан номинальный ввод ионов до реакции. Снижение KH учтено в карточке результата.'
    : 'Показаны ионы с известным составом. HCO₃/CO₃ даны по внесённым формулам; после отстаивания их формы меняются. Неизвестные противоионы готовых препаратов учтены ниже в мэкв/л.';
  const b = result.balance;
  $('#balance').innerHTML = `<div class="balance-line"><span>Известные катионы</span><strong>${fmt(b.knownCations)} мэкв/л</strong></div><div class="balance-line"><span>Известные анионы</span><strong>${fmt(b.knownAnions)} мэкв/л</strong></div><div class="balance-line unknown"><span>Неизвестные противоионы</span><strong>${fmt(b.unknownAnions + b.unknownCations)} мэкв/л</strong></div><div class="balance-line total"><span>Невязка известных добавок</span><strong>${fmt(b.unaccounted, 5)} мэкв/л</strong></div>`;
  $('#ratios').innerHTML = `<strong>Соотношения по массе</strong>${state.ratios.map(ratio => {
    if (!RATIO_IONS.includes(ratio.numerator) || !RATIO_IONS.includes(ratio.denominator)) return '';
    const actual = actualRatio(result, ratio);
    const limits = ratioLimits(ratio);
    const missed = limits !== null && !ratioSatisfied(result, ratio);
    const hasTarget = ratio.target !== '' && ratio.target != null && Number.isFinite(number(ratio.target, NaN));
    const relaxed = limits?.ranged && hasTarget && !ratioTargetSatisfied(result, ratio);
    const target = hasTarget ? ` <em>цель ${fmt(number(ratio.target), 3)} : 1</em>` : '';
    const range = limits?.ranged ? ` <em>допуск ${limits.min == null ? '—' : fmt(limits.min, 3)}–${limits.max == null ? '—' : fmt(limits.max, 3)} : 1</em>` : '';
    return `<div class="${missed ? 'ratio-missed' : relaxed ? 'ratio-relaxed' : ''}"><span>${IONS[ratio.numerator].label} : ${IONS[ratio.denominator].label}</span><b>${actual === null ? '—' : `${fmt(actual, 2)} : 1`}</b>${target}${range}</div>`;
  }).join('')}`;
  (result.prepared?.byProduct ?? result.byProduct).forEach(item => {
    const element = document.querySelector(`[data-contribution="${item.id}"]`);
    if (!element) return;
    const gh = ghFromIons(item.contribution);
    const kh = khFromProduct(item);
    const parts = [];
    if (gh > 0.001) parts.push(`GH +${fmt(gh, 2)}`);
    if (kh > 0.001) parts.push(`KH +${fmt(kh, 2)}`);
    if (kh < -0.001) parts.push(`KH ${fmt(kh, 2)}`);
    for (const ion of ['K', 'NO3', 'PO4', 'Fe']) if ((item.contribution[ion] ?? 0) > 0.0001) parts.push(`${IONS[ion].label} +${fmt(item.contribution[ion])}`);
    const row = getRow(item.id);
    if (item.product.type === 'dry' && row.doseMode === 'stock') parts.unshift(`${fmt(item.amount)} г соли`);
    element.textContent = parts.length ? parts.join(' · ') : 'Доза не задана';
  });
  const messages = [];
  if (number(state.volume) <= 0) messages.push('Объём должен быть больше нуля.');
  if (state.mode === 'change' && number(state.volume) > number(state.tankVolume)) messages.push('Объём подмены превышает объём воды в аквариуме.');
  if (state.phCO2 === '' || number(state.phCO2) <= 0) messages.push('Для оценки pH задайте CO₂ больше нуля.');
  if (result.kh < 0) messages.push('Расчётная кислотность превысила исходную щёлочность: KH ниже нуля. Уменьшите дозу и проверьте воду капельным тестом.');
  const presetConflicts = mergePresets(state.selectedPresets, getLocale(), state.userPresets).conflicts;
  if (presetConflicts.length) messages.push(`${translate('Несовместимые пресеты:')} ${presetConflicts.join(' ')}`);
  if (solverWarning) messages.push(solverWarning);
  if (state.rows.some(row => PRODUCT_BY_ID[row.id]?.type === 'dry' && row.doseMode === 'stock' && stockGramsPerL(row) <= 0)) messages.push('У маточного раствора должны быть положительные навеска и объём.');
  const concentrated = state.rows.filter(row => {
    const product = PRODUCT_BY_ID[row.id];
    const variant = product?.variants?.find(item => item.id === row.variant) ?? product?.variants?.[0];
    return product?.type === 'dry' && row.doseMode === 'stock' && stockGramsPerL(row) > (variant?.solubilityGPerL ?? product.solubilityGPerL ?? ({ nahco3: 85, kh2po4: 200, kno3: 300, mgso4: 500 }[row.id] ?? 300));
  });
  if (concentrated.length) messages.push(`Проверьте растворимость маточного раствора при вашей температуре: ${concentrated.map(row => PRODUCT_BY_ID[row.id].short).join(', ')}. Увеличьте разовую дозу или объём раствора, если остаётся осадок.`);
  if (state.rows.some(row => PRODUCT_BY_ID[row.id]?.preferDry && row.doseMode === 'stock')) messages.push('Seachem Equilibrium образует суспензию, а не прозрачный маточный раствор. Перед дозированием её нужно перемешивать.');
  const measuredGH = ghFromIons(state.source);
  const measuredKH = khFromIons(state.source);
  if (measuredGH > 0.2 && Math.abs(measuredGH - number(state.sourceGH)) > 0.3) messages.push(`Исходные Ca и Mg соответствуют GH ${fmt(measuredGH, 2)}, а введённый GH равен ${fmt(number(state.sourceGH), 2)}.`);
  if (measuredKH > 0.2 && Math.abs(measuredKH - number(state.sourceKH)) > 0.3) messages.push(`Исходные HCO₃/CO₃ соответствуют KH ${fmt(measuredKH, 2)}, а введённый KH равен ${fmt(number(state.sourceKH), 2)}.`);
  if (state.ratios.some(ratio => ratioLimits(ratio) && ratio.numerator === ratio.denominator)) messages.push('В соотношении выберите два разных иона.');
  if (state.ratios.some(ratio => (ratio.min !== '' && ratio.min != null || ratio.max !== '' && ratio.max != null) && !ratioLimits(ratio))) messages.push('У диапазона соотношения граница «от» должна быть не больше «до», обе границы — неотрицательными.');
  $('#messages').innerHTML = messages.map(message => `<div class="message">${esc(message)}</div>`).join('');
}

function toast(message) {
  const element = $('#toast');
  element.textContent = translate(message);
  element.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove('show'), 2800);
}

function summary() {
  const result = calculate(state);
  const hasTDS = state.sourceTDS !== '' && state.sourceTDS != null && (state.mode !== 'change' || state.tankTDS !== '' && state.tankTDS != null);
  const startingPH = state.mode === 'change' ? state.tankPH : state.sourcePH;
  const ph = `pH до ${startingPH === '' || startingPH == null ? 'не указан' : fmt(number(startingPH), 2)}; после ${result.ph === null ? 'не определён' : `≈ ${fmt(result.ph, 2)} (оценка при CO₂ ${fmt(number(state.phCO2), 2)} мг/л)`}`;
  const lines = [state.mode === 'change'
    ? `REM · подмена ${fmt(number(state.volume), 1)} л в аквариуме ${fmt(number(state.tankVolume), 1)} л; итог после подмены`
    : `REM · приготовление ${fmt(number(state.volume), 1)} л воды`,
  `GH ${fmt(result.gh, 2)} °dGH; KH ${fmt(result.kh, 2)} °dKH; TDS ${hasTDS ? `≈ ${fmt(result.tds, 1)} ppm` : '—'}; ${ph}`,
  `Ca ${fmt(result.ions.Ca)}; Mg ${fmt(result.ions.Mg)}; K ${fmt(result.ions.K)}; NO₃ ${fmt(result.ions.NO3)}; PO₄ ${fmt(result.ions.PO4)}; Fe ${fmt(result.ions.Fe)} мг/л`, 'Дозировки:'];
  if (state.mode === 'change') lines.splice(3, 0, `Подменная вода после приготовления: GH ${fmt(result.prepared.gh, 2)} °dGH; KH ${fmt(result.prepared.kh, 2)} °dKH; TDS ${state.sourceTDS === '' || state.sourceTDS == null ? '—' : `≈ ${fmt(result.prepared.tds, 1)} ppm`}; pH ${result.prepared.ph == null ? 'не определён' : `≈ ${fmt(result.prepared.ph, 2)}`}`);
  if (state.ratios.length) lines.splice(state.mode === 'change' ? 4 : 3, 0, `Соотношения по массе: ${state.ratios.map(ratio => {
    const actual = actualRatio(result, ratio);
    const limits = ratioLimits(ratio);
    const goal = ratio.target !== '' && ratio.target != null && Number.isFinite(number(ratio.target, NaN)) ? `цель ${fmt(number(ratio.target), 3)}:1` : '';
    const range = limits?.ranged ? `допуск ${limits.min == null ? '—' : fmt(limits.min, 3)}–${limits.max == null ? '—' : fmt(limits.max, 3)}:1` : '';
    const requested = goal || range ? ` (${[goal, range].filter(Boolean).join('; ')})` : '';
    return `${IONS[ratio.numerator]?.label ?? '?'}:${IONS[ratio.denominator]?.label ?? '?'} ${actual === null ? '—' : `${fmt(actual, 3)}:1`}${requested}`;
  }).join('; ')}`);
  state.rows.forEach(row => {
    const product = PRODUCT_BY_ID[row.id];
    const unit = product.type === 'dry' && row.doseMode === 'dry' ? 'г' : 'мл';
    const stock = product.type === 'dry' && row.doseMode === 'stock' ? ` (маточник ${fmt(stockGramsPerL(row), 1)} г/л: ${fmt(number(row.stockGrams))} г / ${fmt(number(row.stockMl))} мл)` : '';
    lines.push(`• ${product.name}: ${fmt(number(row.dose))} ${unit}${row.locked ? ' (зафиксировано)' : ''}${stock}`);
  });
  return lines.join('\n');
}

function showView(view) {
  for (const id of ['calculator', 'aquariums', 'journal', 'database']) {
    $(`#${id}-view`).hidden = id !== view;
    document.querySelector(`[data-view="${id}"]`).classList.toggle('active', id === view);
  }
  if (view === 'aquariums') renderAquariums();
  if (view === 'journal') renderJournalList();
  if (view === 'database') renderDatabaseList();
}

function applySelectedPresets() {
  const merged = mergePresets(state.selectedPresets, getLocale(), state.userPresets);
  const beforeTargets = Object.fromEntries(TARGETS.map(item => [item.id, { target: state.targets[item.id] ?? '', min: state.targetRanges?.[item.id]?.min ?? '', max: state.targetRanges?.[item.id]?.max ?? '' }]));
  const targetBackups = state.presetTargetBackups ?? {};
  const activeTargets = new Set(merged.targets.map(item => item.id));
  for (const [id, original] of Object.entries(targetBackups)) {
    if (activeTargets.has(id)) continue;
    state.targets[id] = original.target;
    state.targetRanges[id] = { ...original.range };
    delete targetBackups[id];
  }
  for (const item of merged.targets) {
    if (!Object.hasOwn(targetBackups, item.id)) targetBackups[item.id] = { target: state.targets[item.id] ?? '', range: { ...(state.targetRanges[item.id] ?? {}) } };
    state.targets[item.id] = item.target;
    state.targetRanges[item.id] = { min: item.min, max: item.max };
  }
  state.presetTargetBackups = targetBackups;
  const backups = state.presetBackups ?? {};
  const key = ratio => `${ratio.numerator}:${ratio.denominator}`;
  const previous = new Map(state.ratios.map(ratio => [key(ratio), ratio]));
  const active = new Set(merged.ratios.map(key));
  state.ratios = state.ratios.filter(ratio => !ratio.fromPreset);
  for (const [pair, original] of Object.entries(backups)) {
    if (active.has(pair)) state.ratios = state.ratios.filter(ratio => key(ratio) !== pair);
    else {
      if (!state.ratios.some(ratio => key(ratio) === pair)) state.ratios.push(original);
      delete backups[pair];
    }
  }
  for (const presetRatio of merged.ratios) {
    const pair = key(presetRatio);
    const index = state.ratios.findIndex(ratio => key(ratio) === pair);
    if (index >= 0) {
      backups[pair] = { ...state.ratios[index] };
      state.ratios.splice(index, 1);
    }
    state.ratios.push(presetRatio);
  }
  state.presetBackups = backups;
  renderPresets();
  renderRatios();
  syncStaticFields();
  for (const item of TARGETS) {
    if (state.targetRanges?.[item.id]?.min === '' || state.targetRanges?.[item.id]?.min == null) {
      if (state.targetRanges?.[item.id]?.max === '' || state.targetRanges?.[item.id]?.max == null)
        document.querySelector(`[data-target="${item.id}"]`)?.closest('.target-item')?.querySelector('details')?.removeAttribute('open');
    }
    for (const field of ['target', 'min', 'max']) {
      const after = field === 'target' ? state.targets[item.id] : state.targetRanges?.[item.id]?.[field];
      if (String(beforeTargets[item.id][field] ?? '') === String(after ?? '')) continue;
      const input = field === 'target' ? document.querySelector(`[data-target="${item.id}"]`)
        : document.querySelector(`[data-target-bound="${item.id}"][data-bound="${field}"]`);
      if (input) {
        if (after !== '' && after != null) input.closest('details')?.setAttribute('open', '');
        input.classList.remove('preset-flash');
        void input.offsetWidth;
        input.classList.add('preset-flash');
      }
    }
  }
  for (const ratio of state.ratios) {
    const before = previous.get(key(ratio));
    for (const field of ['target', 'min', 'max']) {
      if (String(before?.[field] ?? '') === String(ratio[field] ?? '')) continue;
      const input = [...document.querySelectorAll('[data-ratio]')].find(item => item.dataset.ratio === ratio.id && item.dataset.key === field);
      if (input) input.classList.add('preset-flash');
    }
  }
  recalculate();
}

const allJournalTests = () => [...JOURNAL_TESTS, ...state.customTests];
const journalTest = id => allJournalTests().find(item => item.id === id) ?? { id, label: id, unit: '', kind: 'physical' };
const localTime = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
const NUMERIC_LIGHT_FIELDS = new Set(['powerW', 'intensityPercent', 'durationHours', 'colorTempK', 'par']);
const lightLabel = { fixture: 'Светильник', powerW: 'Мощность', intensityPercent: 'Яркость', startTime: 'Начало', durationHours: 'Длительность', colorTempK: 'Цветовая температура', par: 'PAR' };
const lightUnit = { powerW: 'Вт', intensityPercent: '%', durationHours: 'ч', colorTempK: 'K', par: 'мкмоль/м²/с' };
function renderLightChannels() {
  const selected = $('#light-channel-select').value;
  $('#light-channel-count').textContent = `${lightChannelDraft.length} / ${MAX_LIGHT_CHANNELS}`;
  $('#light-channel-list').innerHTML = lightChannelDraft.length ? lightChannelDraft.map((channel, index) => {
    const name = channelName(channel, translate);
    return `<div class="light-channel-row"><span>${esc(name)}</span><label><input data-light-channel-value="${index}" type="number" min="0" max="100" step="any" value="${esc(channel.value ?? '')}" aria-label="${esc(name)}: ${translate('Яркость канала, %')}"><span>%</span></label><button type="button" class="icon-button" data-light-channel-remove="${index}" aria-label="${translate('Удалить канал')} ${esc(name)}">×</button></div>`;
  }).join('') : `<p class="fine-print light-channel-empty">${translate('Каналы не заданы.')}</p>`;
  const used = new Set(lightChannelDraft.map(channel => channel.id));
  const presets = LIGHT_CHANNELS.filter(item => !used.has(item.id)).map(item => `<option value="${item.id}">${esc(translate(item.label))}</option>`);
  const custom = state.customLightChannels.filter(name => !used.has(`custom:${name.toLocaleLowerCase()}`))
    .map(name => `<option value="custom:${esc(name.toLocaleLowerCase())}">${esc(name)}</option>`);
  $('#light-channel-select').innerHTML = `<option value="">${translate('Выберите канал')}</option>${[...presets, ...custom].join('')}<option value="__custom__">${translate('Свой канал…')}</option>`;
  $('#light-channel-select').value = [...$('#light-channel-select').options].some(option => option.value === selected) ? selected : '';
  $('#light-channel-custom').hidden = $('#light-channel-select').value !== '__custom__';
  $('#light-channel-select').disabled = lightChannelDraft.length >= MAX_LIGHT_CHANNELS;
  $('#light-channel-add').disabled = lightChannelDraft.length >= MAX_LIGHT_CHANNELS;
}
function countLabel(count, kind) {
  const locale = getLocale();
  if (locale === 'ru') {
    const forms = kind === 'measurement' ? ['измерение', 'измерения', 'измерений'] : ['запись', 'записи', 'записей'];
    const form = count % 10 === 1 && count % 100 !== 11 ? 0 : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 1 : 2;
    return `${count} ${forms[form]}`;
  }
  const forms = { en: kind === 'measurement' ? ['measurement', 'measurements'] : ['entry', 'entries'],
    de: kind === 'measurement' ? ['Messung', 'Messungen'] : ['Eintrag', 'Einträge'],
    es: kind === 'measurement' ? ['medición', 'mediciones'] : ['entrada', 'entradas'] }[locale] ?? ['entry', 'entries'];
  return `${count} ${forms[count === 1 ? 0 : 1]}`;
}

function currentJournal() { return state.journal.filter(entry => entry.aquariumId === state.activeAquariumId); }
function renderAquariumList() {
  $('#active-aquarium').innerHTML = state.aquariums.map(item => `<option value="${esc(item.id)}">${esc(item.name)}</option>`).join('');
  $('#active-aquarium').value = state.activeAquariumId;
  $('#aquarium-list').innerHTML = state.aquariums.map(item => `<button class="aquarium-list-item ${item.id === state.activeAquariumId ? 'active' : ''}" type="button" data-select-aquarium="${esc(item.id)}"><strong>${esc(item.name)}</strong><span>${fmt(number(item.tankVolume), 1)} ${translate('л')} · ${countLabel(state.journal.filter(entry => entry.aquariumId === item.id).length, 'measurement')}</span></button>`).join('');
  $('#aquarium-delete').disabled = state.aquariums.length < 2;
}
function updateAquariumEstimate() {
  const profile = activeAquarium();
  const estimate = estimateAquariumVolume(profile.geometry);
  $('#aquarium-estimate').textContent = estimate == null ? '—' : `${fmt(estimate, 2)} л`;
  if (profile.volumeMode === 'geometry') {
    state.tankVolume = estimate == null ? '' : Math.round(estimate * 1000) / 1000;
    $('#aquarium-volume').value = state.tankVolume;
    $('#tank-volume').value = state.tankVolume;
    recalculate();
  }
  renderAquariumList();
}
function renderAquariums() {
  const profile = activeAquarium();
  renderAquariumList();
  $('#aquarium-name').value = profile.name;
  $('#aquarium-note').value = profile.note ?? '';
  $('#aquarium-shape').value = profile.geometry?.shape ?? 'rect';
  $('#aquarium-volume-mode').value = profile.volumeMode ?? 'manual';
  document.querySelectorAll('[data-geometry]').forEach(input => { input.value = profile.geometry?.[input.dataset.geometry] ?? ''; });
  $('#aquarium-rect-fields').hidden = profile.geometry?.shape === 'cylinder';
  $('#aquarium-cylinder-fields').hidden = profile.geometry?.shape !== 'cylinder';
  $('#aquarium-volume').readOnly = profile.volumeMode === 'geometry';
  $('#tank-volume').readOnly = profile.volumeMode === 'geometry';
  $('#aquarium-volume').value = profile.tankVolume ?? '';
  const estimate = estimateAquariumVolume(profile.geometry);
  $('#aquarium-estimate').textContent = estimate == null ? '—' : `${fmt(estimate, 2)} л`;
}
function selectAquarium(id) {
  if (id === state.activeAquariumId) return;
  const next = state.aquariums.find(item => item.id === id);
  if (!next) return;
  save();
  applyAquariumProfile(next);
  editingMeasurementId = null;
  resetJournalForm();
  syncStaticFields();
  renderAquariums();
  renderJournalList();
  recalculate();
}
function readLightForm() {
  const light = {};
  for (const input of document.querySelectorAll('[data-light]')) {
    if (input.value === '') continue;
    const value = NUMERIC_LIGHT_FIELDS.has(input.dataset.light) ? Number(input.value) : input.value.trim();
    if (value !== '') light[input.dataset.light] = value;
  }
  if (lightChannelDraft.length) light.channels = lightChannelDraft.map(channel => ({
    id: channel.id, ...(channel.name ? { name: channel.name } : {}), value: Number(channel.value)
  }));
  return light;
}
function setLightForm(light = {}) {
  document.querySelectorAll('[data-light]').forEach(input => { input.value = light[input.dataset.light] ?? ''; });
  lightChannelDraft = Array.isArray(light.channels) ? light.channels.slice(0, MAX_LIGHT_CHANNELS).map(channel => ({ ...channel })) : [];
  renderLightChannels();
  $('#journal-light').open = Object.keys(light).length > 0;
}

function renderJournalTestOptions() {
  const selected = $('#journal-test-select').value;
  $('#journal-test-select').innerHTML = allJournalTests().filter(item => !(item.id in journalDraft.values))
    .map(item => `<option value="${esc(item.id)}">${esc(item.label)}${item.unit ? ` · ${esc(item.unit)}` : ''}</option>`).join('');
  if ([...$('#journal-test-select').options].some(option => option.value === selected)) $('#journal-test-select').value = selected;
  $('#journal-add-test').disabled = !$('#journal-test-select').value;
}

function renderJournalTestFields() {
  $('#journal-test-fields').innerHTML = Object.keys(journalDraft.values).map(id => {
    const test = journalTest(id);
    return `<div class="journal-test-row" data-journal-row="${esc(id)}"><label class="mini-field"><span>${esc(test.label)}${test.unit ? ` · ${esc(test.unit)}` : ''}</span><input data-journal-value="${esc(id)}" type="number" step="any" value="${esc(journalDraft.values[id] ?? '')}" placeholder="—"></label><button type="button" class="icon-button" data-journal-remove="${esc(id)}" aria-label="Убрать тест ${esc(test.label)}">×</button><details class="test-note"><summary>Примечание к тесту${journalDraft.notes[id] ? ' •' : ''}</summary><textarea data-journal-note="${esc(id)}" rows="2" placeholder="Особенности замера…">${esc(journalDraft.notes[id] ?? '')}</textarea></details></div>`;
  }).join('');
  renderJournalTestOptions();
}

function resetJournalForm() {
  editingMeasurementId = null;
  journalDraft = { values: { pH: '', GH: '', KH: '', TDS: '', NO3: '', PO4: '' }, notes: {} };
  $('#journal-form-title').textContent = 'Новое измерение';
  $('#journal-location').value = 'aquarium';
  $('#journal-auto-time').checked = true;
  $('#journal-at').value = localTime(new Date());
  $('#journal-at').disabled = true;
  $('#journal-note').value = '';
  const latest = [...currentJournal()].sort((a, b) => new Date(b.at) - new Date(a.at))[0];
  setLightForm(latest?.light);
  $('#journal-cancel').hidden = true;
  renderJournalTestFields();
}

function renderJournalList() {
  const entries = [...currentJournal()].sort((a, b) => new Date(b.at) - new Date(a.at));
  $('#journal-count').textContent = countLabel(entries.length, 'entry');
  $('#journal-export').disabled = entries.length === 0;
  const locationLabel = { aquarium: 'Аквариум', source: 'Исходная вода', prepared: 'Приготовленная вода' };
  $('#journal-list').innerHTML = entries.length ? entries.map(entry => {
    const tests = Object.entries(entry.values ?? {}).map(([id, value]) => {
      const test = journalTest(id);
      const difference = journalDifference(entries, entry, id);
      const sign = difference?.delta > 0 ? '+' : '';
      const movement = difference ? (difference.perDay > 0 ? 'прирост' : difference.perDay < 0 ? test.kind === 'nutrient' ? 'потребление' : 'снижение' : 'без изменения') : '';
      const differenceText = difference ? `<span class="journal-diff">Δ ${sign}${fmt(difference.delta, 3)} ${esc(test.unit)} · ${movement} ${fmt(Math.abs(difference.perDay), 3)} ${esc(test.unit)}/сут</span>` : '<span class="journal-diff quiet-diff">первый замер</span>';
      return `<details class="journal-result-test"><summary><span>${esc(test.label)} <strong>${fmt(number(value), 3)} ${esc(test.unit)}</strong></span>${differenceText}</summary><div class="journal-test-note">${entry.notes?.[id] ? esc(entry.notes[id]) : 'Примечание к тесту не указано.'}${difference ? `<small>Сравнение с ${new Date(difference.previous.at).toLocaleString(intlLocale())} · ${fmt(difference.days, 2)} сут.</small>` : ''}</div></details>`;
    }).join('');
    const light = Object.entries(entry.light ?? {}).filter(([key, value]) => key !== 'channels' && value !== '' && value != null)
      .map(([key, value]) => `${lightLabel[key] ?? key}: ${value}${lightUnit[key] ? ` ${lightUnit[key]}` : ''}`);
    if (entry.light?.channels?.length) light.push(`${translate('Каналы')}: ${entry.light.channels.map(channel => `${channelName(channel, translate)} ${fmt(number(channel.value), 1)}%`).join(' · ')}`);
    return `<article class="journal-entry"><div class="journal-entry-head"><div><strong>${esc(locationLabel[entry.location] ?? entry.location)}</strong><span>${new Date(entry.at).toLocaleString(intlLocale())}</span></div><div><button type="button" class="text-button" data-journal-action="edit" data-id="${esc(entry.id)}">Изменить</button><button type="button" class="text-button danger-text" data-journal-action="delete" data-id="${esc(entry.id)}">Удалить</button></div></div>${entry.note ? `<p class="journal-general-note">${esc(entry.note)}</p>` : ''}${tests}${light.length ? `<details class="journal-result-test"><summary>Настройки света</summary><div class="journal-test-note">${esc(light.join(' · '))}</div></details>` : ''}</article>`;
  }).join('') : '<div class="empty">Пока нет измерений. Добавьте первый замер слева.</div>';
}

function editJournalEntry(entry) {
  editingMeasurementId = entry.id;
  journalDraft = { values: { ...entry.values }, notes: { ...entry.notes } };
  $('#journal-form-title').textContent = 'Изменить измерение';
  $('#journal-location').value = entry.location;
  $('#journal-auto-time').checked = false;
  $('#journal-at').disabled = false;
  $('#journal-at').value = entry.at;
  $('#journal-note').value = entry.note ?? '';
  setLightForm(entry.light);
  $('#journal-cancel').hidden = false;
  renderJournalTestFields();
}

function renderComponentRows() {
  $('#component-list').innerHTML = componentDraft.map((item, index) => `<div class="component-row"><label class="mini-field"><span>Формула ${index + 1}</span><input data-component-index="${index}" data-component-key="formula" type="text" value="${esc(item.formula)}" placeholder="KNO3"></label><label class="mini-field"><span>${$('#custom-kind').value === 'liquid-mixture' ? 'г/л жидкости' : 'Доля, %'}</span><input data-component-index="${index}" data-component-key="amount" type="number" min="0" step="any" value="${esc(item.amount)}" placeholder="0"></label><button class="icon-button" type="button" data-remove-component="${index}" aria-label="Удалить компонент">×</button></div>`).join('');
}

function renderAdditionalForms() {
  $('#additional-forms').innerHTML = additionalForms.map((item, index) => `<div class="form-variant-row"><label class="mini-field"><span>Формула формы ${index + 2}</span><input data-form-index="${index}" data-form-key="formula" value="${esc(item.formula)}" placeholder="MgSO4"></label><label class="mini-field"><span>Растворимость, г/л</span><input data-form-index="${index}" data-form-key="solubility" type="number" min="0.001" step="any" value="${esc(item.solubility)}" placeholder="при 20 °C"></label><button class="icon-button" type="button" data-remove-form="${index}" aria-label="Удалить форму">×</button></div>`).join('');
}

function renderCustomKind() {
  const mixture = $('#custom-kind').value !== 'substance';
  $('#single-formula').hidden = mixture;
  $('#mixture-formulas').hidden = !mixture;
  $('#custom-solubility-label').textContent = mixture ? 'Растворимость смеси при 20 °C' : 'Растворимость первой формы при 20 °C';
  renderAdditionalForms();
  $('#component-unit').textContent = $('#custom-kind').value === 'liquid-mixture' ? 'г/л готового раствора' : 'массовая доля, %';
  renderComponentRows();
  renderCustomPreview();
}

function customFormData() {
  return {
    id: editingProductId,
    kind: $('#custom-kind').value,
    name: $('#custom-name').value,
    aliases: $('#custom-aliases').value,
    solubility: $('#custom-solubility').value,
    formula: $('#custom-formula').value,
    forms: [{ formula: $('#custom-formula').value, solubility: $('#custom-solubility').value }, ...additionalForms],
    components: componentDraft,
    manualComposition: $('#custom-manual').value,
  };
}

function renderCustomPreview() {
  const element = $('#custom-preview');
  const form = customFormData();
  if (!form.name || !form.solubility || (form.kind === 'substance' ? !form.formula : !form.components.some(item => item.formula))) {
    element.innerHTML = 'Укажите название, формулу и растворимость — здесь появится расчёт состава и эффектов.';
    return;
  }
  try {
    const product = customProductFromForm(form);
    const composition = productComposition(product);
    const unit = product.type === 'liquid' ? 'мг/мл' : 'мг/г';
    const effects = productEffects(product);
    element.innerHTML = `<strong>Автоматически рассчитано</strong><div>${Object.entries(composition).map(([ion, value]) => `${IONS[ion].label} ${fmt(value, 3)} ${unit}`).join(' · ')}</div><div class="effect-tags">${effects.length ? effects.map(effectTag).join('') : 'Нет известных эффектов для доступных показателей'}</div>`;
  } catch (error) {
    element.innerHTML = `<span class="preview-error">${esc(translate(error.message))}</span>`;
  }
}

function resetCustomForm() {
  editingProductId = null;
  componentDraft = [{ formula: '', amount: '' }];
  additionalForms = [];
  $('#custom-form-title').textContent = 'Добавить вещество или смесь';
  $('#custom-kind').value = 'substance';
  for (const id of ['custom-name', 'custom-aliases', 'custom-solubility', 'custom-formula', 'custom-manual']) $('#'+id).value = '';
  $('#custom-cancel').hidden = true;
  renderCustomKind();
}

function editCustomProduct(product) {
  if (state.rows.some(row => row.id === product.id && row.locked)) { toast('Сначала снимите фиксацию вещества в расчёте'); return; }
  editingProductId = product.id;
  $('#custom-form-title').textContent = 'Изменить вещество или смесь';
  $('#custom-kind').value = product.kind ?? 'substance';
  $('#custom-name').value = product.name;
  $('#custom-aliases').value = product.aliases ?? '';
  $('#custom-solubility').value = product.solubilityGPerL ?? '';
  $('#custom-formula').value = product.variants?.[0]?.name ?? product.components?.[0]?.formula ?? product.formulaText ?? '';
  additionalForms = product.variants?.slice(1).map(item => ({ formula: item.name, solubility: item.solubilityGPerL ?? '' })) ?? [];
  $('#custom-manual').value = product.manualComposition ?? '';
  componentDraft = product.components?.length ? product.components.map(item => ({ ...item })) : [{ formula: '', amount: '' }];
  $('#custom-cancel').hidden = false;
  renderCustomKind();
  showView('database');
}

function renderDatabaseList() {
  const search = $('#database-search').value.trim().toLowerCase();
  const effect = $('#database-effect').value;
  const sortMode = $('#database-sort').value;
  const products = sortedProducts(PRODUCTS.filter(product => (!search || `${product.name} ${translate(product.name)} ${product.aliases ?? ''} ${translate(product.aliases ?? '')} ${product.formulaText ?? product.short} ${product.variants?.map(item => item.name).join(' ') ?? ''}`.toLowerCase().includes(search))
    && (!effect || productEffects(product).includes(effect))), sortMode, effect, intlLocale(), product => translate(product.name));
  $('#database-count').textContent = `${products.length} из ${PRODUCTS.length}`;
  let previousGroup = '';
  $('#database-list').innerHTML = products.length ? products.map(product => {
    const effects = productEffects(product).slice(0, 6);
    const chosen = state.rows.some(row => row.id === product.id);
    const forms = product.variants?.map(item => `${item.name}${item.solubilityGPerL ? ` · ${fmt(item.solubilityGPerL, 1)} г/л` : ''}`).join('; ');
    const group = sortMode === 'effect' ? primaryEffect(product, effect) : sortMode === 'type' ? productKind(product) : '';
    const heading = group && group !== previousGroup ? `<div class="database-group-heading">${esc(group)}</div>` : '';
    previousGroup = group;
    return `${heading}<article class="database-item"><div class="database-item-title"><strong>${esc(translate(product.name))}</strong><span>${esc(product.short)}</span></div>${product.aliases ? `<p class="database-alias">Другие названия: ${esc(translate(product.aliases))}</p>` : ''}<p class="database-meta">${esc(forms ?? product.formulaText ?? product.short)}${!forms && product.solubilityGPerL ? ` · растворимость ${fmt(product.solubilityGPerL, 1)} г/л при 20 °C` : ''}</p><div class="effect-tags">${effects.map(effectTag).join('')}</div>${product.referenceOnly ? `<p class="database-reference-note">Ориентир: расчётной дозы нет. ${esc(product.note)}</p>` : ''}<div class="database-actions">${product.referenceOnly ? '' : `<button type="button" class="text-button" data-db-action="add" data-id="${esc(product.id)}" ${chosen ? 'disabled' : ''}>${chosen ? 'В расчёте' : 'Добавить в расчёт'}</button>`}${product.custom ? `<button type="button" class="text-button" data-db-action="edit" data-id="${esc(product.id)}">Изменить</button><button type="button" class="text-button danger-text" data-db-action="delete" data-id="${esc(product.id)}">Удалить</button>` : ''}${product.source ? `<a class="text-button" href="${esc(product.source)}" target="_blank" rel="noopener noreferrer">Источник ↗</a>` : ''}</div></article>`;
  }).join('') : '<div class="empty">Ничего не найдено по заданным фильтрам.</div>';
}

buildStaticFields();
syncStaticFields();
renderAquariums();
renderRatios();
renderRows();
recalculate();
resetJournalForm();
resetCustomForm();
showView('calculator');

document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => showView(button.dataset.view)));
$('#open-aquarium-profile').addEventListener('click', () => showView('aquariums'));
$('#active-aquarium').addEventListener('change', event => selectAquarium(event.target.value));
$('#aquarium-list').addEventListener('click', event => {
  const button = event.target.closest('[data-select-aquarium]');
  if (button) selectAquarium(button.dataset.selectAquarium);
});
$('#aquarium-add').addEventListener('click', () => {
  save();
  const aquarium = makeAquarium(`${translate('Аквариум')} ${state.aquariums.length + 1}`);
  state.aquariums.push(aquarium);
  applyAquariumProfile(aquarium);
  resetJournalForm();
  syncStaticFields();
  renderAquariums();
  renderJournalList();
  recalculate();
  $('#aquarium-name').focus();
  $('#aquarium-name').select();
});
$('#aquarium-name').addEventListener('input', event => {
  activeAquarium().name = event.target.value;
  save();
  renderAquariumList();
});
$('#aquarium-name').addEventListener('blur', event => {
  if (!event.target.value.trim()) { event.target.value = translate('Аквариум'); activeAquarium().name = event.target.value; save(); renderAquariumList(); }
});
$('#aquarium-note').addEventListener('input', event => { activeAquarium().note = event.target.value; save(); });
$('#aquarium-shape').addEventListener('change', event => {
  activeAquarium().geometry.shape = event.target.value;
  $('#aquarium-rect-fields').hidden = event.target.value === 'cylinder';
  $('#aquarium-cylinder-fields').hidden = event.target.value !== 'cylinder';
  updateAquariumEstimate();
  save();
});
$('#aquarium-volume-mode').addEventListener('change', event => {
  activeAquarium().volumeMode = event.target.value;
  $('#aquarium-volume').readOnly = event.target.value === 'geometry';
  $('#tank-volume').readOnly = event.target.value === 'geometry';
  if (event.target.value === 'geometry') updateAquariumEstimate();
  save();
});
document.querySelectorAll('[data-geometry]').forEach(input => input.addEventListener('input', event => {
  activeAquarium().geometry[event.target.dataset.geometry] = event.target.value;
  updateAquariumEstimate();
  save();
}));
$('#aquarium-volume').addEventListener('input', event => {
  if (activeAquarium().volumeMode === 'geometry') return;
  state.tankVolume = event.target.value;
  $('#tank-volume').value = event.target.value;
  recalculate();
  renderAquariumList();
});
$('#aquarium-delete').addEventListener('click', () => {
  if (state.aquariums.length < 2) return;
  const profile = activeAquarium();
  const prompts = { en: `Delete aquarium “${profile.name}” and all its measurements?`,
    ru: `Удалить аквариум «${profile.name}» и все его измерения?`,
    de: `Aquarium „${profile.name}“ und alle Messungen löschen?`,
    es: `¿Eliminar el acuario «${profile.name}» y todas sus mediciones?` };
  if (!window.confirm(prompts[getLocale()])) return;
  state.aquariums = state.aquariums.filter(item => item.id !== profile.id);
  state.journal = state.journal.filter(entry => entry.aquariumId !== profile.id);
  applyAquariumProfile(state.aquariums[0]);
  resetJournalForm();
  syncStaticFields();
  renderAquariums();
  renderJournalList();
  recalculate();
});
document.querySelectorAll('[data-calc-mode]').forEach(button => button.addEventListener('click', () => {
  state.mode = button.dataset.calcMode;
  renderMode();
  recalculate();
}));
$('#volume').addEventListener('input', event => { state.volume = number(event.target.value); recalculate(); });
$('#tank-volume').addEventListener('input', event => { state.tankVolume = event.target.value; $('#aquarium-volume').value = event.target.value; recalculate(); renderAquariumList(); });
$('#tank-gh').addEventListener('input', event => { state.tankGH = event.target.value; recalculate(); });
$('#tank-kh').addEventListener('input', event => { state.tankKH = event.target.value; recalculate(); });
$('#tank-ph').addEventListener('input', event => { state.tankPH = event.target.value; recalculate(); });
$('#tank-tds').addEventListener('input', event => { state.tankTDS = event.target.value; recalculate(); });
$('#tank-fields').addEventListener('input', event => {
  if (!event.target.dataset.tank) return;
  state.tank[event.target.dataset.tank] = event.target.value;
  recalculate();
});
$('#source-gh').addEventListener('input', event => { state.sourceGH = number(event.target.value); recalculate(); });
$('#source-kh').addEventListener('input', event => { state.sourceKH = number(event.target.value); recalculate(); });
$('#source-ph').addEventListener('input', event => { state.sourcePH = event.target.value; recalculate(); });
$('#source-tds').addEventListener('input', event => { state.sourceTDS = event.target.value; recalculate(); });
$('#ph-co2').addEventListener('input', event => { state.phCO2 = event.target.value; recalculate(); });
$('#measured-ph').addEventListener('input', event => { state.measuredPH = event.target.value; save(); });
$('#calibrate-ph').addEventListener('click', () => {
  const measured = $('#measured-ph').value;
  if (measured === '') { toast('Введите фактически измеренный pH после смешивания'); return; }
  const co2 = calibratePHCO2(calculate(state), measured);
  if (co2 == null) { toast('Калибровка невозможна: проверьте pH, KH и фосфат'); return; }
  state.phCO2 = Number(co2.toPrecision(6));
  state.measuredPH = measured;
  state.calibration = { measuredPH: number(measured), co2: state.phCO2, at: new Date().toISOString() };
  $('#ph-co2').value = state.phCO2;
  recalculate({ solve: false });
  toast(`Оценка pH настроена: CO₂ ${fmt(co2, 2)} мг/л`);
});
$('#ph-result').addEventListener('click', () => { selectedResultId = selectedResultId === 'pH' ? null : 'pH'; renderResults(); });
$('#result-cards').addEventListener('click', event => {
  const card = event.target.closest('[data-result-id]');
  if (!card) return;
  selectedResultId = selectedResultId === card.dataset.resultId ? null : card.dataset.resultId;
  renderResults();
});
$('#ion-table').addEventListener('click', event => {
  const row = event.target.closest('[data-ion-toggle]');
  if (!row || !$('#ion-table').contains(row)) return;
  const detail = $('#ion-table').querySelector(`[data-ion-detail="${row.dataset.ionToggle}"]`);
  if (!detail) return;
  const open = detail.hidden;
  detail.hidden = !open;
  row.dataset.open = String(open);
  row.querySelector('button').setAttribute('aria-expanded', String(open));
});
$('#target-fields').addEventListener('input', event => {
  if (event.target.dataset.target) state.targets[event.target.dataset.target] = event.target.value;
  else if (event.target.dataset.targetBound) {
    const id = event.target.dataset.targetBound;
    state.targetRanges[id] ??= {};
    state.targetRanges[id][event.target.dataset.bound] = event.target.value;
  } else return;
  recalculate();
});
$('#ratio-fields').addEventListener('input', event => {
  if (!['target', 'min', 'max'].includes(event.target.dataset.key)) return;
  const ratio = state.ratios.find(item => item.id === event.target.dataset.ratio);
  if (ratio) { ratio[event.target.dataset.key] = event.target.value; recalculate(); }
});
$('#ratio-fields').addEventListener('change', event => {
  if (!['numerator', 'denominator'].includes(event.target.dataset.key)) return;
  const ratio = state.ratios.find(item => item.id === event.target.dataset.ratio);
  if (ratio) { ratio[event.target.dataset.key] = event.target.value; recalculate(); }
});
$('#ratio-fields').addEventListener('click', event => {
  const button = event.target.closest('[data-ratio-remove]');
  if (!button) return;
  state.ratios = state.ratios.filter(item => item.id !== button.dataset.ratioRemove);
  renderRatios();
  recalculate();
});
$('#add-ratio').addEventListener('click', () => {
  const presets = [['NO3', 'PO4'], ['PO4', 'NO3'], ['Ca', 'K'], ['SO4', 'Cl']];
  const pair = presets.find(([numerator, denominator]) => !state.ratios.some(item => item.numerator === numerator && item.denominator === denominator)) ?? ['Ca', 'Mg'];
  state.ratios.push({ id: `ratio-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, numerator: pair[0], denominator: pair[1], target: '' });
  renderRatios();
  recalculate();
});
$('#preset-list').addEventListener('change', () => {
  state.selectedPresets = [...$('#preset-list').querySelectorAll('[data-preset]:checked')].map(input => input.dataset.preset);
  applySelectedPresets();
});
$('#preset-list').addEventListener('click', event => {
  const button = event.target.closest('[data-preset-edit]');
  if (button) startPresetEditor(button.dataset.presetEdit);
});
$('#preset-create').addEventListener('click', () => startPresetEditor());
$('#preset-target-editor').addEventListener('change', event => {
  const id = event.target.dataset.presetTargetEnabled;
  if (!id) return;
  document.querySelectorAll(`[data-preset-target-id="${id}"]`).forEach(input => { input.disabled = !event.target.checked; });
});
$('#preset-add-ratio').addEventListener('click', () => {
  presetDraft = readPresetForm();
  const used = new Set(presetDraft.ratios.map(item => item.pair));
  const pair = RATIO_IONS.flatMap(numerator => RATIO_IONS.filter(denominator => denominator !== numerator).map(denominator => `${numerator}:${denominator}`))
    .find(candidate => !used.has(candidate));
  if (!pair) return;
  presetDraft.ratios.push({ pair, target: '', min: '', max: '' });
  renderPresetEditor();
  $('#preset-ratio-editor').lastElementChild?.querySelector('[data-preset-ratio-key="target"]')?.focus();
});
$('#preset-ratio-editor').addEventListener('click', event => {
  const button = event.target.closest('[data-preset-ratio-remove]');
  if (!button) return;
  presetDraft = readPresetForm();
  presetDraft.ratios.splice(Number(button.dataset.presetRatioRemove), 1);
  renderPresetEditor();
});
$('#preset-save').addEventListener('click', savePresetEditor);
$('#preset-cancel').addEventListener('click', () => { presetDraft = null; renderPresetEditor(); });
$('#preset-reset').addEventListener('click', () => {
  if (!presetDraft || !PRESETS.some(item => item.id === presetDraft.id)) return;
  state.userPresets = state.userPresets.filter(item => item.id !== presetDraft.id);
  presetDraft = null;
  renderPresetEditor();
  applySelectedPresets();
});
$('#preset-delete').addEventListener('click', () => {
  if (!presetDraft || PRESETS.some(item => item.id === presetDraft.id) || !window.confirm(translate('Удалить этот пресет?'))) return;
  state.userPresets = state.userPresets.filter(item => item.id !== presetDraft.id);
  state.selectedPresets = state.selectedPresets.filter(id => id !== presetDraft.id);
  presetDraft = null;
  renderPresetEditor();
  applySelectedPresets();
});
$('#source-fields').addEventListener('input', event => {
  if (!event.target.dataset.source) return;
  state.source[event.target.dataset.source] = number(event.target.value);
  recalculate();
});
$('#solve').addEventListener('click', () => {
  recalculate();
  toast(!hasConstraints() ? 'Задайте хотя бы одну цель' : !state.rows.some(row => row.mode === 'auto') ? 'Выберите вещество в режиме «Авто»' : solverWarning || 'Дозировки рассчитаны');
});
$('#add-product').addEventListener('click', () => {
  const id = $('#catalog').value;
  if (!id || getRow(id)) return;
  state.rows.push(makeRow(id));
  recalculate({ render: true });
});
$('#catalog-search').addEventListener('input', renderCatalog);
$('#catalog-effect').addEventListener('change', renderCatalog);
$('#catalog-sort').addEventListener('change', renderCatalog);
$('#open-database').addEventListener('click', () => showView('database'));
$('#reagents').addEventListener('input', event => {
  const input = event.target;
  const row = getRow(input.dataset.row);
  if (!row || !input.dataset.key || row.locked) return;
  if (['dose', 'stockGrams', 'stockMl', 'desiredMl', 'purity'].includes(input.dataset.key)) row[input.dataset.key] = number(input.value);
  if (input.dataset.key === 'dose') {
    row.mode = 'manual';
    const selector = document.querySelector(`[data-row="${row.id}"][data-key="mode"]`);
    if (selector) selector.value = 'manual';
  }
  recalculate();
});
$('#reagents').addEventListener('toggle', event => {
  if (!event.target.classList?.contains('reagent-options')) return;
  const row = getRow(event.target.closest('[data-card]')?.dataset.card);
  if (row) { row.optionsOpen = event.target.open; save(); }
}, true);
$('#reagents').addEventListener('change', event => {
  const input = event.target;
  const row = getRow(input.dataset.row);
  if (!row) return;
  if (input.dataset.key === 'locked') {
    row.locked = input.checked;
    if (row.locked) row.mode = 'manual';
    recalculate({ render: true });
    return;
  }
  if (row.locked || !['mode', 'doseMode', 'variant'].includes(input.dataset.key)) return;
  const previousAmount = displayDoseToAmount(row, PRODUCT_BY_ID[row.id]);
  row[input.dataset.key] = input.value;
  if (input.dataset.key === 'doseMode') row.dose = input.value === 'dry' ? previousAmount : (stockGramsPerL(row) > 0 ? previousAmount * 1000 / stockGramsPerL(row) : 0);
  recalculate({ render: true });
});
$('#reagents').addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const row = getRow(button.dataset.id);
  if (!row || row.locked) return;
  if (button.dataset.action === 'remove') {
    state.rows = state.rows.filter(item => item !== row);
    recalculate({ render: true });
  }
  if (button.dataset.action === 'fit-stock') {
    const product = PRODUCT_BY_ID[row.id];
    const amount = displayDoseToAmount(row, product);
    const desiredMl = number(row.desiredMl);
    const bottleMl = number(row.stockMl);
    if (amount <= 0 || desiredMl <= 0 || bottleMl <= 0) { toast('Сначала рассчитайте ненулевую дозу и задайте объём раствора'); return; }
    row.stockGrams = amount * bottleMl / desiredMl;
    row.dose = desiredMl;
    recalculate({ render: true });
    toast('Навеска маточного раствора подобрана');
  }
});
$('#copy-summary').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(summary()); toast('Расчёт скопирован'); }
  catch { toast('Не удалось скопировать. Откройте страницу через localhost.'); }
});
$('#reset').addEventListener('click', () => {
  const preserved = { customProducts: state.customProducts, userPresets: state.userPresets, journal: state.journal, customTests: state.customTests,
    aquariums: state.aquariums, activeAquariumId: state.activeAquariumId, tankVolume: state.tankVolume,
    tankGH: state.tankGH, tankKH: state.tankKH, tankPH: state.tankPH, tankTDS: state.tankTDS, tank: state.tank };
  state = { ...initialState(), ...preserved };
  presetDraft = null;
  renderPresetEditor();
  solverWarning = '';
  selectedResultId = null;
  syncStaticFields();
  renderAquariums();
  renderPresets();
  renderRatios();
  renderRows();
  recalculate();
});

$('#journal-auto-time').addEventListener('change', event => {
  $('#journal-at').disabled = event.target.checked;
  if (event.target.checked) $('#journal-at').value = localTime(new Date());
});
$('#light-channel-select').addEventListener('change', event => {
  $('#light-channel-custom').hidden = event.target.value !== '__custom__';
  if (!$('#light-channel-custom').hidden) $('#light-channel-custom').focus();
});
$('#light-channel-custom').addEventListener('keydown', event => {
  if (event.key === 'Enter') { event.preventDefault(); $('#light-channel-add').click(); }
});
$('#light-channel-add').addEventListener('click', () => {
  if (lightChannelDraft.length >= MAX_LIGHT_CHANNELS) return;
  const selected = $('#light-channel-select').value;
  if (!selected) { toast('Выберите канал'); return; }
  let channel;
  if (selected === '__custom__') {
    const name = $('#light-channel-custom').value.trim();
    if (!name) { toast('Укажите название своего канала'); return; }
    const id = `custom:${name.toLocaleLowerCase()}`;
    if (lightChannelDraft.some(item => item.id === id) || LIGHT_CHANNELS.some(item => translate(item.label).toLocaleLowerCase() === name.toLocaleLowerCase())) {
      toast('Этот канал уже добавлен'); return;
    }
    channel = { id, name, value: '' };
    if (!state.customLightChannels.some(item => item.toLocaleLowerCase() === name.toLocaleLowerCase())) state.customLightChannels.push(name);
    $('#light-channel-custom').value = '';
    save();
  } else if (selected.startsWith('custom:')) {
    const name = state.customLightChannels.find(item => `custom:${item.toLocaleLowerCase()}` === selected);
    if (!name) return;
    channel = { id: selected, name, value: '' };
  } else {
    if (!LIGHT_CHANNELS.some(item => item.id === selected)) return;
    channel = { id: selected, value: '' };
  }
  lightChannelDraft.push(channel);
  $('#light-channel-select').value = '';
  renderLightChannels();
  [...document.querySelectorAll('#light-channel-list input')].at(-1)?.focus();
});
$('#light-channel-list').addEventListener('input', event => {
  const index = Number(event.target.dataset.lightChannelValue);
  if (Number.isInteger(index) && lightChannelDraft[index]) lightChannelDraft[index].value = event.target.value;
});
$('#light-channel-list').addEventListener('click', event => {
  const button = event.target.closest('[data-light-channel-remove]');
  if (!button) return;
  lightChannelDraft.splice(Number(button.dataset.lightChannelRemove), 1);
  renderLightChannels();
});
$('#journal-add-test').addEventListener('click', () => {
  const id = $('#journal-test-select').value;
  if (!id || id in journalDraft.values) return;
  journalDraft.values[id] = '';
  renderJournalTestFields();
});
$('#journal-test-fields').addEventListener('input', event => {
  if (event.target.dataset.journalValue) journalDraft.values[event.target.dataset.journalValue] = event.target.value;
  if (event.target.dataset.journalNote) journalDraft.notes[event.target.dataset.journalNote] = event.target.value;
});
$('#journal-test-fields').addEventListener('click', event => {
  const button = event.target.closest('[data-journal-remove]');
  if (!button) return;
  delete journalDraft.values[button.dataset.journalRemove];
  delete journalDraft.notes[button.dataset.journalRemove];
  renderJournalTestFields();
});
$('#journal-save').addEventListener('click', () => {
  const at = $('#journal-auto-time').checked ? localTime(new Date()) : $('#journal-at').value;
  if (!at || !Number.isFinite(new Date(at).getTime())) { toast('Укажите корректные дату и время измерения'); return; }
  const values = Object.fromEntries(Object.entries(journalDraft.values).filter(([, value]) => value !== '' && value != null)
    .map(([id, value]) => [id, Number(String(value).replace(',', '.'))]));
  if (!validLightChannels(lightChannelDraft)) { toast('Укажите для каждого канала яркость от 0 до 100%.'); return; }
  const light = readLightForm();
  if ((!Object.keys(values).length && !Object.keys(light).length) || Object.values(values).some(value => !Number.isFinite(value))) { toast('Укажите результат теста или настройки света'); return; }
  const notes = Object.fromEntries(Object.entries(journalDraft.notes).filter(([id, note]) => id in values && note.trim()));
  const entry = { id: editingMeasurementId ?? `measure-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at,
    aquariumId: state.activeAquariumId, location: $('#journal-location').value, values, notes,
    light, note: $('#journal-note').value.trim() };
  if (editingMeasurementId) state.journal = state.journal.map(item => item.id === editingMeasurementId ? entry : item);
  else state.journal.push(entry);
  save();
  renderJournalList();
  renderAquariumList();
  resetJournalForm();
  toast('Измерение сохранено');
});
$('#journal-cancel').addEventListener('click', resetJournalForm);
$('#journal-export').addEventListener('click', () => {
  const entries = [...currentJournal()].sort((a, b) => new Date(a.at) - new Date(b.at));
  if (!entries.length) return;
  const bytes = journalXlsx(entries, allJournalTests(), activeAquarium().name);
  const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  const safeName = activeAquarium().name.normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9._-]+/g, '_')
    .replace(/^[_\.]+|[_\.]+$/g, '')
    .slice(0, 60) || `aquarium-${activeAquarium().id.slice(-6)}`;
  link.href = URL.createObjectURL(blob);
  link.download = `AquaStoich_${safeName}_journal.xlsx`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
});
$('#custom-test-add').addEventListener('click', () => {
  const name = $('#custom-test-name').value.trim();
  if (!name) { toast('Укажите название теста'); return; }
  const test = { id: `test-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, label: name, unit: $('#custom-test-unit').value.trim(), kind: 'physical' };
  state.customTests.push(test);
  journalDraft.values[test.id] = '';
  $('#custom-test-name').value = '';
  $('#custom-test-unit').value = '';
  save();
  renderJournalTestFields();
});
$('#journal-list').addEventListener('click', event => {
  const button = event.target.closest('[data-journal-action]');
  if (!button) return;
  const entry = state.journal.find(item => item.id === button.dataset.id);
  if (!entry) return;
  if (button.dataset.journalAction === 'edit') editJournalEntry(entry);
  if (button.dataset.journalAction === 'delete') {
    if (!window.confirm(translate('Удалить это измерение из журнала?'))) return;
    state.journal = state.journal.filter(item => item.id !== entry.id);
    if (editingMeasurementId === entry.id) resetJournalForm();
    save();
    renderJournalList();
    renderAquariumList();
  }
});

$('#custom-kind').addEventListener('change', renderCustomKind);
for (const id of ['custom-name', 'custom-aliases', 'custom-solubility', 'custom-formula', 'custom-manual']) $('#'+id).addEventListener('input', renderCustomPreview);
$('#add-form').addEventListener('click', () => { additionalForms.push({ formula: '', solubility: '' }); renderAdditionalForms(); renderCustomPreview(); });
$('#additional-forms').addEventListener('input', event => {
  const index = Number(event.target.dataset.formIndex);
  const key = event.target.dataset.formKey;
  if (!Number.isInteger(index) || !additionalForms[index] || !['formula', 'solubility'].includes(key)) return;
  additionalForms[index][key] = event.target.value;
  renderCustomPreview();
});
$('#additional-forms').addEventListener('click', event => {
  const button = event.target.closest('[data-remove-form]');
  if (!button) return;
  additionalForms.splice(Number(button.dataset.removeForm), 1);
  renderAdditionalForms();
  renderCustomPreview();
});
$('#custom-formula').addEventListener('change', () => {
  if (!$('#custom-name').value.trim()) $('#custom-name').value = suggestChemicalName($('#custom-formula').value);
  renderCustomPreview();
});
$('#suggest-name').addEventListener('click', () => {
  const name = suggestChemicalName($('#custom-formula').value);
  if (!name) { toast('Для этой формулы название в подсказках отсутствует'); return; }
  $('#custom-name').value = name;
  renderCustomPreview();
});
$('#add-component').addEventListener('click', () => {
  componentDraft.push({ formula: '', amount: '' });
  renderComponentRows();
});
$('#component-list').addEventListener('input', event => {
  const index = Number(event.target.dataset.componentIndex);
  const key = event.target.dataset.componentKey;
  if (!Number.isInteger(index) || !componentDraft[index] || !['formula', 'amount'].includes(key)) return;
  componentDraft[index][key] = event.target.value;
  renderCustomPreview();
});
$('#component-list').addEventListener('click', event => {
  const button = event.target.closest('[data-remove-component]');
  if (!button) return;
  componentDraft.splice(Number(button.dataset.removeComponent), 1);
  if (!componentDraft.length) componentDraft.push({ formula: '', amount: '' });
  renderComponentRows();
  renderCustomPreview();
});
$('#custom-save').addEventListener('click', () => {
  try {
    const product = customProductFromForm(customFormData());
    if (editingProductId && state.rows.some(row => row.id === editingProductId && row.locked)) { toast('Сначала снимите фиксацию вещества в расчёте'); return; }
    if (editingProductId) state.customProducts = state.customProducts.map(item => item.id === editingProductId ? product : item);
    else if (product.kind === 'substance') {
      const base = normalizeFormula(product.short);
      const existing = state.customProducts.find(item => item.kind === 'substance'
        && normalizeFormula(item.variants?.[0]?.name ?? item.components?.[0]?.formula ?? item.formulaText ?? item.short).split('·')[0] === base);
      if (existing) {
        if (existing.manualComposition || product.manualComposition) throw new Error('Формы с ручным ионным составом объединяются только после задания расчётных формул.');
        const oldVariants = existing.variants?.length ? existing.variants : customProductFromForm({
          id: existing.id, kind: 'substance', name: existing.name,
          formula: existing.components?.[0]?.formula ?? existing.formulaText, solubility: existing.solubilityGPerL,
        }).variants;
        const names = new Set(oldVariants.map(item => normalizeFormula(item.name)));
        if (product.variants.some(item => names.has(normalizeFormula(item.name)))) throw new Error('Эта химическая форма уже есть в карточке вещества. Откройте карточку через «Изменить».');
        const variants = [...oldVariants, ...product.variants.map((item, index) => ({ ...item, id: `form-${oldVariants.length + index + 1}` }))];
        const merged = { ...existing, variants, formulaText: variants.map(item => item.name).join(' / '),
          aliases: [existing.aliases, product.aliases].filter(Boolean).join(', '),
          note: 'Ионный состав каждой формы рассчитан по её формуле. Растворимость указана отдельно для каждой формы.' };
        state.customProducts = state.customProducts.map(item => item.id === existing.id ? merged : item);
        toast('Новая форма добавлена в существующую карточку');
      } else state.customProducts.push(product);
    } else state.customProducts.push(product);
    setCustomProducts(state.customProducts);
    renderRows();
    recalculate();
    renderDatabaseList();
    resetCustomForm();
    toast('Вещество сохранено в локальной базе');
  } catch (error) { toast(error.message); $('#custom-preview').innerHTML = `<span class="preview-error">${esc(translate(error.message))}</span>`; }
});
$('#custom-cancel').addEventListener('click', resetCustomForm);
$('#database-search').addEventListener('input', renderDatabaseList);
$('#database-effect').addEventListener('change', renderDatabaseList);
$('#database-sort').addEventListener('change', renderDatabaseList);
$('#database-list').addEventListener('click', event => {
  const button = event.target.closest('[data-db-action]');
  if (!button) return;
  const product = PRODUCT_BY_ID[button.dataset.id];
  if (!product) return;
  if (button.dataset.dbAction === 'add' && !product.referenceOnly && !getRow(product.id)) {
    state.rows.push(makeRow(product.id));
    recalculate({ render: true });
    showView('calculator');
  }
  if (button.dataset.dbAction === 'edit' && product.custom) editCustomProduct(product);
  if (button.dataset.dbAction === 'delete' && product.custom) {
    if (state.rows.some(row => row.id === product.id && row.locked)) { toast('Сначала снимите фиксацию вещества в расчёте'); return; }
    const prompts = { en: `Delete “${translate(product.name)}” from the local database?`,
      ru: `Удалить «${product.name}» из локальной базы?`,
      de: `„${translate(product.name)}“ aus der lokalen Datenbank löschen?`,
      es: `¿Eliminar «${translate(product.name)}» de la base local?` };
    if (!window.confirm(prompts[getLocale()])) return;
    state.customProducts = state.customProducts.filter(item => item.id !== product.id);
    state.rows = state.rows.filter(row => row.id !== product.id);
    setCustomProducts(state.customProducts);
    if (editingProductId === product.id) resetCustomForm();
    renderRows();
    recalculate();
    renderDatabaseList();
  }
});

document.addEventListener('aqua-locale-change', () => {
  $('.source-note a').href = `https://github.com/Fantomiaso/aquastoich/blob/main/README${getLocale() === 'en' ? '' : `.${getLocale()}`}.md`;
  document.querySelectorAll('[data-target-bound]').forEach(input => {
    const label = TARGETS.find(item => item.id === input.dataset.targetBound)?.label ?? input.dataset.targetBound;
    input.setAttribute('aria-label', `${translate(input.dataset.bound === 'min' ? 'Нижняя граница' : 'Верхняя граница')}: ${label}`);
  });
  renderPresets();
  if (presetDraft) {
    const current = readPresetForm();
    if (PRESETS.some(item => item.id === current.id) && current.name === presetOriginalName && !current.userNamed) {
      presetOriginalName = translate(PRESETS.find(item => item.id === current.id).name);
      current.name = presetOriginalName;
    }
    presetDraft = current;
    renderPresetEditor();
  }
  renderCatalog();
  renderRows();
  recalculate();
  renderJournalList();
  renderAquariums();
  renderDatabaseList();
});
startLocalization();
