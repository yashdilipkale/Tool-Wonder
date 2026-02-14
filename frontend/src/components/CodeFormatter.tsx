import React, { useState, useEffect } from "react";
import {
  FileCode,
  Copy,
  RotateCcw,
  Download,
  Sparkles
} from "lucide-react";
import { useTheme } from "../ThemeContext";

const CodeFormatter: React.FC = () => {
  const { theme } = useTheme();
  const [inputCode, setInputCode] = useState("");
  const [formattedCode, setFormattedCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [indentSize, setIndentSize] = useState(2);
  const [useTabs, setUseTabs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const languages = [
    "javascript","typescript","python","java","cpp",
    "csharp","php","go","rust","html","css","json","xml","sql"
  ];

  /* ---------- Simple Formatter ---------- */
  const basicFormat = (code: string) => {
    const indent = useTabs ? "\t" : " ".repeat(indentSize);
    let level = 0;

    return code.split("\n").map(line => {
      const t = line.trim();
      if (!t) return "";

      if (t.startsWith("}") || t.startsWith("</")) level--;

      const result = indent.repeat(Math.max(level,0)) + t;

      if (t.endsWith("{") || (t.startsWith("<") && !t.startsWith("</")))
        level++;

      return result;
    }).join("\n");
  };

  const formatNow = () => {
    if (!inputCode) return;
    setLoading(true);

    setTimeout(() => {
      if (language === "json") {
        try {
          setFormattedCode(
            JSON.stringify(JSON.parse(inputCode), null, useTabs ? "\t" : indentSize)
          );
        } catch {
          setFormattedCode(inputCode);
        }
      } else {
        setFormattedCode(basicFormat(inputCode));
      }
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    formatNow();
  }, [inputCode, language, indentSize, useTabs]);

  const copy = async () => {
    await navigator.clipboard.writeText(formattedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const download = () => {
    const blob = new Blob([formattedCode], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `formatted.${language}`;
    a.click();
  };

  const reset = () => {
    setInputCode("");
    setFormattedCode("");
  };

  return (
    <div className="max-w-6xl mx-auto p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FileCode className="text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Formatter</h2>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="border border-slate-200 dark:border-slate-600 px-3 py-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        >
          {languages.map(l => (
            <option key={l}>{l}</option>
          ))}
        </select>

        <select
          value={indentSize}
          disabled={useTabs}
          onChange={e => setIndentSize(Number(e.target.value))}
          className="border border-slate-200 dark:border-slate-600 px-3 py-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        >
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
          <option value={8}>8 spaces</option>
        </select>

        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={useTabs}
            onChange={e => setUseTabs(e.target.checked)}
            className="accent-blue-600"
          />
          Use Tabs
        </label>

        <button
          onClick={copy}
          className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg flex items-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          <Copy size={16} /> {copied ? "Copied" : "Copy"}
        </button>

        <button
          onClick={download}
          className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg flex items-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          <Download size={16} /> Download
        </button>

        <button
          onClick={reset}
          className="px-3 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {/* Editors */}
      <div className="grid lg:grid-cols-2 gap-6">
        <textarea
          value={inputCode}
          onChange={e => setInputCode(e.target.value)}
          placeholder="Paste your code..."
          className="h-80 p-4 border border-slate-200 dark:border-slate-600 rounded-lg font-mono bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        />

        <div className="h-80 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 overflow-auto p-4 font-mono">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Sparkles className="animate-pulse text-blue-600" />
            </div>
          ) : (
            <pre className="whitespace-pre-wrap text-slate-900 dark:text-white">{formattedCode}</pre>
          )}
        </div>
      </div>

      {/* Stats */}
      {formattedCode && (
        <div className="grid grid-cols-3 gap-4 mt-6 text-sm text-slate-700 dark:text-slate-300">
          <div>Lines: {formattedCode.split("\n").length}</div>
          <div>Characters: {formattedCode.length}</div>
          <div>Indent: {useTabs ? "Tabs" : `${indentSize} spaces`}</div>
        </div>
      )}
    </div>
  );
};

export default CodeFormatter;
