import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, AlertTriangle, Copy, RotateCcw, FileText, Zap } from 'lucide-react';

interface GrammarIssue {
  id: string;
  type: 'error' | 'warning' | 'suggestion';
  message: string;
  suggestion: string;
  start: number;
  end: number;
  rule: string;
}

const GrammarChecker: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [correctedText, setCorrectedText] = useState<string>('');
  const [issues, setIssues] = useState<GrammarIssue[]>([]);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState<number>(0);
  const [stats, setStats] = useState<{
    errors: number;
    warnings: number;
    suggestions: number;
    score: number;
  }>({ errors: 0, warnings: 0, suggestions: 0, score: 100 });

  // Mock grammar checking function (in a real app, this would call a grammar API)
  const checkGrammar = async (text: string): Promise<{ corrected: string; issues: GrammarIssue[] }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);

    let correctedText = text;
    const foundIssues: GrammarIssue[] = [];
    let issueId = 0;

    // Basic grammar checks (in reality, AI would do much more sophisticated analysis)

    // Check for double spaces
    const doubleSpaceMatches = [...text.matchAll(/  +/g)];
    doubleSpaceMatches.forEach(match => {
      foundIssues.push({
        id: `issue-${issueId++}`,
        type: 'error',
        message: 'Multiple consecutive spaces found',
        suggestion: 'Use single spaces between words',
        start: match.index!,
        end: match.index! + match[0].length,
        rule: 'spacing'
      });
      correctedText = correctedText.replace(match[0], ' ');
    });

    // Check for sentences starting with lowercase letters
    sentences.forEach((sentence, index) => {
      const trimmed = sentence.trim();
      if (trimmed.length > 0 && trimmed[0] === trimmed[0].toLowerCase() && trimmed[0].match(/[a-z]/)) {
        const sentenceStart = text.indexOf(trimmed);
        foundIssues.push({
          id: `issue-${issueId++}`,
          type: 'warning',
          message: 'Sentence should start with a capital letter',
          suggestion: trimmed.charAt(0).toUpperCase() + trimmed.slice(1),
          start: sentenceStart,
          end: sentenceStart + trimmed.length,
          rule: 'capitalization'
        });
        // Apply correction
        const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
        correctedText = correctedText.replace(trimmed, capitalized);
      }
    });

    // Check for missing punctuation at sentence ends
    const sentencesWithoutPunctuation = text.split(/[.!?]/).filter(s => s.trim().length > 50);
    sentencesWithoutPunctuation.forEach((sentence, index) => {
      const trimmed = sentence.trim();
      if (trimmed.length > 0 && !/[.!?]$/.test(text)) {
        // This is a simplified check - in reality, this would be more sophisticated
        const lastSentence = sentences[sentences.length - 1];
        if (lastSentence && lastSentence.length > 20 && !/[.!?]$/.test(lastSentence.trim())) {
          const sentenceStart = text.lastIndexOf(lastSentence.trim());
          foundIssues.push({
            id: `issue-${issueId++}`,
            type: 'suggestion',
            message: 'Consider adding punctuation at the end of the sentence',
            suggestion: lastSentence.trim() + '.',
            start: sentenceStart,
            end: sentenceStart + lastSentence.trim().length,
            rule: 'punctuation'
          });
        }
      }
    });

    // Check for common grammar issues
    const commonIssues = [
      { pattern: /\bi\b/gi, message: '"I" should be capitalized', suggestion: 'I' },
      { pattern: /\bim\b/gi, message: '"I\'m" should be "I\'m"', suggestion: 'I\'m' },
      { pattern: /\bits\b/gi, message: '"it\'s" should be "it\'s" (possessive)', suggestion: 'its' },
      { pattern: /\btheres\b/gi, message: '"there\'s" should be "there\'s"', suggestion: 'there\'s' },
      { pattern: /\btheyre\b/gi, message: '"they\'re" should be "they\'re"', suggestion: 'they\'re' },
      { pattern: /\bwere\b/gi, message: '"we\'re" should be "we\'re"', suggestion: 'we\'re' }
    ];

    commonIssues.forEach(({ pattern, message, suggestion }) => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[0] !== suggestion) {
          foundIssues.push({
            id: `issue-${issueId++}`,
            type: 'warning',
            message,
            suggestion,
            start: match.index!,
            end: match.index! + match[0].length,
            rule: 'contractions'
          });
        }
      });
    });

    return {
      corrected: correctedText,
      issues: foundIssues
    };
  };

  const handleCheckGrammar = async () => {
    if (!inputText.trim()) return;

    setIsChecking(true);
    try {
      const result = await checkGrammar(inputText);
      setCorrectedText(result.corrected);
      setIssues(result.issues);

      // Calculate stats
      const errors = result.issues.filter(issue => issue.type === 'error').length;
      const warnings = result.issues.filter(issue => issue.type === 'warning').length;
      const suggestions = result.issues.filter(issue => issue.type === 'suggestion').length;

      // Calculate grammar score (simplified)
      const totalIssues = errors + warnings + suggestions;
      const score = Math.max(0, 100 - (totalIssues * 5) - (errors * 10));

      setStats({ errors, warnings, suggestions, score });
    } catch (error) {
      console.error('Grammar check failed:', error);
    }
    setIsChecking(false);
  };

  const handleCopyCorrected = async () => {
    if (correctedText) {
      await navigator.clipboard.writeText(correctedText);
    }
  };

  const handleReset = () => {
    setInputText('');
    setCorrectedText('');
    setIssues([]);
    setWordCount(0);
    setStats({ errors: 0, warnings: 0, suggestions: 0, score: 100 });
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="text-red-500" size={16} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'suggestion':
        return <CheckCircle className="text-blue-500" size={16} />;
      default:
        return <CheckCircle className="text-green-500" size={16} />;
    }
  };

  const getIssueColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20';
      case 'suggestion':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'border-green-200 bg-green-50 dark:bg-green-900/20';
    }
  };

  useEffect(() => {
    const words = inputText.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [inputText]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
          <Eye size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Grammar Checker</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Advanced proofreading and grammar correction powered by AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Input Text</h2>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {wordCount} words
            </div>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste or type your text here to check grammar..."
            className="w-full h-80 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            disabled={isChecking}
          />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCheckGrammar}
              disabled={!inputText.trim() || isChecking}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {isChecking ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Checking...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Check Grammar
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              disabled={isChecking}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Corrected Text</h2>
            {correctedText && (
              <button
                onClick={handleCopyCorrected}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Copy size={14} />
                Copy
              </button>
            )}
          </div>

          <div className="h-80 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
            {correctedText ? (
              <div className="p-4 h-full overflow-y-auto">
                <pre className="whitespace-pre-wrap text-slate-900 dark:text-slate-100 font-sans text-sm leading-relaxed">
                  {correctedText}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                <div className="text-center">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Corrected text will appear here</p>
                </div>
              </div>
            )}
          </div>

          {/* Grammar Score */}
          {stats.score !== 100 && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-slate-800 dark:text-slate-200">Grammar Score</h4>
                <div className={`text-2xl font-bold ${
                  stats.score >= 80 ? 'text-green-600' :
                  stats.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {stats.score}/100
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-red-600 font-medium">{stats.errors}</div>
                  <div className="text-slate-600 dark:text-slate-400">Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-600 font-medium">{stats.warnings}</div>
                  <div className="text-slate-600 dark:text-slate-400">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-600 font-medium">{stats.suggestions}</div>
                  <div className="text-slate-600 dark:text-slate-400">Suggestions</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Issues List */}
      {issues.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <AlertTriangle size={20} />
            Grammar Issues Found ({issues.length})
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className={`p-4 rounded-lg border ${getIssueColor(issue.type)}`}
              >
                <div className="flex items-start gap-3">
                  {getIssueIcon(issue.type)}
                  <div className="flex-1">
                    <div className="font-medium text-slate-800 dark:text-slate-200 mb-1">
                      {issue.message}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Rule: {issue.rule}
                    </div>
                    {issue.suggestion && (
                      <div className="text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Suggestion: </span>
                        <span className="text-green-600 dark:text-green-400 font-mono">
                          {issue.suggestion}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">🔍 AI Grammar Checking Features</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• <strong>Advanced Proofreading</strong> - AI-powered grammar and style analysis</li>
          <li>• <strong>Real-time Correction</strong> - Automatic error detection and suggestions</li>
          <li>• <strong>Multiple Issue Types</strong> - Errors, warnings, and style suggestions</li>
          <li>• <strong>Grammar Scoring</strong> - Overall text quality assessment</li>
          <li>• <strong>One-click Corrections</strong> - Apply suggested fixes instantly</li>
        </ul>
      </div>
    </div>
  );
};

export default GrammarChecker;
