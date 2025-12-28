import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, ArrowRight, Minimize, FileArchive } from 'lucide-react';

const PdfCompressor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<string>('medium');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please select a PDF file.');
        return;
      }

      setSelectedFile(file);
      setOriginalSize(file.size);
      setError(null);
    }
  };

  const compressPdf = async () => {
    if (!selectedFile) return;

    setIsCompressing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);
      formData.append('compressionLevel', compressionLevel);

      const response = await fetch('http://localhost:3001/compress-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to compress PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile.name.replace('.pdf', '_compressed.pdf');
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compress PDF. Please try again.');
      console.error('PDF compression error:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const resetCompressor = () => {
    setSelectedFile(null);
    setOriginalSize(0);
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

  const getCompressionDescription = (level: string) => {
    switch (level) {
      case 'low':
        return 'Minimal compression - best quality, smaller size reduction';
      case 'medium':
        return 'Balanced compression - good quality and size reduction';
      case 'high':
        return 'Maximum compression - smallest file size, may reduce quality';
      default:
        return '';
    }
  };

  const estimatedReduction = (level: string, originalSize: number) => {
    if (originalSize === 0) return 0;
    const reductions = { low: 0.15, medium: 0.35, high: 0.55 };
    return Math.round(originalSize * (reductions[level as keyof typeof reductions] || 0));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Upload Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
            <Minimize size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">PDF Compressor</h2>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-full text-slate-400 dark:text-slate-500">
                  <FileArchive size={32} />
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-900 dark:text-white">
                    {selectedFile ? selectedFile.name : 'Click to select a PDF file'}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Reduces PDF file size for easier sharing
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
      {selectedFile && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Compression Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Info */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">File Information</h4>
              <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>Original size:</strong> {formatFileSize(originalSize)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <strong>Estimated savings:</strong> {formatFileSize(estimatedReduction(compressionLevel, originalSize))}
                </p>
              </div>
            </div>

            {/* Compression Level */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Compression Level</h4>
              <div className="space-y-3">
                {['low', 'medium', 'high'].map((level) => (
                  <label key={level} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="compression"
                      value={level}
                      checked={compressionLevel === level}
                      onChange={(e) => setCompressionLevel(e.target.value)}
                      className="w-4 h-4 text-green-600 bg-slate-100 border-slate-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                        {level}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {getCompressionDescription(level)}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={compressPdf}
            disabled={isCompressing}
            className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCompressing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Compressing...
              </>
            ) : (
              <>
                <ArrowRight size={16} />
                Compress PDF
              </>
            )}
          </button>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 flex-shrink-0">
            <FileArchive size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">How It Works</h3>
            <div className="text-sm text-green-800 dark:text-green-200 space-y-2">
              <p>
                <strong>PDF compression is now fully functional!</strong> The tool optimizes your PDF file structure to reduce file size while maintaining quality.
              </p>
              <p>
                <strong>Compression levels:</strong> Choose from low (minimal), medium (balanced), or high compression based on your needs. Higher compression may result in smaller files but could affect quality.
              </p>
              <p>
                Note: The actual compression effectiveness depends on the PDF's content. Files with many images may see greater size reduction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfCompressor;
