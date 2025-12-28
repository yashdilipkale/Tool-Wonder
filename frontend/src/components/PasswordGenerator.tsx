import React, { useState, useEffect } from 'react';
import { Lock, Copy, RefreshCw, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    excludeSimilar: false,
    excludeAmbiguous: false
  });
  const [strength, setStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  // Character sets
  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'iIlL1oO0',
    ambiguous: '{}[]()/\\\'"`~,;:.<>'
  };

  // Calculate password strength
  const calculateStrength = (pwd: string): number => {
    let score = 0;

    // Length scoring
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;

    // Character variety scoring
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

    // Bonus for mixed case and numbers/symbols
    if (/[a-z].*[A-Z]|[A-Z].*[a-z]/.test(pwd)) score += 1;
    if (/[a-zA-Z].*[0-9]|[0-9].*[a-zA-Z]/.test(pwd)) score += 1;
    if (/[0-9].*[^a-zA-Z0-9]|[^a-zA-Z0-9].*[0-9]/.test(pwd)) score += 1;

    return Math.min(10, score);
  };

  // Generate password
  const generatePassword = () => {
    let chars = '';

    // Build character set based on options
    if (options.uppercase) chars += charSets.uppercase;
    if (options.lowercase) chars += charSets.lowercase;
    if (options.numbers) chars += charSets.numbers;
    if (options.symbols) chars += charSets.symbols;

    // Remove excluded characters
    if (options.excludeSimilar) {
      chars = chars.split('').filter(char => !charSets.similar.includes(char)).join('');
    }
    if (options.excludeAmbiguous) {
      chars = chars.split('').filter(char => !charSets.ambiguous.includes(char)).join('');
    }

    if (chars.length === 0) {
      setPassword('Please select at least one character type');
      setStrength(0);
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Ensure at least one character from each selected type
    const ensureRequirements = (pwd: string): string => {
      let ensuredPwd = pwd.split('');

      if (options.uppercase && !/[A-Z]/.test(pwd)) {
        const pos = Math.floor(Math.random() * pwd.length);
        ensuredPwd[pos] = charSets.uppercase.charAt(Math.floor(Math.random() * charSets.uppercase.length));
      }
      if (options.lowercase && !/[a-z]/.test(pwd)) {
        const pos = Math.floor(Math.random() * pwd.length);
        ensuredPwd[pos] = charSets.lowercase.charAt(Math.floor(Math.random() * charSets.lowercase.length));
      }
      if (options.numbers && !/[0-9]/.test(pwd)) {
        const pos = Math.floor(Math.random() * pwd.length);
        ensuredPwd[pos] = charSets.numbers.charAt(Math.floor(Math.random() * charSets.numbers.length));
      }
      if (options.symbols && !/[^a-zA-Z0-9]/.test(pwd)) {
        const pos = Math.floor(Math.random() * pwd.length);
        ensuredPwd[pos] = charSets.symbols.charAt(Math.floor(Math.random() * charSets.symbols.length));
      }

      return ensuredPwd.join('');
    };

    result = ensureRequirements(result);
    setPassword(result);
    setStrength(calculateStrength(result));
  };

  // Copy password to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  // Auto-generate password when options change
  useEffect(() => {
    generatePassword();
  }, [length, options]);

  // Strength indicators
  const getStrengthLabel = (score: number): string => {
    if (score <= 2) return 'Very Weak';
    if (score <= 4) return 'Weak';
    if (score <= 6) return 'Fair';
    if (score <= 8) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = (score: number): string => {
    if (score <= 2) return 'text-red-600 dark:text-red-400';
    if (score <= 4) return 'text-orange-600 dark:text-orange-400';
    if (score <= 6) return 'text-yellow-600 dark:text-yellow-400';
    if (score <= 8) return 'text-blue-600 dark:text-blue-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getStrengthBarColor = (score: number): string => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 4) return 'bg-orange-500';
    if (score <= 6) return 'bg-yellow-500';
    if (score <= 8) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // Password analysis
  const analyzePassword = (pwd: string) => {
    return {
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumbers: /[0-9]/.test(pwd),
      hasSymbols: /[^a-zA-Z0-9]/.test(pwd),
      length: pwd.length
    };
  };

  const analysis = analyzePassword(password);

  // Preset configurations
  const presets = [
    { name: 'Basic', length: 8, options: { uppercase: true, lowercase: true, numbers: false, symbols: false, excludeSimilar: false, excludeAmbiguous: false } },
    { name: 'Standard', length: 12, options: { uppercase: true, lowercase: true, numbers: true, symbols: false, excludeSimilar: false, excludeAmbiguous: false } },
    { name: 'Strong', length: 16, options: { uppercase: true, lowercase: true, numbers: true, symbols: true, excludeSimilar: false, excludeAmbiguous: false } },
    { name: 'Maximum', length: 20, options: { uppercase: true, lowercase: true, numbers: true, symbols: true, excludeSimilar: true, excludeAmbiguous: true } }
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setLength(preset.length);
    setOptions(preset.options);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Password Generator</h2>
          <p className="text-slate-600 dark:text-slate-400">Generate secure passwords</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Generated Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Generated Password
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                readOnly
                className="w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={copyToClipboard}
              disabled={!password || password.includes('Please select')}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:bg-slate-50 disabled:cursor-not-allowed rounded-lg text-slate-700 dark:text-slate-300"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={generatePassword}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Password Strength */}
        {password && !password.includes('Please select') && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Strength</span>
              <span className={`text-sm font-semibold ${getStrengthColor(strength)}`}>
                {getStrengthLabel(strength)} ({strength}/10)
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getStrengthBarColor(strength)}`}
                style={{ width: `${(strength / 10) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Password Analysis */}
        {password && !password.includes('Please select') && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              {analysis.hasUppercase ? (
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
              <span className="text-sm text-slate-600 dark:text-slate-400">A-Z</span>
            </div>
            <div className="flex items-center gap-2">
              {analysis.hasLowercase ? (
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
              <span className="text-sm text-slate-600 dark:text-slate-400">a-z</span>
            </div>
            <div className="flex items-center gap-2">
              {analysis.hasNumbers ? (
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
              <span className="text-sm text-slate-600 dark:text-slate-400">0-9</span>
            </div>
            <div className="flex items-center gap-2">
              {analysis.hasSymbols ? (
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
              <span className="text-sm text-slate-600 dark:text-slate-400">!@#</span>
            </div>
          </div>
        )}

        {/* Presets */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Presets</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="p-3 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                <div className="font-medium text-slate-900 dark:text-white text-sm mb-1">
                  {preset.name}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {preset.length} chars
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Settings</h3>

          {/* Length */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Length: {length} characters
              </label>
            </div>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>4</span>
              <span>64</span>
            </div>
          </div>

          {/* Character Options */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={options.uppercase}
                onChange={(e) => setOptions({...options, uppercase: e.target.checked})}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Uppercase (A-Z)</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={options.lowercase}
                onChange={(e) => setOptions({...options, lowercase: e.target.checked})}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Lowercase (a-z)</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={options.numbers}
                onChange={(e) => setOptions({...options, numbers: e.target.checked})}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Numbers (0-9)</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={options.symbols}
                onChange={(e) => setOptions({...options, symbols: e.target.checked})}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Symbols (!@#$%)</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={options.excludeSimilar}
                onChange={(e) => setOptions({...options, excludeSimilar: e.target.checked})}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Exclude similar (iIlL1oO0)</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={options.excludeAmbiguous}
                onChange={(e) => setOptions({...options, excludeAmbiguous: e.target.checked})}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Exclude ambiguous ({}{[]})</span>
            </label>
          </div>
        </div>

        {/* Security Tips */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Security Tips</h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p><strong>Length:</strong> Use at least 12 characters for better security</p>
            <p><strong>Complexity:</strong> Mix uppercase, lowercase, numbers, and symbols</p>
            <p><strong>Uniqueness:</strong> Never reuse passwords across accounts</p>
            <p><strong>Manager:</strong> Consider using a password manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
