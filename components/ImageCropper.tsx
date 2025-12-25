import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, Image as ImageIcon, ArrowRight, Crop } from 'lucide-react';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ImageCropper: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 200, height: 200 });
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setCroppedPreview(null);

      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        // Initialize crop area to center of image with reasonable size
        const size = Math.min(img.width, img.height) * 0.6;
        setCropArea({
          x: (img.width - size) / 2,
          y: (img.height - size) / 2,
          width: size,
          height: size
        });
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const getCanvasCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, []);

  const isPointInCropArea = useCallback((x: number, y: number, area: CropArea) => {
    return x >= area.x && x <= area.x + area.width && y >= area.y && y <= area.y + area.height;
  }, []);

  const getResizeHandle = useCallback((x: number, y: number, area: CropArea) => {
    const handleSize = 10;
    const handles = [
      { name: 'nw', x: area.x, y: area.y },
      { name: 'ne', x: area.x + area.width, y: area.y },
      { name: 'sw', x: area.x, y: area.y + area.height },
      { name: 'se', x: area.x + area.width, y: area.y + area.height }
    ];

    for (const handle of handles) {
      if (Math.abs(x - handle.x) <= handleSize && Math.abs(y - handle.y) <= handleSize) {
        return handle.name;
      }
    }
    return null;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);
    const handle = getResizeHandle(coords.x, coords.y, cropArea);

    if (handle) {
      setResizeHandle(handle);
      setDragStart(coords);
    } else if (isPointInCropArea(coords.x, coords.y, cropArea)) {
      setIsDragging(true);
      setDragStart(coords);
    }
  }, [cropArea, getCanvasCoordinates, getResizeHandle, isPointInCropArea]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);

    if (resizeHandle && dragStart) {
      const deltaX = coords.x - dragStart.x;
      const deltaY = coords.y - dragStart.y;

      setCropArea(prev => {
        let newArea = { ...prev };

        switch (resizeHandle) {
          case 'nw':
            newArea.x += deltaX;
            newArea.y += deltaY;
            newArea.width -= deltaX;
            newArea.height -= deltaY;
            break;
          case 'ne':
            newArea.y += deltaY;
            newArea.width += deltaX;
            newArea.height -= deltaY;
            break;
          case 'sw':
            newArea.x += deltaX;
            newArea.width -= deltaX;
            newArea.height += deltaY;
            break;
          case 'se':
            newArea.width += deltaX;
            newArea.height += deltaY;
            break;
        }

        // Ensure minimum size
        if (newArea.width < 50) newArea.width = 50;
        if (newArea.height < 50) newArea.height = 50;

        // Keep within bounds
        if (newArea.x < 0) newArea.x = 0;
        if (newArea.y < 0) newArea.y = 0;
        if (originalImage) {
          if (newArea.x + newArea.width > originalImage.width) newArea.width = originalImage.width - newArea.x;
          if (newArea.y + newArea.height > originalImage.height) newArea.height = originalImage.height - newArea.y;
        }

        return newArea;
      });

      setDragStart(coords);
    } else if (isDragging && dragStart) {
      const deltaX = coords.x - dragStart.x;
      const deltaY = coords.y - dragStart.y;

      setCropArea(prev => {
        let newArea = {
          ...prev,
          x: prev.x + deltaX,
          y: prev.y + deltaY
        };

        // Keep within bounds
        if (newArea.x < 0) newArea.x = 0;
        if (newArea.y < 0) newArea.y = 0;
        if (originalImage) {
          if (newArea.x + newArea.width > originalImage.width) newArea.x = originalImage.width - newArea.width;
          if (newArea.y + newArea.height > originalImage.height) newArea.y = originalImage.height - newArea.height;
        }

        return newArea;
      });

      setDragStart(coords);
    }
  }, [cropArea, dragStart, isDragging, resizeHandle, getCanvasCoordinates, originalImage]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setResizeHandle(null);
    setDragStart(null);
  }, []);

  const cropImage = async () => {
    if (!originalImage || !canvasRef.current) return;

    setIsCropping(true);
    setError(null);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      canvas.width = cropArea.width;
      canvas.height = cropArea.height;

      ctx.drawImage(
        originalImage,
        cropArea.x, cropArea.y, cropArea.width, cropArea.height,
        0, 0, cropArea.width, cropArea.height
      );

      const croppedDataUrl = canvas.toDataURL('image/png');
      setCroppedPreview(croppedDataUrl);
    } catch (err) {
      setError('Failed to crop image. Please try again.');
      console.error('Crop error:', err);
    } finally {
      setIsCropping(false);
    }
  };

  const downloadCroppedImage = () => {
    if (!croppedPreview || !selectedFile) return;

    const link = document.createElement('a');
    link.href = croppedPreview;
    const originalName = selectedFile.name.replace(/\.[^/.]+$/, '');
    link.download = `${originalName}_cropped.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetCropper = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setCroppedPreview(null);
    setCropArea({ x: 0, y: 0, width: 200, height: 200 });
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Draw canvas with crop overlay
  React.useEffect(() => {
    if (!originalImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to maintain aspect ratio
    const maxWidth = 600;
    const maxHeight = 400;
    const aspectRatio = originalImage.width / originalImage.height;

    let canvasWidth = maxWidth;
    let canvasHeight = maxWidth / aspectRatio;

    if (canvasHeight > maxHeight) {
      canvasHeight = maxHeight;
      canvasWidth = maxHeight * aspectRatio;
    }

    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    // Draw image
    ctx.drawImage(originalImage, 0, 0);

    // Draw crop overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop area
    ctx.clearRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    ctx.drawImage(
      originalImage,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height
    );

    // Draw crop rectangle
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

    // Draw resize handles
    ctx.fillStyle = '#3b82f6';
    const handleSize = 8;
    const handles = [
      [cropArea.x, cropArea.y],
      [cropArea.x + cropArea.width, cropArea.y],
      [cropArea.x, cropArea.y + cropArea.height],
      [cropArea.x + cropArea.width, cropArea.y + cropArea.height]
    ];

    handles.forEach(([x, y]) => {
      ctx.fillRect(x - handleSize/2, y - handleSize/2, handleSize, handleSize);
    });
  }, [originalImage, cropArea]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Upload Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
            <Crop size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Crop Image</h2>
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

      {/* Crop Interface */}
      {originalImage && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Select Crop Area</h3>

          <div className="flex flex-col items-center space-y-4">
            <div className="border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="cursor-move"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-400 text-center">
              <p>Drag to move the crop area • Drag corners to resize</p>
              <p>Crop size: {Math.round(cropArea.width)} × {Math.round(cropArea.height)} px</p>
            </div>

            <button
              onClick={cropImage}
              disabled={isCropping}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCropping ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Cropping...
                </>
              ) : (
                <>
                  <ArrowRight size={16} />
                  Crop Image
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Cropped Result */}
      {croppedPreview && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Cropped Image</h3>
            <div className="flex gap-2">
              <button
                onClick={downloadCroppedImage}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Download size={16} />
                Download
              </button>
              <button
                onClick={resetCropper}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors text-sm"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src={croppedPreview}
              alt="Cropped result"
              className="max-w-full h-auto border border-slate-200 dark:border-slate-600 rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
