import React, { useState, useEffect } from "react";
import { Database, Copy, Download, ArrowRightLeft, CheckCircle, Trash2 } from "lucide-react";
import { useTheme } from "../ThemeContext";

const Base64Converter: React.FC = () => {
  const { theme } = useTheme();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  // Auto convert
  useEffect(() => {
    if (!input) {
      setOutput("");
      return;
    }

    try {
      if (mode === "encode") setOutput(btoa(input));
      else setOutput(atob(input));
    } catch {
      setOutput("");
    }
  }, [input, mode]);

  const swap = () => {
    setInput(output);
    setOutput("");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "base64-output.txt";
    a.click();
  };

  const clear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Database className="text-blue-600" />
        <h2 className="text-xl font-semibold">Base64 Encoder / Decoder</h2>
      </div>

      {/* Mode Switch */}
      <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1 w-fit">
        <button
          onClick={() => setMode("encode")}
          className={`px-4 py-2 rounded-lg text-sm ${
            mode === "encode" ? "bg-blue-600 text-white" : ""
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`px-4 py-2 rounded-lg text-sm ${
            mode === "decode" ? "bg-blue-600 text-white" : ""
          }`}
        >
          Decode
        </button>
      </div>

      {/* Input */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text here..."
        className="w-full h-36 border border-slate-200 dark:border-slate-600 rounded-xl p-3 font-mono bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
      />

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <button onClick={swap} className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
          <ArrowRightLeft size={16} /> Swap
        </button>

        <button onClick={clear} className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
          <Trash2 size={16} /> Clear
        </button>

        {output && (
          <>
            <button onClick={copy} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy"}
            </button>

            <button onClick={download} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              <Download size={16} /> Download
            </button>
          </>
        )}
      </div>

      {/* Output */}
      <textarea
        readOnly
        value={output}
        placeholder="Output..."
        className="w-full h-36 border border-slate-200 dark:border-slate-600 rounded-xl p-3 font-mono bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
      />

      <div className="text-sm text-slate-500">
        Characters: {output.length}
      </div>
    </div>
  );
};

export default Base64Converter;
