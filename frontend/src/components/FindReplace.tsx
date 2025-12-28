import React, { useState, useEffect } from 'react';
import { Search, Replace, Settings, CheckCircle, AlertCircle, Copy } from 'lucide-react';

const FindReplace: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [replaceTerm, setReplaceTerm] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [matches, setMatches] = useState<number>(0);
  const [replacements, setReplacements] = useState<number>(0);

  // Options
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [wholeWord, setWholeWord] = useState<boolean>(false);
  const [useRegex, setUseRegex] = useState<boolean>(false);
  const [multiline, setMultiline] = useState<boolean>(false);

  // Statistics
  const [stats, setStats] = useState<{
    totalMatches: number;
    replacementsMade: number;
    searchTime: number;
  }>({ totalMatches: 0, replacementsMade: 0, searchTime: 0 });

  const findMatches = (text: string, search: string): number => {
    if (!search) return 0;

    try {
      let flags = 'g';
      if (!caseSensitive) flags += 'i';

      let pattern: RegExp;
      if (useRegex) {
        pattern = new RegExp(search, flags);
      } else {
        let escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (wholeWord) {
          escaped = `\\b${escaped}\\b`;
        }
        pattern = new RegExp(escaped, flags);
      }

      const matches = text.match(pattern);
      return matches ? matches.length : 0;
    } catch (error) {
      return 0;
    }
  };

  const performReplace = (text: string, search: string, replace: string): { result: string; replacements: number } => {
    if (!search) return { result: text, replacements: 0 };

    const startTime = performance.now();

    try {
      let flags = 'g';
      if (!caseSensitive) flags += 'i';

      let pattern: RegExp;
      if (useRegex) {
        pattern = new RegExp(search, flags);
      } else {
        let escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (wholeWord) {
          escaped = `\\b${escaped}\\b`;
        }
        pattern = new RegExp(escaped, flags);
      }

      const result = text.replace(pattern, replace);
      const replacementsMade = (text.match(pattern) || []).length;

      const endTime = performance.now();
      setStats({
        totalMatches: replacementsMade,
        replacementsMade,
        searchTime: endTime - startTime
      });

      return { result, replacements: replacementsMade };
    } catch (error) {
      setStats({ totalMatches: 0, replacementsMade: 0, searchTime: 0 });
      return { result: text, replacements: 0 };
    }
  };

  const handleReplace = () => {
    const { result, replacements: reps } = performReplace(inputText, searchTerm, replaceTerm);
    setOutputText(result);
    setReplacements(reps);
  };

  const handleCopyResult = async () => {
    if (outputText) {
      await navigator.clipboard.writeText(outputText);
    }
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
    setSearchTerm('');
    setReplaceTerm('');
    setMatches(0);
    setReplacements(0);
    setStats({ totalMatches: 0, replacementsMade: 0, searchTime: 0 });
  };

  // Update matches count when search term or options change
  useEffect(() => {
    const count = findMatches(inputText, searchTerm);
    setMatches(count);
  }, [inputText, searchTerm, caseSensitive, wholeWord, useRegex]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400">
          <Search size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Find & Replace</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Search and replace text with advanced options and regex support</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Input Text</h2>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter the text you want to search and replace in..."
            className="w-full h-64 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />

          {/* Search and Replace Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Find
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter text to find..."
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Replace with
              </label>
              <input
                type="text"
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
                placeholder="Enter replacement text..."
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Settings size={20} />
              Options
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Case sensitive</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={wholeWord}
                  onChange={(e) => setWholeWord(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Whole words only</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useRegex}
                  onChange={(e) => setUseRegex(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Use regex</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={multiline}
                  onChange={(e) => setMultiline(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Multiline</span>
              </label>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleReplace}
            disabled={!inputText.trim() || !searchTerm}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            <Replace size={16} />
            Replace All
          </button>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Result</h2>
            {outputText && (
              <button
                onClick={handleCopyResult}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Copy size={14} />
                Copy
              </button>
            )}
          </div>

          <div className="h-64 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
            {outputText ? (
              <div className="p-4 h-full overflow-y-auto">
                <pre className="whitespace-pre-wrap text-slate-900 dark:text-slate-100 font-sans text-sm leading-relaxed">
                  {outputText}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                <div className="text-center">
                  <Replace size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Replaced text will appear here</p>
                </div>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
            <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">Search & Replace Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-600 dark:text-slate-400">Matches Found</div>
                <div className="font-medium text-indigo-600 dark:text-indigo-400">{matches}</div>
              </div>
              <div>
                <div className="text-slate-600 dark:text-slate-400">Replacements Made</div>
                <div className="font-medium text-green-600 dark:text-green-400">{replacements}</div>
              </div>
              <div>
                <div className="text-slate-600 dark:text-slate-400">Processing Time</div>
                <div className="font-medium">{stats.searchTime.toFixed(2)}ms</div>
              </div>
              <div>
                <div className="text-slate-600 dark:text-slate-400">Success Rate</div>
                <div className="font-medium">
                  {matches > 0 ? Math.round((replacements / matches) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Regex Help */}
      {useRegex && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
            <AlertCircle size={16} />
            Regex Quick Reference
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-yellow-700 dark:text-yellow-300">
            <div><code>\b</code> - Word boundary</div>
            <div><code>\d</code> - Digit</div>
            <div><code>\w</code> - Word character</div>
            <div><code>.</code> - Any character</div>
            <div><code>*</code> - Zero or more</div>
            <div><code>+</code> - One or more</div>
            <div><code>?</code> - Zero or one</div>
            <div><code>[]</code> - Character class</div>
          </div>
        </div>
      )}

      {/* Features Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">🔍 Find & Replace Features</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• <strong>Advanced Search</strong> - Case sensitive, whole word, and regex support</li>
          <li>• <strong>Bulk Operations</strong> - Replace all matches at once</li>
          <li>• <strong>Real-time Preview</strong> - See match count as you type</li>
          <li>• <strong>Performance Metrics</strong> - Processing time and success statistics</li>
          <li>• <strong>Copy Results</strong> - Easily copy modified text for use elsewhere</li>
        </ul>
      </div>
    </div>
  );
};

export default FindReplace;
