// Dimensions are external centimetres; glass is millimetres. Substrate depth is
// an average over the footprint. Equipment and decor displacement is excluded.
export function estimateAquariumVolume(geometry = {}) {
  const value = item => Number(String(item ?? '').replace(',', '.'));
  const length = value(geometry.lengthCm);
  const width = value(geometry.widthCm);
  const height = value(geometry.heightCm);
  const diameter = value(geometry.diameterCm);
  const glass = value(geometry.glassMm ?? 0) / 10;
  const substrate = value(geometry.substrateCm ?? 0);
  const topGap = value(geometry.topGapCm ?? 0);
  if (![height, glass, substrate, topGap].every(Number.isFinite)
    || height <= 0 || glass < 0 || substrate < 0 || topGap < 0) return null;
  const waterHeight = height - glass - substrate - topGap;
  if (waterHeight <= 0) return null;
  let area;
  if (geometry.shape === 'cylinder') {
    if (!Number.isFinite(diameter) || diameter <= 2 * glass) return null;
    area = Math.PI * ((diameter - 2 * glass) / 2) ** 2;
  } else {
    if (![length, width].every(Number.isFinite) || length <= 2 * glass || width <= 2 * glass) return null;
    area = (length - 2 * glass) * (width - 2 * glass);
  }
  return area * waterHeight / 1000;
}

export function makeAquarium(name = 'Aquarium 1', previous = {}) {
  return {
    id: `aquarium-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name, note: '', geometry: { shape: 'rect', lengthCm: '', widthCm: '', heightCm: '', diameterCm: '', glassMm: '', substrateCm: '', topGapCm: '' },
    volumeMode: 'manual', tankVolume: previous.tankVolume ?? 100,
    tankGH: previous.tankGH ?? '', tankKH: previous.tankKH ?? '', tankPH: previous.tankPH ?? '', tankTDS: previous.tankTDS ?? '', tank: { ...(previous.tank ?? {}) }
  };
}
