import React, { useState, useEffect } from 'react';
import { Grid, Copy, RefreshCw, Palette, Shuffle } from 'lucide-react';

interface ColorScheme {
  name: string;
  description: string;
  colors: string[];
}

const PaletteGenerator: React.FC = () => {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [scheme, setScheme] = useState('complementary');
  const [palettes, setPalettes] = useState<ColorScheme[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<ColorScheme | null>(null);

  // Color schemes
  const schemes = [
    {
      id: 'complementary',
      name: 'Complementary',
      description: 'Colors opposite each other on the color wheel',
      generate: (hsl: { h: number; s: number; l: number }) => [
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
      ]
    },
    {
      id: 'analogous',
      name: 'Analogous',
      description: 'Colors next to each other on the color wheel',
      generate: (hsl: { h: number; s: number; l: number }) => [
        hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
      ]
    },
    {
      id: 'triadic',
      name: 'Triadic',
      description: 'Three colors equally spaced on the color wheel',
      generate: (hsl: { h: number; s: number; l: number }) => [
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
      ]
    },
    {
      id: 'tetradic',
      name: 'Tetradic',
      description: 'Four colors in a rectangular pattern on the color wheel',
      generate: (hsl: { h: number; s: number; l: number }) => [
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l),
      ]
    },
    {
      id: 'split-complementary',
      name: 'Split Complementary',
      description: 'A color and two colors adjacent to its complement',
      generate: (hsl: { h: number; s: number; l: number }) => [
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l),
      ]
    },
    {
      id: 'monochromatic',
      name: 'Monochromatic',
      description: 'Variations of the same hue with different saturation and lightness',
      generate: (hsl: { h: number; s: number; l: number }) => [
        hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 30)),
        hslToHex(hsl.h, hsl.s, Math.max(20, hsl.l - 15)),
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex(hsl.h, hsl.s, Math.min(90, hsl.l + 15)),
        hslToHex(hsl.h, hsl.s, Math.min(95, hsl.l + 30)),
      ]
    }
  ];

  // Convert HSL to HEX
  const hslToHex = (h: number, s: number, l: number): string => {
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

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Convert HEX to HSL
  const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { h: 0, s: 0, l: 0 };

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

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

  // Generate palettes
  const generatePalettes = () => {
    const hsl = hexToHsl(baseColor);
    const newPalettes: ColorScheme[] = schemes.map(schemeData => ({
      name: schemeData.name,
      description: schemeData.description,
      colors: schemeData.generate(hsl)
    }));

    setPalettes(newPalettes);
    setSelectedPalette(newPalettes.find(p => p.name.toLowerCase() === scheme) || newPalettes[0]);
  };

  // Generate random color
  const generateRandomColor = () => {
    const randomHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setBaseColor(randomHex);
  };

  // Copy color to clipboard
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

  // Copy entire palette
  const copyPalette = async (palette: ColorScheme) => {
    const paletteText = palette.colors.join(', ');
    await copyToClipboard(paletteText);
  };

  // Initialize
  useEffect(() => {
    generatePalettes();
  }, [baseColor, scheme]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Grid className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Palette Generator</h2>
          <p className="text-slate-600 dark:text-slate-400">Generate harmonious color schemes</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Base Color Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Base Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="w-12 h-10 rounded border border-slate-300 dark:border-slate-600 cursor-pointer"
            />
            <input
              type="text"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm"
              placeholder="#000000"
            />
            <button
              onClick={generateRandomColor}
              className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
              title="Generate random color"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Color Scheme Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Color Scheme
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {schemes.map((schemeOption) => (
              <button
                key={schemeOption.id}
                onClick={() => setScheme(schemeOption.id)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  scheme === schemeOption.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                    : 'bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                <div className="font-medium text-slate-900 dark:text-white text-sm">
                  {schemeOption.name}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {schemeOption.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Generated Palettes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Generated Palettes
          </h3>

          <div className="grid gap-6">
            {palettes.map((palette) => (
              <div key={palette.name} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{palette.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{palette.description}</p>
                  </div>
                  <button
                    onClick={() => copyPalette(palette)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-700 dark:text-slate-300"
                  >
                    <Copy className="w-4 h-4" />
                    Copy All
                  </button>
                </div>

                {/* Color Swatches */}
                <div className="flex gap-2 mb-3">
                  {palette.colors.map((color, index) => (
                    <div key={index} className="flex-1">
                      <div
                        className="w-full h-12 rounded border border-slate-300 dark:border-slate-500 cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: color }}
                        onClick={() => copyToClipboard(color)}
                        title={`Click to copy ${color}`}
                      />
                      <div className="text-xs font-mono text-center mt-1 text-slate-600 dark:text-slate-400">
                        {color}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Color Details */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {palette.colors.map((color, index) => (
                    <div key={index} className="text-center">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => copyToClipboard(color)}
                          className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 rounded text-blue-700 dark:text-blue-300"
                          title="Copy HEX"
                        >
                          HEX
                        </button>
                        <button
                          onClick={() => copyToClipboard(`rgb(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)})`)}
                          className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 rounded text-green-700 dark:text-green-300"
                          title="Copy RGB"
                        >
                          RGB
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Color Theory Guide</h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
            <p><strong>Complementary:</strong> High contrast, creates visual impact</p>
            <p><strong>Analogous:</strong> Harmonious, creates a sense of unity</p>
            <p><strong>Triadic:</strong> Vibrant and balanced, good for accent colors</p>
            <p><strong>Tetradic:</strong> Rich and complex, requires careful balance</p>
            <p><strong>Monochromatic:</strong> Sophisticated, creates depth through tone variation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaletteGenerator;
