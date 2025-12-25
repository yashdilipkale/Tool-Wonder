import React, { useState, useEffect } from 'react';
import { Regex, Copy, CheckCircle, XCircle, Info } from 'lucide-react';

const RegexTester: React.FC = () => {
  const [regexPattern, setRegexPattern] = useState('');
  const [testString, setTestString] = useState('Hello World 123');
  const [flags, setFlags] = useState({
    global: true,
    caseInsensitive: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false
  });
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState('');
  const [isValidRegex, setIsValidRegex] = useState<boolean | null>(null);

  // Common regex patterns
  const commonPatterns = [
    { name: 'Email', pattern: '^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$' },
    { name: 'URL', pattern: 'https?://[\\w.-]+\\.[a-zA-Z]{2,}[\\w./?=&%-]*' },
    { name: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}' },
    { name: 'Date (MM/DD/YYYY)', pattern: '\\d{1,2}/\\d{1,2}/\\d{4}' },
    { name: 'IP Address', pattern: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b' },
    { name: 'Numbers', pattern: '\\d+' },
    { name: 'Words', pattern: '\\b\\w+\\b' },
    { name: 'Hex Color', pattern: '#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}' },
    { name: 'Credit Card', pattern: '\\b\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}\\b' },
    { name: 'ZIP Code', pattern: '\\b\\d{5}(-\\d{4})?\\b' }
  ];

  const testRegex = () => {
    setError('');
    setIsValidRegex(null);
    setMatches([]);

    if (!regexPattern.trim()) {
      setError('Please enter a regex pattern');
      return;
    }

    try {
      const flagString = Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([flag]) => flag.charAt(0))
        .join('');

      const regex = new RegExp(regexPattern, flagString);

      if (flags.global) {
        const globalMatches = [...testString.matchAll(regex)];
        setMatches(globalMatches);
      } else {
        const match = regex.exec(testString);
        if (match) {
          setMatches([match]);
        }
      }

      setIsValidRegex(true);
    } catch (err) {
      setError('Invalid regex pattern: ' + (err as Error).message);
      setIsValidRegex(false);
    }
  };

  useEffect(() => {
    if (regexPattern.trim()) {
      testRegex();
    }
  }, [regexPattern, testString, flags]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const highlightMatches = (text: string, matches: RegExpMatchArray[]) => {
    if (matches.length === 0) return text;

    let result = text;
    let offset = 0;

    matches.forEach((match, index) => {
      const start = match.index! + offset;
      const end = start + match[0].length;
      const before = result.slice(0, start);
      const highlighted = `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${match[0]}</mark>`;
      const after = result.slice(end);

      result = before + highlighted + after;
      offset += highlighted.length - match[0].length;
    });

    return result;
  };

  const toggleFlag = (flag: keyof typeof flags) => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
  };

  const loadPattern = (pattern: string) => {
    setRegexPattern(pattern);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Regex className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Regex Tester</h2>
          <p className="text-slate-600 dark:text-slate-400">Test and debug regular expressions with live matching</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Regex Pattern */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Regex Pattern
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={regexPattern}
              onChange={(e) => setRegexPattern(e.target.value)}
              placeholder="Enter regex pattern (e.g., \d+)"
              className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => copyToClipboard(regexPattern)}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-700 dark:text-slate-300"
              title="Copy regex pattern"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Flags */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Flags
          </label>
          <div className="flex flex-wrap gap-3">
            {Object.entries(flags).map(([flag, enabled]) => (
              <label key={flag} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => toggleFlag(flag as keyof typeof flags)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {flag === 'global' && 'Global (g)'}
                  {flag === 'caseInsensitive' && 'Case Insensitive (i)'}
                  {flag === 'multiline' && 'Multiline (m)'}
                  {flag === 'dotAll' && 'Dot All (s)'}
                  {flag === 'unicode' && 'Unicode (u)'}
                  {flag === 'sticky' && 'Sticky (y)'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Test String */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Test String
          </label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test regex against..."
            className="w-full h-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Common Patterns */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Common Patterns
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {commonPatterns.map((pattern) => (
              <button
                key={pattern.name}
                onClick={() => loadPattern(pattern.pattern)}
                className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-700 dark:text-slate-300 truncate"
                title={pattern.pattern}
              >
                {pattern.name}
              </button>
            ))}
          </div>
        </div>

        {/* Validation Status */}
        {isValidRegex !== null && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${isValidRegex ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
            {isValidRegex ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <span className={`text-sm font-medium ${isValidRegex ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {isValidRegex ? 'Valid regex pattern' : 'Invalid regex pattern'}
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        {isValidRegex && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Results</h3>

            {/* Match Count */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <strong>{matches.length}</strong> match{matches.length !== 1 ? 'es' : ''} found
              </div>
            </div>

            {/* Highlighted Text */}
            {matches.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Highlighted Matches
                </label>
                <div
                  className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 font-mono text-sm whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: highlightMatches(testString, matches)
                  }}
                />
              </div>
            )}

            {/* Match Details */}
            {matches.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Match Details
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {matches.map((match, index) => (
                    <div key={index} className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700">
                      <div className="text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            Match {index + 1} (at position {match.index})
                          </span>
                          <button
                            onClick={() => copyToClipboard(match[0])}
                            className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-slate-700 dark:text-slate-300"
                          >
                            Copy
                          </button>
                        </div>
                        <div className="font-mono text-slate-900 dark:text-white bg-white dark:bg-slate-600 p-2 rounded border">
                          "{match[0]}"
                        </div>
                        {match.length > 1 && (
                          <div className="mt-2">
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Capture Groups:</div>
                            {Array.from(match).slice(1).map((group, groupIndex) => (
                              <div key={groupIndex} className="text-xs font-mono bg-white dark:bg-slate-600 p-1 rounded border mt-1">
                                Group {groupIndex + 1}: "{group}"
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Regex Flags
          </h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p><strong>g (Global):</strong> Find all matches, not just the first</p>
            <p><strong>i (Case Insensitive):</strong> Ignore case differences</p>
            <p><strong>m (Multiline):</strong> ^ and $ match line starts/ends</p>
            <p><strong>s (Dot All):</strong> . matches newlines</p>
            <p><strong>u (Unicode):</strong> Treat pattern as Unicode code points</p>
            <p><strong>y (Sticky):</strong> Matches only from lastIndex position</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegexTester;
