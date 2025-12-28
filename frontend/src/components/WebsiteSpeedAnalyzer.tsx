import React, { useState } from 'react';
import { Activity, Zap, Globe, Clock, HardDrive, Server, AlertTriangle, CheckCircle, TrendingUp, BarChart3, Gauge, Wifi } from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'needs-improvement' | 'poor';
  description: string;
}

interface CoreWebVital {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'needs-improvement' | 'poor';
  recommendation: string;
}

interface ResourceBreakdown {
  type: string;
  size: number;
  count: number;
  percentage: number;
}

const WebsiteSpeedAnalyzer: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  // Mock performance data
  const mockPerformanceMetrics: PerformanceMetric[] = [
    {
      name: 'First Contentful Paint',
      value: 1.2,
      unit: 's',
      status: 'good',
      description: 'Time to first content paint'
    },
    {
      name: 'Largest Contentful Paint',
      value: 2.8,
      unit: 's',
      status: 'needs-improvement',
      description: 'Time to largest content paint'
    },
    {
      name: 'First Input Delay',
      value: 85,
      unit: 'ms',
      status: 'good',
      description: 'Time to first user interaction'
    },
    {
      name: 'Cumulative Layout Shift',
      value: 0.12,
      unit: '',
      status: 'good',
      description: 'Visual stability score'
    },
    {
      name: 'Total Blocking Time',
      value: 120,
      unit: 'ms',
      status: 'needs-improvement',
      description: 'Total blocking time'
    },
    {
      name: 'Speed Index',
      value: 2.1,
      unit: 's',
      status: 'good',
      description: 'Page loading speed perception'
    }
  ];

  const mockCoreWebVitals: CoreWebVital[] = [
    {
      name: 'Largest Contentful Paint (LCP)',
      value: 2.8,
      unit: 's',
      status: 'needs-improvement',
      recommendation: 'Optimize images and remove render-blocking resources'
    },
    {
      name: 'First Input Delay (FID)',
      value: 85,
      unit: 'ms',
      status: 'good',
      recommendation: 'Keep JavaScript execution time under 50ms'
    },
    {
      name: 'Cumulative Layout Shift (CLS)',
      value: 0.12,
      unit: '',
      status: 'good',
      recommendation: 'Ensure stable page layout during loading'
    }
  ];

  const mockResourceBreakdown: ResourceBreakdown[] = [
    { type: 'Images', size: 2048576, count: 12, percentage: 45 },
    { type: 'JavaScript', size: 1048576, count: 8, percentage: 23 },
    { type: 'CSS', size: 524288, count: 4, percentage: 12 },
    { type: 'HTML', size: 131072, count: 1, percentage: 3 },
    { type: 'Fonts', size: 262144, count: 3, percentage: 6 },
    { type: 'Other', size: 786432, count: 15, percentage: 11 }
  ];

  const analyzeWebsite = async () => {
    if (!url.trim()) return;

    setIsAnalyzing(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate mock analysis results
    const results = {
      url: url,
      overallScore: 78,
      loadTime: 2.8,
      pageSize: 4.2,
      requests: 43,
      performanceMetrics: mockPerformanceMetrics,
      coreWebVitals: mockCoreWebVitals,
      resourceBreakdown: mockResourceBreakdown,
      recommendations: [
        'Optimize images: Compress and use modern formats (WebP)',
        'Minify CSS and JavaScript files',
        'Enable text compression (GZIP)',
        'Remove render-blocking JavaScript',
        'Use browser caching for static assets',
        'Implement lazy loading for images',
        'Reduce server response time'
      ]
    };

    setAnalysisResults(results);
    setIsAnalyzing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'needs-improvement':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'poor':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'needs-improvement':
        return <AlertTriangle className="text-yellow-600" size={16} />;
      case 'poor':
        return <AlertTriangle className="text-red-600" size={16} />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatBytes = (bytes: number): string => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return bytes + ' B';
  };

  const getOverallScoreGrade = (score: number): string => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
          <Activity size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Website Speed Analyzer</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Analyze and optimize website performance</p>
        </div>
      </div>

      {/* URL Input */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Website URL to Analyze
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={analyzeWebsite}
              disabled={!url.trim() || isAnalyzing}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Analyze Speed
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
                <strong>Note:</strong> This tool provides comprehensive website performance analysis including Core Web Vitals,
                loading times, resource breakdown, and optimization recommendations. For accurate real-time data,
                this would integrate with performance monitoring APIs like Google PageSpeed Insights.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResults && (
        <>
          {/* Overall Score */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                <span className={`text-3xl font-bold ${getScoreColor(analysisResults.overallScore)}`}>
                  {getOverallScoreGrade(analysisResults.overallScore)}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                Performance Score: {analysisResults.overallScore}/100
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Analysis for: {analysisResults.url}
              </p>
            </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="text-blue-600 mr-2" size={20} />
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {analysisResults.loadTime}s
                  </span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Load Time</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <HardDrive className="text-purple-600 mr-2" size={20} />
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {analysisResults.pageSize}MB
                  </span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Page Size</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Server className="text-orange-600 mr-2" size={20} />
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {analysisResults.requests}
                  </span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Requests</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Gauge className="text-green-600 mr-2" size={20} />
                  <span className={`text-2xl font-bold ${getScoreColor(analysisResults.overallScore)}`}>
                    {analysisResults.overallScore}
                  </span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Score</div>
              </div>
            </div>
          </div>

          {/* Core Web Vitals */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <TrendingUp size={20} />
              Core Web Vitals
            </h2>

            <div className="space-y-4">
              {analysisResults.coreWebVitals.map((vital: CoreWebVital, index: number) => (
                <div key={index} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-slate-800 dark:text-slate-200">{vital.name}</h3>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(vital.status)}`}>
                      {getStatusIcon(vital.status)}
                      {vital.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {vital.value}{vital.unit}
                    </span>
                    <div className={`w-20 bg-slate-200 dark:bg-slate-600 rounded-full h-2`}>
                      <div
                        className={`h-2 rounded-full ${
                          vital.status === 'good' ? 'bg-green-500' :
                          vital.status === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, (vital.value / (vital.name.includes('LCP') ? 4 : vital.name.includes('FID') ? 300 : 0.25)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400">{vital.recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <BarChart3 size={20} />
              Performance Metrics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisResults.performanceMetrics.map((metric: PerformanceMetric, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-600 rounded">
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-200">{metric.name}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{metric.description}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${getStatusColor(metric.status).split(' ')[0]}`}>
                      {metric.value}{metric.unit}
                    </div>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(metric.status)}`}>
                      {getStatusIcon(metric.status)}
                      {metric.status.replace('-', ' ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resource Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <HardDrive size={20} />
              Resource Breakdown
            </h2>

            <div className="space-y-4">
              {analysisResults.resourceBreakdown.map((resource: ResourceBreakdown, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{resource.type}</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      ({resource.count} files)
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-mono text-slate-600 dark:text-slate-400">
                      {formatBytes(resource.size)}
                    </span>
                    <div className="w-24 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${resource.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200 w-12">
                      {resource.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <Zap size={20} />
              Optimization Recommendations
            </h2>

            <div className="space-y-3">
              {analysisResults.recommendations.map((recommendation: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded">
                  <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                  <p className="text-sm text-slate-700 dark:text-slate-300">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!analysisResults && !isAnalyzing && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-12">
          <div className="text-center">
            <Activity size={48} className="mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
              Analyze Website Performance
            </h3>
            <p className="text-slate-500 dark:text-slate-500 max-w-md mx-auto">
              Enter a website URL above to get comprehensive performance analysis including Core Web Vitals,
              loading times, resource optimization suggestions, and actionable recommendations.
            </p>
          </div>
        </div>
      )}

      {/* Features Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Wifi size={20} />
          Performance Analysis Features
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
          <div>
            <h5 className="font-medium mb-2">Core Web Vitals</h5>
            <ul className="space-y-1 text-xs">
              <li>• Largest Contentful Paint (LCP)</li>
              <li>• First Input Delay (FID)</li>
              <li>• Cumulative Layout Shift (CLS)</li>
              <li>• Performance scoring</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Technical Metrics</h5>
            <ul className="space-y-1 text-xs">
              <li>• Page load times</li>
              <li>• Resource breakdown</li>
              <li>• Request analysis</li>
              <li>• File size optimization</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">SEO Impact</h5>
            <ul className="space-y-1 text-xs">
              <li>• Search ranking factors</li>
              <li>• User experience metrics</li>
              <li>• Mobile performance</li>
              <li>• Accessibility compliance</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Optimization</h5>
            <ul className="space-y-1 text-xs">
              <li>• Actionable recommendations</li>
              <li>• Priority optimization tasks</li>
              <li>• Performance monitoring</li>
              <li>• Continuous improvement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteSpeedAnalyzer;
