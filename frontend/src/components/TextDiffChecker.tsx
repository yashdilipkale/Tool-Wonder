import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Copy, RotateCcw, Eye, SplitSquareHorizontal, FileText, Plus, Minus } from 'lucide-react';

interface DiffResult {
  type: 'add' | 'remove' | 'equal';
  value: string;
  lineNumber?: number;
}

const TextDiffChecker: React.FC = () => {
  const [text1, setText1] = useState<string>('');
  const [text2, setText2] = useState<string>('');
  const [diffResult, setDiffResult] = useState<DiffResult[]>([]);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('side-by-side');
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState<boolean>(false);
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);

  // Statistics
  const [stats, setStats] = useState<{
    additions: number;
    deletions: number;
    changes: number;
    similarity: number;
  }>({ additions: 0, deletions: 0, changes: 0, similarity: 100 });

  // Simple diff algorithm (in a real app, you might use a more sophisticated library like diff-match-patch)
  const computeDiff = (oldText: string, newText: string): DiffResult[] => {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');

    const result: DiffResult[] = [];
    let oldIndex = 0;
    let newIndex = 0;

    // Simple line-by-line comparison
    while (oldIndex < oldLines.length || newIndex < newLines.length) {
      const oldLine = oldLines[oldIndex] || '';
      const newLine = newLines[newIndex] || '';

      // Normalize for comparison if options are set
      const normalize = (text: string) => {
        let normalized = text;
        if (!caseSensitive) normalized = normalized.toLowerCase();
        if (ignoreWhitespace) normalized = normalized.replace(/\s+/g, ' ').trim();
        return normalized;
      };

      const normalizedOld = normalize(oldLine);
      const normalizedNew = normalize(newLine);

      if (oldIndex < oldLines.length && newIndex < newLines.length && normalizedOld === normalizedNew) {
        // Lines are equal
        result.push({ type: 'equal', value: oldLine, lineNumber: oldIndex + 1 });
        oldIndex++;
        newIndex++;
      } else if (oldIndex < oldLines.length && (newIndex >= newLines.length || normalizedOld !== normalizedNew)) {
        // Line removed from old text
        result.push({ type: 'remove', value: oldLine, lineNumber: oldIndex + 1 });
        oldIndex++;
      } else if (newIndex < newLines.length && (oldIndex >= oldLines.length || normalizedOld !== normalizedNew)) {
        // Line added to new text
        result.push({ type: 'add', value: newLine, lineNumber: newIndex + 1 });
        newIndex++;
      }
    }

    return result;
  };

  const analyzeDiff = (diff: DiffResult[]) => {
    let additions = 0;
    let deletions = 0;
    let totalLines = Math.max(text1.split('\n').length, text2.split('\n').length);
    let unchangedLines = 0;

    diff.forEach(item => {
      if (item.type === 'add') additions++;
      else if (item.type === 'remove') deletions++;
      else if (item.type === 'equal') unchangedLines++;
    });

    const changes = additions + deletions;
    const similarity = totalLines > 0 ? Math.round((unchangedLines / totalLines) * 100) : 100;

    setStats({ additions, deletions, changes, similarity });
  };

  useEffect(() => {
    if (text1 || text2) {
      const diff = computeDiff(text1, text2);
      setDiffResult(diff);
      analyzeDiff(diff);
    } else {
      setDiffResult([]);
      setStats({ additions: 0, deletions: 0, changes: 0, similarity: 100 });
    }
  }, [text1, text2, ignoreWhitespace, caseSensitive]);

  const handleCopyDiff = async () => {
    const diffText = diffResult.map(item => {
      const prefix = item.type === 'add' ? '+' : item.type === 'remove' ? '-' : ' ';
      return `${prefix} ${item.value}`;
    }).join('\n');

    if (diffText) {
      await navigator.clipboard.writeText(diffText);
    }
  };

  const handleReset = () => {
    setText1('');
    setText2('');
    setDiffResult([]);
    setStats({ additions: 0, deletions: 0, changes: 0, similarity: 100 });
  };

  const renderSideBySide = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left side - Original text */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <FileText size={20} />
          Original Text
        </h3>
        <div className="border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
          <div className="p-4 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-slate-900 dark:text-slate-100 font-mono text-sm leading-relaxed">
              {text1 || 'Enter original text here...'}
            </pre>
          </div>
        </div>
      </div>

      {/* Right side - Modified text */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <FileText size={20} />
          Modified Text
        </h3>
        <div className="border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
          <div className="p-4 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-slate-900 dark:text-slate-100 font-mono text-sm leading-relaxed">
              {text2 || 'Enter modified text here...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUnified = () => (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
        <ArrowRightLeft size={20} />
        Unified Diff View
      </h3>
      <div className="border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800/50">
        <div className="p-4 max-h-96 overflow-y-auto font-mono text-sm">
          {diffResult.length > 0 ? (
            diffResult.map((item, index) => (
              <div
                key={index}
                className={`py-1 px-2 rounded ${
                  item.type === 'add'
                    ? 'bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500'
                    : item.type === 'remove'
                    ? 'bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500'
                    : 'bg-white dark:bg-slate-700'
                }`}
              >
                <span className={`inline-block w-8 text-center ${
                  item.type === 'add' ? 'text-green-600' :
                  item.type === 'remove' ? 'text-red-600' : 'text-slate-400'
                }`}>
                  {item.type === 'add' ? '+' : item.type === 'remove' ? '-' : ' '}
                </span>
                {showLineNumbers && item.lineNumber && (
                  <span className="inline-block w-12 text-right text-slate-500 mr-2">
                    {item.lineNumber}
                  </span>
                )}
                <span className={
                  item.type === 'add' ? 'text-green-800 dark:text-green-200' :
                  item.type === 'remove' ? 'text-red-800 dark:text-red-200' :
                  'text-slate-900 dark:text-slate-100'
                }>
                  {item.value || ' '}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-500 dark:text-slate-400 py-8">
              <ArrowRightLeft size={48} className="mx-auto mb-4 opacity-50" />
              <p>Enter text in both fields to see differences</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full text-cyan-600 dark:text-cyan-400">
          <ArrowRightLeft size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Text Diff Checker</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Compare two texts and highlight differences with precision</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Text 1 Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Original Text
              </label>
              <textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="Enter the original text..."
                className="w-full h-32 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Text 2 Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Modified Text
              </label>
              <textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="Enter the modified text..."
                className="w-full h-32 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Options</h3>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={ignoreWhitespace}
                  onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Ignore whitespace</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Case sensitive</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showLineNumbers}
                  onChange={(e) => setShowLineNumbers(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Show line numbers</span>
              </label>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">View Mode</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'side-by-side'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <SplitSquareHorizontal size={16} />
                Side by Side
              </button>
              <button
                onClick={() => setViewMode('unified')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'unified'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <ArrowRightLeft size={16} />
                Unified
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCopyDiff}
              disabled={diffResult.length === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              <Copy size={16} />
              Copy Diff
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          {/* Statistics */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
            <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">Comparison Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Plus className="text-green-600" size={16} />
                <span className="text-slate-600 dark:text-slate-400">Additions:</span>
                <span className="font-medium text-green-600">{stats.additions}</span>
              </div>
              <div className="flex items-center gap-2">
                <Minus className="text-red-600" size={16} />
                <span className="text-slate-600 dark:text-slate-400">Deletions:</span>
                <span className="font-medium text-red-600">{stats.deletions}</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="text-cyan-600" size={16} />
                <span className="text-slate-600 dark:text-slate-400">Changes:</span>
                <span className="font-medium text-cyan-600">{stats.changes}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="text-blue-600" size={16} />
                <span className="text-slate-600 dark:text-slate-400">Similarity:</span>
                <span className="font-medium text-blue-600">{stats.similarity}%</span>
              </div>
            </div>
          </div>

          {/* Diff Display */}
          {viewMode === 'side-by-side' ? renderSideBySide() : renderUnified()}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">📊 Diff Legend</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded"></div>
            <span className="text-green-700 dark:text-green-300">Added lines (+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded"></div>
            <span className="text-red-700 dark:text-red-300">Removed lines (-)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded"></div>
            <span className="text-slate-700 dark:text-slate-300">Unchanged lines</span>
          </div>
        </div>
      </div>

      {/* Features Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">🔍 Text Diff Features</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• <strong>Line-by-line Comparison</strong> - Precise difference detection</li>
          <li>• <strong>Multiple View Modes</strong> - Side-by-side or unified diff display</li>
          <li>• <strong>Flexible Options</strong> - Case sensitivity and whitespace handling</li>
          <li>• <strong>Visual Indicators</strong> - Color-coded additions and deletions</li>
          <li>• <strong>Statistics</strong> - Detailed metrics on changes and similarity</li>
        </ul>
      </div>
    </div>
  );
};

export default TextDiffChecker;
