# UniMark Electron Desktop App - Implementation Plan

Wrapping the existing UniMark web component (`<unimark-editor>`) in an Electron shell to create a cross-platform desktop Markdown editor with proper UTF-8 file handling and native OS integration.

## User Review Required

> [!IMPORTANT]
> All work will be done in the `electron` branch. The `main` branch (web version) will remain completely untouched.

> [!WARNING]
> This implementation assumes the web component build (`dist/unimark-element.js`) is already available. The Electron app will consume this built artifact without modification.

---

## Proposed Changes

### Electron Project Setup

#### [NEW] [package.json](file:///Users/stenhougaard/Documents/GitHub/UniMark/package.json)

Add Electron dependencies and scripts:
- `electron` - Main Electron runtime
- `electron-builder` - For future packaging (optional for MVP)
- `concurrently` - To run multiple build processes
- Scripts: `electron:dev`, `electron:build`

#### [NEW] [tsconfig.electron.json](file:///Users/stenhougaard/Documents/GitHub/UniMark/tsconfig.electron.json)

TypeScript configuration for Electron code:
- Target Node.js environment for main/preload
- Enable `esModuleInterop` for Electron imports
- Include `src/electron/**/*`

---

### Main Process (Electron Lifecycle)

#### [NEW] [src/electron/main.ts](file:///Users/stenhougaard/Documents/GitHub/UniMark/src/electron/main.ts)

**Purpose**: Application lifecycle, window management, native menus, file dialogs

**Key responsibilities**:
- Create `BrowserWindow` with security settings:
  - `contextIsolation: true`
  - `nodeIntegration: false`
  - `preload` script path
- Load renderer HTML
- Handle IPC messages from renderer for file operations
- Implement native File menu (Open, Save, Save As, Quit)
- Track application state: `currentFilePath`, `isDirty`
- Handle unsaved changes dialog on quit/close

**File operations**:
- `handleOpenFile()`: Show native dialog, read file with UTF-8 encoding (no BOM)
- `handleSaveFile(path, content)`: Write file with UTF-8 encoding (no BOM)
- `handleSaveFileAs(content)`: Show save dialog, write file

**IPC handlers**:
- `file:open` → `{ path: string, content: string }`
- `file:save` → `void`
- `file:saveAs` → `{ path: string }`
- `state:setDirty` → `void` (track dirty state from renderer)

---

### Preload Script (Security Bridge)

#### [NEW] [src/electron/preload.ts](file:///Users/stenhougaard/Documents/GitHub/UniMark/src/electron/preload.ts)

**Purpose**: Secure API bridge between renderer and main process

**Exposed API** (via `contextBridge.exposeInMainWorld`):
```typescript
window.electronAPI = {
  openFile: () => Promise<{ path: string; content: string }>,
  saveFile: (path: string, content: string) => Promise<void>,
  saveFileAs: (content: string) => Promise<{ path: string }>,
  setDirty: (isDirty: boolean) => void
}
```

All methods use `ipcRenderer.invoke()` to communicate with main process.

---

### Renderer Process (UI Shell)

#### [NEW] [src/electron/renderer.html](file:///Users/stenhougaard/Documents/GitHub/UniMark/src/electron/renderer.html)

**Purpose**: HTML shell that hosts the `<unimark-editor>` component

**Structure**:
- Import `dist/unimark-element.js` as ES module
- Single `<unimark-editor>` element (full viewport)
- Minimal styling (match existing web version)

#### [NEW] [src/electron/renderer.ts](file:///Users/stenhougaard/Documents/GitHub/UniMark/src/electron/renderer.ts)

**Purpose**: Renderer-side logic for file operations and state management

**Key responsibilities**:
- Get reference to `<unimark-editor>` element
- Wire up file operations using `window.electronAPI`
- Track content changes to detect dirty state
- Notify main process when content changes
- Handle file open: inject content into editor
- Handle save: extract content from editor

**State tracking**:
- Listen to editor's `input` event to detect changes
- Compare current content with last saved content
- Call `electronAPI.setDirty(true/false)` accordingly

---

### Build Configuration

#### [NEW] [vite.config.electron.ts](file:///Users/stenhougaard/Documents/GitHub/UniMark/vite.config.electron.ts)

Vite configuration for building Electron code:
- Entry points: `src/electron/main.ts`, `src/electron/preload.ts`, `src/electron/renderer.ts`
- Output: `dist-electron/`
- Target: Node.js for main/preload, browser for renderer
- External: Mark `electron` as external dependency

---

### Type Definitions

#### [NEW] [src/electron/types.ts](file:///Users/stenhougaard/Documents/GitHub/UniMark/src/electron/types.ts)

TypeScript interfaces for:
- `ElectronAPI` interface (for `window.electronAPI`)
- IPC message types
- Application state shape

---

## Verification Plan

### Automated Tests

No automated tests for MVP. The web component already has its own logic; Electron is just a wrapper.

### Manual Verification

#### 1. Branch Setup Verification
```bash
# Verify we're on electron branch
git branch --show-current
# Should output: electron

# Verify main branch is untouched
git diff main --stat
# Should show only new files in src/electron/ and config changes
```

#### 2. App Launch Test
```bash
# Build web component first (if not already built)
npm run build

# Start Electron in dev mode
npm run electron:dev
```

**Expected**: 
- App window opens
- UniMark editor is visible and functional
- No console errors or security warnings

#### 3. UTF-8 File Operations Test

**Test file**: Create `test-unicode.md` with content:
```markdown
# Unicode Test 文档

**Bold text**: 𝐁𝐨𝐥𝐝 𝐔𝐧𝐢𝐜𝐨𝐝𝐞
*Italic*: 𝘐𝘵𝘢𝘭𝘪𝘤 𝘜𝘯𝘪𝘤𝘰𝘥𝘦

Emoji: 🚀 ✨ 💻
```

**Steps**:
1. Launch app
2. File → Open → Select `test-unicode.md`
3. Verify all Unicode characters display correctly in editor
4. Modify content (add more Unicode)
5. File → Save
6. Close app
7. Reopen file in app
8. Verify modifications persisted without corruption

**Expected**: All Unicode characters preserved, no mojibake, no BOM added

#### 4. Unsaved Changes Protection Test

**Steps**:
1. Launch app
2. File → Open → Select any `.md` file
3. Make changes to content (don't save)
4. Attempt to close window (Cmd+W or click close button)

**Expected**: 
- Dialog appears with options: "Save", "Don't Save", "Cancel"
- "Cancel" → Window stays open, content unchanged
- "Don't Save" → Window closes, changes discarded
- "Save" → File saved, then window closes

**Repeat for**:
- File → Open (while unsaved changes exist)
- File → Quit (Cmd+Q)

#### 5. Menu Keyboard Shortcuts Test

**Steps**:
1. Launch app
2. Test shortcuts:
   - `Cmd+O` → Opens file dialog
   - `Cmd+S` → Saves current file
   - `Cmd+Shift+S` → Opens save-as dialog
   - `Cmd+Q` → Quits app (with unsaved check)

**Expected**: All shortcuts work as expected

#### 6. Security Verification

**Steps**:
1. Launch app with DevTools open
2. In DevTools console, try: `require('fs')`

**Expected**: Error (require is not defined) - confirms `nodeIntegration: false`

---

## Post-Implementation Checklist

- [ ] No modifications to `main` branch
- [ ] All Electron code in `src/electron/` directory
- [ ] UTF-8 encoding explicitly set for all file I/O
- [ ] No BOM insertion
- [ ] Security settings verified (no console warnings)
- [ ] Dirty state tracking works reliably
- [ ] Unsaved changes dialog appears in all scenarios
- [ ] Editor component works identically to web version
