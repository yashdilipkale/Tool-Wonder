import React, { useState, useEffect } from 'react';
import { Palette, Copy, RotateCcw, Settings, Zap, BarChart3, FileText } from 'lucide-react';

const CSSMinifier: React.FC = () => {
  const [inputCSS, setInputCSS] = useState<string>(`/* Example CSS */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header {
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 16px;
  text-align: center;
}

.button {
  display: inline-block;
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .header {
    font-size: 20px;
  }
}`);
  const [minifiedCSS, setMinifiedCSS] = useState<string>('');
  const [isMinifying, setIsMinifying] = useState<boolean>(false);

  // Options
  const [removeComments, setRemoveComments] = useState<boolean>(true);
  const [removeWhitespace, setRemoveWhitespace] = useState<boolean>(true);
  const [shortenColors, setShortenColors] = useState<boolean>(true);
  const [removeEmptyRules, setRemoveEmptyRules] = useState<boolean>(true);
  const [compressNumbers, setCompressNumbers] = useState<boolean>(true);

  // Statistics
  const [stats, setStats] = useState<{
    originalSize: number;
    minifiedSize: number;
    compressionRatio: number;
    savings: number;
    savingsPercentage: number;
  }>({ originalSize: 0, minifiedSize: 0, compressionRatio: 0, savings: 0, savingsPercentage: 0 });

  const minifyCSS = (css: string): string => {
    if (!css.trim()) return css;

    let minified = css;

    // Remove comments
    if (removeComments) {
      minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    // Remove whitespace
    if (removeWhitespace) {
      // Remove leading/trailing whitespace
      minified = minified.trim();
      // Remove extra whitespace around selectors, properties, and values
      minified = minified.replace(/\s*{\s*/g, '{');
      minified = minified.replace(/\s*}\s*/g, '}');
      minified = minified.replace(/\s*;\s*/g, ';');
      minified = minified.replace(/\s*,\s*/g, ',');
      minified = minified.replace(/\s*:\s*/g, ':');
      // Remove multiple spaces
      minified = minified.replace(/\s+/g, ' ');
      // Remove spaces around certain characters
      minified = minified.replace(/\s*>\s*/g, '>');
      minified = minified.replace(/\s*\+\s*/g, '+');
      minified = minified.replace(/\s*~\s*/g, '~');
      minified = minified.replace(/\s*\|\s*/g, '|');
    }

    // Shorten colors
    if (shortenColors) {
      // Convert #ffffff to #fff, #000000 to #000, etc.
      minified = minified.replace(/#([a-fA-F0-9])\1([a-fA-F0-9])\2([a-fA-F0-9])\3/g, '#$1$2$3');
      // Convert rgb/rgba to shorter forms where possible
      minified = minified.replace(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*1)?\)/g, 'rgb($1,$2,$3)');
    }

    // Remove empty rules
    if (removeEmptyRules) {
      minified = minified.replace(/[^{}]+\{\s*\}/g, '');
    }

    // Compress numbers
    if (compressNumbers) {
      // Remove unnecessary leading zeros
      minified = minified.replace(/(:|\s)0+\.(\d)/g, '$1.$2');
      // Convert 0px to 0
      minified = minified.replace(/(\d)px/g, '$1');
      // But keep 0px for cases where it's needed
      minified = minified.replace(/(\d)(?=\w)/g, '$1px');
    }

    // Final cleanup
    minified = minified.trim();

    return minified;
  };

  useEffect(() => {
    if (inputCSS) {
      setIsMinifying(true);
      const timeoutId = setTimeout(() => {
        const minified = minifyCSS(inputCSS);
        setMinifiedCSS(minified);

        // Calculate statistics
        const originalSize = new Blob([inputCSS]).size;
        const minifiedSize = new Blob([minified]).size;
        const compressionRatio = originalSize > 0 ? (minifiedSize / originalSize) : 0;
        const savings = originalSize - minifiedSize;
        const savingsPercentage = originalSize > 0 ? ((savings / originalSize) * 100) : 0;

        setStats({
          originalSize,
          minifiedSize,
          compressionRatio,
          savings,
          savingsPercentage
        });

        setIsMinifying(false);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setMinifiedCSS('');
      setStats({ originalSize: 0, minifiedSize: 0, compressionRatio: 0, savings: 0, savingsPercentage: 0 });
    }
  }, [inputCSS, removeComments, removeWhitespace, shortenColors, removeEmptyRules, compressNumbers]);

  const handleCopyMinified = async () => {
    if (minifiedCSS) {
      await navigator.clipboard.writeText(minifiedCSS);
    }
  };

  const handleReset = () => {
    setInputCSS(`/* Example CSS */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header {
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 16px;
  text-align: center;
}

.button {
  display: inline-block;
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .header {
    font-size: 20px;
  }
}`);
    setMinifiedCSS('');
    setStats({ originalSize: 0, minifiedSize: 0, compressionRatio: 0, savings: 0, savingsPercentage: 0 });
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full text-pink-600 dark:text-pink-400">
          <Palette size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">CSS Minifier</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Minify and optimize CSS code for production use</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FileText size={20} />
              Input CSS
            </h2>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {inputCSS.split('\n').length} lines • {formatBytes(stats.originalSize)}
            </div>
          </div>

          <textarea
            value={inputCSS}
            onChange={(e) => setInputCSS(e.target.value)}
            placeholder="Enter your CSS code here..."
            className="w-full h-80 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm resize-none"
          />

          {/* Minification Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Settings size={20} />
              Minification Options
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={removeComments}
                  onChange={(e) => setRemoveComments(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Remove comments</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={removeWhitespace}
                  onChange={(e) => setRemoveWhitespace(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Remove whitespace</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={shortenColors}
                  onChange={(e) => setShortenColors(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Shorten colors</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={removeEmptyRules}
                  onChange={(e) => setRemoveEmptyRules(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Remove empty rules</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={compressNumbers}
                  onChange={(e) => setCompressNumbers(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Compress numbers</span>
              </label>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw size={16} className="inline mr-2" />
              Reset
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Zap size={20} />
              Minified CSS
            </h2>
            {minifiedCSS && (
              <button
                onClick={handleCopyMinified}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Copy size={14} />
                Copy
              </button>
            )}
          </div>

          <div className="h-80 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            {isMinifying ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-600 border-t-transparent"></div>
              </div>
            ) : minifiedCSS ? (
              <div className="p-4 h-full overflow-y-auto">
                <pre className="whitespace-pre-wrap text-slate-900 dark:text-slate-100 font-mono text-sm leading-relaxed break-all">
                  {minifiedCSS}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                <div className="text-center">
                  <Zap size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Minified CSS will appear here</p>
                  <p className="text-sm mt-2">Add CSS in the input section</p>
                </div>
              </div>
            )}
          </div>

          {/* Statistics */}
          {minifiedCSS && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                <BarChart3 size={16} />
                Compression Statistics
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-600 dark:text-slate-400">Original Size</div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">{formatBytes(stats.originalSize)}</div>
                </div>
                <div>
                  <div className="text-slate-600 dark:text-slate-400">Minified Size</div>
                  <div className="font-medium text-green-600">{formatBytes(stats.minifiedSize)}</div>
                </div>
                <div>
                  <div className="text-slate-600 dark:text-slate-400">Space Saved</div>
                  <div className="font-medium text-blue-600">{formatBytes(stats.savings)}</div>
                </div>
                <div>
                  <div className="text-slate-600 dark:text-slate-400">Compression Ratio</div>
                  <div className="font-medium text-purple-600">{(stats.compressionRatio * 100).toFixed(1)}%</div>
                </div>
                <div className="col-span-2">
                  <div className="text-slate-600 dark:text-slate-400">Savings</div>
                  <div className="font-medium text-green-600 text-lg">{stats.savingsPercentage.toFixed(1)}% reduction</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">🎨 CSS Minification Features</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• <strong>Comment Removal</strong> - Strip all CSS comments for cleaner code</li>
          <li>• <strong>Whitespace Optimization</strong> - Remove unnecessary spaces and line breaks</li>
          <li>• <strong>Color Shortening</strong> - Convert hex colors to shorter forms (#ffffff → #fff)</li>
          <li>• <strong>Rule Cleanup</strong> - Remove empty CSS rules and declarations</li>
          <li>• <strong>Number Compression</strong> - Optimize numeric values and units</li>
        </ul>
      </div>
    </div>
  );
};

export default CSSMinifier;
