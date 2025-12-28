import React, { useState } from 'react';
import { Link, Search, ExternalLink, TrendingUp, AlertTriangle, CheckCircle, XCircle, BarChart3, Globe, Target } from 'lucide-react';

interface Backlink {
  url: string;
  domain: string;
  anchor: string;
  status: 'active' | 'broken' | 'redirect';
  da: number;
  pa: number;
  spamScore: number;
  firstSeen: string;
  lastSeen: string;
  linkType: 'dofollow' | 'nofollow' | 'sponsored' | 'ugc';
}

interface DomainMetrics {
  domain: string;
  domainAuthority: number;
  pageAuthority: number;
  backlinkCount: number;
  referringDomains: number;
  organicKeywords: number;
  organicTraffic: number;
  spamScore: number;
}

const BacklinkChecker: React.FC = () => {
  const [inputUrl, setInputUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [domainMetrics, setDomainMetrics] = useState<DomainMetrics | null>(null);
  const [backlinks, setBacklinks] = useState<Backlink[]>([]);
  const [analysisType, setAnalysisType] = useState<'domain' | 'url'>('domain');

  // Mock data for demonstration
  const mockDomainMetrics: DomainMetrics = {
    domain: 'example.com',
    domainAuthority: 85,
    pageAuthority: 78,
    backlinkCount: 12450,
    referringDomains: 2340,
    organicKeywords: 12500,
    organicTraffic: 45000,
    spamScore: 2
  };

  const mockBacklinks: Backlink[] = [
    {
      url: 'https://techblog.com/guide-to-seo',
      domain: 'techblog.com',
      anchor: 'SEO best practices',
      status: 'active',
      da: 72,
      pa: 65,
      spamScore: 1,
      firstSeen: '2023-01-15',
      lastSeen: '2024-12-27',
      linkType: 'dofollow'
    },
    {
      url: 'https://marketinghub.io/content-strategy',
      domain: 'marketinghub.io',
      anchor: 'content marketing guide',
      status: 'active',
      da: 68,
      pa: 62,
      spamScore: 3,
      firstSeen: '2023-03-22',
      lastSeen: '2024-12-26',
      linkType: 'dofollow'
    },
    {
      url: 'https://webdesignmag.com/tutorials',
      domain: 'webdesignmag.com',
      anchor: 'web design tutorials',
      status: 'active',
      da: 55,
      pa: 48,
      spamScore: 5,
      firstSeen: '2023-06-10',
      lastSeen: '2024-12-25',
      linkType: 'nofollow'
    },
    {
      url: 'https://bloggersnetwork.net/resources',
      domain: 'bloggersnetwork.net',
      anchor: 'free SEO tools',
      status: 'broken',
      da: 45,
      pa: 38,
      spamScore: 8,
      firstSeen: '2023-08-05',
      lastSeen: '2024-11-30',
      linkType: 'dofollow'
    },
    {
      url: 'https://startupnews.co/funding-tips',
      domain: 'startupnews.co',
      anchor: 'entrepreneurship guide',
      status: 'redirect',
      da: 52,
      pa: 45,
      spamScore: 4,
      firstSeen: '2023-09-18',
      lastSeen: '2024-12-20',
      linkType: 'sponsored'
    }
  ];

  const analyzeBacklinks = async () => {
    if (!inputUrl.trim()) return;

    setIsAnalyzing(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Use mock data for demonstration
    setDomainMetrics({
      ...mockDomainMetrics,
      domain: inputUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    });
    setBacklinks(mockBacklinks);

    setIsAnalyzing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'broken':
        return <XCircle className="text-red-500" size={16} />;
      case 'redirect':
        return <AlertTriangle className="text-yellow-500" size={16} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-50 dark:bg-green-900/20';
      case 'broken':
        return 'text-red-700 bg-red-50 dark:bg-red-900/20';
      case 'redirect':
        return 'text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'text-gray-700 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getLinkTypeColor = (type: string) => {
    switch (type) {
      case 'dofollow':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
      case 'nofollow':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200';
      case 'sponsored':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200';
      case 'ugc':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200';
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
          <Link size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Backlink Checker</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Analyze backlinks and domain authority metrics</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {analysisType === 'domain' ? 'Domain/URL to Analyze' : 'Specific URL to Check'}
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder={analysisType === 'domain' ? 'example.com or https://example.com' : 'https://example.com/page'}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <select
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value as 'domain' | 'url')}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="domain">Domain Analysis</option>
                <option value="url">URL Analysis</option>
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={analyzeBacklinks}
              disabled={!inputUrl.trim() || isAnalyzing}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Analyze Backlinks
                </>
              )}
            </button>
          </div>
        </div>

        {/* Analysis Note */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-blue-600 text-sm">ℹ️</span>
            </div>
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> This tool provides comprehensive backlink analysis including domain authority,
                referring domains, link quality assessment, and spam score evaluation. For accurate real-time data,
                this would integrate with external SEO APIs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Metrics */}
      {domainMetrics && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
            <Globe size={20} />
            Domain Metrics for {domainMetrics.domain}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{domainMetrics.domainAuthority}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Domain Authority</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{domainMetrics.pageAuthority}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Page Authority</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{formatNumber(domainMetrics.backlinkCount)}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Backlinks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{formatNumber(domainMetrics.referringDomains)}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Referring Domains</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{formatNumber(domainMetrics.organicKeywords)}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Organic Keywords</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">{formatNumber(domainMetrics.organicTraffic)}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Monthly Traffic</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{domainMetrics.spamScore}%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Spam Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-600">Strong</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Overall Rating</div>
            </div>
          </div>
        </div>
      )}

      {/* Backlinks Table */}
      {backlinks.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <BarChart3 size={20} />
              Backlink Analysis ({backlinks.length} links)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Source URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Anchor Text
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    DA/PA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Spam Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Link Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    First Seen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {backlinks.map((backlink, index) => (
                  <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-slate-900 dark:text-slate-100 font-medium">
                          {backlink.domain}
                        </div>
                        <ExternalLink size={14} className="text-slate-400" />
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                        {backlink.url}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-900 dark:text-slate-100">
                        {backlink.anchor}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(backlink.status)}`}>
                        {getStatusIcon(backlink.status)}
                        {backlink.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          DA: {backlink.da}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          PA: {backlink.pa}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className={`font-medium ${
                          backlink.spamScore <= 3 ? 'text-green-600' :
                          backlink.spamScore <= 7 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {backlink.spamScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getLinkTypeColor(backlink.linkType)}`}>
                        {backlink.linkType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {new Date(backlink.firstSeen).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200">
                        <ExternalLink size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!domainMetrics && !isAnalyzing && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-12">
          <div className="text-center">
            <Link size={48} className="mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
              Analyze Backlinks
            </h3>
            <p className="text-slate-500 dark:text-slate-500 max-w-md mx-auto">
              Enter a domain or URL above to get comprehensive backlink analysis including domain authority,
              referring domains, link quality metrics, and spam score evaluation.
            </p>
          </div>
        </div>
      )}

      {/* Features Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          Backlink Analysis Features
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
          <div>
            <h5 className="font-medium mb-2">Domain Metrics</h5>
            <ul className="space-y-1 text-xs">
              <li>• Domain Authority (DA) scores</li>
              <li>• Page Authority (PA) analysis</li>
              <li>• Backlink count and quality</li>
              <li>• Referring domains overview</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Link Analysis</h5>
            <ul className="space-y-1 text-xs">
              <li>• Link status monitoring</li>
              <li>• Anchor text analysis</li>
              <li>• Spam score evaluation</li>
              <li>• Link type classification</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">SEO Insights</h5>
            <ul className="space-y-1 text-xs">
              <li>• Organic keyword tracking</li>
              <li>• Traffic estimation</li>
              <li>• Link building opportunities</li>
              <li>• Competitor analysis</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Reporting</h5>
            <ul className="space-y-1 text-xs">
              <li>• Historical link tracking</li>
              <li>• Link velocity monitoring</li>
              <li>• Toxic link identification</li>
              <li>• Export capabilities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacklinkChecker;
