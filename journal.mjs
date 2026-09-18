// Common freshwater drop tests, plus physical readings often logged alongside them.
// Users can add any additional test with its own unit.
export const JOURNAL_TESTS = [
  { id: 'pH', label: 'pH', unit: '', kind: 'physical' },
  { id: 'GH', label: 'GH', unit: '°dGH', kind: 'physical' },
  { id: 'KH', label: 'KH', unit: '°dKH', kind: 'physical' },
  { id: 'TDS', label: 'TDS', unit: 'ppm', kind: 'physical' },
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
