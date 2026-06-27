import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store.js';
import { 
  User, Shield, ShieldAlert, Download, Trash2, Check, ArrowRight,
  Plus, Coins, Layers, PhoneCall, Mail, ToggleLeft, ToggleRight
} from 'lucide-react';

export default function ProfileView() {
  const { 
    setView, 
    profile, 
    email, 
    wallet, 
    updateProfile, 
    privacyDeletePhotos, 
    privacyExportData 
  } = useAppStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatarUrl || null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [fullName, setFullName] = useState(profile?.fullName || 'Yash Raghuvanshi');
  const [theme, setTheme] = useState(profile?.theme || 'light');
  const [notifEmail, setNotifEmail] = useState(profile?.notifEmail ?? true);
  const [notifProduct, setNotifProduct] = useState(profile?.notifProduct ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAvatarUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const base64 = event.target.result as string;
        setAvatarPreview(base64);
        await updateProfile({ avatarUrl: base64 });
      }
      setIsUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setTheme(profile.theme || 'light');
      setNotifEmail(profile.notifEmail ?? true);
      setNotifProduct(profile.notifProduct ?? true);
      if (profile.avatarUrl) {
        setAvatarPreview(profile.avatarUrl);
      }
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    await updateProfile({
      fullName,
      theme,
      notifEmail,
      notifProduct
    });

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Real, persistent JSON export of user details
  const handleExport = async () => {
    const data = await privacyExportData();
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `TrueTone_AI_Backup_${profile?.fullName.replace(/\s+/g, '_') || 'Export'}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert("Failed to export data backup.");
    }
  };

  const handleErasePhotos = async () => {
    const confirmErase = confirm(
      "CRITICAL PRIVACY ERASE:\nAre you absolutely sure you want to permanently erase all room photos and outputs from our secure systems?\nThis action is completely irreversible and wipes all graphics."
    );
    if (confirmErase) {
      const ok = await privacyDeletePhotos();
      if (ok) {
        alert("Privacy Erase Successful. All uploaded room visuals have been deleted from storage.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col selection:bg-brand-terracotta/20 selection:text-brand-terracotta" id="profile_view">
      
      {/* Header bar */}
      <header className="sticky top-0 z-40 w-full bg-[#FAFAF8]/95 backdrop-blur-md border-b border-ink/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
            <span className="font-display text-xl font-bold tracking-tight text-text-primary">
              TrueTone <span className="font-serif italic font-normal text-brand-terracotta">AI</span>
            </span>
          </div>
          <span className="text-[9px] tracking-[0.15em] font-bold text-brand-sage uppercase border border-brand-sage/30 px-2 py-0.5 ml-2">Preferences</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('dashboard')}
            className="text-[10px] font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors border border-ink/10 px-4 py-2 rounded-none"
          >
            Dashboard
          </button>
        </div>
      </header>

      {/* Grid Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Quick shortcut shortcuts (Actions) */}
        <section className="md:col-span-4 bg-white rounded-none border border-ink/10 p-6 flex flex-col gap-6 text-left">
          <div className="flex items-center gap-4">
            <div 
              onClick={handleAvatarUploadClick}
              className="relative w-16 h-16 rounded-none overflow-hidden border border-ink/10 cursor-pointer group hover:border-brand-terracotta transition-colors shrink-0 bg-stone-50"
              title="Click to change profile picture"
            >
              <img 
                src={avatarPreview || profile?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                alt="Avatar" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-[9px] text-white uppercase tracking-wider font-bold">Edit</span>
              </div>
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white animate-spin" />
                </div>
              )}
            </div>
            <input 
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <div className="flex flex-col">
              <h4 className="font-display font-semibold text-sm text-text-primary">{profile?.fullName}</h4>
              <button 
                onClick={handleAvatarUploadClick}
                className="text-[10px] text-brand-terracotta font-bold hover:underline tracking-wider uppercase mt-1 self-start"
              >
                Change Photo
              </button>
            </div>
          </div>

          <hr className="border-ink/5" />

          {/* Quick Shortcuts dock */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Shortcuts dock</span>
            <button 
              onClick={() => setView('dashboard')}
              className="w-full bg-stone-50 border border-ink/5 hover:bg-stone-100 text-text-primary text-[10px] uppercase tracking-wider font-bold py-3.5 px-4 rounded-none flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2"><Plus className="w-4 h-4 text-brand-terracotta" /> Open Console</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </button>
            <button 
              onClick={() => setView('billing')}
              className="w-full bg-stone-50 border border-ink/5 hover:bg-stone-100 text-text-primary text-[10px] uppercase tracking-wider font-bold py-3.5 px-4 rounded-none flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2"><Coins className="w-4 h-4 text-brand-terracotta" /> Buy Credits</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </button>
            <button 
              onClick={() => setView('billing')}
              className="w-full bg-stone-50 border border-ink/5 hover:bg-stone-100 text-text-primary text-[10px] uppercase tracking-wider font-bold py-3.5 px-4 rounded-none flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-brand-terracotta" /> Upgrade Plan</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </button>
          </div>

          {/* Contact Support */}
          <div className="mt-2 p-5 bg-brand-sage/5 rounded-none border border-brand-sage/10 text-left">
            <h5 className="font-display font-semibold text-xs text-brand-sage uppercase tracking-wider flex items-center gap-1.5"><PhoneCall className="w-4 h-4" /> Need Expert Advice?</h5>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed font-sans">
              If you have tricky lighting setups or want physical swatches delivered, contact our support team.
            </p>
            <a 
              href="mailto:support@truetone.ai" 
              className="text-brand-sage hover:underline text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 mt-4"
            >
              <Mail className="w-3.5 h-3.5" /> support@truetone.ai
            </a>
          </div>
        </section>

        {/* Right Column: Preferences Forms and GDPR controls */}
        <section className="md:col-span-8 flex flex-col gap-8">
          
          {/* Main Account Settings */}
          <div className="bg-white rounded-none border border-ink/10 p-8 flex flex-col gap-6 text-left">
            <div className="flex flex-col">
              <h3 className="font-serif text-2xl font-normal text-text-primary">Profile Preferences</h3>
              <p className="text-xs text-text-secondary mt-1">Edit credentials and visual system preferences</p>
            </div>

            <hr className="border-ink/5" />

            <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-ink/10 rounded-none px-4 py-3 text-xs focus:border-brand-terracotta focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Email Address</label>
                  <input 
                    type="email" 
                    disabled
                    value={email || 'yashraghuvans@gmail.com'}
                    className="w-full bg-stone-50 border border-ink/10 rounded-none px-4 py-3 text-xs text-stone-400 cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              {/* Theme Selector */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Theme Select</span>
                <div className="flex gap-2">
                  {([
                    { id: 'light', label: 'Light Theme' },
                    { id: 'dark', label: 'Dark Mode' },
                    { id: 'system', label: 'Follow System' }
                  ] as const).map(th => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setTheme(th.id)}
                      className={`px-4 py-2.5 rounded-none border text-[10px] uppercase tracking-wider font-semibold transition-all ${theme === th.id ? 'border-brand-terracotta bg-brand-terracotta/5 text-brand-terracotta' : 'border-ink/10 hover:bg-stone-50 text-text-secondary'}`}
                    >
                      {th.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle checkboxes */}
              <div className="flex flex-col gap-4 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Notification Settings</span>
                
                <div className="flex items-center justify-between border-b border-ink/5 pb-3">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-text-primary">E-mail Palette Insights</span>
                    <span className="text-[10px] text-text-secondary font-sans leading-relaxed">Receive complimentary design trend summaries monthly.</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setNotifEmail(!notifEmail)}
                    className="text-brand-terracotta hover:scale-105 transition-transform"
                  >
                    {notifEmail ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-stone-300" />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-text-primary">Product Updates</span>
                    <span className="text-[10px] text-text-secondary font-sans leading-relaxed">Notify me when new design presets and worlds are seeded.</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setNotifProduct(!notifProduct)}
                    className="text-brand-terracotta hover:scale-105 transition-transform"
                  >
                    {notifProduct ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-stone-300" />}
                  </button>
                </div>
              </div>

              {/* Submit triggers */}
              <div className="flex items-center gap-4 pt-4 border-t border-ink/5">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-brand-terracotta hover:bg-brand-terracotta-hover text-white text-[10px] uppercase tracking-[0.15em] font-bold py-3.5 px-6 rounded-none transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
                {saveSuccess && (
                  <span className="text-emerald-600 font-bold text-xs flex items-center gap-1 animate-fade-in font-sans">
                    <Check className="w-4 h-4" /> Changes saved successfully!
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* GDPR Controls / Privacy Zone */}
          <div className="bg-white rounded-none border border-ink/10 p-8 flex flex-col gap-6 shadow-sm text-left">
            <div className="flex flex-col">
              <h3 className="font-serif text-2xl font-normal text-text-primary flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-terracotta" /> Privacy & GDPR Compliance
              </h3>
              <p className="text-xs text-text-secondary mt-1">Control your uploaded photo retention and download backup statements</p>
            </div>

            <hr className="border-ink/5" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Backup export card */}
              <div className="border border-ink/10 rounded-none p-5 flex flex-col justify-between items-start gap-4">
                <div className="flex flex-col gap-1">
                  <h5 className="font-display font-semibold text-xs uppercase tracking-wide text-text-primary">Download Backup Archive</h5>
                  <p className="text-[10px] text-text-secondary leading-relaxed mt-1 font-sans">
                    Export a portable JSON archive of your active projects, swatches, custom prompts, and wallet statements instantly.
                  </p>
                </div>
                <button
                  onClick={handleExport}
                  className="bg-stone-50 border border-ink/10 hover:bg-stone-100 text-text-primary text-[9px] uppercase tracking-widest font-bold py-2.5 px-4 rounded-none inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Export Data
                </button>
              </div>

              {/* Erase all photos card */}
              <div className="border border-red-100 bg-red-50/20 rounded-none p-5 flex flex-col justify-between items-start gap-4">
                <div className="flex flex-col gap-1">
                  <h5 className="font-display font-semibold text-xs uppercase tracking-wide text-red-700 flex items-center gap-1"><ShieldAlert className="w-4 h-4" /> Erase Room Photos</h5>
                  <p className="text-[10px] text-red-600 leading-relaxed mt-1 font-sans">
                    Instantly wipes all uploaded jpeg/png files and result visual exports completely from our servers for compliance.
                  </p>
                </div>
                <button
                  onClick={handleErasePhotos}
                  className="bg-red-600 hover:bg-red-700 text-white text-[9px] uppercase tracking-widest font-bold py-2.5 px-4 rounded-none inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Wipe Visuals
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
