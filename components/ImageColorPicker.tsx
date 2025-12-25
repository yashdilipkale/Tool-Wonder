import React, { useState, useRef, useCallback } from 'react';
import { Pipette, Upload, Copy, Palette, Eye, EyeOff } from 'lucide-react';

interface ColorInfo {
  hex: string;
  rgb: string;
  hsl: string;
  count: number;
  percentage: number;
}

const ImageColorPicker: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const rgbToHsl = (r: number, g: number, b: number): string => {
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

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const extractColors = useCallback(async (imageSrc: string) => {
    setIsProcessing(true);
    setError('');

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageSrc;
      });

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to image size (but limit for performance)
      const maxSize = 200;
      let { width, height } = img;

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image to canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Count colors
      const colorCount: { [key: string]: number } = {};

      // Sample every 4th pixel for performance
      for (let i = 0; i < data.length; i += 16) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];

        // Skip transparent pixels
        if (alpha < 128) continue;

        const hex = rgbToHex(r, g, b);
        colorCount[hex] = (colorCount[hex] || 0) + 1;
      }

      // Convert to array and sort by frequency
      const totalPixels = Object.values(colorCount).reduce((sum, count) => sum + count, 0);
      const colorArray: ColorInfo[] = Object.entries(colorCount)
        .map(([hex, count]) => ({
          hex,
          rgb: `rgb(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)})`,
          hsl: rgbToHsl(parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)),
          count,
          percentage: (count / totalPixels) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20); // Limit to top 20 colors

      setColors(colorArray);
    } catch (err) {
      setError('Failed to process image: ' + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('Image size should be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImage(result);
      extractColors(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImage(result);
        extractColors(result);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const copyPalette = async () => {
    const paletteText = colors.map(color => `${color.hex} (${color.rgb})`).join('\n');
    await copyToClipboard(paletteText);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Pipette className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Image Color Picker</h2>
          <p className="text-slate-600 dark:text-slate-400">Extract color palettes from uploaded images</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {image ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={image}
                  alt="Uploaded"
                  className={`max-w-full max-h-48 rounded-lg shadow-lg ${showPreview ? '' : 'hidden'}`}
                />
                {!showPreview && (
                  <div className="w-48 h-32 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <EyeOff className="w-8 h-8 text-slate-500" />
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPreview(!showPreview);
                  }}
                  className="absolute top-2 right-2 p-1 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-lg transition-shadow"
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Click to upload a different image or drag & drop
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-slate-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-slate-900 dark:text-white">
                  Upload an image
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Drag & drop an image here, or click to browse
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                  Supports JPG, PNG, GIF, WEBP (max 10MB)
                </p>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Extracting colors...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Color Palette */}
        {colors.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Color Palette ({colors.length} colors)
              </h3>
              <button
                onClick={copyPalette}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-700 dark:text-slate-300"
              >
                <Copy className="w-4 h-4" />
                Copy All
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {colors.map((color, index) => (
                <div key={index} className="bg-white dark:bg-slate-700 rounded-lg p-3 shadow-sm border border-slate-200 dark:border-slate-600">
                  <div
                    className="w-full h-16 rounded-md mb-2 border border-slate-300 dark:border-slate-500"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-slate-900 dark:text-white">
                      {color.hex}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {Math.round(color.percentage)}%
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => copyToClipboard(color.hex)}
                        className="flex-1 text-xs px-2 py-1 bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 rounded text-slate-700 dark:text-slate-300"
                        title="Copy HEX"
                      >
                        HEX
                      </button>
                      <button
                        onClick={() => copyToClipboard(color.rgb)}
                        className="flex-1 text-xs px-2 py-1 bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 rounded text-slate-700 dark:text-slate-300"
                        title="Copy RGB"
                      >
                        RGB
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Color List */}
            <div className="mt-6">
              <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-3">Detailed Color Information</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700 rounded">
                    <div
                      className="w-8 h-8 rounded border border-slate-300 dark:border-slate-500 flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-mono text-slate-900 dark:text-white truncate">
                        {color.hex}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {color.rgb} • {color.hsl}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500">
                      {color.count} px ({color.percentage.toFixed(1)}%)
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => copyToClipboard(color.hex)}
                        className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 rounded text-blue-700 dark:text-blue-300"
                      >
                        HEX
                      </button>
                      <button
                        onClick={() => copyToClipboard(color.rgb)}
                        className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 rounded text-green-700 dark:text-green-300"
                      >
                        RGB
                      </button>
                      <button
                        onClick={() => copyToClipboard(color.hsl)}
                        className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800 rounded text-purple-700 dark:text-purple-300"
                      >
                        HSL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageColorPicker;
