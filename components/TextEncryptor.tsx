import React, { useState } from 'react';
import { Copy, Download, RotateCcw, Lock, Unlock, Key } from 'lucide-react';

const TextEncryptor: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [algorithm, setAlgorithm] = useState<'caesar' | 'vigenere' | 'base64'>('caesar');
  const [key, setKey] = useState<string>('3');
  const [stats, setStats] = useState<{
    originalLength: number;
    processedLength: number;
    keyUsed: string;
  } | null>(null);

  const caesarCipher = (text: string, shift: number, decrypt: boolean = false): string => {
    const actualShift = decrypt ? (26 - shift) % 26 : shift % 26;
    return text.replace(/[a-zA-Z]/g, (char) => {
      const base = char >= 'a' ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
      return String.fromCharCode(((char.charCodeAt(0) - base + actualShift) % 26) + base);
    });
  };

  const vigenereCipher = (text: string, keyword: string, decrypt: boolean = false): string => {
    const key = keyword.toUpperCase().replace(/[^A-Z]/g, '');
    if (!key) return text;

    let result = '';
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (/[a-zA-Z]/.test(char)) {
        const base = char >= 'a' ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
        const keyChar = key[keyIndex % key.length];
        const keyShift = keyChar.charCodeAt(0) - 'A'.charCodeAt(0);
        const shift = decrypt ? (26 - keyShift) % 26 : keyShift;

        result += String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
        keyIndex++;
      } else {
        result += char;
      }
    }

    return result;
  };

  const base64Encode = (text: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (e) {
      return 'Encoding failed';
    }
  };

  const base64Decode = (text: string): string => {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch (e) {
      return 'Decoding failed - invalid Base64';
    }
  };

  const processText = () => {
    if (!inputText.trim()) {
      setOutputText('');
      setStats(null);
      return;
    }

    let processed = '';
    const originalLength = inputText.length;

    switch (algorithm) {
      case 'caesar':
        const shift = parseInt(key) || 3;
        processed = caesarCipher(inputText, shift, mode === 'decrypt');
        break;
      case 'vigenere':
        processed = vigenereCipher(inputText, key, mode === 'decrypt');
        break;
      case 'base64':
        processed = mode === 'encrypt' ? base64Encode(inputText) : base64Decode(inputText);
        break;
    }

    setOutputText(processed);

    setStats({
      originalLength,
      processedLength: processed.length,
      keyUsed: algorithm === 'caesar' ? `Shift: ${key}` :
               algorithm === 'vigenere' ? `Key: ${key}` :
               'Base64'
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
    link.download = `${mode}ed_text_${algorithm}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetEncryptor = () => {
    setInputText('');
    setOutputText('');
    setMode('encrypt');
    setAlgorithm('caesar');
    setKey('3');
    setStats(null);
  };

  // Auto-process when inputs change
  React.useEffect(() => {
    processText();
  }, [inputText, mode, algorithm, key]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
            <Lock size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Text Encryptor</h2>
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
                rows={6}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Mode
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as 'encrypt' | 'decrypt')}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="encrypt">Encrypt</option>
                  <option value="decrypt">Decrypt</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Algorithm
                </label>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value as 'caesar' | 'vigenere' | 'base64')}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="caesar">Caesar Cipher</option>
                  <option value="vigenere">Vigenère Cipher</option>
                  <option value="base64">Base64</option>
                </select>
              </div>
            </div>

            {(algorithm === 'caesar' || algorithm === 'vigenere') && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {algorithm === 'caesar' ? 'Shift Value' : 'Keyword'}
                </label>
                <input
                  type={algorithm === 'caesar' ? 'number' : 'text'}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder={algorithm === 'caesar' ? '3' : 'Enter keyword'}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  min={algorithm === 'caesar' ? '0' : undefined}
                  max={algorithm === 'caesar' ? '25' : undefined}
                />
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {mode === 'encrypt' ? 'Encrypted' : 'Decrypted'} Text
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
                      className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
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
                rows={6}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white resize-none font-mono text-sm"
                placeholder="Processed text will appear here..."
              />
            </div>

            <button
              onClick={resetEncryptor}
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
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.originalLength}</div>
              <div className="text-sm text-blue-800 dark:text-blue-200">Input Length</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.processedLength}</div>
              <div className="text-sm text-green-800 dark:text-green-200">Output Length</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400 flex items-center justify-center gap-1">
                {mode === 'encrypt' ? <Lock size={20} /> : <Unlock size={20} />}
              </div>
              <div className="text-sm text-purple-800 dark:text-purple-200 capitalize">
                {mode}d
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                <Key size={20} />
              </div>
              <div className="text-sm text-orange-800 dark:text-orange-200 capitalize">
                {algorithm}
              </div>
            </div>
          </div>
        )}

        {/* Algorithm Information */}
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Encryption Algorithms</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white dark:bg-slate-600 rounded p-3">
              <div className="font-medium text-slate-900 dark:text-slate-100 mb-2">Caesar Cipher</div>
              <div className="text-slate-600 dark:text-slate-400 text-xs">
                Shifts each letter by a fixed number of positions in the alphabet.
                Simple substitution cipher with key (shift value).
              </div>
            </div>
            <div className="bg-white dark:bg-slate-600 rounded p-3">
              <div className="font-medium text-slate-900 dark:text-slate-100 mb-2">Vigenère Cipher</div>
              <div className="text-slate-600 dark:text-slate-400 text-xs">
                Uses a keyword to determine shift values for each character.
                Poly-alphabetic substitution cipher, more secure than Caesar.
              </div>
            </div>
            <div className="bg-white dark:bg-slate-600 rounded p-3">
              <div className="font-medium text-slate-900 dark:text-slate-100 mb-2">Base64</div>
              <div className="text-slate-600 dark:text-slate-400 text-xs">
                Encoding scheme that converts binary data to text format.
                Not encryption, but useful for safe text transmission.
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Security Notice</h3>
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            These ciphers are for educational purposes and basic text obfuscation. For secure encryption of sensitive data,
            use modern cryptographic standards like AES with proper key management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextEncryptor;
