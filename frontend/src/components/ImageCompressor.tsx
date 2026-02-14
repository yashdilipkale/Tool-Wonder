import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, ArrowRight, Minimize } from 'lucide-react';
import Compressor from 'compressorjs';

const ImageCompressor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [compressionQuality, setCompressionQuality] = useState<number>(80);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['jpg', 'jpeg', 'png', 'webp'];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!supportedFormats.some(format => file.type.includes(format))) {
        setError('Unsupported file format. Please select JPG, PNG, or WEBP files.');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setCompressedPreview(null);
      setCompressedSize(0);

      const url = URL.createObjectURL(file);
      setOriginalPreview(url);
      setOriginalSize(file.size);
    }
  };

  const compressImage = async () => {
    if (!selectedFile) return;

    setIsCompressing(true);
    setError(null);

    try {
      // Use compressorjs library for better compression
      new Compressor(selectedFile, {
        quality: compressionQuality / 100,
        success(result) {
          // Convert the compressed file to preview URL
          const compressedUrl = URL.createObjectURL(result);
          setCompressedPreview(compressedUrl);
          setCompressedSize(result.size);
        },
        error(err) {
          setError('Failed to compress image. Please try again.');
          console.error('Compression error:', err);
        }
      });
    } catch (err) {
      setError('Failed to compress image. Please try again.');
      console.error('Compression error:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  // Image resizing function with canvas
  const resizeImage = async () => {
    if (!selectedFile || !originalPreview) return;

    setIsCompressing(true);
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

      // Resize canvas to 300x300 as requested
      canvas.width = 300;
      canvas.height = 300;
      ctx.drawImage(img, 0, 0, 300, 300);

      // Convert canvas to blob for download
      canvas.toBlob((blob) => {
        if (blob) {
          const resizedUrl = URL.createObjectURL(blob);
          setCompressedPreview(resizedUrl);
          setCompressedSize(blob.size);
        }
      }, 'image/jpeg', 0.8);
    } catch (err) {
      setError('Failed to resize image. Please try again.');
      console.error('Resize error:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadCompressedImage = () => {
    if (!compressedPreview || !selectedFile) return;

    const link = document.createElement('a');
    link.href = compressedPreview;
    const originalName = selectedFile.name.replace(/\.[^/.]+$/, '');
    const extension = selectedFile.name.split('.').pop();
    link.download = `${originalName}_compressed.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetCompressor = () => {
    setSelectedFile(null);
    setOriginalPreview(null);
    setCompressedPreview(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressionRatio = originalSize > 0 && compressedSize > 0
    ? ((1 - compressedSize / originalSize) * 100).toFixed(1)
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Upload Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
            <Minimize size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Compress Image</h2>
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
                    Supports JPG, PNG, WEBP
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

      {/* Compression Settings */}
      {originalPreview && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Compression Settings</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Quality: {compressionQuality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={compressionQuality}
                onChange={(e) => setCompressionQuality(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={compressImage}
                disabled={isCompressing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCompressing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Compressing...
                  </>
                ) : (
                  <>
                    <ArrowRight size={16} />
                    Compress Image
                  </>
                )}
              </button>
              
              <button
                onClick={resizeImage}
                disabled={isCompressing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCompressing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Resizing...
                  </>
                ) : (
                  <>
                    <Minimize size={16} />
                    Resize to 300x300
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {(originalPreview || compressedPreview) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Image */}
          {originalPreview && (
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
                <p>Size: {formatFileSize(originalSize)}</p>
                <p>Dimensions: {selectedFile ? `${selectedFile.name}` : ''}</p>
              </div>
            </div>
          )}

          {/* Compressed Image */}
          {compressedPreview && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Compressed Image</h3>
                <div className="flex gap-2">
                  <button
                    onClick={downloadCompressedImage}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    onClick={resetCompressor}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors text-sm"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="aspect-video bg-slate-50 dark:bg-slate-700 rounded-lg overflow-hidden mb-4">
                <img
                  src={compressedPreview}
                  alt="Compressed"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Original size:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formatFileSize(originalSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Compressed size:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{formatFileSize(compressedSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Space saved:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {formatFileSize(originalSize - compressedSize)} ({compressionRatio}%)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageCompressor;
