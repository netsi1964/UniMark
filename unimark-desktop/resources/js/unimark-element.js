var s = /* @__PURE__ */ ((a) => (a.BOLD_SANS = "BOLD_SANS", a.BOLD_SERIF = "BOLD_SERIF", a.ITALIC_SANS = "ITALIC_SANS", a.ITALIC_SERIF = "ITALIC_SERIF", a.BOLD_ITALIC_SANS = "BOLD_ITALIC_SANS", a.BOLD_ITALIC_SERIF = "BOLD_ITALIC_SERIF", a.MONOSPACE = "MONOSPACE", a.SCRIPT = "SCRIPT", a.BOLD_SCRIPT = "BOLD_SCRIPT", a.FRAKTUR = "FRAKTUR", a.BOLD_FRAKTUR = "BOLD_FRAKTUR", a.DOUBLE_STRUCK = "DOUBLE_STRUCK", a.STRIKETHROUGH = "STRIKETHROUGH", a.UNDERLINE = "UNDERLINE", a.BUBBLE = "BUBBLE", a.BUBBLE_FILLED = "BUBBLE_FILLED", a.SQUARE = "SQUARE", a.SQUARE_FILLED = "SQUARE_FILLED", a))(s || {});
const b = (a, e) => {
  const t = {}, r = a.split(""), i = Array.from(e);
  return r.forEach((n, c) => {
    i[c] && (t[n] = i[c]);
  }), t;
}, I = "abcdefghijklmnopqrstuvwxyzæøå", f = "ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ", L = "0123456789", m = I + f + L, R = {
  [s.BOLD_SANS]: b(m, "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇æøå𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭ÆØÅ𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵"),
  [s.BOLD_SERIF]: b(m, "𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳æøå𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙ÆØÅ𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗"),
  [s.ITALIC_SANS]: b(m, "𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻æøå𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡ÆØÅ0123456789"),
  [s.ITALIC_SERIF]: b(m, "𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧æøå𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍ÆØÅ0123456789"),
  [s.BOLD_ITALIC_SANS]: b(m, "𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯æøå𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕ÆØÅ0123456789"),
  [s.BOLD_ITALIC_SERIF]: b(m, "𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛æøå𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁ÆØÅ0123456789"),
  [s.MONOSPACE]: b(m, "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣æøå𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉ÆØÅ𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿"),
  [s.SCRIPT]: b(m, "𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏æøå𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵ÆØÅ0123456789"),
  [s.BOLD_SCRIPT]: b(m, "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃æøå𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩ÆØÅ0123456789"),
  [s.FRAKTUR]: b(m, "𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷æøå𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨÆØÅ0123456789"),
  [s.BOLD_FRAKTUR]: b(m, "𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟æøå𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅ÆØÅ0123456789"),
  [s.DOUBLE_STRUCK]: b(m, "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫æøå𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕛𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤÆØÅ0123456789"),
  [s.BUBBLE]: b(m, "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩæøåⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏÆØÅ0123456789"),
  [s.BUBBLE_FILLED]: b(m, "🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩æøå🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩ÆØÅ⓿❶❷❸❹❺❻❼❽❾"),
  [s.STRIKETHROUGH]: {},
  [s.UNDERLINE]: {},
  [s.SQUARE]: b(m, "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉æøå🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉ÆØÅ0123456789"),
  [s.SQUARE_FILLED]: b(m, "🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉æøå🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉ÆØÅ0123456789")
}, B = (a, e) => {
  if (e === s.STRIKETHROUGH) return a + "̶";
  if (e === s.UNDERLINE) return a + "̲";
  const t = R[e];
  return (t == null ? void 0 : t[a]) || a;
}, _ = (a, e) => Array.from(a).map((t) => B(t, e)).join("");
s.BOLD_ITALIC_SANS, s.BOLD_ITALIC_SERIF, s.BOLD_SANS, s.BOLD_SERIF, s.ITALIC_SANS, s.ITALIC_SERIF, s.STRIKETHROUGH, s.UNDERLINE;
const E = (a) => Array.from(a).length, y = (a, e) => {
  const t = e === "double" ? { tl: "╔", tm: "╦", tr: "╗", vl: "║", ml: "╠", mm: "╬", mr: "╣", bl: "╚", bm: "╩", br: "╝", h: "═" } : { tl: "┌", tm: "┬", tr: "┐", vl: "│", ml: "├", mm: "┼", mr: "┤", bl: "└", bm: "┴", br: "┘", h: "─" }, r = a.trim().split(`
`), i = [];
  let n = [];
  for (let o of r) {
    if (o = o.trim(), !o) continue;
    if (/^\|?[\s\-:|]+\|?$/.test(o) && o.includes("-")) {
      n = o.split("|").map((h) => h.trim()).filter((h, v, S) => !(v === 0 && o.startsWith("|")) && !(v === S.length - 1 && o.endsWith("|"))).map((h) => h.startsWith(":") && h.endsWith(":") ? "center" : h.endsWith(":") ? "right" : "left");
      continue;
    }
    let p = o.split("|");
    o.startsWith("|") && p.shift(), o.endsWith("|") && p.pop(), i.push(p.map((g) => g.trim()));
  }
  if (i.length === 0) return a;
  const c = [];
  i.forEach((o) => {
    o.forEach((p, g) => {
      const h = _(p, s.MONOSPACE);
      o[g] = h, c[g] = Math.max(c[g] || 0, E(h));
    });
  });
  const u = (o, p, g) => {
    const h = p - E(o);
    return g === "right" ? " " + " ".repeat(h) + o + " " : g === "center" ? " " + " ".repeat(Math.floor(h / 2)) + o + " ".repeat(h - Math.floor(h / 2)) + " " : " " + o + " ".repeat(h) + " ";
  }, x = (o) => t.vl + o.map((p, g) => u(p, c[g], n[g] || "left")).join(t.vl) + t.vl, l = (o, p, g, h) => o + c.map((v) => h.repeat(v + 2)).join(p) + g, d = [l(t.tl, t.tm, t.tr, t.h)];
  if (i.length > 0 && d.push(x(i[0])), i.length > 1) {
    d.push(l(t.ml, t.mm, t.mr, t.h));
    for (let o = 1; o < i.length; o++) d.push(x(i[o]));
  }
  return d.push(l(t.bl, t.bm, t.br, t.h)), d.join(`
`);
}, C = (a, e = "mixed") => {
  let t = a;
  const r = [];
  t = t.replace(/\(\(([A-Z_]+):([\s\S]+?)\)\)/g, (l, d, o) => Object.values(s).includes(d) ? _(o, d) : o), t = t.replace(/```([^\n]*)\n([\s\S]*?)```/g, (l, d, o) => {
    let p = "";
    d && d.trim() && (p = _(d.trim(), s.BOLD_SANS) + `
`);
    const g = _(o, s.MONOSPACE), h = `%%CODEBLOCK${r.length}%%`;
    return r.push(p + g), h;
  }), t = t.replace(/`([^`]+)`/g, (l, d) => {
    const o = _(d, s.MONOSPACE), p = `%%CODEBLOCK${r.length}%%`;
    return r.push(o), p;
  }), t = t.replace(/^(\|.*\|(?:\r?\n|$))+/gm, (l) => l.includes("|-") || l.includes("| -") || l.includes("|:-") ? y(l, "single") : l), t = t.replace(/<img\b[^>]*>/gi, (l) => {
    var v, S;
    const d = l.match(/alt=["']([^"']*)["']/i), o = l.match(/src=["']([^"']*)["']/i), p = (v = d == null ? void 0 : d[1]) == null ? void 0 : v.trim(), g = (S = o == null ? void 0 : o[1]) == null ? void 0 : S.trim();
    let h = "🖼️";
    return p && (h += ` ${p}`), g && (h += ` (${g})`), h;
  }), t = t.replace(/<\/?[^>]+>/g, ""), t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)"), t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "🖼️ $1"), t = t.replace(/^(\s*)-\s\[x\]\s/gim, "$1☑ "), t = t.replace(/^(\s*)-\s\[ \]\s/gim, "$1☐ "), t = t.replace(/^(\s*)[-*+]\s/gm, "$1• "), t = t.replace(/^[-*_]{3,}$/gm, "━━━━━━━━━━━━━━━━");
  let i = s.BOLD_SANS, n = s.BOLD_SERIF, c = s.ITALIC_SANS, u = s.ITALIC_SERIF;
  return e === "sans" ? (n = i, u = c) : e === "serif" && (i = n, c = u), t = t.replace(/^(#{1,6})\s+(.*)$/gm, (l, d, o) => `${_(o.trim(), i)}`), t = t.replace(/^>\s?(.*)$/gm, "▎ $1"), [
    { regex: /\*\*\*(.+?)\*\*\*/g, type: s.BOLD_ITALIC_SANS },
    // Fixed for now, JS used constant
    { regex: /\*\*([\s\S]+?)\*\*/g, type: i },
    { regex: /__([\s\S]+?)__/g, type: n },
    { regex: /\*([^\s*](?:[^\\*]*[^\s*])?)\*/g, type: c },
    { regex: /_([^\s_](?:[^\\_]*[^\s_])?)_/g, type: u },
    { regex: /~~([\s\S]+?)~~/g, type: s.STRIKETHROUGH },
    { regex: /\+\+(.+?)\+\+/g, type: s.UNDERLINE }
  ].forEach((l) => t = t.replace(l.regex, (d, o) => _(o, l.type))), r.forEach((l, d) => {
    t = t.replace(`%%CODEBLOCK${d}%%`, l);
  }), t;
};
function k(a) {
  const e = document.createElement("div");
  e.innerHTML = a;
  function t(r) {
    if (r.nodeType === Node.TEXT_NODE)
      return r.textContent || "";
    if (r.nodeType !== Node.ELEMENT_NODE)
      return "";
    const i = r;
    let n = "";
    switch (i.childNodes.forEach((u) => {
      n += t(u);
    }), i.tagName.toLowerCase()) {
      case "b":
      case "strong":
        return `**${n}**`;
      case "i":
      case "em":
        return `*${n}*`;
      case "u":
        return `++${n}++`;
      case "s":
      case "strike":
      case "del":
        return `~~${n}~~`;
      case "p":
      case "div":
        return n.trim() ? `

${n}

` : "";
      case "br":
        return `
`;
      case "ul":
        return `
${n}
`;
      case "ol":
        return `
${n}
`;
      // Detailed OL handling omitted for simplicity, treating as list
      case "li":
        return `
- ${n}`;
      case "a":
        const u = i.getAttribute("href");
        return u ? `[${n}](${u})` : n;
      case "h1":
        return `
# ${n}
`;
      case "h2":
        return `
## ${n}
`;
      case "h3":
        return `
### ${n}
`;
      default:
        return n;
    }
  }
  return t(e).replace(/\n{3,}/g, `

`).trim();
}
const T = `# Markdown Formatting Guide

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
> - Bill Gates

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
class O extends HTMLElement {
  constructor() {
    super(), this._isHovering = null, this._activeScroll = null, this._scrollTimeout = null, this._history = [], this._historyIndex = -1, this._inputTimeout = null, this._maxHistory = 100, this.attachShadow({ mode: "open" }), this.styleMode = "mixed";
  }
  connectedCallback() {
    this.render(), this.setup(), this.saveState(!0), this.update();
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
    this.txt = this.shadowRoot.querySelector("textarea"), this.out = this.shadowRoot.querySelector(".output"), this.txt.addEventListener("keydown", (t) => this.handleKeydown(t)), this.txt.addEventListener("input", () => {
      this.update(), this.debounceSaveState();
    }), this.txt.addEventListener("paste", (t) => this.handlePaste(t)), this.txt.addEventListener("mouseenter", () => this._isHovering = "in"), this.txt.addEventListener("mouseleave", () => {
      this._isHovering === "in" && (this._isHovering = null);
    }), this.out.addEventListener("mouseenter", () => this._isHovering = "out"), this.out.addEventListener("mouseleave", () => {
      this._isHovering === "out" && (this._isHovering = null);
    });
    const e = (t, r, i) => {
      if (this._isHovering && this._isHovering !== i || this._activeScroll && this._activeScroll !== i) return;
      this._activeScroll = i, clearTimeout(this._scrollTimeout);
      const n = t.scrollTop / (t.scrollHeight - t.clientHeight);
      r.scrollTop = n * (r.scrollHeight - r.clientHeight), this._scrollTimeout = setTimeout(() => this._activeScroll = null, 50);
    };
    this.txt.addEventListener("scroll", () => e(this.txt, this.out, "in")), this.out.addEventListener("scroll", () => e(this.out, this.txt, "out")), this.shadowRoot.getElementById("mode").addEventListener("change", (t) => {
      this.styleMode = t.target.value, this.update();
    }), this.shadowRoot.getElementById("btn-bold").onclick = () => this.applyFormat("**"), this.shadowRoot.getElementById("btn-italic").onclick = () => this.applyFormat("*"), this.shadowRoot.getElementById("btn-underline").onclick = () => this.applyFormat("++"), this.shadowRoot.getElementById("btn-strike").onclick = () => this.applyFormat("~~"), this.shadowRoot.getElementById("more-styles").addEventListener("change", (t) => {
      const r = t.target;
      r.value && (this.applyGenericFormat(r.value), r.value = "");
    }), this.shadowRoot.getElementById("btn-example").onclick = () => {
      this.txt.value = T, this.update();
    }, this.shadowRoot.getElementById("btn-clear").onclick = () => {
      this.txt.value = "", this.update();
    }, this.shadowRoot.getElementById("btn-table").onclick = () => this.shadowRoot.getElementById("table-modal").classList.add("active"), this.shadowRoot.getElementById("style-close").onclick = () => this.shadowRoot.getElementById("table-modal").classList.remove("active"), this.shadowRoot.getElementById("style-single").onclick = () => this.applyTable("single"), this.shadowRoot.getElementById("style-double").onclick = () => this.applyTable("double"), this.shadowRoot.getElementById("btn-copy-input").onclick = (t) => this.copyToClipboard(this.txt.value, t.target), this.shadowRoot.getElementById("btn-copy-output").onclick = (t) => this.copyToClipboard(this.out.innerText, t.target);
  }
  copyToClipboard(e, t) {
    e && navigator.clipboard.writeText(e).then(() => {
      const r = t.innerHTML;
      t.innerHTML = "✓ Copied!", setTimeout(() => t.innerHTML = r, 1500);
    });
  }
  saveState(e = !1) {
    const t = this.txt.value;
    e && clearTimeout(this._inputTimeout), !(this._historyIndex > -1 && this._history[this._historyIndex] === t) && (this._historyIndex < this._history.length - 1 && (this._history = this._history.slice(0, this._historyIndex + 1)), this._history.push(t), this._historyIndex++, this._history.length > this._maxHistory && (this._history.shift(), this._historyIndex--));
  }
  debounceSaveState() {
    clearTimeout(this._inputTimeout), this._inputTimeout = setTimeout(() => this.saveState(), 500);
  }
  undo() {
    this._historyIndex > 0 && (this._historyIndex--, this.txt.value = this._history[this._historyIndex], this.update());
  }
  redo() {
    this._historyIndex < this._history.length - 1 && (this._historyIndex++, this.txt.value = this._history[this._historyIndex], this.update());
  }
  handleKeydown(e) {
    if (e.metaKey || e.ctrlKey)
      switch (e.key.toLowerCase()) {
        case "z":
          e.preventDefault(), e.shiftKey ? this.redo() : this.undo();
          break;
        case "b":
          e.preventDefault(), this.applyFormat("**");
          break;
        case "i":
          e.preventDefault(), this.applyFormat("*");
          break;
        case "u":
          e.preventDefault(), this.applyFormat("++");
          break;
        case "s":
          e.preventDefault(), this.applyFormat("~~");
          break;
      }
  }
  update() {
    this.out.textContent = C(this.txt.value, this.styleMode);
  }
  applyFormat(e) {
    const t = this.txt.selectionStart, r = this.txt.selectionEnd, i = this.txt.value, n = i.substring(t, r), c = i.substring(0, t), u = i.substring(r);
    this.saveState(!0), this.txt.value = c + e + n + e + u, this.txt.selectionStart = t + e.length, this.txt.selectionEnd = r + e.length, this.txt.focus(), this.update(), this.saveState(!0);
  }
  applyGenericFormat(e) {
    const t = this.txt.selectionStart, r = this.txt.selectionEnd, i = this.txt.value, n = i.substring(t, r), c = i.substring(0, t), u = i.substring(r);
    this.saveState(!0);
    const x = `((${e}:${n}))`;
    this.txt.value = c + x + u, t === r ? (this.txt.selectionStart = t + e.length + 3, this.txt.selectionEnd = t + e.length + 3) : (this.txt.selectionStart = t + x.length, this.txt.selectionEnd = t + x.length), this.txt.focus(), this.update(), this.saveState(!0);
  }
  applyTable(e) {
    const t = this.txt.selectionStart, r = this.txt.selectionEnd, i = this.txt.value;
    let n = i.substring(t, r);
    if (this.saveState(!0), t === r) {
      const c = i.lastIndexOf(`

`, t), u = c === -1 ? 0 : c + 2, x = i.indexOf(`

`, t), l = x === -1 ? i.length : x;
      if (n = i.substring(u, l), n.includes("|")) {
        const d = y(n, e);
        this.txt.value = i.substring(0, u) + d + i.substring(l);
      }
    } else if (n.includes("|")) {
      const c = y(n, e);
      this.txt.value = i.substring(0, t) + c + i.substring(r);
    }
    this.shadowRoot.getElementById("table-modal").classList.remove("active"), this.update(), this.saveState(!0);
  }
  handlePaste(e) {
    var r;
    const t = (r = e.clipboardData) == null ? void 0 : r.getData("text/html");
    if (t) {
      e.preventDefault();
      const i = k(t), n = this.txt.selectionStart, c = this.txt.selectionEnd, u = this.txt.value;
      this.saveState(!0), this.txt.value = u.substring(0, n) + i + u.substring(c), this.txt.selectionStart = this.txt.selectionEnd = n + i.length, this.update(), this.saveState(!0);
    }
  }
}
customElements.define("unimark-editor", O);
