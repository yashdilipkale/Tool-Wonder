import React, { useState, useRef } from 'react';
import { Lock, Unlock, Download, Upload, AlertTriangle, FileText, Key } from 'lucide-react';

const FileEncryption: React.FC = () => {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert password to key using Web Crypto API
  const getKeyFromPassword = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt.buffer.slice(salt.byteOffset, salt.byteOffset + salt.byteLength) as ArrayBuffer,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  };

  // Encrypt file content
  const encryptFile = async (file: File, password: string): Promise<Blob> => {
    const arrayBuffer = await file.arrayBuffer();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const key = await getKeyFromPassword(password, salt);

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      arrayBuffer
    );

    // Combine salt + iv + encrypted data
    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);

    return new Blob([combined], { type: 'application/octet-stream' });
  };

  // Decrypt file content
  const decryptFile = async (file: File, password: string): Promise<Blob> => {
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    const salt = data.slice(0, 16);
    const iv = data.slice(16, 28);
    const encrypted = data.slice(28);

    const key = await getKeyFromPassword(password, salt);

    try {
      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        encrypted
      );

      // Try to determine original file type from content
      let mimeType = 'application/octet-stream';
      const uint8Array = new Uint8Array(decrypted);

      // Check for common file signatures
      if (uint8Array.length > 4) {
        const header = uint8Array.slice(0, 4);
        if (header[0] === 0xFF && header[1] === 0xD8 && header[2] === 0xFF) {
          mimeType = 'image/jpeg';
        } else if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47) {
          mimeType = 'image/png';
        } else if (header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46) {
          mimeType = 'application/pdf';
        } else if (uint8Array.length > 8 && uint8Array[0] === 0x50 && uint8Array[1] === 0x4B && uint8Array[2] === 0x03 && uint8Array[3] === 0x04) {
          mimeType = 'application/zip';
        }
      }

      return new Blob([decrypted], { type: mimeType });
    } catch (error) {
      throw new Error('Incorrect password or corrupted file');
    }
  };

  // Handle file processing
  const handleProcess = async () => {
    if (!file || !password) {
      setResult({ type: 'error', message: 'Please select a file and enter a password' });
      return;
    }

    if (password.length < 8) {
      setResult({ type: 'error', message: 'Password must be at least 8 characters long' });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      let processedBlob: Blob;
      let fileName: string;

      if (mode === 'encrypt') {
        processedBlob = await encryptFile(file, password);
        fileName = `${file.name}.encrypted`;
      } else {
        processedBlob = await decryptFile(file, password);
        fileName = file.name.replace('.encrypted', '');
      }

      // Download the processed file
      const url = URL.createObjectURL(processedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setResult({
        type: 'success',
        message: `File ${mode === 'encrypt' ? 'encrypted' : 'decrypted'} successfully! Downloaded as ${fileName}`
      });

      // Clear form
      setFile(null);
      setPassword('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred during processing'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">File Encryption</h2>
          <p className="text-slate-600 dark:text-slate-400">Securely encrypt and decrypt files with AES-256</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Mode Selection */}
        <div>
          <div className="flex border-b border-slate-200 dark:border-slate-700 mb-4">
            <button
              onClick={() => setMode('encrypt')}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                mode === 'encrypt'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Lock className="w-4 h-4" />
              Encrypt
            </button>
            <button
              onClick={() => setMode('decrypt')}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                mode === 'decrypt'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Unlock className="w-4 h-4" />
              Decrypt
            </button>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Select File
          </label>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept={mode === 'decrypt' ? '.encrypted' : '*'}
            />
            <div className="flex flex-col items-center gap-3">
              {file ? (
                <>
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{file.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    Change file
                  </button>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {mode === 'decrypt' ? 'Select an encrypted file (.encrypted)' : 'Any file type supported'}
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Choose File
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter encryption password (min 8 characters)"
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Use a strong password. Remember it - lost passwords cannot be recovered!
          </p>
        </div>

        {/* Process Button */}
        <button
          onClick={handleProcess}
          disabled={!file || !password || password.length < 8 || isProcessing}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {mode === 'encrypt' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              {mode === 'encrypt' ? 'Encrypt File' : 'Decrypt File'}
            </>
          )}
        </button>

        {/* Result */}
        {result && (
          <div className={`p-4 rounded-lg ${
            result.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-start gap-3">
              {result.type === 'success' ? (
                <Download className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
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

        {/* Security Info */}
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Security Notes:</strong>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• Files are encrypted using AES-256-GCM in your browser</li>
                <li>• Passwords are never stored or transmitted</li>
                <li>• Use strong, unique passwords for encryption</li>
                <li>• Keep your password safe - lost passwords cannot be recovered</li>
                <li>• This tool works entirely in your browser for privacy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileEncryption;
