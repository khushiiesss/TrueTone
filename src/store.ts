import { create } from 'zustand';
import { Project, Generation, Profile, Subscription, CreditWallet, CreditLedgerEntry } from './types.js';

// Custom dynamic API fetch helper with token/session headers
const apiFetch = async (url: string, options: RequestInit = {}) => {
  let userId = useAppStore.getState().userId || localStorage.getItem('truetone_user_id');
  if (!userId) {
    // Generate a unique fallback guest ID if none exists yet
    userId = `guest_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem('truetone_user_id', userId);
  }
  
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    'Authorization': `Bearer ${userId}`
  };
  
  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  
  return fetch(url, { ...options, headers });
};

interface AppState {
  view: 'landing' | 'dashboard' | 'studio' | 'billing' | 'profile' | 'login' | 'signup' | 'forgot-password' | 'reset-password' | 'verify-email' | 'onboarding' | 'about' | 'contact' | 'privacy' | 'terms' | 'cookies' | 'changelog';
  activeProjectId: string | null;
  activeStudioTab: 'studio' | 'colors' | 'combinations' | 'layouts' | 'history' | 'settings';
  
  // Auth state
  userId: string | null;
  email: string | null;
  profile: Profile | null;
  subscription: Subscription | null;
  wallet: CreditWallet | null;
  ledger: CreditLedgerEntry[];
  
  // Data lists
  projects: Project[];
  generations: (Generation & { colors: any[] })[];
  
  // Loading states
  isLoadingAuth: boolean;
  isLoadingProjects: boolean;
  isLoadingGenerations: boolean;
  isGenerating: boolean;
  
  // Actions
  setView: (view: AppState['view']) => void;
  setActiveProject: (projectId: string | null) => void;
  setStudioTab: (tab: AppState['activeStudioTab']) => void;
  
  // API Fetch actions
  fetchUser: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchGenerations: (projectId: string) => Promise<void>;
  createProject: (title: string, description: string) => Promise<Project | null>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<boolean>;
  uploadSourceImage: (projectId: string, sourceImageBase64: string, mimeType: string) => Promise<boolean>;
  triggerGeneration: (payload: {
    sourceImageBase64: string;
    mimeType: string;
    promptText: string;
    stylePreset: string;
    layoutType: string;
    imageCount: number;
    paintFinish?: string;
    lighting?: string;
    testMode?: boolean;
    customColor?: {
      name: string;
      hex: string;
      brandMatch: string;
    };
  }) => Promise<any>;
  checkoutCredits: (payload: { type: 'subscription' | 'topup'; plan?: string; packId?: string }) => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
  privacyDeletePhotos: () => Promise<boolean>;
  privacyExportData: () => Promise<any>;
  login: (userId: string, email: string) => Promise<void>;
  logout: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  view: 'landing',
  activeProjectId: null,
  activeStudioTab: 'studio',
  
  userId: typeof window !== 'undefined' ? localStorage.getItem('truetone_user_id') : null,
  email: null,
  profile: null,
  subscription: null,
  wallet: null,
  ledger: [],
  
  projects: [],
  generations: [],
  
  isLoadingAuth: false,
  isLoadingProjects: false,
  isLoadingGenerations: false,
  isGenerating: false,

  setView: (view) => set({ view }),
  setActiveProject: (projectId) => {
    set({ activeProjectId: projectId, activeStudioTab: 'studio' });
    if (projectId) {
      get().fetchGenerations(projectId);
    }
  },
  setStudioTab: (tab) => set({ activeStudioTab: tab }),

  fetchUser: async () => {
    let uId = get().userId || localStorage.getItem('truetone_user_id');
    if (!uId) {
      // Lazy guest registration on first load
      uId = `guest_${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem('truetone_user_id', uId);
      set({ userId: uId });
    } else if (!get().userId) {
      set({ userId: uId });
    }

    // Only block initial app loads with full screen loading state
    const isFirstRun = !get().profile;
    if (isFirstRun) {
      set({ isLoadingAuth: true });
    }

    try {
      const res = await apiFetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        set({
          userId: data.userId,
          email: data.email,
          profile: data.profile,
          subscription: data.subscription,
          wallet: data.wallet
        });
        
        // Fetch ledger
        const ledgerRes = await apiFetch('/api/wallet/ledger');
        if (ledgerRes.ok) {
          set({ ledger: await ledgerRes.json() });
        }
      }
    } catch (e) {
      console.error("Failed to load user info", e);
    } finally {
      if (isFirstRun) {
        set({ isLoadingAuth: false });
      }
    }
  },

  fetchProjects: async () => {
    set({ isLoadingProjects: true });
    try {
      const res = await apiFetch('/api/projects');
      if (res.ok) {
        set({ projects: await res.json() });
      }
    } catch (e) {
      console.error("Failed to load projects", e);
    } finally {
      set({ isLoadingProjects: false });
    }
  },

  fetchGenerations: async (projectId: string) => {
    set({ isLoadingGenerations: true });
    try {
      const res = await apiFetch(`/api/projects/${projectId}/generations`);
      if (res.ok) {
        set({ generations: await res.json() });
      }
    } catch (e) {
      console.error("Failed to load generations", e);
    } finally {
      set({ isLoadingGenerations: false });
    }
  },

  createProject: async (title, description) => {
    try {
      const res = await apiFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ title, description })
      });
      if (res.ok) {
        const newProj = await res.json();
        await get().fetchProjects();
        return newProj;
      }
    } catch (e) {
      console.error("Failed to create project", e);
    }
    return null;
  },

  deleteProject: async (projectId) => {
    try {
      const res = await apiFetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await get().fetchProjects();
        if (get().activeProjectId === projectId) {
          set({ activeProjectId: null });
        }
        return true;
      }
    } catch (e) {
      console.error("Failed to delete project", e);
    }
    return false;
  },

  updateProject: async (projectId, updates) => {
    try {
      const res = await apiFetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        await get().fetchProjects();
      }
    } catch (e) {
      console.error("Failed to update project", e);
    }
  },

  uploadSourceImage: async (projectId, sourceImageBase64, mimeType) => {
    try {
      const res = await apiFetch(`/api/projects/${projectId}/upload`, {
        method: 'POST',
        body: JSON.stringify({ sourceImageBase64, mimeType })
      });
      if (res.ok) {
        await get().fetchProjects();
        return true;
      }
    } catch (e) {
      console.error("Failed to upload source image:", e);
    }
    return false;
  },

  triggerGeneration: async (payload) => {
    const projectId = get().activeProjectId;
    if (!projectId) return null;

    set({ isGenerating: true });
    try {
      const res = await apiFetch(`/api/projects/${projectId}/generate`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Generation failed");
      }
      
      const newGen = await res.json();
      
      await get().fetchUser();
      await get().fetchProjects();
      await get().fetchGenerations(projectId);
      
      return newGen;
    } catch (e: any) {
      console.error("Generation failed:", e);
      throw e;
    } finally {
      set({ isGenerating: false });
    }
  },

  checkoutCredits: async (payload) => {
    try {
      const res = await apiFetch('/api/stripe/checkout', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          await get().fetchUser();
        }
      }
    } catch (e) {
      console.error("Checkout failed", e);
    }
  },

  updateProfile: async (profileData) => {
    try {
      const res = await apiFetch('/api/profile', {
        method: 'POST',
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        set({ profile: await res.json() });
      }
    } catch (e) {
      console.error("Failed to update profile", e);
    }
  },

  privacyDeletePhotos: async () => {
    try {
      const res = await apiFetch('/api/privacy/delete-all-photos', { method: 'POST' });
      if (res.ok) {
        await get().fetchProjects();
        const activeId = get().activeProjectId;
        if (activeId) {
          await get().fetchGenerations(activeId);
        }
        return true;
      }
    } catch (e) {
      console.error("Privacy erase failed", e);
    }
    return false;
  },

  privacyExportData: async () => {
    try {
      const res = await apiFetch('/api/privacy/export');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error("Privacy export failed", e);
    }
    return null;
  },

  login: async (userId: string, email: string) => {
    localStorage.setItem('truetone_user_id', userId);
    set({ userId, email });
    await get().fetchUser();
    await get().fetchProjects();
    
    const hasProjects = get().projects.length > 0;
    
    if (get().profile?.onboardingCompleted === false && !hasProjects) {
      set({ view: 'onboarding' });
      window.location.hash = '#onboarding';
    } else {
      // Auto-complete onboarding for old users who bypassed it
      if (get().profile?.onboardingCompleted === false && hasProjects) {
         get().updateProfile({ onboardingCompleted: true });
      }
      set({ view: 'dashboard' });
      window.location.hash = '#dashboard';
    }
  },

  logout: () => {
    localStorage.removeItem('truetone_user_id');
    set({
      userId: null,
      email: null,
      profile: null,
      subscription: null,
      wallet: null,
      ledger: [],
      projects: [],
      generations: [],
      view: 'landing'
    });
  }
}));
