
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

  // 2. Handle Links: [Text](URL) -> Text (URL)
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');

  // 3. Handle Headers first: Convert # Header to Bold Sans with newlines
  // Input: # My Title -> Output: \n**My Title**\n (which is then caught by bold rule)
  // Replaced logic: Instead of just turning it into text, we ensure it has surrounding whitespace
  // and remove the hashes completely, styling it as bold.
  result = result.replace(/^(#{1,6})\s+(.*)$/gm, (match, hashes, content) => {
    return `**${content.trim()}**`;
  });

  // 4. Handle Blockquotes: Replace > with vertical bar
  result = result.replace(/^>\s?(.*)$/gm, '▎ $1');

  // 5. Process Standard Rules
  RULES.forEach(rule => {
    result = result.replace(rule.regex, (match, content) => {
      return transformText(content, rule.type);
    });
  });
  
  // 6. Restore Code Blocks
  codeBlocks.forEach((block, index) => {
    result = result.replace(`%%CODEBLOCK${index}%%`, block);
  });
  
  return result;
};