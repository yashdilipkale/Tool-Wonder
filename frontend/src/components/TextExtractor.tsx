import React, { useState, useEffect } from 'react';
import { Regex, Copy, RotateCcw, Search, Filter, Hash, Target } from 'lucide-react';

const TextExtractor: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [pattern, setPattern] = useState<string>('');
  const [extractedResults, setExtractedResults] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  // Options
  const [useRegex, setUseRegex] = useState<boolean>(false);
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [multiline, setMultiline] = useState<boolean>(false);
  const [uniqueOnly, setUniqueOnly] = useState<boolean>(false);
  const [maxResults, setMaxResults] = useState<number>(100);

  // Statistics
  const [stats, setStats] = useState<{
    totalMatches: number;
    uniqueMatches: number;
    patternLength: number;
    processingTime: number;
  }>({ totalMatches: 0, uniqueMatches: 0, patternLength: 0, processingTime: 0 });

  const extractText = (text: string, searchPattern: string): string[] => {
    if (!searchPattern.trim()) return [];

    const startTime = performance.now();

    try {
      let flags = 'g';
      if (!caseSensitive) flags += 'i';
      if (multiline) flags += 'm';

      let regex: RegExp;
      if (useRegex) {
        regex = new RegExp(searchPattern, flags);
      } else {
        // Escape special regex characters for literal search
        const escaped = searchPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        regex = new RegExp(escaped, flags);
      }

      const matches = text.match(regex) || [];

      // Apply unique filter if requested
      let results = uniqueOnly ? [...new Set(matches)] : matches;

      // Limit results
      results = results.slice(0, maxResults);

      const endTime = performance.now();
      setStats({
        totalMatches: matches.length,
        uniqueMatches: uniqueOnly ? results.length : new Set(matches).size,
        patternLength: searchPattern.length,
        processingTime: endTime - startTime
      });

      return results;
    } catch (error) {
      setStats({
        totalMatches: 0,
        uniqueMatches: 0,
        patternLength: searchPattern.length,
        processingTime: 0
      });
      return [];
    }
  };

  useEffect(() => {
    if (inputText && pattern) {
      setIsExtracting(true);
      // Small delay to prevent excessive processing
      const timeoutId = setTimeout(() => {
        const results = extractText(inputText, pattern);
        setExtractedResults(results);
        setIsExtracting(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setExtractedResults([]);
      setStats({ totalMatches: 0, uniqueMatches: 0, patternLength: 0, processingTime: 0 });
    }
  }, [inputText, pattern, useRegex, caseSensitive, multiline, uniqueOnly, maxResults]);

  const handleCopyResults = async () => {
    const resultsText = extractedResults.join('\n');
    if (resultsText) {
      await navigator.clipboard.writeText(resultsText);
    }
  };

  const handleReset = () => {
    setInputText('');
    setPattern('');
    setExtractedResults([]);
    setStats({ totalMatches: 0, uniqueMatches: 0, patternLength: 0, processingTime: 0 });
  };

  const commonPatterns = [
    { label: 'Email Addresses', pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b', description: 'Extract email addresses' },
    { label: 'URLs', pattern: 'https?://(?:[-\\w.]|(?:%[\\da-fA-F]{2}))+', description: 'Extract web URLs' },
    { label: 'Phone Numbers', pattern: '\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b', description: 'Extract US phone numbers' },
    { label: 'Dates (MM/DD/YYYY)', pattern: '\\b\\d{1,2}/\\d{1,2}/\\d{4}\\b', description: 'Extract dates in MM/DD/YYYY format' },
    { label: 'Numbers', pattern: '\\b\\d+\\.?\\d*\\b', description: 'Extract all numbers' },
    { label: 'Hashtags', pattern: '#\\w+', description: 'Extract hashtags' },
    { label: 'Mentions', pattern: '@\\w+', description: 'Extract @mentions' },
    { label: 'IP Addresses', pattern: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b', description: 'Extract IP addresses' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
          <Regex size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Text Extractor</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Extract specific patterns and data from text using regex or literal search</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Input Text</h2>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter the text you want to extract data from..."
            className="w-full h-64 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />

          {/* Pattern Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Search Pattern
              </label>
              <div className="flex items-center gap-2">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={useRegex}
                    onChange={(e) => setUseRegex(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300">Regex</span>
                </label>
              </div>
            </div>

            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder={useRegex ? "Enter regex pattern (e.g., \\b\\w+\\b)" : "Enter text to search for..."}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Options</h3>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Case sensitive</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={multiline}
                  onChange={(e) => setMultiline(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Multiline</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={uniqueOnly}
                  onChange={(e) => setUniqueOnly(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Unique only</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Max Results: {maxResults}
              </label>
              <input
                type="range"
                min="10"
                max="1000"
                value={maxResults}
                onChange={(e) => setMaxResults(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>10</span>
                <span>1000</span>
              </div>
            </div>
          </div>

          {/* Common Patterns */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Common Patterns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {commonPatterns.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setPattern(item.pattern);
                    setUseRegex(true);
                  }}
                  className="p-3 text-left rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-500 transition-colors"
                >
                  <div className="font-medium text-sm text-slate-800 dark:text-slate-200">{item.label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Target size={20} />
              Extracted Results ({extractedResults.length})
            </h2>
            {extractedResults.length > 0 && (
              <button
                onClick={handleCopyResults}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Copy size={14} />
                Copy All
              </button>
            )}
          </div>

          <div className="h-64 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
            {isExtracting ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
              </div>
            ) : extractedResults.length > 0 ? (
              <div className="p-4 h-full overflow-y-auto">
                <div className="space-y-2">
                  {extractedResults.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800"
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-600 text-white text-xs font-bold rounded-full">
                        {index + 1}
                      </span>
                      <span className="font-mono text-sm text-slate-900 dark:text-slate-100 flex-1">
                        {result}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                <div className="text-center">
                  <Search size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Extracted matches will appear here</p>
                  <p className="text-sm mt-2">Enter text and a search pattern above</p>
                </div>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
            <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">Extraction Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Hash className="text-purple-600" size={16} />
                <span className="text-slate-600 dark:text-slate-400">Total Matches:</span>
                <span className="font-medium text-purple-600">{stats.totalMatches}</span>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-blue-600" size={16} />
                <span className="text-slate-600 dark:text-slate-400">Unique Matches:</span>
                <span className="font-medium text-blue-600">{stats.uniqueMatches}</span>
              </div>
              <div className="flex items-center gap-2">
                <Regex className="text-green-600" size={16} />
                <span className="text-slate-600 dark:text-slate-400">Pattern Length:</span>
                <span className="font-medium text-green-600">{stats.patternLength}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="text-orange-600" size={16} />
                <span className="text-slate-600 dark:text-slate-400">Processing Time:</span>
                <span className="font-medium text-orange-600">{stats.processingTime.toFixed(2)}ms</span>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw size={16} className="inline mr-2" />
            Reset All
          </button>
        </div>
      </div>

      {/* Regex Help */}
      {useRegex && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
            <Regex size={16} />
            Regex Quick Reference
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-700 dark:text-blue-300">
            <div><code>\d</code> - Digit</div>
            <div><code>\w</code> - Word character</div>
            <div><code>\s</code> - Whitespace</div>
            <div><code>.</code> - Any character</div>
            <div><code>*</code> - Zero or more</div>
            <div><code>+</code> - One or more</div>
            <div><code>?</code> - Zero or one</div>
            <div><code>[]</code> - Character class</div>
            <div><code>\b</code> - Word boundary</div>
            <div><code>^</code> - Start of line</div>
            <div><code>$</code> - End of line</div>
            <div><code>()</code> - Capture group</div>
          </div>
        </div>
      )}

      {/* Features Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">🔍 Text Extraction Features</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• <strong>Regex Support</strong> - Full regular expression pattern matching</li>
          <li>• <strong>Common Patterns</strong> - Pre-built patterns for emails, URLs, phones, etc.</li>
          <li>• <strong>Flexible Options</strong> - Case sensitivity, multiline, and uniqueness filters</li>
          <li>• <strong>Real-time Extraction</strong> - Instant results as you type</li>
          <li>• <strong>Performance Metrics</strong> - Processing time and match statistics</li>
        </ul>
      </div>
    </div>
  );
};

export default TextExtractor;
