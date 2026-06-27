import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store.js';
import { 
  Home, Bed, Utensils, Bath, Briefcase, Plus, 
  Upload, Sparkles, ArrowLeft, ArrowRight, Check, ShieldAlert, Image as ImageIcon 
} from 'lucide-react';

const SPACES = [
  { id: 'living', label: 'Living Room', icon: Home, desc: 'Lounges, family areas & dens' },
  { id: 'bedroom', label: 'Bedroom', icon: Bed, desc: 'Master suites & guest rooms' },
  { id: 'kitchen', label: 'Kitchen', icon: Utensils, desc: 'Culinary spaces & islands' },
  { id: 'bathroom', label: 'Bathroom', icon: Bath, desc: 'Powder rooms & master baths' },
  { id: 'office', label: 'Office', icon: Briefcase, desc: 'Studies & workspaces' },
  { id: 'other', label: 'Other Space', icon: Plus, desc: 'Exteriors, hallways & garage' }
];

const STYLES = [
  { 
    id: 'contemporary', 
    title: 'Indian Contemporary', 
    swatches: ['#C97B5A', '#E5A93C', '#844D34', '#3E5540'], 
    swatchNames: ['Terracotta', 'Clay Ochre', 'Red Sandalwood', 'Green Tea Leaf'],
    desc: 'Warm earthy ochres, rich spicy jewel tones, intricately balanced traditional patterns.' 
  },
  { 
    id: 'minimal', 
    title: 'Western Minimal', 
    swatches: ['#F3F1EC', '#8A9A86', '#4C585B', '#1B2426'], 
    swatchNames: ['Stone Alabaster', 'Washed Sage', 'Slate Gray', 'Noir Pine'],
    desc: 'Cool plaster whites, calming stone, muted botanical elements, and spacious negative voids.' 
  }
];

export default function OnboardingView() {
  const { updateProfile, createProject, uploadSourceImage, setView } = useAppStore();
  const [step, setStep] = useState(1);
  
  // Selections
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<'contemporary' | 'minimal' | 'both' | null>(null);
  
  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadConfirmed, setUploadConfirmed] = useState(false);

  // Credit counter count-up state
  const [credits, setCredits] = useState(0);

  // Effect for count-up credit animation on Step 4
  useEffect(() => {
    if (step !== 4) return;
    setCredits(0);
    let current = 0;
    const target = 20;
    const duration = 1200; // ms
    const increment = target / (duration / 16); // 60fps
    
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCredits(target);
        clearInterval(interval);
      } else {
        setCredits(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(interval);
  }, [step]);

  // Handle Space multi-select
  const toggleSpace = (id: string) => {
    if (selectedSpaces.includes(id)) {
      setSelectedSpaces(selectedSpaces.filter(x => x !== id));
    } else {
      setSelectedSpaces([...selectedSpaces, id]);
    }
  };

  // Convert uploaded image to Base64
  const handleFileProcess = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }
    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFilePreview(e.target.result as string);
        setUploadConfirmed(true);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  // Final confirmation and sync
  const handleCompleteOnboarding = async () => {
    setIsUploading(true);
    try {
      // 1. Create a project based on user inputs
      const spaceLabel = selectedSpaces.length > 0 
        ? SPACES.find(s => s.id === selectedSpaces[0])?.label 
        : 'Living Room';
      
      const styleName = selectedStyle === 'both' 
        ? 'Contemporary Minimalist Mix' 
        : selectedStyle === 'contemporary' 
          ? 'Indian Contemporary Accent' 
          : 'Western Minimal Space';

      const projectTitle = `${spaceLabel} Studio`;
      const projectDesc = `Custom color concept tailored for ${styleName} aesthetic preference.`;

      const newProj = await createProject(projectTitle, projectDesc);

      // 2. Upload photo (either custom or fallback sample)
      if (newProj) {
        if (filePreview) {
          await uploadSourceImage(newProj.id, filePreview, file?.type || 'image/jpeg');
        } else {
          // Fallback room sample
          const sampleBase64Url = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80";
          await uploadSourceImage(newProj.id, sampleBase64Url, 'image/jpeg');
        }
      }

      // 3. Mark onboardingCompleted = true
      await updateProfile({ onboardingCompleted: true });
      setView('dashboard');
    } catch (e) {
      console.error("Onboarding setup failed", e);
      // Fallback
      await updateProfile({ onboardingCompleted: true });
      setView('dashboard');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div id="onboarding-flow-container" className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6 text-text-primary text-left">
      
      <div className="w-full max-w-2xl bg-white dark:bg-stone-900 border border-ink/10 rounded-none shadow-xl overflow-hidden transition-all flex flex-col justify-between p-8 sm:p-12 min-h-[550px]">
        
        {/* STEPPER HEADER */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-mono font-bold tracking-widest text-brand-terracotta uppercase">
              Onboarding {step} of 4
            </span>
            <div className="flex gap-1.5 w-32 h-1 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              {[1, 2, 3, 4].map((s) => (
                <div 
                  key={s} 
                  className={`h-full flex-1 transition-all duration-300 ${
                    s <= step ? 'bg-brand-terracotta' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h1 className="font-display font-bold text-xl sm:text-2xl text-text-primary tracking-tight">
                    What kind of space are you painting?
                  </h1>
                  <p className="text-xs text-text-secondary mt-1">
                    Select one or multiple spaces you intend to model. This customizes your instant palette presets.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-72 overflow-y-auto pr-1">
                  {SPACES.map((space) => {
                    const isSelected = selectedSpaces.includes(space.id);
                    const IconComp = space.icon;
                    return (
                      <motion.div
                        key={space.id}
                        whileHover={{ scale: 1.015, y: -2 }}
                        onClick={() => toggleSpace(space.id)}
                        className={`border rounded-xl p-4 flex gap-4 items-center cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-brand-terracotta ring-2 ring-brand-terracotta/20 bg-brand-terracotta/5' 
                            : 'border-ink/10 bg-stone-50/50 dark:bg-stone-850 hover:bg-stone-100/50 dark:hover:bg-stone-800'
                        }`}
                      >
                        <div className={`p-2.5 rounded-lg shrink-0 ${isSelected ? 'bg-brand-terracotta text-white' : 'bg-stone-100 dark:bg-stone-800 text-text-secondary'}`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-xs text-text-primary uppercase tracking-wider">{space.label}</h4>
                          <p className="text-[10px] text-text-secondary mt-0.5 leading-normal">{space.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h1 className="font-display font-bold text-xl sm:text-2xl text-text-primary tracking-tight">
                    Which design world feels like home?
                  </h1>
                  <p className="text-xs text-text-secondary mt-1">
                    Choose an aesthetic archetype. We will auto-curate your paint swatches in sync with this theme.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {STYLES.map((style) => {
                    const isSelected = selectedStyle === style.id || selectedStyle === 'both';
                    return (
                      <motion.div
                        key={style.id}
                        whileHover={{ scale: 1.015, y: -2 }}
                        onClick={() => {
                          if (selectedStyle === style.id) {
                            setSelectedStyle(null);
                          } else if (selectedStyle && selectedStyle !== 'both') {
                            setSelectedStyle('both');
                          } else {
                            setSelectedStyle(style.id as any);
                          }
                        }}
                        className={`border rounded-xl p-5 flex flex-col justify-between cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-brand-terracotta ring-2 ring-brand-terracotta/20 bg-brand-terracotta/5' 
                            : 'border-ink/10 bg-stone-50/50 dark:bg-stone-850 hover:bg-stone-100/50 dark:hover:bg-stone-800'
                        }`}
                      >
                        <div className="text-left">
                          <h3 className="font-display font-bold text-sm text-text-primary tracking-tight">
                            {style.title}
                          </h3>
                          <p className="text-[11px] text-text-secondary mt-1.5 leading-relaxed">
                            {style.desc}
                          </p>
                        </div>

                        {/* Color swatches row */}
                        <div className="mt-5">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-text-secondary mb-1.5 block">
                            Curation Palette:
                          </span>
                          <div className="flex gap-2">
                            {style.swatches.map((swatch, idx) => (
                              <div 
                                key={swatch} 
                                className="group/swatch relative"
                              >
                                <div 
                                  className="w-7 h-7 rounded-full border border-black/10 shadow-xs"
                                  style={{ backgroundColor: swatch }}
                                />
                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black text-white text-[8px] font-mono px-1 rounded-sm opacity-0 group-hover/swatch:opacity-100 transition-opacity whitespace-nowrap">
                                  {style.swatchNames[idx]}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h1 className="font-display font-bold text-xl sm:text-2xl text-text-primary tracking-tight">
                    Upload a photo of your room
                  </h1>
                  <p className="text-xs text-text-secondary mt-1">
                    Upload a raw high-resolution picture of your walls. Skip to use our sample master living room card.
                  </p>
                </div>

                {/* Drag-and-drop zone */}
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('onboard-file-input')?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[180px] ${
                    isDragging 
                      ? 'border-brand-terracotta bg-brand-terracotta/5' 
                      : filePreview 
                        ? 'border-green-500 bg-green-50/5 dark:bg-green-950/5' 
                        : 'border-ink/10 hover:border-brand-terracotta/40 hover:bg-stone-50 dark:hover:bg-stone-850'
                  }`}
                >
                  <input 
                    id="onboard-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  
                  {filePreview ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative w-28 h-20 bg-stone-100 rounded-lg overflow-hidden border border-black/10">
                        <img 
                          src={filePreview} 
                          alt="Uploaded room thumbnail" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-green-600 uppercase tracking-wide">
                        ✓ Saved to your first project
                      </span>
                      <span className="text-[10px] text-text-secondary font-mono truncate max-w-xs">
                        {file?.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2.5">
                      <div className="w-12 h-12 rounded-full bg-brand-terracotta/5 border border-brand-terracotta/10 flex items-center justify-center text-brand-terracotta shadow-xs">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <h4 className="font-bold text-xs text-text-primary uppercase tracking-wider">
                          Drop room JPEG/PNG here
                        </h4>
                        <p className="text-[10px] text-text-secondary leading-normal">
                          or click to browse local files (max 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h1 className="font-display font-bold text-xl sm:text-2xl text-text-primary tracking-tight">
                    Your free credits are loaded
                  </h1>
                  <p className="text-xs text-text-secondary mt-1">
                    No credit card is required. Your signing bonus has been deposited into your secure wallet.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 items-center">
                  
                  {/* Credits visual meter */}
                  <div className="sm:col-span-2 bg-gradient-to-br from-[#FDF5F0] to-[#F5EDE8] dark:from-stone-900 dark:to-stone-950 border border-brand-terracotta/20 p-6 flex flex-col items-center justify-center gap-1 shadow-sm h-full min-h-[140px] select-none rounded-2xl">
                    <span className="text-brand-terracotta">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </span>
                    <span className="font-display font-extrabold text-5xl text-brand-terracotta tracking-tighter mt-1">
                      {credits}
                    </span>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-text-secondary uppercase">
                      Bonus Credits
                    </span>
                  </div>

                  {/* Summary / Confirmation recap details */}
                  <div className="sm:col-span-3 text-left flex flex-col gap-3">
                    <h4 className="text-[10px] font-mono font-bold tracking-widest text-text-secondary uppercase">
                      Curation Profile Summary
                    </h4>
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-5 h-5 bg-stone-100 dark:bg-stone-800 text-brand-terracotta rounded-full flex items-center justify-center font-bold">✓</span>
                        <span className="text-text-secondary">Selected:</span>
                        <strong className="text-text-primary font-bold">
                          {selectedSpaces.length > 0 
                            ? selectedSpaces.map(s => SPACES.find(x => x.id === s)?.label).join(', ') 
                            : 'Living Room Space'}
                        </strong>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-5 h-5 bg-stone-100 dark:bg-stone-800 text-brand-terracotta rounded-full flex items-center justify-center font-bold">✓</span>
                        <span className="text-text-secondary">Archetype:</span>
                        <strong className="text-text-primary font-bold">
                          {selectedStyle === 'both' 
                            ? 'Mixed Contemporary & Minimal' 
                            : selectedStyle === 'contemporary' 
                              ? 'Indian Contemporary' 
                              : 'Western Minimal'}
                        </strong>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-5 h-5 bg-stone-100 dark:bg-stone-800 text-brand-terracotta rounded-full flex items-center justify-center font-bold">✓</span>
                        <span className="text-text-secondary">Image:</span>
                        <strong className="text-text-primary font-bold flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-brand-terracotta" />
                          {filePreview ? 'Custom Upload Saved' : 'Sample Cozy Living Room'}
                        </strong>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ACTIONS FOOTER BUTTONS */}
        <div className="mt-8 pt-6 border-t border-ink/10 flex items-center justify-between">
          {step > 1 && step < 4 ? (
            <button
              onClick={() => setStep(step - 1)}
              disabled={isUploading}
              className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-text-primary flex items-center gap-1.5 uppercase tracking-wider transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div /> // spacing placeholder
          )}

          {step < 4 ? (
            <div className="flex items-center gap-3">
              {step === 3 && !filePreview && (
                <button
                  onClick={() => setStep(4)}
                  className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-brand-terracotta uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Skip for now
                </button>
              )}
              <button
                onClick={() => {
                  if (step === 1 && selectedSpaces.length === 0) {
                    setSelectedSpaces(['living']); // select default
                  }
                  if (step === 2 && !selectedStyle) {
                    setSelectedStyle('contemporary'); // select default
                  }
                  setStep(step + 1);
                }}
                className="bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-none transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleCompleteOnboarding}
              disabled={isUploading}
              className="bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-none transition-all flex items-center gap-2 shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 w-full justify-center sm:w-auto"
            >
              {isUploading ? 'Preparing Dashboard...' : 'Open My Dashboard →'}
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
