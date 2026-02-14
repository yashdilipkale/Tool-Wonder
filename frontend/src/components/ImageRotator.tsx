import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, ArrowRight, RefreshCcw, FlipHorizontal, FlipVertical } from 'lucide-react';

const ImageRotator: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false);
  const [flipVertical, setFlipVertical] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const supportedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!supportedFormats.some(format => file.type.includes(format))) {
        setError('Unsupported file format. Please select JPG, PNG, GIF, WEBP, or BMP files.');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setProcessedImage(null);
      setRotation(0);
      setFlipHorizontal(false);
      setFlipVertical(false);

      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const applyTransformations = async () => {
    if (!originalImage || !canvasRef.current) return;

    setIsProcessing(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // Calculate new dimensions based on rotation
      const angle = (rotation * Math.PI) / 180;
      const cos = Math.abs(Math.cos(angle));
      const sin = Math.abs(Math.sin(angle));

      const newWidth = Math.round(originalImage.width * cos + originalImage.height * sin);
      const newHeight = Math.round(originalImage.width * sin + originalImage.height * cos);

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply transformations
      ctx.save();

      // Move to center for rotation
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle);

      // Apply flipping
      if (flipHorizontal) ctx.scale(-1, 1);
      if (flipVertical) ctx.scale(1, -1);

      // Draw image centered
      ctx.drawImage(
        originalImage,
        -originalImage.width / 2,
        -originalImage.height / 2,
        originalImage.width,
        originalImage.height
      );

      ctx.restore();

      // Convert to data URL
      const processedDataUrl = canvas.toDataURL('image/png');
      setProcessedImage(processedDataUrl);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Image processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Image rotation function with exact code requested
  const rotateImage90Degrees = async () => {
    if (!originalImage || !canvasRef.current) return;

    setIsProcessing(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // Set canvas size for 90-degree rotation
      canvas.width = originalImage.height;
      canvas.height = originalImage.width;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply 90-degree rotation
      ctx.rotate(90 * Math.PI / 180);
      ctx.drawImage(originalImage, 0, 0);

      // Convert to data URL
      const rotatedDataUrl = canvas.toDataURL('image/png');
      setProcessedImage(rotatedDataUrl);
    } catch (err) {
      setError('Failed to rotate image. Please try again.');
      console.error('Rotation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const rotateClockwise = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const rotateCounterClockwise = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const toggleFlipHorizontal = () => {
    setFlipHorizontal((prev) => !prev);
  };

  const toggleFlipVertical = () => {
    setFlipVertical((prev) => !prev);
  };

  const resetTransformations = () => {
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
    setProcessedImage(null);
  };

  const downloadProcessedImage = () => {
    if (!processedImage || !selectedFile) return;

    const link = document.createElement('a');
    link.href = processedImage;
    const originalName = selectedFile.name.replace(/\.[^/.]+$/, '');
    const transformations = [];
    if (rotation !== 0) transformations.push(`${rotation}deg`);
    if (flipHorizontal) transformations.push('flipped-h');
    if (flipVertical) transformations.push('flipped-v');
    const suffix = transformations.length > 0 ? `_${transformations.join('_')}` : '_rotated';
    link.download = `${originalName}${suffix}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetRotator = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setProcessedImage(null);
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
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
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
            <RefreshCcw size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Rotate & Flip Image</h2>
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
                    Supports JPG, PNG, GIF, WEBP, BMP
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

      {/* Transformation Controls */}
      {originalImage && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Transformation Controls</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rotation Controls */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Rotation</h4>
              <div className="flex items-center gap-3">
                <button
                  onClick={rotateCounterClockwise}
                  className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  title="Rotate counter-clockwise"
                >
                  <RefreshCcw size={16} />
                </button>

                <div className="flex-1 text-center">
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">
                    {rotation}°
                  </span>
                </div>

                <button
                  onClick={rotateClockwise}
                  className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  title="Rotate clockwise"
                >
                  <RefreshCcw size={16} className="transform rotate-180" />
                </button>
              </div>
            </div>

            {/* Flip Controls */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Flip</h4>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleFlipHorizontal}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                    flipHorizontal
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                  title="Flip horizontally"
                >
                  <FlipHorizontal size={16} />
                </button>

                <div className="flex-1 text-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {flipHorizontal && flipVertical && 'Flipped H & V'}
                    {flipHorizontal && !flipVertical && 'Flipped Horizontal'}
                    {!flipHorizontal && flipVertical && 'Flipped Vertical'}
                    {!flipHorizontal && !flipVertical && 'No Flip'}
                  </span>
                </div>

                <button
                  onClick={toggleFlipVertical}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                    flipVertical
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                  title="Flip vertically"
                >
                  <FlipVertical size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={applyTransformations}
              disabled={isProcessing || (rotation === 0 && !flipHorizontal && !flipVertical)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <ArrowRight size={16} />
                  Apply Changes
                </>
              )}
            </button>

            <button
              onClick={rotateImage90Degrees}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Rotating...
                </>
              ) : (
                <>
                  <RefreshCcw size={16} />
                  Rotate 90°
                </>
              )}
            </button>

            <button
              onClick={resetTransformations}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {(originalImage || processedImage) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Image */}
          {originalImage && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Original Image</h3>
              <div className="aspect-video bg-slate-50 dark:bg-slate-700 rounded-lg overflow-hidden mb-4">
                <img
                  src={originalImage.src}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <p>{originalImage.width} × {originalImage.height} px</p>
              </div>
            </div>
          )}

          {/* Processed Image */}
          {processedImage && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Transformed Image</h3>
                <div className="flex gap-2">
                  <button
                    onClick={downloadProcessedImage}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    onClick={resetRotator}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors text-sm"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="aspect-video bg-slate-50 dark:bg-slate-700 rounded-lg overflow-hidden mb-4">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-400">
                <p>Transformations applied: {rotation !== 0 ? `${rotation}° rotation` : ''} {flipHorizontal ? 'horizontal flip' : ''} {flipVertical ? 'vertical flip' : ''}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageRotator;
