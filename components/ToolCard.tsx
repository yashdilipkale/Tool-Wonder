import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Zap } from 'lucide-react';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const Icon = tool.icon;

  return (
    <Link to={`/tool/${tool.id}`}>
      <div className="group relative bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-700 hover:-translate-y-1 overflow-hidden cursor-pointer">
      {/* Decorative gradient line on top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-lg bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
          <Icon size={24} />
        </div>
        <div className="flex gap-1">
          {tool.isNew && (
            <span className="px-2 py-1 text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center gap-1">
              <Zap size={10} /> NEW
            </span>
          )}
          {tool.isPopular && (
            <span className="px-2 py-1 text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full flex items-center gap-1">
              <Star size={10} /> HOT
            </span>
          )}
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
        {tool.name}
      </h3>
      
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
        {tool.description}
      </p>

      <div className="flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 group-hover:text-primary-800 dark:group-hover:text-primary-300 transition-colors">
        Use Tool
        <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
    </Link>
  );
};

export default ToolCard;
