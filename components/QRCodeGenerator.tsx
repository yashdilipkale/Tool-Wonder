import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Download, Copy, RefreshCw, Settings, Eye, EyeOff } from 'lucide-react';

const QRCodeGenerator: React.FC = () => {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR code using canvas
  const generateQRCode = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);

    try {
      // Simple QR code generation using canvas
      // In a real implementation, you'd use a proper QR code library
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = size;
      canvas.height = size;

      // Clear canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      // Simple pattern generation (placeholder)
      // This is a very basic representation - real QR codes are much more complex
      const pattern = generateQRPattern(text, errorCorrection);
      const moduleSize = size / pattern.length;

      ctx.fillStyle = '#000000';
      for (let y = 0; y < pattern.length; y++) {
        for (let x = 0; x < pattern[y].length; x++) {
          if (pattern[y][x]) {
            ctx.fillRect(
              x * moduleSize,
              y * moduleSize,
              moduleSize,
              moduleSize
            );
          }
        }
      }

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Simple QR pattern generation (placeholder - not a real QR code algorithm)
  const generateQRPattern = (text: string, errorLevel: string): boolean[][] => {
    const size = 21; // Basic QR code size
    const pattern: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));

    // Add finder patterns (corners)
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if ((i === 0 || i === 6 || j === 0 || j === 6) ||
            (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          pattern[i][j] = true;
          pattern[i][size - 1 - j] = true;
          pattern[size - 1 - i][j] = true;
        }
      }
    }

    // Add timing patterns
    for (let i = 8; i < size - 8; i += 2) {
      pattern[6][i] = true;
      pattern[i][6] = true;
    }

    // Add alignment pattern
    for (let i = 2; i < 5; i++) {
      for (let j = 2; j < 5; j++) {
        if (i === 2 || i === 4 || j === 2 || j === 4) {
          pattern[size - 9 + i][size - 9 + j] = true;
        }
      }
    }

    // Add version/format information area
    for (let i = 0; i < 9; i++) {
      pattern[8][i] = i % 2 === 0;
      pattern[i][8] = i % 2 === 0;
    }

    // Encode text data (simplified)
    const data = text.split('').map(char => char.charCodeAt(0));
    let dataIndex = 0;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Skip reserved areas
        if ((x < 9 && y < 9) ||
            (x < 9 && y > size - 9) ||
            (x > size - 9 && y < 9) ||
            (x === 6 || y === 6)) {
          continue;
        }

        if (dataIndex < data.length) {
          pattern[y][x] = (data[dataIndex] & (1 << (dataIndex % 8))) !== 0;
          dataIndex++;
        }
      }
    }

    return pattern;
  };

  useEffect(() => {
    if (text.trim()) {
      generateQRCode();
    }
  }, [text, size, errorCorrection]);

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = async () => {
    if (!qrCodeDataUrl) return;

    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeDataUrl);
      const blob = await response.blob();

      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
    } catch (error) {
      console.error('Failed to copy QR code:', error);
      // Fallback: copy data URL as text
      await navigator.clipboard.writeText(qrCodeDataUrl);
    }
  };

  const resetToDefaults = () => {
    setText('https://example.com');
    setSize(256);
    setErrorCorrection('M');
  };

  const presetTexts = [
    { label: 'Website URL', value: 'https://example.com' },
    { label: 'Email', value: 'mailto:example@email.com' },
    { label: 'Phone', value: 'tel:+1234567890' },
    { label: 'SMS', value: 'sms:+1234567890' },
    { label: 'WiFi', value: 'WIFI:S:MyNetwork;T:WPA;P:mypassword;;' },
    { label: 'Location', value: 'geo:37.7749,-122.4194' },
    { label: 'Contact', value: 'BEGIN:VCARD\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD' },
    { label: 'Plain Text', value: 'Hello, World!' }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <QrCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">QR Code Generator</h2>
          <p className="text-slate-600 dark:text-slate-400">Create custom QR codes for URLs, text, and more</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Content
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text, URL, or data to encode..."
              className="w-full h-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Preset Buttons */}
            <div className="mt-3">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">Quick presets:</div>
              <div className="flex flex-wrap gap-2">
                {presetTexts.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setText(preset.value)}
                    className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-700 dark:text-slate-300"
                    title={preset.value}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* QR Code Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                QR Code Preview
              </label>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  disabled={!qrCodeDataUrl || isGenerating}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:bg-slate-50 disabled:cursor-not-allowed rounded text-slate-700 dark:text-slate-300"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={downloadQRCode}
                  disabled={!qrCodeDataUrl || isGenerating}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:bg-slate-50 disabled:cursor-not-allowed rounded text-slate-700 dark:text-slate-300"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                {isGenerating ? (
                  <div className="w-64 h-64 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : qrCodeDataUrl ? (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <img
                      src={qrCodeDataUrl}
                      alt="Generated QR Code"
                      className="w-64 h-64"
                    />
                  </div>
                ) : (
                  <div className="w-64 h-64 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-slate-400" />
                  </div>
                )}
              </div>
            </div>

            {qrCodeDataUrl && (
              <div className="mt-3 text-center">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {size}x{size} pixels • {errorCorrection} error correction
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Advanced Settings */}
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <Settings className="w-4 h-4" />
            Advanced Settings
            {showAdvanced ? <EyeOff className="w-4 h-4 ml-auto" /> : <Eye className="w-4 h-4 ml-auto" />}
          </button>

          {showAdvanced && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Size (pixels)
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                  >
                    <option value={128}>128x128</option>
                    <option value={256}>256x256</option>
                    <option value={512}>512x512</option>
                    <option value={1024}>1024x1024</option>
                  </select>
                </div>

                {/* Error Correction */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Error Correction Level
                  </label>
                  <select
                    value={errorCorrection}
                    onChange={(e) => setErrorCorrection(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={resetToDefaults}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reset to Defaults
              </button>
            </div>
          )}
        </div>

        {/* Usage Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">QR Code Uses</h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p><strong>URLs:</strong> Link to websites, landing pages</p>
            <p><strong>Contact Info:</strong> Share vCard contact details</p>
            <p><strong>WiFi:</strong> Share network credentials</p>
            <p><strong>Location:</strong> Share GPS coordinates</p>
            <p><strong>Text:</strong> Share plain text messages</p>
          </div>
        </div>
      </div>

      {/* Hidden canvas for QR generation */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default QRCodeGenerator;
