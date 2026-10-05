const { app, BrowserWindow, protocol, shell } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');
const { backupExportDirectory, backupDocument, writeUniqueBackup } = require('./backup-export.cjs');

app.setName('AquaStoich');
protocol.registerSchemesAsPrivileged([{ scheme: 'rem', privileges: { standard: true, secure: true, supportFetchAPI: true } }]);

const root = path.resolve(__dirname, '..');
const allowed = new Set(['index.html', 'styles.css', 'app.mjs', 'builtin-catalog.mjs', 'catalog.mjs', 'chemistry.mjs', 'journal.mjs', 'presets.mjs', 'localization.mjs', 'aquarium.mjs', 'journal-export.mjs', 'light-channels.mjs', 'localized-number.mjs', 'storage-backup.mjs', 'assets/icon.png', 'README.md']);
const contentTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.png': 'image/png' };
const windows = new Set();
const exportDirectory = backupExportDirectory(process.argv);

async function exportLocalData(directory) {
  const window = new BrowserWindow({
    show: false,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  try {
    await window.loadURL('rem://app/index.html');
    const snapshot = await window.webContents.executeJavaScript(`({
      stateText: localStorage.getItem('rem-aquarium-v1'),
      locale: localStorage.getItem('aqua-stoich-locale'),
      theme: localStorage.getItem('aqua-stoich-theme')
    })`, true);
    const document = backupDocument({ ...snapshot, applicationVersion: app.getVersion() });
    return await writeUniqueBackup(directory, document);
  } finally {
    if (!window.isDestroyed()) window.destroy();
  }
}

app.whenReady().then(async () => {
  // Electron stores the default session (and its localStorage) under app.getPath('userData').
  protocol.handle('rem', async request => {
    const url = new URL(request.url);
    const relative = decodeURIComponent(url.pathname).replace(/^\//, '') || 'index.html';
    if (url.host !== 'app' || !allowed.has(relative)) return new Response('Not found', { status: 404 });
    try {
      const filePath = path.join(root, relative);
      const body = await fs.readFile(filePath);
      return new Response(body, { headers: { 'content-type': contentTypes[path.extname(relative)] ?? 'application/octet-stream' } });
    } catch {
      return new Response('Not found', { status: 404 });
    }
  });

  if (exportDirectory) {
    try {
      const destination = await exportLocalData(exportDirectory);
      console.log(`AquaStoich backup written to ${destination}`);
      app.exit(0);
    } catch (error) {
      console.error(`Unable to export AquaStoich backup: ${error?.message ?? error}`);
      app.exit(2);
    }
    return;
  }

  const createWindow = () => {
    const window = new BrowserWindow({
      width: 1380, height: 900, minWidth: 880, minHeight: 620,
      show: true, autoHideMenuBar: true, icon: path.join(root, 'assets', 'icon.png'),
      webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
    });
    windows.add(window);
    window.on('closed', () => windows.delete(window));
    window.webContents.setWindowOpenHandler(({ url }) => {
      if (/^https:\/\//i.test(url)) shell.openExternal(url);
      return { action: 'deny' };
    });
    window.loadURL('rem://app/index.html')
      .catch(error => {
        console.error('Unable to load AquaStoich:', error);
      });
  };
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
