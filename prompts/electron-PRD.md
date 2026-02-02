UniMark Desktop App – Electron Product Requirements Document

⚠️ IMPORTANT
All implementation work described in this document MUST be done in the Git branch electron.
The main branch (web version of UniMark) MUST NOT be modified.

⸻

PRD-SEC-001 Overview & Objectives

UniMark Desktop App is a cross-platform desktop application that wraps the existing <unimark-editor> custom web component inside an Electron shell.

The goal is to provide a lightweight, offline-capable Markdown (UTF-8) editor while reusing the UniMark editor as-is, without reimplementing any editor logic in Electron.

Repository & Branching
	•	Repository: https://github.com/netsi1964/UniMark
	•	Electron development must occur in branch electron
	•	The web editor in main must remain unchanged

⸻

PRD-SEC-002 Goals

Primary Goals
	•	Native-feeling desktop app
	•	Correct UTF-8 handling for all file operations
	•	Minimal UI beyond the existing editor
	•	Consistent behavior across macOS, Windows, and Linux

Non-Goals (MVP)
	•	No AI features
	•	No cloud sync
	•	No collaboration
	•	No user accounts

⸻

PRD-SEC-003 Target Platforms
	•	macOS
	•	Windows
	•	Linux

(All via a single Electron codebase)

⸻

PRD-SEC-004 Core UI

The entire application UI consists of the existing web component:

<unimark-editor></unimark-editor>

The component already provides:
	•	Markdown editing
	•	Live preview (two-pane)
	•	Toolbar actions
	•	UTF-8 safe clipboard handling

Electron must not reimplement or override editor behavior.

⸻

PRD-SEC-005 Core Features

PRD-FEAT-001 Electron App Shell

Description:
Electron application that loads UniMark editor in a single window.

Acceptance Criteria:
	•	App launches on macOS, Windows, Linux
	•	Single window
	•	No additional UI chrome

⸻

PRD-FEAT-002 File Open (UTF-8)

Description:
Open .md or .txt files from disk.

Behavior:
	•	Native open-file dialog
	•	File read explicitly as UTF-8 (no BOM)
	•	Content injected into <unimark-editor>

Acceptance Criteria:
	•	Unicode characters preserved
	•	Single document only

⸻

PRD-FEAT-003 File Save / Save As (UTF-8)

Sub-features:
	•	PRD-FEAT-003.1 Save
	•	PRD-FEAT-003.2 Save As

Acceptance Criteria:
	•	UTF-8 encoding preserved
	•	No BOM insertion
	•	File reopens without corruption

⸻

PRD-FEAT-004 Unsaved Changes Protection

Description:
Prevent accidental data loss.

Triggers:
	•	Opening another file
	•	Quitting app
	•	Closing window via OS

Dialog Options:
	•	Save
	•	Don’t Save
	•	Cancel

Acceptance Criteria:
	•	Cancel aborts action
	•	Save completes successfully before proceeding

⸻

PRD-FEAT-005 Native Menu

Minimum Menu Structure:

File
	•	Open…
	•	Save
	•	Save As…
	•	Quit

⸻

PRD-SEC-006 Technical Context

Existing Web Component Build:
	•	The web version builds unimark-element.ts into dist/unimark-element.js (ES module)
	•	The component is a custom element: <unimark-editor>
	•	Current build uses Vite with library mode
	•	Component has no external dependencies beyond TypeScript services

Electron Integration Strategy:
	•	Electron renderer will load the built unimark-element.js from dist/
	•	No need to rebuild or modify the web component
	•	Renderer HTML will import the component and use it directly
	•	All Electron code lives in src/electron/ directory

⸻

PRD-SEC-007 Architecture

Processes
	•	Main process: lifecycle, menus, dialogs, filesystem
	•	Renderer: HTML shell hosting <unimark-editor>
	•	Preload: secure API bridge

Security
	•	contextIsolation: true
	•	nodeIntegration: false
	•	No direct fs access in renderer

Preload API Contract

openFile(): Promise<{ path: string; content: string }>
saveFile(path: string, content: string): Promise<void>
saveFileAs(content: string): Promise<{ path: string }>


⸻

PRD-SEC-007 Runtime State Model

currentFilePath: string | null
editorContent: string
isDirty: boolean


⸻

PRD-SEC-008 Development Phases
	1.	Electron bootstrap
	2.	File handling (open/save)
	3.	Dirty-state tracking & dialogs

⸻

PRD-SEC-009 Future Enhancements (Out of Scope)
	•	Autosave
	•	Drag & drop
	•	Remember last file
	•	Theme sync
	•	Packaged installers

⸻

PRD-SEC-010 Success Criteria
	•	Stable launch on all platforms
	•	No UTF-8 data loss
	•	Editor identical to web version
	•	Clear separation between web and desktop concerns

⸻

AGENT IMPLEMENTATION CHECKLIST

MUST DO
	•	Work only in electron branch
	•	Preserve existing UniMark web code
	•	Use preload for all Node APIs
	•	Explicit UTF-8 encoding for file IO
	•	Track dirty state reliably

MUST NOT DO
	•	Modify UniMark editor logic
	•	Add Node APIs to renderer
	•	Add extra UI beyond menus
	•	Assume default encodings

VERIFY BEFORE FINISHING
	•	Open/save with non-ASCII text
	•	Cancel unsaved-changes dialog works
	•	App quits cleanly on all platforms
	•	No console security warnings