import React, { useState } from 'react';
import { Palette, Copy, Download, Eye, Tag, Star } from 'lucide-react';

interface ColorPalette {
  id: string;
  name: string;
  description: string;
  category: string;
  colors: string[];
  tags: string[];
  isPopular?: boolean;
}

const ProfessionalColorPalettes: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const colorPalettes: ColorPalette[] = [
    // Corporate & Business
    {
      id: 'corporate-blue',
      name: 'Corporate Blue',
      description: 'Professional blue tones perfect for corporate branding',
      category: 'corporate',
      colors: ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
      tags: ['professional', 'trustworthy', 'corporate'],
      isPopular: true
    },
    {
      id: 'executive-gray',
      name: 'Executive Gray',
      description: 'Sophisticated gray palette for luxury brands',
      category: 'corporate',
      colors: ['#111827', '#374151', '#6B7280', '#9CA3AF', '#E5E7EB'],
      tags: ['luxury', 'elegant', 'modern']
    },
    {
      id: 'business-green',
      name: 'Business Green',
      description: 'Fresh and professional green for eco-friendly brands',
      category: 'corporate',
      colors: ['#064E3B', '#059669', '#34D399', '#6EE7B7', '#A7F3D0'],
      tags: ['eco-friendly', 'growth', 'professional']
    },

    // Web & Digital
    {
      id: 'tech-purple',
      name: 'Tech Purple',
      description: 'Modern purple gradient for tech startups',
      category: 'web',
      colors: ['#4C1D95', '#7C3AED', '#A855F7', '#C084FC', '#DDD6FE'],
      tags: ['tech', 'startup', 'modern', 'gradient'],
      isPopular: true
    },
    {
      id: 'minimalist-white',
      name: 'Minimalist White',
      description: 'Clean white palette with subtle accents',
      category: 'web',
      colors: ['#FFFFFF', '#F9FAFB', '#F3F4F6', '#E5E7EB', '#9CA3AF'],
      tags: ['minimalist', 'clean', 'modern']
    },
    {
      id: 'dark-mode',
      name: 'Dark Mode Pro',
      description: 'Professional dark theme color palette',
      category: 'web',
      colors: ['#0F172A', '#1E293B', '#334155', '#64748B', '#94A3B8'],
      tags: ['dark', 'modern', 'tech']
    },

    // Creative & Design
    {
      id: 'creative-orange',
      name: 'Creative Orange',
      description: 'Energetic orange palette for creative projects',
      category: 'creative',
      colors: ['#9A3412', '#EA580C', '#FB923C', '#FDBA74', '#FED7AA'],
      tags: ['creative', 'energetic', 'warm']
    },
    {
      id: 'artist-pink',
      name: 'Artist Pink',
      description: 'Soft pink tones for artistic and feminine brands',
      category: 'creative',
      colors: ['#831843', '#DB2777', '#F472B6', '#F9A8D4', '#FCE7F3'],
      tags: ['artistic', 'feminine', 'soft']
    },
    {
      id: 'bold-red',
      name: 'Bold Red',
      description: 'Powerful red palette for bold statements',
      category: 'creative',
      colors: ['#7F1D1D', '#DC2626', '#EF4444', '#F87171', '#FECACA'],
      tags: ['bold', 'powerful', 'attention-grabbing']
    },

    // Nature & Organic
    {
      id: 'forest-green',
      name: 'Forest Green',
      description: 'Natural green palette inspired by forests',
      category: 'nature',
      colors: ['#14532D', '#16A34A', '#4ADE80', '#86EFAC', '#DCFCE7'],
      tags: ['nature', 'organic', 'fresh']
    },
    {
      id: 'ocean-blue',
      name: 'Ocean Blue',
      description: 'Calming blue tones reminiscent of the ocean',
      category: 'nature',
      colors: ['#0C4A6E', '#0369A1', '#0284C7', '#38BDF8', '#BAE6FD'],
      tags: ['calming', 'ocean', 'peaceful']
    },
    {
      id: 'sunset-orange',
      name: 'Sunset Orange',
      description: 'Warm sunset colors for natural beauty brands',
      category: 'nature',
      colors: ['#9A3412', '#C2410C', '#EA580C', '#FB923C', '#FED7AA'],
      tags: ['warm', 'sunset', 'natural']
    },

    // Luxury & Premium
    {
      id: 'gold-luxury',
      name: 'Gold Luxury',
      description: 'Elegant gold and black for luxury brands',
      category: 'luxury',
      colors: ['#1C1917', '#78716C', '#D4AF37', '#F5E6A3', '#FEF3C7'],
      tags: ['luxury', 'premium', 'elegant']
    },
    {
      id: 'platinum-gray',
      name: 'Platinum Gray',
      description: 'Sophisticated gray tones for premium products',
      category: 'luxury',
      colors: ['#0F172A', '#334155', '#64748B', '#CBD5E1', '#F1F5F9'],
      tags: ['premium', 'sophisticated', 'modern']
    },
    {
      id: 'royal-purple',
      name: 'Royal Purple',
      description: 'Regal purple palette for luxury goods',
      category: 'luxury',
      colors: ['#581C87', '#7C3AED', '#A855F7', '#C084FC', '#E9D5FF'],
      tags: ['royal', 'luxury', 'regal']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Palettes', icon: Palette },
    { id: 'corporate', name: 'Corporate', icon: Tag },
    { id: 'web', name: 'Web & Digital', icon: Eye },
    { id: 'creative', name: 'Creative', icon: Star },
    { id: 'nature', name: 'Nature', icon: Palette },
    { id: 'luxury', name: 'Luxury', icon: Star }
  ];

  const filteredPalettes = colorPalettes.filter(palette => {
    const matchesCategory = selectedCategory === 'all' || palette.category === selectedCategory;
    const matchesSearch = searchTerm === '' ||
      palette.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      palette.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      palette.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const copyColorToClipboard = async (color: string) => {
    await navigator.clipboard.writeText(color);
  };

  const copyPaletteToClipboard = async (palette: ColorPalette) => {
    const colorString = palette.colors.join(', ');
    await navigator.clipboard.writeText(colorString);
  };

  const exportPaletteAsCSS = (palette: ColorPalette) => {
    const cssVariables = palette.colors.map((color, index) =>
      `  --color-${palette.id}-${index + 1}: ${color};`
    ).join('\n');

    const css = `/* ${palette.name} Color Palette */\n:root {\n${cssVariables}\n}`;

    const blob = new Blob([css], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${palette.id}-palette.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportPaletteAsJSON = (palette: ColorPalette) => {
    const json = JSON.stringify({
      name: palette.name,
      description: palette.description,
      category: palette.category,
      colors: palette.colors,
      tags: palette.tags
    }, null, 2);

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${palette.id}-palette.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full text-pink-600 dark:text-pink-400">
          <Palette size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Professional Color Palettes</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Curated premium color palettes for professional design projects</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search palettes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-pink-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <category.icon size={16} />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Palette Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPalettes.map((palette) => (
          <div key={palette.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            {/* Color Preview */}
            <div className="h-24 flex">
              {palette.colors.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 relative group cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => copyColorToClipboard(color)}
                  title={`Click to copy: ${color}`}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Copy size={16} className="text-white" />
                  </div>
                </div>
              ))}
            </div>

            {/* Palette Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    {palette.name}
                    {palette.isPopular && <Star size={14} className="text-yellow-500 fill-current" />}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{palette.description}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {palette.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Color Values */}
              <div className="space-y-2 mb-4">
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Hex Values
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="text-xs font-mono bg-slate-50 dark:bg-slate-700 p-2 rounded text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                      onClick={() => copyColorToClipboard(color)}
                      title={`Click to copy: ${color}`}
                    >
                      {color}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => copyPaletteToClipboard(palette)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors text-sm"
                >
                  <Copy size={14} />
                  Copy All
                </button>

                <div className="relative group">
                  <button className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    <Download size={14} />
                  </button>

                  <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg py-2 min-w-32 z-10">
                    <button
                      onClick={() => exportPaletteAsCSS(palette)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Export as CSS
                    </button>
                    <button
                      onClick={() => exportPaletteAsJSON(palette)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Export as JSON
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPalettes.length === 0 && (
        <div className="text-center py-12">
          <Palette size={48} className="mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">No palettes found</h3>
          <p className="text-slate-500 dark:text-slate-500">Try adjusting your search or category filter</p>
        </div>
      )}

      {/* Usage Tips */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Eye size={20} />
          Design Tips
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
          <div>
            <h5 className="font-medium mb-2">Color Harmony</h5>
            <p>Each palette is carefully crafted using color theory principles for optimal visual harmony.</p>
          </div>
          <div>
            <h5 className="font-medium mb-2">Accessibility</h5>
            <p>Consider contrast ratios when using text over colored backgrounds for better readability.</p>
          </div>
          <div>
            <h5 className="font-medium mb-2">Brand Consistency</h5>
            <p>Choose palettes that align with your brand personality and target audience preferences.</p>
          </div>
          <div>
            <h5 className="font-medium mb-2">Export Options</h5>
            <p>Use CSS variables for easy integration into your web projects, or JSON for design systems.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalColorPalettes;
