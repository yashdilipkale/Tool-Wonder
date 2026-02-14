import React, { useState, useMemo } from "react";
import { FileText, Type, Hash, AlignLeft, Copy, Trash2 } from "lucide-react";
import { useTheme } from "../ThemeContext";

const WordCounter: React.FC = () => {
  const { theme } = useTheme();
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const sentences = trimmed
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0).length;
    const paragraphs = trimmed
      .split(/\n\s*\n/)
      .filter((p) => p.trim().length > 0).length;
    const lines = text.split("\n").length;

    const readingTime = Math.ceil(words / 200); // avg 200 wpm

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime,
    };
  }, [text]);

  const copyText = () => {
    navigator.clipboard.writeText(text);
  };

  const clearText = () => {
    setText("");
  };

  const progress = Math.min((stats.words / 1000) * 100, 100);

  return (
    <div className="max-w-5xl mx-auto p-2 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Word Counter Tool</h1>

        <div className="flex gap-2">
          <button
            onClick={copyText}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <Copy size={16} /> Copy
          </button>

          <button
            onClick={clearText}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <Trash2 size={16} /> Clear
          </button>
        </div>
      </div>

      {/* Text Input */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow border border-slate-200 dark:border-slate-700">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your content here..."
          className="w-full h-52 p-4 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none"
        />

        {/* Word limit progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1 text-slate-700 dark:text-slate-300">
            <span>Word Usage</span>
            <span>{stats.words} / 1000</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Hash size={16} />} label="Words" value={stats.words} />
        <StatCard icon={<Type size={16} />} label="Characters" value={stats.characters} />
        <StatCard icon={<AlignLeft size={16} />} label="Sentences" value={stats.sentences} />
        <StatCard icon={<FileText size={16} />} label="Paragraphs" value={stats.paragraphs} />
        <StatCard icon={<AlignLeft size={16} />} label="Lines" value={stats.lines} />
        <StatCard icon={<Type size={16} />} label="No Spaces" value={stats.charactersNoSpaces} />
        <StatCard icon={<FileText size={16} />} label="Reading Time" value={`${stats.readingTime} min`} />
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: any) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow border border-slate-200 dark:border-slate-700">
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-2">
      {icon} {label}
    </div>
    <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
  </div>
);

export default WordCounter;
