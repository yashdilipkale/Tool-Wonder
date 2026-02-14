import React, { useState, useEffect } from "react";
import { Copy, Download, RotateCcw, Lock, Unlock, Key } from "lucide-react";
import { useTheme } from "../ThemeContext";

const TextEncryptor: React.FC = () => {
  const { theme } = useTheme();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [algorithm, setAlgorithm] = useState<"caesar" | "vigenere" | "base64">(
    "caesar"
  );
  const [key, setKey] = useState("3");

  /* ---------- CIPHERS ---------- */

  const caesarCipher = (text: string, shift: number, decrypt = false) => {
    const actualShift = decrypt ? (26 - shift) % 26 : shift % 26;
    return text.replace(/[a-zA-Z]/g, (char) => {
      const base = char >= "a" ? 97 : 65;
      return String.fromCharCode(
        ((char.charCodeAt(0) - base + actualShift) % 26) + base
      );
    });
  };

  const vigenereCipher = (text: string, keyword: string, decrypt = false) => {
    const cleanKey = keyword.toUpperCase().replace(/[^A-Z]/g, "");
    if (!cleanKey) return text;

    let result = "";
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (/[a-zA-Z]/.test(char)) {
        const base = char >= "a" ? 97 : 65;
        const keyShift =
          cleanKey[keyIndex % cleanKey.length].charCodeAt(0) - 65;
        const shift = decrypt ? (26 - keyShift) % 26 : keyShift;
        result += String.fromCharCode(
          ((char.charCodeAt(0) - base + shift) % 26) + base
        );
        keyIndex++;
      } else result += char;
    }
    return result;
  };

  const base64Encode = (text: string) =>
    btoa(
      new TextEncoder()
        .encode(text)
        .reduce((d, b) => d + String.fromCharCode(b), "")
    );

  const base64Decode = (text: string) => {
    try {
      const binary = atob(text);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    } catch {
      return "Invalid Base64";
    }
  };

  /* ---------- PROCESS ---------- */

  const processText = () => {
    try {
      if (!inputText.trim()) {
        setOutputText("");
        return;
      }

      let result = "";

      switch (algorithm) {
        case "caesar":
          result = caesarCipher(
            inputText,
            parseInt(key) || 3,
            mode === "decrypt"
          );
          break;
        case "vigenere":
          result = vigenereCipher(inputText, key, mode === "decrypt");
          break;
        case "base64":
          result =
            mode === "encrypt"
              ? base64Encode(inputText)
              : base64Decode(inputText);
          break;
      }

      setOutputText(result);
    } catch {
      setOutputText("Processing error");
    }
  };

  useEffect(() => {
    processText();
  }, [inputText, algorithm, key, mode]);

  /* ---------- ACTIONS ---------- */

  const copyOutput = () => navigator.clipboard.writeText(outputText);

  const downloadOutput = () => {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "encrypted_text.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setInputText("");
    setOutputText("");
    setKey("3");
    setAlgorithm("caesar");
    setMode("encrypt");
  };

  /* ---------- UI ---------- */

  return (
    <div className="max-w-6xl mx-auto p-2">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-200 dark:border-slate-700 p-6">

        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-white">
            <Lock size={20} /> Text Encryptor
          </h2>

          <button
            onClick={reset}
            className="flex items-center gap-2 px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* INPUT */}
          <div>
            <textarea
              className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 h-48 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              placeholder="Enter text..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />

            <div className="grid grid-cols-3 gap-3 mt-4">
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="encrypt">Encrypt</option>
                <option value="decrypt">Decrypt</option>
              </select>

              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as any)}
                className="border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="caesar">Caesar</option>
                <option value="vigenere">Vigenere</option>
                <option value="base64">Base64</option>
              </select>

              {(algorithm === "caesar" || algorithm === "vigenere") && (
                <input
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Key"
                />
              )}
            </div>
          </div>

          {/* OUTPUT */}
          <div>
            <textarea
              readOnly
              className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 h-48 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
              placeholder="Output..."
              value={outputText}
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={copyOutput}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Copy size={14} /> Copy
              </button>

              <button
                onClick={downloadOutput}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={14} /> Download
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TextEncryptor;
