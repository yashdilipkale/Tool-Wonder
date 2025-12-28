import React, { useState } from 'react';
import { Copy, Download, RotateCcw, ArrowLeftRight } from 'lucide-react';

const TextReverser: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [reverseType, setReverseType] = useState<'text' | 'words' | 'lines'>('text');
  const [stats, setStats] = useState<{
    originalLength: number;
    reversedLength: number;
    wordsCount: number;
    linesCount: number;
  } | null>(null);

  const reverseText = () => {
    if (!inputText.trim()) {
      setOutputText('');
      setStats(null);
      return;
    }

    let reversed = '';
    const originalLength = inputText.length;

    switch (reverseType) {
      case 'text':
        reversed = inputText.split('').reverse().join('');
        break;
      case 'words':
        reversed = inputText.split(/\s+/).reverse().join(' ');
        break;
      case 'lines':
        reversed = inputText.split('\n').reverse().join('\n');
        break;
    }

    setOutputText(reversed);

    const wordsCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    const linesCount = inputText.split('\n').length;

    setStats({
      originalLength,
      reversedLength: reversed.length,
      wordsCount,
      linesCount
    });
  };

  const copyToClipboard = async () => {
    if (!outputText) return;

    try {
      await navigator.clipboard.writeText(outputText);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const downloadText = () => {
    if (!outputText) return;

    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reversed_text_${reverseType}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetReverser = () => {
    setInputText('');
    setOutputText('');
    setReverseType('text');
    setStats(null);
  };

  // Auto-reverse when inputs change
  React.useEffect(() => {
    reverseText();
  }, [inputText, reverseType]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
            <ArrowLeftRight size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Text Reverser</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Input Text
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text here..."
                rows={8}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Reverse Type
              </label>
              <select
                value={reverseType}
                onChange={(e) => setReverseType(e.target.value as 'text' | 'words' | 'lines')}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="text">Reverse Text (Characters)</option>
                <option value="words">Reverse Words Order</option>
                <option value="lines">Reverse Lines Order</option>
              </select>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Reversed Text
                </label>
                {outputText && (
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy size={12} />
                      Copy
                    </button>
                    <button
                      onClick={downloadText}
                      className="flex items-center gap-1 px-2 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 transition-colors"
                      title="Download as text file"
                    >
                      <Download size={12} />
                      Download
                    </button>
                  </div>
                )}
              </div>
              <textarea
                value={outputText}
                readOnly
                rows={8}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white resize-none"
                placeholder="Reversed text will appear here..."
              />
            </div>

            <button
              onClick={resetReverser}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.originalLength}</div>
              <div className="text-sm text-blue-800 dark:text-blue-200">Characters</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.wordsCount}</div>
              <div className="text-sm text-green-800 dark:text-green-200">Words</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.linesCount}</div>
              <div className="text-sm text-purple-800 dark:text-purple-200">Lines</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {reverseType === 'text' ? '🔄' : reverseType === 'words' ? '📝' : '📄'}
              </div>
              <div className="text-sm text-orange-800 dark:text-orange-200 capitalize">
                {reverseType} Reversed
              </div>
            </div>
          </div>
        )}

        {/* Examples */}
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white dark:bg-slate-600 rounded p-3">
              <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">Reverse Text:</div>
              <div className="text-slate-600 dark:text-slate-400">"Hello World" → "dlroW olleH"</div>
            </div>
            <div className="bg-white dark:bg-slate-600 rounded p-3">
              <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">Reverse Words:</div>
              <div className="text-slate-600 dark:text-slate-400">"Hello World" → "World Hello"</div>
            </div>
            <div className="bg-white dark:bg-slate-600 rounded p-3">
              <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">Reverse Lines:</div>
              <div className="text-slate-600 dark:text-slate-400">"Line 1{'\n'}Line 2" → "Line 2{'\n'}Line 1"</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextReverser;
