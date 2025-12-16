
/**
 * UnimarkEditor - A Vanilla JS Custom Element for Unicode Markdown conversion.
 * Features:
 * - Standalone (no dependencies)
 * - Shadow DOM style isolation
 * - Container Queries for responsiveness
 * - Custom Header handling (converts # to Bold with spacing)
 * - Font Style Selection (Sans, Serif, Script, Fraktur, etc.)
 * - Link transformation
 * - Code Block protection (contents become monospace, no other styles applied)
 */

// --- Sample Markdown ---
// using \x60 for backticks to ensure safe parsing inside the template literal
const SAMPLE_MARKDOWN = `# Markdown Formatting Guide

This document provides a comprehensive guide to various Markdown formatting features.

## Text Formatting

You can format text in several ways:

- **Bold text** is created using two asterisks or underscores: \x60**bold text**\x60 or \x60__bold text__\x60.
- *Italic text* is created with a single asterisk or underscore: \x60*italic text*\x60 or \x60_italic text_\x60.
- ***Bold and italic text*** can be combined: \x60***bold and italic***\x60.
- Strikethrough text is done with two tildes: \x60~~strikethrough~~\x60.
- \x60Inline code\x60 is wrapped in backticks: \x60\x60 \x60inline code\x60 \x60\x60.

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
> \\- Bill Gates

## Horizontal Rule

You can create a horizontal rule to separate content:

---

## Code Blocks

You can create fenced code blocks with syntax highlighting by specifying the language:

\x60\x60\x60javascript
function greet(name) {
  console.log(\x60Hello, \${name}!\x60);
}

greet("World");
\x60\x60\x60

\x60\x60\x60python
def hello(name):
    print(f"Hello, {name}!")

hello("World")
\x60\x60\x60

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

// --- Unicode Maps ---
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const NORMAL = LOWER + UPPER + DIGITS;

const createMap = (source, target) => {
  const map = {};
  const sourceChars = source.split('');
  // Use Array.from to handle surrogate pairs in target strings
  const targetChars = Array.from(target);
  sourceChars.forEach((char, index) => {
    if (targetChars[index]) map[char] = targetChars[index];
  });
  return map;
};

const MAPS = {
  BOLD_SANS: createMap(NORMAL, '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝐣𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵'),
  BOLD_SERIF: createMap(NORMAL, '𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗'),
  ITALIC_SANS: createMap(NORMAL, '𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡0123456789'),
  ITALIC_SERIF: createMap(NORMAL, '𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍0123456789'),
  BOLD_ITALIC_SANS: createMap(NORMAL, '𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕0123456789'),
  BOLD_ITALIC_SERIF: createMap(NORMAL, '𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁0123456789'),
  MONOSPACE: createMap(NORMAL, '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'),
  
  // New Styles
  SCRIPT: createMap(NORMAL, '𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵0123456789'),
  BOLD_SCRIPT: createMap(NORMAL, '𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩0123456789'),
  FRAKTUR: createMap(NORMAL, '𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ0123456789'),
  BOLD_FRAKTUR: createMap(NORMAL, '𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅0123456789'),
  DOUBLE_STRUCK: createMap(NORMAL, '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝙢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'),
};

const getMappedChar = (char, type) => {
  if (type === 'STRIKETHROUGH') return char + '\u0336';
  if (type === 'UNDERLINE') return char + '\u0332';
  return MAPS[type]?.[char] || char;
};

const transformText = (text, type) => Array.from(text).map(c => getMappedChar(c, type)).join('');

// --- Parser Logic ---
const parseMarkdown = (input, styleMode = 'mixed') => {
  let result = input;
  const codeBlocks = [];

  // 1. Extract Code Blocks to protect them from other formatting
  // Triple backticks
  result = result.replace(/```([\s\S]*?)```/g, (match, content) => {
    const monospaced = transformText(content, 'MONOSPACE');
    const token = `%%CODEBLOCK${codeBlocks.length}%%`; 
    codeBlocks.push(monospaced);
    return token;
  });
  
  // Single backticks
  result = result.replace(/`([^`]+)`/g, (match, content) => {
    const monospaced = transformText(content, 'MONOSPACE');
    const token = `%%CODEBLOCK${codeBlocks.length}%%`;
    codeBlocks.push(monospaced);
    return token;
  });

  // 2. Links: [Text](URL) -> Text (URL)
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');

  // 3. Images: ![Alt](URL) -> 🖼️ Alt
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '🖼️ $1');

  // 4. Task Lists
  // Checked
  result = result.replace(/^(\s*)-\s\[x\]\s/gim, '$1☑ ');
  // Unchecked
  result = result.replace(/^(\s*)-\s\[ \]\s/gim, '$1☐ ');

  // 5. Unordered Lists (Bulleted)
  // Matches - , * , + at start of line with optional indentation
  result = result.replace(/^(\s*)[-*+]\s/gm, '$1• ');

  // 6. Horizontal Rules (---, ***, ___)
  result = result.replace(/^[-*_]{3,}$/gm, '━━━━━━━━━━━━━━━━');

  // 7. Determine Style Mappings
  let boldSansType = 'BOLD_SANS';
  let boldSerifType = 'BOLD_SERIF';
  let italicSansType = 'ITALIC_SANS';
  let italicSerifType = 'ITALIC_SERIF';
  let boldItalicSansType = 'BOLD_ITALIC_SANS';
  let boldItalicSerifType = 'BOLD_ITALIC_SERIF';

  switch (styleMode) {
    case 'sans':
      boldSerifType = 'BOLD_SANS';
      italicSerifType = 'ITALIC_SANS';
      boldItalicSerifType = 'BOLD_ITALIC_SANS';
      break;
    case 'serif':
      boldSansType = 'BOLD_SERIF';
      italicSansType = 'ITALIC_SERIF';
      boldItalicSansType = 'BOLD_ITALIC_SERIF';
      break;
    case 'script':
      boldSansType = 'BOLD_SCRIPT';
      boldSerifType = 'BOLD_SCRIPT';
      italicSansType = 'SCRIPT'; 
      italicSerifType = 'SCRIPT';
      boldItalicSansType = 'BOLD_SCRIPT';
      boldItalicSerifType = 'BOLD_SCRIPT';
      break;
    case 'fraktur':
      boldSansType = 'BOLD_FRAKTUR';
      boldSerifType = 'BOLD_FRAKTUR';
      italicSansType = 'FRAKTUR'; 
      italicSerifType = 'FRAKTUR';
      boldItalicSansType = 'BOLD_FRAKTUR';
      boldItalicSerifType = 'BOLD_FRAKTUR';
      break;
    case 'double-struck':
      boldSansType = 'DOUBLE_STRUCK';
      boldSerifType = 'DOUBLE_STRUCK';
      italicSansType = 'DOUBLE_STRUCK';
      italicSerifType = 'DOUBLE_STRUCK';
      boldItalicSansType = 'DOUBLE_STRUCK';
      boldItalicSerifType = 'DOUBLE_STRUCK';
      break;
    case 'mixed':
    default:
      break;
  }

  // 8. Headers: Replace # Header with Bold text
  result = result.replace(/^(#{1,6})\s+(.*)$/gm, (match, hashes, content) => {
    return `\n${transformText(content.trim(), boldSansType)}\n`;
  });

  // 9. Blockquotes
  result = result.replace(/^>\s?(.*)$/gm, '▎ $1');

  // 10. Inline Formatting Rules
  const RULES = [
    { regex: /\*\*\*(.+?)\*\*\*/g, type: boldItalicSansType },
    { regex: /___(.+?)___/g, type: boldItalicSerifType },
    { regex: /\*\*(.+?)\*\*/g, type: boldSansType },
    { regex: /__(.+?)__/g, type: boldSerifType },
    { regex: /\*([^\s*](?:[^\\*]*[^\s*])?)\*/g, type: italicSansType },
    { regex: /_([^\s_](?:[^\\_]*[^\s_])?)_/g, type: italicSerifType },
    { regex: /~~(.+?)~~/g, type: 'STRIKETHROUGH' },
  ];

  RULES.forEach(rule => {
    result = result.replace(rule.regex, (_, content) => transformText(content, rule.type));
  });

  // 11. Restore Code Blocks
  codeBlocks.forEach((block, index) => {
    result = result.replace(`%%CODEBLOCK${index}%%`, block);
  });

  return result;
};

// --- Custom Element ---
class UnimarkEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.hasRendered = false;
    this.styleMode = 'mixed';
  }

  connectedCallback() {
    if (!this.hasRendered) {
        this.render();
        this.setupEvents();
        this.updateOutput(); // Initial render
        this.hasRendered = true;
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: ui-sans-serif, system-ui, sans-serif;
          --bg: #030712;
          --panel-bg: #1f2937;
          --border: #374151;
          --text: #f3f4f6;
          --text-muted: #9ca3af;
          --accent: #4f46e5;
          --accent-hover: #4338ca;
          --modal-overlay: rgba(0, 0, 0, 0.75);
        }
        
        * { box-sizing: border-box; }

        .container {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          background: var(--bg);
          color: var(--text);
          height: 100%;
          min-height: 500px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          container-type: inline-size;
          container-name: editor;
          position: relative;
        }

        .toolbar {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.75rem;
          background: #111827;
          border-bottom: 1px solid var(--border);
          overflow-x: auto;
          scrollbar-width: none;
        }
        .toolbar::-webkit-scrollbar { display: none; }

        button {
          background: transparent;
          border: none;
          padding: 0.5rem;
          border-radius: 0.375rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        button:hover {
          background: rgba(255,255,255,0.1);
        }
        button.text-btn {
          font-size: 0.85rem;
          font-weight: 500;
          padding: 0.5rem 0.75rem;
          white-space: nowrap;
          color: #e5e7eb;
        }
        button.text-btn:hover {
          color: white;
        }

        /* Forces all SVGs in buttons to be visible and white/grey */
        svg {
          width: 20px;
          height: 20px;
          fill: none;
          stroke: #e5e7eb; /* Bright text color */
          stroke-width: 2.2px;
          stroke-linecap: round;
          stroke-linejoin: round;
          display: block;
        }
        
        button:hover svg {
          stroke: #ffffff;
        }

        select {
          appearance: none;
          background: #1f2937;
          border: 1px solid #4b5563;
          color: #ffffff;
          padding: 0.4rem 2rem 0.4rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.85rem;
          cursor: pointer;
          outline: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23e5e7eb' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
        }
        select:focus {
          border-color: var(--accent);
        }
        
        .separator {
          width: 1px;
          height: 1.5rem;
          background: var(--border);
          margin: 0 0.5rem;
        }

        .editor-body {
          flex: 1;
          display: flex;
          flex-direction: row;
          overflow: hidden;
        }

        .pane {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          min-height: 200px;
        }

        textarea {
          flex: 1;
          width: 100%;
          height: 100%;
          background: var(--bg);
          color: var(--text);
          border: none;
          padding: 1.5rem;
          resize: none;
          font-family: 'Fira Code', ui-monospace, SFMono-Regular, monospace;
          font-size: 1rem;
          line-height: 1.75;
          outline: none;
        }
        textarea::placeholder { color: #4b5563; }

        .output {
          flex: 1;
          padding: 1.5rem;
          background: #0f131f;
          border-left: 1px solid var(--border);
          white-space: pre-wrap;
          overflow-y: auto;
          font-family: ui-sans-serif, system-ui, sans-serif;
          font-size: 1rem;
          line-height: 1.75;
          word-break: break-word;
        }

        .copy-overlay {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
        }
        .pane:hover .copy-overlay, .copy-overlay:focus-within { opacity: 1; }
        
        .copy-btn-mini {
          background: rgba(31, 41, 55, 0.8);
          backdrop-filter: blur(4px);
          border: 1px solid var(--border);
          padding: 0.4rem;
        }
        .copy-btn-mini:hover {
          background: var(--accent);
          border-color: var(--accent);
        }
        /* Override for icon inside copy button to follow specific states if needed, though general rule handles it well */

        /* Modal */
        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--modal-overlay);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s;
        }
        .modal-overlay.active {
          opacity: 1;
          pointer-events: auto;
        }
        .modal {
          background: #111827;
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 1.5rem;
          width: 90%;
          max-width: 400px;
          max-height: 90%;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 0.5rem;
        }
        .modal-title { font-weight: bold; font-size: 1.25rem; }
        .modal-content { font-size: 0.9rem; line-height: 1.6; color: #d1d5db; }
        .modal-content code {
          background: #374151;
          padding: 0.1rem 0.3rem;
          border-radius: 0.25rem;
          font-family: monospace;
        }
        .key-value { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
        .close-btn { 
          /* Close btn overrides */
        }

        @container editor (max-width: 600px) {
          .editor-body { flex-direction: column; }
          .output { border-left: none; border-top: 1px solid var(--border); }
          .pane { min-height: auto; flex: 1 1 50%; }
        }
      </style>

      <div class="container">
        <!-- Toolbar -->
        <div class="toolbar">
          <select id="style-selector" title="Choose Font Style">
            <option value="mixed">Mix (Sans/Serif)</option>
            <option value="sans">Sans Only</option>
            <option value="serif">Serif Only</option>
            <option value="script">Script</option>
            <option value="fraktur">Fraktur</option>
            <option value="double-struck">Double Struck</option>
          </select>

          <div class="separator"></div>

          <button data-action="fmt" data-prefix="**" data-suffix="**" title="Bold">
            <svg viewBox="0 0 24 24"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
          </button>
          <button data-action="fmt" data-prefix="_" data-suffix="_" title="Italic">
             <svg viewBox="0 0 24 24"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
          </button>
          <button data-action="fmt" data-prefix="___" data-suffix="___" title="Bold Italic">
             <svg viewBox="0 0 24 24"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
          </button>
          <button data-action="fmt" data-prefix="\x60" data-suffix="\x60" title="Monospace">
            <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </button>
          <button data-action="fmt" data-prefix="~~" data-suffix="~~" title="Strikethrough">
            <svg viewBox="0 0 24 24"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></svg>
          </button>
          
          <div class="separator"></div>

          <button data-action="example" class="text-btn" title="Load Example">
            Example
          </button>

          <button data-action="info" title="Markdown Guide">
             <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </button>
          
          <div class="separator"></div>
          
          <button data-action="clear" title="Clear All">
             <svg viewBox="0 0 24 24" style="stroke: #ef4444;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>

        <!-- Editor Area -->
        <div class="editor-body">
          <div class="pane">
             <textarea spellcheck="false" placeholder="Type Markdown here...&#10;# Headers convert to bold&#10;**Bold** becomes sans bold&#10;> Quotes convert to vertical bars&#10;\x60Code\x60 becomes monospace"># Welcome to UniMark

Start typing in the left panel to see the magic happen!

# Features

**Bold Text** converts to unicode bold.
_Italic Text_ converts to serif italic.
\x60Monospace\x60 looks like code.
~~Strikethrough~~ works too.

# Quotes

> This is a quote block.
> It stands out nicely!

# Code Blocks

\x60\x60\x60
# This header remains formatted as code
And **bold** remains as code too!
\x60\x60\x60

# Links

[My Website](https://www.netsi.dk) converts to text with url.</textarea>
             <div class="copy-overlay">
                <button class="copy-btn-mini" data-action="copy-input" title="Copy Markdown Source">
                  <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
             </div>
          </div>

          <div class="pane">
            <div class="output"></div>
            <div class="copy-overlay">
                <button class="copy-btn-mini" data-action="copy-output" title="Copy Unicode Result">
                  <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
             </div>
          </div>
        </div>

        <!-- Modal -->
        <div class="modal-overlay" id="modal">
          <div class="modal">
            <div class="modal-header">
              <span class="modal-title">Markdown Guide</span>
              <button class="close-btn" data-action="close-modal" title="Close">
                <svg viewBox="0 0 24 24" style="stroke: #f87171;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="modal-content">
              <div class="key-value"><span>Bold</span> <code>**text**</code></div>
              <div class="key-value"><span>Italic</span> <code>*text*</code> or <code>_text_</code></div>
              <div class="key-value"><span>Bold Italic</span> <code>***text***</code></div>
              <div class="key-value"><span>Monospace</span> <code>\x60text\x60</code></div>
              <div class="key-value"><span>Strikethrough</span> <code>~~text~~</code></div>
              <div class="key-value"><span>Headers</span> <code># Header</code></div>
              <div class="key-value"><span>Lists</span> <code>- Item</code></div>
              <div class="key-value"><span>Task Lists</span> <code>- [x] Done</code></div>
              <div class="key-value"><span>Quote</span> <code>> Text</code></div>
              <div class="key-value"><span>Code Block</span> <code>\x60\x60\x60</code></div>
              <div class="key-value"><span>Horizontal Rule</span> <code>---</code></div>
              <div class="key-value"><span>Link</span> <code>[Text](URL)</code></div>
              <div class="key-value"><span>Image</span> <code>![Alt](URL)</code></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupEvents() {
    this.textarea = this.shadowRoot.querySelector('textarea');
    this.outputDiv = this.shadowRoot.querySelector('.output');
    this.styleSelector = this.shadowRoot.getElementById('style-selector');
    this.modal = this.shadowRoot.getElementById('modal');

    // Live update
    this.textarea.addEventListener('input', () => this.updateOutput());

    // Style Selector
    this.styleSelector.addEventListener('change', (e) => {
      this.styleMode = e.target.value;
      this.updateOutput();
    });

    // Buttons
    this.shadowRoot.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget;
        this.handleAction(target);
      });
    });
  }

  updateOutput() {
    const raw = this.textarea.value;
    const converted = parseMarkdown(raw, this.styleMode);
    this.outputDiv.textContent = converted;
  }

  handleAction(btn) {
    const action = btn.dataset.action;
    
    if (action === 'fmt') {
      const prefix = btn.dataset.prefix;
      const suffix = btn.dataset.suffix;
      this.insertFormat(prefix, suffix);
    } else if (action === 'clear') {
      this.textarea.value = '';
      this.updateOutput();
      this.textarea.focus();
    } else if (action === 'example') {
      this.textarea.value = SAMPLE_MARKDOWN;
      this.updateOutput();
      this.textarea.scrollTop = 0;
    } else if (action === 'info') {
      this.modal.classList.add('active');
    } else if (action === 'close-modal') {
      this.modal.classList.remove('active');
    } else if (action === 'copy-input') {
      this.copyToClipboard(this.textarea.value, btn);
    } else if (action === 'copy-output') {
      this.copyToClipboard(this.outputDiv.textContent, btn);
    }
  }

  insertFormat(prefix, suffix) {
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    const text = this.textarea.value;
    
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    this.textarea.value = before + prefix + selection + suffix + after;
    this.textarea.focus();
    this.textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    this.updateOutput();
  }

  async copyToClipboard(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
      
      const originalHtml = btn.innerHTML;
      btn.innerHTML = `\x3Csvg viewBox="0 0 24 24" style="stroke: #4ade80;"><polyline points="20 6 9 17 4 12"/>\x3C/svg>`;
      
      setTimeout(() => {
        btn.innerHTML = originalHtml;
      }, 1500);
      
    } catch (err) {
      console.error('Failed to copy', err);
    }
  }
}

customElements.define('unimark-editor', UnimarkEditor);
