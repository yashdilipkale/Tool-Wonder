import React, { useState, useMemo, useCallback } from "react";
import { Search, Replace, Settings, Copy } from "lucide-react";
import { useTheme } from "../ThemeContext";

const FindReplace: React.FC = () => {
  const { theme } = useTheme();
  const [inputText, setInputText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [outputText, setOutputText] = useState("");

  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [multiline, setMultiline] = useState(false);

  /* ---------- Regex Builder ---------- */
  const buildRegex = useCallback(() => {
    if (!searchTerm) return null;

    try {
      let flags = "g";
      if (!caseSensitive) flags += "i";
      if (multiline) flags += "m";

      let pattern = searchTerm;

      if (!useRegex) {
        pattern = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        if (wholeWord) pattern = `\\b${pattern}\\b`;
      }

      return new RegExp(pattern, flags);
    } catch {
      return null;
    }
  }, [searchTerm, caseSensitive, wholeWord, useRegex, multiline]);

  /* ---------- Match Counter ---------- */
  const matchCount = useMemo(() => {
    const regex = buildRegex();
    if (!regex) return 0;
    const m = inputText.match(regex);
    return m ? m.length : 0;
  }, [inputText, buildRegex]);

  /* ---------- Replace Handler ---------- */
  const handleReplace = () => {
    const regex = buildRegex();
    if (!regex) return;
    const result = inputText.replace(regex, replaceTerm);
    setOutputText(result);
  };

  /* ---------- Copy ---------- */
  const handleCopy = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
  };

  /* ---------- Reset ---------- */
  const handleReset = () => {
    setInputText("");
    setSearchTerm("");
    setReplaceTerm("");
    setOutputText("");
  };

  return (
    <div className="max-w-6xl mx-auto p-2 space-y-4">
      <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white">Professional Find & Replace</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* INPUT */}
        <div className="space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste text here..."
            className="w-full h-64 p-4 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Find"
            className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />

          <input
            value={replaceTerm}
            onChange={(e) => setReplaceTerm(e.target.value)}
            placeholder="Replace with"
            className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />

          {/* OPTIONS */}
          <div className="grid grid-cols-2 gap-2 text-sm text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={caseSensitive} 
                onChange={(e)=>setCaseSensitive(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
              />
              Case
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={wholeWord} 
                onChange={(e)=>setWholeWord(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
              />
              Whole Word
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={useRegex} 
                onChange={(e)=>setUseRegex(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
              />
              Regex
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={multiline} 
                onChange={(e)=>setMultiline(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
              />
              Multiline
            </label>
          </div>

          <div className="flex gap-3">
            <button onClick={handleReplace} className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors">
              Replace All
            </button>
            <button onClick={handleReset} className="flex-1 border border-slate-200 dark:border-slate-600 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              Clear
            </button>
          </div>
        </div>

        {/* OUTPUT */}
        <div className="space-y-4">
          <div className="border border-slate-200 dark:border-slate-600 h-64 p-4 rounded overflow-auto whitespace-pre-wrap bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white">
            {outputText || "Output will appear here"}
          </div>

          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
            <span>Matches Found: <b className="text-slate-900 dark:text-white">{matchCount}</b></span>
            <button onClick={handleCopy} className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
              <Copy size={14}/> Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindReplace;
