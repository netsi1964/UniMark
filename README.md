# UniMark - Unicode Markdown Converter

UniMark is a lightweight, dependency-free web component (`<unimark-editor>`) that converts Markdown syntax into specialized Unicode characters. This allows you to create styled text (Bold, Italic, Script, Fraktur, etc.) that can be copied and pasted anywhere plain text is supported (social media, bios, chats).

## Features

-   **Zero Dependencies**: Run as a standalone web component. No React or framework required at runtime.
-   **Live Preview**: Instant conversion as you type.
-   **Formatting Toolbar**:
    -   **Bold** (`**text**` → 𝗕𝗼𝗹𝗱)
    -   **Italic** (`*text*` → 𝘐𝘵𝘢𝘭𝘪𝘤)
    -   **Underline** (`++text++` → U̲n̲d̲e̲r̲l̲i̲n̲e̲)
    -   **Strikethrough** (`~~text~~` → S̶t̶r̶i̶k̶e̶)
-   **Advanced Styles**: Access 10+ styles via dropdown (Script, Fraktur, Double Struck, Bubble, etc.).
-   **Table Support**: Automatically aligns markdown tables with Unicode box-drawing characters.

## Installation & Setup

### Prerequisites
- Node.js (for building locally)

### Run Locally
1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start development server**:
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` to see the editor.

## Distribution & Usage

UniMark is built to be portable. You can use the single JavaScript file in any HTML project.

### Build the Project
To generate the distributable files:

```bash
npm run build
```

This will create a `dist/` folder containing:
-   `unimark-element.js`: The self-contained ES Module.
-   `unimark.html`: A full-screen demo page.

### Use on CodePen / Static Sites
Simply import the script as a module:

```html
<!-- Import the element -->
<script type="module" src="./unimark-element.js"></script>

<!-- Use the tag -->
<unimark-editor></unimark-editor>
```

### Use directly from GitHub (via CDN)
You can import the element directly without downloading anything:

```html
<!-- Import from GitHub via jsDelivr -->
<script type="module" src="https://cdn.jsdelivr.net/gh/netsi1964/UniMark@main/dist/unimark-element.js"></script>

<!-- Use the tag -->
<unimark-editor></unimark-editor>
```

### Full-Screen Mode
The `dist/unimark.html` file demonstrates how to run the editor in full-screen mode, ideal for hosted tools or embedded iframes.

### AI Agent Skill (Claude, Codex)
UniMark is also available as a native **AI Skill** for **Claude.ai**, **Claude Code**, and **Codex**.
See [`skill/README.md`](skill/README.md) for installation and usage instructions.

## Syntax Guide

| Style | Markdown Syntax | Result |
| :--- | :--- | :--- |
| **Bold** | `**text**` | 𝗕𝗼𝗹𝗱 |
| *Italic* | `*text*` | 𝘐𝘵𝘢𝘭𝘪𝘤 |
| <u>Underline</u> | `++text++` | U̲n̲d̲e̲r̲l̲i̲n̲e̲ |
| ~~Strike~~ | `~~text~~` | S̶t̶r̶i̶k̶e̶ |
| Script | `((SCRIPT:text))` | 𝒮𝒸𝓇𝒾𝓅𝓉 |
| Fraktur | `((FRAKTUR:text))` | 𝔉𝔯𝔞𝔠𝔱𝔲𝔯 |
| Bubble | `((BUBBLE:text))` | Ⓣⓔⓧⓣ |

*(Select styles from the "Flere Stilarter" dropdown to insert generic syntax automatically)*
