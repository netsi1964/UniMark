
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
  FRAKTUR: createMap(NORMAL, '𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ0123456789'),
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
  // We handle both triple backticks (```...```) and single backticks (`...`)
  // Triple backticks
  result = result.replace(/```([\s\S]*?)```/g, (match, content) => {
    const monospaced = transformText(content, 'MONOSPACE');
    // Removed underscore to prevent italic rule from matching the placeholder
    const token = `%%CODEBLOCK${codeBlocks.length}%%`; 
    codeBlocks.push(monospaced);
    return token;
  });

  // Single backticks (inline code)
  result = result.replace(/`([^`]+)`/g, (match, content) => {
    const monospaced = transformText(content, 'MONOSPACE');
    const token = `%%CODEBLOCK${codeBlocks.length}%%`;
    codeBlocks.push(monospaced);
    return token;
  });

  // 2. Handle Links: [Text](URL) -> Text (URL)
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');

  // 3. Determine Style Mappings based on Mode
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

  // 4. Handle Headers: Replace # Header with Bold text (using current primary bold style)
  result = result.replace(/^(#{1,6})\s+(.*)$/gm, (match, hashes, content) => {
    return `\n${transformText(content.trim(), boldSansType)}\n`;
  });

  // 5. Handle Blockquotes: Replace > with vertical bar
  result = result.replace(/^>\s?(.*)$/gm, '▎ $1');

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

  // 6. Restore Code Blocks
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
    // Note: Backticks inside the template literal must be escaped with a backslash
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
        }
        
        * { box-sizing: border-box; }

        /* Main Container with Container Query Support */
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
          
          /* Container Query Configuration */
          container-type: inline-size;
          container-name: editor;
        }

        /* Toolbar */
        .toolbar {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.75rem;
          background: #111827;
          border-bottom: 1px solid var(--border);
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
        }
        .toolbar::-webkit-scrollbar { display: none; /* Chrome/Safari */ }

        button {
          background: transparent;
          border: none;
          color: var(--text-muted);
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
          color: white;
        }
        button:active {
          transform: translateY(1px);
        }
        button svg {
          width: 20px;
          height: 20px;
        }

        /* Dropdown Styling */
        select {
          appearance: none;
          background: #1f2937;
          border: 1px solid var(--border);
          color: var(--text);
          padding: 0.4rem 2rem 0.4rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.85rem;
          cursor: pointer;
          outline: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
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

        /* Editor Split Pane */
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

        /* Textarea Styling */
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
        textarea::placeholder {
          color: #4b5563;
        }

        /* Output Styling */
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

        /* Floating Copy Buttons */
        .copy-overlay {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
        }
        .pane:hover .copy-overlay, 
        .copy-overlay:focus-within {
          opacity: 1;
        }
        
        .copy-btn-mini {
          background: rgba(31, 41, 55, 0.8);
          backdrop-filter: blur(4px);
          border: 1px solid var(--border);
          color: var(--text-muted);
          padding: 0.4rem;
        }
        .copy-btn-mini:hover {
          background: var(--accent);
          border-color: var(--accent);
          color: white;
        }

        /* Container Query Styles */
        /* When the container is less than 600px wide, switch to vertical stack */
        @container editor (max-width: 600px) {
          .editor-body {
            flex-direction: column;
          }
          .output {
            border-left: none;
            border-top: 1px solid var(--border);
          }
          .pane {
            min-height: auto;
            flex: 1 1 50%;
          }
        }
      </style>

      <div class="container">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
          </button>
          <button data-action="fmt" data-prefix="_" data-suffix="_" title="Italic">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
          </button>
          <button data-action="fmt" data-prefix="___" data-suffix="___" title="Bold Italic">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
          </button>
          <button data-action="fmt" data-prefix="\`" data-suffix="\`" title="Monospace">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </button>
          <button data-action="fmt" data-prefix="~~" data-suffix="~~" title="Strikethrough">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></svg>
          </button>
          
          <div class="separator"></div>
          
          <button data-action="clear" title="Clear All">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" color="#ef4444"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>

        <div class="editor-body">
          <!-- Input Pane -->
          <div class="pane">
             <textarea spellcheck="false" placeholder="Type Markdown here...&#10;# Headers convert to bold&#10;**Bold** becomes sans bold&#10;> Quotes convert to vertical bars&#10;\`Code\` becomes monospace"># Welcome to UniMark

Start typing in the left panel to see the magic happen!

# Features

**Bold Text** converts to unicode bold.
_Italic Text_ converts to serif italic.
\`Monospace\` looks like code.
~~Strikethrough~~ works too.

# Quotes

> This is a quote block.
> It stands out nicely!

# Code Blocks

\`\`\`
# This header remains formatted as code
And **bold** remains as code too!
\`\`\`

# Links

[My Website](https://www.netsi.dk) converts to text with url.

# Headers

Headers (using #) are automatically converted to **Bold Text** with spacing around them.</textarea>
             <div class="copy-overlay">
                <button class="copy-btn-mini" data-action="copy-input" title="Copy Markdown Source">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
             </div>
          </div>

          <!-- Output Pane -->
          <div class="pane">
            <div class="output"></div>
            <div class="copy-overlay">
                <button class="copy-btn-mini" data-action="copy-output" title="Copy Unicode Result">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
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
        // Handle clicks on SVG elements inside button
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
      
      // Temporary visual feedback
      const originalHtml = btn.innerHTML;
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" color="#4ade80"><polyline points="20 6 9 17 4 12"/></svg>`;
      
      setTimeout(() => {
        btn.innerHTML = originalHtml;
      }, 1500);
      
    } catch (err) {
      console.error('Failed to copy', err);
    }
  }
}

customElements.define('unimark-editor', UnimarkEditor);
