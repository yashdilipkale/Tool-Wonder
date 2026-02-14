import React, { useState, useEffect } from "react";
import { Zap, Copy, RotateCcw } from "lucide-react";
import { useTheme } from "../ThemeContext";

interface GrammarIssue {
  id: string;
  message: string;
  suggestion: string;
}

const GrammarChecker: React.FC = () => {
  const { theme } = useTheme();
  const [inputText, setInputText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [issues, setIssues] = useState<GrammarIssue[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  /* ---------- REAL API CHECK ---------- */
  const handleCheck = async () => {
    if (!inputText.trim()) return;

    setIsChecking(true);

    try {
      const response = await fetch(
        "https://api.languagetool.org/v2/check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            text: inputText,
            language: "en-US",
          }),
        }
      );

      const data = await response.json();

      let corrected = inputText;
      const detectedIssues: GrammarIssue[] = [];

      data.matches.forEach((m: any, index: number) => {
        const suggestion = m.replacements[0]?.value || "";
        detectedIssues.push({
          id: index.toString(),
          message: m.message,
          suggestion,
        });

        if (suggestion) {
          corrected =
            corrected.slice(0, m.offset) +
            suggestion +
            corrected.slice(m.offset + m.length);
        }
      });

      setCorrectedText(corrected);
      setIssues(detectedIssues);
    } catch (err) {
      console.error(err);
    }

    setIsChecking(false);
  };

  const reset = () => {
    setInputText("");
    setCorrectedText("");
    setIssues([]);
  };

  useEffect(() => {
    setWordCount(inputText.trim().split(/\s+/).filter(Boolean).length);
  }, [inputText]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-5 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white">Grammar Checker</h1>

      <textarea
        className="w-full h-52 border border-slate-200 dark:border-slate-600 rounded-xl p-3 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        placeholder="Paste text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          onClick={handleCheck}
          disabled={isChecking}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl flex gap-2 items-center transition-colors disabled:opacity-50"
        >
          <Zap size={16} />
          {isChecking ? "Checking..." : "Check Grammar"}
        </button>

        <button
          onClick={reset}
          className="border border-slate-200 dark:border-slate-600 px-5 py-2 rounded-xl flex gap-2 items-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="border border-slate-200 dark:border-slate-600 rounded-xl p-3 min-h-[150px] bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white">
        {correctedText || "Corrected text will appear here"}
      </div>

      {issues.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-slate-900 dark:text-white">Issues</h3>
          {issues.map((i) => (
            <div key={i.id} className="border border-slate-200 dark:border-slate-600 rounded-lg p-2 text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white">
              {i.message} → <b className="text-blue-600 dark:text-blue-400">{i.suggestion}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GrammarChecker;
