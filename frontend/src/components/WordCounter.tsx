import React, { useState, useMemo } from 'react';
import { FileText, Type, Hash, AlignLeft } from 'lucide-react';

const WordCounter: React.FC = () => {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return {
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0
      };
    }

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = trimmedText ? trimmedText.split(/\s+/).length : 0;
    const sentences = trimmedText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = trimmedText.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const lines = text.split('\n').length;

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines
    };
  }, [text]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Input Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
            <Type size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Enter Your Text</h2>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          className="w-full h-48 p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
        />
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <Type size={16} />
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Characters</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.characters}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
              <Hash size={16} />
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Words</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.words}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
              <AlignLeft size={16} />
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Sentences</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.sentences}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
              <FileText size={16} />
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Paragraphs</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.paragraphs}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
              <AlignLeft size={16} />
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Lines</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.lines}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Type size={16} />
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">No Spaces</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.charactersNoSpaces}</div>
        </div>
      </div>
    </div>
  );
};

export default WordCounter;
