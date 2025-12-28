import React, { useState } from 'react';
import { Zap, ArrowRightLeft, Copy, RefreshCw, CheckCircle } from 'lucide-react';

const MorseCodeConverter: React.FC = () => {
  const [mode, setMode] = useState<'text-to-morse' | 'morse-to-text'>('text-to-morse');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // Morse code mapping
  const morseCodeMap: { [key: string]: string } = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
    'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
    '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
    '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
    '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
    '$': '...-..-', '@': '.--.-.'
  };

  // Reverse mapping for Morse to text
  const textToMorseMap: { [key: string]: string } = {};
  for (const [char, morse] of Object.entries(morseCodeMap)) {
    textToMorseMap[morse] = char;
  }

  // Convert text to Morse code
  const textToMorse = (text: string): string => {
    return text.toUpperCase().split('').map(char => {
      if (char === ' ') return '/';
      return morseCodeMap[char] || char;
    }).join(' ');
  };

  // Convert Morse code to text
  const morseToText = (morse: string): string => {
    return morse.split(' ').map(code => {
      if (code === '/') return ' ';
      if (code === '') return '';
      return textToMorseMap[code] || code;
    }).join('');
  };

  // Handle conversion
  const handleConvert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    if (mode === 'text-to-morse') {
      setOutput(textToMorse(input));
    } else {
      setOutput(morseToText(input));
    }
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setInput(value);
    // Auto-convert if input is not empty
    if (value.trim()) {
      if (mode === 'text-to-morse') {
        setOutput(textToMorse(value));
      } else {
        setOutput(morseToText(value));
      }
    } else {
      setOutput('');
    }
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Swap mode
  const swapMode = () => {
    const newMode = mode === 'text-to-morse' ? 'morse-to-text' : 'text-to-morse';
    setMode(newMode);
    setInput('');
    setOutput('');
  };

  // Get placeholder text
  const getPlaceholder = () => {
    if (mode === 'text-to-morse') {
      return 'Enter text to convert to Morse code...';
    } else {
      return 'Enter Morse code to convert to text (use space between letters, / for word separation)...';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Morse Code Converter</h2>
          <p className="text-slate-600 dark:text-slate-400">Convert text to Morse code and vice versa</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex items-center justify-center">
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setMode('text-to-morse')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'text-to-morse'
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Text → Morse
            </button>
            <button
              onClick={() => setMode('morse-to-text')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'morse-to-text'
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Morse → Text
            </button>
          </div>
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full px-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm resize-none"
            rows={4}
          />
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapMode}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Swap Direction
          </button>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Output
            </label>
            {output && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-700 dark:text-slate-300 transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Converted text will appear here..."
            className="w-full px-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm resize-none"
            rows={4}
          />
        </div>

        {/* Morse Code Reference */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Morse Code Reference</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {Object.entries(morseCodeMap).slice(0, 26).map(([char, code]) => (
              <div key={char} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700 rounded">
                <span className="font-semibold text-slate-900 dark:text-white">{char}</span>
                <span className="font-mono text-slate-600 dark:text-slate-400">{code}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Text to Morse</h4>
              <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-xs">
                <li>• Letters are separated by spaces</li>
                <li>• Words are separated by /</li>
                <li>• Only A-Z, 0-9, and common punctuation</li>
              </ul>
            </div>

            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Morse to Text</h4>
              <ul className="text-green-700 dark:text-green-300 space-y-1 text-xs">
                <li>• Use spaces between Morse code letters</li>
                <li>• Use / to separate words</li>
                <li>• Case insensitive input</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Numbers and Symbols */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Numbers & Symbols</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {Object.entries(morseCodeMap).slice(26).map(([char, code]) => (
              <div key={char} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700 rounded">
                <span className="font-semibold text-slate-900 dark:text-white">{char}</span>
                <span className="font-mono text-slate-600 dark:text-slate-400">{code}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MorseCodeConverter;
