import React, { useState } from 'react';
import { Type, Copy, Download, RotateCcw } from 'lucide-react';

const TextCaseConverter: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [selectedCase, setSelectedCase] = useState<string>('sentence');
  const [stats, setStats] = useState<{
    originalLength: number;
    convertedLength: number;
    wordsCount: number;
    linesCount: number;
  } | null>(null);

  const caseOptions = [
    { value: 'sentence', label: 'Sentence Case', description: 'Capitalize first letter of each sentence' },
    { value: 'title', label: 'Title Case', description: 'Capitalize first letter of each word' },
    { value: 'uppercase', label: 'UPPERCASE', description: 'Convert all letters to uppercase' },
    { value: 'lowercase', label: 'lowercase', description: 'Convert all letters to lowercase' },
    { value: 'camel', label: 'camelCase', description: 'First word lowercase, others capitalized' },
    { value: 'pascal', label: 'PascalCase', description: 'All words capitalized, no spaces' },
    { value: 'snake', label: 'snake_case', description: 'Words separated by underscores' },
    { value: 'kebab', label: 'kebab-case', description: 'Words separated by hyphens' },
    { value: 'alternating', label: 'AlTeRnAtInG', description: 'Alternate between upper and lower case' },
  ];

  const convertText = () => {
    if (!inputText.trim()) {
      setOutputText('');
      setStats(null);
      return;
    }

    let converted = '';
    const originalLength = inputText.length;

    switch (selectedCase) {
      case 'sentence':
        converted = inputText.replace(/(^\w|\.\s*\w)/g, (match) => match.toUpperCase());
        break;
      case 'title':
        converted = inputText.replace(/\b\w/g, (match) => match.toUpperCase());
        break;
      case 'uppercase':
        converted = inputText.toUpperCase();
        break;
      case 'lowercase':
        converted = inputText.toLowerCase();
        break;
      case 'camel':
        const words = inputText.toLowerCase().split(/\s+/);
        converted = words[0] + words.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
        break;
      case 'pascal':
        converted = inputText.toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase()).replace(/\s+/g, '');
        break;
      case 'snake':
        converted = inputText.toLowerCase().replace(/\s+/g, '_');
        break;
      case 'kebab':
        converted = inputText.toLowerCase().replace(/\s+/g, '-');
        break;
      case 'alternating':
        converted = inputText.split('').map((char, index) =>
          index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
        ).join('');
        break;
      default:
        converted = inputText;
    }

    setOutputText(converted);

    // Calculate stats
    const wordsCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    const linesCount = inputText.split('\n').length;

    setStats({
      originalLength,
      convertedLength: converted.length,
      wordsCount,
      linesCount
    });
  };

  const copyToClipboard = async () => {
    if (!outputText) return;

    try {
      await navigator.clipboard.writeText(outputText);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const downloadText = () => {
    if (!outputText) return;

    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted_text_${selectedCase}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetConverter = () => {
    setInputText('');
    setOutputText('');
    setSelectedCase('sentence');
    setStats(null);
  };

  // Auto-convert when inputs change
  React.useEffect(() => {
    convertText();
  }, [inputText, selectedCase]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
            <Type size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Text Case Converter</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Input Text
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text here..."
                rows={8}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Conversion Type
              </label>
              <select
                value={selectedCase}
                onChange={(e) => setSelectedCase(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {caseOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {caseOptions.find(opt => opt.value === selectedCase)?.description}
              </p>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Converted Text
                </label>
                {outputText && (
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy size={12} />
                      Copy
                    </button>
                    <button
                      onClick={downloadText}
                      className="flex items-center gap-1 px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors"
                      title="Download as text file"
                    >
                      <Download size={12} />
                      Download
                    </button>
                  </div>
                )}
              </div>
              <textarea
                value={outputText}
                readOnly
                rows={8}
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white resize-none"
                placeholder="Converted text will appear here..."
              />
            </div>

            <button
              onClick={resetConverter}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.originalLength}</div>
              <div className="text-sm text-blue-800 dark:text-blue-200">Original Characters</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.convertedLength}</div>
              <div className="text-sm text-green-800 dark:text-green-200">Converted Characters</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.wordsCount}</div>
              <div className="text-sm text-purple-800 dark:text-purple-200">Words</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.linesCount}</div>
              <div className="text-sm text-orange-800 dark:text-orange-200">Lines</div>
            </div>
          </div>
        )}

        {/* Case Examples */}
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Case Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {caseOptions.slice(0, 6).map((option) => (
              <div key={option.value} className="bg-white dark:bg-slate-600 rounded p-3">
                <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">{option.label}</div>
                <div className="text-slate-600 dark:text-slate-400 text-xs">
                  {option.value === 'sentence' && '"Hello world. This is a test."'}
                  {option.value === 'title' && '"Hello World This Is A Test"'}
                  {option.value === 'uppercase' && '"HELLO WORLD THIS IS A TEST"'}
                  {option.value === 'lowercase' && '"hello world this is a test"'}
                  {option.value === 'camel' && '"helloWorldThisIsATest"'}
                  {option.value === 'pascal' && '"HelloWorldThisIsATest"'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextCaseConverter;
