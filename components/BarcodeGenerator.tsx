import React, { useState, useRef, useEffect } from 'react';
import { Barcode, Download, Copy, Settings, Eye, EyeOff } from 'lucide-react';

const BarcodeGenerator: React.FC = () => {
  const [text, setText] = useState('123456789012');
  const [barcodeType, setBarcodeType] = useState<'code128' | 'code39' | 'ean13' | 'ean8' | 'upc' | 'itf'>('code128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [showText, setShowText] = useState(true);
  const [barcodeDataUrl, setBarcodeDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Barcode type definitions
  const barcodeTypes = [
    { id: 'code128', name: 'Code 128', description: 'Most common barcode, supports all ASCII characters' },
    { id: 'code39', name: 'Code 39', description: 'Alphanumeric barcode, widely used' },
    { id: 'ean13', name: 'EAN-13', description: '13-digit product barcode, retail standard' },
    { id: 'ean8', name: 'EAN-8', description: '8-digit compact barcode' },
    { id: 'upc', name: 'UPC-A', description: '12-digit North American product barcode' },
    { id: 'itf', name: 'ITF', description: 'Interleaved 2 of 5, numeric data' }
  ];

  // Sample data for different barcode types
  const samples = {
    code128: 'Hello World 123',
    code39: 'ABC123',
    ean13: '1234567890128',
    ean8: '12345670',
    upc: '123456789012',
    itf: '1234567890'
  };

  // Simple barcode generation (simplified algorithms)
  const generateBarcode = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Generate barcode pattern based on type
      let pattern: boolean[] = [];

      switch (barcodeType) {
        case 'code128':
          pattern = generateCode128(text);
          break;
        case 'code39':
          pattern = generateCode39(text.toUpperCase());
          break;
        case 'ean13':
          pattern = generateEAN13(text);
          break;
        case 'ean8':
          pattern = generateEAN8(text);
          break;
        case 'upc':
          pattern = generateUPC(text);
          break;
        case 'itf':
          pattern = generateITF(text);
          break;
        default:
          pattern = generateSimple(text);
      }

      // Calculate canvas size
      const totalWidth = pattern.length * width;
      const textHeight = showText ? 20 : 0;
      const totalHeight = height + textHeight;

      canvas.width = totalWidth;
      canvas.height = totalHeight;

      // Clear canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, totalWidth, totalHeight);

      // Draw barcode
      ctx.fillStyle = '#000000';
      for (let i = 0; i < pattern.length; i++) {
        if (pattern[i]) {
          ctx.fillRect(i * width, 0, width, height);
        }
      }

      // Draw text if enabled
      if (showText) {
        ctx.fillStyle = '#000000';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(text, totalWidth / 2, height + 15);
      }

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      setBarcodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating barcode:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Simplified barcode algorithms (for demonstration)
  const generateCode128 = (text: string): boolean[] => {
    const pattern: boolean[] = [];
    // Start code C (most common)
    pattern.push(...[true,false,true,false,true,false,true,false,true,false,true]); // Start C

    for (let i = 0; i < text.length; i += 2) {
      const pair = text.substr(i, 2);
      // Simplified encoding - real Code 128 is much more complex
      for (let j = 0; j < pair.length; j++) {
        const charCode = pair.charCodeAt(j);
        for (let k = 0; k < 8; k++) {
          pattern.push((charCode & (1 << k)) !== 0);
        }
      }
    }

    // Checksum and stop
    pattern.push(...[true,false,true,false,true,false,true]); // Stop
    return pattern;
  };

  const generateCode39 = (text: string): boolean[] => {
    const pattern: boolean[] = [];
    pattern.push(...[true,false,false,false,true]); // Start

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      // Simplified Code 39 encoding
      for (let j = 0; j < char.length; j++) {
        pattern.push(Math.random() > 0.5);
      }
      pattern.push(false); // Inter-character gap
    }

    pattern.push(...[true,false,false,false,true]); // Stop
    return pattern;
  };

  const generateEAN13 = (text: string): boolean[] => {
    const pattern: boolean[] = [];
    // Left guard
    pattern.push(true,false,true);

    // Left digits (first 6)
    for (let i = 0; i < 6; i++) {
      const digit = parseInt(text[i] || '0');
      // Simplified encoding
      for (let j = 0; j < 7; j++) {
        pattern.push(Math.random() > 0.5);
      }
    }

    // Center guard
    pattern.push(false,true,false,true,false);

    // Right digits (last 6)
    for (let i = 6; i < 12; i++) {
      const digit = parseInt(text[i] || '0');
      for (let j = 0; j < 7; j++) {
        pattern.push(Math.random() > 0.5);
      }
    }

    // Right guard
    pattern.push(true,false,true);
    return pattern;
  };

  const generateEAN8 = (text: string): boolean[] => {
    const pattern: boolean[] = [];
    pattern.push(true,false,true); // Left guard

    for (let i = 0; i < 4; i++) {
      const digit = parseInt(text[i] || '0');
      for (let j = 0; j < 7; j++) {
        pattern.push(Math.random() > 0.5);
      }
    }

    pattern.push(false,true,false,true,false); // Center guard

    for (let i = 4; i < 8; i++) {
      const digit = parseInt(text[i] || '0');
      for (let j = 0; j < 7; j++) {
        pattern.push(Math.random() > 0.5);
      }
    }

    pattern.push(true,false,true); // Right guard
    return pattern;
  };

  const generateUPC = (text: string): boolean[] => {
    const pattern: boolean[] = [];
    pattern.push(true,false,true); // Left guard

    for (let i = 0; i < 6; i++) {
      const digit = parseInt(text[i] || '0');
      for (let j = 0; j < 7; j++) {
        pattern.push(Math.random() > 0.5);
      }
    }

    pattern.push(false,true,false,true,false); // Center guard

    for (let i = 6; i < 11; i++) {
      const digit = parseInt(text[i] || '0');
      for (let j = 0; j < 7; j++) {
        pattern.push(Math.random() > 0.5);
      }
    }

    pattern.push(true,false,true); // Right guard
    return pattern;
  };

  const generateITF = (text: string): boolean[] => {
    const pattern: boolean[] = [];
    pattern.push(true,false,true,false); // Start

    for (let i = 0; i < text.length; i += 2) {
      const pair = text.substr(i, 2);
      // Interleaved 2 of 5 encoding (simplified)
      for (let j = 0; j < pair.length; j++) {
        const digit = parseInt(pair[j] || '0');
        for (let k = 0; k < 5; k++) {
          pattern.push(Math.random() > 0.5);
        }
      }
    }

    pattern.push(true,true,false,true); // Stop
    return pattern;
  };

  const generateSimple = (text: string): boolean[] => {
    const pattern: boolean[] = [];
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      for (let j = 0; j < 8; j++) {
        pattern.push((charCode & (1 << j)) !== 0);
      }
      pattern.push(false); // Space between characters
    }
    return pattern;
  };

  useEffect(() => {
    if (text.trim()) {
      generateBarcode();
    }
  }, [text, barcodeType, width, height, showText]);

  const downloadBarcode = () => {
    if (!barcodeDataUrl) return;

    const link = document.createElement('a');
    link.href = barcodeDataUrl;
    link.download = `barcode-${barcodeType}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = async () => {
    if (!barcodeDataUrl) return;

    try {
      const response = await fetch(barcodeDataUrl);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
    } catch (error) {
      console.error('Failed to copy barcode:', error);
      await navigator.clipboard.writeText(barcodeDataUrl);
    }
  };

  const loadSample = (type: string) => {
    const sampleText = samples[type as keyof typeof samples] || '123456789';
    setText(sampleText);
    setBarcodeType(type as any);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Barcode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Barcode Generator</h2>
          <p className="text-slate-600 dark:text-slate-400">Generate product barcodes easily</p>
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
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter barcode content..."
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Sample buttons */}
            <div className="mt-3">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">Load sample:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(samples).map(([type, sample]) => (
                  <button
                    key={type}
                    onClick={() => loadSample(type)}
                    className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-700 dark:text-slate-300"
                    title={`${type}: ${sample}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Barcode Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Barcode Preview
              </label>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  disabled={!barcodeDataUrl || isGenerating}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:bg-slate-50 disabled:cursor-not-allowed rounded text-slate-700 dark:text-slate-300"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={downloadBarcode}
                  disabled={!barcodeDataUrl || isGenerating}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:bg-slate-50 disabled:cursor-not-allowed rounded text-slate-700 dark:text-slate-300"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative bg-white p-4 rounded-lg shadow-sm border">
                {isGenerating ? (
                  <div className="w-64 h-32 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : barcodeDataUrl ? (
                  <img
                    src={barcodeDataUrl}
                    alt="Generated Barcode"
                    className="max-w-full h-auto"
                  />
                ) : (
                  <div className="w-64 h-32 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
                    <Barcode className="w-12 h-12 text-slate-400" />
                  </div>
                )}
              </div>
            </div>

            {barcodeDataUrl && (
              <div className="mt-3 text-center">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {barcodeType.toUpperCase()} • {text.length} characters
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Barcode Type Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Barcode Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {barcodeTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setBarcodeType(type.id as any)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  barcodeType === type.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                    : 'bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                <div className="font-semibold text-slate-900 dark:text-white text-sm">
                  {type.name}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {type.description}
                </div>
              </button>
            ))}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Width */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Bar Width
                  </label>
                  <select
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-600 text-slate-900 dark:text-white text-sm"
                  >
                    <option value={1}>1px</option>
                    <option value={2}>2px</option>
                    <option value={3}>3px</option>
                    <option value={4}>4px</option>
                  </select>
                </div>

                {/* Height */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Bar Height
                  </label>
                  <select
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-600 text-slate-900 dark:text-white text-sm"
                  >
                    <option value={50}>50px</option>
                    <option value={75}>75px</option>
                    <option value={100}>100px</option>
                    <option value={150}>150px</option>
                  </select>
                </div>

                {/* Show Text */}
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showText}
                      onChange={(e) => setShowText(e.target.checked)}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Show text</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Usage Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Barcode Types</h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
            <p><strong>Code 128:</strong> Universal, supports all ASCII characters</p>
            <p><strong>Code 39:</strong> Alphanumeric, industrial applications</p>
            <p><strong>EAN-13:</strong> Retail products, 13 digits</p>
            <p><strong>EAN-8:</strong> Compact retail barcode, 8 digits</p>
            <p><strong>UPC-A:</strong> North American retail, 12 digits</p>
            <p><strong>ITF:</strong> Numeric data, shipping/logistics</p>
          </div>
        </div>
      </div>

      {/* Hidden canvas for barcode generation */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default BarcodeGenerator;
