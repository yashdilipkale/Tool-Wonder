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
  <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 md:p-8 space-y-8">

    {/* Header */}
    <div className="flex items-center gap-3">
      <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
        <Shield className="text-purple-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Advanced Password Manager
        </h2>
        <p className="text-sm text-slate-500">
          Generate, analyze and securely manage passwords
        </p>
      </div>
    </div>

    {/* Tabs */}
    <div className="flex flex-wrap gap-2 border-b pb-3">
      {['generate','check','stored'].map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab as any)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition
          ${
            activeTab===tab
              ? 'bg-blue-600 text-white shadow'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
          }`}
        >
          {tab === 'stored'
            ? `Stored (${storedPasswords.length})`
            : tab.charAt(0).toUpperCase()+tab.slice(1)}
        </button>
      ))}
    </div>

    {/* Generate Tab */}
    {activeTab === 'generate' && (
      <div className="grid md:grid-cols-2 gap-8">

        {/* Left */}
        <div className="space-y-5">

          {/* Password box */}
          <div>
            <label className="text-sm font-medium">Generated Password</label>
            <div className="flex gap-2 mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                readOnly
                className="flex-1 px-3 py-3 border rounded-xl bg-slate-50 dark:bg-slate-800 font-mono"
              />

              <button onClick={()=>setShowPassword(!showPassword)}
                className="px-3 rounded-xl bg-slate-200 dark:bg-slate-700">
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>

              <button
                onClick={()=>copyToClipboard(password)}
                className="px-3 rounded-xl bg-blue-600 text-white">
                {copied ? <CheckCircle size={18}/> : <Copy size={18}/>}
              </button>

              <button
                onClick={generatePassword}
                className="px-3 rounded-xl bg-purple-600 text-white">
                <RefreshCw size={18}/>
              </button>
            </div>
          </div>

          {/* Save */}
          <div className="flex gap-2">
            <input
              value={newPasswordName}
              onChange={e=>setNewPasswordName(e.target.value)}
              placeholder="Password name"
              className="flex-1 px-3 py-2 border rounded-xl"
            />
            <button
              onClick={savePassword}
              className="px-4 py-2 bg-green-600 text-white rounded-xl">
              <Save size={18}/>
            </button>
          </div>

          {/* Strength */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Strength</span>
              <span className={getStrengthColor(strength)}>
                {getStrengthLabel(strength)}
              </span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full">
              <div
                className={`h-3 rounded-full ${getStrengthBarColor(strength)}`}
                style={{width:`${(strength/10)*100}%`}}
              />
            </div>
          </div>
        </div>

        {/* Settings panel */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 space-y-5">

          <div>
            <label className="text-sm font-medium">
              Length: {length}
            </label>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={e=>setLength(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {Object.keys(options).map(opt=>(
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(options as any)[opt]}
                  onChange={e=>setOptions({...options,[opt]:e.target.checked})}
                />
                {opt}
              </label>
            ))}
          </div>

        </div>
      </div>
    )}

    {/* Check Tab */}
    {activeTab === 'check' && (
      <div className="max-w-xl space-y-4">
        <input
          type="password"
          value={checkPassword}
          onChange={e=>setCheckPassword(e.target.value)}
          className="w-full px-3 py-3 border rounded-xl"
          placeholder="Enter password"
        />
        <button
          onClick={checkPasswordStrength}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl">
          Check Strength
        </button>
      </div>
    )}

    {/* Stored Tab */}
    {activeTab === 'stored' && (
      <div className="grid md:grid-cols-2 gap-4">
        {storedPasswords.map(stored=>(
          <div key={stored.id}
            className="p-4 border rounded-xl flex justify-between items-center">

            <div>
              <div className="font-semibold">{stored.name}</div>
              <div className="font-mono text-sm">
                {showStoredPasswords[stored.id] ? stored.password : "••••••••"}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={()=>setShowStoredPasswords(prev=>({...prev,[stored.id]:!prev[stored.id]}))}>
                <Eye size={16}/>
              </button>
              <button onClick={()=>copyToClipboard(stored.password)}>
                <Copy size={16}/>
              </button>
              <button onClick={()=>deletePassword(stored.id)}>
                <Trash2 size={16}/>
              </button>
            </div>

          </div>
        ))}
      </div>
    )}

  </div>
);
};

export default AdvancedPasswordManager;
