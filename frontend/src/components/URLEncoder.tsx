import React, { useState } from 'react';
import { Link, Copy, Download, ArrowRightLeft, CheckCircle, XCircle } from 'lucide-react';

const URLEncoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const encodeURL = () => {
    setError('');
    setIsValid(null);
    if (!input.trim()) {
      setError('Please enter URL to encode');
      return;
    }

    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      setIsValid(true);
    } catch (err) {
      setError('Error encoding URL');
      setIsValid(false);
    }
  };

  const decodeURL = () => {
    setError('');
    setIsValid(null);
    if (!input.trim()) {
      setError('Please enter URL to decode');
      return;
    }

    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      setIsValid(true);
    } catch (err) {
      setError('Invalid URL encoding: ' + (err as Error).message);
      setIsValid(false);
      setOutput('');
    }
  };

  const convert = () => {
    if (mode === 'encode') {
      encodeURL();
    } else {
      decodeURL();
    }
  };

  const swapMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
    setError('');
    setIsValid(null);
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
    a.download = mode === 'encode' ? 'encoded-url.txt' : 'decoded-url.txt';
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

  const encodeURIComponentCompletely = () => {
    setError('');
    setIsValid(null);
    if (!input.trim()) {
      setError('Please enter URL to encode');
      return;
    }

    try {
      // Encode all characters including those normally allowed in URIs
      const encoded = encodeURI(input);
      setOutput(encoded);
      setIsValid(true);
    } catch (err) {
      setError('Error encoding URL');
      setIsValid(false);
    }
  };

  const decodeURIComponentCompletely = () => {
    setError('');
    setIsValid(null);
    if (!input.trim()) {
      setError('Please enter URL to decode');
      return;
    }

    try {
      const decoded = decodeURI(input);
      setOutput(decoded);
      setIsValid(true);
    } catch (err) {
      setError('Invalid URI encoding: ' + (err as Error).message);
      setIsValid(false);
      setOutput('');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Link className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">URL Encoder</h2>
          <p className="text-slate-600 dark:text-slate-400">Encode or decode URLs for safe usage</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Mode Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="encode"
              name="mode"
              checked={mode === 'encode'}
              onChange={() => setMode('encode')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="encode" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Encode URL
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="decode"
              name="mode"
              checked={mode === 'decode'}
              onChange={() => setMode('decode')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="decode" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Decode URL
            </label>
          </div>
          <button
            onClick={swapMode}
            className="ml-auto flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-700 dark:text-slate-300"
            title="Swap input and output"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Swap
          </button>
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {mode === 'encode' ? 'URL Input' : 'Encoded URL Input'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter URL to encode...' : 'Enter encoded URL to decode...'}
            className="w-full h-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={convert}
            disabled={!input.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
          </button>
          {mode === 'encode' && (
            <button
              onClick={encodeURIComponentCompletely}
              disabled={!input.trim()}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Encode URI
            </button>
          )}
          {mode === 'decode' && (
            <button
              onClick={decodeURIComponentCompletely}
              disabled={!input.trim()}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Decode URI
            </button>
          )}
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Clear All
          </button>
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
              {isValid ? (mode === 'encode' ? 'Successfully encoded' : 'Successfully decoded') : 'Operation failed'}
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
                {mode === 'encode' ? 'Encoded URL' : 'Decoded URL'}
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
              className="w-full h-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm resize-vertical"
            />
            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Characters: {output.length} | Bytes: {new Blob([output]).size}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">URL Encoding Info</h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p><strong>encodeURIComponent:</strong> Encodes all characters except A-Z a-z 0-9 - _ . ! ~ * ' ( )</p>
            <p><strong>encodeURI:</strong> Encodes characters that have special meaning in URIs</p>
            <p><strong>decodeURIComponent/decodeURI:</strong> Corresponding decoding functions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLEncoder;
