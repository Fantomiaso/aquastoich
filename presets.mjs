// Editable starting points, not species-specific requirements. Ratios are mg/L.
export const PRESETS = [
  { id: 'community', name: 'Общий пресноводный', ratios: [{ pair: 'Ca:Mg', target: 3.5, min: 2, max: 6 }, { pair: 'NO3:PO4', target: 12, min: 8, max: 20 }] },
  { id: 'cichlid', name: 'Цихлидник', ratios: [{ pair: 'Ca:Mg', target: 4, min: 3, max: 6 }] },
  { id: 'slow-planted', name: 'Медленный травник', ratios: [{ pair: 'Ca:Mg', target: 3, min: 2, max: 5 }, { pair: 'NO3:PO4', target: 10, min: 8, max: 15 }] },
  { id: 'co2-planted', name: 'Травник с CO₂', ratios: [{ pair: 'Ca:Mg', target: 3, min: 2, max: 5 }, { pair: 'NO3:PO4', target: 15, min: 12, max: 20 }] },
  { id: 'shrimp', name: 'Креветочник', ratios: [{ pair: 'Ca:Mg', target: 3, min: 2.5, max: 4 }] },
  { id: 'snails', name: 'Улиточник', ratios: [{ pair: 'Ca:Mg', target: 5, min: 4, max: 7 }] },
  { id: 'softwater', name: 'Мягководный биотоп', ratios: [{ pair: 'Ca:Mg', target: 2, min: 1.5, max: 3 }] },
];

const presetNames = {
  en: { community: 'Community freshwater', cichlid: 'Cichlid tank', 'slow-planted': 'Low-tech planted', 'co2-planted': 'CO₂ planted', shrimp: 'Shrimp tank', snails: 'Snail tank', softwater: 'Soft-water biotope' },
  de: { community: 'Gesellschaftsbecken', cichlid: 'Cichlidenbecken', 'slow-planted': 'Langsames Pflanzenaquarium', 'co2-planted': 'Pflanzenaquarium mit CO₂', shrimp: 'Garnelenbecken', snails: 'Schneckenbecken', softwater: 'Weichwasserbiotop' },
  es: { community: 'Acuario comunitario', cichlid: 'Acuario de cíclidos', 'slow-planted': 'Plantado lento', 'co2-planted': 'Plantado con CO₂', shrimp: 'Acuario de gambas', snails: 'Acuario de caracoles', softwater: 'Biotopo de aguas blandas' }
};
const wording = {
  ru: { allows: (name, min, max, target) => `«${name}» допускает ${min}–${max}:1 (цель ${target}:1)`, conflict: (min, minName, max, maxName) => `Нет общего значения: нижняя граница ${min}:1 у «${minName}» выше верхней ${max}:1 у «${maxName}». Снимите один из пресетов или задайте соотношение вручную.`, notice: (target, min, max) => `общая цель ${target}:1, допустимо ${min}–${max}:1` },
  en: { allows: (name, min, max, target) => `“${name}” allows ${min}–${max}:1 (target ${target}:1)`, conflict: (min, minName, max, maxName) => `No common value: “${minName}” requires at least ${min}:1 while “${maxName}” allows at most ${max}:1. Deselect one preset or edit the ratio.`, notice: (target, min, max) => `combined target ${target}:1, allowed ${min}–${max}:1` },
  de: { allows: (name, min, max, target) => `„${name}“ erlaubt ${min}–${max}:1 (Ziel ${target}:1)`, conflict: (min, minName, max, maxName) => `Kein gemeinsamer Wert: „${minName}“ verlangt mindestens ${min}:1, „${maxName}“ erlaubt höchstens ${max}:1. Eine Vorlage abwählen oder das Verhältnis bearbeiten.`, notice: (target, min, max) => `gemeinsames Ziel ${target}:1, zulässig ${min}–${max}:1` },
  es: { allows: (name, min, max, target) => `«${name}» permite ${min}–${max}:1 (objetivo ${target}:1)`, conflict: (min, minName, max, maxName) => `No hay un valor común: «${minName}» exige al menos ${min}:1 y «${maxName}» permite como máximo ${max}:1. Desmarque un preajuste o edite la proporción.`, notice: (target, min, max) => `objetivo combinado ${target}:1, permitido ${min}–${max}:1` }
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
  const conflicts = [];
  const notices = [];
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
  return { ratios, conflicts, notices };
}
