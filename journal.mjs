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

const bucketStart = (value, scale) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  if (scale === 'week') date.setDate(date.getDate() - (date.getDay() + 6) % 7);
  if (scale === 'month') date.setDate(1);
  return date;
};
const nextBucket = (value, scale) => {
  const date = new Date(value);
  if (scale === 'month') date.setMonth(date.getMonth() + 1, 1);
  else date.setDate(date.getDate() + (scale === 'week' ? 7 : 1));
  return date;
};

export function journalTrendBuckets(entries, testId, scale = 'day') {
  const readings = (entries ?? []).filter(entry => validReading(entry.values?.[testId]))
    .sort((left, right) => new Date(left.at).getTime() - new Date(right.at).getTime());
  if (!readings.length) return [];
  const first = bucketStart(readings[0].at, scale);
  const last = bucketStart(readings.at(-1).at, scale);
  const buckets = [];
  for (let cursor = first; cursor.getTime() <= last.getTime(); cursor = nextBucket(cursor, scale)) {
    const next = nextBucket(cursor, scale);
    const start = cursor.getTime();
    const end = next.getTime() - 1;
    const members = readings.filter(entry => {
      const timestamp = new Date(entry.at).getTime();
      return timestamp >= start && timestamp <= end;
    });
    const measuredValue = members.length ? members.reduce((sum, entry) => sum + Number(entry.values[testId]), 0) / members.length : null;
    buckets.push({ start, end, entries: members, value: measuredValue, measured: members.length > 0, interpolated: false });
  }
  const measuredIndexes = buckets.map((bucket, index) => bucket.measured ? index : -1).filter(index => index >= 0);
  for (let pair = 0; pair < measuredIndexes.length - 1; pair += 1) {
    const leftIndex = measuredIndexes[pair];
    const rightIndex = measuredIndexes[pair + 1];
    const span = rightIndex - leftIndex;
    if (span <= 1) continue;
    const leftValue = buckets[leftIndex].value;
    const rightValue = buckets[rightIndex].value;
    for (let index = leftIndex + 1; index < rightIndex; index += 1) {
      buckets[index].value = leftValue + (rightValue - leftValue) * ((index - leftIndex) / span);
      buckets[index].interpolated = true;
    }
  }
  return buckets;
}

export function journalChartScale(values) {
  const finite = (values ?? []).map(Number).filter(Number.isFinite);
  if (!finite.length) return { minimum: 0, maximum: 1, span: 1 };
  const observedMinimum = Math.min(...finite);
  const observedMaximum = Math.max(...finite);
  const observedSpan = observedMaximum - observedMinimum;
  let padding;
  if (observedSpan > 1e-12) padding = observedSpan * 0.12;
  else if (Math.abs(observedMaximum) > 0) {
    const order = 10 ** Math.floor(Math.log10(Math.abs(observedMaximum)));
    padding = Math.max(Math.abs(observedMaximum) * 0.08, order * 0.02);
  } else padding = 1;
  const minimum = observedMinimum >= 0 ? Math.max(0, observedMinimum - padding) : observedMinimum - padding;
  const maximum = observedMaximum + padding;
  return { minimum, maximum, span: Math.max(Number.EPSILON, maximum - minimum) };
}

export function journalChartHeight(value, scale) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || !scale) return 0;
  const raw = Math.max(0, Math.min(100, (numeric - scale.minimum) / scale.span * 100));
  if (numeric === 0 && scale.minimum === 0) return 0;
  return Math.max(10, raw);
}

export function journalPeriodStatistics(entries, testId) {
  const readings = (entries ?? []).filter(entry => validReading(entry.values?.[testId]))
    .sort((left, right) => new Date(left.at).getTime() - new Date(right.at).getTime());
  if (!readings.length) return null;
  const values = readings.map(entry => Number(entry.values[testId]));
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const changes = readings.slice(1).map((entry, index) => {
    const previous = readings[index];
    const delta = Number(entry.values[testId]) - Number(previous.values[testId]);
    return { previous, entry, delta, absolute: Math.abs(delta) };
  });
  const maximumChange = changes.reduce((largest, change) => !largest || change.absolute > largest.absolute ? change : largest, null);
  return {
    readings,
    minimum,
    maximum,
    minimumEntries: readings.filter(entry => Number(entry.values[testId]) === minimum),
    maximumEntries: readings.filter(entry => Number(entry.values[testId]) === maximum),
    averageAbsoluteChange: changes.length ? changes.reduce((sum, change) => sum + change.absolute, 0) / changes.length : null,
    maximumChange,
    changes,
  };
}

export function journalEntriesInSelectedDays(entries, first, second) {
  if (!first || !second) return [...(entries ?? [])];
  const start = new Date(first.at);
  const end = new Date(second.at);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) return [...(entries ?? [])];
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  if (start > end) return [...(entries ?? [])];
  return (entries ?? []).filter(entry => {
    const at = new Date(entry.at).getTime();
    return Number.isFinite(at) && at >= start.getTime() && at <= end.getTime();
  });
}

export function journalInterpolatedReading(entries, at) {
  const target = new Date(at).getTime();
  if (!Number.isFinite(target)) return null;
  const ordered = (entries ?? []).filter(entry => Number.isFinite(new Date(entry.at).getTime()))
    .sort((left, right) => new Date(left.at).getTime() - new Date(right.at).getTime());
  const previous = [...ordered].reverse().find(entry => new Date(entry.at).getTime() < target);
  const next = ordered.find(entry => new Date(entry.at).getTime() > target);
  if (!previous || !next) return null;
  const previousAt = new Date(previous.at).getTime();
  const nextAt = new Date(next.at).getTime();
  if (nextAt <= previousAt) return null;
  const ratio = (target - previousAt) / (nextAt - previousAt);
  const ids = [...new Set([...Object.keys(previous.values ?? {}), ...Object.keys(next.values ?? {})])];
  const values = Object.fromEntries(ids.flatMap(id => validReading(previous.values?.[id]) && validReading(next.values?.[id])
    ? [[id, Number(previous.values[id]) + (Number(next.values[id]) - Number(previous.values[id])) * ratio]] : []));
  return Object.keys(values).length ? { at: target, previous, next, ratio, values } : null;
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
