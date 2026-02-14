import React, { useState, useEffect } from "react";
import { Type, Copy, Download, RotateCcw, Clipboard } from "lucide-react";
import { useTheme } from "../ThemeContext";

const TextCaseConverter: React.FC = () => {
  const { theme } = useTheme();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [selectedCase, setSelectedCase] = useState("sentence");

  const convertText = () => {
    let converted = inputText;

    switch (selectedCase) {
      case "sentence":
        converted = inputText.replace(/(^\w|\.\s*\w)/g, (m) => m.toUpperCase());
        break;
      case "title":
        converted = inputText.replace(/\b\w/g, (m) => m.toUpperCase());
        break;
      case "uppercase":
        converted = inputText.toUpperCase();
        break;
      case "lowercase":
        converted = inputText.toLowerCase();
        break;
      case "camel":
        const words = inputText.toLowerCase().split(/\s+/);
        converted =
          words[0] +
          words
            .slice(1)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join("");
        break;
      case "pascal":
        converted = inputText
          .toLowerCase()
          .replace(/\b\w/g, (m) => m.toUpperCase())
          .replace(/\s+/g, "");
        break;
      case "snake":
        converted = inputText.toLowerCase().replace(/\s+/g, "_");
        break;
      case "kebab":
        converted = inputText.toLowerCase().replace(/\s+/g, "-");
        break;
    }

    setOutputText(converted);
  };

  useEffect(() => {
    convertText();
  }, [inputText, selectedCase]);

  const copy = () => navigator.clipboard.writeText(outputText);

  const paste = async () => {
    const txt = await navigator.clipboard.readText();
    setInputText(txt);
  };

  const clear = () => {
    setInputText("");
    setOutputText("");
  };

  const download = () => {
    const blob = new Blob([outputText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "converted_text.txt";
    link.click();
  };

  const stats = {
    chars: inputText.length,
    words: inputText.trim() ? inputText.trim().split(/\s+/).length : 0,
    lines: inputText.split("\n").length,
  };

  return (
    <div className="max-w-6xl mx-auto p-2 bg-white dark:bg-slate-800 rounded-2xl shadow">
      <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2 text-slate-900 dark:text-white">
        <Type size={22} /> Text Case Converter
      </h2>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <div className="flex gap-2 mb-2">
            <button onClick={paste} className="text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded text-slate-900 dark:text-white transition-colors">
              <Clipboard size={14} className="inline mr-1" /> Paste
            </button>
            <button onClick={clear} className="text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded text-slate-900 dark:text-white transition-colors">
              Clear
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={10}
            className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            placeholder="Enter text..."
          />

          {/* Quick Buttons */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {["uppercase", "lowercase", "title", "sentence"].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCase(c)}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm text-slate-900 dark:text-white transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="flex justify-end gap-2 mb-2">
            <button onClick={copy} className="text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded text-slate-900 dark:text-white transition-colors">
              <Copy size={14} className="inline mr-1" /> Copy
            </button>
            <button onClick={download} className="text-sm bg-blue-600 text-white px-3 py-1 rounded transition-colors hover:bg-blue-700">
              <Download size={14} className="inline mr-1" /> Download
            </button>
          </div>

          <textarea
            value={outputText}
            readOnly
            rows={10}
            className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 text-center">
        <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
          <div className="text-xl font-bold text-slate-900 dark:text-white">{stats.chars}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Characters</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
          <div className="text-xl font-bold text-slate-900 dark:text-white">{stats.words}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Words</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
          <div className="text-xl font-bold text-slate-900 dark:text-white">{stats.lines}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Lines</div>
        </div>
      </div>
    </div>
  );
};

export default TextCaseConverter;
