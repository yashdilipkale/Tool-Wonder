import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

interface ContrastResult {
  ratio: number;
  aa: {
    normal: boolean;
    large: boolean;
  };
  aaa: {
    normal: boolean;
    large: boolean;
  };
  level: 'Fail' | 'AA' | 'AAA';
  description: string;
}

const ContrastChecker: React.FC = () => {
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');
  const [result, setResult] = useState<ContrastResult | null>(null);

  // Calculate relative luminance
  const getRelativeLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;

    const { r, g, b } = rgb;

    // Convert to linear RGB
    const toLinear = (c: number) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    const rLinear = toLinear(r);
    const gLinear = toLinear(g);
    const bLinear = toLinear(b);

    // Calculate luminance
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  };

  // Calculate contrast ratio
  const getContrastRatio = (color1: string, color2: string): number => {
    const lum1 = getRelativeLuminance(color1);
    const lum2 = getRelativeLuminance(color2);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  };

  // Evaluate contrast against WCAG guidelines
  const evaluateContrast = (ratio: number): ContrastResult => {
    const aa = {
      normal: ratio >= 4.5,
      large: ratio >= 3.0
    };

    const aaa = {
      normal: ratio >= 7.0,
      large: ratio >= 4.5
    };

    let level: 'Fail' | 'AA' | 'AAA';
    let description: string;

    if (aaa.normal) {
      level = 'AAA';
      description = 'Passes AAA level for both normal and large text';
    } else if (aa.normal) {
      level = 'AA';
      description = 'Passes AA level for normal text';
    } else if (aa.large) {
      level = 'AA';
      description = 'Passes AA level for large text only';
    } else {
      level = 'Fail';
      description = 'Fails WCAG accessibility standards';
    }

    return {
      ratio: Math.round(ratio * 100) / 100,
      aa,
      aaa,
      level,
      description
    };
  };

  // Convert HEX to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Swap colors
  const swapColors = () => {
    const temp = foreground;
    setForeground(background);
    setBackground(temp);
  };

  // Reset to default
  const resetColors = () => {
    setForeground('#000000');
    setBackground('#ffffff');
  };

  // Calculate contrast when colors change
  useEffect(() => {
    const ratio = getContrastRatio(foreground, background);
    const evaluation = evaluateContrast(ratio);
    setResult(evaluation);
  }, [foreground, background]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'AAA': return 'text-green-600 dark:text-green-400';
      case 'AA': return 'text-blue-600 dark:text-blue-400';
      case 'Fail': return 'text-red-600 dark:text-red-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getLevelBgColor = (level: string) => {
    switch (level) {
      case 'AAA': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'AA': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'Fail': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'AAA': return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'AA': return <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Fail': return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default: return <AlertTriangle className="w-5 h-5 text-slate-600 dark:text-slate-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Contrast Checker</h2>
          <p className="text-slate-600 dark:text-slate-400">Check WCAG accessibility contrast ratios</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Color Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Foreground Color */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Foreground (Text) Color
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={foreground}
                  onChange={(e) => setForeground(e.target.value)}
                  className="w-12 h-10 rounded border border-slate-300 dark:border-slate-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={foreground}
                  onChange={(e) => setForeground(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm"
                  placeholder="#000000"
                />
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-slate-300 dark:border-slate-500"
                  style={{ backgroundColor: foreground }}
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Text preview on background
                </span>
              </div>
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Background Color
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="w-12 h-10 rounded border border-slate-300 dark:border-slate-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm"
                  placeholder="#ffffff"
                />
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-slate-300 dark:border-slate-500"
                  style={{ backgroundColor: background }}
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Background color
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={swapColors}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Swap Colors
          </button>
          <button
            onClick={resetColors}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Preview */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Preview</h3>
          <div
            className="p-6 rounded-lg border border-slate-300 dark:border-slate-600 min-h-[120px] flex items-center justify-center"
            style={{ backgroundColor: background, color: foreground }}
          >
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">Sample Text</p>
              <p className="text-sm opacity-80">This is how your text will appear with the selected colors.</p>
              <p className="text-xs opacity-60 mt-2">Small text for reference</p>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Contrast Results</h3>

            {/* Main Result */}
            <div className={`p-4 rounded-lg border ${getLevelBgColor(result.level)}`}>
              <div className="flex items-center gap-3 mb-3">
                {getLevelIcon(result.level)}
                <div>
                  <div className={`text-lg font-bold ${getLevelColor(result.level)}`}>
                    {result.level} Level
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Contrast Ratio: {result.ratio}:1
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {result.description}
              </p>
            </div>

            {/* Detailed Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* AA Level */}
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">AA Level (WCAG 2.1)</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Normal text (≥4.5:1)</span>
                    {result.aa.normal ? (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Large text (≥3.0:1)</span>
                    {result.aa.large ? (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* AAA Level */}
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">AAA Level (WCAG 2.1)</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Normal text (≥7.0:1)</span>
                    {result.aaa.normal ? (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Large text (≥4.5:1)</span>
                    {result.aaa.large ? (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WCAG Guidelines */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            WCAG Guidelines
          </h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
            <p><strong>AA Level:</strong> Minimum requirement for accessibility</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Normal text: 4.5:1 contrast ratio</li>
              <li>Large text (18pt+ or 14pt+ bold): 3.0:1 contrast ratio</li>
            </ul>
            <p><strong>AAA Level:</strong> Enhanced accessibility</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Normal text: 7.0:1 contrast ratio</li>
              <li>Large text: 4.5:1 contrast ratio</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContrastChecker;
