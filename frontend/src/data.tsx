import {
  Image, FileText, Calculator, Type, Code, Palette, Search, Wrench,
  Maximize, Minimize, Crop, ScanText, RefreshCcw, Lock, Sigma, Calendar, Activity, Home, Percent,
  Coins, AlignLeft, List, SortAsc, ArrowRightLeft, Lock as LockIcon,
  FileCode, Brackets, Database, Link, Pipette, Regex, Eye, Layers, BarChart, Tag, QrCode, Barcode, Fingerprint, Ruler, Globe,
  Shuffle, Zap
} from 'lucide-react';
import { CategoryDefinition, Tool } from './types';

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'image',
    title: 'Image Tools',
    description: 'Edit, convert and optimize your images with our powerful tools',
    icon: Image,
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },

  {
    id: 'calculator',
    title: 'Calculator Tools',
    description: 'Perform various calculations for your daily needs',
    icon: Calculator,
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20'
  },
  {
    id: 'text',
    title: 'Text Tools',
    description: 'Manipulate and analyze text with our text processing tools',
    icon: Type,
    bgColor: 'bg-orange-50 dark:bg-orange-900/20'
  },
  {
    id: 'developer',
    title: 'Developer Tools',
    description: 'Essential tools for developers and webmasters',
    icon: Code,
    bgColor: 'bg-slate-100 dark:bg-slate-800'
  },
  {
    id: 'color',
    title: 'Color Tools',
    description: 'Create, convert and analyze colors for your designs',
    icon: Palette,
    bgColor: 'bg-pink-50 dark:bg-pink-900/20'
  },
  {
    id: 'seo',
    title: 'SEO Tools',
    description: 'Optimize your content and analyze your website performance',
    icon: Search,
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  {
    id: 'utility',
    title: 'Utility Tools',
    description: 'Handy tools for various everyday needs',
    icon: Wrench,
    bgColor: 'bg-teal-50 dark:bg-teal-900/20'
  }
];


export const TOOLS: Tool[] = [
  // Image Tools
  { id: 'img-conv', name: 'Image Converter', description: 'Convert between JPG, PNG, GIF, WEBP formats', icon: ArrowRightLeft, category: 'image', isPopular: true },
  { id: 'img-comp', name: 'Image Compressor', description: 'Reduce image file size without losing quality', icon: Minimize, category: 'image', isPopular: true },
  { id: 'img-res', name: 'Image Resizer', description: 'Resize images to any dimension maintaining aspect ratio', icon: Maximize, category: 'image' },
  { id: 'img-crop', name: 'Image Cropper', description: 'Crop images to remove unwanted areas', icon: Crop, category: 'image' },
  { id: 'img-ocr', name: 'Image to Text (OCR)', description: 'Extract text from images using AI', icon: ScanText, category: 'image', isNew: true, creditCost: 5 },
  { id: 'img-rot', name: 'Image Rotator', description: 'Rotate or flip images horizontally/vertically', icon: RefreshCcw, category: 'image' },

  // Calculator Tools
  { id: 'calc-sci', name: 'Scientific Calculator', description: 'Advanced calculator with scientific functions', icon: Sigma, category: 'calculator' },
  { id: 'calc-age', name: 'Age Calculator', description: 'Calculate age from birth date precisely', icon: Calendar, category: 'calculator' },
  { id: 'calc-bmi', name: 'BMI Calculator', description: 'Calculate your Body Mass Index', icon: Activity, category: 'calculator', isPopular: true, creditCost: 5 },
  { id: 'calc-emi', name: 'Loan EMI Calculator', description: 'Calculate monthly loan installments', icon: Home, category: 'calculator', creditCost: 5 },
  { id: 'calc-gst', name: 'GST Calculator', description: 'Calculate Goods and Services Tax', icon: Percent, category: 'calculator', creditCost: 5 },
  { id: 'calc-curr', name: 'Currency Converter', description: 'Real-time global currency conversion', icon: Coins, category: 'calculator', isPopular: true },
  { id: 'calc-invest', name: 'Investment Calculator', description: 'Analyze portfolio performance and investments', icon: Activity, category: 'calculator', creditCost: 10 },
  { id: 'calc-tip', name: 'Tip Calculator', description: 'Calculate tips and split bills easily', icon: Coins, category: 'calculator' },
  { id: 'calc-percent', name: 'Percentage Calculator', description: 'Calculate percentages, increases, and decreases', icon: Percent, category: 'calculator' },
  { id: 'calc-sales', name: 'Sales Tax Calculator', description: 'Calculate sales tax for all different regions and locations', icon: Calculator, category: 'calculator', creditCost: 5 },
  { id: 'calc-fuel', name: 'Fuel Cost Calculator', description: 'Calculate fuel costs and efficiency for Indian vehicles and routes', icon: Activity, category: 'calculator', creditCost: 8 },

  // Text Tools
  { id: 'txt-case', name: 'Text Case Converter', description: 'Change text to uppercase, lowercase, title case', icon: Type, category: 'text', creditCost: 5 },
  { id: 'txt-count', name: 'Word Counter', description: 'Count words, characters, and paragraphs', icon: AlignLeft, category: 'text', isPopular: true, creditCost: 5 },
  { id: 'txt-dedup', name: 'Remove Duplicates', description: 'Clean up text by removing duplicate lines', icon: List, category: 'text', creditCost: 5 },
  { id: 'txt-sort', name: 'Text Sorter', description: 'Sort list items alphabetically or numerically', icon: SortAsc, category: 'text' },
  { id: 'txt-rev', name: 'Text Reverser', description: 'Reverse text, words, or character order', icon: ArrowRightLeft, category: 'text' },
  { id: 'txt-enc', name: 'Text Encryptor', description: 'Securely encrypt and decrypt text data', icon: LockIcon, category: 'text' },
  { id: 'txt-summ', name: 'AI Text Summarizer', description: 'Generate summaries from long text automatically', icon: FileText, category: 'text' },
  { id: 'txt-gram', name: 'Grammar Checker', description: 'Advanced proofreading and grammar correction', icon: Eye, category: 'text' },
  { id: 'txt-find', name: 'Find & Replace', description: 'Search and replace text with advanced options', icon: Search, category: 'text', creditCost: 3 },
  { id: 'txt-diff', name: 'Text Diff Checker', description: 'Compare two texts and highlight differences', icon: ArrowRightLeft, category: 'text' },
  { id: 'txt-merge', name: 'Text Merger', description: 'Combine multiple text files or strings', icon: FileText, category: 'text' },

  // Developer Tools
  { id: 'dev-col', name: 'Color Converter', description: 'Convert between HEX, RGB, HSL formats', icon: Pipette, category: 'developer' },
  { id: 'dev-reg', name: 'Regex Tester', description: 'Test and debug regular expressions', icon: Regex, category: 'developer', isNew: true, creditCost: 5 },
  { id: 'dev-fmt', name: 'Code Formatter', description: 'Format code in multiple programming languages', icon: FileCode, category: 'developer', creditCost: 5 },
  { id: 'dev-db', name: 'Database Query Builder', description: 'Visual SQL query builder for databases', icon: Brackets, category: 'developer' },
  { id: 'dev-json', name: 'JSON Validator', description: 'Validate and format JSON data', icon: Brackets, category: 'developer' },
  { id: 'dev-css', name: 'CSS Minifier', description: 'Minify and optimize CSS code', icon: Palette, category: 'developer' },
  { id: 'dev-hash', name: 'Hash Generator', description: 'Generate MD5, SHA-1, SHA-256 hashes', icon: Lock, category: 'developer', creditCost: 5 },
  { id: 'dev-cron', name: 'Cron Generator', description: 'Generate cron expressions for scheduling', icon: Calendar, category: 'developer' },

  // Color Tools
  { id: 'col-pick', name: 'Image Color Picker', description: 'Extract palettes from uploaded images', icon: Pipette, category: 'color' },
  { id: 'col-grad', name: 'Gradient Generator', description: 'Create beautiful CSS gradients', icon: Layers, category: 'color', isPopular: true },
  { id: 'col-cont', name: 'Contrast Checker', description: 'Check accessibility contrast ratios', icon: Eye, category: 'color' },

  // SEO
  { id: 'seo-kw', name: 'Keyword Density', description: 'Analyze keyword frequency in content', icon: BarChart, category: 'seo' },
  { id: 'seo-meta', name: 'Meta Tag Analyzer', description: 'Analyze and optimize SEO meta tags', icon: Tag, category: 'seo' },


  // Utility
  { id: 'util-qr', name: 'QR Code Generator', description: 'Create and scan custom QR codes', icon: QrCode, category: 'utility', isPopular: true, creditCost: 5 },
  { id: 'util-bar', name: 'Barcode Generator', description: 'Generate product barcodes easily', icon: Barcode, category: 'utility', creditCost: 5 },
  { id: 'util-uuid', name: 'UUID Generator', description: 'Generate unique identifiers (v4)', icon: Fingerprint, category: 'utility' },
  { id: 'util-time', name: 'Time Zone', description: 'Convert time across different zones', icon: Globe, category: 'utility', creditCost: 5 },
  { id: 'util-pass', name: 'Password Gen', description: 'Generate strong, secure passwords', icon: Shuffle, category: 'utility', isPopular: true, creditCost: 5 },
  { id: 'util-file-enc', name: 'File Encryption', description: 'Securely encrypt and decrypt files', icon: LockIcon, category: 'utility' },
  { id: 'util-backup', name: 'Data Backup Tool', description: 'Automated cloud backup and sync', icon: Database, category: 'utility' },
  { id: 'util-morse', name: 'Morse Code Converter', description: 'Convert text to Morse code and vice versa', icon: Zap, category: 'utility' },
  { id: 'util-binary', name: 'Binary Converter', description: 'Convert between binary, decimal, hex, octal', icon: Code, category: 'utility' },
  { id: 'util-base64', name: 'Base64 Encoder', description: 'Encode and decode Base64 strings', icon: Lock, category: 'utility', creditCost: 5 }
];
