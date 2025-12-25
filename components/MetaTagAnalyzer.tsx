import React, { useState, useEffect } from 'react';
import { Tag, CheckCircle, XCircle, AlertTriangle, Copy, ExternalLink } from 'lucide-react';

interface MetaTag {
  name: string;
  content: string;
  type: 'meta' | 'title' | 'link' | 'canonical';
  status: 'good' | 'warning' | 'error' | 'missing';
  recommendation?: string;
}

interface SEOAnalysis {
  score: number;
  issues: number;
  warnings: number;
  passed: number;
  recommendations: string[];
}

const MetaTagAnalyzer: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState('');
  const [metaTags, setMetaTags] = useState<MetaTag[]>([]);
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'tags' | 'analysis' | 'preview'>('tags');

  // Parse HTML and extract meta tags
  const parseMetaTags = (html: string) => {
    const tags: MetaTag[] = [];

    // Parse title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      const title = titleMatch[1].trim();
      tags.push({
        name: 'title',
        content: title,
        type: 'title',
        status: title.length > 0 && title.length <= 60 ? 'good' : title.length > 60 ? 'warning' : 'error',
        recommendation: title.length > 60 ? 'Title is too long. Keep under 60 characters for optimal display in search results.' : undefined
      });
    } else {
      tags.push({
        name: 'title',
        content: '',
        type: 'title',
        status: 'missing',
        recommendation: 'Add a title tag - this is crucial for SEO.'
      });
    }

    // Parse meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    if (descMatch) {
      const desc = descMatch[1];
      tags.push({
        name: 'description',
        content: desc,
        type: 'meta',
        status: desc.length >= 120 && desc.length <= 160 ? 'good' : desc.length < 120 ? 'warning' : 'warning',
        recommendation: desc.length < 120 ? 'Description is too short. Aim for 120-160 characters.' :
                      desc.length > 160 ? 'Description is too long. Keep under 160 characters.' : undefined
      });
    } else {
      tags.push({
        name: 'description',
        content: '',
        type: 'meta',
        status: 'missing',
        recommendation: 'Add a meta description - this appears in search result snippets.'
      });
    }

    // Parse other meta tags
    const metaRegex = /<meta[^>]*name=["']([^"']+)["'][^>]*content=["']([^"']+)["'][^>]*>/gi;
    let match;
    while ((match = metaRegex.exec(html)) !== null) {
      const name = match[1];
      const content = match[2];

      if (name === 'description') continue; // Already handled

      let status: 'good' | 'warning' | 'error' | 'missing' = 'good';
      let recommendation: string | undefined;

      switch (name) {
        case 'keywords':
          status = content.split(',').length >= 3 && content.length <= 200 ? 'good' : 'warning';
          recommendation = content.split(',').length < 3 ? 'Use at least 3 keywords.' :
                          content.length > 200 ? 'Keywords are too long.' : undefined;
          break;
        case 'robots':
          status = content.includes('noindex') ? 'warning' : 'good';
          recommendation = content.includes('noindex') ? 'Page is set to noindex - it won\'t appear in search results.' : undefined;
          break;
        case 'viewport':
          status = content.includes('width=device-width') ? 'good' : 'warning';
          recommendation = !content.includes('width=device-width') ? 'Add proper viewport meta tag for mobile compatibility.' : undefined;
          break;
        case 'author':
          status = content.trim().length > 0 ? 'good' : 'warning';
          break;
      }

      tags.push({
        name,
        content,
        type: 'meta',
        status,
        recommendation
      });
    }

    // Check for canonical URL
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
    if (canonicalMatch) {
      tags.push({
        name: 'canonical',
        content: canonicalMatch[1],
        type: 'canonical',
        status: 'good'
      });
    } else {
      tags.push({
        name: 'canonical',
        content: '',
        type: 'canonical',
        status: 'missing',
        recommendation: 'Consider adding a canonical URL to prevent duplicate content issues.'
      });
    }

    // Check for Open Graph tags
    const ogTags = html.match(/<meta[^>]*property=["']og:([^"']+)["'][^>]*content=["']([^"']+)["'][^>]*>/gi);
    if (ogTags && ogTags.length > 0) {
      tags.push({
        name: 'Open Graph',
        content: `${ogTags.length} tags found`,
        type: 'meta',
        status: 'good'
      });
    }

    // Check for Twitter Card tags
    const twitterTags = html.match(/<meta[^>]*name=["']twitter:([^"']+)["'][^>]*content=["']([^"']+)["'][^>]*>/gi);
    if (twitterTags && twitterTags.length > 0) {
      tags.push({
        name: 'Twitter Cards',
        content: `${twitterTags.length} tags found`,
        type: 'meta',
        status: 'good'
      });
    }

    setMetaTags(tags);
  };

  // Analyze SEO score
  const analyzeSEO = (tags: MetaTag[]): SEOAnalysis => {
    let passed = 0;
    let warnings = 0;
    let issues = 0;
    const recommendations: string[] = [];

    tags.forEach(tag => {
      switch (tag.status) {
        case 'good':
          passed++;
          break;
        case 'warning':
          warnings++;
          if (tag.recommendation) recommendations.push(tag.recommendation);
          break;
        case 'error':
        case 'missing':
          issues++;
          if (tag.recommendation) recommendations.push(tag.recommendation);
          break;
      }
    });

    const totalChecks = tags.length;
    const score = Math.round(((passed * 3 + warnings * 1) / (totalChecks * 3)) * 100);

    return {
      score: Math.max(0, Math.min(100, score)),
      issues,
      warnings,
      passed,
      recommendations
    };
  };

  useEffect(() => {
    if (htmlContent.trim()) {
      parseMetaTags(htmlContent);
    } else {
      setMetaTags([]);
      setAnalysis(null);
    }
  }, [htmlContent]);

  useEffect(() => {
    if (metaTags.length > 0) {
      setAnalysis(analyzeSEO(metaTags));
    }
  }, [metaTags]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'missing': return <XCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-700 dark:text-green-300';
      case 'warning': return 'text-yellow-700 dark:text-yellow-300';
      case 'error': return 'text-red-700 dark:text-red-300';
      case 'missing': return 'text-gray-700 dark:text-gray-300';
      default: return 'text-slate-700 dark:text-slate-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Tag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Meta Tag Analyzer</h2>
          <p className="text-slate-600 dark:text-slate-400">Analyze and optimize SEO meta tags</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            HTML Content or URL
          </label>
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            placeholder="Paste your HTML content here or enter a URL to analyze..."
            className="w-full h-40 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supports HTML content, meta tags, title tags, and Open Graph tags
          </p>
        </div>

        {/* SEO Score */}
        {analysis && (
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">SEO Score</h3>
              <div className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                {analysis.score}/100
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {analysis.passed}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {analysis.warnings}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {analysis.issues}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Issues</div>
              </div>
            </div>

            {analysis.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Recommendations:
                </h4>
                <ul className="space-y-1">
                  {analysis.recommendations.slice(0, 5).map((rec, index) => (
                    <li key={index} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        {metaTags.length > 0 && (
          <div className="border-b border-slate-200 dark:border-slate-600">
            <nav className="flex space-x-8">
              {[
                { id: 'tags', label: 'Meta Tags', count: metaTags.length },
                { id: 'analysis', label: 'Analysis' },
                { id: 'preview', label: 'Preview' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'tags' && metaTags.length > 0 && (
          <div className="space-y-3">
            {metaTags.map((tag, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(tag.status)}
                  <span className={`text-sm font-medium ${getStatusColor(tag.status)}`}>
                    {tag.name}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-900 dark:text-white truncate">
                    {tag.content || '(empty)'}
                  </div>
                  {tag.recommendation && (
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {tag.recommendation}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => copyToClipboard(tag.content)}
                  disabled={!tag.content}
                  className="p-1 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 disabled:opacity-50"
                  title="Copy content"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'analysis' && analysis && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Detailed Analysis</h3>

            {/* Title Analysis */}
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Title Tag</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Length</span>
                  <span className={`text-sm font-medium ${
                    metaTags.find(t => t.name === 'title')?.content.length || 0 > 60 ? 'text-red-600' :
                    metaTags.find(t => t.name === 'title')?.content.length || 0 > 50 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {metaTags.find(t => t.name === 'title')?.content.length || 0} characters
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(100, ((metaTags.find(t => t.name === 'title')?.content.length || 0) / 60) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ideal length: 30-60 characters for optimal display in search results
                </p>
              </div>
            </div>

            {/* Description Analysis */}
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Meta Description</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Length</span>
                  <span className={`text-sm font-medium ${
                    (metaTags.find(t => t.name === 'description')?.content.length || 0) < 120 ? 'text-yellow-600' :
                    (metaTags.find(t => t.name === 'description')?.content.length || 0) > 160 ? 'text-red-600' :
                    'text-green-600'
                  }`}>
                    {metaTags.find(t => t.name === 'description')?.content.length || 0} characters
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(100, ((metaTags.find(t => t.name === 'description')?.content.length || 0) / 160) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Recommended length: 120-160 characters for complete display in search results
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Search Result Preview</h3>

            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600 dark:text-blue-400">example.com</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    {metaTags.find(t => t.name === 'title')?.content || 'Page Title'}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {metaTags.find(t => t.name === 'description')?.content || 'Meta description will appear here...'}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              This is how your page might appear in Google search results. Title and description are truncated based on pixel width.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!htmlContent.trim() && (
          <div className="text-center py-12">
            <Tag className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Analyze Meta Tags
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Paste your HTML content or enter a URL to analyze meta tags, title tags, and get SEO recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetaTagAnalyzer;
