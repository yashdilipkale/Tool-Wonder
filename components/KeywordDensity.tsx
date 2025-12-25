import React, { useState, useEffect } from 'react';
import { BarChart, Copy, FileText, TrendingUp, AlertTriangle } from 'lucide-react';

interface KeywordData {
  word: string;
  count: number;
  density: number;
  length: number;
}

const KeywordDensity: React.FC = () => {
  const [text, setText] = useState('');
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [minWordLength, setMinWordLength] = useState(3);
  const [excludeCommon, setExcludeCommon] = useState(true);
  const [maxResults, setMaxResults] = useState(50);
  const [stats, setStats] = useState({
    totalWords: 0,
    uniqueWords: 0,
    totalChars: 0,
    avgWordLength: 0
  });

  // Common words to exclude
  const commonWords = new Set([
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'an', 'a', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
    'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
    'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its',
    'our', 'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how',
    'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
    'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
    'just', 'now', 'here', 'there', 'then', 'also', 'like', 'well', 'back',
    'even', 'still', 'way', 'much', 'many', 'said', 'says', 'let', 'put', 'end',
    'use', 'used', 'using', 'take', 'took', 'taken', 'give', 'gave', 'given',
    'work', 'works', 'worked', 'working', 'make', 'made', 'making', 'good',
    'better', 'best', 'bad', 'worse', 'worst', 'big', 'bigger', 'biggest',
    'small', 'smaller', 'smallest', 'long', 'longer', 'longest', 'short',
    'shorter', 'shortest', 'high', 'higher', 'highest', 'low', 'lower', 'lowest',
    'right', 'left', 'up', 'down', 'over', 'under', 'before', 'after', 'first',
    'last', 'next', 'new', 'old', 'young', 'full', 'empty', 'open', 'close',
    'hot', 'cold', 'warm', 'cool', 'fast', 'slow', 'quick', 'easy', 'hard',
    'soft', 'loud', 'quiet', 'happy', 'sad', 'angry', 'busy', 'free', 'sure',
    'ready', 'important', 'different', 'same', 'true', 'false', 'real', 'fake'
  ]);

  const analyzeText = () => {
    if (!text.trim()) {
      setKeywords([]);
      setStats({ totalWords: 0, uniqueWords: 0, totalChars: 0, avgWordLength: 0 });
      return;
    }

    // Clean and tokenize text
    const cleanText = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    let words = cleanText.split(' ').filter(word => word.length >= minWordLength);

    if (excludeCommon) {
      words = words.filter(word => !commonWords.has(word));
    }

    // Calculate statistics
    const totalChars = text.replace(/\s/g, '').length;
    const uniqueWords = new Set(words).size;
    const avgWordLength = words.length > 0 ? words.reduce((sum, word) => sum + word.length, 0) / words.length : 0;

    setStats({
      totalWords: words.length,
      uniqueWords,
      totalChars,
      avgWordLength: Math.round(avgWordLength * 100) / 100
    });

    // Count word frequencies
    const wordCount: { [key: string]: number } = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Calculate densities and create keyword data
    const keywordData: KeywordData[] = Object.entries(wordCount)
      .map(([word, count]) => ({
        word,
        count,
        density: (count / words.length) * 100,
        length: word.length
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, maxResults);

    setKeywords(keywordData);
  };

  useEffect(() => {
    analyzeText();
  }, [text, minWordLength, excludeCommon, maxResults]);

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

  const copyKeywords = async () => {
    const keywordText = keywords.map(k => `${k.word}: ${k.count} (${k.density.toFixed(2)}%)`).join('\n');
    await copyToClipboard(keywordText);
  };

  const clearText = () => {
    setText('');
  };

  const getDensityColor = (density: number) => {
    if (density >= 5) return 'text-red-600 dark:text-red-400';
    if (density >= 3) return 'text-orange-600 dark:text-orange-400';
    if (density >= 1) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getDensityBarWidth = (density: number) => {
    return Math.min((density / 10) * 100, 100); // Max 10% density = 100% bar width
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <BarChart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Keyword Density</h2>
          <p className="text-slate-600 dark:text-slate-400">Analyze keyword frequency in content</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Text Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Content to Analyze
            </label>
            <div className="flex gap-2">
              <button
                onClick={copyKeywords}
                disabled={keywords.length === 0}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:bg-slate-50 disabled:cursor-not-allowed rounded text-slate-700 dark:text-slate-300"
              >
                <Copy className="w-4 h-4" />
                Copy Results
              </button>
              <button
                onClick={clearText}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-700 dark:text-slate-300"
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your content here to analyze keyword density..."
            className="w-full h-40 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Min Word Length
            </label>
            <select
              value={minWordLength}
              onChange={(e) => setMinWordLength(Number(e.target.value))}
              className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-600 text-slate-900 dark:text-white text-sm"
            >
              <option value={1}>1+</option>
              <option value={2}>2+</option>
              <option value={3}>3+</option>
              <option value={4}>4+</option>
              <option value={5}>5+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Max Results
            </label>
            <select
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-600 text-slate-900 dark:text-white text-sm"
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={excludeCommon}
                onChange={(e) => setExcludeCommon(e.target.checked)}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Exclude common words</span>
            </label>
          </div>

          <div className="flex items-center">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {stats.totalWords} words total
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats.totalWords > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalWords.toLocaleString()}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Total Words</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.uniqueWords.toLocaleString()}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">Unique Words</div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.totalChars.toLocaleString()}
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Characters</div>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats.avgWordLength}
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300">Avg Word Length</div>
            </div>
          </div>
        )}

        {/* Keywords Table */}
        {keywords.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Keyword Analysis ({keywords.length} results)
            </h3>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {keywords.map((keyword, index) => (
                <div key={keyword.word} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400 w-8">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-white truncate">
                        {keyword.word}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        ({keyword.length} chars)
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getDensityBarWidth(keyword.density)}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 min-w-[60px]">
                        {keyword.density.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-bold ${getDensityColor(keyword.density)}`}>
                      {keyword.count}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      occurrences
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(keyword.word)}
                    className="p-1 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    title="Copy keyword"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {text.trim() && keywords.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              No keywords found matching your criteria.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              Try adjusting the minimum word length or including common words.
            </p>
          </div>
        )}

        {/* SEO Tips */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            SEO Keyword Density Guidelines
          </h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p><strong>Primary keyword:</strong> 1-2% density (ideal for SEO)</p>
            <p><strong>Secondary keywords:</strong> 0.5-1% density</p>
            <p><strong>Long-tail keywords:</strong> 0.3-0.7% density</p>
            <p><strong>Warning:</strong> Over 3-4% may trigger spam filters</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordDensity;
