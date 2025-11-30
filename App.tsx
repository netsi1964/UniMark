import React from 'react';
import Editor from './components/Editor';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <header className="mb-6 text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          UniMark
        </h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Write in Markdown, get stylized Unicode. Perfect for social media bios and posts.
        </p>
      </header>

      <main className="w-full">
        <Editor />
      </main>
      
      <footer className="mt-8 text-gray-600 text-xs">
        <p>Pro tip: Use <strong>__underscore__</strong> for Serif Bold and <strong>`backticks`</strong> for Monospace.</p>
      </footer>
    </div>
  );
};

export default App;