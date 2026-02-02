/**
 * Type definitions for Electron IPC and application state
 */

export interface ElectronAPI {
  openFile: () => Promise<{ path: string; content: string } | null>;
  saveFile: (path: string, content: string) => Promise<void>;
  saveFileAs: (content: string) => Promise<{ path: string } | null>;
  setDirty: (isDirty: boolean) => void;
  onMenuCommand: (channel: string, callback: () => void) => void;
}

export interface AppState {
  currentFilePath: string | null;
  isDirty: boolean;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
