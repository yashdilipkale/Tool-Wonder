import React, { useState, useEffect } from "react";
import {
  Copy,
  Download,
  RotateCcw,
  ArrowUpDown,
  Wand2
} from "lucide-react";
import { useTheme } from "../ThemeContext";

const TextSorter: React.FC = () => {
  const { theme } = useTheme();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const [sortType, setSortType] = useState<"lines" | "words">("lines");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [sortLength, setSortLength] = useState(false);

  const [stats, setStats] = useState({ total: 0 });

  const processSort = () => {
    if (!inputText.trim()) {
      setOutputText("");
      return;
    }

    let items =
      sortType === "lines"
        ? inputText.split("\n")
        : inputText.split(/\s+/);

    items = items.filter((i) => i.trim());

    if (removeDuplicates) {
      const seen = new Set<string>();
      items = items.filter((i) => {
        const key = caseSensitive ? i : i.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    items.sort((a, b) => {
      if (sortLength) {
        return sortOrder === "asc"
          ? a.length - b.length
          : b.length - a.length;
      }

      const A = caseSensitive ? a : a.toLowerCase();
      const B = caseSensitive ? b : b.toLowerCase();

      return sortOrder === "asc"
        ? A.localeCompare(B)
        : B.localeCompare(A);
    });

    setOutputText(
      sortType === "lines" ? items.join("\n") : items.join(" ")
    );

    setStats({ total: items.length });
  };

  useEffect(() => {
    processSort();
  }, [
    inputText,
    sortType,
    sortOrder,
    caseSensitive,
    removeDuplicates,
    sortLength
  ]);

  const copy = () => navigator.clipboard.writeText(outputText);

  const download = () => {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sorted_text.txt";
    a.click();
  };

  const reset = () => {
    setInputText("");
    setOutputText("");
  };

  const sample = () => {
    setInputText("banana\napple\norange\nbanana\nkiwi");
  };

  return (
    <div className="max-w-6xl mx-auto p-2 space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow border border-slate-200 dark:border-slate-700">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <ArrowUpDown size={20}/> Text Sorter
          </h2>

          <button
            onClick={sample}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <Wand2 size={16}/> Sample
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste text..."
            className="w-full h-52 border border-slate-200 dark:border-slate-600 rounded-xl p-4 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />

          <textarea
            value={outputText}
            readOnly
            className="w-full h-52 border border-slate-200 dark:border-slate-600 rounded-xl p-4 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value as any)}
            className="border border-slate-200 dark:border-slate-600 px-3 py-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value="lines">Lines</option>
            <option value="words">Words</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="border border-slate-200 dark:border-slate-600 px-3 py-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <input 
              type="checkbox" 
              checked={caseSensitive}
              onChange={(e)=>setCaseSensitive(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
            />
            Case Sensitive
          </label>

          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <input 
              type="checkbox" 
              checked={removeDuplicates}
              onChange={(e)=>setRemoveDuplicates(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
            />
            Remove Duplicates
          </label>

          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <input 
              type="checkbox" 
              checked={sortLength}
              onChange={(e)=>setSortLength(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
            />
            Sort by Length
          </label>

          <button onClick={copy} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Copy size={16}/>
          </button>

          <button onClick={download} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <Download size={16}/>
          </button>

          <button onClick={reset} className="px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
            <RotateCcw size={16}/>
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Sorted Items: <b className="text-slate-900 dark:text-white">{stats.total}</b>
        </div>

      </div>
    </div>
  );
};

export default TextSorter;
