import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store.js';
import { 
  ArrowLeft, Coins, Upload, Sparkles, Image as ImageIcon, Paintbrush, 
  Download, Table, Layers, History, Settings, Check, RefreshCw, Info, AlertCircle
} from 'lucide-react';

export default function ProjectStudioView() {
  const { 
    setView, 
    activeProjectId, 
    activeStudioTab, 
    setStudioTab,
    projects, 
    wallet, 
    generations, 
    isGenerating, 
    isLoadingGenerations,
    triggerGeneration,
    fetchGenerations,
    updateProject
  } = useAppStore();

  const activeProject = projects.find(p => p.id === activeProjectId);

  // Curated Color Library (swatches) and Combinations
  const COLOR_SWATCHES_LIBRARY = [
    { hex: "#F3EFE0", name: "Alabaster White", brandMatch: "Sherwin-Williams - SW 7008", desc: "Warm and timeless soft off-white" },
    { hex: "#004B57", name: "Aegean Teal", brandMatch: "Benjamin Moore - 2136-40", desc: "Deep blue-green jewel accent" },
    { hex: "#C97B5A", name: "Cavern Clay", brandMatch: "Sherwin-Williams - SW 7701", desc: "Earthy southwestern baked terracotta" },
    { hex: "#7C9885", name: "Sage Wisdom", brandMatch: "Benjamin Moore - CSP-775", desc: "Calming botanical soft green" },
    { hex: "#4A4B4C", name: "Iron Ore", brandMatch: "Sherwin-Williams - SW 7069", desc: "Deep rich velvety charcoal black" },
    { hex: "#F4F1EA", name: "Simply White", brandMatch: "Benjamin Moore - OC-117", desc: "Pristine crisp paper white" },
    { hex: "#D2D7DF", name: "Upward Blue", brandMatch: "Sherwin-Williams - SW 6239", desc: "Whisper soft sky blue" },
    { hex: "#5C6F72", name: "Templeton Gray", brandMatch: "Benjamin Moore - HC-161", desc: "Moody slate fjord gray" },
    { hex: "#A89379", name: "Hopsack Sand", brandMatch: "Sherwin-Williams - SW 6109", desc: "Rich toasted warm desert tan" },
    { hex: "#AF272F", name: "Caliente Red", brandMatch: "Benjamin Moore - AF-290", desc: "Bold dramatic premium red" },
    { hex: "#1E2C3F", name: "Naval Navy", brandMatch: "Sherwin-Williams - SW 6244", desc: "Classic deep navy blue" },
    { hex: "#E5A93B", name: "Marigold Ochre", brandMatch: "Sherwin-Williams - SW 6690", desc: "Spicy clay gold marigold" },
  ];

  const COLOR_COMBINATIONS_LIBRARY = [
    {
      title: "Indian Contemporary Core",
      desc: "Rich deep jewel tones paired with warm sandalwoods.",
      colors: [
        { hex: "#004B57", name: "Aegean Teal", brandMatch: "Benjamin Moore - 2136-40" },
        { hex: "#E5A93B", name: "Marigold Ochre", brandMatch: "Sherwin-Williams - SW 6690" },
        { hex: "#F3EFE0", name: "Alabaster White", brandMatch: "Sherwin-Williams - SW 7008" },
        { hex: "#6F4E37", name: "Spiced Cedar", brandMatch: "Benjamin Moore - 2174-20" }
      ]
    },
    {
      title: "Western Minimalist Sanctuary",
      desc: "Calming botanical greens, clean paper whites, and deep slate.",
      colors: [
        { hex: "#7C9885", name: "Sage Wisdom", brandMatch: "Benjamin Moore - CSP-775" },
        { hex: "#F3EFE0", name: "Alabaster White", brandMatch: "Sherwin-Williams - SW 7008" },
        { hex: "#4A4B4C", name: "Iron Ore Charcoal", brandMatch: "Sherwin-Williams - SW 7069" },
        { hex: "#B5B3A9", name: "Stone Gray", brandMatch: "Benjamin Moore - Gray" }
      ]
    },
    {
      title: "Warm Terracotta Clay",
      desc: "Earthy southwest tones, pristine linen and toasted timber.",
      colors: [
        { hex: "#C97B5A", name: "Cavern Clay", brandMatch: "Sherwin-Williams - SW 7701" },
        { hex: "#F4F1EA", name: "Simply White", brandMatch: "Benjamin Moore - OC-117" },
        { hex: "#8E7051", name: "Toasted Oak", brandMatch: "Sherwin-Williams - SW 6081" }
      ]
    },
    {
      title: "Scandinavian Fjord Cool",
      desc: "Crisp ocean breeze blue, cold mist white, and charcoal gray.",
      colors: [
        { hex: "#D2D7DF", name: "Upward Blue", brandMatch: "Sherwin-Williams - SW 6239" },
        { hex: "#FFFFFF", name: "Pure White", brandMatch: "Benjamin Moore - OC-65" },
        { hex: "#5C6F72", name: "Templeton Gray", brandMatch: "Benjamin Moore - HC-161" }
      ]
    }
  ];

  // Studio configuration form state
  const [sourceImageBase64, setSourceImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [promptText, setPromptText] = useState('');
  const [stylePreset, setStylePreset] = useState('terracotta');
  const [layoutType, setLayoutType] = useState('full_wall');
  const [imageCount, setImageCount] = useState(1);
  const [paintFinish, setPaintFinish] = useState('matte');
  const [lighting, setLighting] = useState('natural_daylight');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  // Custom Selection parameters
  const [selectedColor, setSelectedColor] = useState<any | null>({
    hex: "#C97B5A",
    name: "Cavern Clay",
    brandMatch: "Sherwin-Williams - SW 7701",
    desc: "Earthy southwestern baked terracotta"
  });
  const [selectedCombo, setSelectedCombo] = useState<any | null>(null);
  const [libraryTab, setLibraryTab] = useState<'colors' | 'combinations'>('colors');

  // Engine controls
  const [finishType, setFinishType] = useState<string>('Matte');
  const [lightingPreset, setLightingPreset] = useState<string>('Soft Overcast');

  // Before/After comparison wipe state
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingSlider = useRef(false);

  // Settings tab state
  const [editTitle, setEditTitle] = useState(activeProject?.title || '');
  const [editDesc, setEditDesc] = useState(activeProject?.description || '');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    if (activeProjectId) {
      fetchGenerations(activeProjectId);
    }
  }, [activeProjectId]);

  useEffect(() => {
    if (activeProject) {
      setEditTitle(activeProject.title);
      setEditDesc(activeProject.description);
    }
  }, [activeProject]);

  const activeGen = generations[generations.length - 1];

  // Load the cover image or last successful generation's source image on mount/load
  useEffect(() => {
    if (activeProject?.coverImageUrl && !sourceImageBase64) {
      setSourceImageBase64(activeProject.coverImageUrl);
    }
  }, [activeProject, sourceImageBase64]);

  // Handle Drag-and-Drop file uploads
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Only JPEG and PNG room photos are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        const base64 = e.target.result as string;
        setSourceImageBase64(base64);
        setMimeType(file.type);
        setGenError(null);
        
        // Save immediately to backend so it is preserved
        if (activeProjectId) {
          await useAppStore.getState().uploadSourceImage(activeProjectId, base64, file.type);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Calculate credits required
  const getCreditCost = () => {
    let multiplier = 1.0;
    if (layoutType === 'two_tone') multiplier = 1.2;
    if (layoutType === 'comparison') multiplier = 1.5;
    return Math.ceil(imageCount * multiplier);
  };

  const handleGenerate = async () => {
    if (!sourceImageBase64) {
      setGenError("Please upload a room photo first.");
      return;
    }

    const cost = getCreditCost();
    if ((wallet?.balance ?? 0) < cost) {
      setGenError(`Insufficient credits. You need ${cost} credits, but only have ${wallet?.balance ?? 0}. Please purchase more in the Billing tab.`);
      return;
    }

    setGenError(null);
    try {
      // Append paint texture finish and lighting ambiance instructions directly to promptText so Gemini understands the exact physical material properties and environment
      const compoundPrompt = `${promptText ? promptText + '. ' : ''}Required paint texture finish: ${finishType}. Aesthetic lighting ambiance: ${lightingPreset}.`;
      
      await triggerGeneration({
        sourceImageBase64,
        mimeType,
        promptText: compoundPrompt,
        stylePreset,
        layoutType,
        imageCount,
        paintFinish,
        lighting,
        customColor: selectedColor ? {
          name: selectedColor.name,
          hex: selectedColor.hex,
          brandMatch: selectedColor.brandMatch
        } : undefined
      });
      // switch back to Studio tab to see output
      setStudioTab('studio');
    } catch (e: any) {
      setGenError(e.message || "An unexpected error occurred during recoloring.");
    }
  };

  // Slider controls
  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleSliderMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingSlider.current) return;
    handleSliderMove(e.clientX);
  };

  const handleSliderTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingSlider.current) return;
    handleSliderMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleUp = () => { isDraggingSlider.current = false; };
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, []);

  // Update settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProjectId || !editTitle.trim()) return;

    setIsSavingSettings(true);
    await updateProject(activeProjectId, {
      title: editTitle.trim(),
      description: editDesc.trim()
    });
    setIsSavingSettings(false);
    alert("Project details updated successfully.");
  };

  // Download image helper
  const triggerDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `TrueTone_AI_${activeProject?.title.replace(/\s+/g, '_') || 'output'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col selection:bg-brand-terracotta/20 selection:text-brand-terracotta" id="project_studio">
      
      {/* Studio Top Navigation */}
      <header className="sticky top-0 z-40 w-full bg-[#FAFAF8]/95 backdrop-blur-md border-b border-ink/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('dashboard')}
            className="p-2 rounded-none border border-ink/10 hover:bg-stone-100 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.15em]">Project Studio</span>
            <h2 className="font-display font-semibold text-lg text-text-primary leading-tight">{activeProject?.title || 'Loading Project...'}</h2>
          </div>
        </div>

        {/* Studio Tabs Header */}
        <div className="hidden md:flex bg-stone-100 p-1 rounded-none border border-ink/10">
          <button 
            onClick={() => setStudioTab('studio')}
            className={`px-4 py-2 rounded-none text-[10px] uppercase tracking-[0.15em] font-bold transition-all flex items-center gap-1.5 ${activeStudioTab === 'studio' ? 'bg-white text-text-primary border border-ink/5 shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Studio
          </button>
          <button 
            onClick={() => setStudioTab('colors')}
            className={`px-4 py-2 rounded-none text-[10px] uppercase tracking-[0.15em] font-bold transition-all flex items-center gap-1.5 ${activeStudioTab === 'colors' ? 'bg-white text-text-primary border border-ink/5 shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <Table className="w-3.5 h-3.5" /> Colors Table
          </button>
          <button 
            onClick={() => setStudioTab('combinations')}
            className={`px-4 py-2 rounded-none text-[10px] uppercase tracking-[0.15em] font-bold transition-all flex items-center gap-1.5 ${activeStudioTab === 'combinations' ? 'bg-white text-text-primary border border-ink/5 shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <Paintbrush className="w-3.5 h-3.5" /> Presets
          </button>
          <button 
            onClick={() => setStudioTab('layouts')}
            className={`px-4 py-2 rounded-none text-[10px] uppercase tracking-[0.15em] font-bold transition-all flex items-center gap-1.5 ${activeStudioTab === 'layouts' ? 'bg-white text-text-primary border border-ink/5 shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <Layers className="w-3.5 h-3.5" /> Layouts
          </button>
          <button 
            onClick={() => setStudioTab('history')}
            className={`px-4 py-2 rounded-none text-[10px] uppercase tracking-[0.15em] font-bold transition-all flex items-center gap-1.5 ${activeStudioTab === 'history' ? 'bg-white text-text-primary border border-ink/5 shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <History className="w-3.5 h-3.5" /> History
          </button>
          <button 
            onClick={() => setStudioTab('settings')}
            className={`px-4 py-2 rounded-none text-[10px] uppercase tracking-[0.15em] font-bold transition-all flex items-center gap-1.5 ${activeStudioTab === 'settings' ? 'bg-white text-text-primary border border-ink/5 shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>
        </div>

        {/* Credit Meter */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView('billing')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-brand-terracotta/20 bg-brand-terracotta/5 text-brand-terracotta rounded-none text-xs font-bold uppercase tracking-wider hover:bg-brand-terracotta/10 transition-colors"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>{wallet?.balance ?? 0} Credits</span>
          </button>
        </div>
      </header>

      {/* Mobile Tabs Bar */}
      <div className="md:hidden w-full bg-white border-b border-ink/10 p-2 overflow-x-auto flex gap-2">
        {([
          { id: 'studio', label: 'Studio', icon: Sparkles },
          { id: 'colors', label: 'Colors', icon: Table },
          { id: 'combinations', label: 'Presets', icon: Paintbrush },
          { id: 'layouts', label: 'Layouts', icon: Layers },
          { id: 'history', label: 'History', icon: History },
          { id: 'settings', label: 'Settings', icon: Settings }
        ] as const).map(tab => (
          <button 
            key={tab.id}
            onClick={() => setStudioTab(tab.id)}
            className={`px-3 py-1.5 rounded-none border text-[10px] uppercase tracking-wider font-bold shrink-0 inline-flex items-center gap-1 ${activeStudioTab === tab.id ? 'border-brand-terracotta bg-brand-terracotta/5 text-brand-terracotta' : 'border-ink/10 text-text-secondary'}`}
          >
            <tab.icon className="w-3 h-3" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Main Studio Split Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-6" id="studio_workspace_root">
        {activeStudioTab === 'studio' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* 1. LEFT PANEL: Color Libraries & Combinations (lg:col-span-3) */}
            <aside className="lg:col-span-3 bg-white border border-ink/10 p-5 flex flex-col gap-5 text-left h-[620px] overflow-y-auto shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-[0.2em] font-mono font-bold text-brand-terracotta">Aesthetic Specs</span>
                <h4 className="font-display font-semibold text-base text-text-primary">Color Libraries</h4>
                <p className="text-[11px] text-text-secondary leading-relaxed">Select swatches or pre-matched combinations to repaint room surfaces.</p>
              </div>

              {/* Tab Switcher inside Sidebar */}
              <div className="grid grid-cols-2 border border-ink/10 p-1 bg-stone-50 text-[10px] uppercase tracking-wider font-bold">
                <button
                  type="button"
                  onClick={() => setLibraryTab('colors')}
                  className={`py-1.5 text-center transition-all ${libraryTab === 'colors' ? 'bg-white border border-ink/5 shadow-xs text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  Swatches
                </button>
                <button
                  type="button"
                  onClick={() => setLibraryTab('combinations')}
                  className={`py-1.5 text-center transition-all ${libraryTab === 'combinations' ? 'bg-white border border-ink/5 shadow-xs text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  Combos
                </button>
              </div>

              {/* Tab Content 1: Individual Color Swatches */}
              {libraryTab === 'colors' && (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-3 gap-2">
                    {COLOR_SWATCHES_LIBRARY.map((swatch) => {
                      const isSelected = selectedColor?.hex === swatch.hex;
                      return (
                        <button
                          key={swatch.hex}
                          type="button"
                          onClick={() => {
                            setSelectedColor(swatch);
                            setSelectedCombo(null);
                            setStylePreset('custom');
                          }}
                          className={`aspect-square w-full border flex flex-col items-center justify-center p-1 transition-all relative group ${isSelected ? 'border-brand-terracotta bg-brand-terracotta/5' : 'border-ink/10 hover:border-ink/20 hover:bg-stone-50'}`}
                          title={`${swatch.name} — ${swatch.brandMatch}`}
                        >
                          <div className="w-full h-full shadow-inner border border-ink/5" style={{ backgroundColor: swatch.hex }} />
                          <span className="text-[8px] font-bold tracking-tight text-text-primary truncate w-full mt-1 uppercase text-center">
                            {swatch.name.split(' ')[0]}
                          </span>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 bg-brand-terracotta text-white rounded-full p-0.5 shadow-xs">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Selected Swatch Details */}
                  {selectedColor && (
                    <div className="mt-3 p-3 bg-stone-50 border border-ink/10 flex flex-col gap-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border border-ink/10" style={{ backgroundColor: selectedColor.hex }} />
                        <span className="text-[11px] font-bold text-text-primary uppercase tracking-wide">{selectedColor.name}</span>
                      </div>
                      <p className="text-[9px] text-text-secondary font-mono leading-none mt-1">{selectedColor.brandMatch}</p>
                      <p className="text-[10px] text-text-secondary leading-relaxed mt-1 font-serif italic">"{selectedColor.desc}"</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content 2: Coordinated Combinations */}
              {libraryTab === 'combinations' && (
                <div className="flex flex-col gap-4">
                  {COLOR_COMBINATIONS_LIBRARY.map((combo, index) => {
                    const isSelected = selectedCombo?.title === combo.title;
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedCombo(combo);
                          setSelectedColor(combo.colors[0]); // Anchor around primary swatch
                          setStylePreset('custom');
                        }}
                        className={`p-3.5 border text-left flex flex-col gap-3 transition-all cursor-pointer ${isSelected ? 'border-brand-terracotta bg-brand-terracotta/5' : 'border-ink/10 hover:border-ink/20 hover:bg-stone-50'}`}
                      >
                        <div className="flex flex-col gap-1">
                          <h5 className="font-display font-bold text-xs text-text-primary flex items-center justify-between">
                            <span>{combo.title}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-brand-terracotta stroke-[2.5]" />}
                          </h5>
                          <p className="text-[10px] text-text-secondary leading-tight">{combo.desc}</p>
                        </div>

                        {/* Combos Swatches Bar */}
                        <div className="flex gap-1">
                          {combo.colors.map((c, idx) => (
                            <div
                              key={idx}
                              className="flex-1 aspect-square border border-ink/5 hover:scale-105 transition-transform"
                              style={{ backgroundColor: c.hex }}
                              title={`${c.name} (${c.hex})`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Active Selection Spec Info Card */}
              <div className="mt-auto pt-3 border-t border-ink/10">
                <div className="p-3 bg-brand-sage/5 border border-brand-sage/20 text-text-secondary flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-brand-sage">Active Paint Target</span>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border border-ink/10 shadow-inner" style={{ backgroundColor: selectedColor?.hex || '#C97B5A' }} />
                    <span className="text-[10px] font-bold text-text-primary uppercase tracking-wider">{selectedColor?.name || 'Warm Terracotta'}</span>
                  </div>
                  <span className="text-[8px] font-mono leading-none text-stone-400">{selectedColor?.brandMatch || 'Sherwin-Williams Cavern Clay'}</span>
                </div>
              </div>
            </aside>

            {/* 2. MIDDLE PANEL: Active Visual Studio Canvas & Wipe Slider (lg:col-span-6) */}
            <main className="lg:col-span-6 flex flex-col gap-4">
              
              <div className="bg-stone-50 border border-ink/10 p-2.5 flex items-center justify-between text-[11px] text-text-secondary font-medium font-mono">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  </div>
                  <span className="text-text-primary/40 font-mono text-[10px] ml-2">visual_render_canvas.png</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-green-50 text-brand-sage border border-brand-sage/20 rounded-sm text-[9px] font-bold uppercase tracking-wider">
                    ● interactive
                  </span>
                </div>
              </div>

              {/* Core Canvas Window */}
              <div className="bg-white border border-ink/10 relative overflow-hidden transition-all duration-300">
                {isGenerating ? (
                  <div className="aspect-[4/3] w-full flex flex-col items-center justify-center text-center p-8 gap-4 bg-stone-50">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-[3px] border-brand-terracotta/20 border-t-brand-terracotta animate-spin" />
                      <Sparkles className="w-5 h-5 text-brand-terracotta absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="font-display font-semibold text-base text-text-primary">TrueTone AI is rendering your room...</h4>
                      <p className="text-xs text-text-secondary max-w-sm leading-relaxed mx-auto">
                        Our vision engine is isolating architectural wall surfaces, calibrating shadows, and applying "{selectedColor?.name || 'custom'}" paint coats dynamically.
                      </p>
                    </div>
                  </div>
                ) : activeGen && activeGen.resultImageUrls.length > 0 ? (
                  <div className="flex flex-col">
                    {/* Before / After Slider Canvas */}
                    <div 
                      ref={containerRef}
                      onMouseMove={handleSliderMouseMove}
                      onTouchMove={handleSliderTouchMove}
                      onMouseDown={() => { isDraggingSlider.current = true; }}
                      onTouchStart={() => { isDraggingSlider.current = true; }}
                      className="slider-wipe-container aspect-[4/3] w-full cursor-ew-resize bg-stone-100 relative"
                    >
                      {/* Before Image */}
                      <img 
                        src={sourceImageBase64 || activeProject?.coverImageUrl || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80"} 
                        alt="Before" 
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-white/95 text-text-primary text-[10px] uppercase tracking-[0.1em] px-2.5 py-1.5 font-bold border border-ink/10 shadow-sm z-10">
                        Before
                      </div>

                      {/* After Image (Recolored) */}
                      <div 
                        className="absolute inset-0 overflow-hidden pointer-events-none"
                        style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
                      >
                        <img 
                          src={activeGen.resultImageUrls[0]} 
                          alt="After" 
                          className="absolute inset-0 w-full h-full object-cover max-w-none pointer-events-none"
                          style={{ width: containerRef.current?.getBoundingClientRect().width }}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 right-4 bg-brand-terracotta text-white text-[10px] uppercase tracking-[0.1em] px-2.5 py-1.5 font-bold border border-brand-terracotta/10 shadow-sm">
                          After: {selectedColor?.name || activeGen.stylePreset.replace('_', ' ')}
                        </div>
                      </div>

                      {/* Slider Drag Bar */}
                      <div 
                        className="slider-handle"
                        style={{ left: `${sliderPos}%` }}
                      >
                        <div className="w-8 h-8 rounded-full bg-white border border-ink/10 shadow-md flex items-center justify-center text-text-primary font-serif italic text-xs select-none">
                          ↔
                        </div>
                      </div>
                    </div>

                    {/* Palette details & download under canvas */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border-t border-ink/10">
                      <div className="flex flex-col gap-1 text-left">
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.15em]">Applied Spectrums</span>
                        <div className="flex items-center gap-2 mt-1">
                          {activeGen.colors?.map((col: any) => (
                            <div 
                              key={col.id} 
                              className="w-6 h-6 border border-ink/10 cursor-help"
                              style={{ backgroundColor: col.hex }}
                              title={`${col.name} (${col.hex}) — ${col.brandMatch}`}
                            />
                          ))}
                          <span className="text-[10px] text-text-secondary font-serif italic ml-1">Matched to Commercial Pigments</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => triggerDownload(activeGen.resultImageUrls[0])}
                        className="bg-white border border-ink/10 hover:bg-stone-50 text-text-primary text-[10px] uppercase tracking-wider font-bold py-2 px-4 rounded-none flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" /> Download High-Res
                      </button>
                    </div>
                  </div>
                ) : sourceImageBase64 ? (
                  <div className="relative aspect-[4/3] rounded-none overflow-hidden bg-stone-100">
                    <img 
                      src={sourceImageBase64} 
                      alt="Uploaded room" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center font-display p-6">
                      <span className="px-3 py-1 bg-brand-terracotta text-white font-bold text-[10px] uppercase tracking-widest border border-brand-terracotta/20 mb-3 animate-pulse">Ready for simulation</span>
                      <p className="text-sm font-semibold max-w-sm leading-relaxed">
                        Specify extra design intentions or finishes and tap "Recolor Wall" on the right panel.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#FAFAF8] border-2 border-dashed border-ink/20 aspect-[4/3] flex flex-col items-center justify-center text-center p-8 gap-4">
                    <div className="w-14 h-14 border border-brand-terracotta/20 bg-brand-terracotta/5 text-brand-terracotta flex items-center justify-center">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-1.5 max-w-sm mx-auto">
                      <h4 className="font-display font-semibold text-base text-text-primary">No visual active</h4>
                      <p className="text-xs text-text-secondary leading-relaxed font-sans">
                        Upload a clean photo of your interior space in the right panel, choose your color palette from the libraries, and trigger generation.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Refinement Prompt Directions Box (Matching prompt bar in RendersFeatureView.tsx) */}
              <div className="bg-white border border-ink/10 p-4 shadow-sm flex flex-col gap-3 text-left">
                <span className="text-[9px] uppercase tracking-[0.15em] font-mono font-bold text-text-secondary">
                  5. Fine-Tuning Instructions
                </span>
                
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      placeholder="Specify optional directions (e.g. keep windows and doors white, make trim deep charcoal, add satin finish)..."
                      rows={2}
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      className="w-full bg-stone-50 border border-ink/10 rounded-none px-3 py-2 text-xs focus:border-brand-terracotta focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Prompt helper chips */}
              <div className="flex gap-1.5 overflow-x-auto py-1 text-[9px] font-bold uppercase tracking-wider text-text-secondary scrollbar-none text-left">
                <span 
                  onClick={() => setPromptText("Keep trims, window panels and ceiling pristine white.")}
                  className="px-2 py-1 bg-white border border-ink/10 hover:border-text-primary cursor-pointer shrink-0"
                >
                  Keep trim white
                </span>
                <span 
                  onClick={() => setPromptText("Isolate the accent back wall ONLY; leave other surfaces untouched.")}
                  className="px-2 py-1 bg-white border border-ink/10 hover:border-text-primary cursor-pointer shrink-0"
                >
                  Accent Wall Only
                </span>
                <span 
                  onClick={() => setPromptText("Apply clean modern contrast, preserve light fixtures and wood grains.")}
                  className="px-2 py-1 bg-white border border-ink/10 hover:border-text-primary cursor-pointer shrink-0"
                >
                  Preserve woodwork
                </span>
                <span 
                  onClick={() => setPromptText("Tweak paint finish to match satin reflections on existing surfaces.")}
                  className="px-2 py-1 bg-white border border-ink/10 hover:border-text-primary cursor-pointer shrink-0"
                >
                  Accurate shadows
                </span>
              </div>
            </main>

            {/* 3. RIGHT PANEL: Engine Controls & Primary Trigger Action (lg:col-span-3) */}
            <aside className="lg:col-span-3 bg-white border border-ink/10 p-5 flex flex-col gap-5 text-left h-[620px] overflow-y-auto shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-[0.2em] font-mono font-bold text-brand-sage">Engine Controls</span>
                <h4 className="font-display font-semibold text-base text-text-primary">Render Settings</h4>
                <p className="text-[11px] text-text-secondary">Determine coverage layouts, lighting ambiance, and physical surface textures.</p>
              </div>

              <hr className="border-ink/5" />

              {/* 3a. Room Photo Thumbnail & Action */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">1. Source Room Asset *</span>
                {sourceImageBase64 ? (
                  <div className="relative aspect-[16/10] rounded-none overflow-hidden group bg-stone-100 border border-ink/10">
                    <img 
                      src={sourceImageBase64} 
                      alt="Source Room Thumbnail" 
                      className="w-full h-full object-cover pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="bg-white text-text-primary hover:bg-stone-50 px-3 py-1.5 rounded-none text-[9px] uppercase tracking-wider font-bold cursor-pointer border border-ink/10">
                        Swap Photo
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => document.getElementById('engine-file-input')?.click()}
                    className="aspect-[16/10] rounded-none border-2 border-dashed border-ink/20 bg-[#FAFAF8] hover:bg-stone-50 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors"
                  >
                    <input id="engine-file-input" type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                    <Upload className="w-5 h-5 text-brand-terracotta mb-2" />
                    <span className="text-[10px] font-bold text-text-primary uppercase tracking-wide">Upload Photo</span>
                    <span className="text-[8px] text-stone-400 mt-0.5">JPEG, PNG</span>
                  </div>
                )}
              </div>

              {/* 3b. Paint Finish Texture Option */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">2. Paint Finish / Texture</span>
                <select 
                  value={paintFinish}
                  onChange={(e) => setPaintFinish(e.target.value)}
                  className="w-full p-2.5 border border-ink/10 rounded-none font-mono text-[10px] uppercase tracking-wider focus:outline-none bg-stone-50"
                >
                  <option value="matte">Matte (Zero sheen)</option>
                  <option value="eggshell">Eggshell (Soft velvet glow)</option>
                  <option value="satin">Satin (Lustrous residential)</option>
                  <option value="semi_gloss">Semi-Gloss (High durability)</option>
                  <option value="high_gloss">High-Gloss (Mirror finish)</option>
                </select>
              </div>

              {/* 3c. Atmospheric Light Option */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">3. Lighting Environment</span>
                <select 
                  value={lighting}
                  onChange={(e) => setLighting(e.target.value)}
                  className="w-full p-2.5 border border-ink/10 rounded-none font-mono text-[10px] uppercase tracking-wider focus:outline-none bg-stone-50"
                >
                  <option value="natural_daylight">Natural Daylight (Neutral)</option>
                  <option value="soft_overcast">Soft Overcast (Soft)</option>
                  <option value="warm_golden_hour">Golden Hour Sunset (Warm)</option>
                  <option value="cool_evening">Morning Mist Haze (Cool)</option>
                  <option value="studio_strobe">Studio Strobe (Direct)</option>
                </select>
              </div>

              {/* 3d. Layout Coverage Split */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">4. Wall Coverage Layout</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {([
                    { id: 'full_wall', label: 'Full Wall' },
                    { id: 'accent_wall', label: 'Accent Wall' },
                    { id: 'two_tone', label: 'Two-Tone' },
                    { id: 'comparison', label: 'Compare' }
                  ] as const).map(layout => (
                    <button
                      key={layout.id}
                      type="button"
                      onClick={() => setLayoutType(layout.id)}
                      className={`px-2 py-2 rounded-none border text-[9px] font-bold uppercase tracking-wider text-center transition-all ${layoutType === layout.id ? 'border-brand-terracotta bg-brand-terracotta/5 text-brand-terracotta' : 'border-ink/10 hover:bg-stone-50 text-text-secondary'}`}
                    >
                      {layout.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error messages display */}
              {genError && (
                <div className="bg-red-50 text-red-700 text-[11px] p-3 rounded-none flex items-start gap-1.5 border border-red-100 leading-relaxed">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  <span>{genError}</span>
                </div>
              )}

              {/* 3e. Big Recolor Action trigger button at the bottom of Right Column */}
              <div className="mt-auto pt-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || !sourceImageBase64}
                  className="w-full bg-brand-terracotta hover:bg-brand-terracotta-hover disabled:bg-stone-200 disabled:text-stone-400 text-white py-3 px-3 rounded-none text-[10px] uppercase tracking-[0.2em] font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Rendering...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> Recolor Wall ({getCreditCost()} Cr)
                    </>
                  )}
                </button>
              </div>
            </aside>

          </div>
        ) : (
          <div className="bg-white border border-ink/10 p-6">
            {/* Display static tabs if clicked separately */}
          {activeStudioTab === 'colors' && (
            <div className="bg-white rounded-none border border-ink/10 p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1 text-left pb-3 border-b border-ink/5">
                <h3 className="font-display font-normal text-xl text-text-primary">Extracted Palette Match Table</h3>
                <p className="text-xs text-text-secondary">Official commercial matches queried against active pigment libraries.</p>
              </div>

              {activeGen && activeGen.colors && activeGen.colors.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-ink/10 text-text-secondary font-bold uppercase tracking-[0.15em] text-[10px]">
                        <th className="py-3 px-2">Swatch</th>
                        <th className="py-3 px-2">Color Name</th>
                        <th className="py-3 px-2">HEX</th>
                        <th className="py-3 px-2">RGB</th>
                        <th className="py-3 px-2">Commercial Paint Match</th>
                        <th className="py-3 px-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5 font-medium font-mono text-text-secondary">
                      {activeGen.colors.map((col: any) => (
                        <tr key={col.id} className="hover:bg-stone-50 transition-colors">
                          <td className="py-4 px-2">
                            <div className="w-10 h-10 rounded-none border border-ink/10 shadow-inner" style={{ backgroundColor: col.hex }} />
                          </td>
                          <td className="py-4 px-2 font-bold font-sans text-text-primary text-sm">{col.name}</td>
                          <td className="py-4 px-2">{col.hex}</td>
                          <td className="py-4 px-2">{col.rgb}</td>
                          <td className="py-4 px-2 font-sans italic text-text-primary">{col.brandMatch}</td>
                          <td className="py-4 px-2 text-right">
                            <button
                              onClick={() => {
                                setPromptText(`Re-paint using specific color: ${col.name} (${col.hex}) matched to ${col.brandMatch}`);
                                setStudioTab('studio');
                              }}
                              className="border border-brand-terracotta/20 bg-brand-terracotta/5 hover:bg-brand-terracotta/10 text-brand-terracotta px-3.5 py-2 rounded-none font-bold text-[10px] uppercase tracking-wider transition-colors"
                            >
                              Apply
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-16 text-center text-xs text-text-secondary font-serif italic">
                  No active spectrum matches found. Execute "Recolor Wall" to extract swatches.
                </div>
              )}
            </div>
          )}

          {/* Combinations / Popular Presets Tab */}
          {activeStudioTab === 'combinations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Indian Contemporary Core",
                  desc: "Vibrant and rich accents for cultural depth.",
                  colors: [
                    { hex: "#004B57", label: "Aegean Teal" },
                    { hex: "#E5A93B", label: "Ochre Marigold" },
                    { hex: "#EBE3CD", label: "Ivory Sandal" },
                    { hex: "#6F4E37", label: "Spiced Cedar" }
                  ]
                },
                {
                  title: "Western Minimal Sanctuary",
                  desc: "Clean, calming sage and linen combinations.",
                  colors: [
                    { hex: "#7C9885", label: "Sage Wisdom" },
                    { hex: "#F3EFE0", label: "Warm Linen" },
                    { hex: "#4A4B4C", label: "Iron Ore Charcoal" }
                  ]
                },
                {
                  title: "Terracotta Earth Tones",
                  desc: "Cozy desert sunset elements with warm clays.",
                  colors: [
                    { hex: "#C97B5A", label: "Cavern Clay" },
                    { hex: "#F4F1EA", label: "White Linen" },
                    { hex: "#8E7051", label: "Toasted Oak" }
                  ]
                },
                {
                  title: "Scandinavian Breeze",
                  desc: "Fresh cool mist blue with artic blank slate.",
                  colors: [
                    { hex: "#D2D7DF", label: "Mist Blue" },
                    { hex: "#FFFFFF", label: "Arctic White" },
                    { hex: "#5C6F72", label: "Fjord Gray" }
                  ]
                }
              ].map((combo, i) => (
                <div key={i} className="bg-white rounded-none border border-ink/10 p-6 flex flex-col gap-6 text-left">
                  <div className="flex flex-col">
                    <h4 className="font-display font-semibold text-base text-text-primary">{combo.title}</h4>
                    <p className="text-xs text-text-secondary mt-1">{combo.desc}</p>
                  </div>
                  
                  {/* Swatch sequence bar */}
                  <div className="flex gap-2 w-full pt-1">
                    {combo.colors.map((c, j) => (
                      <div key={j} className="flex-1 flex flex-col gap-1">
                        <div className="aspect-square w-full rounded-none border border-ink/10 shadow-inner" style={{ backgroundColor: c.hex }} />
                        <span className="text-[10px] text-text-secondary truncate text-center font-bold uppercase tracking-wider mt-1">{c.label}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setPromptText(`Apply complete coordinated palette: ${combo.colors.map(c => `${c.label} (${c.hex})`).join(', ')}`);
                      setStudioTab('studio');
                    }}
                    className="w-full bg-[#FAFAF8] hover:bg-stone-100 border border-ink/10 text-text-primary text-[11px] uppercase tracking-wider font-bold py-2.5 rounded-none transition-colors mt-2"
                  >
                    Load Palette Into Studio
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Layout Configuration Tab */}
          {activeStudioTab === 'layouts' && (
            <div className="bg-white rounded-none border border-ink/10 p-6 flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1 pb-3 border-b border-ink/5">
                <h3 className="font-display font-normal text-xl text-text-primary">Wall Layout Customizer</h3>
                <p className="text-xs text-text-secondary">Determine surface division layouts to optimize accent distributions.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {[
                  { id: 'full_wall', label: 'Full Wall Painting', desc: 'Applies paint colors completely to all wall surface boundaries.', cost: '1x standard cost' },
                  { id: 'accent_wall', label: 'Accent Focal Wall', desc: 'Paints only the main background or feature wall as a contrast.', cost: '1x standard cost' },
                  { id: 'two_tone', label: 'Two-Tone Horizontal', desc: 'Splits walls into upper and lower zones with complementary shades.', cost: '1.2x multiplier' },
                  { id: 'comparison', label: 'Side-by-Side Comparison', desc: 'Renders multiple colors on separate columns for comparison.', cost: '1.5x multiplier' }
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => { setLayoutType(l.id); setStudioTab('studio'); }}
                    className={`p-5 rounded-none border text-left flex flex-col justify-between gap-4 transition-all ${layoutType === l.id ? 'border-brand-terracotta bg-brand-terracotta/5' : 'border-ink/10 hover:bg-stone-50'}`}
                  >
                    <div>
                      <h5 className={`font-display font-bold text-sm ${layoutType === l.id ? 'text-brand-terracotta' : 'text-text-primary'}`}>{l.label}</h5>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">{l.desc}</p>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-brand-sage bg-brand-sage/10 px-2 py-0.5 border border-brand-sage/20 max-w-fit">{l.cost}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* History Log Tab */}
          {activeStudioTab === 'history' && (
            <div className="bg-white rounded-none border border-ink/10 p-6 flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1 pb-3 border-b border-ink/5">
                <h3 className="font-display font-normal text-xl text-text-primary">Generation History</h3>
                <p className="text-xs text-text-secondary">Chronological record of visualization outputs in this space.</p>
              </div>

              {generations.length === 0 ? (
                <div className="py-16 text-center text-xs text-text-secondary font-serif italic">
                  No visual history logs found. Trigger a generation on the left.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generations.map((gen, i) => (
                    <div key={gen.id} className="border border-ink/10 rounded-none overflow-hidden p-4 flex flex-col gap-4 hover:bg-stone-50 transition-colors">
                      <div className="relative aspect-video rounded-none overflow-hidden bg-stone-100 border border-ink/5">
                        {gen.resultImageUrls[0] && (
                          <img 
                            src={gen.resultImageUrls[0]} 
                            alt="Output" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                      <div className="flex flex-col text-xs text-left gap-2">
                        <div className="flex justify-between items-baseline font-bold text-text-primary border-b border-ink/5 pb-1">
                          <span className="uppercase tracking-wider text-[10px] text-brand-terracotta">{gen.stylePreset.replace('_', ' ')} Preset</span>
                          <span className="text-[10px] text-text-secondary font-mono">{new Date(gen.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-text-secondary font-serif italic line-clamp-1">"{gen.promptText || "No custom prompt directions."}"</p>
                        
                        <div className="flex justify-between items-center pt-3 border-t border-ink/5 mt-1">
                          <div className="flex gap-1">
                            {gen.colors?.map((col: any) => (
                              <div key={col.id} className="w-5 h-5 rounded-full border border-ink/10" style={{ backgroundColor: col.hex }} title={col.name} />
                            ))}
                          </div>
                          
                          <button
                            onClick={() => {
                              // restore states
                              setSourceImageBase64(activeProject?.coverImageUrl || null);
                              setPromptText(gen.promptText);
                              setStylePreset(gen.stylePreset);
                              setLayoutType(gen.layoutType);
                              setStudioTab('studio');
                            }}
                            className="text-brand-terracotta hover:text-brand-terracotta-hover text-[10px] uppercase tracking-wider font-bold"
                          >
                            Restore
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Project Settings Tab */}
          {activeStudioTab === 'settings' && (
            <div className="bg-white rounded-none border border-ink/10 p-6 flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1 pb-3 border-b border-ink/5">
                <h3 className="font-display font-normal text-xl text-text-primary">Project Settings</h3>
                <p className="text-xs text-text-secondary">Rename or update descriptions for this design project.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="flex flex-col gap-5 max-w-md pt-2">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Project Title *</label>
                  <input 
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-white border border-ink/10 rounded-none px-4 py-3 text-xs focus:border-brand-terracotta focus:outline-none uppercase tracking-wider font-semibold placeholder:text-stone-300"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Description</label>
                  <textarea 
                    rows={3}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full bg-white border border-ink/10 rounded-none px-4 py-3 text-xs focus:border-brand-terracotta focus:outline-none placeholder:text-stone-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="bg-brand-terracotta hover:bg-brand-terracotta-hover text-white py-3 px-6 rounded-none text-[10px] uppercase tracking-widest font-bold transition-all disabled:opacity-50 max-w-fit shadow-sm"
                >
                  {isSavingSettings ? 'Saving...' : 'Save Settings'}
                </button>
              </form>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
}
