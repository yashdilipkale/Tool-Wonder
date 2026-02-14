import React, { useState, useEffect } from "react";
import { Lock, Copy, Upload, RotateCcw, Hash, Key } from "lucide-react";
import CryptoJS from "crypto-js";
import { useTheme } from "../ThemeContext";

interface HashResult {
  algorithm: string;
  hash: string;
  length: number;
}

const HashGenerator: React.FC = () => {
  const { theme } = useTheme();
  const [inputText, setInputText] = useState("Hello World");
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([
    "SHA-256",
  ]);
  const [hashResults, setHashResults] = useState<HashResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputType, setInputType] = useState<"text" | "file">("text");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const algorithms = [
    { name: "MD5", value: "MD5", length: 128 },
    { name: "SHA-1", value: "SHA-1", length: 160 },
    { name: "SHA-256", value: "SHA-256", length: 256 },
    { name: "SHA-384", value: "SHA-384", length: 384 },
    { name: "SHA-512", value: "SHA-512", length: 512 },
  ];

  /* HASH FUNCTION */
  const generateHash = async (
    data: string | ArrayBuffer,
    algorithm: string
  ): Promise<string> => {
    if (algorithm === "MD5") {
      const text =
        typeof data === "string"
          ? data
          : new TextDecoder().decode(data);

      return CryptoJS.MD5(text).toString();
    }

    const encoder = new TextEncoder();
    const buffer =
      typeof data === "string" ? encoder.encode(data) : data;

    const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  };

  const generateAllHashes = async () => {
    if (!inputText && !selectedFile) return;

    setIsGenerating(true);

    const results: HashResult[] = [];
    const data = selectedFile
      ? await selectedFile.arrayBuffer()
      : inputText;

    for (const algorithm of selectedAlgorithms) {
      const hash = await generateHash(data, algorithm);
      const algoInfo = algorithms.find(a => a.value === algorithm);
      results.push({
        algorithm,
        hash,
        length: algoInfo?.length || 0,
      });
    }

    setHashResults(results);
    setIsGenerating(false);
  };

  useEffect(() => {
    generateAllHashes();
  }, [inputText, selectedAlgorithms, selectedFile]);

  const handleAlgorithmToggle = (algorithm: string) => {
    setSelectedAlgorithms(prev =>
      prev.includes(algorithm)
        ? prev.filter(a => a !== algorithm)
        : [...prev, algorithm]
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setInputType("file");
    }
  };

  const handleCopyHash = async (hash: string) =>
    navigator.clipboard.writeText(hash);

  const handleReset = () => {
    setInputText("Hello World");
    setSelectedFile(null);
    setInputType("text");
    setSelectedAlgorithms(["SHA-256"]);
    setHashResults([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center">
        <div className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white mb-4">
          <Lock size={30} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Hash Generator</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Generate MD5 / SHA hashes instantly
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* INPUT */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
            <Key size={18} /> Input
          </h2>

          {inputType === "text" ? (
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="w-full h-36 border border-slate-200 dark:border-slate-600 rounded-xl p-4 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          ) : (
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 block text-center cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
              <Upload className="mx-auto mb-3 text-slate-500 dark:text-slate-400" />
              Upload file
              <input type="file" hidden onChange={handleFileSelect} />
            </label>
          )}

          <div className="grid grid-cols-2 gap-3">
            {algorithms.map(a => (
              <label key={a.value} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={selectedAlgorithms.includes(a.value)}
                  onChange={() => handleAlgorithmToggle(a.value)}
                  className="accent-amber-600"
                />
                {a.name}
              </label>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <RotateCcw className="inline mr-2" size={16} /> Reset
          </button>
        </div>

        {/* OUTPUT */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
            <Hash size={18} /> Hash Results
          </h2>

          {isGenerating ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            hashResults.map((r, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">{r.algorithm}</span>
                  <button
                    onClick={() => handleCopyHash(r.hash)}
                    className="px-2 py-1 text-sm bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center gap-1 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Copy size={14} /> Copy
                  </button>
                </div>
                <div className="font-mono text-sm break-all bg-slate-50 dark:bg-slate-700 p-3 rounded text-slate-900 dark:text-white">
                  {r.hash}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HashGenerator;
