// Editable starting points, not species-specific requirements. Nutrients are mg/L.
export const PRESETS = [
  { id: 'community', name: 'Общий пресноводный', targets: { GH: [7, 5, 10], KH: [4, 2, 6], K: [10, 5, 15], NO3: [10, 5, 20], PO4: [0.833, 0.4, 1.5] }, ratios: [{ pair: 'Ca:Mg', target: 3.5, min: 2, max: 6 }, { pair: 'NO3:PO4', target: 12, min: 8, max: 20 }] },
  { id: 'cichlid', name: 'Цихлидник', targets: { GH: [12, 8, 18], KH: [8, 5, 12], NO3: [10, 0, 20] }, ratios: [{ pair: 'Ca:Mg', target: 4, min: 3, max: 6 }] },
  { id: 'slow-planted', name: 'Медленный травник', targets: { GH: [6, 4, 8], KH: [3, 2, 5], K: [8, 5, 12], NO3: [8, 5, 15], PO4: [0.8, 0.5, 1.2], Fe: [0.05, 0.02, 0.1] }, ratios: [{ pair: 'Ca:Mg', target: 3, min: 2, max: 5 }, { pair: 'NO3:PO4', target: 10, min: 8, max: 15 }] },
  { id: 'co2-planted', name: 'Травник с CO₂', targets: { GH: [6, 4, 8], KH: [4, 2, 6], K: [15, 10, 20], NO3: [15, 10, 25], PO4: [1, 0.7, 2], Fe: [0.1, 0.05, 0.2] }, ratios: [{ pair: 'Ca:Mg', target: 3, min: 2, max: 5 }, { pair: 'NO3:PO4', target: 15, min: 12, max: 20 }] },
  { id: 'shrimp', name: 'Креветочник', targets: { GH: [6, 5, 8], KH: [2, 0, 4], NO3: [5, 0, 10] }, ratios: [{ pair: 'Ca:Mg', target: 3, min: 2.5, max: 4 }] },
  { id: 'snails', name: 'Улиточник', targets: { GH: [12, 8, 16], KH: [7, 5, 10], NO3: [5, 0, 20] }, ratios: [{ pair: 'Ca:Mg', target: 5, min: 4, max: 7 }] },
  { id: 'softwater', name: 'Мягководный биотоп', targets: { GH: [3, 1, 5], KH: [1, 0, 2], NO3: [5, 0, 10] }, ratios: [{ pair: 'Ca:Mg', target: 2, min: 1.5, max: 3 }] },
];

const presetNames = {
  en: { community: 'Community freshwater', cichlid: 'Cichlid tank', 'slow-planted': 'Low-tech planted', 'co2-planted': 'CO₂ planted', shrimp: 'Shrimp tank', snails: 'Snail tank', softwater: 'Soft-water biotope' },
  de: { community: 'Gesellschaftsbecken', cichlid: 'Cichlidenbecken', 'slow-planted': 'Langsames Pflanzenaquarium', 'co2-planted': 'Pflanzenaquarium mit CO₂', shrimp: 'Garnelenbecken', snails: 'Schneckenbecken', softwater: 'Weichwasserbiotop' },
  es: { community: 'Acuario comunitario', cichlid: 'Acuario de cíclidos', 'slow-planted': 'Plantado lento', 'co2-planted': 'Plantado con CO₂', shrimp: 'Acuario de gambas', snails: 'Acuario de caracoles', softwater: 'Biotopo de aguas blandas' }
};
const wording = {
  ru: { allows: (name, min, max, target) => `«${name}» допускает ${min}–${max}:1 (цель ${target}:1)`, conflict: (min, minName, max, maxName) => `Нет общего значения: нижняя граница ${min}:1 у «${minName}» выше верхней ${max}:1 у «${maxName}». Снимите один из пресетов или задайте соотношение вручную.`, targetAllows: (name, min, max, target) => `«${name}»: ${min}–${max} (цель ${target})`, targetConflict: (min, minName, max, maxName) => `Диапазоны не пересекаются: у «${minName}» минимум ${min}, у «${maxName}» максимум ${max}. Снимите один из пресетов или настройте параметр вручную.`, notice: (target, min, max) => `общая цель ${target}:1, допустимо ${min}–${max}:1` },
  en: { allows: (name, min, max, target) => `“${name}” allows ${min}–${max}:1 (target ${target}:1)`, conflict: (min, minName, max, maxName) => `No common value: “${minName}” requires at least ${min}:1 while “${maxName}” allows at most ${max}:1. Deselect one preset or edit the ratio.`, targetAllows: (name, min, max, target) => `“${name}”: ${min}–${max} (target ${target})`, targetConflict: (min, minName, max, maxName) => `The ranges do not overlap: “${minName}” requires at least ${min}, while “${maxName}” allows at most ${max}. Deselect one preset or edit the parameter.`, notice: (target, min, max) => `combined target ${target}:1, allowed ${min}–${max}:1` },
  de: { allows: (name, min, max, target) => `„${name}“ erlaubt ${min}–${max}:1 (Ziel ${target}:1)`, conflict: (min, minName, max, maxName) => `Kein gemeinsamer Wert: „${minName}“ verlangt mindestens ${min}:1, „${maxName}“ erlaubt höchstens ${max}:1. Eine Vorlage abwählen oder das Verhältnis bearbeiten.`, targetAllows: (name, min, max, target) => `„${name}“: ${min}–${max} (Ziel ${target})`, targetConflict: (min, minName, max, maxName) => `Die Bereiche überschneiden sich nicht: „${minName}“ verlangt mindestens ${min}, „${maxName}“ erlaubt höchstens ${max}. Eine Vorlage abwählen oder den Wert bearbeiten.`, notice: (target, min, max) => `gemeinsames Ziel ${target}:1, zulässig ${min}–${max}:1` },
  es: { allows: (name, min, max, target) => `«${name}» permite ${min}–${max}:1 (objetivo ${target}:1)`, conflict: (min, minName, max, maxName) => `No hay un valor común: «${minName}» exige al menos ${min}:1 y «${maxName}» permite como máximo ${max}:1. Desmarque un preajuste o edite la proporción.`, targetAllows: (name, min, max, target) => `«${name}»: ${min}–${max} (objetivo ${target})`, targetConflict: (min, minName, max, maxName) => `Los rangos no se solapan: «${minName}» exige al menos ${min} y «${maxName}» permite como máximo ${max}. Desmarque un preajuste o edite el parámetro.`, notice: (target, min, max) => `objetivo combinado ${target}:1, permitido ${min}–${max}:1` }
};
export function mergePresets(ids, locale = 'ru') {
  const display = value => new Intl.NumberFormat(({ en: 'en-US', ru: 'ru-RU', de: 'de-DE', es: 'es-ES' })[locale] ?? 'ru-RU', { maximumFractionDigits: 3 }).format(value);
  const words = wording[locale] ?? wording.ru;
  const selected = PRESETS.filter(preset => ids.includes(preset.id));
  const byPair = new Map();
  for (const preset of selected) for (const ratio of preset.ratios) {
    if (!byPair.has(ratio.pair)) byPair.set(ratio.pair, []);
    byPair.get(ratio.pair).push({ ...ratio, preset: presetNames[locale]?.[preset.id] ?? preset.name });
  }
  const ratios = [];
  const targets = [];
  const conflicts = [];
  const notices = [];
  const byTarget = new Map();
  for (const preset of selected) for (const [id, [target, min, max]] of Object.entries(preset.targets ?? {})) {
    if (!byTarget.has(id)) byTarget.set(id, []);
    byTarget.get(id).push({ target, min, max, preset: presetNames[locale]?.[preset.id] ?? preset.name });
  }
  for (const [id, values] of byTarget) {
    const min = Math.max(...values.map(item => item.min));
    const max = Math.min(...values.map(item => item.max));
    if (min > max) {
      const listed = values.map(item => words.targetAllows(item.preset, display(item.min), display(item.max), display(item.target))).join('; ');
      const highestMin = values.find(item => item.min === min);
      const lowestMax = values.find(item => item.max === max);
      conflicts.push(`${id}: ${listed}. ${words.targetConflict(display(min), highestMin.preset, display(max), lowestMax.preset)}`);
      continue;
    }
    const target = Math.max(min, Math.min(max, values.reduce((sum, item) => sum + item.target, 0) / values.length));
    targets.push({ id, target: Number(target.toFixed(3)), min, max });
  }
  for (const [pair, values] of byPair) {
    const min = Math.max(...values.map(item => item.min));
    const max = Math.min(...values.map(item => item.max));
    if (min > max) {
      const listed = values.map(item => words.allows(item.preset, display(item.min), display(item.max), display(item.target))).join('; ');
      const highestMin = values.find(item => item.min === min);
      const lowestMax = values.find(item => item.max === max);
      conflicts.push(`${pair}: ${listed}. ${words.conflict(display(min), highestMin.preset, display(max), lowestMax.preset)}`);
      continue;
    }
    const target = Math.max(min, Math.min(max, values.reduce((sum, item) => sum + item.target, 0) / values.length));
    if (values.length > 1 && new Set(values.map(item => item.target)).size > 1)
      notices.push(`${pair}: ${words.notice(display(Number(target.toFixed(3))), display(min), display(max))}`);
    const [numerator, denominator] = pair.split(':');
    ratios.push({ id: `preset-${numerator.toLowerCase()}-${denominator.toLowerCase()}`, numerator, denominator,
      target: Number(target.toFixed(3)), min, max, fromPreset: true });
  }
  return { ratios, targets, conflicts, notices };
}
