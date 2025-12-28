import React, { useState } from 'react';
import { Copy, Download, RotateCcw, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const TextSorter: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [sortType, setSortType] = useState<'lines' | 'words'>('lines');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(false);
  const [stats, setStats] = useState<{
    totalItems: number;
    sortedItems: number;
  } | null>(null);

  const sortText = () => {
    if (!inputText.trim()) {
      setOutputText('');
      setStats(null);
      return;
    }

    let items: string[] = [];

    if (sortType === 'lines') {
      items = inputText.split('\n').filter(line => line.trim() !== '');
    } else {
      items = inputText.split(/\s+/).filter(word => word.trim() !== '');
    }

    // Remove duplicates if enabled
    if (removeDuplicates) {
      const seen = new Set<string>();
      items = items.filter(item => {
        const key = caseSensitive ? item : item.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    // Sort items
    items.sort((a, b) => {
      const aCompare = caseSensitive ? a : a.toLowerCase();
      const bCompare = caseSensitive ? b : b.toLowerCase();

      if (sortOrder === 'asc') {
        return aCompare.localeCompare(bCompare);
      } else {
        return bCompare.localeCompare(aCompare);
      }
    });

    // Join back
    const sortedText = sortType === 'lines' ? items.join('\n') : items.join(' ');
    setOutputText(sortedText);

    setStats({
      totalItems: items.length,
      sortedItems: items.length
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
    link.download = `sorted_text_${sortType}_${sortOrder}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetSorter = () => {
    setInputText('');
    setOutputText('');
    setSortType('lines');
    setSortOrder('asc');
    setCaseSensitive(false);
    setRemoveDuplicates(false);
    setStats(null);
  };

  // Auto-sort when inputs change
  React.useEffect(() => {
    sortText();
  }, [inputText, sortType, sortOrder, caseSensitive, removeDuplicates]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
            <ArrowUpDown size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Text Sorter</h2>
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
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Sort By
                </label>
                <select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value as 'lines' | 'words')}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="lines">Lines</option>
                  <option value="words">Words</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="asc">Ascending (A-Z)</option>
                  <option value="desc">Descending (Z-A)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="w-4 h-4 text-green-600 bg-slate-100 border-slate-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Case Sensitive Sorting
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeDuplicates}
                  onChange={(e) => setRemoveDuplicates(e.target.checked)}
                  className="w-4 h-4 text-green-600 bg-slate-100 border-slate-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Remove Duplicates
                </span>
              </label>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Sorted Text
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
                      className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
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
                placeholder="Sorted text will appear here..."
              />
            </div>

            <button
              onClick={resetSorter}
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
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalItems}</div>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                {sortType === 'lines' ? 'Lines' : 'Words'} Sorted
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                {sortOrder === 'asc' ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
              </div>
              <div className="text-sm text-green-800 dark:text-green-200">
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {caseSensitive ? 'Aa' : 'AA'}
              </div>
              <div className="text-sm text-purple-800 dark:text-purple-200">
                {caseSensitive ? 'Case Sensitive' : 'Case Insensitive'}
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {removeDuplicates ? '✓' : '✗'}
              </div>
              <div className="text-sm text-orange-800 dark:text-orange-200">
                Duplicates Removed
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Sorting Options:</h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <p><strong>Lines:</strong> Sorts each line of text alphabetically</p>
            <p><strong>Words:</strong> Sorts individual words alphabetically</p>
            <p><strong>Case Sensitive:</strong> Treats uppercase and lowercase letters as different</p>
            <p><strong>Remove Duplicates:</strong> Eliminates duplicate entries during sorting</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextSorter;
