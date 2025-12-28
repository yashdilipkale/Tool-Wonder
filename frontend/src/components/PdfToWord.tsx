import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, ArrowRight, File } from 'lucide-react';

const PdfToWord: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
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
      setError(null);
    }
  };

  const convertToWord = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);

      const response = await fetch('http://localhost:3001/convert-pdf-to-word', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to convert PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile.name.replace('.pdf', '.docx');
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert PDF to Word. Please try again.');
      console.error('PDF conversion error:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const resetConverter = () => {
    setSelectedFile(null);
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
            <File size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">PDF to Word Converter</h2>
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
                  <FileText size={32} />
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-900 dark:text-white">
                    {selectedFile ? selectedFile.name : 'Click to select a PDF file'}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Converts PDF files to editable Word documents
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

      {/* How it Works */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 flex-shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">How It Works</h3>
            <div className="text-sm text-green-800 dark:text-green-200 space-y-2">
              <p>
                <strong>PDF to Word conversion is now fully functional!</strong> The tool extracts text content from your PDF file and creates an editable Word document.
              </p>
              <p>
                <strong>Note:</strong> This conversion extracts text only. Complex formatting, images, and layouts from the original PDF may not be preserved in the Word document.
              </p>
              <p>
                For PDFs with complex layouts or images, consider using specialized conversion services for better results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {selectedFile && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Ready to Convert</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={convertToWord}
                disabled={isConverting}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isConverting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Converting...
                  </>
                ) : (
                  <>
                    <ArrowRight size={16} />
                    Convert to Word
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
        </div>
      )}
    </div>
  );
};

export default PdfToWord;
