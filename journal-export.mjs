import { MAX_LIGHT_CHANNELS, channelName } from './light-channels.mjs';

const encoder = new TextEncoder();
const xml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]);
const columnName = index => {
  let name = '';
  for (let number = index + 1; number; number = Math.floor((number - 1) / 26)) name = String.fromCharCode(65 + (number - 1) % 26) + name;
  return name;
};
const excelLocalDate = value => {
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(String(value));
  if (!match) return null;
  const [, year, month, day, hour, minute] = match.map(Number);
  const time = Date.UTC(year, month - 1, day, hour, minute);
  return Number.isFinite(time) ? (time - Date.UTC(1899, 11, 30)) / 86400000 : null;
};
const sheetCell = (value, column, row, bold = false) => {
  if (value === '' || value == null) return '';
  const address = `${columnName(column)}${row}`;
  if (column === 1 && row > 1) {
    const serial = excelLocalDate(value);
    if (serial != null) return `<c r="${address}" s="2"><v>${serial}</v></c>`;
  }
  if (typeof value === 'number' && Number.isFinite(value)) return `<c r="${address}"${bold ? ' s="1"' : ''}><v>${value}</v></c>`;
  return `<c r="${address}" t="inlineStr"${bold ? ' s="1"' : ''}><is><t xml:space="preserve">${xml(value)}</t></is></c>`;
};

export function journalTable(entries, tests, aquariumName) {
  const used = [...new Set(entries.flatMap(entry => Object.keys(entry.values ?? {})))];
  const selectedTests = used.map(id => tests.find(test => test.id === id) ?? { id, label: id, unit: '' });
  const channelCount = Math.min(MAX_LIGHT_CHANNELS, Math.max(0, ...entries.map(entry => entry.light?.channels?.length ?? 0)));
  const headers = ['Aquarium', 'Date and time', 'Water', 'General note',
    ...selectedTests.flatMap(test => [`${test.label}${test.unit ? ` (${test.unit})` : ''}`, `${test.label} note`]),
    'Light fixture', 'Power (W)', 'Intensity (%)', 'Start time', 'Duration (h)', 'Color temperature (K)', 'PAR (µmol/m²/s)',
    ...Array.from({ length: channelCount }, (_, index) => [`Channel ${index + 1}`, `Channel ${index + 1} (%)`]).flat()];
  const rows = entries.map(entry => [aquariumName, entry.at?.replace('T', ' ') ?? '', entry.location ?? '', entry.note ?? '',
    ...selectedTests.flatMap(test => [entry.values?.[test.id] ?? '', entry.notes?.[test.id] ?? '']),
    entry.light?.fixture ?? '', entry.light?.powerW ?? '', entry.light?.intensityPercent ?? '', entry.light?.startTime ?? '',
    entry.light?.durationHours ?? '', entry.light?.colorTempK ?? '', entry.light?.par ?? '',
    ...Array.from({ length: channelCount }, (_, index) => {
      const channel = entry.light?.channels?.[index];
      return channel ? [channelName(channel, undefined, true), channel.value] : ['', ''];
    }).flat()]);
  return { headers, rows };
}

// A small OOXML writer using uncompressed ZIP entries. No network or runtime
// package is needed, so export also works in the sandboxed offline renderer.
export function journalXlsx(entries, tests, aquariumName) {
  const { headers, rows } = journalTable(entries, tests, aquariumName);
  const sheetRows = [headers, ...rows].map((row, index) => `<row r="${index + 1}">${row.map((value, column) => sheetCell(value, column, index + 1, index === 0)).join('')}</row>`).join('');
  const parts = {
    '[Content_Types].xml': '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
    '_rels/.rels': '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
    'xl/workbook.xml': '<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Measurements" sheetId="1" r:id="rId1"/></sheets></workbook>',
    'xl/_rels/workbook.xml.rels': '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',
    'xl/styles.xml': '<?xml version="1.0" encoding="UTF-8"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="yyyy-mm-dd hh:mm"/></numFmts><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>',
    'xl/worksheets/sheet1.xml': `<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="15"/><cols><col min="1" max="${headers.length}" width="20" customWidth="1"/></cols><sheetData>${sheetRows}</sheetData><autoFilter ref="A1:${columnName(headers.length - 1)}${rows.length + 1}"/></worksheet>`
  };
  return zipStore(parts);
}

const crcTable = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let i = 0; i < 8; i++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes) value = crcTable[(value ^ byte) & 255] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}
const u16 = value => Uint8Array.of(value & 255, (value >>> 8) & 255);
const u32 = value => Uint8Array.of(value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255);
const concat = arrays => {
  const output = new Uint8Array(arrays.reduce((total, bytes) => total + bytes.length, 0));
  let offset = 0;
  for (const bytes of arrays) { output.set(bytes, offset); offset += bytes.length; }
  return output;
};
function zipStore(parts) {
  const local = [];
  const central = [];
  let offset = 0;
  for (const [name, content] of Object.entries(parts)) {
    const filename = encoder.encode(name);
    const data = encoder.encode(content);
    const crc = crc32(data);
    const localRecord = concat([u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(filename.length), u16(0), filename, data]);
    local.push(localRecord);
    central.push(concat([u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(filename.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), filename]));
    offset += localRecord.length;
  }
  const directory = concat(central);
  const end = concat([u32(0x06054b50), u16(0), u16(0), u16(central.length), u16(central.length), u32(directory.length), u32(offset), u16(0)]);
  return concat([...local, directory, end]);
}
