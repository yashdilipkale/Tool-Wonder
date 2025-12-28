import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, ArrowRight, PenTool, Signature } from 'lucide-react';

const PdfEsign: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [signatureType, setSignatureType] = useState<'text' | 'draw' | 'upload'>('text');
  const [signatureText, setSignatureText] = useState<string>('');
  const [signatureFont, setSignatureFont] = useState<string>('signature');
  const [signatureColor, setSignatureColor] = useState<string>('#000000');
  const [signatureSize, setSignatureSize] = useState<string>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

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

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle signature image upload
      console.log('Signature uploaded:', file);
    }
  };

  const addSignature = async () => {
    if (!selectedFile) return;

    if (signatureType === 'text' && !signatureText.trim()) {
      setError('Please enter your signature text.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);
      formData.append('signatureType', signatureType);
      formData.append('signatureText', signatureText);
      formData.append('signatureFont', signatureFont);
      formData.append('signatureColor', signatureColor);
      formData.append('signatureSize', signatureSize);

      const response = await fetch('http://localhost:3001/esign-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add signature to PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile.name.replace('.pdf', '_signed.pdf');
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add signature to PDF. Please try again.');
      console.error('PDF signing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setSelectedFile(null);
    setSignatureText('');
    setSignatureType('text');
    setSignatureFont('signature');
    setSignatureColor('#000000');
    setSignatureSize('medium');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (signatureInputRef.current) {
      signatureInputRef.current.value = '';
    }
  };

  const signatureFonts = [
    { value: 'signature', label: 'Signature Style' },
    { value: 'cursive', label: 'Cursive' },
    { value: 'script', label: 'Script' },
    { value: 'brush', label: 'Brush Script' }
  ];

  const signatureSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'xlarge', label: 'Extra Large' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
            <PenTool size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">eSign PDF</h2>
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
                    Add electronic signatures to your PDF documents
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

        {/* Signature Options */}
        {selectedFile && (
          <div className="mt-6 space-y-6">
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Signature Type</h3>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => setSignatureType('text')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    signatureType === 'text'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">✍️</div>
                    <div className="text-sm font-medium">Text Signature</div>
                  </div>
                </button>

                <button
                  onClick={() => setSignatureType('draw')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    signatureType === 'draw'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎨</div>
                    <div className="text-sm font-medium">Draw Signature</div>
                  </div>
                </button>

                <button
                  onClick={() => setSignatureType('upload')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    signatureType === 'upload'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📎</div>
                    <div className="text-sm font-medium">Upload Image</div>
                  </div>
                </button>
              </div>

              {/* Text Signature Options */}
              {signatureType === 'text' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Signature Text
                    </label>
                    <input
                      type="text"
                      value={signatureText}
                      onChange={(e) => setSignatureText(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full p-3 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Font Style
                      </label>
                      <select
                        value={signatureFont}
                        onChange={(e) => setSignatureFont(e.target.value)}
                        className="w-full p-3 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {signatureFonts.map((font) => (
                          <option key={font.value} value={font.value}>
                            {font.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Size
                      </label>
                      <select
                        value={signatureSize}
                        onChange={(e) => setSignatureSize(e.target.value)}
                        className="w-full p-3 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {signatureSizes.map((size) => (
                          <option key={size.value} value={size.value}>
                            {size.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Color
                      </label>
                      <input
                        type="color"
                        value={signatureColor}
                        onChange={(e) => setSignatureColor(e.target.value)}
                        className="w-full h-12 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Signature Preview */}
                  {signatureText && (
                    <div className="mt-4 p-4 bg-white dark:bg-slate-600 rounded-lg border">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Preview:</p>
                      <div
                        className="text-2xl font-bold"
                        style={{
                          color: signatureColor,
                          fontFamily: signatureFont === 'signature' ? 'cursive' :
                                    signatureFont === 'cursive' ? 'cursive' :
                                    signatureFont === 'script' ? '"Brush Script MT", cursive' :
                                    '"Brush Script MT", cursive'
                        }}
                      >
                        {signatureText}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Draw Signature Placeholder */}
              {signatureType === 'draw' && (
                <div className="text-center py-8">
                  <Signature size={48} className="mx-auto text-slate-400 dark:text-slate-500 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">
                    Interactive signature drawing would be implemented here with canvas-based drawing tools.
                  </p>
                </div>
              )}

              {/* Upload Signature */}
              {signatureType === 'upload' && (
                <div className="text-center">
                  <input
                    ref={signatureInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="hidden"
                    id="signature-input"
                  />
                  <label htmlFor="signature-input" className="inline-block px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    Upload Signature Image
                  </label>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Upload a scanned signature or signature image (PNG, JPG)
                  </p>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="flex gap-3">
              <button
                onClick={addSignature}
                disabled={isProcessing || (signatureType === 'text' && !signatureText.trim())}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding Signature...
                  </>
                ) : (
                  <>
                    <ArrowRight size={16} />
                    Add Signature to PDF
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
        )}

        {/* How It Works */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 flex-shrink-0">
              <PenTool size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">How It Works</h3>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <p>
                  <strong>PDF electronic signatures are now functional!</strong> Add text-based signatures to your PDF documents with customizable styling.
                </p>
                <p>
                  <strong>Text signatures:</strong> Enter your name and customize font, size, and color. The signature is added to the bottom-right corner of the first page.
                </p>
                <p>
                  <strong>Note:</strong> This implementation provides basic signature placement. For legally binding digital signatures with certificates, additional infrastructure would be required.
                </p>
                <p>
                  All signature processing happens securely on the server.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfEsign;
