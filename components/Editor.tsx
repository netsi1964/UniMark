import React, { useState, useRef, useEffect } from 'react';
import Toolbar from './Toolbar';
import { parseMarkdownToUnicode } from '../services/markdownParser';

const Editor: React.FC = () => {
  const [input, setInput] = useState<string>("# Hello World\n\nTry typing some **Markdown** here.\n\nIt converts to unicode _automagically_.\n\n`Code` looks cool too.");
  const [output, setOutput] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Transform logic
    const transformed = parseMarkdownToUnicode(input);
    setOutput(transformed);
  }, [input]);

  const handleInsert = (prefix: string, suffix: string) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = `${before}${prefix}${selection}${suffix}${after}`;
    setInput(newText);

    // Restore focus and selection
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast here
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
      <Toolbar 
        onInsert={handleInsert} 
        onClear={() => setInput('')}
        onCopyInput={() => copyToClipboard(input)}
        onCopyOutput={() => copyToClipboard(output)}
      />
      
      <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-800 editor-container overflow-hidden">
        {/* Input Pane */}
        <div className="flex-1 flex flex-col relative group">
          <div className="absolute top-2 right-2 px-2 py-1 bg-gray-800 rounded text-xs text-gray-500 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            Markdown Input
          </div>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-full bg-gray-950 p-6 resize-none focus:outline-none font-mono text-sm sm:text-base leading-relaxed text-gray-300 placeholder-gray-600"
            placeholder="Type your markdown here..."
            spellCheck={false}
          />
        </div>

        {/* Output Pane */}
        <div className="flex-1 flex flex-col relative bg-gray-925 group">
           <div className="absolute top-2 right-2 px-2 py-1 bg-gray-800 rounded text-xs text-indigo-400 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            Unicode Output
          </div>
          <div className="w-full h-full p-6 overflow-auto font-sans text-sm sm:text-base leading-relaxed text-white whitespace-pre-wrap break-words">
            {output || <span className="text-gray-600 italic">Result will appear here...</span>}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-900 border-t border-gray-800 p-2 text-center text-xs text-gray-500">
        Supports: **bold**, __serif bold__, *italic*, `code`, ~~strike~~
      </div>
    </div>
  );
};

export default Editor;