import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Search, ChevronUp } from 'lucide-react';
import { gsap } from 'gsap';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ToolCard from './components/ToolCard';
import ToolPage from './components/ToolPage.tsx';
import Signup from './components/Signup';
import Login from './components/Login';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import { CATEGORIES, TOOLS } from './data';
import { CategoryDefinition, Tool } from './types';

// ToolGrid Component with GSAP Animations
const ToolGrid: React.FC<{ tools: Tool[] }> = ({ tools }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.tool-card');
    if (!cards) return;

    // Set initial states
    gsap.set(cards, {
      opacity: 0,
      y: 30,
      scale: 0.95
    });

    // Animate cards with stagger
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(1.7)",
      delay: 0.2
    });
  }, [tools]);

  return (
    <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {tools.map((tool) => (
        <div key={tool.id} className="tool-card">
          <ToolCard tool={tool} />
        </div>
      ))}
    </div>
  );
};

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  // Search Logic
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return null;

    return TOOLS.filter(tool => 
      tool.name.toLowerCase().includes(query) || 
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Scroll to Top Logic
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
              <Header />

              <main className="flex-grow">
                <Hero />

                {/* Search Bar Section - Floating overlapping Hero */}
                <section className="relative px-4 z-20 -mt-8 mb-16">
                  <div className="max-w-2xl mx-auto">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl text-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all"
                        placeholder="Search for tools (e.g., 'compress', 'pdf', 'calculator')..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 font-medium text-sm"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </section>

                {/* Content Area */}
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pb-24 scroll-mt-28" id="tools">

                  {searchQuery ? (
                    /* Search Results View */
                    <div className="animate-fade-in-up">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                          <Search size={20} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                          Search Results <span className="text-slate-400 dark:text-slate-500 font-normal">({filteredData?.length || 0})</span>
                        </h2>
                      </div>

                      {filteredData && filteredData.length > 0 ? (
                        <ToolGrid tools={filteredData} />
                      ) : (
                        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-300">
                            <Search size={32} />
                          </div>
                          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No tools found</h3>
                          <p className="text-slate-500 dark:text-slate-400">Try searching for something else or browse categories below.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Categories View */
                    <div className="space-y-24">
                      {CATEGORIES.map((category) => {
                        const categoryTools = TOOLS.filter(t => t.category === category.id);
                        if (categoryTools.length === 0) return null;

                        const CatIcon = category.icon;

                        return (
                          <section key={category.id} id={`${category.id}-tools`} className="scroll-mt-28">
                            <div className="text-center max-w-2xl mx-auto mb-12">
                              <div className={`inline-flex p-3 rounded-2xl ${category.bgColor} text-slate-700 dark:text-slate-200 mb-4`}>
                                <CatIcon size={32} strokeWidth={1.5} />
                              </div>
                              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{category.title}</h2>
                              <p className="text-slate-500 dark:text-slate-400 text-lg">{category.description}</p>
                            </div>

                            <ToolGrid tools={categoryTools} />
                          </section>
                        );
                      })}
                    </div>
                  )}
                </div>
              </main>

              <Footer />

              {/* Scroll To Top Button */}
              <button
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 p-4 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 hover:-translate-y-1 transition-all z-40 group"
                aria-label="Scroll to top"
              >
                <ChevronUp size={24} className="group-hover:animate-bounce" />
              </button>
            </div>
          } />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tool/:toolId" element={<ToolPage />} />
          <Route path="/privacy-policy" element={
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
              <Header />
              <main className="flex-grow py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <PrivacyPolicy />
                </div>
              </main>
              <Footer />
            </div>
          } />
          <Route path="/terms-of-use" element={
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
              <Header />
              <main className="flex-grow py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <TermsOfUse />
                </div>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
