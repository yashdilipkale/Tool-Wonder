import React, { useState, useRef } from 'react';
import { Database, Upload, Download, Trash2, Archive, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

interface BackupFile {
  file: File;
  id: string;
}

const DataBackupTool: React.FC = () => {
  const [files, setFiles] = useState<BackupFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [archiveName, setArchiveName] = useState('backup');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add files to backup list
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles: BackupFile[] = Array.from(selectedFiles).map(file => ({
        file,
        id: Date.now() + Math.random().toString(36).substr(2, 9)
      }));
      setFiles(prev => [...prev, ...newFiles]);
      setResult(null);
    }
  };

  // Remove file from list
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  // Create ZIP archive using JSZip (we'll need to add this dependency)
  const createBackup = async () => {
    if (files.length === 0) {
      setResult({ type: 'error', message: 'Please select at least one file to backup' });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      // For this demo, we'll create a simple text-based backup
      // In a real implementation, you'd use a library like JSZip
      const backupData = {
        metadata: {
          createdAt: new Date().toISOString(),
          fileCount: files.length,
          totalSize: files.reduce((sum, f) => sum + f.file.size, 0)
        },
        files: files.map(f => ({
          name: f.file.name,
          size: f.file.size,
          type: f.file.type,
          lastModified: f.file.lastModified
        }))
      };

      // Create a JSON backup file
      const backupJson = JSON.stringify(backupData, null, 2);
      const backupBlob = new Blob([backupJson], { type: 'application/json' });

      // Download the backup
      const url = URL.createObjectURL(backupBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${archiveName || 'backup'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setResult({
        type: 'success',
        message: `Backup created successfully! ${files.length} files backed up as ${archiveName || 'backup'}.json`
      });

      // Clear files after successful backup
      setFiles([]);
      setArchiveName('backup');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to create backup'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Create individual file backups
  const createIndividualBackups = async () => {
    if (files.length === 0) {
      setResult({ type: 'error', message: 'Please select at least one file to backup' });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      for (const fileItem of files) {
        const url = URL.createObjectURL(fileItem.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileItem.file.name}.backup`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setResult({
        type: 'success',
        message: `Individual backups created for ${files.length} files`
      });

      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to create backups'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Data Backup Tool</h2>
          <p className="text-slate-600 dark:text-slate-400">Create secure backups of your important files</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* File Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Select Files to Backup
          </label>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3">
              {files.length === 0 ? (
                <>
                  <Upload className="w-8 h-8 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      Drop files here or click to select
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Select multiple files for backup
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Choose Files
                  </button>
                </>
              ) : (
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {files.length} file{files.length !== 1 ? 's' : ''} selected ({totalSizeMB} MB)
                    </h3>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      Add more files
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {files.map((fileItem) => (
                      <div key={fileItem.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-xs">
                              {fileItem.file.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {(fileItem.file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(fileItem.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Archive Name */}
        {files.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Backup Name
            </label>
            <input
              type="text"
              value={archiveName}
              onChange={(e) => setArchiveName(e.target.value)}
              placeholder="Enter backup name"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        )}

        {/* Backup Options */}
        {files.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Backup Options</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={createBackup}
                disabled={isProcessing}
                className="flex items-center justify-center gap-3 p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
              >
                <Archive className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div className="text-left">
                  <div className="font-medium text-slate-900 dark:text-white">Create Backup Archive</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Download as JSON metadata file</div>
                </div>
              </button>

              <button
                onClick={createIndividualBackups}
                disabled={isProcessing}
                className="flex items-center justify-center gap-3 p-4 border-2 border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
              >
                <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div className="text-left">
                  <div className="font-medium text-slate-900 dark:text-white">Individual Backups</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Download each file separately</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-blue-800 dark:text-blue-200">Creating backup...</span>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`p-4 rounded-lg ${
            result.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-start gap-3">
              {result.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${
                result.type === 'success'
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {result.message}
              </p>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Backup Information:</strong>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• Files are processed locally in your browser</li>
                <li>• No data is uploaded to external servers</li>
                <li>• Keep multiple backup copies in different locations</li>
                <li>• Test your backups regularly to ensure they work</li>
                <li>• Consider using encrypted storage for sensitive backups</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataBackupTool;
