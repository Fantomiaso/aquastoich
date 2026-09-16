const { app, BrowserWindow, net, protocol, shell } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

app.setName('AquaStoich');
protocol.registerSchemesAsPrivileged([{ scheme: 'rem', privileges: { standard: true, secure: true, supportFetchAPI: true } }]);

const root = path.resolve(__dirname, '..');
const allowed = new Set(['index.html', 'styles.css', 'app.mjs', 'builtin-catalog.mjs', 'catalog.mjs', 'chemistry.mjs', 'journal.mjs', 'presets.mjs', 'localization.mjs', 'aquarium.mjs', 'journal-export.mjs', 'README.md']);

app.whenReady().then(() => {
  // Electron stores the default session (and its localStorage) under app.getPath('userData').
  protocol.handle('rem', request => {
    const url = new URL(request.url);
    const relative = decodeURIComponent(url.pathname).replace(/^\//, '') || 'index.html';
    if (url.host !== 'app' || !allowed.has(relative)) return new Response('Not found', { status: 404 });
    return net.fetch(pathToFileURL(path.join(root, relative)).toString());
  });

  const createWindow = () => {
    const window = new BrowserWindow({
      width: 1380, height: 900, minWidth: 880, minHeight: 620,
      show: false, autoHideMenuBar: true, icon: path.join(root, 'assets', 'icon.png'),
      webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
    });
    window.once('ready-to-show', () => window.show());
    window.webContents.setWindowOpenHandler(({ url }) => {
      if (/^https:\/\//i.test(url)) shell.openExternal(url);
      return { action: 'deny' };
    });
    window.loadURL('rem://app/index.html');
  };
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
