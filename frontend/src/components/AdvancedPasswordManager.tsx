import React, { useState, useEffect } from 'react';
import { Lock, Copy, RefreshCw, Eye, EyeOff, CheckCircle, XCircle, Save, Trash2, AlertTriangle, Shield, Key, Database } from 'lucide-react';

interface StoredPassword {
  id: string;
  name: string;
  password: string;
  createdAt: Date;
  strength: number;
}

const AdvancedPasswordManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'check' | 'stored'>('generate');

  // Generate tab state
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: true,
    excludeAmbiguous: true
  });
  const [strength, setStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check tab state
  const [checkPassword, setCheckPassword] = useState('');
  const [checkStrength, setCheckStrength] = useState(0);
  const [checkAnalysis, setCheckAnalysis] = useState<any>({});

  // Stored tab state
  const [storedPasswords, setStoredPasswords] = useState<StoredPassword[]>([]);
  const [newPasswordName, setNewPasswordName] = useState('');
  const [showStoredPasswords, setShowStoredPasswords] = useState<{[key: string]: boolean}>({});

  // Load stored passwords
  useEffect(() => {
    const stored = localStorage.getItem('advanced-password-manager');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setStoredPasswords(parsed.map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) })));
      } catch (e) {
        console.error('Failed to load stored passwords');
      }
    }
  }, []);

  // Save stored passwords
  const saveStoredPasswords = (passwords: StoredPassword[]) => {
    localStorage.setItem('advanced-password-manager', JSON.stringify(passwords));
    setStoredPasswords(passwords);
  };

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

    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;

    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

    if (/[a-z].*[A-Z]|[A-Z].*[a-z]/.test(pwd)) score += 1;
    if (/[a-zA-Z].*[0-9]|[0-9].*[a-zA-Z]/.test(pwd)) score += 1;
    if (/[0-9].*[^a-zA-Z0-9]|[^a-zA-Z0-9].*[0-9]/.test(pwd)) score += 1;

    return Math.min(10, score);
  };

  // Generate password
  const generatePassword = () => {
    let chars = '';

    if (options.uppercase) chars += charSets.uppercase;
    if (options.lowercase) chars += charSets.lowercase;
    if (options.numbers) chars += charSets.numbers;
    if (options.symbols) chars += charSets.symbols;

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

  // Check password
  const checkPasswordStrength = () => {
    const str = calculateStrength(checkPassword);
    setCheckStrength(str);
    setCheckAnalysis({
      hasUppercase: /[A-Z]/.test(checkPassword),
      hasLowercase: /[a-z]/.test(checkPassword),
      hasNumbers: /[0-9]/.test(checkPassword),
      hasSymbols: /[^a-zA-Z0-9]/.test(checkPassword),
      length: checkPassword.length
    });
  };

  // Save password
  const savePassword = () => {
    if (!newPasswordName.trim() || !password) return;

    const newStored: StoredPassword = {
      id: Date.now().toString(),
      name: newPasswordName.trim(),
      password,
      createdAt: new Date(),
      strength
    };

    const updated = [...storedPasswords, newStored];
    saveStoredPasswords(updated);
    setNewPasswordName('');
  };

  // Delete password
  const deletePassword = (id: string) => {
    const updated = storedPasswords.filter(p => p.id !== id);
    saveStoredPasswords(updated);
  };

  // Copy password
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Strength labels
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

  // Auto-generate
  useEffect(() => {
    if (activeTab === 'generate') {
      generatePassword();
    }
  }, [length, options, activeTab]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Advanced Password Manager</h2>
          <p className="text-slate-600 dark:text-slate-400">Generate, check, and manage secure passwords</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'generate'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Generate
        </button>
        <button
          onClick={() => setActiveTab('check')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'check'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Check Strength
        </button>
        <button
          onClick={() => setActiveTab('stored')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'stored'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Stored ({storedPasswords.length})
        </button>
      </div>

      {/* Generate Tab */}
      {activeTab === 'generate' && (
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
                onClick={() => copyToClipboard(password)}
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

          {/* Save Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Save Password (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPasswordName}
                onChange={(e) => setNewPasswordName(e.target.value)}
                placeholder="Enter a name for this password"
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
              <button
                onClick={savePassword}
                disabled={!newPasswordName.trim() || !password || password.includes('Please select')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg"
              >
                <Save className="w-4 h-4" />
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
                min="8"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>8</span>
                <span>64</span>
              </div>
            </div>

            {/* Character Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      )}

      {/* Check Tab */}
      {activeTab === 'check' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Enter Password to Check
            </label>
            <input
              type="password"
              value={checkPassword}
              onChange={(e) => setCheckPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
            <button
              onClick={checkPasswordStrength}
              disabled={!checkPassword}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg"
            >
              Check Strength
            </button>
          </div>

          {checkPassword && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Strength</span>
                <span className={`text-sm font-semibold ${getStrengthColor(checkStrength)}`}>
                  {getStrengthLabel(checkStrength)} ({checkStrength}/10)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getStrengthBarColor(checkStrength)}`}
                  style={{ width: `${(checkStrength / 10) * 100}%` }}
                />
              </div>
            </div>
          )}

          {checkPassword && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                {checkAnalysis.hasUppercase ? (
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
                <span className="text-sm text-slate-600 dark:text-slate-400">A-Z</span>
              </div>
              <div className="flex items-center gap-2">
                {checkAnalysis.hasLowercase ? (
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
                <span className="text-sm text-slate-600 dark:text-slate-400">a-z</span>
              </div>
              <div className="flex items-center gap-2">
                {checkAnalysis.hasNumbers ? (
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
                <span className="text-sm text-slate-600 dark:text-slate-400">0-9</span>
              </div>
              <div className="flex items-center gap-2">
                {checkAnalysis.hasSymbols ? (
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
                <span className="text-sm text-slate-600 dark:text-slate-400">!@#</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stored Tab */}
      {activeTab === 'stored' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Security Warning:</strong> Passwords are stored locally in your browser. This is not secure for sensitive passwords. Use a dedicated password manager for important credentials.
              </div>
            </div>
          </div>

          {storedPasswords.length === 0 ? (
            <div className="text-center py-12">
              <Database className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Stored Passwords</h3>
              <p className="text-slate-600 dark:text-slate-400">Generate and save passwords to see them here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {storedPasswords.map((stored) => (
                <div key={stored.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-900 dark:text-white">{stored.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${getStrengthColor(stored.strength)} bg-opacity-20`}>
                        {getStrengthLabel(stored.strength)}
                      </span>
                      <button
                        onClick={() => setShowStoredPasswords(prev => ({ ...prev, [stored.id]: !prev[stored.id] }))}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showStoredPasswords[stored.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(stored.password)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePassword(stored.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm text-slate-600 dark:text-slate-400">
                      {showStoredPasswords[stored.id] ? stored.password : '••••••••••••••••'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {stored.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedPasswordManager;
