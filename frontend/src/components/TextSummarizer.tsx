import React, { useState, useEffect } from 'react';
import { FileText, Copy, RotateCcw, Zap, Target, List, FileCheck } from 'lucide-react';

const TextSummarizer: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [summaryType, setSummaryType] = useState<'overview' | 'keypoints' | 'detailed'>('overview');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState<number>(0);
  const [summaryWordCount, setSummaryWordCount] = useState<number>(0);

  // Mock AI summarization function (in a real app, this would call an AI API)
  const generateSummary = async (text: string, length: string, type: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);

    // Calculate target summary length
    let targetWords: number;
    switch (length) {
      case 'short':
        targetWords = Math.max(20, Math.floor(words.length * 0.15));
        break;
      case 'medium':
        targetWords = Math.max(50, Math.floor(words.length * 0.25));
        break;
      case 'long':
        targetWords = Math.max(100, Math.floor(words.length * 0.4));
        break;
      default:
        targetWords = Math.max(50, Math.floor(words.length * 0.25));
    }

    // Extract key sentences (simple algorithm - in reality, AI would do this)
    const keySentences = sentences.slice(0, Math.min(sentences.length, 5));

    let summaryText: string;

    switch (type) {
      case 'keypoints':
        // Create bullet points from key sentences
        summaryText = 'Key Points:\n' +
          keySentences.map((sentence, index) =>
            `• ${sentence.trim()}${index < keySentences.length - 1 ? '.' : ''}`
          ).join('\n');
        break;

      case 'detailed':
        // Include more context and details
        summaryText = `Summary: ${sentences.slice(0, Math.min(sentences.length, 8)).join('. ').trim()}.`;
        break;

      default: // overview
        // Create a concise overview
        const firstSentence = sentences[0]?.trim() || '';
        const lastSentence = sentences[sentences.length - 1]?.trim() || '';
        const middleSentences = sentences.slice(1, -1).slice(0, 2);

        summaryText = `Overview: ${firstSentence}${middleSentences.length > 0 ? '. ' + middleSentences.join('. ') : ''}${lastSentence && lastSentence !== firstSentence ? '. ' + lastSentence : ''}.`.trim();
    }

    return summaryText;
  };

  const handleSummarize = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    try {
      const result = await generateSummary(inputText, summaryLength, summaryType);
      setSummary(result);
      setSummaryWordCount(result.split(/\s+/).filter(word => word.length > 0).length);
    } catch (error) {
      setSummary('Error generating summary. Please try again.');
    }
    setIsProcessing(false);
  };

  const handleCopySummary = async () => {
    if (summary) {
      await navigator.clipboard.writeText(summary);
      // You could add a toast notification here
    }
  };

  const handleReset = () => {
    setInputText('');
    setSummary('');
    setWordCount(0);
    setSummaryWordCount(0);
  };

  useEffect(() => {
    const words = inputText.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [inputText]);

  const lengthOptions = [
    { value: 'short', label: 'Short (15% of original)', icon: Target },
    { value: 'medium', label: 'Medium (25% of original)', icon: FileCheck },
    { value: 'long', label: 'Long (40% of original)', icon: FileText }
  ];

  const typeOptions = [
    { value: 'overview', label: 'Overview', description: 'Concise summary of main points' },
    { value: 'keypoints', label: 'Key Points', description: 'Bullet-point list of important facts' },
    { value: 'detailed', label: 'Detailed', description: 'Comprehensive summary with more context' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
          <FileText size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">AI Text Summarizer</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Generate intelligent summaries from long text using AI</p>
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
            placeholder="Paste or type your text here to generate a summary..."
            className="w-full h-80 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            disabled={isProcessing}
          />

          {/* Options */}
          <div className="space-y-4">
            {/* Summary Length */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Summary Length
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {lengthOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setSummaryLength(option.value as any)}
                      disabled={isProcessing}
                      className={`p-3 text-center rounded-lg border-2 transition-all ${
                        summaryLength === option.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <IconComponent size={16} className="mx-auto mb-1" />
                      <div className="text-xs font-medium">{option.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Summary Type
              </label>
              <div className="space-y-2">
                {typeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSummaryType(option.value as any)}
                    disabled={isProcessing}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                      summaryType === option.value
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs opacity-75">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSummarize}
                disabled={!inputText.trim() || isProcessing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    Summarize
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                disabled={isProcessing}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Summary</h2>
            <div className="flex items-center gap-4">
              {summaryWordCount > 0 && (
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {summaryWordCount} words
                </div>
              )}
              {summary && (
                <button
                  onClick={handleCopySummary}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <Copy size={14} />
                  Copy
                </button>
              )}
            </div>
          </div>

          <div className="h-80 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
            {summary ? (
              <div className="p-4 h-full overflow-y-auto">
                <pre className="whitespace-pre-wrap text-slate-900 dark:text-slate-100 font-sans text-sm leading-relaxed">
                  {summary}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                <div className="text-center">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Your summary will appear here</p>
                </div>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          {summary && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">Summary Statistics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-600 dark:text-slate-400">Original Length</div>
                  <div className="font-medium">{wordCount} words</div>
                </div>
                <div>
                  <div className="text-slate-600 dark:text-slate-400">Summary Length</div>
                  <div className="font-medium">{summaryWordCount} words</div>
                </div>
                <div>
                  <div className="text-slate-600 dark:text-slate-400">Compression</div>
                  <div className="font-medium">
                    {wordCount > 0 ? Math.round((1 - summaryWordCount / wordCount) * 100) : 0}%
                  </div>
                </div>
                <div>
                  <div className="text-slate-600 dark:text-slate-400">Type</div>
                  <div className="font-medium capitalize">{summaryType}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">✨ AI Summarization Features</h4>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>• <strong>Intelligent Analysis</strong> - AI-powered content understanding</li>
          <li>• <strong>Multiple Formats</strong> - Overview, key points, or detailed summaries</li>
          <li>• <strong>Flexible Length</strong> - Choose short, medium, or long summaries</li>
          <li>• <strong>Real-time Processing</strong> - Instant results with progress indication</li>
          <li>• <strong>Copy & Share</strong> - Easily copy summaries for use anywhere</li>
        </ul>
      </div>
    </div>
  );
};

export default TextSummarizer;
