import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, ArrowRight } from 'lucide-react';

const ImageConverter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('png');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedInputFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
  const supportedOutputFormats = ['png', 'jpeg', 'webp'];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!supportedInputFormats.some(format => file.type.includes(format))) {
        setError('Unsupported file format. Please select JPG, PNG, GIF, WEBP, or BMP files.');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setConvertedUrl(null);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const convertImage = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsConverting(true);
    setError(null);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = previewUrl;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      let mimeType: string;
      let quality = 0.9;

      switch (targetFormat) {
        case 'png':
          mimeType = 'image/png';
          break;
        case 'jpeg':
          mimeType = 'image/jpeg';
          break;
        case 'webp':
          mimeType = 'image/webp';
          break;
        default:
          mimeType = 'image/png';
      }

      const convertedDataUrl = canvas.toDataURL(mimeType, quality);
      setConvertedUrl(convertedDataUrl);
    } catch (err) {
      setError('Failed to convert image. Please try again.');
      console.error('Conversion error:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const downloadConvertedImage = () => {
    if (!convertedUrl || !selectedFile) return;

    const link = document.createElement('a');
    link.href = convertedUrl;
    link.download = `${selectedFile.name.replace(/\.[^/.]+$/, '')}.${targetFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Alternative download method using toBlob (as requested)
  const downloadWithBlob = async () => {
    if (!selectedFile || !previewUrl) return;

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = previewUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Use toBlob method as requested
      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${selectedFile.name.replace(/\.[^/.]+$/, '')}.${targetFormat}`;
          link.click();
          
          // Clean up the object URL
          setTimeout(() => URL.revokeObjectURL(link.href), 100);
        }
      }, "image/jpeg");
    } catch (err) {
      setError('Failed to download image. Please try again.');
      console.error('Download error:', err);
    }
  };

  const resetConverter = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setConvertedUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Upload Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
            <Upload size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Upload Image</h2>
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

      {/* Preview and Conversion */}
      {previewUrl && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original Image */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Original Image</h3>
            <div className="aspect-video bg-slate-50 dark:bg-slate-700 rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Original"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {selectedFile?.name} ({Math.round((selectedFile?.size || 0) / 1024)} KB)
            </p>
          </div>

          {/* Conversion Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Convert To</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Output Format
                </label>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {supportedOutputFormats.map(format => (
                    <option key={format} value={format}>
                      {format.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={convertImage}
                disabled={isConverting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isConverting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Converting...
                  </>
                ) : (
                  <>
                    <ArrowRight size={16} />
                    Convert Image
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Converted Image */}
      {convertedUrl && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Converted Image</h3>
            <div className="flex gap-2">
              <button
                onClick={downloadConvertedImage}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={16} />
                Download
              </button>
              <button
                onClick={resetConverter}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="aspect-video bg-slate-50 dark:bg-slate-700 rounded-lg overflow-hidden">
            <img
              src={convertedUrl}
              alt="Converted"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageConverter;
