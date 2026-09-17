export const MAX_LIGHT_CHANNELS = 8;

export const LIGHT_CHANNELS = [
  { id: 'white', label: 'Белый', english: 'White' },
  { id: 'warm-white', label: 'Тёплый белый', english: 'Warm white' },
  { id: 'cool-white', label: 'Холодный белый', english: 'Cool white' },
  { id: 'red', label: 'Красный', english: 'Red' },
  { id: 'deep-red', label: 'Глубокий красный', english: 'Deep red' },
  { id: 'green', label: 'Зелёный', english: 'Green' },
  { id: 'blue', label: 'Синий', english: 'Blue' },
  { id: 'royal-blue', label: 'Королевский синий', english: 'Royal blue' },
  { id: 'cyan', label: 'Голубой', english: 'Cyan' },
  { id: 'violet', label: 'Фиолетовый', english: 'Violet' },
  { id: 'uv', label: 'УФ', english: 'UV' },
  { id: 'amber', label: 'Янтарный', english: 'Amber' },
  { id: 'moonlight', label: 'Лунный свет', english: 'Moonlight' },
];

export function channelName(channel, translate = value => value, english = false) {
  const preset = LIGHT_CHANNELS.find(item => item.id === channel.id);
  return preset ? english ? preset.english : translate(preset.label) : String(channel.name ?? channel.id ?? '').trim();
}

export function validLightChannels(channels) {
  return Array.isArray(channels) && channels.length <= MAX_LIGHT_CHANNELS
    && channels.every((channel, index) => {
      const id = String(channel.id ?? '');
      const value = Number(channel.value);
      return id && channel.value !== '' && Number.isFinite(value) && value >= 0 && value <= 100
        && (LIGHT_CHANNELS.some(item => item.id === id) || String(channel.name ?? '').trim())
        && !channels.slice(0, index).some(previous => previous.id === id);
    });
}
