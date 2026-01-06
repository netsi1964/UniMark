
import { parseMarkdownToUnicode, formatTable } from './services/markdownParser';
import { htmlToMarkdown } from './services/htmlToMarkdown';

// --- Sample Markdown ---
const SAMPLE_MARKDOWN = `# Markdown Formatting Guide

This document provides a comprehensive guide to various Markdown formatting features.

## Text Formatting

You can format text in several ways:

- **Bold text** is created using two asterisks or underscores: \`**bold text**\` or \`__bold text__\`.
- *Italic text* is created with a single asterisk or underscore: \`*italic text*\` or \`_italic text_\`.
- ***Bold and italic text*** can be combined: \`***bold and italic***\`.
- Strikethrough text is done with two tildes: \`~~strikethrough~~\`.
- \`Inline code\` is wrapped in backticks: \`\` \`inline code\` \`\`.

## Headings

There are six levels of headings in Markdown:

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Lists

You can create both ordered and unordered lists.

### Unordered List

- Item 1
- Item 2
  - Sub-item 2.1
  - Sub-item 2.2
- Item 3

### Ordered List

1. First item
2. Second item
   1. Sub-item 2.1
   2. Sub-item 2.2
3. Third item

## Links and Images

- **Links**: You can create a link like this: [Visit GitHub](https://github.com).
- **Images**: Here is an image with alt text:
  ![GitHub Octocat](https://github.githubassets.com/images/modules/logos_page/Octocat.png)

## Blockquotes

Blockquotes are useful for quoting text from another source:

> "The advance of technology is based on making it fit in so that you don't really even notice it, so it's part of everyday life."
> \- Bill Gates

## Horizontal Rule

You can create a horizontal rule to separate content:

---

## Code Blocks

You can create fenced code blocks with syntax highlighting by specifying the language:

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet("World");
\`\`\`

\`\`\`python
def hello(name):
    print(f"Hello, {name}!")

hello("World")
\`\`\`

## Tables

Tables are created using pipes and hyphens:

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1, Col 1 | Row 1, Col 2 | Row 1, Col 3 |
| Row 2, Col 1 | Row 2, Col 2 | Row 2, Col 3 |
| Row 3, Col 1 | Row 3, Col 2 | Row 3, Col 3 |

## Task Lists

Task lists are a great way to track to-do items:

- [x] Complete feature A
- [ ] Implement feature B
- [ ] Fix bug C

## Emoji

You can also include emojis in your Markdown text! :smile: :rocket:

Enjoy using Markdown!`;

class UnimarkEditor extends HTMLElement {
  styleMode: 'mixed' | 'sans' | 'serif';
  txt!: HTMLTextAreaElement;
  out!: HTMLDivElement;
  shadowRoot!: ShadowRoot;
  private _isHovering: 'in' | 'out' | null = null;
  private _activeScroll: 'in' | 'out' | null = null;
  private _scrollTimeout: any = null;
  
  // History
  private _history: string[] = [];
  private _historyIndex = -1;
  private _inputTimeout: any = null;
  private _maxHistory = 100;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.styleMode = 'mixed';
  }

  connectedCallback() {
    this.render();
    this.setup();
    this.saveState(true); // Initial state
    this.update();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: sans-serif; --bg: #030712; --border: #374151; --text: #f3f4f6; --accent: #4f46e5; }
        .container { display: flex; flex-direction: column; border: 1px solid var(--border); border-radius: 0.75rem; background: var(--bg); color: var(--text); height: 100%; min-height: 500px; position: relative; }
        .toolbar { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; background: #111827; border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 10; border-radius: 0.75rem 0.75rem 0 0; }
        button { background: transparent; border: none; cursor: pointer; color: #e5e7eb; padding: 0.4rem; border-radius: 0.25rem; font-size: 0.9rem; }
        button:hover { background: rgba(255,255,255,0.1); }
        select { background: #1f2937; color: white; border: 1px solid var(--border); padding: 0.25rem; border-radius: 0.25rem; }
        .body { flex: 1; display: flex; overflow: hidden; border-radius: 0 0 0.75rem 0.75rem; }
        .pane-container { flex: 1; display: flex; position: relative; overflow: hidden; }
        textarea, .output { width: 100%; height: 100%; padding: 1.5rem; background: transparent; color: inherit; border: none; font-size: 1rem; line-height: 1.6; outline: none; resize: none; scroll-behavior: auto; box-sizing: border-box; }
        textarea { font-family: monospace; border-right: 1px solid var(--border); }
        .output { white-space: pre-wrap; background: #0f131f; overflow-y: auto; }
        .copy-btn { position: absolute; top: 0.5rem; right: 2rem; background: rgba(0,0,0,0.4); border: 1px solid var(--border); backdrop-filter: blur(4px); font-size: 0.8rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; opacity: 0; transition: opacity 0.2s; z-index: 20; }
        .pane-container:hover .copy-btn { opacity: 1; }
        .active { display: flex !important; }
        .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: none; align-items: center; justify-content: center; z-index: 50; }
        .modal-inner { background: #111827; padding: 2rem; border-radius: 0.5rem; border: 1px solid var(--border); text-align: center; }
        .modal-inner p { margin-bottom: 1.5rem; }
        .modal-inner .btn-group { display: flex; gap: 0.5rem; justify-content: center; }
        @media (max-width: 600px) { .body { flex-direction: column; } .pane-container { height: 50%; } textarea { border-right: none; border-bottom: 1px solid var(--border); } }
      </style>
      <div class="container">
        <div class="toolbar">
          <select id="mode"><option value="mixed">Mixed</option><option value="sans">Sans</option><option value="serif">Serif</option></select>
          <div style="width:1px;height:24px;background:#374151;margin:0 0.5rem"></div>

          <button id="btn-bold" title="Bold"><b>B</b></button>
          <button id="btn-italic" title="Italic"><i>I</i></button>
          <button id="btn-underline" title="Underline"><u>U</u></button>
          <button id="btn-strike" title="Strikethrough"><s>S</s></button>
          <div style="width:1px;height:24px;background:#374151;margin:0 0.5rem"></div>
          <select id="more-styles" style="width: 120px;">
            <option value="">More Styles</option>
            <option value="SCRIPT">Script</option>
            <option value="BOLD_SCRIPT">Bold Script</option>
            <option value="FRAKTUR">Fraktur</option>
            <option value="BOLD_FRAKTUR">Bold Fraktur</option>
            <option value="DOUBLE_STRUCK">Double Struck</option>
            <option value="BUBBLE">Bubble</option>
            <option value="BUBBLE_FILLED">Filled Bubble</option>
            <option value="SQUARE">Square</option>
            <option value="SQUARE_FILLED">Filled Square</option>
            <option value="MONOSPACE">Monospace</option>
          </select>
          <button id="btn-example">Example</button>
          <button id="btn-table">Table</button>
          <button id="btn-clear" style="color:#ef4444">Clear</button>
        </div>
        <div class="body">
          <div class="pane-container">
            <textarea spellcheck="false" placeholder="Type here..."></textarea>
            <button class="copy-btn" id="btn-copy-input" title="Copy Markdown">📋 Copy</button>
          </div>
          <div class="pane-container">
            <div class="output"></div>
            <button class="copy-btn" id="btn-copy-output" title="Copy Unicode">📋 Copy</button>
          </div>
        </div>
        <div class="modal" id="table-modal">
          <div class="modal-inner">
            <p>Convert Table Style:</p>
            <div class="btn-group">
              <button id="style-single" style="background: #374151">Single</button>
              <button id="style-double" style="background: #374151">Double</button>
              <button id="style-close">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setup() {
    this.txt = this.shadowRoot.querySelector('textarea')!;
    this.out = this.shadowRoot.querySelector('.output')!;
    
    this.txt.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.txt.addEventListener('input', () => {
      this.update();
      this.debounceSaveState();
    });
    this.txt.addEventListener('paste', (e) => this.handlePaste(e));
    
    // Hover State
    this.txt.addEventListener('mouseenter', () => this._isHovering = 'in');
    this.txt.addEventListener('mouseleave', () => { if (this._isHovering === 'in') this._isHovering = null; });
    this.out.addEventListener('mouseenter', () => this._isHovering = 'out');
    this.out.addEventListener('mouseleave', () => { if (this._isHovering === 'out') this._isHovering = null; });

    // Synced Scrolling
    const sync = (source: HTMLElement, target: HTMLElement, side: 'in' | 'out') => {
      // Only allow sync if this side is hovered OR if it's already the active scrolling side
      // This prevents inertia events from the non-hovered side from taking over
      if (this._isHovering && this._isHovering !== side) return;
      if (this._activeScroll && this._activeScroll !== side) return;
      
      this._activeScroll = side;
      clearTimeout(this._scrollTimeout);

      const p = source.scrollTop / (source.scrollHeight - source.clientHeight);
      target.scrollTop = p * (target.scrollHeight - target.clientHeight);
      
      this._scrollTimeout = setTimeout(() => this._activeScroll = null, 50);
    };
    this.txt.addEventListener('scroll', () => sync(this.txt, this.out, 'in'));
    this.out.addEventListener('scroll', () => sync(this.out, this.txt, 'out'));

    this.shadowRoot.getElementById('mode')!.addEventListener('change', (e) => { this.styleMode = (e.target as HTMLSelectElement).value as any; this.update(); });
    
    this.shadowRoot.getElementById('btn-bold')!.onclick = () => this.applyFormat('**');
    this.shadowRoot.getElementById('btn-italic')!.onclick = () => this.applyFormat('*');
    this.shadowRoot.getElementById('btn-underline')!.onclick = () => this.applyFormat('++');
    this.shadowRoot.getElementById('btn-strike')!.onclick = () => this.applyFormat('~~');
    
    this.shadowRoot.getElementById('more-styles')!.addEventListener('change', (e) => {
      const select = e.target as HTMLSelectElement;
      if (select.value) {
        this.applyGenericFormat(select.value);
        select.value = ''; // Reset dropdown
      }
    });

    this.shadowRoot.getElementById('btn-example')!.onclick = () => { this.txt.value = SAMPLE_MARKDOWN; this.update(); };
    this.shadowRoot.getElementById('btn-clear')!.onclick = () => { this.txt.value = ''; this.update(); };
    this.shadowRoot.getElementById('btn-table')!.onclick = () => this.shadowRoot.getElementById('table-modal')!.classList.add('active');
    this.shadowRoot.getElementById('style-close')!.onclick = () => this.shadowRoot.getElementById('table-modal')!.classList.remove('active');
    this.shadowRoot.getElementById('style-single')!.onclick = () => this.applyTable('single');
    this.shadowRoot.getElementById('style-double')!.onclick = () => this.applyTable('double');
    
    this.shadowRoot.getElementById('btn-copy-input')!.onclick = (e) => this.copyToClipboard(this.txt.value, e.target as HTMLButtonElement);
    this.shadowRoot.getElementById('btn-copy-output')!.onclick = (e) => this.copyToClipboard(this.out.innerText, e.target as HTMLButtonElement);
  }

  copyToClipboard(text: string, btn: HTMLButtonElement) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      const originalText = btn.innerHTML;
      btn.innerHTML = '✓ Copied!';
      setTimeout(() => btn.innerHTML = originalText, 1500);
    });
  }

  saveState(immediate = false) {
    const val = this.txt.value;
    // If saving immediately, cleared timeout
    if (immediate) clearTimeout(this._inputTimeout);

    // Verify if actually changed from last state
    if (this._historyIndex > -1 && this._history[this._historyIndex] === val) return;

    // Truncate redo history
    if (this._historyIndex < this._history.length - 1) {
      this._history = this._history.slice(0, this._historyIndex + 1);
    }

    this._history.push(val);
    this._historyIndex++;

    if (this._history.length > this._maxHistory) {
      this._history.shift();
      this._historyIndex--;
    }
  }

  debounceSaveState() {
    clearTimeout(this._inputTimeout);
    this._inputTimeout = setTimeout(() => this.saveState(), 500);
  }

  undo() {
    if (this._historyIndex > 0) {
      this._historyIndex--;
      this.txt.value = this._history[this._historyIndex];
      this.update();
    }
  }

  redo() {
    if (this._historyIndex < this._history.length - 1) {
      this._historyIndex++;
      this.txt.value = this._history[this._historyIndex];
      this.update();
    }
  }

  handleKeydown(e: KeyboardEvent) {
    const cmd = e.metaKey || e.ctrlKey;
    if (cmd) {
      switch(e.key.toLowerCase()) {
        case 'z':
          e.preventDefault();
          if (e.shiftKey) this.redo();
          else this.undo();
          break;
        case 'b': e.preventDefault(); this.applyFormat('**'); break;
        case 'i': e.preventDefault(); this.applyFormat('*'); break;
        case 'u': e.preventDefault(); this.applyFormat('++'); break;
        case 's': e.preventDefault(); this.applyFormat('~~'); break; // Strikethrough
      }
    }
  }

  update() {
    this.out.textContent = parseMarkdownToUnicode(this.txt.value, this.styleMode);
  }

  applyFormat(marker: string) {
    const s = this.txt.selectionStart;
    const e = this.txt.selectionEnd;
    const v = this.txt.value;
    const sel = v.substring(s, e);
    const before = v.substring(0, s);
    const after = v.substring(e);
    
    this.saveState(true); // Save state before change
    this.txt.value = before + marker + sel + marker + after;
    this.txt.selectionStart = s + marker.length;
    this.txt.selectionEnd = e + marker.length;
    this.txt.focus();
    this.update();
    this.saveState(true); // Save state after change
  }

  applyGenericFormat(type: string) {
    const s = this.txt.selectionStart;
    const e = this.txt.selectionEnd;
    const v = this.txt.value;
    const sel = v.substring(s, e);
    const before = v.substring(0, s);
    const after = v.substring(e);
    
    this.saveState(true); // Save before
    const insertion = `((${type}:${sel}))`;
    this.txt.value = before + insertion + after;
    
    // Position cursor inside content if empty, otherwise after
    if (s === e) {
      this.txt.selectionStart = s + type.length + 3; // ((TYPE:|))
      this.txt.selectionEnd = s + type.length + 3;
    } else {
      this.txt.selectionStart = s + insertion.length;
      this.txt.selectionEnd = s + insertion.length;
    }
    this.txt.focus();
    this.update();
    this.saveState(true); // Save after
  }

  applyTable(style: 'single' | 'double') {
    const s = this.txt.selectionStart;
    const e = this.txt.selectionEnd;
    const v = this.txt.value;
    let sel = v.substring(s, e);
    
    this.saveState(true); // Save before
    if (s === e) {
      const startIdx = v.lastIndexOf('\n\n', s);
      const start = startIdx === -1 ? 0 : startIdx + 2;
      const endIdx = v.indexOf('\n\n', s);
      const end = endIdx === -1 ? v.length : endIdx;
      sel = v.substring(start, end);
      if (sel.includes('|')) {
        const f = formatTable(sel, style);
        this.txt.value = v.substring(0, start) + f + v.substring(end);
      }
    } else if (sel.includes('|')) {
      const f = formatTable(sel, style);
      this.txt.value = v.substring(0, s) + f + v.substring(e);
    }
    this.shadowRoot.getElementById('table-modal')!.classList.remove('active');
    this.update();
    this.saveState(true); // Save after
  }

  handlePaste(e: ClipboardEvent) {
    const html = e.clipboardData?.getData('text/html');
    if (html) {
      e.preventDefault();
      const markdown = htmlToMarkdown(html);
      
      const s = this.txt.selectionStart;
      const eIdx = this.txt.selectionEnd;
      const v = this.txt.value;
      
      this.saveState(true); // Save before
      this.txt.value = v.substring(0, s) + markdown + v.substring(eIdx);
      this.txt.selectionStart = this.txt.selectionEnd = s + markdown.length;
      this.update();
      this.saveState(true); // Save after
    }
  }
}

customElements.define('unimark-editor', UnimarkEditor);
