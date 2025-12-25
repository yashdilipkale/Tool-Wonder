import React, { useState, useEffect } from 'react';
import { Pipette, Copy, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
  name: string;
}

const ColorConverter: React.FC = () => {
  const [input, setInput] = useState('#3b82f6');
  const [activeFormat, setActiveFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');
  const [colors, setColors] = useState<ColorFormats>({
    hex: '#3b82f6',
    rgb: 'rgb(59, 130, 246)',
    hsl: 'hsl(217, 91%, 60%)',
    name: 'Blue'
  });
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  // Color name mapping (basic colors)
  const colorNames: { [key: string]: string } = {
    '#000000': 'Black',
    '#ffffff': 'White',
    '#ff0000': 'Red',
    '#00ff00': 'Green',
    '#0000ff': 'Blue',
    '#ffff00': 'Yellow',
    '#ff00ff': 'Magenta',
    '#00ffff': 'Cyan',
    '#ffa500': 'Orange',
    '#800080': 'Purple',
    '#ffc0cb': 'Pink',
    '#a52a2a': 'Brown',
    '#808080': 'Gray',
    '#000080': 'Navy',
    '#008000': 'Dark Green',
    '#ff4500': 'Orange Red',
    '#daa520': 'Golden Rod',
    '#98fb98': 'Pale Green',
    '#f0e68c': 'Khaki',
    '#dda0dd': 'Plum'
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

  // Convert RGB to HEX
  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  };

  // Parse RGB string
  const parseRgb = (rgb: string): { r: number; g: number; b: number } | null => {
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3])
      };
    }
    return null;
  };

  // Parse HSL string
  const parseHsl = (hsl: string): { h: number; s: number; l: number } | null => {
    const match = hsl.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/);
    if (match) {
      return {
        h: parseInt(match[1]),
        s: parseInt(match[2]),
        l: parseInt(match[3])
      };
    }
    return null;
  };

  // Update all formats when input changes
  useEffect(() => {
    setError('');
    setIsValid(null);

    try {
      let rgb: { r: number; g: number; b: number } | null = null;

      if (activeFormat === 'hex') {
        rgb = hexToRgb(input);
        if (!rgb) throw new Error('Invalid HEX color');
      } else if (activeFormat === 'rgb') {
        rgb = parseRgb(input);
        if (!rgb) throw new Error('Invalid RGB format. Use: rgb(r, g, b)');
      } else if (activeFormat === 'hsl') {
        const hsl = parseHsl(input);
        if (!hsl) throw new Error('Invalid HSL format. Use: hsl(h, s%, l%)');
        rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      }

      if (!rgb) throw new Error('Unable to parse color');

      // Validate ranges
      if (rgb.r < 0 || rgb.r > 255 || rgb.g < 0 || rgb.g > 255 || rgb.b < 0 || rgb.b > 255) {
        throw new Error('Color values must be between 0 and 255');
      }

      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

      setColors({
        hex: hex,
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`,
        name: colorNames[hex.toLowerCase()] || 'Unknown'
      });

      setIsValid(true);
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
    }
  }, [input, activeFormat]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const randomizeColor = () => {
    const randomHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setInput(randomHex);
    setActiveFormat('hex');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Pipette className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Color Converter</h2>
          <p className="text-slate-600 dark:text-slate-400">Convert between HEX, RGB, and HSL color formats</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Color Preview */}
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-lg border-2 border-slate-300 dark:border-slate-600 shadow-lg"
            style={{ backgroundColor: colors.hex }}
          />
          <div>
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Preview: {colors.name}
            </div>
            <button
              onClick={randomizeColor}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-700 dark:text-slate-300 mt-1"
            >
              <RefreshCw className="w-4 h-4" />
              Random Color
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div>
          <div className="flex items-center gap-4 mb-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Input Format:
            </label>
            <div className="flex gap-2">
              {(['hex', 'rgb', 'hsl'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setActiveFormat(format)}
                  className={`px-3 py-1 text-sm rounded uppercase font-medium transition-colors ${
                    activeFormat === format
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              activeFormat === 'hex' ? '#3b82f6' :
              activeFormat === 'rgb' ? 'rgb(59, 130, 246)' :
              'hsl(217, 91%, 60%)'
            }
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Validation Status */}
        {isValid !== null && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${isValid ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
            {isValid ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <span className={`text-sm font-medium ${isValid ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {isValid ? 'Valid color format' : 'Invalid color format'}
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Output Formats */}
        {isValid && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Converted Formats</h3>

            {/* HEX */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">HEX</div>
                <div className="font-mono text-slate-900 dark:text-white">{colors.hex}</div>
              </div>
              <button
                onClick={() => copyToClipboard(colors.hex)}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-slate-700 dark:text-slate-300"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>

            {/* RGB */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">RGB</div>
                <div className="font-mono text-slate-900 dark:text-white">{colors.rgb}</div>
              </div>
              <button
                onClick={() => copyToClipboard(colors.rgb)}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-slate-700 dark:text-slate-300"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>

            {/* HSL */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">HSL</div>
                <div className="font-mono text-slate-900 dark:text-white">{colors.hsl}</div>
              </div>
              <button
                onClick={() => copyToClipboard(colors.hsl)}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded text-slate-700 dark:text-slate-300"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Usage Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Format Examples</h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p><strong>HEX:</strong> #3b82f6 or #rgb</p>
            <p><strong>RGB:</strong> rgb(59, 130, 246)</p>
            <p><strong>HSL:</strong> hsl(217, 91%, 60%)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorConverter;
