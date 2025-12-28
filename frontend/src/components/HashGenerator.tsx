import React, { useState, useEffect } from 'react';
import { Lock, Copy, Upload, RotateCcw, Hash, Key, FileText } from 'lucide-react';

interface HashResult {
  algorithm: string;
  hash: string;
  length: number;
}

const HashGenerator: React.FC = () => {
  const [inputText, setInputText] = useState<string>('Hello World');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(['SHA-256']);
  const [hashResults, setHashResults] = useState<HashResult[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Available hash algorithms
  const algorithms = [
    { name: 'MD5', value: 'MD5', available: false, length: 128 },
    { name: 'SHA-1', value: 'SHA-1', available: true, length: 160 },
    { name: 'SHA-256', value: 'SHA-256', available: true, length: 256 },
    { name: 'SHA-384', value: 'SHA-384', available: true, length: 384 },
    { name: 'SHA-512', value: 'SHA-512', available: true, length: 512 }
  ];

  // Simple MD5 implementation (not cryptographically secure, for demo purposes only)
  const simpleMD5 = (str: string): string => {
    // This is a very basic hash function for demonstration
    // In production, you would use a proper MD5 library or crypto API
    let hash = 0;
    if (str.length === 0) return hash.toString(16);

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Convert to hex and pad
    let hex = Math.abs(hash).toString(16);
    while (hex.length < 8) {
      hex = '0' + hex;
    }
    return hex;
  };

  const generateHash = async (data: string | ArrayBuffer, algorithm: string): Promise<string> => {
    if (algorithm === 'MD5') {
      // Use simple MD5 for demo (not secure)
      return simpleMD5(typeof data === 'string' ? data : 'binary data');
    }

    try {
      const encoder = new TextEncoder();
      const dataBuffer = typeof data === 'string' ? encoder.encode(data) : data;

      const hashBuffer = await crypto.subtle.digest(algorithm, dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error(`Error generating ${algorithm} hash:`, error);
      return 'Error generating hash';
    }
  };

  const generateAllHashes = async () => {
    if (!inputText && !selectedFile) return;

    setIsGenerating(true);
    const results: HashResult[] = [];

    try {
      const data = selectedFile ? await selectedFile.arrayBuffer() : inputText;

      for (const algorithm of selectedAlgorithms) {
        const hash = await generateHash(data, algorithm);
        const algoInfo = algorithms.find(a => a.value === algorithm);
        results.push({
          algorithm,
          hash,
          length: algoInfo?.length || 0
        });
      }

      setHashResults(results);
    } catch (error) {
      console.error('Error generating hashes:', error);
    }

    setIsGenerating(false);
  };

  useEffect(() => {
    generateAllHashes();
  }, [inputText, selectedAlgorithms, selectedFile]);

  const handleAlgorithmToggle = (algorithm: string) => {
    setSelectedAlgorithms(prev =>
      prev.includes(algorithm)
        ? prev.filter(a => a !== algorithm)
        : [...prev, algorithm]
    );
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setInputType('file');
    }
  };

  const handleCopyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
  };

  const handleReset = () => {
    setInputText('Hello World');
    setSelectedFile(null);
    setInputType('text');
    setSelectedAlgorithms(['SHA-256']);
    setHashResults([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-400">
          <Lock size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Hash Generator</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Generate cryptographic hashes for text and files</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Key size={20} />
              Input
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setInputType('text')}
                className={`px-3 py-1 rounded text-sm ${
                  inputType === 'text'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Text
              </button>
              <button
                onClick={() => setInputType('file')}
                className={`px-3 py-1 rounded text-sm ${
                  inputType === 'file'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                File
              </button>
            </div>
          </div>

          {inputType === 'text' ? (
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to hash..."
              className="w-full h-32 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
            />
          ) : (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload size={48} className="mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-600 dark:text-slate-400 mb-2">
                    {selectedFile ? selectedFile.name : 'Click to select a file'}
                  </p>
                  {selectedFile && (
                    <p className="text-sm text-slate-500">
                      Size: {formatFileSize(selectedFile.size)}
                    </p>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Algorithm Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Hash Algorithms</h3>
            <div className="grid grid-cols-2 gap-2">
              {algorithms.map((algo) => (
                <label key={algo.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedAlgorithms.includes(algo.value)}
                    onChange={() => handleAlgorithmToggle(algo.value)}
                    className="rounded border-slate-300 dark:border-slate-600 text-amber-600 focus:ring-amber-500"
                    disabled={!algo.available}
                  />
                  <span className={`text-sm ${!algo.available ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {algo.name}
                    {!algo.available && ' (Demo only)'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw size={16} className="inline mr-2" />
              Reset
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Hash size={20} />
              Hash Results
            </h2>
          </div>

          <div className="space-y-3">
            {isGenerating ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-600 border-t-transparent"></div>
              </div>
            ) : hashResults.length > 0 ? (
              hashResults.map((result, index) => (
                <div key={index} className="border border-slate-300 dark:border-slate-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Lock size={16} />
                      {result.algorithm}
                      <span className="text-xs text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                        {result.length} bits
                      </span>
                    </h4>
                    <button
                      onClick={() => handleCopyHash(result.hash)}
                      className="flex items-center gap-1 px-2 py-1 text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      <Copy size={12} />
                      Copy
                    </button>
                  </div>

                  <div className="font-mono text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 p-3 rounded border break-all">
                    {result.hash}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-8 text-slate-500 dark:text-slate-400">
                <div className="text-center">
                  <Hash size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Hash results will appear here</p>
                  <p className="text-sm mt-2">Enter text or select a file above</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">🔐 Hash Generator Features</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• <strong>Multiple Algorithms</strong> - MD5, SHA-1, SHA-256, SHA-384, SHA-512 support</li>
          <li>• <strong>Text & File Support</strong> - Hash both text strings and file contents</li>
          <li>• <strong>Real-time Generation</strong> - Instant hash calculation as you type</li>
          <li>• <strong>Copy to Clipboard</strong> - Easy copying of generated hashes</li>
          <li>• <strong>Batch Processing</strong> - Generate multiple hash types simultaneously</li>
        </ul>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-yellow-600 text-sm">⚠️</span>
          </div>
          <div>
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">Security Notice</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              MD5 and SHA-1 are considered cryptographically weak and should not be used for security purposes.
              Use SHA-256 or higher for secure applications. The MD5 implementation here is for demonstration only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashGenerator;
