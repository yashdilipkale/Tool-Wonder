import React, { useState } from 'react';
import { Brackets, Copy, Download, CheckCircle, XCircle } from 'lucide-react';

const JSONFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [indentSize, setIndentSize] = useState(2);

  const formatJSON = () => {
    setError('');
    setIsValid(null);
    if (!input.trim()) {
      setError('Please enter JSON to format');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      setIsValid(true);
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message);
      setIsValid(false);
      setOutput('');
    }
  };

  const minifyJSON = () => {
    setError('');
    setIsValid(null);
    if (!input.trim()) {
      setError('Please enter JSON to minify');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message);
      setIsValid(false);
      setOutput('');
    }
  };

  const validateJSON = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter JSON to validate');
      setIsValid(null);
      return;
    }

    try {
      JSON.parse(input);
      setIsValid(true);
      setError('');
    } catch (err) {
      setIsValid(false);
      setError('Invalid JSON: ' + (err as Error).message);
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
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    setIsValid(null);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Brackets className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">JSON Formatter</h2>
          <p className="text-slate-600 dark:text-slate-400">Validate, format, and minify JSON data</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            JSON Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-full h-40 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={formatJSON}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Format JSON
          </button>
          <button
            onClick={minifyJSON}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Minify JSON
          </button>
          <button
            onClick={validateJSON}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Validate Only
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Indent Size */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Indent Size:
          </label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 space</option>
          </select>
        </div>

        {/* Validation Status */}
        {isValid !== null && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${isValid ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
            {isValid ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <span className={`text-sm font-medium ${isValid ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {isValid ? 'Valid JSON' : 'Invalid JSON'}
            </span>
          </div>
        )}

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
                Formatted Output
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
              Characters: {output.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JSONFormatter;
