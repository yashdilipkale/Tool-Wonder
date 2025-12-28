import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Github, Linkedin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <a href="#" className="flex items-center gap-3 group text-white">
              <div className="flex items-center gap-2 transition-transform duration-300 group-hover:scale-105">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-primary-500 group-hover:rotate-12">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
                    <path d="M14.7 6.3a1 1 0 0 0-1.4 0l-4 4a1 1 0 0 0 1.4 1.4l4-4a1 1 0 0 0 0-1.4z" fill="white"/>
                    <path d="M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" fill="white"/>
                    <circle cx="12" cy="18" r="1" fill="#2563eb"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold transition-colors duration-300 group-hover:text-primary-300">Tools<span className="text-primary-400">Wonder</span></span>
                  <span className="text-xs text-slate-400">by yash</span>
                </div>
              </div>
            </a>
            <p className="text-slate-400 leading-relaxed">
              Simplifying your digital life with powerful, easy-to-use tools for all your needs. Fast, secure, and always accessible.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Github, href: 'https://github.com/yashdilipkale/'},
                { Icon: Linkedin, href: 'https://www.linkedin.com/in/yashkale07/' }
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><a href="#tools" className="hover:text-primary-400 transition-colors">All Tools</a></li>
              <li><Link to="/privacy-policy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-use" className="hover:text-primary-400 transition-colors">Terms of Use</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Categories</h3>
            <ul className="space-y-4">
              <li><a href="#image-tools" className="hover:text-primary-400 transition-colors">Image Tools</a></li>
              <li><a href="#pdf-tools" className="hover:text-primary-400 transition-colors">PDF Tools</a></li>
              <li><a href="#dev-tools" className="hover:text-primary-400 transition-colors">Developer Tools</a></li>
              <li><a href="#calculators" className="hover:text-primary-400 transition-colors">Calculators</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Contact</h3>
            <p className="mb-4">Have a suggestion or found a bug?</p>
            <a 
              href="mailto:yashkale823@gmail.com" 
              className="inline-flex items-center justify-center w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-sm font-medium hover:bg-primary-600 hover:border-primary-500 hover:text-white transition-all"
            >
              yashkale823@gmail.com
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2025 Tools Wonder. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500 fill-red-500" /> by Yash Kale
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
