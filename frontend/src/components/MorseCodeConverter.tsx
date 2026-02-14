import React, { useState } from "react";
import { Zap, ArrowRightLeft, Copy, CheckCircle, RotateCcw } from "lucide-react";
import { useTheme } from "../ThemeContext";

const MorseCodeConverter: React.FC = () => {
  const { theme } = useTheme();
  const [mode, setMode] = useState<"text-to-morse" | "morse-to-text">("text-to-morse");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const morseCodeMap: Record<string, string> = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
    G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
    M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
    S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
    Y: "-.--", Z: "--..",
    0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-",
    5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----."
  };

  const reverseMap: Record<string, string> = {};
  Object.entries(morseCodeMap).forEach(([k, v]) => (reverseMap[v] = k));

  const convert = (val: string) => {
    if (!val.trim()) return setOutput("");

    if (mode === "text-to-morse") {
      setOutput(
        val
          .toUpperCase()
          .split("")
          .map((c) => (c === " " ? "/" : morseCodeMap[c] || c))
          .join(" ")
      );
    } else {
      setOutput(
        val
          .split(" ")
          .map((m) => (m === "/" ? " " : reverseMap[m] || ""))
          .join("")
      );
    }
  };

  const handleChange = (v: string) => {
    setInput(v);
    convert(v);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
          <Zap className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Morse Code Converter
          </h2>
          <p className="text-slate-500 text-sm">
            Convert instantly between text and Morse code
          </p>
        </div>
      </div>

      {/* Toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
          <button
            onClick={() => setMode("text-to-morse")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              mode === "text-to-morse"
                ? "bg-white dark:bg-slate-600 shadow"
                : ""
            }`}
          >
            Text → Morse
          </button>
          <button
            onClick={() => setMode("morse-to-text")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              mode === "morse-to-text"
                ? "bg-white dark:bg-slate-600 shadow"
                : ""
            }`}
          >
            Morse → Text
          </button>
        </div>
      </div>

      {/* Input */}
      <textarea
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter input..."
        className="w-full h-36 border border-slate-200 dark:border-slate-600 rounded-xl p-4 font-mono text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white mb-4"
      />

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <button
          onClick={() => {
            setMode(mode === "text-to-morse" ? "morse-to-text" : "text-to-morse");
            reset();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          <ArrowRightLeft size={16} />
          Swap
        </button>

        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          <RotateCcw size={16} />
          Reset
        </button>

        {output && (
          <button
            onClick={copy}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      {/* Output */}
      <textarea
        readOnly
        value={output}
        placeholder="Output..."
        className="w-full h-36 border border-slate-200 dark:border-slate-600 rounded-xl p-4 font-mono text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
      />
    </div>
  );
};

export default MorseCodeConverter;
