import React, { useState, useEffect } from "react";
import { Lock, Copy, RefreshCw, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { useTheme } from "../ThemeContext";

const PasswordGenerator: React.FC = () => {
  const { theme } = useTheme();
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(14);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });

  const charSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}<>?"
  };

  /* generate password */
  const generatePassword = () => {
    let chars = "";
    if (options.uppercase) chars += charSets.uppercase;
    if (options.lowercase) chars += charSets.lowercase;
    if (options.numbers) chars += charSets.numbers;
    if (options.symbols) chars += charSets.symbols;

    if (!chars) return;

    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const copy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8">

        {/* header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
            <Lock className="text-blue-600 w-6 h-6"/>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Password Generator
            </h2>
            <p className="text-slate-500 text-sm">
              Generate secure professional passwords instantly
            </p>
          </div>
        </div>

        {/* password box */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              readOnly
              className="w-full px-4 py-3 pr-12 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-mono"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400"
            >
              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>

          <button
            onClick={copy}
            className="px-5 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            {copied ? <CheckCircle size={18}/> : <Copy size={18}/>}
          </button>

          <button
            onClick={generatePassword}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <RefreshCw size={18}/>
          </button>
        </div>

        {/* length */}
        <div className="mb-6">
          <label className="text-sm font-semibold block mb-2">
            Length: {length}
          </label>
          <input
            type="range"
            min="6"
            max="40"
            value={length}
            onChange={(e)=>setLength(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.keys(options).map((opt:any)=>(
            <label key={opt} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                checked={(options as any)[opt]}
                onChange={(e)=>setOptions({...options,[opt]:e.target.checked})}
                className="w-4 h-4 text-blue-600 bg-white border border-slate-300 rounded focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600"
              />
              {opt}
            </label>
          ))}
        </div>

        {/* tips */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm">
          Use 12+ characters with numbers & symbols for maximum security.
        </div>

      </div>
    </div>
  );
};

export default PasswordGenerator;
