import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  PenTool, 
  Video, 
  Sliders, 
  Check, 
  ChevronRight, 
  Layers, 
  Monitor, 
  Tablet, 
  Smartphone,
  Eye,
  Camera,
  Compass,
  Zap,
  RotateCcw,
  Download
} from 'lucide-react';

interface RenderFeature {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  caption: string;
  badge: string;
}

const RENDER_FEATURES: RenderFeature[] = [
  {
    id: 'palette',
    title: 'Render plant palettes in one click',
    description: 'Turn a finished palette into a presentation-ready scene without leaving the workspace.',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1000&auto=format&fit=crop&q=80',
    caption: 'The rendering studio · presets, styles and one-click refinement',
    badge: 'Realistic'
  },
  {
    id: 'refine',
    title: 'Refine images from SketchUp or Vectorworks',
    description: 'Drop in an export, add or swap plants, restyle the lighting — keep the geometry you trust.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
    caption: 'Vectorworks integration · automatic plant swap and geometry alignment',
    badge: 'Spring Pass'
  },
  {
    id: 'camera',
    title: 'Place cameras in 3D previews',
    description: 'Walk through a DXF-driven 3D preview of your planting plan and frame the shots that sell the design.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80',
    caption: 'Multi-camera studio · choose angles, focal length, and depth of field',
    badge: '5y Mature'
  },
  {
    id: 'control',
    title: 'Real control, less prompting',
    description: 'Sliders, swatches and plant choices instead of paragraphs of prompts. The designer stays in charge.',
    imageUrl: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1000&auto=format&fit=crop&q=80',
    caption: 'Dynamic sliders · tweak seasonal foliage and volumetric growth on-the-fly',
    badge: 'Golden Hour'
  }
];

const PREVIEW_GALLERY = [
  {
    title: 'Axonometric · labelled palette',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80',
    tag: 'Technical blueprint'
  },
  {
    title: 'Autumn bed · seasonal preview',
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&auto=format&fit=crop&q=80',
    tag: 'October foliage'
  },
  {
    title: 'Winter frost · photoreal pass',
    image: 'https://images.unsplash.com/photo-1485594050903-8e8ee7b071a8?w=600&auto=format&fit=crop&q=80',
    tag: 'Sub-zero simulation'
  },
  {
    title: 'Summer drift · early growth',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&auto=format&fit=crop&q=80',
    tag: 'Year 2 coverage'
  }
];

export default function RendersFeatureView() {
  const [activeTab, setActiveTab] = useState<string>('palette');
  const activeFeature = RENDER_FEATURES.find(f => f.id === activeTab) || RENDER_FEATURES[0];

  // Auto-rotate tabs slowly for dynamic preview effect
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab(prev => {
        const currentIndex = RENDER_FEATURES.findIndex(f => f.id === prev);
        const nextIndex = (currentIndex + 1) % RENDER_FEATURES.length;
        return RENDER_FEATURES[nextIndex].id;
      });
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="renders-suite" className="bg-[#FAFBF9] text-text-primary overflow-hidden border-t border-ink/5 relative grid-blueprint py-24 px-6 md:px-12 lg:px-20">
      
      {/* 1. MAIN RENDERS CONTENT SHOWCASE (MATCHING SCREENSHOT 1) */}
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-12">
        
        {/* Header section */}
        <div className="flex flex-col gap-4 text-left max-w-3xl">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#7C9885] font-mono">
            Renders
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-text-primary leading-[1.1]">
            Real control over your visuals.<br />
            <span className="font-serif italic font-normal text-[#C97B5A]">Less prompting, more designing.</span>
          </h2>
          <p className="text-sm md:text-base text-text-secondary leading-relaxed font-sans max-w-2xl mt-1">
            Generate, refine and present painterly or photoreal scenes directly from your planting work — no rendering pipeline, no fighting with prompts.
          </p>
        </div>

        {/* Bento Grid: Screenshot Mockup vs Tab list */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-4">
          
          {/* Left Column: Interactive Studio Interface Mockup (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col bg-white border border-ink/10 shadow-lg relative overflow-hidden transition-all duration-300">
            
            {/* Mock Editor Top Header Bar */}
            <div className="bg-stone-50 border-b border-ink/5 px-4 py-3 flex items-center justify-between text-[11px] text-text-secondary font-medium font-mono">
              <div className="flex items-center gap-1.5">
                <div className="flex gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                </div>
                <span className="text-text-primary/40 font-mono text-[10px] ml-2">project_studio_canvas_v3.dxf</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-green-50 text-[#7C9885] border border-green-100 rounded-sm text-[9px] font-bold">
                  ● ACTIVE VIEW
                </span>
                <span className="text-text-primary/60">Credits remaining: <b className="text-text-primary font-mono font-bold">148</b></span>
              </div>
            </div>

            {/* Mock Editor UI Layout */}
            <div className="flex flex-grow h-[420px] md:h-[480px] bg-stone-100/50 relative overflow-hidden select-none">
              
              {/* Layout Sidebar: Left (Plant Inventory) */}
              <div className="hidden sm:flex flex-col w-48 bg-white border-r border-ink/5 p-3 shrink-0 text-left overflow-y-auto">
                <span className="text-[9px] uppercase tracking-wider font-mono text-text-secondary font-bold mb-3 flex items-center justify-between">
                  <span>Selected Palette</span>
                  <span className="text-[#C97B5A]">6 species</span>
                </span>
                
                <div className="space-y-2">
                  <div className="p-2 bg-stone-50 border border-ink/10 rounded-sm flex items-center gap-2 text-[11px]">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#7C9885]/80 shrink-0" />
                    <div>
                      <p className="font-bold text-text-primary truncate leading-tight">Domaine du Rayol</p>
                      <p className="text-[9px] text-text-secondary font-mono">Full Sun • Moderate</p>
                    </div>
                  </div>
                  
                  <div className="p-2 border border-ink/5 hover:bg-stone-50 rounded-sm flex items-center gap-2 text-[11px] cursor-pointer">
                    <span className="w-3.5 h-3.5 rounded-full bg-yellow-600/80 shrink-0" />
                    <div>
                      <p className="font-bold text-text-primary truncate leading-tight">Provence Plants</p>
                      <p className="text-[9px] text-text-secondary font-mono">Mediterranean</p>
                    </div>
                  </div>

                  <div className="p-2 border border-ink/5 hover:bg-stone-50 rounded-sm flex items-center gap-2 text-[11px] cursor-pointer">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-700/80 shrink-0" />
                    <div>
                      <p className="font-bold text-text-primary truncate leading-tight">Shade Garden Bed</p>
                      <p className="text-[9px] text-text-secondary font-mono">Partial Shade</p>
                    </div>
                  </div>

                  <div className="p-2 border border-ink/5 hover:bg-stone-50 rounded-sm flex items-center gap-2 text-[11px] cursor-pointer">
                    <span className="w-3.5 h-3.5 rounded-full bg-orange-600/80 shrink-0" />
                    <div>
                      <p className="font-bold text-text-primary truncate leading-tight">Dry Grasses</p>
                      <p className="text-[9px] text-text-secondary font-mono">Drought Hardy</p>
                    </div>
                  </div>
                  
                  <div className="p-2 border border-ink/5 hover:bg-stone-50 rounded-sm flex items-center gap-2 text-[11px] cursor-pointer">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#C97B5A]/80 shrink-0" />
                    <div>
                      <p className="font-bold text-text-primary truncate leading-tight">Coastal Dune</p>
                      <p className="text-[9px] text-text-secondary font-mono">Saline Tolerant</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-3 border-t border-ink/5">
                  <div className="p-2 bg-stone-50 text-[10px] text-text-secondary font-mono flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-[#C97B5A]" />
                    <span>Rendering v2.1.4</span>
                  </div>
                </div>
              </div>

              {/* Main Content Area: Rendering Image Preview Frame */}
              <div className="flex-grow flex flex-col p-3 relative h-full">
                
                {/* Horizontal Tool Tabs inside editor */}
                <div className="flex gap-2 mb-2 bg-white/80 backdrop-blur-md p-1 border border-ink/5 self-start text-[10px] font-bold font-mono text-text-secondary shadow-xs">
                  <span className="px-2 py-1 bg-[#7C9885] text-white">Interactive Preview</span>
                  <span className="px-2 py-1 hover:text-text-primary cursor-pointer">Axonometric</span>
                  <span className="px-2 py-1 hover:text-text-primary cursor-pointer">3D Bed View</span>
                  <span className="px-2 py-1 hover:text-text-primary cursor-pointer text-[#C97B5A] flex items-center gap-0.5">+ Add Preset</span>
                </div>

                {/* Simulated Canvas Image Frame */}
                <div className="flex-grow rounded-sm border border-ink/10 relative overflow-hidden shadow-xs bg-stone-200">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={activeFeature.id}
                      src={activeFeature.imageUrl}
                      alt={activeFeature.title}
                      initial={{ opacity: 0.1, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0.1 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>

                  {/* Seasonal Mode Badges row */}
                  <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                    {['Realistic', 'Spring', 'Golden', '5y Mature'].map((label) => (
                      <span 
                        key={label}
                        className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider shadow-xs border ${
                          activeFeature.badge.toLowerCase().includes(label.toLowerCase().substring(0, 4))
                            ? 'bg-[#C97B5A] text-white border-[#C97B5A]'
                            : 'bg-white/90 text-text-secondary border-ink/5 hover:bg-white'
                        }`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  {/* Refinement instruction input prompt mock */}
                  <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-md p-2.5 border border-ink/10 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <p className="text-[10px] text-text-primary font-mono text-left">
                        <span className="text-text-secondary">REFINE: </span>
                        {activeFeature.badge === 'Golden Hour' 
                          ? 'Swap lavender for catmint, soft golden hour sun' 
                          : activeFeature.badge === '5y Mature'
                          ? 'Increase shrub height to 1.8m, dense summer growth'
                          : 'Tweak lighting to neutral soft afternoon overcast'}
                      </p>
                    </div>
                    <button className="bg-text-primary text-white font-bold text-[9px] uppercase tracking-wider py-1 px-2.5 shrink-0 hover:bg-black transition-colors">
                      Update Image
                    </button>
                  </div>
                </div>

                {/* Prompt feedback and quick action chips */}
                <div className="flex gap-1.5 overflow-x-auto py-1.5 text-[9px] font-bold uppercase tracking-wider text-text-secondary scrollbar-none shrink-0 text-left">
                  <span className="px-2 py-1 bg-white border border-ink/5 hover:border-text-primary cursor-pointer shrink-0">Remove Background</span>
                  <span className="px-2 py-1 bg-white border border-ink/5 hover:border-text-primary cursor-pointer shrink-0">Upscale 4x</span>
                  <span className="px-2 py-1 bg-white border border-ink/5 hover:border-text-primary cursor-pointer shrink-0">Add More Detail</span>
                  <span className="px-2 py-1 bg-white border border-ink/5 hover:border-text-primary cursor-pointer shrink-0">Soften Edges</span>
                </div>

              </div>

              {/* Layout Sidebar: Right (Quality / Parameters) */}
              <div className="hidden md:flex flex-col w-44 bg-white border-l border-ink/5 p-3 shrink-0 text-left font-sans">
                <span className="text-[9px] uppercase tracking-wider font-mono text-text-secondary font-bold mb-3">Engine Controls</span>
                
                <div className="space-y-3 text-[10px]">
                  <div>
                    <span className="text-text-secondary font-medium block mb-1">Render Style</span>
                    <select className="w-full p-1.5 border border-ink/10 rounded-sm font-mono text-[9px] focus:outline-none bg-stone-50">
                      <option>Photoreal Pass (Fine)</option>
                      <option>Watercolor Preset</option>
                      <option>Technical Blueprint</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-text-secondary font-medium block mb-1">Foliage Density</span>
                    <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden relative">
                      <div className="bg-[#7C9885] h-full" style={{ width: '75%' }} />
                    </div>
                  </div>

                  <div>
                    <span className="text-text-secondary font-medium block mb-1">Atmospheric Light</span>
                    <select className="w-full p-1.5 border border-ink/10 rounded-sm font-mono text-[9px] focus:outline-none bg-stone-50">
                      <option>Golden Hour (17:30)</option>
                      <option>Morning Fog (07:00)</option>
                      <option>Direct Midday Sun</option>
                    </select>
                  </div>

                  <div className="pt-2 border-t border-ink/5 mt-2">
                    <span className="text-text-secondary font-medium block mb-1">File Formats</span>
                    <div className="grid grid-cols-2 gap-1 text-[9px] font-mono text-center">
                      <span className="p-1 bg-stone-50 border border-ink/5 text-text-primary font-bold">DXF</span>
                      <span className="p-1 bg-stone-50 border border-ink/5 text-text-primary font-bold">DWG</span>
                      <span className="p-1 bg-stone-50 border border-ink/5 text-text-primary font-bold">PNG</span>
                      <span className="p-1 bg-stone-50 border border-ink/5 text-text-primary font-bold">PDF</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button className="w-full bg-[#C97B5A] hover:bg-[#B26545] text-white py-2 px-1 text-[9px] font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5">
                      <Sparkles className="w-3 h-3" /> Render View
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Simulated caption below mockup frame */}
            <div className="bg-stone-50 border-t border-ink/10 py-3 px-4 text-center text-[10px] text-text-secondary font-medium tracking-wide">
              {activeFeature.caption}
            </div>

          </div>

          {/* Right Column: Stack of 4 Premium Interactive Bento Cards (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3 h-full">
            {RENDER_FEATURES.map((feature) => {
              const isActive = activeTab === feature.id;
              
              // Map icons dynamically
              const getIcon = (id: string) => {
                switch(id) {
                  case 'palette': return <Sparkles className="w-5 h-5" />;
                  case 'refine': return <PenTool className="w-5 h-5" />;
                  case 'camera': return <Video className="w-5 h-5" />;
                  case 'control': return <Sliders className="w-5 h-5" />;
                  default: return <Sparkles className="w-5 h-5" />;
                }
              };

              return (
                <div 
                  key={feature.id}
                  onClick={() => setActiveTab(feature.id)}
                  className={`p-5 text-left border cursor-pointer transition-all duration-300 flex items-start gap-4 ${
                    isActive 
                      ? 'bg-white border-[#7C9885] shadow-md translate-x-1' 
                      : 'bg-white border-ink/10 hover:border-ink/20 hover:shadow-xs'
                  }`}
                >
                  {/* Left Pill/Icon */}
                  <div className={`p-3 shrink-0 rounded-sm ${isActive ? 'bg-green-50 text-[#7C9885]' : 'bg-stone-50 text-text-secondary/70'}`}>
                    {getIcon(feature.id)}
                  </div>

                  {/* Text Details */}
                  <div className="flex-grow flex flex-col gap-1">
                    <h4 className="font-display font-bold text-sm text-text-primary flex items-center justify-between">
                      <span>{feature.title}</span>
                      {isActive && <ChevronRight className="w-4 h-4 text-[#7C9885]" />}
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed font-sans">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom preview gallery rows */}
        <div className="mt-16 pt-8 border-t border-ink/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PREVIEW_GALLERY.map((gal) => (
              <div key={gal.title} className="flex flex-col gap-2.5 text-left group">
                <div className="aspect-[4/3] w-full border border-ink/10 overflow-hidden relative bg-stone-100">
                  <img 
                    src={gal.image} 
                    alt={gal.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-white/95 text-[9px] uppercase tracking-wider px-2 py-1 font-bold border border-ink/5">
                    {gal.tag}
                  </div>
                </div>
                <div className="flex flex-col">
                  <h5 className="font-display font-semibold text-[13px] text-text-primary leading-tight">
                    {gal.title.split(' · ')[0]}
                  </h5>
                  <span className="text-[10px] text-text-secondary font-mono mt-0.5">
                    {gal.title.split(' · ')[1] || 'Simulation Pass'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 2. WORKS WHERE YOU DO SECTION (MATCHING SCREENSHOT 2) */}
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-12 mt-32 pt-20 border-t border-ink/10">
        
        {/* Core compatibility header & graphics row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text content */}
          <div className="lg:col-span-6 flex flex-col gap-5 text-left">
            <div className="w-10 h-10 bg-orange-50 text-[#C97B5A] flex items-center justify-center rounded-sm">
              <Compass className="w-5 h-5" />
            </div>
            
            <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-text-primary leading-[1.2]">
              Works where you do.
            </h3>
            
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-sans space-y-4">
              <span>From the studio Mac to the iPad on site to a tablet in a client meeting — AsterSketch runs in any modern browser, no install required.</span>
              <br /><br />
              <span>Fully compatible with SketchUp, Vectorworks and AutoCAD. Import and export drawings in industry-standard formats.</span>
            </p>

            <div className="flex items-center gap-4 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C9885] bg-green-50 border border-green-100 px-2.5 py-1 flex items-center gap-1.5">
                <Monitor className="w-3 h-3" /> Mac & PC
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C97B5A] bg-orange-50 border border-orange-100 px-2.5 py-1 flex items-center gap-1.5">
                <Tablet className="w-3 h-3" /> iPad OS
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary bg-stone-50 border border-ink/5 px-2.5 py-1 flex items-center gap-1.5">
                <Smartphone className="w-3 h-3" /> Android & iOS
              </span>
            </div>
          </div>

          {/* Right Image content: Device showcase mockup (laptop & tablet on desk) */}
          <div className="lg:col-span-6 border border-ink/10 p-2.5 bg-white shadow-xl relative group">
            <div className="aspect-[16/10] w-full overflow-hidden bg-stone-100 relative">
              <img 
                src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1000&auto=format&fit=crop&q=80" 
                alt="Workspace preview with Mac and iPad"
                className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm border border-ink/10 px-3 py-2 text-[10px] font-mono text-left shadow-sm">
                <span className="text-[#C97B5A] font-bold uppercase tracking-wider">LIVE PREVIEW</span>
                <p className="text-text-primary font-bold mt-0.5">Vectorworks synchronized pass</p>
              </div>
            </div>
          </div>

        </div>

        {/* Compatibility footer layout (matching exact logos in screenshot 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10 border-t border-ink/5 mt-6">
          
          {/* Software compatibility block */}
          <div className="lg:col-span-6 flex flex-col gap-4 text-left">
            <span className="text-[9px] uppercase tracking-[0.15em] font-mono font-bold text-text-secondary/70">
              Software Compatibility
            </span>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              {/* Vectorworks */}
              <div className="flex items-center gap-2 p-3 bg-white border border-ink/10 shadow-xs hover:shadow-sm hover:border-brand-sage/40 transition-all cursor-default">
                <div className="w-6 h-6 bg-stone-100 border border-ink/15 rounded-full flex items-center justify-center text-text-primary font-bold text-[11px] font-mono shrink-0">
                  V
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-primary leading-tight">Vectorworks</p>
                  <span className="text-[8px] text-text-secondary font-mono uppercase font-bold">Native CAD</span>
                </div>
              </div>

              {/* SketchUp */}
              <div className="flex items-center gap-2 p-3 bg-white border border-ink/10 shadow-xs hover:shadow-sm hover:border-[#C97B5A]/40 transition-all cursor-default">
                <div className="w-6 h-6 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-[11px] font-mono shrink-0">
                  S
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-primary leading-tight">SketchUp</p>
                  <span className="text-[8px] text-text-secondary font-mono uppercase font-bold">3D Modeling</span>
                </div>
              </div>

              {/* AutoCAD */}
              <div className="flex items-center gap-2 p-3 bg-white border border-ink/10 shadow-xs hover:shadow-sm hover:border-red-400/40 transition-all cursor-default">
                <div className="w-6 h-6 bg-red-50 border border-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-[11px] font-mono shrink-0">
                  A
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-primary leading-tight">AutoCAD</p>
                  <span className="text-[8px] text-text-secondary font-mono uppercase font-bold">Autodesk 2D</span>
                </div>
              </div>
            </div>
          </div>

          {/* File compatibility block */}
          <div className="lg:col-span-6 flex flex-col gap-4 text-left">
            <span className="text-[9px] uppercase tracking-[0.15em] font-mono font-bold text-text-secondary/70">
              File Compatibility — Import & Export Drawings & 3D Models/Scenes
            </span>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              {/* DWG */}
              <div className="flex items-center gap-2.5 p-3 bg-white border border-ink/10 shadow-xs hover:border-[#7C9885]/30 transition-colors">
                <div className="w-8 h-8 bg-stone-50 border border-ink/10 flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4 text-text-secondary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-primary leading-tight">.DWG File</p>
                  <span className="text-[8px] text-[#7C9885] font-mono uppercase font-bold">2D Vector layout</span>
                </div>
              </div>

              {/* DXF */}
              <div className="flex items-center gap-2.5 p-3 bg-white border border-ink/10 shadow-xs hover:border-[#C97B5A]/30 transition-colors">
                <div className="w-8 h-8 bg-stone-50 border border-ink/10 flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4 text-text-secondary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-primary leading-tight">.DXF Schema</p>
                  <span className="text-[8px] text-[#C97B5A] font-mono uppercase font-bold">Exchange standard</span>
                </div>
              </div>

              {/* DAE */}
              <div className="flex items-center gap-2.5 p-3 bg-white border border-ink/10 shadow-xs hover:border-blue-400/30 transition-colors">
                <div className="w-8 h-8 bg-stone-50 border border-ink/10 flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4 text-text-secondary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-primary leading-tight">.DAE Collada</p>
                  <span className="text-[8px] text-blue-500 font-mono uppercase font-bold">3D Mesh scene</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
