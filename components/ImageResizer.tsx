import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, ArrowRight, Maximize } from 'lucide-react';

const ImageResizer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [resizedPreview, setResizedPreview] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [newWidth, setNewWidth] = useState<string>('');
  const [newHeight, setNewHeight] = useState<string>('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!supportedFormats.some(format => file.type.includes(format))) {
        setError('Unsupported file format. Please select JPG, PNG, GIF, WEBP, or BMP files.');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setResizedPreview(null);
      setNewWidth('');
      setNewHeight('');

      const url = URL.createObjectURL(file);
      setOriginalPreview(url);

      // Get original dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        if (maintainAspectRatio) {
          setNewWidth(img.width.toString());
          setNewHeight(img.height.toString());
        }
      };
      img.src = url;
    }
  };

  const handleWidthChange = (value: string) => {
    setNewWidth(value);
    if (maintainAspectRatio && originalDimensions) {
      const width = parseInt(value) || 0;
      const aspectRatio = originalDimensions.height / originalDimensions.width;
      setNewHeight(Math.round(width * aspectRatio).toString());
    }
  };

  const handleHeightChange = (value: string) => {
    setNewHeight(value);
    if (maintainAspectRatio && originalDimensions) {
      const height = parseInt(value) || 0;
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setNewWidth(Math.round(height * aspectRatio).toString());
    }
  };

  const resizeImage = async () => {
    if (!selectedFile || !originalPreview || !originalDimensions) return;

    const width = parseInt(newWidth);
    const height = parseInt(newHeight);

    if (!width || !height || width <= 0 || height <= 0) {
      setError('Please enter valid dimensions.');
      return;
    }

    setIsResizing(true);
    setError(null);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = originalPreview;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      canvas.width = width;
      canvas.height = height;

      // Use high-quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(img, 0, 0, width, height);

      const resizedDataUrl = canvas.toDataURL('image/png');
      setResizedPreview(resizedDataUrl);
    } catch (err) {
      setError('Failed to resize image. Please try again.');
      console.error('Resize error:', err);
    } finally {
      setIsResizing(false);
    }
  };

  const downloadResizedImage = () => {
    if (!resizedPreview || !selectedFile) return;

    const link = document.createElement('a');
    link.href = resizedPreview;
    const originalName = selectedFile.name.replace(/\.[^/.]+$/, '');
    const width = parseInt(newWidth);
    const height = parseInt(newHeight);
    link.download = `${originalName}_${width}x${height}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetResizer = () => {
    setSelectedFile(null);
    setOriginalPreview(null);
    setResizedPreview(null);
    setOriginalDimensions(null);
    setNewWidth('');
    setNewHeight('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatDimensions = (width: number, height: number): string => {
    return `${width} × ${height} px`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Upload Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
            <Maximize size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Resize Image</h2>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-full text-slate-400 dark:text-slate-500">
                  <ImageIcon size={32} />
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-900 dark:text-white">
                    {selectedFile ? selectedFile.name : 'Click to select an image'}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Supports JPG, PNG, GIF, WEBP, BMP
                  </p>
                </div>
              </div>
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Resize Settings */}
      {originalPreview && originalDimensions && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Resize Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Dimensions */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Original Size</h4>
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {formatDimensions(originalDimensions.width, originalDimensions.height)}
                </p>
              </div>
            </div>

            {/* New Dimensions */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Size</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={newWidth}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    placeholder="Width"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={newHeight}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    placeholder="Height"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Aspect Ratio Toggle */}
          <div className="mt-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={maintainAspectRatio}
                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Maintain aspect ratio</span>
            </label>
          </div>

          <button
            onClick={resizeImage}
            disabled={isResizing || !newWidth || !newHeight}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isResizing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Resizing...
              </>
            ) : (
              <>
                <ArrowRight size={16} />
                Resize Image
              </>
            )}
          </button>
        </div>
      )}

      {/* Results */}
      {(originalPreview || resizedPreview) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Image */}
          {originalPreview && originalDimensions && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Original Image</h3>
              <div className="aspect-video bg-slate-50 dark:bg-slate-700 rounded-lg overflow-hidden mb-4">
                <img
                  src={originalPreview}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <p>{formatDimensions(originalDimensions.width, originalDimensions.height)}</p>
              </div>
            </div>
          )}

          {/* Resized Image */}
          {resizedPreview && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Resized Image</h3>
                <div className="flex gap-2">
                  <button
                    onClick={downloadResizedImage}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    onClick={resetResizer}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors text-sm"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="aspect-video bg-slate-50 dark:bg-slate-700 rounded-lg overflow-hidden mb-4">
                <img
                  src={resizedPreview}
                  alt="Resized"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-400">
                <p>{formatDimensions(parseInt(newWidth), parseInt(newHeight))}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageResizer;
