import React, { useState, useMemo } from "react";
import { Regex, Copy, RotateCcw } from "lucide-react";
import { useTheme } from "../ThemeContext";

const TextExtractor: React.FC = () => {
  const { theme } = useTheme();
  const [inputText, setInputText] = useState("");
  const [pattern, setPattern] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [uniqueOnly, setUniqueOnly] = useState(false);

  /* ---------- Extraction ---------- */
const extractedResults = useMemo((): string[] => {
  if (!inputText || !pattern) return [];

  try {
    let flags = "g";
    if (!caseSensitive) flags += "i";

    const regex = useRegex
      ? new RegExp(pattern, flags)
      : new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);

    const rawMatches = inputText.match(regex);

    let matches: string[] = rawMatches ? Array.from(rawMatches) : [];

    if (uniqueOnly) {
      matches = Array.from(new Set(matches));
    }

    return matches;
  } catch {
    return [];
  }
}, [inputText, pattern, useRegex, caseSensitive, uniqueOnly]);

  /* ---------- Stats ---------- */
  const stats = useMemo(() => {
    const unique = new Set(extractedResults).size;
    return {
      total: extractedResults.length,
      unique,
      length: pattern.length,
    };
  }, [extractedResults, pattern]);

  /* ---------- Copy ---------- */
  const copyAll = async () => {
    await navigator.clipboard.writeText(extractedResults.join("\n"));
  };

  /* ---------- Reset ---------- */
  const reset = () => {
    setInputText("");
    setPattern("");
  };

  return (
    <div className="max-w-6xl mx-auto p-2 space-y-4">
      <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white">Professional Text Extractor</h1>

      <textarea
        value={inputText}
        onChange={(e)=>setInputText(e.target.value)}
        placeholder="Paste text here..."
        className="w-full h-56 border border-slate-200 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
      />

      <div className="flex gap-4">
        <input
          value={pattern}
          onChange={(e)=>setPattern(e.target.value)}
          placeholder="Search pattern"
          className="flex-1 border border-slate-200 dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        />

        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <input 
            type="checkbox" 
            checked={useRegex} 
            onChange={(e)=>setUseRegex(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
          />
          Regex
        </label>

        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <input 
            type="checkbox" 
            checked={caseSensitive} 
            onChange={(e)=>setCaseSensitive(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
          />
          Case
        </label>

        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <input 
            type="checkbox" 
            checked={uniqueOnly} 
            onChange={(e)=>setUniqueOnly(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
          />
          Unique
        </label>
      </div>

      <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 max-h-80 overflow-auto font-mono text-sm bg-slate-50 dark:bg-slate-700">
        {extractedResults.map((r,i)=>(
          <div key={i} className="text-slate-900 dark:text-slate-100">{r}</div>
        ))}
      </div>

      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
        <div>Total: {stats.total} | Unique: {stats.unique} | Pattern Length: {stats.length}</div>

        <div className="flex gap-3">
          <button onClick={copyAll} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
            <Copy size={16}/>
          </button>
          <button onClick={reset} className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <RotateCcw size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextExtractor;
