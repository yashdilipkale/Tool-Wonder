import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Copy, RotateCcw, Palette } from 'lucide-react';

interface GradientStop {
  id: string;
  color: string;
  position: number;
}

const GradientGenerator: React.FC = () => {
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [direction, setDirection] = useState('to right');
  const [stops, setStops] = useState<GradientStop[]>([
    { id: '1', color: '#3b82f6', position: 0 },
    { id: '2', color: '#8b5cf6', position: 100 }
  ]);
  const [cssCode, setCssCode] = useState('');

  const directions = [
    { value: 'to right', label: 'Left to Right' },
    { value: 'to left', label: 'Right to Left' },
    { value: 'to bottom', label: 'Top to Bottom' },
    { value: 'to top', label: 'Bottom to Top' },
    { value: 'to bottom right', label: 'Top Left to Bottom Right' },
    { value: 'to bottom left', label: 'Top Right to Bottom Left' },
    { value: 'to top right', label: 'Bottom Left to Top Right' },
    { value: 'to top left', label: 'Bottom Right to Top Left' },
    { value: '45deg', label: '45°' },
    { value: '90deg', label: '90°' },
    { value: '135deg', label: '135°' },
    { value: '180deg', label: '180°' },
    { value: '225deg', label: '225°' },
    { value: '270deg', label: '270°' },
    { value: '315deg', label: '315°' }
  ];

  const presetGradients = [
    { name: 'Ocean Blue', colors: ['#1e3a8a', '#3b82f6', '#60a5fa'] },
    { name: 'Sunset', colors: ['#f59e0b', '#ef4444', '#dc2626'] },
    { name: 'Forest', colors: ['#16a34a', '#22c55e', '#84cc16'] },
    { name: 'Purple Dream', colors: ['#7c3aed', '#a855f7', '#c084fc'] },
    { name: 'Fire', colors: ['#dc2626', '#ea580c', '#f59e0b'] },
    { name: 'Ice', colors: ['#06b6d4', '#67e8f9', '#f0f9ff'] },
    { name: 'Rose', colors: ['#e11d48', '#f43f5e', '#fb7185'] },
    { name: 'Emerald', colors: ['#065f46', '#059669', '#10b981'] }
  ];

  useEffect(() => {
    generateCSS();
  }, [gradientType, direction, stops]);

  const generateCSS = () => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopStrings = sortedStops.map(stop => `${stop.color} ${stop.position}%`);

    let css = '';
    if (gradientType === 'linear') {
      css = `background: linear-gradient(${direction}, ${stopStrings.join(', ')});`;
    } else {
      css = `background: radial-gradient(circle, ${stopStrings.join(', ')});`;
    }

    setCssCode(css);
  };

  const addStop = () => {
    if (stops.length >= 10) return; // Limit to 10 stops

    const newId = Date.now().toString();
    const newPosition = stops.length > 0 ? Math.min(100, stops[stops.length - 1].position + 20) : 50;
    const newColor = '#ef4444'; // Default red

    setStops([...stops, { id: newId, color: newColor, position: newPosition }]);
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) return; // Keep at least 2 stops
    setStops(stops.filter(stop => stop.id !== id));
  };

  const updateStop = (id: string, field: 'color' | 'position', value: string | number) => {
    setStops(stops.map(stop =>
      stop.id === id ? { ...stop, [field]: value } : stop
    ));
  };

  const loadPreset = (colors: string[]) => {
    const newStops = colors.map((color, index) => ({
      id: `preset-${index}`,
      color,
      position: Math.round((index / (colors.length - 1)) * 100)
    }));
    setStops(newStops);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const resetGradient = () => {
    setStops([
      { id: '1', color: '#3b82f6', position: 0 },
      { id: '2', color: '#8b5cf6', position: 100 }
    ]);
    setGradientType('linear');
    setDirection('to right');
  };

  const getGradientStyle = () => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopStrings = sortedStops.map(stop => `${stop.color} ${stop.position}%`);

    if (gradientType === 'linear') {
      return `linear-gradient(${direction}, ${stopStrings.join(', ')})`;
    } else {
      return `radial-gradient(circle, ${stopStrings.join(', ')})`;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Gradient Generator</h2>
          <p className="text-slate-600 dark:text-slate-400">Create beautiful CSS gradients with multiple colors</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Gradient Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Preview</h3>
          <div
            className="w-full h-32 rounded-lg border border-slate-300 dark:border-slate-600 shadow-lg"
            style={{ background: getGradientStyle() }}
          />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gradient Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Gradient Type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setGradientType('linear')}
                className={`flex-1 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                  gradientType === 'linear'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Linear
              </button>
              <button
                onClick={() => setGradientType('radial')}
                className={`flex-1 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                  gradientType === 'radial'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Radial
              </button>
            </div>
          </div>

          {/* Direction (only for linear) */}
          {gradientType === 'linear' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Direction
              </label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                {directions.map((dir) => (
                  <option key={dir.value} value={dir.value}>
                    {dir.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Color Stops */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Color Stops ({stops.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={addStop}
                disabled={stops.length >= 10}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
              <button
                onClick={resetGradient}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-600 hover:bg-slate-700 text-white rounded"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {stops.map((stop, index) => (
              <div key={stop.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400 w-6">
                    {index + 1}
                  </span>
                  <div
                    className="w-6 h-6 rounded border border-slate-300 dark:border-slate-500"
                    style={{ backgroundColor: stop.color }}
                  />
                </div>

                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateStop(stop.id, 'color', e.target.value)}
                  className="w-12 h-8 rounded border border-slate-300 dark:border-slate-600 cursor-pointer"
                />

                <input
                  type="text"
                  value={stop.color}
                  onChange={(e) => updateStop(stop.id, 'color', e.target.value)}
                  placeholder="#000000"
                  className="flex-1 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-600 text-slate-900 dark:text-white font-mono"
                />

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={stop.position}
                    onChange={(e) => updateStop(stop.id, 'position', parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">%</span>
                </div>

                <button
                  onClick={() => removeStop(stop.id)}
                  disabled={stops.length <= 2}
                  className="p-1 text-red-600 hover:text-red-700 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preset Gradients */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Preset Gradients
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {presetGradients.map((preset) => (
              <button
                key={preset.name}
                onClick={() => loadPreset(preset.colors)}
                className="p-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:border-blue-500 transition-colors"
              >
                <div
                  className="w-full h-8 rounded mb-2"
                  style={{
                    background: `linear-gradient(to right, ${preset.colors.join(', ')})`
                  }}
                />
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {preset.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CSS Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">CSS Code</h3>
            <button
              onClick={() => copyToClipboard(cssCode)}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-700 dark:text-slate-300"
            >
              <Copy className="w-4 h-4" />
              Copy CSS
            </button>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600">
            <code className="text-sm text-slate-900 dark:text-white font-mono break-all">
              {cssCode}
            </code>
          </div>
        </div>

        {/* Usage Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">How to Use</h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p>• Add color stops by clicking the "Add" button</p>
            <p>• Drag color pickers or type hex codes manually</p>
            <p>• Adjust position percentages for color placement</p>
            <p>• Use preset gradients as starting points</p>
            <p>• Copy the generated CSS to use in your stylesheets</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientGenerator;
