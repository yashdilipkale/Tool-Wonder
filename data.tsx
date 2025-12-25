import {
  Image, FileText, Calculator, Type, Code, Palette, Search, Wrench,
  Maximize, Minimize, Crop, ScanText, RefreshCcw, File, FileArchive,
  Scissors, Lock, PenTool, Sigma, Calendar, Activity, Home, Percent,
  Coins, AlignLeft, List, Scissors as ScissorsIcon, SortAsc,
  ArrowRightLeft, Lock as LockIcon, FileCode, Brackets, Database,
  Link, Pipette, Regex, Eye, Grid, Layers, BarChart, Tag, QrCode,
  Barcode, Fingerprint, Ruler, Globe, Shuffle
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
    id: 'document',
    title: 'Document Tools',
    description: 'Manage and convert your documents with ease',
    icon: FileText,
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
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
  { id: 'img-ocr', name: 'Image to Text (OCR)', description: 'Extract text from images using AI', icon: ScanText, category: 'image', isNew: true },
  { id: 'img-rot', name: 'Image Rotator', description: 'Rotate or flip images horizontally/vertically', icon: RefreshCcw, category: 'image' },

  // Document Tools
  { id: 'doc-conv', name: 'PDF to Word', description: 'Convert PDF files to editable Word documents', icon: File, category: 'document', isPopular: true },
  { id: 'pdf-comp', name: 'PDF Compressor', description: 'Reduce PDF file size for easier sharing', icon: FileArchive, category: 'document' },
  { id: 'pdf-merge', name: 'PDF Merger & Splitter', description: 'Combine multiple PDFs or split pages', icon: Scissors, category: 'document' },
  { id: 'doc-fmt', name: 'Format Converter', description: 'Convert between various document formats', icon: ArrowRightLeft, category: 'document' },
  { id: 'pdf-lock', name: 'PDF Lock/Unlock', description: 'Add or remove passwords from PDF files', icon: Lock, category: 'document' },
  { id: 'pdf-sign', name: 'eSign PDF', description: 'Add digital signatures to your PDF documents', icon: PenTool, category: 'document', isNew: true },

  // Calculator Tools
  { id: 'calc-sci', name: 'Scientific Calculator', description: 'Advanced calculator with scientific functions', icon: Sigma, category: 'calculator' },
  { id: 'calc-age', name: 'Age Calculator', description: 'Calculate age from birth date precisely', icon: Calendar, category: 'calculator' },
  { id: 'calc-bmi', name: 'BMI Calculator', description: 'Calculate your Body Mass Index', icon: Activity, category: 'calculator', isPopular: true },
  { id: 'calc-emi', name: 'Loan EMI Calculator', description: 'Calculate monthly loan installments', icon: Home, category: 'calculator' },
  { id: 'calc-gst', name: 'GST Calculator', description: 'Calculate Goods and Services Tax', icon: Percent, category: 'calculator' },
  { id: 'calc-curr', name: 'Currency Converter', description: 'Real-time global currency conversion', icon: Coins, category: 'calculator', isPopular: true },

  // Text Tools
  { id: 'txt-case', name: 'Text Case Converter', description: 'Change text to uppercase, lowercase, title case', icon: Type, category: 'text' },
  { id: 'txt-count', name: 'Word Counter', description: 'Count words, characters, and paragraphs', icon: AlignLeft, category: 'text', isPopular: true },
  { id: 'txt-dedup', name: 'Remove Duplicates', description: 'Clean up text by removing duplicate lines', icon: List, category: 'text' },
  { id: 'txt-sort', name: 'Text Sorter', description: 'Sort list items alphabetically or numerically', icon: SortAsc, category: 'text' },
  { id: 'txt-rev', name: 'Text Reverser', description: 'Reverse text, words, or character order', icon: ArrowRightLeft, category: 'text' },
  { id: 'txt-enc', name: 'Text Encryptor', description: 'Securely encrypt and decrypt text data', icon: LockIcon, category: 'text' },

  // Developer Tools
  { id: 'dev-min', name: 'Code Minifier', description: 'Minify HTML, CSS, and JS code', icon: FileCode, category: 'developer' },
  { id: 'dev-json', name: 'JSON Formatter', description: 'Validate and format JSON data beautifier', icon: Brackets, category: 'developer', isPopular: true },
  { id: 'dev-b64', name: 'Base64 Converter', description: 'Encode and decode Base64 strings', icon: Database, category: 'developer' },
  { id: 'dev-url', name: 'URL Encoder', description: 'Encode or decode URLs for safe usage', icon: Link, category: 'developer' },
  { id: 'dev-col', name: 'Color Converter', description: 'Convert between HEX, RGB, HSL formats', icon: Pipette, category: 'developer' },
  { id: 'dev-reg', name: 'Regex Tester', description: 'Test and debug regular expressions', icon: Regex, category: 'developer', isNew: true },

  // Color Tools
  { id: 'col-pick', name: 'Image Color Picker', description: 'Extract palettes from uploaded images', icon: Pipette, category: 'color' },
  { id: 'col-grad', name: 'Gradient Generator', description: 'Create beautiful CSS gradients', icon: Layers, category: 'color', isPopular: true },
  { id: 'col-cont', name: 'Contrast Checker', description: 'Check accessibility contrast ratios', icon: Eye, category: 'color' },
  { id: 'col-pal', name: 'Palette Generator', description: 'Generate harmonious color schemes', icon: Grid, category: 'color' },

  // SEO
  { id: 'seo-kw', name: 'Keyword Density', description: 'Analyze keyword frequency in content', icon: BarChart, category: 'seo' },
  { id: 'seo-meta', name: 'Meta Tag Analyzer', description: 'Analyze and optimize SEO meta tags', icon: Tag, category: 'seo' },

  // Utility
  { id: 'util-qr', name: 'QR Code Generator', description: 'Create and scan custom QR codes', icon: QrCode, category: 'utility', isPopular: true },
  { id: 'util-bar', name: 'Barcode Generator', description: 'Generate product barcodes easily', icon: Barcode, category: 'utility' },
  { id: 'util-uuid', name: 'UUID Generator', description: 'Generate unique identifiers (v4)', icon: Fingerprint, category: 'utility' },
  { id: 'util-unit', name: 'Unit Converter', description: 'Convert length, weight, temperature', icon: Ruler, category: 'utility' },
  { id: 'util-time', name: 'Time Zone', description: 'Convert time across different zones', icon: Globe, category: 'utility' },
  { id: 'util-pass', name: 'Password Gen', description: 'Generate strong, secure passwords', icon: Shuffle, category: 'utility', isPopular: true },
];