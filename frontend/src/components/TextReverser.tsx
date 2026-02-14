import React, { useState, useEffect } from 'react';
import { Copy, Download, RotateCcw, ArrowLeftRight, Trash2 } from 'lucide-react';
import { useTheme } from "../ThemeContext";

const TextReverser: React.FC = () => {
  const { theme } = useTheme();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [reverseType, setReverseType] = useState<'text' | 'words' | 'lines' | 'sentences'>('text');

  const [stats, setStats] = useState({
    characters: 0,
    words: 0,
    lines: 0
  });

  const processReverse = () => {
    if (!inputText) {
      setOutputText('');
      setStats({ characters: 0, words: 0, lines: 0 });
      return;
    }

    let result = '';

    switch (reverseType) {
      case 'text':
        result = inputText.split('').reverse().join('');
        break;

      case 'words':
        result = inputText.split(/\s+/).reverse().join(' ');
        break;

      case 'lines':
        result = inputText.split('\n').reverse().join('\n');
        break;

      case 'sentences':
        result = inputText.split(/[.!?]+/).reverse().join('. ');
        break;
    }

    setOutputText(result);

    setStats({
      characters: inputText.length,
      words: inputText.trim() ? inputText.trim().split(/\s+/).length : 0,
      lines: inputText.split('\n').length
    });
  };

  useEffect(() => {
    processReverse();
  }, [inputText, reverseType]);

  const copy = () => navigator.clipboard.writeText(outputText);

  const download = () => {
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reversed_text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div className="max-w-6xl mx-auto p-2">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow border border-slate-200 dark:border-slate-700">

        <div className="flex items-center gap-3 mb-6">
          <ArrowLeftRight className="text-indigo-600"/>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Text Reverser</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* INPUT */}
          <div>
            <textarea
              rows={8}
              value={inputText}
              onChange={(e)=>setInputText(e.target.value)}
              className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              placeholder="Paste text here..."
            />

            <select
              value={reverseType}
              onChange={(e)=>setReverseType(e.target.value as any)}
              className="w-full mt-3 p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="text">Reverse Characters</option>
              <option value="words">Reverse Words</option>
              <option value="lines">Reverse Lines</option>
              <option value="sentences">Reverse Sentences</option>
            </select>
          </div>

          {/* OUTPUT */}
          <div>
            <textarea
              value={outputText}
              readOnly
              rows={8}
              className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            />

            <div className="flex gap-2 mt-3">
              <button onClick={copy} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg flex items-center gap-1 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                <Copy size={14}/> Copy
              </button>

              <button onClick={download} className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-1 hover:bg-indigo-700 transition-colors">
                <Download size={14}/> Download
              </button>

              <button onClick={clear} className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-1 hover:bg-red-600 transition-colors">
                <Trash2 size={14}/> Clear
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
          <div className="p-4 bg-blue-50 dark:bg-slate-700 rounded-xl">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.characters}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">Characters</div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-slate-700 rounded-xl">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.words}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">Words</div>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-slate-700 rounded-xl">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.lines}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">Lines</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TextReverser;
