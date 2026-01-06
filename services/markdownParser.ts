
import { TransformType } from '../types';
import { transformText } from './unicodeMaps';

// Definition of our specific Markdown subset to Unicode conversions
const RULES = [
  // ***Bold Italic***
  {
    regex: /\*\*\*(.+?)\*\*\*/g,
    type: TransformType.BOLD_ITALIC_SANS
  },
  {
    regex: /___(.+?)___/g,
    type: TransformType.BOLD_ITALIC_SERIF
  },
  // **Bold**
  {
    regex: /\*\*(.+?)\*\*/g,
    type: TransformType.BOLD_SANS
  },
  {
    regex: /__(.+?)__/g,
    type: TransformType.BOLD_SERIF
  },
  // *Italic*
  {
    regex: /\*([^\s*](?:[^\\*]*[^\s*])?)\*/g,
    type: TransformType.ITALIC_SANS
  },
  {
    regex: /_([^\s_](?:[^\\_]*[^\s_])?)_/g,
    type: TransformType.ITALIC_SERIF
  },
  // ~~Strikethrough~~
  {
    regex: /~~(.+?)~~/g,
    type: TransformType.STRIKETHROUGH
  },
  // ++Underline++
  {
    regex: /\+\+(.+?)\+\+/g,
    type: TransformType.UNDERLINE
  },
];

const getVisualLength = (str: string): number => Array.from(str).length;

export const formatTable = (input: string, styleName: 'single' | 'double'): string => {
  const chars = styleName === 'double' 
    ? { tl: '╔', tm: '╦', tr: '╗', vl: '║', ml: '╠', mm: '╬', mr: '╣', bl: '╚', bm: '╩', br: '╝', h: '═' }
    : { tl: '┌', tm: '┬', tr: '┐', vl: '│', ml: '├', mm: '┼', mr: '┤', bl: '└', bm: '┴', br: '┘', h: '─' };
    
  const lines = input.trim().split('\n');
  const matrix: string[][] = [];
  let alignments: string[] = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    if (/^\|?[\s\-:|]+\|?$/.test(line) && line.includes('-')) {
      const parts = line.split('|').map(c => c.trim()).filter((c, i, a) => !(i === 0 && line.startsWith('|')) && !(i === a.length-1 && line.endsWith('|')));
      alignments = parts.map(c => c.startsWith(':') && c.endsWith(':') ? 'center' : (c.endsWith(':') ? 'right' : 'left'));
      continue;
    }
    let cells = line.split('|');
    if (line.startsWith('|')) cells.shift();
    if (line.endsWith('|')) cells.pop();
    matrix.push(cells.map(c => c.trim()));
  }
  
  if (matrix.length === 0) return input;

  const colWidths: number[] = [];
  matrix.forEach(row => {
    row.forEach((cell, i) => {
      const mono = transformText(cell, TransformType.MONOSPACE);
      row[i] = mono;
      colWidths[i] = Math.max(colWidths[i] || 0, getVisualLength(mono));
    });
  });

  const padCell = (content: string, width: number, align: string) => {
      const space = width - getVisualLength(content);
      if (align === 'right') return ' ' + ' '.repeat(space) + content + ' ';
      if (align === 'center') return ' ' + ' '.repeat(Math.floor(space/2)) + content + ' '.repeat(space - Math.floor(space/2)) + ' ';
      return ' ' + content + ' '.repeat(space) + ' ';
  };

  const renderRow = (row: string[]) => chars.vl + row.map((cell, i) => padCell(cell, colWidths[i], alignments[i] || 'left')).join(chars.vl) + chars.vl;
  const renderDivider = (l: string, m: string, r: string, f: string) => l + colWidths.map(w => f.repeat(w + 2)).join(m) + r;

  const res = [renderDivider(chars.tl, chars.tm, chars.tr, chars.h)];
  if (matrix.length > 0) res.push(renderRow(matrix[0]));
  if (matrix.length > 1) {
    res.push(renderDivider(chars.ml, chars.mm, chars.mr, chars.h));
    for (let i = 1; i < matrix.length; i++) res.push(renderRow(matrix[i]));
  }
  res.push(renderDivider(chars.bl, chars.bm, chars.br, chars.h));
  return res.join('\n');
};

export const parseMarkdownToUnicode = (markdown: string, styleMode: 'mixed' | 'sans' | 'serif' = 'mixed'): string => {
  let result = markdown;
  const codeBlocks: string[] = [];

  // 0. Generic Syntax: ((TYPE:content)) - Process first to avoid interfering with Markdown styles
  result = result.replace(/\(\(([A-Z_]+):([\s\S]+?)\)\)/g, (match, typeStr, content) => {
    // Check if typeStr is a valid TransformType key
    if (Object.values(TransformType).includes(typeStr as TransformType)) {
      // transformText might contain characters that look like markdown, so we might need protection,
      // but usually transformed unicode chars are safe.
      return transformText(content, typeStr as TransformType);
    }
    return content; // Return raw content if type is invalid
  });

  result = result.replace(/```([^\n]*)\n([\s\S]*?)```/g, (match, lang, content) => {
    // If lang is present, style it as Bold Sans
    let header = '';
    if (lang && lang.trim()) {
       header = transformText(lang.trim(), TransformType.BOLD_SANS) + '\n';
    }
    const monospaced = transformText(content, TransformType.MONOSPACE);
    const token = `%%CODEBLOCK${codeBlocks.length}%%`;
    codeBlocks.push(header + monospaced);
    return token;
  });

  result = result.replace(/`([^`]+)`/g, (match, content) => {
    const monospaced = transformText(content, TransformType.MONOSPACE);
    const token = `%%CODEBLOCK${codeBlocks.length}%%`;
    codeBlocks.push(monospaced);
    return token;
  });

  // Table formatting
  result = result.replace(/^(\|.*\|(?:\r?\n|$))+/gm, m => (m.includes('|-') || m.includes('| -') || m.includes('|:-')) ? formatTable(m, 'single') : m);

  // 2. HTML images
  result = result.replace(/<img\b[^>]*>/gi, (match) => {
    const altMatch = match.match(/alt=["']([^"']*)["']/i);
    const srcMatch = match.match(/src=["']([^"']*)["']/i);
    const altText = altMatch?.[1]?.trim();
    const srcText = srcMatch?.[1]?.trim();
    let output = '🖼️';
    if (altText) output += ` ${altText}`;
    if (srcText) output += ` (${srcText})`;
    return output;
  });

  // 3. Strip remaining HTML tags
  result = result.replace(/<\/?[^>]+>/g, '');

  // 4. Links
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');

  // 5. Images
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '🖼️ $1');

  // 6. Task Lists
  result = result.replace(/^(\s*)-\s\[x\]\s/gim, '$1☑ ');
  result = result.replace(/^(\s*)-\s\[ \]\s/gim, '$1☐ ');

  // 7. Unordered Lists
  result = result.replace(/^(\s*)[-*+]\s/gm, '$1• ');

  // 8. Horizontal Rules
  result = result.replace(/^[-*_]{3,}$/gm, '━━━━━━━━━━━━━━━━');

  // 9. Headers: Handle Sans/Serif modes if needed, but keeping simple bold for now as per previous logic, 
  // or adapting to JS logic which uses specific styles.
  // JS Logic:
  // result = result.replace(/^(#{1,6})\s+(.*)$/gm, (m, h, c) => `\n${transformText(c.trim(), bS)}\n`);
  // Let's adopt the JS logic more closely for consistency if possible, or stick to simple valid TS logic.
  // The JS used styleMode to switch between sans/serif for headers/bold/italic.
  // I added styleMode param to this function signature.
  
  let bS = TransformType.BOLD_SANS, bR = TransformType.BOLD_SERIF, iS = TransformType.ITALIC_SANS, iR = TransformType.ITALIC_SERIF;
  if (styleMode === 'sans') { bR = bS; iR = iS; }
  else if (styleMode === 'serif') { bS = bR; iS = iR; }

  result = result.replace(/^(#{1,6})\s+(.*)$/gm, (match, hashes, content) => {
      return `${transformText(content.trim(), bS)}`;
  });

  // 10. Blockquotes
  result = result.replace(/^>\s?(.*)$/gm, '▎ $1');

  // 11. Process Standard Rules
  // We need to override the RULES to use dynamic types based on styleMode, or just manually replace as JS did.
  // JS manually replaced. The RULES array uses fixed types. 
  // Let's replicate the JS manual replacement for style consistency.
  
  const rules = [
    { regex: /\*\*\*(.+?)\*\*\*/g, type: TransformType.BOLD_ITALIC_SANS }, // Fixed for now, JS used constant
    { regex: /\*\*([\s\S]+?)\*\*/g, type: bS },
    { regex: /__([\s\S]+?)__/g, type: bR },
    { regex: /\*([^\s*](?:[^\\*]*[^\s*])?)\*/g, type: iS },
    { regex: /_([^\s_](?:[^\\_]*[^\s_])?)_/g, type: iR },
    { regex: /~~([\s\S]+?)~~/g, type: TransformType.STRIKETHROUGH },
    { regex: /\+\+(.+?)\+\+/g, type: TransformType.UNDERLINE },
  ];

  rules.forEach(r => result = result.replace(r.regex, (_, c) => transformText(c, r.type)));

  // Generic Syntax moved to top

  // 12. Restore Code Blocks
  codeBlocks.forEach((block, index) => {
    result = result.replace(`%%CODEBLOCK${index}%%`, block);
  });
  
  return result;
};
