import React, { useState } from "react";
import { Brackets, Copy, Download, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { useTheme } from "../ThemeContext";

const JSONFormatter: React.FC = () => {
  const { theme } = useTheme();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [indentSize, setIndentSize] = useState(2);

  const processJSON = (type: "format" | "minify" | "validate") => {
    setError("");
    setIsValid(null);

    if (!input.trim()) {
      setError("Please enter JSON");
      return;
    }

    try {
      const parsed = JSON.parse(input);

      if (type === "format") {
        setOutput(JSON.stringify(parsed, null, indentSize));
      } else if (type === "minify") {
        setOutput(JSON.stringify(parsed));
      } else {
        setOutput("");
      }

      setIsValid(true);
    } catch (err) {
      setError("Invalid JSON: " + (err as Error).message);
      setIsValid(false);
      setOutput("");
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const downloadFile = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setIsValid(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Brackets className="text-blue-600" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              JSON Formatter
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Format, validate and minify JSON instantly
            </p>
          </div>
        </div>

        {/* Input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JSON here..."
          className="w-full h-48 lg:h-60 font-mono text-sm border border-slate-200 dark:border-slate-600 rounded-xl p-3 mb-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        />

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-5">

          <button
            onClick={() => processJSON("format")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Format
          </button>

          <button
            onClick={() => processJSON("minify")}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Minify
          </button>

          <button
            onClick={() => processJSON("validate")}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Validate
          </button>

          <button
            onClick={resetAll}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={16} /> Reset
          </button>

        </div>

        {/* Status */}
        {isValid !== null && (
          <div
            className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${
              isValid ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
            }`}
          >
            {isValid ? <CheckCircle size={18} /> : <XCircle size={18} />}
            {isValid ? "Valid JSON" : "Invalid JSON"}
          </div>
        )}

        {error && <div className="text-red-600 dark:text-red-400 mb-3">{error}</div>}

        {/* Output */}
        <textarea
          value={output}
          readOnly
          className="w-full h-72 lg:h-[420px] font-mono text-sm border border-slate-200 dark:border-slate-600 rounded-xl p-3 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
        />

        {/* Output Buttons */}
        <div className="flex gap-3 mt-4">

          <button
            disabled={!output}
            onClick={copyToClipboard}
            className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg flex items-center gap-2 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Copy size={16} /> Copy
          </button>

          <button
            disabled={!output}
            onClick={downloadFile}
            className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg flex items-center gap-2 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Download size={16} /> Download
          </button>

        </div>
      </div>
    </div>
  );
};

export default JSONFormatter;
