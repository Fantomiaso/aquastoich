// Common freshwater drop tests, plus physical readings often logged alongside them.
// Users can add any additional test with its own unit.
export const JOURNAL_TESTS = [
  { id: 'pH', label: 'pH', unit: '', kind: 'physical' },
  { id: 'GH', label: 'GH', unit: '°dGH', kind: 'physical' },
  { id: 'KH', label: 'KH', unit: '°dKH', kind: 'physical' },
  { id: 'TDS', label: 'TDS', unit: 'ppm', kind: 'physical' },
  { id: 'HCO3', label: 'HCO₃⁻', unit: 'мг/л', kind: 'physical' },
  { id: 'CO3', label: 'CO₃²⁻', unit: 'мг/л', kind: 'physical' },
  { id: 'NH4', label: 'NH₄⁺', unit: 'мг/л', kind: 'nutrient' },
  { id: 'NH3', label: 'NH₃', unit: 'мг/л', kind: 'nutrient' },
  { id: 'NH4NH3', label: 'NH₄/NH₃ (общий)', unit: 'мг/л', kind: 'nutrient' },
  { id: 'NO2', label: 'NO₂⁻', unit: 'мг/л', kind: 'nutrient' },
  { id: 'NO3', label: 'NO₃⁻', unit: 'мг/л', kind: 'nutrient' },
  { id: 'PO4', label: 'PO₄', unit: 'мг/л', kind: 'nutrient' },
  { id: 'Fe', label: 'Fe', unit: 'мг/л', kind: 'nutrient' },
  { id: 'K', label: 'K', unit: 'мг/л', kind: 'nutrient' },
  { id: 'Ca', label: 'Ca', unit: 'мг/л', kind: 'nutrient' },
  { id: 'Mg', label: 'Mg', unit: 'мг/л', kind: 'nutrient' },
  { id: 'Cu', label: 'Cu', unit: 'мг/л', kind: 'nutrient' },
  { id: 'Mn', label: 'Mn', unit: 'мг/л', kind: 'nutrient' },
  { id: 'SiO2', label: 'SiO₂ / силикаты', unit: 'мг/л', kind: 'nutrient' },
  { id: 'SO4', label: 'SO₄²⁻', unit: 'мг/л', kind: 'nutrient' },
  { id: 'Cl', label: 'Cl⁻ / хлорид', unit: 'мг/л', kind: 'nutrient' },
  { id: 'Cl2free', label: 'Свободный хлор', unit: 'мг/л', kind: 'physical' },
  { id: 'Cl2total', label: 'Общий хлор', unit: 'мг/л', kind: 'physical' },
  { id: 'O2', label: 'O₂ растворённый', unit: 'мг/л', kind: 'physical' },
  { id: 'CO2', label: 'CO₂', unit: 'мг/л', kind: 'physical' },
  { id: 'I', label: 'Йод', unit: 'мг/л', kind: 'nutrient' },
  { id: 'B', label: 'Бор', unit: 'мг/л', kind: 'nutrient' },
  { id: 'Na', label: 'Na', unit: 'мг/л', kind: 'nutrient' },
  { id: 'T', label: 'Температура', unit: '°C', kind: 'physical' },
  { id: 'EC', label: 'Электропроводность', unit: 'мкСм/см', kind: 'physical' },
  { id: 'salinity', label: 'Солёность', unit: '‰', kind: 'physical' },
];

export const JOURNAL_PERIOD_DAYS = Object.freeze({ week: 7, month: 30, quarter: 90, halfyear: 183, year: 365 });

// These are related readings from the same measurement. They explain a
// composite value but are not arithmetically added because their units differ.
export const JOURNAL_COMPONENTS = Object.freeze({
  GH: ['Ca', 'Mg'],
  KH: ['HCO3', 'CO3'],
  TDS: ['EC', 'Ca', 'Mg', 'K', 'Na', 'NO3', 'PO4', 'SO4', 'Cl'],
  NH4NH3: ['NH4', 'NH3'],
  Cl2total: ['Cl2free'],
});

const validReading = value => value !== '' && value != null && Number.isFinite(Number(value));
const dateStart = value => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ''))) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isFinite(date.getTime()) ? date.getTime() : null;
};
const dateEnd = value => {
  const start = dateStart(value);
  return start == null ? null : start + 86400000 - 1;
};

export function journalPeriodBounds(period, now = new Date(), from = '', to = '') {
  const end = new Date(now).getTime();
  if (!Number.isFinite(end)) return null;
  if (period === 'manual') {
    const start = dateStart(from);
    const manualEnd = dateEnd(to);
    return start == null || manualEnd == null || start > manualEnd ? null : { start, end: manualEnd };
  }
  const days = JOURNAL_PERIOD_DAYS[period];
  return days ? { start: end - days * 86400000, end } : null;
}

export function journalSeries(entries, { testId, location = 'aquarium', period = 'month', from = '', to = '', now = new Date() } = {}) {
  return journalEntriesInPeriod(entries, { location, period, from, to, now })
    .filter(entry => validReading(entry.values?.[testId]));
}

export function journalEntriesInPeriod(entries, { location = 'aquarium', period = 'month', from = '', to = '', now = new Date() } = {}) {
  const bounds = journalPeriodBounds(period, now, from, to);
  if (!bounds) return [];
  return (entries ?? []).filter(entry => entry.location === location)
    .filter(entry => {
      const timestamp = new Date(entry.at).getTime();
      return Number.isFinite(timestamp) && timestamp >= bounds.start && timestamp <= bounds.end;
    })
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}

export function journalComponents(entry, testId) {
  return (JOURNAL_COMPONENTS[testId] ?? []).filter(id => validReading(entry?.values?.[id]))
    .map(id => ({ id, value: Number(entry.values[id]) }));
}

export function journalComparison(first, second, testId) {
  if (!first || !second || !validReading(first.values?.[testId]) || !validReading(second.values?.[testId])) return null;
  const firstAt = new Date(first.at).getTime();
  const secondAt = new Date(second.at).getTime();
  if (!Number.isFinite(firstAt) || !Number.isFinite(secondAt) || firstAt > secondAt) return null;
  const firstValue = Number(first.values[testId]);
  const secondValue = Number(second.values[testId]);
  const days = (secondAt - firstAt) / 86400000;
  const delta = secondValue - firstValue;
  return { firstValue, secondValue, delta, days, perDay: days === 0 ? null : delta / days };
}

export function journalDifference(entries, current, testId) {
  const timestamp = new Date(current.at).getTime();
  const value = Number(current.values?.[testId]);
  if (!Number.isFinite(timestamp) || !Number.isFinite(value) || current.values?.[testId] === '') return null;
  const previous = entries.filter(entry => entry.id !== current.id && entry.location === current.location
    && entry.aquariumId === current.aquariumId
    && Number.isFinite(new Date(entry.at).getTime()) && new Date(entry.at).getTime() < timestamp
    && entry.values?.[testId] !== '' && entry.values?.[testId] != null && Number.isFinite(Number(entry.values[testId])))
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())[0];
  if (!previous) return null;
  const days = (timestamp - new Date(previous.at).getTime()) / 86400000;
  if (days <= 0) return null;
  const delta = value - Number(previous.values[testId]);
  return { previous, delta, days, perDay: delta / days, absolute: Math.abs(delta) };
}
