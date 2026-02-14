import React, { useState, useMemo, useCallback } from "react";
import { ArrowRightLeft, Copy, RotateCcw } from "lucide-react";
import { useTheme } from "../ThemeContext";

interface DiffResult {
  type: "add" | "remove" | "equal";
  value: string;
  lineNumber?: number;
}

const TextDiffChecker: React.FC = () => {
  const { theme } = useTheme();
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);

  /* ---------- Normalize ---------- */
  const normalize = useCallback(
    (t: string) => {
      let s = t;
      if (!caseSensitive) s = s.toLowerCase();
      if (ignoreWhitespace) s = s.replace(/\s+/g, " ").trim();
      return s;
    },
    [ignoreWhitespace, caseSensitive]
  );

  /* ---------- DIFF ---------- */
  const diffResult: DiffResult[] = useMemo(() => {
    const oldLines = text1.split("\n");
    const newLines = text2.split("\n");

    const result: DiffResult[] = [];
    let i = 0;
    let j = 0;

    while (i < oldLines.length || j < newLines.length) {
      const o = oldLines[i] || "";
      const n = newLines[j] || "";

      if (i < oldLines.length && j < newLines.length && normalize(o) === normalize(n)) {
        result.push({ type: "equal", value: o, lineNumber: i + 1 });
        i++;
        j++;
      } else if (i < oldLines.length) {
        result.push({ type: "remove", value: o, lineNumber: i + 1 });
        i++;
      } else if (j < newLines.length) {
        result.push({ type: "add", value: n, lineNumber: j + 1 });
        j++;
      }
    }
    return result;
  }, [text1, text2, normalize]);

  /* ---------- Stats ---------- */
  const stats = useMemo(() => {
    let add = 0,
      del = 0,
      eq = 0;

    diffResult.forEach((d) => {
      if (d.type === "add") add++;
      else if (d.type === "remove") del++;
      else eq++;
    });

    const total = Math.max(text1.split("\n").length, text2.split("\n").length);
    const similarity = total ? Math.round((eq / total) * 100) : 100;

    return { add, del, changes: add + del, similarity };
  }, [diffResult, text1, text2]);

  /* ---------- Copy ---------- */
  const handleCopy = async () => {
    const txt = diffResult
      .map((d) => `${d.type === "add" ? "+" : d.type === "remove" ? "-" : " "} ${d.value}`)
      .join("\n");

    await navigator.clipboard.writeText(txt);
  };

  /* ---------- Reset ---------- */
  const reset = () => {
    setText1("");
    setText2("");
  };

  return (
    <div className="max-w-6xl mx-auto p-2 space-y-4">
      <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white">Professional Text Diff Checker</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <textarea
          value={text1}
          onChange={(e) => setText1(e.target.value)}
          placeholder="Original text..."
          className="border border-slate-200 dark:border-slate-600 p-3 rounded-lg h-40 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        />

        <textarea
          value={text2}
          onChange={(e) => setText2(e.target.value)}
          placeholder="Modified text..."
          className="border border-slate-200 dark:border-slate-600 p-3 rounded-lg h-40 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        />
      </div>

      <div className="flex gap-4 text-sm text-slate-700 dark:text-slate-300">
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={ignoreWhitespace} 
            onChange={(e)=>setIgnoreWhitespace(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
          />
          Ignore whitespace
        </label>
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={caseSensitive} 
            onChange={(e)=>setCaseSensitive(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
          />
          Case sensitive
        </label>
      </div>

      <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 font-mono text-sm max-h-80 overflow-auto bg-slate-50 dark:bg-slate-700">
        {diffResult.map((d, i) => (
          <div key={i} className={d.type === "add" ? "text-green-600 dark:text-green-400" : d.type === "remove" ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-slate-100"}>
            {d.type === "add" ? "+" : d.type === "remove" ? "-" : " "} {d.value}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-300">
          Add: {stats.add} | Delete: {stats.del} | Changes: {stats.changes} | Similarity: {stats.similarity}%
        </div>

        <div className="flex gap-3">
          <button onClick={handleCopy} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
            <Copy size={16} />
          </button>
          <button onClick={reset} className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextDiffChecker;
