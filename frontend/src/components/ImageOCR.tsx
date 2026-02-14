import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, ArrowRight, ScanText, FileText, Crown } from 'lucide-react';

const ImageOCR: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState('eng');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!supportedFormats.some(format => file.type.includes(format))) {
        setError('Unsupported file format. Please select JPG, PNG, GIF, WEBP, BMP, or TIFF files.');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setExtractedText('');

      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const extractText = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('apikey', 'K83680451088957');
      formData.append('language', language);

      const res = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setExtractedText(data.ParsedResults?.[0]?.ParsedText || 'No text found');
    } catch (err) {
      setError('Failed to extract text from image. Please try again.');
      console.error('OCR error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadText = () => {
    if (!extractedText) return;

    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const originalName = selectedFile?.name.replace(/\.[^/.]+$/, '') || 'extracted_text';
    link.download = `${originalName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!extractedText) return;

    try {
      await navigator.clipboard.writeText(extractedText);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const resetOCR = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setExtractedText('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Upload Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
            <ScanText size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Image to Text (OCR)</h2>
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
                    Supports JPG, PNG, GIF, WEBP, BMP, TIFF
                  </p>
                </div>
              </div>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex-1">
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="eng">English</option>
                <option value="hin">Hindi</option>
                <option value="mar">Marathi</option>
                <option value="spa">Spanish</option>
              </select>
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview and Processing */}
      {imagePreview && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Image Preview</h3>
            <div className="aspect-video bg-slate-50 dark:bg-slate-700 rounded-lg overflow-hidden mb-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-4">
              <button
                onClick={extractText}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <ScanText size={16} />
                    Extract Text
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Extracted Text */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Extracted Text</h3>
              {extractedText && (
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                    title="Copy to clipboard"
                  >
                    <FileText size={14} />
                    Copy
                  </button>
                  <button
                    onClick={downloadText}
                    className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    <Download size={14} />
                    Download
                  </button>
                  <button
                    onClick={resetOCR}
                    className="px-3 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors text-sm"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {extractedText ? (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-slate-900 dark:text-white whitespace-pre-wrap font-mono">
                    {extractedText || 'No text detected in the image.'}
                  </pre>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {extractedText.split(/\s+/).filter(word => word.length > 0).length} words detected
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                  <FileText size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  {isProcessing ? 'Processing Image...' : 'No Text Extracted Yet'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isProcessing
                    ? 'AI is analyzing your image for text content.'
                    : 'Click "Extract Text" to start OCR processing.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 flex-shrink-0">
            <ScanText size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">About OCR Processing</h3>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <p>
                This tool uses Tesseract.js to perform optical character recognition (OCR) directly in your browser.
                The AI analyzes your image and extracts any visible text content.
              </p>
              <p>
                <strong>Supported languages:</strong> English (additional languages can be added)
              </p>
              <p>
                <strong>Best results with:</strong> Clear, high-contrast text, proper lighting, and straight orientation.
              </p>
              <p>
                <strong>Processing time:</strong> Typically 10-30 seconds depending on image complexity and device performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageOCR;
