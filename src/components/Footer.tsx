import React from 'react';
import { useAppStore } from '../store.js';

export default function Footer() {
  const { setView } = useAppStore();

  const handleNavigate = (viewName: 'landing' | 'about' | 'contact' | 'privacy' | 'terms' | 'cookies' | 'changelog' | 'billing') => {
    setView(viewName);
    window.location.hash = `#${viewName}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-stone-50 text-text-secondary border-t border-ink/10 dark:bg-stone-900 dark:border-white/10 py-12 px-6 sm:px-12 md:px-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Brand Info */}
        <div className="lg:col-span-2 flex flex-col gap-4 text-left">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('landing')}>
            <span className="w-8 h-8 rounded-none bg-brand-terracotta flex items-center justify-center font-display font-bold text-white tracking-tighter text-lg shadow-sm">
              T
            </span>
            <span className="font-display font-bold text-base tracking-tight text-text-primary">
              TrueTone <span className="text-brand-terracotta">AI</span>
            </span>
          </div>
          <p className="text-xs text-text-secondary max-w-xs leading-relaxed">
            See the color before you buy the can. Bring high-fidelity AI-powered room and wall recoloring directly to your browser.
          </p>
          <div className="text-[10px] font-mono text-text-secondary mt-2">
            © 2026 TrueTone AI · All rights reserved · Made with ♥ for homeowners everywhere.
          </div>
        </div>

        {/* Column 1: Product */}
        <div className="flex flex-col gap-3 text-left">
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-text-primary">
            Product
          </h4>
          <ul className="flex flex-col gap-2 text-xs">
            <li>
              <button onClick={() => handleNavigate('landing')} className="hover:text-brand-terracotta text-left transition-colors">
                Features
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigate('billing')} className="hover:text-brand-terracotta text-left transition-colors">
                Pricing
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigate('landing')} className="hover:text-brand-terracotta text-left transition-colors">
                How it works
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigate('changelog')} className="hover:text-brand-terracotta text-left transition-colors font-semibold text-brand-terracotta bg-brand-terracotta/5 px-1.5 py-0.5 border border-brand-terracotta/10">
                v0.1.0 · Changelog
              </button>
            </li>
          </ul>
        </div>

        {/* Column 2: Company */}
        <div className="flex flex-col gap-3 text-left">
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-text-primary">
            Company
          </h4>
          <ul className="flex flex-col gap-2 text-xs">
            <li>
              <button onClick={() => handleNavigate('about')} className="hover:text-brand-terracotta text-left transition-colors">
                About
              </button>
            </li>

            <li>
              <button onClick={() => handleNavigate('contact')} className="hover:text-brand-terracotta text-left transition-colors">
                Contact
              </button>
            </li>

          </ul>
        </div>

        {/* Column 3: Legal */}
        <div className="flex flex-col gap-3 text-left">
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-text-primary">
            Legal
          </h4>
          <ul className="flex flex-col gap-2 text-xs">
            <li>
              <button onClick={() => handleNavigate('privacy')} className="hover:text-brand-terracotta text-left transition-colors">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigate('terms')} className="hover:text-brand-terracotta text-left transition-colors">
                Terms of Service
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigate('cookies')} className="hover:text-brand-terracotta text-left transition-colors">
                Cookie Policy
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigate('privacy')} className="hover:text-brand-terracotta text-left transition-colors">
                GDPR/CCPA Compliance
              </button>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
