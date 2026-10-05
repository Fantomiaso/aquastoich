import { copyFile, cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, '_site');
const files = [
  'index.html', 'styles.css', 'app.mjs', 'aquarium.mjs', 'builtin-catalog.mjs',
  'catalog.mjs', 'chemistry.mjs', 'journal.mjs', 'journal-export.mjs',
  'light-channels.mjs', 'localization.mjs', 'localized-number.mjs', 'presets.mjs',
  'storage-backup.mjs',
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all(files.map(file => copyFile(resolve(root, file), resolve(output, file))));
await cp(resolve(root, 'assets'), resolve(output, 'assets'), { recursive: true });
await writeFile(resolve(output, '.nojekyll'), '');
console.log(`GitHub Pages bundle: ${files.length} files plus assets`);
