import React, { useState, useEffect } from 'react';
import { Code, RefreshCw, Copy, CheckCircle } from 'lucide-react';

const BinaryConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [inputBase, setInputBase] = useState<'binary' | 'decimal' | 'hexadecimal' | 'octal'>('decimal');
  const [results, setResults] = useState({
    binary: '',
    decimal: '',
    hexadecimal: '',
    octal: ''
  });
  const [copied, setCopied] = useState<string | null>(null);

  // Conversion functions
  const binaryToDecimal = (binary: string): string => {
    try {
      return parseInt(binary, 2).toString();
    } catch {
      return '';
    }
  };

  const decimalToBinary = (decimal: string): string => {
    try {
      const num = parseInt(decimal, 10);
      if (isNaN(num)) return '';
      return num.toString(2);
    } catch {
      return '';
    }
  };

  const hexToDecimal = (hex: string): string => {
    try {
      return parseInt(hex, 16).toString();
    } catch {
      return '';
    }
  };

  const decimalToHex = (decimal: string): string => {
    try {
      const num = parseInt(decimal, 10);
      if (isNaN(num)) return '';
      return num.toString(16).toUpperCase();
    } catch {
      return '';
    }
  };

  const octalToDecimal = (octal: string): string => {
    try {
      return parseInt(octal, 8).toString();
    } catch {
      return '';
    }
  };

  const decimalToOctal = (decimal: string): string => {
    try {
      const num = parseInt(decimal, 10);
      if (isNaN(num)) return '';
      return num.toString(8);
    } catch {
      return '';
    }
  };

  // Validate input based on base
  const validateInput = (value: string, base: string): boolean => {
    if (!value) return true;

    switch (base) {
      case 'binary':
        return /^[01\s]+$/.test(value.replace(/\s/g, ''));
      case 'decimal':
        return /^\d+$/.test(value.replace(/\s/g, ''));
      case 'hexadecimal':
        return /^[0-9A-Fa-f\s]+$/.test(value);
      case 'octal':
        return /^[0-7\s]+$/.test(value);
      default:
        return false;
    }
  };

  // Convert input to all bases
  const convertAll = (value: string, fromBase: string) => {
    const cleanValue = value.replace(/\s/g, '');
    if (!cleanValue || !validateInput(cleanValue, fromBase)) {
      setResults({ binary: '', decimal: '', hexadecimal: '', octal: '' });
      return;
    }

    let decimalValue = '';

    try {
      switch (fromBase) {
        case 'binary':
          decimalValue = binaryToDecimal(cleanValue);
          break;
        case 'decimal':
          decimalValue = cleanValue;
          break;
        case 'hexadecimal':
          decimalValue = hexToDecimal(cleanValue);
          break;
        case 'octal':
          decimalValue = octalToDecimal(cleanValue);
          break;
      }

      if (decimalValue) {
        setResults({
          binary: fromBase === 'binary' ? cleanValue : decimalToBinary(decimalValue),
          decimal: decimalValue,
          hexadecimal: fromBase === 'hexadecimal' ? cleanValue.toUpperCase() : decimalToHex(decimalValue),
          octal: fromBase === 'octal' ? cleanValue : decimalToOctal(decimalValue)
        });
      } else {
        setResults({ binary: '', decimal: '', hexadecimal: '', octal: '' });
      }
    } catch {
      setResults({ binary: '', decimal: '', hexadecimal: '', octal: '' });
    }
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setInput(value);
    convertAll(value, inputBase);
  };

  // Handle base change
  const handleBaseChange = (base: 'binary' | 'decimal' | 'hexadecimal' | 'octal') => {
    setInputBase(base);
    convertAll(input, base);
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Format number with spaces for readability
  const formatNumber = (num: string, base: string): string => {
    if (!num) return '';

    // Don't format if it's too short
    if (num.length <= 4) return num;

    // For binary, group by 4 bits
    if (base === 'binary') {
      return num.replace(/(.{4})/g, '$1 ').trim();
    }

    // For others, group by 3 digits
    return num.replace(/(.{3})/g, '$1 ').trim();
  };

  // Get base information
  const getBaseInfo = (base: string) => {
    switch (base) {
      case 'binary':
        return { name: 'Binary', digits: '0-1', description: 'Base-2 numeral system' };
      case 'decimal':
        return { name: 'Decimal', digits: '0-9', description: 'Base-10 numeral system' };
      case 'hexadecimal':
        return { name: 'Hexadecimal', digits: '0-9, A-F', description: 'Base-16 numeral system' };
      case 'octal':
        return { name: 'Octal', digits: '0-7', description: 'Base-8 numeral system' };
      default:
        return { name: '', digits: '', description: '' };
    }
  };

  const isValidInput = validateInput(input.replace(/\s/g, ''), inputBase);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Binary Converter</h2>
          <p className="text-slate-600 dark:text-slate-400">Convert between binary, decimal, hexadecimal, and octal</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Input Base Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Input Base
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['binary', 'decimal', 'hexadecimal', 'octal'] as const).map((base) => {
              const info = getBaseInfo(base);
              return (
                <button
                  key={base}
                  onClick={() => handleBaseChange(base)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    inputBase === base
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  <div className="font-semibold text-slate-900 dark:text-white text-sm">
                    {info.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {info.digits}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Enter {getBaseInfo(inputBase).name} Number
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={`Enter ${getBaseInfo(inputBase).name.toLowerCase()} number...`}
            className={`w-full px-3 py-3 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm ${
              !isValidInput && input
                ? 'border-red-300 dark:border-red-600'
                : 'border-slate-300 dark:border-slate-600'
            }`}
          />
          {!isValidInput && input && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              Invalid {getBaseInfo(inputBase).name.toLowerCase()} number. Use only: {getBaseInfo(inputBase).digits}
            </p>
          )}
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Converted Values</h3>

          {(['binary', 'decimal', 'hexadecimal', 'octal'] as const).map((base) => {
            const value = results[base];
            const info = getBaseInfo(base);
            const isInputBase = base === inputBase;

            return (
              <div key={base} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {info.name}
                    </span>
                    {isInputBase && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                        Input
                      </span>
                    )}
                  </div>
                  {value && (
                    <button
                      onClick={() => copyToClipboard(value, base)}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                    >
                      {copied === base ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied === base ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
                <div className="font-mono text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 p-3 rounded min-h-[2.5rem] break-all">
                  {value ? formatNumber(value, base) : '—'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {info.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Number Systems Info */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Number Systems</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Binary (Base-2)</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Uses only 0s and 1s. Each digit represents a power of 2.
                </p>
                <div className="font-mono text-xs text-slate-500 dark:text-slate-500 mt-1">
                  Example: 1010₂ = 1×2³ + 0×2² + 1×2¹ + 0×2⁰ = 10₁₀
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Decimal (Base-10)</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Standard number system using digits 0-9.
                </p>
                <div className="font-mono text-xs text-slate-500 dark:text-slate-500 mt-1">
                  Example: 42₁₀ = 4×10¹ + 2×10⁰
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Hexadecimal (Base-16)</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Uses 0-9 and A-F. Each digit represents 4 binary bits.
                </p>
                <div className="font-mono text-xs text-slate-500 dark:text-slate-500 mt-1">
                  Example: A3₁₆ = 10×16¹ + 3×16⁰ = 163₁₀
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Octal (Base-8)</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Uses digits 0-7. Each digit represents 3 binary bits.
                </p>
                <div className="font-mono text-xs text-slate-500 dark:text-slate-500 mt-1">
                  Example: 52₈ = 5×8¹ + 2×8⁰ = 42₁₀
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinaryConverter;
