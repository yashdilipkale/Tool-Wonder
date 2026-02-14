import React, { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle, Info, ArrowLeftRight, RotateCcw } from "lucide-react";
import { useTheme } from "../ThemeContext";

interface ContrastResult {
  ratio: number;
  level: "Fail" | "AA" | "AAA";
  description: string;
}

const ContrastChecker: React.FC = () => {
  const { theme } = useTheme();
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [result, setResult] = useState<ContrastResult | null>(null);

  const hexToRgb = (hex: string) => {
    const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return res
      ? {
          r: parseInt(res[1], 16),
          g: parseInt(res[2], 16),
          b: parseInt(res[3], 16),
        }
      : null;
  };

  const luminance = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;

    const toLinear = (c: number) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    return (
      0.2126 * toLinear(rgb.r) +
      0.7152 * toLinear(rgb.g) +
      0.0722 * toLinear(rgb.b)
    );
  };

  const contrastRatio = (c1: string, c2: string) => {
    const l1 = luminance(c1);
    const l2 = luminance(c2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  useEffect(() => {
    const ratio = contrastRatio(foreground, background);
    let level: "Fail" | "AA" | "AAA" = "Fail";
    let description = "Fails accessibility standards";

    if (ratio >= 7) {
      level = "AAA";
      description = "Excellent contrast (AAA)";
    } else if (ratio >= 4.5) {
      level = "AA";
      description = "Good contrast (AA)";
    }

    setResult({
      ratio: Number(ratio.toFixed(2)),
      level,
      description,
    });
  }, [foreground, background]);

  const swap = () => {
    const t = foreground;
    setForeground(background);
    setBackground(t);
  };

  const reset = () => {
    setForeground("#000000");
    setBackground("#ffffff");
  };

  const levelColor = {
    AAA: "text-green-600",
    AA: "text-blue-600",
    Fail: "text-red-600",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg mb-4">
          <Eye size={28} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Contrast Checker
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Check WCAG accessibility contrast instantly
        </p>
      </div>

      {/* Inputs */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* Foreground */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-4">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Text Color</h3>

          <div className="flex gap-3">
            <input
              type="color"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="w-14 h-12 rounded-lg"
            />
            <input
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="flex-1 border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors"
            />
          </div>
        </div>

        {/* Background */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-4">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Background Color</h3>

          <div className="flex gap-3">
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-14 h-12 rounded-lg"
            />
            <input
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="flex-1 border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={swap}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-700 text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeftRight size={16} />
          Swap Colors
        </button>

        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gray-600 text-white hover:bg-gray-700 transition-colors"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* Preview */}
      <div
        className="rounded-3xl shadow-xl p-12 text-center text-xl font-semibold"
        style={{ background: background, color: foreground }}
      >
        Sample Text Preview
      </div>

      {/* Result */}
      {result && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 text-center">
          <div className={`text-4xl font-bold ${levelColor[result.level]}`}>
            {result.ratio}:1
          </div>
          <p className="text-lg mt-2 text-slate-900 dark:text-white">{result.description}</p>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-xl text-sm text-blue-700 dark:text-blue-300">
        <div className="flex items-center gap-2 mb-2 font-semibold">
          <Info size={16} /> WCAG Guide
        </div>
        AA ≥ 4.5 | AAA ≥ 7.0
      </div>
    </div>
  );
};

export default ContrastChecker;
