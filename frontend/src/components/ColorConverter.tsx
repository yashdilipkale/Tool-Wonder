import React, { useState, useEffect } from "react";
import {
  Pipette,
  Copy,
  RefreshCw,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useTheme } from "../ThemeContext";

interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
  name: string;
}

const ColorConverter: React.FC = () => {
  const { theme } = useTheme();
  const [input, setInput] = useState("#3b82f6");
  const [activeFormat, setActiveFormat] = useState<"hex" | "rgb" | "hsl">("hex");
  const [colors, setColors] = useState<ColorFormats>({
    hex: "#3b82f6",
    rgb: "rgb(59,130,246)",
    hsl: "hsl(217,91%,60%)",
    name: "Blue"
  });
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  /* ---------- Converters ---------- */

  const hexToRgb = (hex: string) => {
    const m = hex.replace("#", "").match(/.{1,2}/g);
    if (!m) return null;
    return {
      r: parseInt(m[0], 16),
      g: parseInt(m[1], 16),
      b: parseInt(m[2], 16)
    };
  };

  const rgbToHex = (r: number, g: number, b: number) =>
    "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

 /* ---------- Parse RGB ---------- */
const parseRgb = (str: string) => {
  const m = str.match(
    /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i
  );

  if (!m) return null;

  const r = Math.min(255, +m[1]);
  const g = Math.min(255, +m[2]);
  const b = Math.min(255, +m[3]);

  return { r, g, b };
};

/* ---------- Parse HSL ---------- */
const parseHsl = (str: string) => {
  const m = str.match(
    /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i
  );

  if (!m) return null;

  const h = +m[1];
  const s = +m[2] / 100;
  const l = +m[3] / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m0 = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return {
    r: Math.round((r + m0) * 255),
    g: Math.round((g + m0) * 255),
    b: Math.round((b + m0) * 255)
  };
};

  /* ---------- Convert ---------- */

  useEffect(() => {
    try {
      let rgb;

      if (activeFormat === "hex") rgb = hexToRgb(input);
      else if (activeFormat === "rgb") rgb = parseRgb(input);
      else rgb = parseHsl(input);

      if (!rgb) throw Error("Invalid format");

      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

      setColors({
        hex,
        rgb: `rgb(${rgb.r},${rgb.g},${rgb.b})`,
        hsl: `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`,
        name: "Color"
      });

      setIsValid(true);
      setError("");
    } catch (e) {
      setIsValid(false);
      setError("Invalid color value");
    }
  }, [input, activeFormat]);

  /* ---------- Copy ---------- */

  const copy = async (value: string, type: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(""), 1200);
  };

  const randomColor = () => {
    const hex = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    setActiveFormat("hex");
    setInput(hex);
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 p-2 rounded-xl shadow border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <Pipette className="text-blue-600" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Color Converter</h2>
      </div>

      <div className="flex gap-2 mb-3">
        {["hex", "rgb", "hsl"].map(f => (
          <button
            key={f}
            onClick={() => setActiveFormat(f as any)}
            className={`px-3 py-1 rounded ${
              activeFormat === f ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white"
            } hover:bg-blue-700 transition-colors`}
          >
            {f}
          </button>
        ))}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded mb-4 font-mono bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
      />

      <div
        className="h-20 rounded mb-4 border border-slate-200 dark:border-slate-600"
        style={{ background: colors.hex }}
      />

      {isValid ? (
        <CheckCircle className="text-green-500 mb-2" />
      ) : (
        <XCircle className="text-red-500 mb-2" />
      )}

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {["hex", "rgb", "hsl"].map(k => (
        <div key={k} className="flex justify-between bg-slate-100 dark:bg-slate-700 p-2 rounded mb-2 border border-slate-200 dark:border-slate-600">
          <span className="font-mono text-slate-900 dark:text-white">{(colors as any)[k]}</span>
          <button onClick={() => copy((colors as any)[k], k)} className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            <Copy size={16} />
            {copied === k && " Copied"}
          </button>
        </div>
      ))}

      <button
        onClick={randomColor}
        className="mt-3 px-3 py-2 bg-blue-600 text-white rounded flex items-center gap-2 hover:bg-blue-700 transition-colors"
      >
        <RefreshCw size={16} /> Random Color
      </button>
    </div>
  );
};

export default ColorConverter;
