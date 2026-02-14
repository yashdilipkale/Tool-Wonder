import React, { useState, useRef, useEffect } from "react";
import JsBarcode from "jsbarcode";
import {
  Barcode,
  Download,
  Copy,
  Settings,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "../ThemeContext";

const BarcodeGenerator: React.FC = () => {
  const { theme } = useTheme();
  const [text, setText] = useState("123456789012");
  const [format, setFormat] = useState("CODE128");
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);

  const formats = [
    { value: "CODE128", label: "Code 128" },
    { value: "CODE39", label: "Code 39" },
    { value: "EAN13", label: "EAN-13" },
    { value: "EAN8", label: "EAN-8" },
    { value: "UPC", label: "UPC-A" },
    { value: "ITF14", label: "ITF" },
  ];

  const generateBarcode = () => {
    if (!svgRef.current || !text) return;

    try {
      JsBarcode(svgRef.current, text, {
        format,
        width,
        height,
        displayValue,
        background: "#ffffff",
        lineColor: "#000000",
        margin: 10,
      });
    } catch (err) {
      console.error("Invalid barcode input");
    }
  };

  useEffect(() => {
    generateBarcode();
  }, [text, format, width, height, displayValue]);

  const downloadBarcode = () => {
    const svg = svgRef.current;
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "barcode.svg";
    link.click();
  };

  const copyBarcode = async () => {
    const svg = svgRef.current;
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    await navigator.clipboard.writeText(source);
  };

  const resetAll = () => {
    setText("123456789012");
    setFormat("CODE128");
    setWidth(2);
    setHeight(100);
    setDisplayValue(true);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <Barcode className="text-blue-600 dark:text-blue-400 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Barcode Generator
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Generate professional & scannable barcodes instantly
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* LEFT SIDE - INPUT */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              Barcode Content
            </label>
          <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Barcode Type
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              {formats.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-blue-600 font-medium"
          >
            <Settings size={16} /> Advanced Settings
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-700 p-4 rounded-xl">
              <div>
                <label className="text-sm">Bar Width</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm">Bar Height</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                />
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={displayValue}
                  onChange={(e) => setDisplayValue(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-white border border-slate-300 rounded focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600"
                />
                <span className="text-sm text-slate-700 dark:text-slate-200">Show Text</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={downloadBarcode}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              <Download size={16} className="inline mr-1" /> Download
            </button>

            <button
              onClick={copyBarcode}
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
            >
              <Copy size={16} className="inline mr-1" /> Copy SVG
            </button>

            <button
              onClick={resetAll}
              className="px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700"
            >
              <RefreshCw size={16} className="inline mr-1" /> Reset
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - PREVIEW */}
        <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-700 rounded-2xl p-6">
          <svg ref={svgRef} className="max-w-full"></svg>
        </div>
      </div>
    </div>
  );
};

export default BarcodeGenerator;
