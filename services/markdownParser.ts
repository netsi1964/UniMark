
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
];

export const parseMarkdownToUnicode = (markdown: string): string => {
  let result = markdown;
  const codeBlocks: string[] = [];

  // 1. Extract Code Blocks to protect them from other formatting
  // Triple backticks
  result = result.replace(/```([\s\S]*?)```/g, (match, content) => {
    const monospaced = transformText(content, TransformType.MONOSPACE);
    const token = `%%CODEBLOCK${codeBlocks.length}%%`;
    codeBlocks.push(monospaced);
    return token;
  });

  // Single backticks
  result = result.replace(/`([^`]+)`/g, (match, content) => {
    const monospaced = transformText(content, TransformType.MONOSPACE);
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

  // 7. Headers: Convert # Header to Bold Sans with newlines
  result = result.replace(/^(#{1,6})\s+(.*)$/gm, (match, hashes, content) => {
    return `**${content.trim()}**`;
  });

  // 8. Blockquotes: Replace > with vertical bar
  result = result.replace(/^>\s?(.*)$/gm, '▎ $1');

  // 9. Process Standard Rules
  RULES.forEach(rule => {
    result = result.replace(rule.regex, (match, content) => {
      return transformText(content, rule.type);
    });
  });
  
  // 10. Restore Code Blocks
  codeBlocks.forEach((block, index) => {
    result = result.replace(`%%CODEBLOCK${index}%%`, block);
  });
  
  return result;
};
