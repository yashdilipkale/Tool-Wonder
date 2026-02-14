import React, { useState, useEffect } from "react";
import {
  Fingerprint,
  Copy,
  RefreshCw,
  Download,
  List,
} from "lucide-react";
import { useTheme } from "../ThemeContext";

const UUIDGenerator: React.FC = () => {
  const { theme } = useTheme();
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [format, setFormat] = useState<
    "standard" | "uppercase" | "braces" | "parentheses" | "nohyphen"
  >("standard");

  // Generate Secure UUID
  const generateUUID = () => {
    return crypto.randomUUID();
  };

  // Format UUID
  const formatUUID = (uuid: string) => {
    switch (format) {
      case "uppercase":
        return uuid.toUpperCase();
      case "braces":
        return `{${uuid}}`;
      case "parentheses":
        return `(${uuid})`;
      case "nohyphen":
        return uuid.replace(/-/g, "");
      default:
        return uuid;
    }
  };

  // Generate UUID list
  const generateUUIDs = () => {
    const list = Array.from({ length: count }, () =>
      formatUUID(generateUUID())
    );
    setUuids(list);
  };

  useEffect(() => {
    generateUUIDs();
  }, [count, format]);

  // Copy
  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const copyAll = async () => {
    await copyText(uuids.join("\n"));
  };

  // Download
  const downloadUUIDs = () => {
    const blob = new Blob([uuids.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uuids-${count}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <Fingerprint className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            UUID Generator
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Generate secure unique identifiers instantly
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Count */}
        <div>
          <label className="block text-sm font-medium mb-2">Count</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {[1, 5, 10, 25, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num} UUIDs
              </option>
            ))}
          </select>
        </div>

        {/* Format */}
        <div>
          <label className="block text-sm font-medium mb-2">Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as any)}
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="standard">Standard</option>
            <option value="uppercase">Uppercase</option>
            <option value="braces">Braces {`{}`}</option>
            <option value="parentheses">Parentheses ()</option>
            <option value="nohyphen">No Hyphens</option>
          </select>
        </div>

        {/* Generate Button */}
        <div className="flex items-end">
          <button
            onClick={generateUUIDs}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} /> Regenerate
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={copyAll}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center gap-2 transition-colors"
        >
          <Copy size={16} /> Copy All
        </button>

        <button
          onClick={downloadUUIDs}
          className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl flex items-center gap-2 transition-colors"
        >
          <Download size={16} /> Download
        </button>
      </div>

      {/* UUID List */}
      <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-4 max-h-[400px] overflow-y-auto space-y-3">
        {uuids.map((uuid, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 w-6">
                {index + 1}.
              </span>
              <span className="font-mono text-sm break-all">
                {uuid}
              </span>
            </div>

            <button
              onClick={() => copyText(uuid)}
              className="text-slate-500 hover:text-blue-600 transition-colors"
            >
              <Copy size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-700 dark:text-blue-300">
        <p>
          UUID v4 is generated using secure browser crypto API.
          Format: 8-4-4-4-12 hexadecimal characters.
        </p>
      </div>
    </div>
  );
};

export default UUIDGenerator;
