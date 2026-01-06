
export function htmlToMarkdown(html: string): string {
  // Create a temporary DOM element to parse HTML
  const div = document.createElement('div');
  div.innerHTML = html;

  function traverse(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const el = node as HTMLElement;
    let content = '';
    
    // Process child nodes
    el.childNodes.forEach(child => {
      content += traverse(child);
    });

    const tag = el.tagName.toLowerCase();

    switch (tag) {
      case 'b':
      case 'strong':
        return `**${content}**`;
      case 'i':
      case 'em':
        return `*${content}*`;
      case 'u':
        return `++${content}++`;
      case 's':
      case 'strike':
      case 'del':
        return `~~${content}~~`;
      case 'p':
      case 'div':
        // Add newlines only if content is not empty
        return content.trim() ? `\n\n${content}\n\n` : '';
      case 'br':
        return '\n';
      case 'ul':
        return `\n${content}\n`;
      case 'ol':
        return `\n${content}\n`; // Detailed OL handling omitted for simplicity, treating as list
      case 'li':
        return `\n- ${content}`;
      case 'a':
        const href = el.getAttribute('href');
        return href ? `[${content}](${href})` : content;
      case 'h1':
        return `\n# ${content}\n`;
      case 'h2':
        return `\n## ${content}\n`;
      case 'h3':
        return `\n### ${content}\n`;
      default:
        return content;
    }
  }

  // Clean up multiple newlines
  return traverse(div).replace(/\n{3,}/g, '\n\n').trim();
}
