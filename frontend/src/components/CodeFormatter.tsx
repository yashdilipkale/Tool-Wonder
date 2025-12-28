import React, { useState, useEffect } from 'react';
import { FileCode, Copy, RotateCcw, Settings, Code, Zap } from 'lucide-react';

const CodeFormatter: React.FC = () => {
  const [inputCode, setInputCode] = useState<string>('');
  const [formattedCode, setFormattedCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [useTabs, setUseTabs] = useState<boolean>(false);
  const [isFormatting, setIsFormatting] = useState<boolean>(false);

  // Supported languages
  const languages = [
    { value: 'javascript', label: 'JavaScript', extension: 'js' },
    { value: 'typescript', label: 'TypeScript', extension: 'ts' },
    { value: 'python', label: 'Python', extension: 'py' },
    { value: 'java', label: 'Java', extension: 'java' },
    { value: 'csharp', label: 'C#', extension: 'cs' },
    { value: 'cpp', label: 'C++', extension: 'cpp' },
    { value: 'php', label: 'PHP', extension: 'php' },
    { value: 'ruby', label: 'Ruby', extension: 'rb' },
    { value: 'go', label: 'Go', extension: 'go' },
    { value: 'rust', label: 'Rust', extension: 'rs' },
    { value: 'html', label: 'HTML', extension: 'html' },
    { value: 'css', label: 'CSS', extension: 'css' },
    { value: 'json', label: 'JSON', extension: 'json' },
    { value: 'xml', label: 'XML', extension: 'xml' },
    { value: 'sql', label: 'SQL', extension: 'sql' }
  ];

  // Basic code formatting function (in a real app, this would use a proper code formatter)
  const formatCode = async (code: string, lang: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!code.trim()) return code;

    let formatted = code;

    // Basic formatting based on language
    switch (lang) {
      case 'javascript':
      case 'typescript':
        formatted = formatJavaScript(code);
        break;
      case 'python':
        formatted = formatPython(code);
        break;
      case 'java':
      case 'csharp':
      case 'cpp':
      case 'php':
      case 'go':
      case 'rust':
        formatted = formatCLike(code);
        break;
      case 'html':
        formatted = formatHTML(code);
        break;
      case 'css':
        formatted = formatCSS(code);
        break;
      case 'json':
        formatted = formatJSON(code);
        break;
      case 'xml':
        formatted = formatXML(code);
        break;
      case 'sql':
        formatted = formatSQL(code);
        break;
      case 'ruby':
        formatted = formatRuby(code);
        break;
      default:
        formatted = basicFormat(code);
    }

    return formatted;
  };

  // Basic JavaScript/TypeScript formatting
  const formatJavaScript = (code: string): string => {
    let formatted = code;
    const indent = useTabs ? '\t' : ' '.repeat(indentSize);

    // Add proper indentation
    let level = 0;
    formatted = formatted.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      // Decrease indent for closing braces
      if (trimmed.startsWith('}')) {
        level = Math.max(0, level - 1);
      }

      const indented = indent.repeat(level) + trimmed;

      // Increase indent for opening braces
      if (trimmed.endsWith('{') || trimmed.endsWith('(') || trimmed.endsWith('[')) {
        level++;
      }

      return indented;
    }).join('\n');

    return formatted;
  };

  // Basic Python formatting
  const formatPython = (code: string): string => {
    const indent = ' '.repeat(4); // Python standard is 4 spaces
    let formatted = code;

    // Basic indentation for Python
    let level = 0;
    formatted = formatted.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      // Decrease indent for dedent keywords
      if (/^(return|break|continue|pass|raise)$/.test(trimmed) ||
          trimmed.startsWith('elif ') ||
          trimmed.startsWith('else:') ||
          trimmed.startsWith('except ') ||
          trimmed.startsWith('finally:')) {
        level = Math.max(0, level - 1);
      }

      const indented = indent.repeat(level) + trimmed;

      // Increase indent after colon
      if (trimmed.endsWith(':') ||
          trimmed.startsWith('if ') ||
          trimmed.startsWith('for ') ||
          trimmed.startsWith('while ') ||
          trimmed.startsWith('try:') ||
          trimmed.startsWith('def ') ||
          trimmed.startsWith('class ')) {
        level++;
      }

      return indented;
    }).join('\n');

    return formatted;
  };

  // Basic C-like language formatting (Java, C#, C++, PHP, Go, Rust)
  const formatCLike = (code: string): string => {
    let formatted = code;
    const indent = useTabs ? '\t' : ' '.repeat(indentSize);

    let level = 0;
    formatted = formatted.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      // Decrease indent for closing braces
      if (trimmed.startsWith('}')) {
        level = Math.max(0, level - 1);
      }

      const indented = indent.repeat(level) + trimmed;

      // Increase indent for opening braces
      if (trimmed.endsWith('{')) {
        level++;
      }

      return indented;
    }).join('\n');

    return formatted;
  };

  // Basic HTML formatting
  const formatHTML = (code: string): string => {
    let formatted = code;
    const indent = useTabs ? '\t' : ' '.repeat(indentSize);

    // Very basic HTML indentation
    let level = 0;
    formatted = formatted.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      // Decrease indent for closing tags
      if (trimmed.startsWith('</')) {
        level = Math.max(0, level - 1);
      }

      const indented = indent.repeat(level) + trimmed;

      // Increase indent for opening tags
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && trimmed.endsWith('>')) {
        level++;
      }

      return indented;
    }).join('\n');

    return formatted;
  };

  // Basic CSS formatting
  const formatCSS = (code: string): string => {
    let formatted = code;
    const indent = useTabs ? '\t' : ' '.repeat(indentSize);

    let level = 0;
    formatted = formatted.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      // Decrease indent for closing braces
      if (trimmed.startsWith('}')) {
        level = Math.max(0, level - 1);
      }

      const indented = indent.repeat(level) + trimmed;

      // Increase indent for opening braces
      if (trimmed.endsWith('{')) {
        level++;
      }

      return indented;
    }).join('\n');

    return formatted;
  };

  // JSON formatting
  const formatJSON = (code: string): string => {
    try {
      const parsed = JSON.parse(code);
      return JSON.stringify(parsed, null, useTabs ? '\t' : indentSize);
    } catch {
      return code;
    }
  };

  // Basic XML formatting
  const formatXML = (code: string): string => {
    const indent = useTabs ? '\t' : ' '.repeat(indentSize);

    // Very basic XML indentation
    let level = 0;
    let formatted = code.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      if (trimmed.startsWith('</')) {
        level = Math.max(0, level - 1);
      }

      const indented = indent.repeat(level) + trimmed;

      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
        level++;
      }

      return indented;
    }).join('\n');

    return formatted;
  };

  // SQL formatting
  const formatSQL = (code: string): string => {
    // Basic SQL formatting
    let formatted = code.toUpperCase()
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ',\n')
      .replace(/\s*(SELECT|FROM|WHERE|JOIN|ORDER BY|GROUP BY|HAVING|INSERT|UPDATE|DELETE)\s+/gi, '\n$1 ')
      .replace(/\s*(AND|OR)\s+/gi, '\n  $1 ')
      .trim();

    return formatted;
  };

  // Ruby formatting
  const formatRuby = (code: string): string => {
    const indent = ' '.repeat(2); // Ruby standard is 2 spaces
    let level = 0;

    let formatted = code.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      // Decrease indent for end keyword
      if (trimmed === 'end' || trimmed.startsWith('elsif ') || trimmed.startsWith('else')) {
        level = Math.max(0, level - 1);
      }

      const indented = indent.repeat(level) + trimmed;

      // Increase indent after keywords
      if (trimmed.startsWith('def ') ||
          trimmed.startsWith('class ') ||
          trimmed.startsWith('module ') ||
          trimmed.startsWith('if ') ||
          trimmed.startsWith('unless ') ||
          trimmed.startsWith('while ') ||
          trimmed.startsWith('for ') ||
          trimmed.startsWith('begin') ||
          trimmed.startsWith('case ') ||
          (trimmed.endsWith(' do') && !trimmed.includes('.'))) {
        level++;
      }

      return indented;
    }).join('\n');

    return formatted;
  };

  // Basic formatting for unsupported languages
  const basicFormat = (code: string): string => {
    // Just clean up extra whitespace
    return code.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  };

  useEffect(() => {
    if (inputCode) {
      setIsFormatting(true);
      const timeoutId = setTimeout(async () => {
        const result = await formatCode(inputCode, language);
        setFormattedCode(result);
        setIsFormatting(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setFormattedCode('');
    }
  }, [inputCode, language, indentSize, useTabs]);

  const handleCopyFormatted = async () => {
    if (formattedCode) {
      await navigator.clipboard.writeText(formattedCode);
    }
  };

  const handleReset = () => {
    setInputCode('');
    setFormattedCode('');
    setLanguage('javascript');
    setIndentSize(2);
    setUseTabs(false);
  };

  const selectedLanguage = languages.find(lang => lang.value === language);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-900/30 rounded-full text-slate-600 dark:text-slate-400">
          <FileCode size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Code Formatter</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Format and beautify code in multiple programming languages</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Input Code</h2>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {selectedLanguage?.extension.toUpperCase()} • {inputCode.split('\n').length} lines
            </div>
          </div>

          {/* Language and Options */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Indent Size
                </label>
                <select
                  value={indentSize}
                  onChange={(e) => setIndentSize(Number(e.target.value))}
                  disabled={useTabs}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent disabled:bg-slate-100 disabled:dark:bg-slate-800"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={8}>8 spaces</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useTabs}
                  onChange={(e) => setUseTabs(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-slate-600 focus:ring-slate-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Use tabs instead of spaces</span>
              </label>
            </div>
          </div>

          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder={`Enter your ${selectedLanguage?.label} code here...`}
            className="w-full h-64 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent font-mono text-sm resize-none"
          />

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
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Formatted Code</h2>
            {formattedCode && (
              <button
                onClick={handleCopyFormatted}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Copy size={14} />
                Copy
              </button>
            )}
          </div>

          <div className="h-64 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            {isFormatting ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-600 border-t-transparent"></div>
              </div>
            ) : formattedCode ? (
              <div className="p-4 h-full overflow-y-auto">
                <pre className="whitespace-pre-wrap text-slate-900 dark:text-slate-100 font-mono text-sm leading-relaxed">
                  {formattedCode}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                <div className="text-center">
                  <Code size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Formatted code will appear here</p>
                  <p className="text-sm mt-2">Add code in the input section</p>
                </div>
              </div>
            )}
          </div>

          {/* Statistics */}
          {formattedCode && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">Code Statistics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-600 dark:text-slate-400">Language</div>
                  <div className="font-medium">{selectedLanguage?.label}</div>
                </div>
                <div>
                  <div className="text-slate-600 dark:text-slate-400">Lines</div>
                  <div className="font-medium">{formattedCode.split('\n').length}</div>
                </div>
                <div>
                  <div className="text-slate-600 dark:text-slate-400">Characters</div>
                  <div className="font-medium">{formattedCode.length}</div>
                </div>
                <div>
                  <div className="text-slate-600 dark:text-slate-400">Indentation</div>
                  <div className="font-medium">{useTabs ? 'Tabs' : `${indentSize} spaces`}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">💻 Code Formatting Features</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• <strong>15+ Languages</strong> - Support for JavaScript, Python, Java, C++, HTML, CSS, JSON, SQL, and more</li>
          <li>• <strong>Smart Indentation</strong> - Automatic indentation based on language syntax</li>
          <li>• <strong>Flexible Options</strong> - Choose between spaces or tabs, customize indent size</li>
          <li>• <strong>Syntax Aware</strong> - Language-specific formatting rules and conventions</li>
          <li>• <strong>Real-time Processing</strong> - Instant formatting as you type</li>
        </ul>
      </div>
    </div>
  );
};

export default CodeFormatter;
