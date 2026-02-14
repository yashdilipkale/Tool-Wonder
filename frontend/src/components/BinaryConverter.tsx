import React, { useState } from "react";
import { Code, Copy, CheckCircle, Trash2 } from "lucide-react";
import { useTheme } from "../ThemeContext";

type BaseType = "binary" | "decimal" | "hexadecimal" | "octal";

const BinaryConverter: React.FC = () => {
  const { theme } = useTheme();
  const [input, setInput] = useState("");
  const [inputBase, setInputBase] = useState<BaseType>("decimal");
  const [copied, setCopied] = useState<string | null>(null);

  const convert = (value: string) => {
    if (!value) return { binary: "", decimal: "", hexadecimal: "", octal: "" };

    let decimal = 0;

    try {
      if (inputBase === "binary") decimal = parseInt(value, 2);
      if (inputBase === "decimal") decimal = parseInt(value, 10);
      if (inputBase === "hexadecimal") decimal = parseInt(value, 16);
      if (inputBase === "octal") decimal = parseInt(value, 8);

      if (isNaN(decimal)) return { binary: "", decimal: "", hexadecimal: "", octal: "" };

      return {
        binary: decimal.toString(2),
        decimal: decimal.toString(10),
        hexadecimal: decimal.toString(16).toUpperCase(),
        octal: decimal.toString(8)
      };
    } catch {
      return { binary: "", decimal: "", hexadecimal: "", octal: "" };
    }
  };

  const results = convert(input);

  const copy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const clearAll = () => setInput("");

  const bases: BaseType[] = ["binary", "decimal", "hexadecimal", "octal"];

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Code className="text-blue-600" />
        <h2 className="text-xl font-semibold">Binary / Base Converter</h2>
      </div>

      {/* Base selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {bases.map((b) => (
          <button
            key={b}
            onClick={() => setInputBase(b)}
            className={`py-2 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors ${
              inputBase === b
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter number..."
          className="flex-1 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 font-mono bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        />
        <button
          onClick={clearAll}
          className="px-3 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(results).map(([key, value]) => (
          <div key={key} className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 bg-slate-50 dark:bg-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold capitalize text-slate-900 dark:text-white">{key}</span>
              {value && (
                <button
                  onClick={() => copy(value, key)}
                  className="text-sm flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {copied === key ? <CheckCircle size={16} /> : <Copy size={16} />}
                  {copied === key ? "Copied" : "Copy"}
                </button>
              )}
            </div>
            <div className="font-mono break-all text-slate-900 dark:text-white">{value || "-"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BinaryConverter;
