import React, { useState, useEffect } from "react";
import {
  FileText,
  Copy,
  RotateCcw,
  Plus,
  Minus,
  Settings
} from "lucide-react";
import { useTheme } from "../ThemeContext";

interface TextBlock {
  id: string;
  content: string;
  title: string;
}

const TextMerger: React.FC = () => {
  const { theme } = useTheme();
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([
    { id: "1", content: "", title: "Text Block 1" },
    { id: "2", content: "", title: "Text Block 2" }
  ]);

  const [mergedText, setMergedText] = useState("");
  const [separator, setSeparator] = useState("\n\n");
  const [customSeparator, setCustomSeparator] = useState("");
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [sortLines, setSortLines] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(false);
  const [addLineNumbers, setAddLineNumbers] = useState(false);
  const [copied, setCopied] = useState(false);

  const [stats, setStats] = useState({
    totalBlocks: 0,
    totalLines: 0,
    totalCharacters: 0,
    mergedLines: 0
  });

  /* ------------ Block Controls ------------ */

  const addTextBlock = () => {
    const newId = (textBlocks.length + 1).toString();
    setTextBlocks([
      ...textBlocks,
      { id: newId, content: "", title: `Text Block ${newId}` }
    ]);
  };

  const removeTextBlock = (id: string) => {
    if (textBlocks.length <= 2) return;
    setTextBlocks(textBlocks.filter(b => b.id !== id));
  };

  const updateTextBlock = (id: string, content: string) => {
    setTextBlocks(textBlocks.map(b => (b.id === id ? { ...b, content } : b)));
  };

  const moveTextBlock = (id: string, direction: "up" | "down") => {
    const index = textBlocks.findIndex(b => b.id === id);
    if (index === -1) return;

    const newBlocks = [...textBlocks];
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= textBlocks.length) return;

    [newBlocks[index], newBlocks[swapIndex]] = [
      newBlocks[swapIndex],
      newBlocks[index]
    ];

    setTextBlocks(newBlocks);
  };

  /* ------------ Merge Logic ------------ */

  const mergeTexts = () => {
    let allLines: string[] = [];

    textBlocks.forEach(block => {
      if (block.content.trim()) {
        allLines.push(...block.content.split("\n"));
      }
    });

    if (trimWhitespace) {
      allLines = allLines.map(l => l.trim()).filter(Boolean);
    }

    if (removeDuplicates) {
      allLines = [...new Set(allLines)];
    }

    if (sortLines) {
      allLines.sort((a, b) => a.localeCompare(b));
    }

    if (addLineNumbers) {
      allLines = allLines.map(
        (line, i) => `${(i + 1).toString().padStart(3, " ")}. ${line}`
      );
    }

    const finalSeparator = customSeparator || separator;
    const merged = allLines.join(finalSeparator);

    setMergedText(merged);

    setStats({
      totalBlocks: textBlocks.length,
      totalLines: allLines.length,
      totalCharacters: merged.length,
      mergedLines: allLines.length
    });
  };

  /* Debounced merge */
  useEffect(() => {
    const t = setTimeout(() => mergeTexts(), 200);
    return () => clearTimeout(t);
  }, [
    textBlocks,
    separator,
    customSeparator,
    removeDuplicates,
    sortLines,
    trimWhitespace,
    addLineNumbers
  ]);

  /* Copy */
  const handleCopyMerged = async () => {
    if (!mergedText) return;
    await navigator.clipboard.writeText(mergedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleReset = () => {
    setTextBlocks([
      { id: "1", content: "", title: "Text Block 1" },
      { id: "2", content: "", title: "Text Block 2" }
    ]);
    setMergedText("");
  };

  /* ------------ UI ------------ */

  return (
    <div className="max-w-6xl mx-auto p-2 space-y-4">
      <div className="text-center">
        <FileText size={32} className="mx-auto text-cyan-600" />
        <h1 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">Text Merger</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Combine multiple text blocks instantly
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-4">
          <button
            onClick={addTextBlock}
            className="px-3 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
          >
            <Plus size={16} className="inline mr-1" />
            Add Block
          </button>

          {textBlocks.map((block, i) => (
            <div key={block.id} className="border border-slate-200 dark:border-slate-600 rounded p-3 bg-white dark:bg-slate-700">
              <div className="flex justify-between mb-2">
                <b className="text-slate-900 dark:text-white">{block.title}</b>

                <div className="space-x-2">
                  <button 
                    onClick={() => moveTextBlock(block.id, "up")}
                    className="px-2 py-1 text-sm border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    ↑
                  </button>
                  <button 
                    onClick={() => moveTextBlock(block.id, "down")}
                    className="px-2 py-1 text-sm border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    ↓
                  </button>
                  <button 
                    onClick={() => removeTextBlock(block.id)}
                    className="px-2 py-1 text-sm border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                </div>
              </div>

              <textarea
                value={block.content}
                onChange={e => updateTextBlock(block.id, e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
              />
            </div>
          ))}
        </div>

        {/* Output */}
        <div className="space-y-4">
          <button
            onClick={handleCopyMerged}
            className="px-3 py-2 bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white rounded hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
          >
            <Copy size={16} className="inline mr-1" />
            {copied ? "Copied!" : "Copy Result"}
          </button>

          <textarea
            readOnly
            value={mergedText}
            className="w-full h-64 border border-slate-200 dark:border-slate-600 p-3 rounded bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
          />

          <div className="text-sm text-slate-600 dark:text-slate-300">
            Blocks: {stats.totalBlocks} | Lines: {stats.totalLines} | Characters:{" "}
            {stats.totalCharacters}
          </div>

          <button
            onClick={handleReset}
            className="w-full border border-slate-200 dark:border-slate-600 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw size={16} className="inline mr-1" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextMerger;
