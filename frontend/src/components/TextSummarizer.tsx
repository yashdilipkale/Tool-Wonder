import React, { useState } from "react";
import { useTheme } from "../ThemeContext";

const TextSummarizer: React.FC = () => {
  const { theme } = useTheme();
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "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";

  const summarize = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: text,
            options: { wait_for_model: true } // IMPORTANT
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSummary(data[0]?.summary_text || "No summary generated");
      }
    } catch (err) {
      setError("Network error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-2 bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold mb-4 text-center text-slate-900 dark:text-white">
        AI Text Summarizer
      </h2>

      <textarea
        className="w-full border border-slate-200 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your long text here..."
      />

      <button
        onClick={summarize}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      {error && (
        <div className="mt-4 text-red-600 text-sm">{error}</div>
      )}

      {summary && (
        <div className="mt-4 bg-slate-50 dark:bg-slate-700 p-4 rounded-xl">
          <b className="text-slate-900 dark:text-white">Summary:</b>
          <p className="text-slate-900 dark:text-white">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default TextSummarizer;
