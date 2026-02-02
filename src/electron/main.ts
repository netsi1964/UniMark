// Use CommonJS require instead of ES6 imports as workaround for Electron v28+ bug
const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs/promises');

// Type imports (these are erased at runtime)
import type { BrowserWindow as BrowserWindowType, MenuItemConstructorOptions } from 'electron';
import type { AppState } from './types';

/**
 * Main process - handles application lifecycle, menus, dialogs, and file operations
 */

let mainWindow: BrowserWindowType | null = null;
const appState: AppState = {
  currentFilePath: null,
  isDirty: false,
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the renderer HTML
  mainWindow.loadFile(path.join(__dirname, 'renderer.html'));

  // Open DevTools in development
  // if (process.env.NODE_ENV !== 'production') {
  //   mainWindow.webContents.openDevTools();
  // }

  // Handle window close
  mainWindow.on('close', async (e) => {
    if (appState.isDirty) {
      e.preventDefault();
      const result = await showUnsavedDialog();
      if (result === 'save') {
        await handleSave();
        mainWindow?.destroy();
      } else if (result === 'dontSave') {
        mainWindow?.destroy();
      }
      // 'cancel' does nothing
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createMenu() {
  const isMac = process.platform === 'darwin';

  const template: MenuItemConstructorOptions[] = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' } as MenuItemConstructorOptions,
              { type: 'separator' } as MenuItemConstructorOptions,
              { role: 'services' } as MenuItemConstructorOptions,
              { type: 'separator' } as MenuItemConstructorOptions,
              { role: 'hide' } as MenuItemConstructorOptions,
              { role: 'hideOthers' } as MenuItemConstructorOptions,
              { role: 'unhide' } as MenuItemConstructorOptions,
              { type: 'separator' } as MenuItemConstructorOptions,
              { role: 'quit' } as MenuItemConstructorOptions,
            ],
          },
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        {
          label: 'Open...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            await handleOpen();
          },
        } as MenuItemConstructorOptions,
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: async () => {
            await handleSave();
          },
        } as MenuItemConstructorOptions,
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: async () => {
            await handleSaveAs();
          },
        } as MenuItemConstructorOptions,
        { type: 'separator' } as MenuItemConstructorOptions,
        (isMac ? { role: 'close' } : { role: 'quit' }) as MenuItemConstructorOptions,
      ],
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' } as MenuItemConstructorOptions,
        { role: 'redo' } as MenuItemConstructorOptions,
        { type: 'separator' } as MenuItemConstructorOptions,
        { role: 'cut' } as MenuItemConstructorOptions,
        { role: 'copy' } as MenuItemConstructorOptions,
        { role: 'paste' } as MenuItemConstructorOptions,
        ...(isMac
          ? [
              { role: 'pasteAndMatchStyle' } as MenuItemConstructorOptions,
              { role: 'delete' } as MenuItemConstructorOptions,
              { role: 'selectAll' } as MenuItemConstructorOptions,
              { type: 'separator' } as MenuItemConstructorOptions,
              {
                label: 'Speech',
                submenu: [
                  { role: 'startSpeaking' } as MenuItemConstructorOptions,
                  { role: 'stopSpeaking' } as MenuItemConstructorOptions,
                ],
              },
            ]
          : [
              { role: 'delete' } as MenuItemConstructorOptions,
              { type: 'separator' } as MenuItemConstructorOptions,
              { role: 'selectAll' } as MenuItemConstructorOptions,
            ]),
      ],
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' } as MenuItemConstructorOptions,
        { role: 'forceReload' } as MenuItemConstructorOptions,
        { role: 'toggleDevTools' } as MenuItemConstructorOptions,
        { type: 'separator' } as MenuItemConstructorOptions,
        { role: 'resetZoom' } as MenuItemConstructorOptions,
        { role: 'zoomIn' } as MenuItemConstructorOptions,
        { role: 'zoomOut' } as MenuItemConstructorOptions,
        { type: 'separator' } as MenuItemConstructorOptions,
        { role: 'togglefullscreen' } as MenuItemConstructorOptions,
      ],
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
          : [{ role: 'close' }]),
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://electronjs.org');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

async function showUnsavedDialog(): Promise<'save' | 'dontSave' | 'cancel'> {
  if (!mainWindow) return 'cancel';

  const result = await dialog.showMessageBox(mainWindow, {
    type: 'warning',
    buttons: ['Save', 'Do not Save', 'Cancel'],
    defaultId: 0,
    cancelId: 2,
    title: 'Unsaved Changes',
    message: 'Do you want to save the changes you made?',
    detail: 'Your changes will be lost if you do not save them.',
  });

  if (result.response === 0) return 'save';
  if (result.response === 1) return 'dontSave';
  return 'cancel';
}

async function handleOpen() {
  if (appState.isDirty) {
    const result = await showUnsavedDialog();
    if (result === 'save') {
      await handleSave();
    } else if (result === 'cancel') {
      return;
    }
  }

  // Trigger open dialog - the IPC handler will be called from renderer
  mainWindow?.webContents.send('menu:open');
}

async function handleSave() {
  if (appState.currentFilePath) {
    // Trigger save via renderer
    mainWindow?.webContents.send('menu:save');
  } else {
    await handleSaveAs();
  }
}

async function handleSaveAs() {
  mainWindow?.webContents.send('menu:saveAs');
}

// IPC Handlers

ipcMain.handle('file:open', async () => {
  if (!mainWindow) return null;

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown Files', extensions: ['md', 'txt'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const filePath = result.filePaths[0];
  
  try {
    // Read file with explicit UTF-8 encoding
    const content = await fs.readFile(filePath, { encoding: 'utf-8' });
    appState.currentFilePath = filePath;
    appState.isDirty = false;
    return { path: filePath, content };
  } catch (error) {
    console.error('Error reading file:', error);
    await dialog.showErrorBox('Error', `Failed to open file: ${error}`);
    return null;
  }
});

ipcMain.handle('file:save', async (_event, filePath: string, content: string) => {
  try {
    // Write file with explicit UTF-8 encoding, no BOM
    await fs.writeFile(filePath, content, { encoding: 'utf-8' });
    appState.currentFilePath = filePath;
    appState.isDirty = false;
  } catch (error) {
    console.error('Error saving file:', error);
    await dialog.showErrorBox('Error', `Failed to save file: ${error}`);
    throw error;
  }
});

ipcMain.handle('file:saveAs', async (_event, content: string) => {
  if (!mainWindow) return null;

  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [
      { name: 'Markdown Files', extensions: ['md'] },
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (result.canceled || !result.filePath) {
    return null;
  }

  const filePath = result.filePath;

  try {
    // Write file with explicit UTF-8 encoding, no BOM
    await fs.writeFile(filePath, content, { encoding: 'utf-8' });
    appState.currentFilePath = filePath;
    appState.isDirty = false;
    return { path: filePath };
  } catch (error) {
    console.error('Error saving file:', error);
    await dialog.showErrorBox('Error', `Failed to save file: ${error}`);
    throw error;
  }
});

ipcMain.on('state:setDirty', (_event, isDirty: boolean) => {
  appState.isDirty = isDirty;
});

// App lifecycle

app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle app quit with unsaved changes
app.on('before-quit', async (e) => {
  if (appState.isDirty && mainWindow) {
    e.preventDefault();
    const result = await showUnsavedDialog();
    if (result === 'save') {
      await handleSave();
      app.quit();
    } else if (result === 'dontSave') {
      appState.isDirty = false; // Clear dirty flag to allow quit
      app.quit();
    }
    // 'cancel' does nothing
  }
});
