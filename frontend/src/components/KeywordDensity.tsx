import React, { useState, useEffect } from 'react';
import { BarChart, Copy, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface KeywordData {
  word: string;
  count: number;
  density: number;
  length: number;
}

const KeywordDensity: React.FC = () => {
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [minWordLength, setMinWordLength] = useState(3);
  const [excludeCommon, setExcludeCommon] = useState(true);
  const [maxResults, setMaxResults] = useState(50);

  const [stats, setStats] = useState({
    totalWords: 0,
    uniqueWords: 0,
    totalChars: 0,
    avgWordLength: 0
  });

  const commonWords = new Set(['the','and','or','but','is','are','was','were','to','for','of','in','on','a','an']);

  const analyzeText = () => {
    if (!text.trim()) return;

    const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
    let words = cleanText.split(' ').filter(w => w.length >= minWordLength);

    if (excludeCommon) words = words.filter(w => !commonWords.has(w));

    const totalChars = text.replace(/\s/g, '').length;
    const uniqueWords = new Set(words).size;
    const avgWordLength = words.reduce((s,w)=>s+w.length,0)/words.length || 0;

    setStats({
      totalWords: words.length,
      uniqueWords,
      totalChars,
      avgWordLength: Math.round(avgWordLength*100)/100
    });

    const map: Record<string,number> = {};
    words.forEach(w => map[w] = (map[w] || 0) + 1);

    const data = Object.entries(map).map(([word,count]) => ({
      word,
      count,
      density:(count/words.length)*100,
      length:word.length
    }))
    .sort((a,b)=>b.count-a.count)
    .slice(0,maxResults);

    setKeywords(data);
  };

  useEffect(()=>{ analyzeText(); },[text,minWordLength,excludeCommon,maxResults]);

  const copy = (v:string)=>navigator.clipboard.writeText(v);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <BarChart className="text-blue-600"/>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Keyword Density Analyzer
            </h1>
            <p className="text-slate-500 text-sm">
              Analyze keyword frequency and optimize SEO content
            </p>
          </div>
        </div>

        {/* Text input */}
        <textarea
          value={text}
          onChange={(e)=>setText(e.target.value)}
          placeholder="Paste your content here..."
          className="w-full h-48 rounded-xl border border-slate-200 dark:border-slate-600 p-4 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />

        {/* Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <select value={minWordLength} onChange={e=>setMinWordLength(+e.target.value)} className="input">
            <option value={2}>2+</option>
            <option value={3}>3+</option>
            <option value={4}>4+</option>
          </select>

          <select value={maxResults} onChange={e=>setMaxResults(+e.target.value)} className="input">
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={excludeCommon} onChange={(e)=>setExcludeCommon(e.target.checked)} />
            Exclude common
          </label>
        </div>

        {/* Stats */}
        {stats.totalWords>0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats).map(([k,v])=>(
              <div key={k} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700 text-center">
                <div className="text-xl font-bold">{v}</div>
                <div className="text-xs text-slate-500">{k}</div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {keywords.length>0 && (
          <div className="space-y-3">
            {keywords.map((k,i)=>(
              <div key={k.word} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-700">
                <span className="w-6 text-sm">{i+1}</span>

                <div className="flex-1">
                  <div className="font-medium">{k.word}</div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width:`${Math.min(k.density*20,100)}%`}}/>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold">{k.count}</div>
                  <div className="text-xs text-slate-500">{k.density.toFixed(2)}%</div>
                </div>

                <button onClick={()=>copy(k.word)}>
                  <Copy size={16}/>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm">
          Ideal keyword density: <b>1-2%</b>. Avoid exceeding <b>4%</b>.
        </div>

      </div>
    </div>
  );
};

export default KeywordDensity;
