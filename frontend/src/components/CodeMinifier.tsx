import React, { useState } from 'react';
import { FileCode, Copy, Download } from 'lucide-react';

const CodeMinifier: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [type, setType] = useState<'html' | 'css' | 'js'>('js');
  const [error, setError] = useState('');

  const minifyCode = () => {
    setError('');
    try {
      let minified = '';

      switch (type) {
        case 'html':
          // Basic HTML minification: remove extra whitespace and newlines
          minified = input
            .replace(/\s+/g, ' ')
            .replace(/>\s+</g, '><')
            .trim();
          break;
        case 'css':
          // Basic CSS minification: remove comments, extra whitespace
          minified = input
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s+/g, ' ')
            .replace(/;\s*}/g, '}')
            .replace(/{\s*/g, '{')
            .replace(/;\s*/g, ';')
            .trim();
          break;
        case 'js':
          // Basic JS minification: remove comments, extra whitespace
          minified = input
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
            .replace(/\/\/.*$/gm, '') // Remove line comments
            .replace(/\s+/g, ' ')
            .replace(/;\s*}/g, '}')
            .replace(/{\s*/g, '{')
            .replace(/;\s*/g, ';')
            .trim();
          break;
      }

      setOutput(minified);
    } catch (err) {
      setError('Error minifying code');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = output;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minified.${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <FileCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Code Minifier</h2>
          <p className="text-slate-600 dark:text-slate-400">Minify HTML, CSS, and JavaScript code</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Type Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Code Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'html' | 'css' | 'js')}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="js">JavaScript</option>
            <option value="css">CSS</option>
            <option value="html">HTML</option>
          </select>
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Input Code
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your ${type.toUpperCase()} code here...`}
            className="w-full h-40 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Minify Button */}
        <button
          onClick={minifyCode}
          disabled={!input.trim()}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          Minify Code
        </button>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Minified Output
              </label>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-700 dark:text-slate-300"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={downloadFile}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-700 dark:text-slate-300"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-40 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm resize-vertical"
            />
            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Original: {input.length} characters | Minified: {output.length} characters | Saved: {input.length - output.length} characters ({input.length > 0 ? Math.round((1 - output.length / input.length) * 100) : 0}% reduction)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeMinifier;
