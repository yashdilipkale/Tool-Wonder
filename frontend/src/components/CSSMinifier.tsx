import React, { useState, useEffect } from "react";
import {
  Palette,
  Copy,
  RotateCcw,
  Settings,
  Zap,
  BarChart3,
  FileText
} from "lucide-react";
import { useTheme } from "../ThemeContext";

const CSSMinifier: React.FC = () => {
  const { theme } = useTheme();
  const [inputCSS, setInputCSS] = useState("");
  const [minifiedCSS, setMinifiedCSS] = useState("");
  const [isMinifying, setIsMinifying] = useState(false);

  const [removeComments, setRemoveComments] = useState(true);
  const [removeWhitespace, setRemoveWhitespace] = useState(true);
  const [shortenColors, setShortenColors] = useState(true);

  const [stats, setStats] = useState({
    originalSize: 0,
    minifiedSize: 0,
    savings: 0,
    savingsPercentage: 0
  });

  const minifyCSS = (css: string) => {
    let result = css;

    if (removeComments) result = result.replace(/\/\*[\s\S]*?\*\//g, "");
    if (removeWhitespace) result = result.replace(/\s+/g, " ");
    if (shortenColors)
      result = result.replace(
        /#([a-fA-F0-9])\1([a-fA-F0-9])\2([a-fA-F0-9])\3/g,
        "#$1$2$3"
      );

    return result.trim();
  };

  useEffect(() => {
    if (!inputCSS) return;

    setIsMinifying(true);

    setTimeout(() => {
      const out = minifyCSS(inputCSS);
      setMinifiedCSS(out);

      const originalSize = new Blob([inputCSS]).size;
      const minifiedSize = new Blob([out]).size;
      const savings = originalSize - minifiedSize;

      setStats({
        originalSize,
        minifiedSize,
        savings,
        savingsPercentage: (savings / originalSize) * 100
      });

      setIsMinifying(false);
    }, 300);
  }, [inputCSS, removeComments, removeWhitespace, shortenColors]);

  const copy = async () => {
    await navigator.clipboard.writeText(minifiedCSS);
  };

  const reset = () => {
    setInputCSS("");
    setMinifiedCSS("");
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <Palette size={40} className="text-pink-600 mb-2" />
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">CSS Minifier</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Compress and optimize CSS instantly
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Input */}
        <div className="space-y-4">
          <h2 className="font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
            <FileText size={18}/> Input CSS
          </h2>

          <textarea
            value={inputCSS}
            onChange={(e) => setInputCSS(e.target.value)}
            className="w-full h-72 lg:h-[420px] font-mono border border-slate-200 dark:border-slate-600 rounded-xl p-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            placeholder="Paste CSS here..."
          />

          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <input type="checkbox" checked={removeComments} onChange={e=>setRemoveComments(e.target.checked)} className="accent-pink-600" />
              Remove Comments
            </label>

            <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <input type="checkbox" checked={removeWhitespace} onChange={e=>setRemoveWhitespace(e.target.checked)} className="accent-pink-600" />
              Remove Spaces
            </label>

            <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <input type="checkbox" checked={shortenColors} onChange={e=>setShortenColors(e.target.checked)} className="accent-pink-600" />
              Shorten Colors
            </label>
          </div>

          <button
            onClick={reset}
            className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw size={16}/> Reset
          </button>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
              <Zap size={18}/> Minified CSS
            </h2>
            <button
              onClick={copy}
              className="px-3 py-1 border border-slate-200 dark:border-slate-600 rounded flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Copy size={14}/> Copy
            </button>
          </div>

          <textarea
            value={minifiedCSS}
            readOnly
            className="w-full h-72 lg:h-[420px] font-mono border border-slate-200 dark:border-slate-600 rounded-xl p-3 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
          />

          {minifiedCSS && (
            <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 text-sm">
              <div className="flex items-center gap-2 mb-2 text-slate-900 dark:text-white">
                <BarChart3 size={16}/> Compression Stats
              </div>
              <div className="text-slate-900 dark:text-white">Original: {stats.originalSize} bytes</div>
              <div className="text-slate-900 dark:text-white">Minified: {stats.minifiedSize} bytes</div>
              <div className="text-green-600 dark:text-green-400 font-medium">
                Saved: {stats.savingsPercentage.toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSSMinifier;
