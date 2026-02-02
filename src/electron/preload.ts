import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronAPI } from './types';

/**
 * Preload script - secure bridge between renderer and main process
 * Exposes limited API to renderer via contextBridge
 */

const electronAPI: ElectronAPI = {
  openFile: () => ipcRenderer.invoke('file:open'),
  saveFile: (path: string, content: string) => ipcRenderer.invoke('file:save', path, content),
  saveFileAs: (content: string) => ipcRenderer.invoke('file:saveAs', content),
  setDirty: (isDirty: boolean) => ipcRenderer.send('state:setDirty', isDirty),
  onMenuCommand: (channel: string, callback: () => void) => {
    ipcRenderer.on(channel, callback);
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
