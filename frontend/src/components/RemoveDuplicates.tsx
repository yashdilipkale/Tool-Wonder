import React, { useState, useEffect } from "react";
import { Copy, Download, RotateCcw, Trash2, Wand2 } from "lucide-react";
import { useTheme } from "../ThemeContext";

const RemoveDuplicates: React.FC = () => {
  const { theme } = useTheme();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<"lines" | "words" | "sentences">("lines");
  const [caseSensitive, setCaseSensitive] = useState(false);

  const [stats, setStats] = useState({
    original: 0,
    unique: 0,
    removed: 0,
  });

  const processText = () => {
    if (!inputText.trim()) {
      setOutputText("");
      setStats({ original: 0, unique: 0, removed: 0 });
      return;
    }

    let items: string[] = [];

    if (mode === "lines") items = inputText.split("\n");
    if (mode === "words") items = inputText.split(/\s+/);
    if (mode === "sentences")
      items = inputText.split(/[.!?]+/).filter((s) => s.trim());

    const normalize = (t: string) =>
      caseSensitive ? t.trim() : t.trim().toLowerCase();

    const seen = new Set<string>();
    const uniqueItems: string[] = [];

    items.forEach((item) => {
      const key = normalize(item);
      if (!seen.has(key)) {
        seen.add(key);
        uniqueItems.push(item.trim());
      }
    });

    const joiner =
      mode === "lines" ? "\n" : mode === "words" ? " " : ". ";

    setOutputText(uniqueItems.join(joiner));
    setStats({
      original: items.length,
      unique: uniqueItems.length,
      removed: items.length - uniqueItems.length,
    });
  };

  useEffect(() => {
    processText();
  }, [inputText, mode, caseSensitive]);

  const copyText = () => navigator.clipboard.writeText(outputText);

  const download = () => {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "unique_text.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setInputText("");
    setOutputText("");
  };

  const sampleText = () => {
    setInputText("apple\nbanana\napple\norange\nbanana");
  };

  return (
    <div className="max-w-6xl mx-auto p-2 space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <Trash2 size={20} /> Remove Duplicates Tool
          </h2>

          <button
            onClick={sampleText}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <Wand2 size={16} /> Sample
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste text here..."
            className="w-full h-52 border border-slate-200 dark:border-slate-600 rounded-xl p-4 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />

          <textarea
            value={outputText}
            readOnly
            placeholder="Unique text will appear here..."
            className="w-full h-52 border border-slate-200 dark:border-slate-600 rounded-xl p-4 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value="lines">Lines</option>
            <option value="words">Words</option>
            <option value="sentences">Sentences</option>
          </select>

          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
            />
            Case Sensitive
          </label>

          <button onClick={copyText} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Copy size={16} />
          </button>

          <button onClick={download} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <Download size={16} />
          </button>

          <button onClick={reset} className="px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
          <Stat label="Original" value={stats.original} />
          <Stat label="Unique" value={stats.unique} />
          <Stat label="Removed" value={stats.removed} />
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value }: any) => (
  <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
    <div className="text-xl font-bold text-slate-900 dark:text-white">{value}</div>
    <div className="text-sm text-slate-600 dark:text-slate-300">{label}</div>
  </div>
);

export default RemoveDuplicates;
