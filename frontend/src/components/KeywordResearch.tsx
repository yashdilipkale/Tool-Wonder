import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Target, BarChart3, Zap, Users, DollarSign, Globe, Filter, Star, AlertTriangle } from 'lucide-react';

interface KeywordData {
  keyword: string;
  searchVolume: number;
  competition: number;
  difficulty: number;
  cpc: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  serpFeatures: string[];
}

interface RelatedKeyword {
  keyword: string;
  searchVolume: number;
  competition: number;
  difficulty: number;
}

const KeywordResearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [keywordData, setKeywordData] = useState<KeywordData | null>(null);
  const [relatedKeywords, setRelatedKeywords] = useState<RelatedKeyword[]>([]);
  const [location, setLocation] = useState<string>('United States');
  const [language, setLanguage] = useState<string>('English');

  // Mock data for demonstration
  const mockKeywordData: KeywordData = {
    keyword: 'keyword research tool',
    searchVolume: 14500,
    competition: 78,
    difficulty: 85,
    cpc: 8.45,
    trend: 'up',
    trendPercentage: 12,
    intent: 'commercial',
    serpFeatures: ['featured_snippet', 'local_pack', 'related_questions']
  };

  const mockRelatedKeywords: RelatedKeyword[] = [
    { keyword: 'free keyword research tool', searchVolume: 8900, competition: 65, difficulty: 72 },
    { keyword: 'keyword research 2024', searchVolume: 12400, competition: 82, difficulty: 88 },
    { keyword: 'best keyword research tools', searchVolume: 15600, competition: 91, difficulty: 95 },
    { keyword: 'google keyword planner', searchVolume: 22100, competition: 45, difficulty: 35 },
    { keyword: 'seo keyword research', searchVolume: 18900, competition: 88, difficulty: 92 },
    { keyword: 'keyword research tutorial', searchVolume: 7800, competition: 52, difficulty: 58 },
    { keyword: 'long tail keywords', searchVolume: 12300, competition: 67, difficulty: 68 },
    { keyword: 'keyword research strategy', searchVolume: 9100, competition: 73, difficulty: 78 }
  ];

  const analyzeKeyword = async () => {
    if (!searchTerm.trim()) return;

    setIsAnalyzing(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Use mock data for demonstration
    setKeywordData({
      ...mockKeywordData,
      keyword: searchTerm
    });
    setRelatedKeywords(mockRelatedKeywords);

    setIsAnalyzing(false);
  };

  const getDifficultyColor = (difficulty: number): string => {
    if (difficulty <= 30) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    if (difficulty <= 60) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20';
  };

  const getDifficultyLabel = (difficulty: number): string => {
    if (difficulty <= 30) return 'Easy';
    if (difficulty <= 60) return 'Medium';
    return 'Hard';
  };

  const getIntentColor = (intent: string): string => {
    switch (intent) {
      case 'informational':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
      case 'commercial':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200';
      case 'transactional':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      case 'navigational':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200';
    }
  };

  const getCompetitionColor = (competition: number): string => {
    if (competition <= 30) return 'text-green-600';
    if (competition <= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const locations = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Brazil'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Russian', 'Japanese', 'Chinese'
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400">
          <Search size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Keyword Research</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Find trending keywords and analyze competition</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="md:col-span-2 lg:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Keyword to Research
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter a keyword or phrase..."
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}></option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}></option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center md:justify-start">
              <button
                onClick={analyzeKeyword}
                disabled={!searchTerm.trim() || isAnalyzing}
                className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    Research
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-blue-600 text-sm">ℹ️</span>
              </div>
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> This tool provides comprehensive keyword research including search volume,
                  competition analysis, difficulty scores, and trend data. For accurate real-time data,
                  this would integrate with external SEO APIs like Google Keyword Planner, Ahrefs, or SEMrush.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyword Analysis Results */}
      {keywordData && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
            <Target size={20} />
            Keyword Analysis: "{keywordData.keyword}"
          </h2>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{formatNumber(keywordData.searchVolume)}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Monthly Searches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{keywordData.competition}%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Competition</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getDifficultyColor(keywordData.difficulty).split(' ')[0]}`}>
                {keywordData.difficulty}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Difficulty Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">${keywordData.cpc.toFixed(2)}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Cost Per Click</div>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {keywordData.trend === 'up' ? (
                  <TrendingUp className="text-green-600" size={20} />
                ) : keywordData.trend === 'down' ? (
                  <TrendingDown className="text-red-600" size={20} />
                ) : (
                  <BarChart3 className="text-blue-600" size={20} />
                )}
                <span className="font-medium text-slate-800 dark:text-slate-200">Trend</span>
              </div>
              <div className={`text-2xl font-bold ${
                keywordData.trend === 'up' ? 'text-green-600' :
                keywordData.trend === 'down' ? 'text-red-600' : 'text-blue-600'
              }`}>
                {keywordData.trend === 'stable' ? 'Stable' : `${keywordData.trendPercentage}%`}
                {keywordData.trend !== 'stable' && (
                  <span className="text-sm ml-1">
                    {keywordData.trend === 'up' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-purple-600" size={20} />
                <span className="font-medium text-slate-800 dark:text-slate-200">Search Intent</span>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getIntentColor(keywordData.intent)}`}>
                {keywordData.intent.charAt(0).toUpperCase() + keywordData.intent.slice(1)}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="text-yellow-600" size={20} />
                <span className="font-medium text-slate-800 dark:text-slate-200">Difficulty</span>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(keywordData.difficulty)}`}>
                {getDifficultyLabel(keywordData.difficulty)}
              </div>
            </div>
          </div>

          {/* SERP Features */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3">SERP Features</h3>
            <div className="flex flex-wrap gap-2">
              {keywordData.serpFeatures.map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                >
                  {feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related Keywords */}
      {relatedKeywords.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <BarChart3 size={20} />
              Related Keywords ({relatedKeywords.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Keyword
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Search Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Competition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Opportunity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {relatedKeywords.map((keyword, index) => (
                  <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {keyword.keyword}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-900 dark:text-slate-100">
                        {formatNumber(keyword.searchVolume)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-16 bg-slate-200 dark:bg-slate-600 rounded-full h-2`}>
                          <div
                            className={`h-2 rounded-full ${
                              keyword.competition <= 30 ? 'bg-green-500' :
                              keyword.competition <= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${keyword.competition}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${getCompetitionColor(keyword.competition)}`}>
                          {keyword.competition}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(keyword.difficulty)}`}>
                        {getDifficultyLabel(keyword.difficulty)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {keyword.searchVolume > 10000 && keyword.difficulty < 50 ? (
                          <span className="text-green-600 font-medium">High</span>
                        ) : keyword.searchVolume > 5000 && keyword.difficulty < 70 ? (
                          <span className="text-yellow-600 font-medium">Medium</span>
                        ) : (
                          <span className="text-red-600 font-medium">Low</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!keywordData && !isAnalyzing && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-12">
          <div className="text-center">
            <Search size={48} className="mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
              Start Your Keyword Research
            </h3>
            <p className="text-slate-500 dark:text-slate-500 max-w-md mx-auto">
              Enter a keyword above to get comprehensive research including search volume, competition analysis,
              difficulty scores, and trend data to optimize your SEO strategy.
            </p>
          </div>
        </div>
      )}

      {/* Features Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          Keyword Research Features
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
          <div>
            <h5 className="font-medium mb-2">Search Analysis</h5>
            <ul className="space-y-1 text-xs">
              <li>• Monthly search volume data</li>
              <li>• Competition level assessment</li>
              <li>• Keyword difficulty scoring</li>
              <li>• Cost per click estimates</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Trend Insights</h5>
            <ul className="space-y-1 text-xs">
              <li>• Historical trend analysis</li>
              <li>• Seasonal pattern detection</li>
              <li>• Growth opportunity identification</li>
              <li>• Competitor keyword tracking</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">SEO Intelligence</h5>
            <ul className="space-y-1 text-xs">
              <li>• Search intent classification</li>
              <li>• SERP feature analysis</li>
              <li>• Related keyword discovery</li>
              <li>• Content opportunity scoring</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Strategic Planning</h5>
            <ul className="space-y-1 text-xs">
              <li>• Keyword difficulty assessment</li>
              <li>• Ranking potential analysis</li>
              <li>• Content strategy recommendations</li>
              <li>• Competitive analysis tools</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordResearch;
