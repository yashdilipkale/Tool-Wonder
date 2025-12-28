import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Terminal, Mail, Sun, Moon, User, LogOut, Zap } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../AuthContext';


const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Tools', href: '#tools' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="flex items-center gap-2 transition-transform duration-300 group-hover:scale-105">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-primary-700 group-hover:rotate-12">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
                    <path d="M14.7 6.3a1 1 0 0 0-1.4 0l-4 4a1 1 0 0 0 1.4 1.4l4-4a1 1 0 0 0 0-1.4z" fill="white"/>
                    <path d="M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" fill="white"/>
                    <circle cx="12" cy="18" r="1" fill="#2563eb"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-primary-600">Tools<span className="text-primary-600">Wonder</span></span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">by yash</span>
                </div>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <ul className="flex gap-8">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary-600 dark:after:bg-primary-400 after:transition-all hover:after:w-full"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-slate-500 hover:text-primary-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-primary-400 dark:hover:bg-slate-800 transition-all"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {/* Authentication */}
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm">
                      <User size={16} />
                      <span>{user.name}</span>
                    </div>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="px-4 py-2 rounded-full bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                <a
                  href="mailto:yashkale823@gmail.com"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
                >
                  <Mail size={16} />
                  <span>Get in touch</span>
                </a>
              </div>
            </nav>

            {/* Mobile Actions */}
            <div className="flex items-center gap-4 md:hidden">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400"
              >
                {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
              </button>
              
              <button 
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-[280px] bg-white dark:bg-slate-900 z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-end mb-8">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X size={28} />
            </button>
          </div>
          
          <ul className="space-y-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="block text-xl font-medium text-slate-800 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-400 hover:pl-2 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>



          {/* Mobile Authentication */}
          <div className="mt-6 space-y-4">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <User size={20} className="text-slate-500" />
                  <span className="text-slate-800 dark:text-slate-100 font-medium">{user.name}</span>
                </div>

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left text-slate-800 dark:text-slate-100 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 transition-colors rounded-lg"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="flex items-center justify-center w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center justify-center w-full px-4 py-3 bg-primary-600 text-white hover:bg-primary-700 transition-colors rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
             <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <Mail size={18} />
                <span className="text-sm">yashkale823@gmail.com</span>
             </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default Header;
