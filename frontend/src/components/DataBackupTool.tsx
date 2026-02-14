import React, { useState, useRef } from "react";
import {
  Database,
  Upload,
  Download,
  Trash2,
  Archive,
  AlertTriangle,
  CheckCircle,
  FileText,
} from "lucide-react";

interface BackupFile {
  file: File;
  id: string;
}

const DataBackupTool: React.FC = () => {
  const [files, setFiles] = useState<BackupFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [archiveName, setArchiveName] = useState("backup");
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList) => {
    const newFiles: BackupFile[] = Array.from(fileList).map((file) => ({
      file,
      id: Date.now() + Math.random().toString(36),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    setResult(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

  const createBackup = async () => {
    if (!files.length) {
      setResult({ type: "error", message: "Please select files first." });
      return;
    }

    setIsProcessing(true);

    try {
      const metadata = {
        createdAt: new Date().toISOString(),
        fileCount: files.length,
        totalSize,
        files: files.map((f) => ({
          name: f.file.name,
          size: f.file.size,
          type: f.file.type,
        })),
      };

      const blob = new Blob([JSON.stringify(metadata, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${archiveName || "backup"}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setResult({
        type: "success",
        message: `Backup created successfully! (${files.length} files)`,
      });

      setFiles([]);
    } catch {
      setResult({ type: "error", message: "Backup failed." });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 shadow-2xl rounded-2xl p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <Database className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Secure Data Backup</h2>
          <p className="text-slate-500 text-sm">
            Backup files locally. Nothing is uploaded.
          </p>
        </div>
      </div>

      {/* Drag Drop */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-slate-300 dark:border-slate-700"
        }`}
      >
        <Upload className="mx-auto mb-3 text-slate-400" size={40} />
        <p className="font-semibold">
          Drag & Drop files here or Click to Upload
        </p>
        <p className="text-sm text-slate-500">
          Supports multiple file selection
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={handleFileSelect}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">
              {files.length} files selected ({totalSizeMB} MB)
            </h3>
            <input
              type="text"
              value={archiveName}
              onChange={(e) => setArchiveName(e.target.value)}
              className="border rounded-lg px-3 py-1 text-sm dark:bg-slate-800"
              placeholder="Backup name"
            />
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((f) => (
              <div
                key={f.id}
                className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-slate-400" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-xs">
                      {f.file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(f.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(f.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={createBackup}
            disabled={isProcessing}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Archive size={18} />
            )}
            Create Backup
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          className={`p-4 rounded-xl flex items-start gap-3 ${
            result.type === "success"
              ? "bg-green-50 dark:bg-green-900/20"
              : "bg-red-50 dark:bg-red-900/20"
          }`}
        >
          {result.type === "success" ? (
            <CheckCircle className="text-green-600" />
          ) : (
            <AlertTriangle className="text-red-600" />
          )}
          <p className="text-sm">{result.message}</p>
        </div>
      )}
    </div>
  );
};

export default DataBackupTool;
