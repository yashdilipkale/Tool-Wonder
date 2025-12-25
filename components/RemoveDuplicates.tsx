import React, { useState } from 'react';
import { Copy, Download, RotateCcw, Trash2 } from 'lucide-react';

const RemoveDuplicates: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [removalMode, setRemovalMode] = useState<'lines' | 'words' | 'sentences'>('lines');
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [stats, setStats] = useState<{
    originalLines: number;
    uniqueLines: number;
    duplicatesRemoved: number;
    originalWords: number;
    uniqueWords: number;
  } | null>(null);

  const removeDuplicates = () => {
    if (!inputText.trim()) {
      setOutputText('');
      setStats(null);
      return;
    }

    let items: string[] = [];
    let uniqueItems: string[] = [];

    switch (removalMode) {
      case 'lines':
        items = inputText.split('\n');
        uniqueItems = items.filter((item, index, arr) => {
          const itemToCompare = caseSensitive ? item : item.toLowerCase().trim();
          return arr.findIndex(other =>
            caseSensitive ? other === item : other.toLowerCase().trim() === itemToCompare
          ) === index;
        });
        setOutputText(uniqueItems.join('\n'));
        break;

      case 'words':
        items = inputText.split(/\s+/).filter(word => word.trim() !== '');
        uniqueItems = items.filter((item, index, arr) => {
          const itemToCompare = caseSensitive ? item : item.toLowerCase().trim();
          return arr.findIndex(other =>
            caseSensitive ? other === item : other.toLowerCase().trim() === itemToCompare
          ) === index;
        });
        setOutputText(uniqueItems.join(' '));
        break;

      case 'sentences':
        // Split by sentence endings (. ! ?) followed by space or newline
        items = inputText.split(/[.!?]+/).filter(sentence => sentence.trim() !== '');
        uniqueItems = items.filter((item, index, arr) => {
          const itemToCompare = caseSensitive ? item : item.toLowerCase().trim();
          return arr.findIndex(other =>
            caseSensitive ? other === item : other.toLowerCase().trim() === itemToCompare
          ) === index;
        });
        setOutputText(uniqueItems.join('. '));
        break;
    }

    // Calculate stats
    const originalLines = inputText.split('\n').length;
    const originalWords = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

    setStats({
      originalLines,
      uniqueLines: removalMode === 'lines' ? uniqueItems.length : originalLines,
      duplicatesRemoved: items.length - uniqueItems.length,
      originalWords,
      uniqueWords: removalMode === 'words' ? uniqueItems.length : originalWords
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
    link.download = `duplicates_removed_${removalMode}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetTool = () => {
    setInputText('');
    setOutputText('');
    setRemovalMode('lines');
    setCaseSensitive(false);
    setStats(null);
  };

  // Auto-process when inputs change
  React.useEffect(() => {
    removeDuplicates();
  }, [inputText, removalMode, caseSensitive]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
            <Trash2 size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Remove Duplicates</h2>
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
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Remove Duplicates From
                </label>
                <select
                  value={removalMode}
                  onChange={(e) => setRemovalMode(e.target.value as 'lines' | 'words' | 'sentences')}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="lines">Lines</option>
                  <option value="words">Words</option>
                  <option value="sentences">Sentences</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Case Sensitivity
                </label>
                <div className="flex items-center gap-3 mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={caseSensitive}
                      onChange={(e) => setCaseSensitive(e.target.checked)}
                      className="w-4 h-4 text-red-600 bg-slate-100 border-slate-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Case Sensitive
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Processed Text
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
                      className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
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
                placeholder="Processed text will appear here..."
              />
            </div>

            <button
              onClick={resetTool}
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
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.originalLines}</div>
              <div className="text-sm text-blue-800 dark:text-blue-200">Total Lines</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.uniqueLines}</div>
              <div className="text-sm text-green-800 dark:text-green-200">Unique Lines</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.duplicatesRemoved}</div>
              <div className="text-sm text-red-800 dark:text-red-200">Duplicates Removed</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.originalWords}</div>
              <div className="text-sm text-purple-800 dark:text-purple-200">Total Words</div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">How it works:</h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <p><strong>Lines:</strong> Removes duplicate lines of text</p>
            <p><strong>Words:</strong> Removes duplicate words from the text</p>
            <p><strong>Sentences:</strong> Removes duplicate sentences (split by . ! ?)</p>
            <p><strong>Case Sensitivity:</strong> When enabled, "Hello" and "hello" are treated as different</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveDuplicates;
