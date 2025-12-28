import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, ArrowRight, Scissors, FileArchive } from 'lucide-react';

interface PdfFile {
  file: File;
  id: string;
  name: string;
  size: number;
}

const PdfMergerSplitter: React.FC = () => {
  const [mode, setMode] = useState<'merge' | 'split'>('merge');
  const [selectedFiles, setSelectedFiles] = useState<PdfFile[]>([]);
  const [splitPage, setSplitPage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const pdfFiles = fileArray.filter((file: File) => file.type === 'application/pdf');

    if (pdfFiles.length !== fileArray.length) {
      setError('Some files were skipped. Please select only PDF files.');
    } else {
      setError(null);
    }

    const newPdfFiles: PdfFile[] = pdfFiles.map((file: File) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size
    }));

    if (mode === 'merge') {
      setSelectedFiles(prev => [...prev, ...newPdfFiles]);
    } else {
      setSelectedFiles(newPdfFiles.slice(0, 1)); // Only one file for splitting
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const moveFile = (fromIndex: number, toIndex: number) => {
    const newFiles = [...selectedFiles];
    const [movedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, movedFile);
    setSelectedFiles(newFiles);
  };

  const processPdf = async () => {
    if (mode === 'merge' && selectedFiles.length < 2) {
      setError('Please select at least 2 PDF files to merge.');
      return;
    }
    if (mode === 'split' && selectedFiles.length !== 1) {
      setError('Please select exactly 1 PDF file to split.');
      return;
    }
    if (mode === 'split' && !splitPage) {
      setError('Please enter the page number to split after.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();

      if (mode === 'merge') {
        selectedFiles.forEach((pdfFile) => {
          formData.append('pdfs', pdfFile.file);
        });

        const response = await fetch('http://localhost:3001/merge-pdfs', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to merge PDFs');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'merged.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        formData.append('pdf', selectedFiles[0].file);
        formData.append('splitPage', splitPage);

        const response = await fetch('http://localhost:3001/split-pdf', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to split PDF');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = selectedFiles[0].name.replace('.pdf', '_split.zip');
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${mode} PDF. Please try again.`);
      console.error('PDF processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setSelectedFiles([]);
    setSplitPage('');
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

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Mode Selection */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Scissors size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">PDF Merger & Splitter</h2>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setMode('merge');
              setSelectedFiles([]);
              setSplitPage('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              mode === 'merge'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            <FileArchive size={16} />
            Merge PDFs
          </button>
          <button
            onClick={() => {
              setMode('split');
              setSelectedFiles([]);
              setSplitPage('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              mode === 'split'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            <Scissors size={16} />
            Split PDF
          </button>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple={mode === 'merge'}
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
                    Click to select PDF {mode === 'merge' ? 'files' : 'file'}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {mode === 'merge'
                      ? 'Select multiple PDF files to combine them into one'
                      : 'Select a PDF file to split into multiple parts'
                    }
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

      {/* File List */}
      {selectedFiles.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {mode === 'merge' ? 'Files to Merge' : 'File to Split'}
            </h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} • {formatFileSize(totalSize)} total
            </span>
          </div>

          <div className="space-y-3">
            {selectedFiles.map((pdfFile, index) => (
              <div key={pdfFile.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{pdfFile.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatFileSize(pdfFile.size)}</p>
                </div>

                {mode === 'merge' && selectedFiles.length > 1 && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveFile(index, Math.max(0, index - 1))}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveFile(index, Math.min(selectedFiles.length - 1, index + 1))}
                      disabled={index === selectedFiles.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50"
                      title="Move down"
                    >
                      ↓
                    </button>
                  </div>
                )}

                <button
                  onClick={() => removeFile(pdfFile.id)}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="Remove file"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Split Settings */}
      {mode === 'split' && selectedFiles.length === 1 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Split Settings</h3>

          <div className="max-w-md">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Split after page number
            </label>
            <input
              type="number"
              value={splitPage}
              onChange={(e) => setSplitPage(e.target.value)}
              placeholder="e.g., 5"
              min="1"
              className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              The PDF will be split into two files: pages 1-{splitPage} and pages {parseInt(splitPage) + 1}+
            </p>
          </div>
        </div>
      )}

      {/* Action Button */}
      {selectedFiles.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                Ready to {mode === 'merge' ? 'Merge' : 'Split'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {mode === 'merge'
                  ? `${selectedFiles.length} files • ${formatFileSize(totalSize)} total`
                  : `${selectedFiles[0].name} • ${formatFileSize(selectedFiles[0].size)}`
                }
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={processPdf}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {mode === 'merge' ? 'Merging...' : 'Splitting...'}
                  </>
                ) : (
                  <>
                    <ArrowRight size={16} />
                    {mode === 'merge' ? 'Merge PDFs' : 'Split PDF'}
                  </>
                )}
              </button>

              <button
                onClick={resetTool}
                className="px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 flex-shrink-0">
            <Scissors size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">How It Works</h3>
            <div className="text-sm text-green-800 dark:text-green-200 space-y-2">
              <p>
                <strong>PDF merging and splitting are now fully functional!</strong> The tool processes your PDF files server-side for accurate document manipulation.
              </p>
              <p>
                <strong>Merge mode:</strong> Combine multiple PDF files into a single document. Files are merged in the order they appear in the list.
              </p>
              <p>
                <strong>Split mode:</strong> Divide a PDF into two parts at the specified page number. The result is downloaded as a ZIP file containing both parts.
              </p>
              <p>
                All processing happens securely on the server to ensure data privacy and accurate results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfMergerSplitter;
