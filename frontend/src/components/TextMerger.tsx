import React, { useState, useEffect } from 'react';
import { FileText, Copy, RotateCcw, Plus, Minus, ArrowUpDown, Filter, Settings } from 'lucide-react';

interface TextBlock {
  id: string;
  content: string;
  title: string;
}

const TextMerger: React.FC = () => {
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([
    { id: '1', content: '', title: 'Text Block 1' },
    { id: '2', content: '', title: 'Text Block 2' }
  ]);
  const [mergedText, setMergedText] = useState<string>('');
  const [separator, setSeparator] = useState<string>('\n\n');
  const [customSeparator, setCustomSeparator] = useState<string>('');
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(false);
  const [sortLines, setSortLines] = useState<boolean>(false);
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(false);
  const [addLineNumbers, setAddLineNumbers] = useState<boolean>(false);

  // Statistics
  const [stats, setStats] = useState<{
    totalBlocks: number;
    totalLines: number;
    totalCharacters: number;
    mergedLines: number;
  }>({ totalBlocks: 0, totalLines: 0, totalCharacters: 0, mergedLines: 0 });

  const addTextBlock = () => {
    const newId = (textBlocks.length + 1).toString();
    const newBlock: TextBlock = {
      id: newId,
      content: '',
      title: `Text Block ${newId}`
    };
    setTextBlocks([...textBlocks, newBlock]);
  };

  const removeTextBlock = (id: string) => {
    if (textBlocks.length > 2) {
      setTextBlocks(textBlocks.filter(block => block.id !== id));
    }
  };

  const updateTextBlock = (id: string, content: string) => {
    setTextBlocks(textBlocks.map(block =>
      block.id === id ? { ...block, content } : block
    ));
  };

  const moveTextBlock = (id: string, direction: 'up' | 'down') => {
    const index = textBlocks.findIndex(block => block.id === id);
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < textBlocks.length - 1)
    ) {
      const newBlocks = [...textBlocks];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
      setTextBlocks(newBlocks);
    }
  };

  const mergeTexts = () => {
    let allLines: string[] = [];

    textBlocks.forEach(block => {
      if (block.content.trim()) {
        const lines = block.content.split('\n');
        allLines.push(...lines);
      }
    });

    // Apply options
    if (trimWhitespace) {
      allLines = allLines.map(line => line.trim()).filter(line => line.length > 0);
    }

    if (removeDuplicates) {
      allLines = [...new Set(allLines)];
    }

    if (sortLines) {
      allLines.sort((a, b) => a.localeCompare(b));
    }

    if (addLineNumbers) {
      allLines = allLines.map((line, index) => `${(index + 1).toString().padStart(3, ' ')}. ${line}`);
    }

    // Use custom separator if provided, otherwise use selected separator
    const finalSeparator = customSeparator || separator;
    const merged = allLines.join(finalSeparator);

    setMergedText(merged);

    // Calculate statistics
    const totalLines = textBlocks.reduce((sum, block) =>
      sum + (block.content ? block.content.split('\n').length : 0), 0
    );
    const totalCharacters = textBlocks.reduce((sum, block) =>
      sum + block.content.length, 0
    );

    setStats({
      totalBlocks: textBlocks.length,
      totalLines,
      totalCharacters,
      mergedLines: allLines.length
    });
  };

  useEffect(() => {
    mergeTexts();
  }, [textBlocks, separator, customSeparator, removeDuplicates, sortLines, trimWhitespace, addLineNumbers]);

  const handleCopyMerged = async () => {
    if (mergedText) {
      await navigator.clipboard.writeText(mergedText);
    }
  };

  const handleReset = () => {
    setTextBlocks([
      { id: '1', content: '', title: 'Text Block 1' },
      { id: '2', content: '', title: 'Text Block 2' }
    ]);
    setMergedText('');
    setCustomSeparator('');
    setSeparator('\n\n');
    setRemoveDuplicates(false);
    setSortLines(false);
    setTrimWhitespace(false);
    setAddLineNumbers(false);
    setStats({ totalBlocks: 0, totalLines: 0, totalCharacters: 0, mergedLines: 0 });
  };

  const separatorOptions = [
    { value: '\n\n', label: 'Double Newline', preview: 'line1\n\nline2' },
    { value: '\n', label: 'Single Newline', preview: 'line1\nline2' },
    { value: ', ', label: 'Comma + Space', preview: 'line1, line2' },
    { value: '; ', label: 'Semicolon + Space', preview: 'line1; line2' },
    { value: ' | ', label: 'Pipe + Spaces', preview: 'line1 | line2' },
    { value: '---\n', label: 'Dashed Separator', preview: 'line1\n---\nline2' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full text-cyan-600 dark:text-cyan-400">
          <FileText size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Text Merger</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Combine multiple text blocks with customizable separators and options</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Text Blocks</h2>
            <button
              onClick={addTextBlock}
              className="flex items-center gap-1 px-3 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
            >
              <Plus size={14} />
              Add Block
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {textBlocks.map((block, index) => (
              <div key={block.id} className="border border-slate-300 dark:border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">{block.title}</h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveTextBlock(block.id, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50"
                      title="Move up"
                    >
                      <ArrowUpDown size={14} />
                    </button>
                    <button
                      onClick={() => moveTextBlock(block.id, 'down')}
                      disabled={index === textBlocks.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50"
                      title="Move down"
                    >
                      <ArrowUpDown size={14} className="rotate-180" />
                    </button>
                    <button
                      onClick={() => removeTextBlock(block.id)}
                      disabled={textBlocks.length <= 2}
                      className="p-1 text-red-400 hover:text-red-600 disabled:opacity-50"
                      title="Remove block"
                    >
                      <Minus size={14} />
                    </button>
                  </div>
                </div>

                <textarea
                  value={block.content}
                  onChange={(e) => updateTextBlock(block.id, e.target.value)}
                  placeholder="Enter text content..."
                  className="w-full h-24 p-3 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                />

                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {block.content.split('\n').length} lines, {block.content.length} characters
                </div>
              </div>
            ))}
          </div>

          {/* Merge Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Settings size={20} />
              Merge Options
            </h3>

            {/* Separator Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Separator Between Blocks
              </label>
              <div className="grid grid-cols-2 gap-2">
                {separatorOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSeparator(option.value);
                      setCustomSeparator('');
                    }}
                    className={`p-2 text-left rounded border-2 transition-all ${
                      separator === option.value && !customSeparator
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs opacity-75 font-mono">{option.preview}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Separator */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Custom Separator (optional)
              </label>
              <input
                type="text"
                value={customSeparator}
                onChange={(e) => setCustomSeparator(e.target.value)}
                placeholder="Enter custom separator..."
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            {/* Processing Options */}
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={removeDuplicates}
                  onChange={(e) => setRemoveDuplicates(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Remove duplicates</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={sortLines}
                  onChange={(e) => setSortLines(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Sort lines</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={trimWhitespace}
                  onChange={(e) => setTrimWhitespace(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Trim whitespace</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={addLineNumbers}
                  onChange={(e) => setAddLineNumbers(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Add line numbers</span>
              </label>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Merged Result</h2>
            {mergedText && (
              <button
                onClick={handleCopyMerged}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Copy size={14} />
                Copy Result
              </button>
            )}
          </div>

          <div className="h-64 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
            {mergedText ? (
              <div className="p-4 h-full overflow-y-auto">
                <pre className="whitespace-pre-wrap text-slate-900 dark:text-slate-100 font-mono text-sm leading-relaxed">
                  {mergedText}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                <div className="text-center">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Merged text will appear here</p>
                  <p className="text-sm mt-2">Add content to text blocks above</p>
                </div>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
            <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">Merge Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="text-cyan-600" size={16} />
                <span className="text-slate-600 dark:text-slate-400">Text Blocks:</span>
                <span className="font-medium text-cyan-600">{stats.totalBlocks}</span>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-blue-600" size={16} />
                <span className="text-slate-600 dark:text-slate-400">Total Lines:</span>
                <span className="font-medium text-blue-600">{stats.totalLines}</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="text-green-600" size={16} />
                <span className="text-slate-600 dark:text-slate-400">Characters:</span>
                <span className="font-medium text-green-600">{stats.totalCharacters}</span>
              </div>
              <div className="flex items-center gap-2">
                <Copy className="text-purple-600" size={16} />
                <span className="text-slate-600 dark:text-slate-400">Merged Lines:</span>
                <span className="font-medium text-purple-600">{stats.mergedLines}</span>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw size={16} className="inline mr-2" />
            Reset All
          </button>
        </div>
      </div>

      {/* Features Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">📄 Text Merger Features</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• <strong>Multiple Text Blocks</strong> - Combine unlimited text sources</li>
          <li>• <strong>Flexible Separators</strong> - Choose from presets or use custom separators</li>
          <li>• <strong>Smart Processing</strong> - Remove duplicates, sort lines, and trim whitespace</li>
          <li>• <strong>Line Numbering</strong> - Add numbered prefixes to merged lines</li>
          <li>• <strong>Block Reordering</strong> - Drag and reorder text blocks as needed</li>
        </ul>
      </div>
    </div>
  );
};

export default TextMerger;
