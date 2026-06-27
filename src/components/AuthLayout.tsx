import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store.js';
import { Sparkles, ArrowLeft } from 'lucide-react';

const PALETTE_COLORS = [
  { hex: '#C97B5A', name: 'Terracotta Clay' },
  { hex: '#7C9885', name: 'Forest Sage' },
  { hex: '#4C6B8B', name: 'Coastal Slate' },
  { hex: '#D99B52', name: 'Ochre Ochre' },
  { hex: '#635D75', name: 'Evening Plum' }
];

const SOCIAL_QUOTES = [
  { text: "Saved me 3 trips to the hardware store", author: "Priya M." },
  { text: "Matched our bedroom accent wall perfectly!", author: "Daniel K." },
  { text: "The visualizer is so realistic, it feels like magic", author: "Sarah L." }
];

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subhead: string;
}

export default function AuthLayout({ children, title, subhead }: AuthLayoutProps) {
  const { setView } = useAppStore();
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  // Loop colors
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setActiveColorIndex((prev) => (prev + 1) % PALETTE_COLORS.length);
    }, 3500);
    return () => clearInterval(colorInterval);
  }, []);

  // Loop quotes
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setActiveQuoteIndex((prev) => (prev + 1) % SOCIAL_QUOTES.length);
    }, 5000);
    return () => clearInterval(quoteInterval);
  }, []);

  return (
    <div id="auth-split-canvas" className="min-h-screen bg-bg-base flex flex-col lg:grid lg:grid-cols-2 text-text-primary overflow-x-hidden">
      
      {/* LEFT COLUMN: Visual & Interactive Mini-Demo */}
      <section className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#FDF5F0] to-[#F5EDE8] dark:from-stone-900 dark:to-stone-950 border-r border-ink/10 relative overflow-hidden text-left h-full min-h-screen">
        
        {/* Top brand header */}
        <div className="flex items-center justify-between z-10">
          <button 
            onClick={() => { setView('landing'); window.location.hash = ''; }}
            className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-brand-terracotta transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </button>
          
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-terracotta" />
            <span className="text-[10px] tracking-widest uppercase font-mono text-brand-terracotta font-bold">
              TrueTone AI Engine v0.1
            </span>
          </div>
        </div>

        {/* Center: Looping Card Stack */}
        <div className="flex flex-col items-center justify-center my-auto relative py-12 z-10">
          <div className="relative w-80 h-96">
            
            {/* Card 3: Backmost */}
            <div className="absolute inset-0 bg-stone-300 dark:bg-stone-800 rounded-2xl shadow-sm border border-black/5 rotate-6 translate-y-3 translate-x-3 opacity-40 scale-95 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&auto=format&fit=crop&q=80" 
                alt="Room Preview" 
                className="w-full h-full object-cover grayscale"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Card 2: Middle */}
            <div className="absolute inset-0 bg-stone-200 dark:bg-stone-700 rounded-2xl shadow-md border border-black/5 -rotate-3 -translate-y-2 translate-x-1 opacity-70 scale-98 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=80" 
                alt="Room Preview" 
                className="w-full h-full object-cover grayscale"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Card 1: Topmost Animated Card */}
            <motion.div 
              whileHover={{ y: -6, rotate: -1, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="absolute inset-0 bg-white dark:bg-stone-850 rounded-2xl shadow-xl border border-black/5 rotate-1 overflow-hidden group cursor-default"
            >
              <div className="relative w-full h-64 bg-stone-100 overflow-hidden">
                {/* Simulated wall photo */}
                <img 
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80" 
                  alt="Room Canvas" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Color Morph Overlay */}
                <motion.div 
                  animate={{ backgroundColor: PALETTE_COLORS[activeColorIndex].hex }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                  className="absolute inset-0 mix-blend-multiply opacity-65"
                />
                
                {/* Floating pill indicators on the photo */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm dark:bg-black/80 px-2 py-1 rounded-none text-[9px] font-bold tracking-wider uppercase text-text-primary shadow-sm border border-black/5 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: PALETTE_COLORS[activeColorIndex].hex }} />
                  Wall: {PALETTE_COLORS[activeColorIndex].name}
                </div>
              </div>

              {/* Card info below image */}
              <div className="p-4 text-left">
                <div className="text-[10px] font-mono tracking-widest text-brand-terracotta uppercase font-bold mb-1">
                  Style Inspiration
                </div>
                <h4 className="font-display font-bold text-sm text-text-primary leading-tight">
                  Modern Transitional Accent
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-normal">
                  Toggle different color palettes instantly. Find the perfect tone before starting.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Color swatches pulse synced row */}
          <div className="flex items-center gap-2 mt-8">
            {PALETTE_COLORS.map((col, idx) => (
              <div 
                key={col.hex} 
                className="flex flex-col items-center gap-1 cursor-pointer"
                onClick={() => setActiveColorIndex(idx)}
              >
                <motion.div 
                  animate={{ 
                    scale: activeColorIndex === idx ? 1.25 : 1,
                    ring: activeColorIndex === idx ? '2px solid rgba(201, 123, 90, 0.4)' : '0px solid transparent'
                  }}
                  className="w-6 h-6 rounded-full border border-black/10 shadow-sm"
                  style={{ backgroundColor: col.hex }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer info & Social proof rotating quotes */}
        <div className="flex flex-col gap-6 z-10">
          
          {/* Rotating Quote Pill */}
          <div className="h-10 flex items-center">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeQuoteIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.4 }}
                className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm px-4 py-1.5 border border-ink/5 rounded-full inline-flex items-center gap-2 text-xs font-medium text-text-primary shadow-xs"
              >
                <span className="text-brand-terracotta font-semibold">★ 4.9</span>
                <span className="text-text-secondary">“{SOCIAL_QUOTES[activeQuoteIndex].text}”</span>
                <span className="text-[10px] text-text-primary font-bold font-mono">— {SOCIAL_QUOTES[activeQuoteIndex].author}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-ink/5">
            <span className="text-[10px] font-semibold tracking-wider uppercase bg-white/40 dark:bg-stone-900/40 border border-ink/5 px-2.5 py-1 text-text-secondary">
              ⚡ Results in 3 seconds
            </span>
            <span className="text-[10px] font-semibold tracking-wider uppercase bg-white/40 dark:bg-stone-900/40 border border-ink/5 px-2.5 py-1 text-text-secondary">
              🎨 100+ color presets
            </span>
            <span className="text-[10px] font-semibold tracking-wider uppercase bg-white/40 dark:bg-stone-900/40 border border-ink/5 px-2.5 py-1 text-text-secondary">
              📱 Works on Mobile
            </span>
          </div>

        </div>

      </section>

      {/* RIGHT COLUMN: Interactive Form Content */}
      <section className="flex flex-col justify-center items-center py-16 px-6 sm:px-12 md:px-16 lg:px-24 bg-white dark:bg-stone-950">
        
        {/* Simple Brand mobile header */}
        <div className="lg:hidden flex items-center justify-between w-full max-w-md mb-8 pb-4 border-b border-ink/5">
          <div className="flex items-center gap-1.5" onClick={() => { setView('landing'); window.location.hash = ''; }}>
            <span className="w-7 h-7 rounded-none bg-brand-terracotta flex items-center justify-center font-display font-bold text-white tracking-tighter text-sm">
              T
            </span>
            <span className="font-display font-bold text-sm text-text-primary">
              TrueTone AI
            </span>
          </div>
          <button 
            onClick={() => { setView('landing'); window.location.hash = ''; }}
            className="text-[10px] font-bold text-brand-terracotta uppercase tracking-wider hover:underline"
          >
            Back Home
          </button>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-6 text-left">
          
          {/* Logo Wordmark */}
          <div className="hidden lg:flex items-center gap-2 cursor-pointer" onClick={() => { setView('landing'); window.location.hash = ''; }}>
            <span className="w-8 h-8 rounded-none bg-brand-terracotta flex items-center justify-center font-display font-bold text-white tracking-tighter text-lg">
              T
            </span>
            <span className="font-display font-bold text-lg tracking-tight text-text-primary">
              TrueTone <span className="text-brand-terracotta">AI</span>
            </span>
          </div>

          {/* Form Header */}
          <div className="flex flex-col gap-1 mt-2">
            <h2 className="font-display font-bold text-2xl text-text-primary tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              {subhead}
            </p>
          </div>

          {/* Embedded Form Body */}
          <div className="mt-2 w-full">
            {children}
          </div>

        </div>

      </section>

    </div>
  );
}
