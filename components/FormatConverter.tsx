import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, ArrowRight, File } from 'lucide-react';

const FormatConverter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = {
    document: ['doc', 'docx', 'pdf', 'txt', 'rtf', 'odt'],
    spreadsheet: ['xls', 'xlsx', 'csv', 'ods'],
    presentation: ['ppt', 'pptx', 'odp'],
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff']
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      // Auto-suggest target format based on file type
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'doc') setTargetFormat('docx');
      else if (extension === 'xls') setTargetFormat('xlsx');
      else if (extension === 'ppt') setTargetFormat('pptx');
    }
  };

  const convertFormat = async () => {
    if (!selectedFile || !targetFormat) return;

    setIsConverting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('targetFormat', targetFormat);

      const response = await fetch('http://localhost:3001/convert-format', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to convert file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile.name.replace(/\.[^.]+$/, `.${targetFormat}`);
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert document. Please try again.');
      console.error('Format conversion error:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const resetConverter = () => {
    setSelectedFile(null);
    setTargetFormat('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileCategory = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (supportedFormats.document.includes(extension || '')) return 'document';
    if (supportedFormats.spreadsheet.includes(extension || '')) return 'spreadsheet';
    if (supportedFormats.presentation.includes(extension || '')) return 'presentation';
    if (supportedFormats.image.includes(extension || '')) return 'image';
    return 'other';
  };

  const getAvailableFormats = (category: string) => {
    switch (category) {
      case 'document':
        return ['pdf', 'docx', 'txt', 'rtf', 'html'];
      case 'spreadsheet':
        return ['xlsx', 'csv', 'pdf', 'html'];
      case 'presentation':
        return ['pptx', 'pdf', 'html'];
      case 'image':
        return ['png', 'jpg', 'webp', 'gif', 'bmp'];
      default:
        return [];
    }
  };

  const fileCategory = selectedFile ? getFileCategory(selectedFile.name) : '';
  const availableFormats = fileCategory ? getAvailableFormats(fileCategory) : [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
            <File size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Format Converter</h2>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".doc,.docx,.pdf,.txt,.rtf,.xls,.xlsx,.csv,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-full text-slate-400 dark:text-slate-500">
                  <FileText size={32} />
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-900 dark:text-white">
                    {selectedFile ? selectedFile.name : 'Click to select a file'}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Supports documents, spreadsheets, presentations, and images
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

        {/* Conversion Options */}
        {selectedFile && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Conversion Options</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Source Format
                </label>
                <div className="p-3 bg-white dark:bg-slate-600 rounded-lg text-slate-900 dark:text-white">
                  {selectedFile.name.split('.').pop()?.toUpperCase()} ({fileCategory})
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Target Format
                </label>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select target format</option>
                  {availableFormats.map((format) => (
                    <option key={format} value={format}>
                      {format.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={convertFormat}
                disabled={isConverting || !targetFormat}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isConverting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Converting...
                  </>
                ) : (
                  <>
                    <ArrowRight size={16} />
                    Convert Format
                  </>
                )}
              </button>

              <button
                onClick={resetConverter}
                className="px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Supported Conversions */}
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 flex-shrink-0">
              <File size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">Supported Conversions</h3>
              <div className="text-sm text-green-800 dark:text-green-200 space-y-2">
                <p>
                  <strong>The format converter is now functional!</strong> It supports basic conversions for images and text files.
                </p>
                <p>
                  <strong>Currently supported:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Image formats: Convert between PNG, JPG, WebP, GIF, BMP</li>
                  <li>Text files: TXT to HTML conversion</li>
                </ul>
                <p>
                  <strong>Note:</strong> Office document conversions (Word, Excel, PowerPoint) require LibreOffice or similar software and are not implemented in this basic version.
                </p>
                <p>
                  All conversions are processed server-side for security and accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormatConverter;
