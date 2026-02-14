import React, { useState, useMemo } from "react";
import {
  Regex,
  Copy,
  CheckCircle,
  XCircle,
  Info,
  RefreshCw
} from "lucide-react";
import { useTheme } from "../ThemeContext";

interface MatchItem {
  value: string;
  index: number;
  groups: string[];
}

const RegexTester: React.FC = () => {
  const { theme } = useTheme();
  const [pattern, setPattern] = useState("");
  const [testText, setTestText] = useState("Hello World 123");
  const [copied, setCopied] = useState("");
  const [flags, setFlags] = useState({
    g: true,
    i: false,
    m: false,
    s: false,
    u: false,
    y: false
  });

  /* ----------- Build Flag String ----------- */
  const flagString = useMemo(() => {
    return Object.entries(flags)
      .filter(([_, v]) => v)
      .map(([k]) => k)
      .join("");
  }, [flags]);

  /* ----------- Regex Execution ----------- */
  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [] as MatchItem[], error: "" };

    try {
      const regex = new RegExp(pattern, flagString);
      const results: MatchItem[] = [];

      if (flags.g) {
        for (const match of testText.matchAll(regex)) {
          results.push({
            value: match[0],
            index: match.index || 0,
            groups: match.slice(1)
          });
        }
      } else {
        const match = regex.exec(testText);
        if (match) {
          results.push({
            value: match[0],
            index: match.index || 0,
            groups: match.slice(1)
          });
        }
      }

      return { matches: results, error: "" };
    } catch (err: any) {
      return { matches: [], error: err.message };
    }
  }, [pattern, testText, flagString, flags.g]);

  /* ----------- Highlight Safe ----------- */
  const highlightedText = useMemo(() => {
    if (!matches.length) return testText;

    let parts: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((match, i) => {
      const start = match.index;
      const end = start + match.value.length;

      parts.push(testText.slice(lastIndex, start));

      parts.push(
        <mark
          key={i}
          className="bg-yellow-300 dark:bg-yellow-700 px-1 rounded"
        >
          {match.value}
        </mark>
      );

      lastIndex = end;
    });

    parts.push(testText.slice(lastIndex));
    return parts;
  }, [matches, testText]);

  /* ----------- Copy ----------- */
  const copy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 1000);
  };

  const toggleFlag = (key: keyof typeof flags) => {
    setFlags(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const reset = () => {
    setPattern("");
    setTestText("");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Regex className="text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Regex Tester</h2>
      </div>

      {/* Pattern Input */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block text-slate-700 dark:text-slate-300">
          Regex Pattern
        </label>
        <div className="flex gap-2">
          <input
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            placeholder="Example: \d+"
            className="flex-1 border border-slate-200 dark:border-slate-600 p-2 rounded-lg font-mono bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
          <button
            onClick={() => copy(pattern, "pattern")}
            className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            <Copy size={16} />
            {copied === "pattern" && " Copied"}
          </button>
        </div>
      </div>

      {/* Flags */}
      <div className="mb-4">
        <label className="text-sm font-medium block mb-2 text-slate-700 dark:text-slate-300">Flags</label>
        <div className="flex flex-wrap gap-3">
          {Object.keys(flags).map(key => (
            <button
              key={key}
              onClick={() => toggleFlag(key as any)}
              className={`px-3 py-1 rounded-full text-sm border border-slate-200 dark:border-slate-600 ${
                flags[key as keyof typeof flags]
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
              } transition-colors`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Test Text */}
      <div className="mb-6">
        <label className="text-sm font-medium block mb-2 text-slate-700 dark:text-slate-300">
          Test String
        </label>
        <textarea
          value={testText}
          onChange={e => setTestText(e.target.value)}
          className="w-full h-32 border border-slate-200 dark:border-slate-600 p-3 rounded-lg font-mono bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none"
        />
      </div>

      {/* Status */}
      {pattern && (
        <div className="mb-4">
          {error ? (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <XCircle size={18} />
              Invalid Regex: {error}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle size={18} />
              {matches.length} match
              {matches.length !== 1 ? "es" : ""} found
            </div>
          )}
        </div>
      )}

      {/* Highlight */}
      {!error && matches.length > 0 && (
        <div className="mb-6">
          <div className="font-medium mb-2 text-slate-900 dark:text-white">Highlighted Output</div>
          <div className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 font-mono whitespace-pre-wrap">
            {highlightedText}
          </div>
        </div>
      )}

      {/* Match Details */}
      {!error && matches.length > 0 && (
        <div>
          <div className="font-medium mb-2 text-slate-900 dark:text-white">Match Details</div>
          <div className="space-y-3">
            {matches.map((m, i) => (
              <div
                key={i}
                className="p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700"
              >
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-slate-900 dark:text-white">
                    Match {i + 1} (Index {m.index})
                  </span>
                  <button
                    onClick={() => copy(m.value, `match${i}`)}
                    className="text-sm bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white px-2 py-1 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <div className="font-mono text-sm text-slate-900 dark:text-white">{m.value}</div>

                {m.groups.length > 0 && (
                  <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                    Groups:
                    {m.groups.map((g, gi) => (
                      <div key={gi} className="font-mono">
                        {gi + 1}: {g}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
        <div className="flex items-center gap-2 font-medium mb-2 text-slate-900 dark:text-white">
          <Info size={16} /> Regex Flags
        </div>
        <div className="text-slate-700 dark:text-slate-300">
          g = global | i = ignore case | m = multiline  
          s = dotAll | u = unicode | y = sticky
        </div>
      </div>

      {/* Reset */}
      <div className="mt-4 text-right">
        <button
          onClick={reset}
          className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 ml-auto hover:bg-red-600 transition-colors"
        >
          <RefreshCw size={16} /> Reset
        </button>
      </div>
    </div>
  );
};

export default RegexTester;
