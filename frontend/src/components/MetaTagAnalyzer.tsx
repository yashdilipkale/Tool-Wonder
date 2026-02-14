import React, { useState, useEffect } from "react";
import { Tag, CheckCircle, XCircle, AlertTriangle, Copy } from "lucide-react";
import { useTheme } from '../ThemeContext';

interface MetaTag {
  name: string;
  content: string;
  status: "good" | "warning" | "error" | "missing";
  recommendation?: string;
}

interface SEOAnalysis {
  score: number;
  issues: number;
  warnings: number;
  passed: number;
}

const MetaTagAnalyzer: React.FC = () => {
  const { theme } = useTheme();
  const [htmlContent, setHtmlContent] = useState("");
  const [metaTags, setMetaTags] = useState<MetaTag[]>([]);
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);

  /* ---------- Parse HTML ---------- */
  const parseMetaTags = (html: string) => {
    const tags: MetaTag[] = [];

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      const title = titleMatch[1];
      tags.push({
        name: "title",
        content: title,
        status: title.length <= 60 ? "good" : "warning",
      });
    } else {
      tags.push({
        name: "title",
        content: "",
        status: "missing",
        recommendation: "Add a title tag",
      });
    }

    const descMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
    );

    if (descMatch) {
      const desc = descMatch[1];
      tags.push({
        name: "description",
        content: desc,
        status:
          desc.length >= 120 && desc.length <= 160 ? "good" : "warning",
      });
    } else {
      tags.push({
        name: "description",
        content: "",
        status: "missing",
        recommendation: "Add meta description",
      });
    }

    setMetaTags(tags);
  };

  /* ---------- SEO Score ---------- */
  const analyzeSEO = (tags: MetaTag[]) => {
    let passed = 0;
    let warnings = 0;
    let issues = 0;

    tags.forEach((t) => {
      if (t.status === "good") passed++;
      else if (t.status === "warning") warnings++;
      else issues++;
    });

    const score = Math.round(((passed * 3 + warnings) / (tags.length * 3)) * 100);

    return { score, issues, warnings, passed };
  };

  useEffect(() => {
    if (htmlContent.trim()) parseMetaTags(htmlContent);
    else {
      setMetaTags([]);
      setAnalysis(null);
    }
  }, [htmlContent]);

  useEffect(() => {
    if (metaTags.length) setAnalysis(analyzeSEO(metaTags));
  }, [metaTags]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="text-green-500 w-4 h-4" />;
      case "warning":
        return <AlertTriangle className="text-yellow-500 w-4 h-4" />;
      default:
        return <XCircle className="text-red-500 w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Tag className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold">Meta Tag Analyzer</h1>
        </div>

        {/* Input */}
        <textarea
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          placeholder="Paste HTML source..."
          className="w-full h-48 border border-slate-200 dark:border-slate-600 rounded-xl p-4 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />

        {/* Score */}
        {analysis && (
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-blue-600 text-white p-6 rounded-xl">
              <div className="text-4xl font-bold">{analysis.score}/100</div>
              <div className="text-sm">SEO Score</div>
            </div>

            <div className="p-6 bg-green-100 rounded-xl text-center">
              <div className="text-2xl font-bold">{analysis.passed}</div>
              Passed
            </div>

            <div className="p-6 bg-yellow-100 rounded-xl text-center">
              <div className="text-2xl font-bold">{analysis.warnings}</div>
              Warnings
            </div>

            <div className="p-6 bg-red-100 rounded-xl text-center">
              <div className="text-2xl font-bold">{analysis.issues}</div>
              Issues
            </div>
          </div>
        )}

        {/* Tag List */}
        {metaTags.map((tag, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl"
          >
            {getStatusIcon(tag.status)}
            <div className="flex-1">
              <div className="font-semibold text-slate-900 dark:text-white">{tag.name}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{tag.content}</div>
            </div>
            {tag.content && (
              <button
                onClick={() => copyToClipboard(tag.content)}
                className="p-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              >
                <Copy className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetaTagAnalyzer;
