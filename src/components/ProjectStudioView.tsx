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

  // Studio configuration form state
  const [sourceImageBase64, setSourceImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [promptText, setPromptText] = useState('');
  const [stylePreset, setStylePreset] = useState('terracotta');
  const [layoutType, setLayoutType] = useState('full_wall');
  const [imageCount, setImageCount] = useState(1);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

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
      await triggerGeneration({
        sourceImageBase64,
        mimeType,
        promptText,
        stylePreset,
        layoutType,
        imageCount
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
      <div className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Control Panel */}
        <section className="lg:col-span-4 bg-white rounded-none border border-ink/10 p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h3 className="font-display font-semibold text-base text-text-primary">Recolor Controls</h3>
            <p className="text-xs text-text-secondary">Configure room boundaries and color presets.</p>
          </div>

          <hr className="border-ink/5" />

          {/* Photo Uploader Component */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">1. Room Photo *</span>
            {sourceImageBase64 ? (
              <div className="relative aspect-[4/3] rounded-none overflow-hidden group bg-stone-100 border border-ink/10">
                <img 
                  src={sourceImageBase64} 
                  alt="Source Room" 
                  className="w-full h-full object-cover pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="bg-white hover:bg-stone-100 text-text-primary px-4 py-2.5 rounded-none text-[11px] uppercase tracking-wider font-bold cursor-pointer inline-flex items-center gap-1.5 border border-ink/10">
                    <Upload className="w-3.5 h-3.5" /> Replace Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                  </label>
                </div>
              </div>
            ) : (
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={handleDrop}
                className={`aspect-[4/3] rounded-none border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer ${isDraggingOver ? 'border-brand-terracotta bg-brand-terracotta/5' : 'border-ink/20 bg-[#FAFAF8] hover:bg-stone-50'}`}
                onClick={() => document.getElementById('studio-file-input')?.click()}
              >
                <input id="studio-file-input" type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                <div className="w-10 h-10 border border-brand-terracotta/20 bg-brand-terracotta/5 text-brand-terracotta flex items-center justify-center mb-4">
                  <Upload className="w-4 h-4" />
                </div>
                <h5 className="font-display font-semibold text-sm text-text-primary">Upload room image</h5>
                <p className="text-[11px] text-text-secondary mt-1">Drag and drop, or tap to choose file</p>
                <span className="text-[9px] uppercase tracking-wider text-stone-400 mt-2">JPEG, PNG up to 50MB</span>
              </div>
            )}
          </div>

          {/* Preset Chips */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">2. Curated Style Presets</span>
            <div className="grid grid-cols-2 gap-2">
              {([
                { id: 'indian_contemporary', label: 'Indian Contemporary', color: 'bg-[#004B57]' },
                { id: 'western_minimal', label: 'Western Minimal', color: 'bg-[#7C9885]' },
                { id: 'terracotta', label: 'Warm Terracotta', color: 'bg-[#C97B5A]' },
                { id: 'scandinavian_cool', label: 'Scandinavian Cool', color: 'bg-[#5C6F72]' }
              ] as const).map(preset => (
                <button
                  key={preset.id}
                  onClick={() => setStylePreset(preset.id)}
                  className={`p-3 rounded-none border text-left flex flex-col justify-between aspect-[16/10] transition-all relative ${stylePreset === preset.id ? 'border-brand-terracotta bg-brand-terracotta/5 text-text-primary' : 'border-ink/10 hover:bg-stone-50 text-text-secondary'}`}
                >
                  <span className="text-[11px] font-bold leading-tight uppercase tracking-wide">{preset.label}</span>
                  <div className="flex items-center justify-between w-full mt-2 pt-1 border-t border-ink/5">
                    <span className={`w-3.5 h-3.5 rounded-full ${preset.color} shadow-inner`} />
                    {stylePreset === preset.id && <Check className="w-3.5 h-3.5 text-brand-terracotta" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Layout Multiplier */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">3. Wall Layout coverage</span>
            <div className="grid grid-cols-2 gap-2">
              {([
                { id: 'full_wall', label: 'Full Wall', mult: '1.0x' },
                { id: 'accent_wall', label: 'Accent Wall', mult: '1.0x' },
                { id: 'two_tone', label: 'Two-Tone Split', mult: '1.2x' },
                { id: 'comparison', label: 'Side-by-Side', mult: '1.5x' }
              ] as const).map(layout => (
                <button
                  key={layout.id}
                  onClick={() => setLayoutType(layout.id)}
                  className={`px-3 py-2.5 rounded-none border text-[11px] font-bold uppercase tracking-wider flex items-center justify-between transition-all ${layoutType === layout.id ? 'border-brand-terracotta bg-brand-terracotta/5 text-brand-terracotta font-bold' : 'border-ink/10 hover:bg-stone-50 text-text-secondary'}`}
                >
                  <span>{layout.label}</span>
                  <span className="text-[9px] font-bold bg-stone-100 text-stone-500 px-1.5 py-0.5 border border-ink/5">{layout.mult}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom prompts */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">4. Extra Directions (Optional)</span>
            <textarea
              placeholder="e.g. paint the wall deep sage green with matte finishing, keep doors white..."
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full bg-white border border-ink/10 rounded-none px-3 py-2 text-xs focus:border-brand-terracotta focus:outline-none transition-colors"
            />
          </div>

          {/* Errors */}
          {genError && (
            <div className="bg-red-50 text-red-700 text-xs p-4 rounded-none flex items-start gap-2 border border-red-100 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{genError}</span>
            </div>
          )}

          {/* Action Trigger Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !sourceImageBase64}
            className="w-full bg-brand-terracotta hover:bg-brand-terracotta-hover text-white py-4 px-4 rounded-none text-[11px] uppercase tracking-[0.2em] font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Recoloring walls...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Recolor Wall ({getCreditCost()} credits)
              </>
            )}
          </button>
        </section>

        {/* Right Side Visual Workplace Tabs */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Studio Canvas Tab */}
          {activeStudioTab === 'studio' && (
            <div className="flex flex-col gap-4">
              {isGenerating ? (
                <div className="bg-white rounded-none border border-ink/10 aspect-[4/3] flex flex-col items-center justify-center text-center p-8 gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-[3px] border-brand-terracotta/20 border-t-brand-terracotta animate-spin" />
                    <Sparkles className="w-5 h-5 text-brand-terracotta absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-display font-semibold text-lg text-text-primary">TrueTone AI is recoloring your room...</h4>
                    <p className="text-xs text-text-secondary max-w-sm leading-relaxed">
                      Our vision engine is isolating visual wall vectors, preserving authentic light source directions, and painting the "{stylePreset.replace('_', ' ')}" presets.
                    </p>
                  </div>
                </div>
              ) : activeGen && activeGen.resultImageUrls.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {/* Before / After Slider Canvas */}
                  <div 
                    ref={containerRef}
                    onMouseMove={handleSliderMouseMove}
                    onTouchMove={handleSliderTouchMove}
                    onMouseDown={() => { isDraggingSlider.current = true; }}
                    onTouchStart={() => { isDraggingSlider.current = true; }}
                    className="slider-wipe-container aspect-[4/3] w-full rounded-none border border-ink/10 cursor-ew-resize bg-stone-100"
                  >
                    {/* Before Image (Raw Upload) */}
                    <img 
                      src={sourceImageBase64 || activeProject?.coverImageUrl} 
                      alt="Before" 
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 text-text-primary text-[10px] uppercase tracking-[0.1em] px-2.5 py-1.5 font-bold border border-ink/10 shadow-sm">
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
                        After: {activeGen.stylePreset.replace('_', ' ')}
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

                  {/* Actions & Palette list for active gen */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-6 rounded-none border border-ink/10">
                    <div className="flex flex-col gap-2 text-left">
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.15em]">Extracted Palette Match</span>
                      <div className="flex items-center gap-2.5 mt-1">
                        {activeGen.colors?.map((col: any) => (
                          <div 
                            key={col.id} 
                            className="w-7 h-7 rounded-full border border-ink/10 cursor-help transform hover:scale-110 transition-transform shadow-inner"
                            style={{ backgroundColor: col.hex }}
                            title={`${col.name} (${col.hex})`}
                          />
                        ))}
                        <span className="text-[11px] text-text-secondary font-medium font-serif italic ml-1">Matched directly to Sherwin-Williams & Benjamin Moore Spectrum</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => triggerDownload(activeGen.resultImageUrls[0])}
                      className="bg-white border border-ink/10 hover:bg-stone-50 text-text-primary text-[10px] uppercase tracking-wider font-bold py-3 px-5 rounded-none flex items-center gap-1.5 shrink-0 transition-colors"
                    >
                      <Download className="w-4 h-4" /> Download High-Res
                    </button>
                  </div>
                </div>
              ) : sourceImageBase64 ? (
                <div className="flex flex-col gap-4">
                  <div className="relative aspect-[4/3] rounded-none overflow-hidden border border-ink/10 bg-stone-100">
                    <img 
                      src={sourceImageBase64} 
                      alt="Uploaded room" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-center font-display p-6 text-sm pointer-events-none">
                      Photo assets loaded. Tap "Recolor Wall" on the left dashboard to generate visuals.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-ink/20 rounded-none aspect-[4/3] flex flex-col items-center justify-center text-center p-8 gap-4">
                  <div className="w-14 h-14 border border-brand-terracotta/20 bg-brand-terracotta/5 text-brand-terracotta flex items-center justify-center">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-1.5 max-w-sm">
                    <h4 className="font-display font-semibold text-base text-text-primary">No visual active</h4>
                    <p className="text-xs text-text-secondary leading-relaxed font-sans">
                      Upload a clean, well-lit photo of your interior space on the left panel, select style presets, and initiate Wall Recolor to build high-end editorial visuals.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Colors Table Tab */}
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
        </section>

      </div>
    </div>
  );
}
