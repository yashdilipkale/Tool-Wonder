import React, { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Copy,
  RotateCcw,
  Palette,
} from "lucide-react";
import { useTheme } from "../ThemeContext";

interface GradientStop {
  id: string;
  color: string;
  position: number;
}

const GradientGenerator: React.FC = () => {
  const { theme } = useTheme();
  const [gradientType, setGradientType] = useState<"linear" | "radial">(
    "linear"
  );
  const [direction, setDirection] = useState("to right");
  const [stops, setStops] = useState<GradientStop[]>([
    { id: "1", color: "#3b82f6", position: 0 },
    { id: "2", color: "#8b5cf6", position: 100 },
  ]);
  const [cssCode, setCssCode] = useState("");

  useEffect(() => {
    generateCSS();
  }, [gradientType, direction, stops]);

  const generateCSS = () => {
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    const stopString = sorted.map(
      (s) => `${s.color} ${s.position}%`
    );

    const css =
      gradientType === "linear"
        ? `background: linear-gradient(${direction}, ${stopString.join(
            ", "
          )});`
        : `background: radial-gradient(circle, ${stopString.join(", ")});`;

    setCssCode(css);
  };

  const addStop = () => {
    if (stops.length >= 8) return;
    setStops([
      ...stops,
      {
        id: Date.now().toString(),
        color: "#ef4444",
        position: 50,
      },
    ]);
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((s) => s.id !== id));
  };

  const updateStop = (
    id: string,
    field: "color" | "position",
    value: string | number
  ) => {
    setStops(
      stops.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  const reset = () => {
    setStops([
      { id: "1", color: "#3b82f6", position: 0 },
      { id: "2", color: "#8b5cf6", position: 100 },
    ]);
    setGradientType("linear");
    setDirection("to right");
  };

  const copy = () => navigator.clipboard.writeText(cssCode);

  const previewStyle = {
    background:
      gradientType === "linear"
        ? `linear-gradient(${direction}, ${stops
            .sort((a, b) => a.position - b.position)
            .map((s) => `${s.color} ${s.position}%`)
            .join(", ")})`
        : `radial-gradient(circle, ${stops
            .sort((a, b) => a.position - b.position)
            .map((s) => `${s.color} ${s.position}%`)
            .join(", ")})`,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg mb-4">
          <Layers size={30} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Gradient Generator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Create beautiful modern CSS gradients instantly
        </p>
      </div>

      {/* Preview */}
      <div
        className="w-full h-48 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 transition-all"
        style={previewStyle}
      />

      {/* Controls */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* Left Panel */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-6">

          {/* Type Toggle */}
          <div className="flex gap-3">
            {["linear", "radial"].map((type) => (
              <button
                key={type}
                onClick={() =>
                  setGradientType(type as "linear" | "radial")
                }
                className={`flex-1 py-2 rounded-xl font-medium transition-colors ${
                  gradientType === type
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Direction */}
          {gradientType === "linear" && (
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors"
            >
              <option value="to right">Left → Right</option>
              <option value="to left">Right → Left</option>
              <option value="to bottom">Top → Bottom</option>
              <option value="45deg">45°</option>
              <option value="90deg">90°</option>
            </select>
          )}

          {/* Stops */}
          <div className="space-y-4">
            {stops.map((stop) => (
              <div
                key={stop.id}
                className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700 p-3 rounded-xl"
              >
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) =>
                    updateStop(stop.id, "color", e.target.value)
                  }
                  className="w-12 h-10 rounded"
                />

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={stop.position}
                  onChange={(e) =>
                    updateStop(
                      stop.id,
                      "position",
                      Number(e.target.value)
                    )
                  }
                  className="w-20 p-1 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-600 text-slate-900 dark:text-white transition-colors"
                />

                <button
                  onClick={() => removeStop(stop.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={addStop}
              className="flex-1 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition-colors"
            >
              <Plus size={16} className="inline mr-1" />
              Add
            </button>

            <button
              onClick={reset}
              className="flex-1 bg-slate-600 text-white py-2 rounded-xl hover:bg-slate-700 transition-colors"
            >
              <RotateCcw size={16} className="inline mr-1" />
              Reset
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
              CSS Code
            </h3>
            <button
              onClick={copy}
              className="flex items-center gap-1 px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              <Copy size={14} />
              Copy
            </button>
          </div>

          <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-xl font-mono text-sm break-all text-slate-900 dark:text-white">
            {cssCode}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientGenerator;
