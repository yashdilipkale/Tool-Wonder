import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TOOLS } from '../data';
import WordCounter from './WordCounter';
import ImageConverter from './ImageConverter';
import ImageCompressor from './ImageCompressor';
import ImageResizer from './ImageResizer';
import ImageCropper from './ImageCropper';
import ImageOCR from './ImageOCR';
import ImageRotator from './ImageRotator';

import ScientificCalculator from './ScientificCalculator';
import AgeCalculator from './AgeCalculator';
import BMICalculator from './BMICalculator';
import CurrencyConverter from './CurrencyConverter';
import LoanEMICalculator from './LoanEMICalculator';
import GSTCalculator from './GSTCalculator';

import TextCaseConverter from './TextCaseConverter';
import RemoveDuplicates from './RemoveDuplicates';
import TextSorter from './TextSorter';
import TextReverser from './TextReverser';
import TextEncryptor from './TextEncryptor';
import CodeMinifier from './CodeMinifier';
import JSONFormatter from './JSONFormatter';
import Base64Converter from './Base64Converter';

import ColorConverter from './ColorConverter';
import RegexTester from './RegexTester';
import ImageColorPicker from './ImageColorPicker';
import GradientGenerator from './GradientGenerator';
import ContrastChecker from './ContrastChecker';
import KeywordDensity from './KeywordDensity';
import MetaTagAnalyzer from './MetaTagAnalyzer';
import GrammarChecker from './GrammarChecker';
import FindReplace from './FindReplace';
import TextDiffChecker from './TextDiffChecker';
import TextMerger from './TextMerger';
import CodeFormatter from './CodeFormatter';
import DatabaseQueryBuilder from './DatabaseQueryBuilder';
import CSSMinifier from './CSSMinifier';
import HashGenerator from './HashGenerator';
import CronGenerator from './CronGenerator';
import QRCodeGenerator from './QRCodeGenerator';
import BarcodeGenerator from './BarcodeGenerator';
import UUIDGenerator from './UUIDGenerator';
import TimeZoneConverter from './TimeZoneConverter';
import PasswordGenerator from './PasswordGenerator';
import FileEncryption from './FileEncryption';
import DataBackupTool from './DataBackupTool';
import MorseCodeConverter from './MorseCodeConverter';
import BinaryConverter from './BinaryConverter';
import InvestmentCalculator from './InvestmentCalculator';
import TipCalculator from './TipCalculator';
import PercentageCalculator from './PercentageCalculator';
import SalesTaxCalculator from './SalesTaxCalculator';
import FuelCostCalculator from './FuelCostCalculator';


const ToolPage: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  
  const tool = TOOLS.find(t => t.id === toolId);

  if (!tool) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Tool not found</h1>
          <p className="text-slate-500 dark:text-slate-400">The requested tool does not exist.</p>
        </div>
      </div>
    );
  }

  const Icon = tool.icon;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-4"
          >
            <ArrowLeft size={20} />
            Back to tools
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
              <Icon size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{tool.name}</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">{tool.description}</p>
            </div>
          </div>

          {tool.isNew && (
            <span className="inline-block px-3 py-1 text-sm font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
              NEW
            </span>
          )}
          {tool.isPopular && (
            <span className="inline-block ml-2 px-3 py-1 text-sm font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
              POPULAR
            </span>
          )}
        </div>


        {/* Tool Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
          {tool.id === 'img-conv' ? (
            <ImageConverter />
          ) : tool.id === 'img-comp' ? (
            <ImageCompressor />
          ) : tool.id === 'img-res' ? (
            <ImageResizer />
          ) : tool.id === 'img-crop' ? (
            <ImageCropper />
          ) : tool.id === 'img-ocr' ? (
            <ImageOCR />
          ) : tool.id === 'img-rot' ? (
            <ImageRotator />
          ) : tool.id === 'calc-sci' ? (
            <ScientificCalculator />
          ) : tool.id === 'calc-age' ? (
            <AgeCalculator />
          ) : tool.id === 'calc-bmi' ? (
            <BMICalculator />
          ) : tool.id === 'calc-emi' ? (
            <LoanEMICalculator />
          ) : tool.id === 'calc-gst' ? (
            <GSTCalculator />
          ) : tool.id === 'calc-curr' ? (
            <CurrencyConverter />
          ) : tool.id === 'txt-case' ? (
            <TextCaseConverter />
          ) : tool.id === 'txt-count' ? (
            <WordCounter />
          ) : tool.id === 'txt-dedup' ? (
            <RemoveDuplicates />
          ) : tool.id === 'txt-sort' ? (
            <TextSorter />
          ) : tool.id === 'txt-rev' ? (
            <TextReverser />
          ) : tool.id === 'txt-enc' ? (
            <TextEncryptor />
          ) : tool.id === 'dev-min' ? (
            <CodeMinifier />
          ) : tool.id === 'dev-json' ? (
            <JSONFormatter />
          ) : tool.id === 'util-base64' ? (
            <Base64Converter />

          ) : tool.id === 'dev-col' ? (
            <ColorConverter />
          ) : tool.id === 'dev-reg' ? (
            <RegexTester />
          ) : tool.id === 'dev-fmt' ? (
            <CodeFormatter />
          ) : tool.id === 'dev-db' ? (
            <DatabaseQueryBuilder />
          ) : tool.id === 'dev-css' ? (
            <CSSMinifier />
          ) : tool.id === 'dev-hash' ? (
            <HashGenerator />
          ) : tool.id === 'dev-cron' ? (
            <CronGenerator />
          ) : tool.id === 'col-pick' ? (
            <ImageColorPicker />
          ) : tool.id === 'col-grad' ? (
            <GradientGenerator />
          ) : tool.id === 'col-cont' ? (
            <ContrastChecker />
          ) : tool.id === 'seo-kw' ? (
            <KeywordDensity />
          ) : tool.id === 'seo-meta' ? (
            <MetaTagAnalyzer />
          ) : tool.id === 'txt-gram' ? (
            <GrammarChecker />
          ) : tool.id === 'txt-find' ? (
            <FindReplace />
          ) : tool.id === 'txt-diff' ? (
            <TextDiffChecker />
          ) : tool.id === 'txt-merge' ? (
            <TextMerger />
          ) : tool.id === 'util-qr' ? (
            <QRCodeGenerator />
          ) : tool.id === 'util-bar' ? (
            <BarcodeGenerator />
          ) : tool.id === 'util-uuid' ? (
            <UUIDGenerator />
          ) : tool.id === 'util-time' ? (
            <TimeZoneConverter />
          ) : tool.id === 'util-pass' ? (
            <PasswordGenerator />
          ) : tool.id === 'util-file-enc' ? (
            <FileEncryption />
          ) : tool.id === 'util-backup' ? (
            <DataBackupTool />
          ) : tool.id === 'util-morse' ? (
            <MorseCodeConverter />
          ) : tool.id === 'util-binary' ? (
            <BinaryConverter />
          ) : tool.id === 'calc-invest' ? (
            <InvestmentCalculator />
          ) : tool.id === 'calc-tip' ? (
            <TipCalculator />
          ) : tool.id === 'calc-percent' ? (
            <PercentageCalculator />
          ) : tool.id === 'calc-sales' ? (
            <SalesTaxCalculator />
          ) : tool.id === 'calc-fuel' ? (
            <FuelCostCalculator />
          ) : tool.id.startsWith('pdf-') || tool.id.startsWith('doc-') || tool.id === 'calc-curr' || tool.id.startsWith('img-') ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600 dark:text-amber-400">
                  <Icon size={32} />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Backend Required</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  This tool requires server-side processing for security, performance, or external API integration.
                </p>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-left">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>What this involves:</strong><br />
                    • File upload and processing<br />
                    • External API integrations<br />
                    • Complex calculations<br />
                    • Secure document handling
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-300">
                  <Icon size={32} />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Tool Coming Soon</h2>
                <p className="text-slate-500 dark:text-slate-400">
                  We're working on implementing this tool. Check back soon!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolPage;
