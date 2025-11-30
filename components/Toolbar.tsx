import React from 'react';
import { 
  Bold, 
  Italic, 
  Code, 
  Strikethrough, 
  Type, 
  Underline,
  Copy,
  Trash2,
  Sparkles
} from 'lucide-react';

interface ToolbarProps {
  onInsert: (prefix: string, suffix: string) => void;
  onClear: () => void;
  onCopyInput: () => void;
  onCopyOutput: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onInsert, onClear, onCopyInput, onCopyOutput }) => {
  const btnClass = "p-2 hover:bg-gray-800 rounded-md transition-colors text-gray-400 hover:text-white flex items-center gap-2";
  const groupClass = "flex items-center gap-1 border-r border-gray-800 pr-2 mr-2";

  return (
    <div className="sticky top-0 z-20 w-full bg-gray-900/95 backdrop-blur border-b border-gray-800 p-2 flex flex-wrap items-center gap-y-2">
      <div className="flex items-center w-full overflow-x-auto no-scrollbar">
        
        {/* Standard Formatting */}
        <div className={groupClass}>
          <button onClick={() => onInsert('**', '**')} className={btnClass} title="Bold (Sans)">
            <Bold size={18} strokeWidth={3} />
          </button>
          <button onClick={() => onInsert('_', '_')} className={btnClass} title="Italic (Serif)">
            <Italic size={18} className="font-serif" />
          </button>
          <button onClick={() => onInsert('___', '___')} className={btnClass} title="Bold Italic (Serif)">
            <div className="flex relative">
              <Bold size={14} />
              <Italic size={14} className="-ml-1" />
            </div>
          </button>
          <button onClick={() => onInsert('~~', '~~')} className={btnClass} title="Strikethrough">
            <Strikethrough size={18} />
          </button>
          <button onClick={() => onInsert('`', '`')} className={btnClass} title="Monospace">
            <Code size={18} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center ml-auto gap-2">
           <button onClick={onClear} className={`${btnClass} text-red-400 hover:bg-red-900/20 hover:text-red-300`} title="Clear All">
            <Trash2 size={18} />
            <span className="hidden sm:inline text-xs font-medium">Clear</span>
          </button>
          
          <div className="h-4 w-[1px] bg-gray-700 mx-1"></div>

          <button onClick={onCopyInput} className={btnClass} title="Copy Markdown Source">
             <Copy size={16} />
             <span className="text-xs font-medium">MD</span>
          </button>
           <button onClick={onCopyOutput} className={`${btnClass} bg-indigo-600 hover:bg-indigo-500 text-white`} title="Copy Unicode Result">
             <Sparkles size={16} />
             <span className="text-xs font-medium">Copy Result</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;