/**
 * Renderer process logic - handles file operations and state management
 */

// Get reference to the UniMark editor element
const editor = document.querySelector('unimark-editor') as any;

if (!editor) {
  console.error('UniMark editor element not found!');
}

// State tracking
let lastSavedContent = '';
let currentFilePath: string | null = null;

// Get the textarea from the editor's shadow DOM
function getEditorTextarea(): HTMLTextAreaElement | null {
  if (!editor || !editor.shadowRoot) return null;
  return editor.shadowRoot.querySelector('textarea');
}

// Get current editor content
function getEditorContent(): string {
  const textarea = getEditorTextarea();
  return textarea ? textarea.value : '';
}

// Set editor content
function setEditorContent(content: string) {
  const textarea = getEditorTextarea();
  if (textarea) {
    textarea.value = content;
    // Trigger the editor's update method
    if (editor.update) {
      editor.update();
    }
  }
}

// Track content changes to detect dirty state
function setupChangeTracking() {
  const textarea = getEditorTextarea();
  if (!textarea) {
    console.error('Could not find textarea in editor');
    return;
  }

  textarea.addEventListener('input', () => {
    const currentContent = getEditorContent();
    const isDirty = currentContent !== lastSavedContent;
    window.electronAPI.setDirty(isDirty);
  });
}

// File operations

async function openFile() {
  const result = await window.electronAPI.openFile();
  if (result) {
    setEditorContent(result.content);
    lastSavedContent = result.content;
    currentFilePath = result.path;
    window.electronAPI.setDirty(false);
  }
}

async function saveFile() {
  if (!currentFilePath) {
    await saveFileAs();
    return;
  }

  const content = getEditorContent();
  await window.electronAPI.saveFile(currentFilePath, content);
  lastSavedContent = content;
  window.electronAPI.setDirty(false);
}

async function saveFileAs() {
  const content = getEditorContent();
  const result = await window.electronAPI.saveFileAs(content);
  if (result) {
    currentFilePath = result.path;
    lastSavedContent = content;
    window.electronAPI.setDirty(false);
  }
}

// Listen for menu commands from main process
if (window.electronAPI) {
  // Wait for editor to be ready
  window.addEventListener('DOMContentLoaded', async () => {
    try {
      // Wait for the custom element to be defined
      await customElements.whenDefined('unimark-editor');
      
      // Pollard wait for shadow DOM and textarea
      let attempts = 0;
      const checkEditor = setInterval(() => {
        const textarea = getEditorTextarea();
        if (textarea) {
          clearInterval(checkEditor);
          setupChangeTracking();
          console.log('✅ Editor initialized and tracking changes');
        } else if (attempts > 50) {
          clearInterval(checkEditor);
          console.error('❌ Failed to find textarea in editor after 5 seconds');
        }
        attempts++;
      }, 100);
    } catch (err) {
      console.error('Error during editor initialization:', err);
    }
  });

  // Set up menu command listeners
  window.electronAPI.onMenuCommand('menu:open', () => openFile());
  window.electronAPI.onMenuCommand('menu:save', () => saveFile());
  window.electronAPI.onMenuCommand('menu:saveAs', () => saveFileAs());
}

// Keyboard shortcuts (in addition to menu shortcuts)
document.addEventListener('keydown', async (e) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modifier = isMac ? e.metaKey : e.ctrlKey;

  if (modifier) {
    if (e.key === 'o') {
      e.preventDefault();
      await openFile();
    } else if (e.key === 's') {
      e.preventDefault();
      if (e.shiftKey) {
        await saveFileAs();
      } else {
        await saveFile();
      }
    }
  }
});
