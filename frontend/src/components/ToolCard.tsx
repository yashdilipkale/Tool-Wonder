import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Zap, Crown } from 'lucide-react';
import { gsap } from 'gsap';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const Icon = tool.icon;

  useEffect(() => {
    const card = cardRef.current;
    const icon = iconRef.current;
    const title = titleRef.current;
    const arrow = arrowRef.current;

    if (!card || !icon || !title || !arrow) return;

    // Set initial states
    gsap.set(icon, { scale: 1 });
    gsap.set(title, { y: 0 });
    gsap.set(arrow, { x: 0 });

    const handleMouseEnter = () => {
      gsap.to(icon, {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(title, {
        y: -2,
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(arrow, {
        x: 4,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(icon, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(title, {
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(arrow, {
        x: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Link to={`/tool/${tool.id}`}>
      <div
        ref={cardRef}
        className="group relative bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden cursor-pointer"
      >
        {/* Decorative gradient line on top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

        <div className="flex justify-between items-start mb-4">
          <div
            ref={iconRef}
            className="p-3 rounded-lg bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300"
          >
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
            {tool.isPremium && (
              <span className="px-2 py-1 text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full flex items-center gap-1">
                <Crown size={10} /> PREMIUM
              </span>
            )}
          </div>
        </div>

        <h3
          ref={titleRef}
          className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors"
        >
          {tool.name}
        </h3>

        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>

        <div
          ref={arrowRef}
          className="flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 group-hover:text-primary-800 dark:group-hover:text-primary-300 transition-colors"
        >
          Use Tool
          <ArrowRight size={16} className="ml-2" />
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;
