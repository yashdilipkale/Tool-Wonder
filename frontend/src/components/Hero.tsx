import React from 'react';
import { Image, Calculator, Type, Code, Palette } from 'lucide-react';

const Hero: React.FC = () => {
  const quickIcons = [
    { icon: Image, label: 'Image', href: '#image-tools' },
    { icon: Calculator, label: 'Calculators', href: '#calculator-tools' },
    { icon: Type, label: 'Text', href: '#text-tools' },
    { icon: Code, label: 'Developer Tools', href: '#developer-tools' },
    { icon: Palette, label: 'Color', href: '#color-tools' },
  ];

  const handleQuickLinkClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>
      
      {/* Gradient Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary-100/50 dark:bg-primary-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
          New tools added weekly
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Your Daily Tools,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">All in One Place</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Convert, calculate, compress, and simplify your everyday tasks. 
          Professional tools that are fast, secure, and free forever.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <a href="#tools" className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-200 dark:shadow-none hover:bg-primary-700 hover:translate-y-[-2px] transition-all">
            Explore All Tools
          </a>
        </div>

        {/* Quick Access Icons */}
        <div className="mt-16 flex flex-wrap justify-center gap-4 md:gap-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          {quickIcons.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleQuickLinkClick(item.href);
              }}
              className="group flex flex-col items-center gap-2 cursor-pointer"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:border-primary-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                <item.icon size={24} className="md:w-7 md:h-7" />
              </div>
              <span className="text-xs font-medium text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
