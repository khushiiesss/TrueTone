import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store.js';
import { Plus, Search, Layers, Coins, Calendar, ArrowRight, Trash2, Sliders, ShieldCheck, Paintbrush, AlertCircle } from 'lucide-react';

export default function DashboardView() {
  const { 
    setView, 
    projects, 
    wallet, 
    subscription, 
    profile,
    fetchProjects, 
    fetchUser, 
    createProject, 
    deleteProject, 
    setActiveProject, 
    isLoadingProjects 
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // States for GitHub-style project deletion flow
  const [projectToDelete, setProjectToDelete] = useState<any | null>(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreating(true);
    const proj = await createProject(newTitle.trim(), newDesc.trim());
    setIsCreating(false);
    
    if (proj) {
      setNewTitle('');
      setNewDesc('');
      setIsModalOpen(false);
      
      const isOldUser = projects.length > 0;
      
      if (profile?.onboardingCompleted === false && !isOldUser) {
        setView('onboarding');
        window.location.hash = '#onboarding';
      } else {
        if (profile?.onboardingCompleted === false && isOldUser) {
           useAppStore.getState().updateProfile({ onboardingCompleted: true });
        }
        setActiveProject(proj.id);
        setView('studio');
        window.location.hash = '#studio';
      }
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, proj: any) => {
    e.stopPropagation(); // Prevent opening the project
    setProjectToDelete(proj);
    setDeleteConfirmationInput('');
  };

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectToDelete) return;
    if (deleteConfirmationInput.trim() !== projectToDelete.title.trim()) return;

    setIsDeleting(true);
    await deleteProject(projectToDelete.id);
    setIsDeleting(false);
    setProjectToDelete(null);
    setDeleteConfirmationInput('');
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg-base flex flex-col selection:bg-brand-terracotta/20 selection:text-brand-terracotta" id="dashboard_view">
      {/* Dashboard Top Header Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#FAFAF8]/95 backdrop-blur-md border-b border-ink/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <span className="font-display text-xl font-bold tracking-tight text-text-primary">
              TrueTone <span className="font-serif italic font-normal text-brand-terracotta">AI</span>
            </span>
          </div>
          <span className="text-[9px] tracking-[0.15em] font-bold text-brand-sage uppercase border border-brand-sage/30 px-2 py-0.5 ml-2">Console</span>
        </div>
        
        {/* User Stats / Indicators */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Credit balance */}
          <button 
            onClick={() => setView('billing')}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-brand-terracotta/20 bg-brand-terracotta/5 text-brand-terracotta rounded-none hover:bg-brand-terracotta/10 transition-colors text-xs font-bold uppercase tracking-wider"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>{wallet?.balance ?? 0} Credits</span>
          </button>

          {/* Subscription plan badge */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] uppercase tracking-wider text-text-secondary font-medium">Active Plan</span>
            <span className="text-xs font-bold text-text-primary uppercase tracking-wide">{subscription?.plan?.replace('_', ' ') ?? 'trial'}</span>
          </div>

          <button 
            onClick={() => setView('profile')}
            className="w-9 h-9 rounded-none border border-ink/10 overflow-hidden hover:border-brand-terracotta transition-colors"
          >
            <img 
              src={profile?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} 
              alt="Avatar" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 flex flex-col gap-10">
        
        {/* Overview Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Welcome Card */}
          <div className="md:col-span-2 bg-white rounded-none border border-ink/10 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="font-display font-normal text-3xl text-text-primary">
                Welcome, {profile?.fullName?.split(' ')[0] || 'User'}.
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
                You are currently on the <span className="font-bold text-brand-terracotta uppercase tracking-wider text-[11px]">{subscription?.plan?.replace('_', ' ') ?? 'trial'} plan</span>. Your visual workspace is highly secure, utilizing dedicated tenant-scoped database isolation.
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-brand-terracotta hover:bg-brand-terracotta-hover text-white text-[11px] uppercase tracking-[0.15em] font-bold py-3.5 px-6 rounded-none transition-colors inline-flex items-center gap-2 shrink-0 shadow-sm"
            >
              <Plus className="w-4 h-4" /> New Project
            </button>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-none border border-ink/10 p-8 flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.15em]">Total Projects</span>
              <span className="text-5xl font-normal font-serif text-text-primary mt-1">{projects.length}</span>
              <span className="text-[9px] text-brand-sage uppercase tracking-wider font-bold flex items-center gap-1 mt-2">
                <ShieldCheck className="w-3.5 h-3.5" /> All photos secure
              </span>
            </div>
            <div className="w-12 h-12 border border-brand-sage/20 bg-brand-sage/5 flex items-center justify-center text-brand-sage">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </section>

        {/* Projects List & Search */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-ink/5">
            <h3 className="font-display font-normal text-2xl text-text-primary flex items-center gap-2">
              My Design Projects
            </h3>
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-ink/10 rounded-none pl-10 pr-4 py-2.5 text-xs uppercase tracking-wider font-medium focus:border-brand-terracotta focus:outline-none transition-colors placeholder:text-gray-400"
              />
            </div>
          </div>

          {isLoadingProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-none border border-ink/10 aspect-[10/12] animate-pulse p-4 flex flex-col gap-4">
                  <div className="w-full bg-stone-100 aspect-video rounded-none" />
                  <div className="h-6 bg-stone-100 rounded-none w-2/3" />
                  <div className="h-4 bg-stone-100 rounded-none w-full" />
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white border border-dashed border-ink/20 rounded-none p-16 text-center flex flex-col items-center gap-4 max-w-xl mx-auto w-full">
              <div className="w-14 h-14 border border-brand-terracotta/20 bg-brand-terracotta/5 text-brand-terracotta flex items-center justify-center">
                <Paintbrush className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-lg text-text-primary">No projects found</h4>
              <p className="text-xs text-text-secondary leading-relaxed max-w-sm">
                Create your first project workspace to upload interior visual assets and execute paint color simulations.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-brand-terracotta hover:bg-brand-terracotta-hover text-white text-[11px] uppercase tracking-[0.15em] font-bold py-3 px-6 rounded-none transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Get Started
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((proj) => (
                <div 
                  key={proj.id}
                  onClick={() => { setActiveProject(proj.id); setView('studio'); }}
                  className="group bg-white rounded-none border border-ink/10 overflow-hidden hover:border-brand-terracotta/30 transition-all cursor-pointer flex flex-col"
                >
                  {/* Card Image */}
                  <div className="relative aspect-video bg-stone-100 overflow-hidden border-b border-ink/5">
                    {proj.coverImageUrl ? (
                      <img 
                        src={proj.coverImageUrl} 
                        alt={proj.title} 
                        className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-text-secondary bg-stone-100 gap-2">
                        <Paintbrush className="w-8 h-8 stroke-[1.25] text-stone-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Empty Workspace</span>
                      </div>
                    )}
                    
                    {/* Delete Icon Overlay */}
                    <button 
                      onClick={(e) => handleDeleteClick(e, proj)}
                      className="absolute top-3 right-3 bg-white text-text-secondary hover:text-red-600 p-2 rounded-none border border-ink/10 shadow-sm md:opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between gap-6 bg-[#FAFAF8]">
                    <div className="flex flex-col gap-2">
                      <h4 className="font-display font-semibold text-lg text-text-primary leading-tight group-hover:text-brand-terracotta transition-colors">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                        {proj.description || "No description specified."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-medium text-text-secondary pt-4 border-t border-ink/5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {new Date(proj.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-brand-terracotta inline-flex items-center gap-1 font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                        Studio <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* New Project Creation Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#FAFAF8] rounded-none border border-ink/10 w-full max-w-md p-8 shadow-2xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-250">
            <div className="flex justify-between items-center pb-3 border-b border-ink/5">
              <h4 className="font-display font-normal text-xl text-text-primary">New Design Space</h4>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-text-secondary hover:text-text-primary font-bold text-md"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Project Title *</label>
                <input 
                  type="text"
                  placeholder="e.g. Master Bedroom Accent"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-ink/10 rounded-none px-4 py-3 text-xs uppercase tracking-wider focus:border-brand-terracotta focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Description (Optional)</label>
                <textarea 
                  placeholder="Describe your design intentions or target palettes..."
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-white border border-ink/10 rounded-none px-4 py-3 text-xs focus:border-brand-terracotta focus:outline-none transition-colors"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-ink/5">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border border-ink/10 px-5 py-2.5 rounded-none text-xs uppercase tracking-wider font-bold text-text-primary hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isCreating}
                  className="bg-brand-terracotta hover:bg-brand-terracotta-hover text-white text-xs uppercase tracking-wider font-bold py-2.5 px-5 rounded-none transition-colors disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GitHub-style Project Deletion Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FAFAF8] rounded-none border border-red-200/55 w-full max-w-md p-8 shadow-2xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 pb-3 border-b border-red-100">
              <div className="w-9 h-9 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-lg text-red-700">Delete Project?</h4>
                <p className="text-[10px] uppercase tracking-wider text-red-500 font-bold font-mono">Irreversible Action</p>
              </div>
              <button 
                onClick={() => setProjectToDelete(null)}
                className="ml-auto text-text-secondary hover:text-text-primary font-bold text-md cursor-pointer"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4 text-left">
              <p className="text-xs text-text-secondary leading-relaxed">
                This will permanently delete the project <strong className="text-text-primary">"{projectToDelete.title}"</strong>, all uploaded room photos, and all generated paint color simulations.
              </p>

              <div className="p-3 bg-red-50/50 border border-red-100 rounded-none text-xs text-red-800 leading-relaxed">
                Please type the exact project title <strong className="select-all font-mono bg-white px-1.5 py-0.5 border border-red-200 text-red-700 rounded-sm break-all">{" "}{projectToDelete.title}{" "}</strong> to confirm:
              </div>

              <form onSubmit={handleConfirmDelete} className="flex flex-col gap-4">
                <input 
                  type="text"
                  placeholder="Type project title here..."
                  required
                  value={deleteConfirmationInput}
                  onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                  className="w-full bg-white border border-ink/10 rounded-none px-4 py-3 text-xs uppercase tracking-wider font-mono focus:border-red-600 focus:outline-none transition-colors"
                />

                <div className="flex gap-3 justify-end pt-3 border-t border-ink/5">
                  <button 
                    type="button"
                    onClick={() => setProjectToDelete(null)}
                    className="border border-ink/10 px-5 py-2.5 rounded-none text-xs uppercase tracking-wider font-bold text-text-primary hover:bg-stone-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isDeleting || deleteConfirmationInput.trim() !== projectToDelete.title.trim()}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-stone-100 disabled:text-stone-400 disabled:border-stone-200 text-white text-xs uppercase tracking-wider font-bold py-2.5 px-5 rounded-none transition-colors cursor-pointer border border-transparent shadow-xs"
                  >
                    {isDeleting ? 'Deleting...' : 'I understand, delete this project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
