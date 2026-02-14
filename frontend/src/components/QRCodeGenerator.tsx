import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { QrCode, Download, Copy, Settings, RefreshCw } from "lucide-react";
import { useTheme } from "../ThemeContext";

const QRCodeGenerator: React.FC = () => {
  const { theme } = useTheme();
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(256);
  const [qrUrl, setQrUrl] = useState<string>("");

  const generateQR = async () => {
    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
      });
      setQrUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    generateQR();
  }, [text, size]);

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = "qrcode.png";
    link.click();
  };

  const copyQR = async () => {
    const res = await fetch(qrUrl);
    const blob = await res.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
  };

  const reset = () => {
    setText("https://example.com");
    setSize(256);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <QrCode className="w-7 h-7 text-blue-600" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">QR Code Generator</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* INPUT */}
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-36 border border-slate-200 dark:border-slate-600 rounded-xl p-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <div className="mt-4 flex gap-3">
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value={128}>128px</option>
              <option value={256}>256px</option>
              <option value={512}>512px</option>
            </select>

            <button
              onClick={reset}
              className="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <RefreshCw size={16} /> Reset
            </button>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="flex flex-col items-center justify-center">
          {qrUrl && (
            <img
              src={qrUrl}
              className="rounded-xl shadow-md max-w-[260px] w-full border border-slate-200 dark:border-slate-600"
            />
          )}

          <div className="flex gap-3 mt-4">
            <button
              onClick={downloadQR}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} className="inline mr-1" /> Download
            </button>

            <button
              onClick={copyQR}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Copy size={16} className="inline mr-1" /> Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
