import React, { useEffect } from 'react';
import { useAppStore } from './store.js';
import LandingView from './components/LandingView.js';
import DashboardView from './components/DashboardView.js';
import ProjectStudioView from './components/ProjectStudioView.js';
import BillingView from './components/BillingView.js';
import ProfileView from './components/ProfileView.js';
import LoginView from './components/LoginView.js';
import SignupView from './components/SignupView.js';
import ForgotPasswordView from './components/ForgotPasswordView.js';
import ResetPasswordView from './components/ResetPasswordView.js';
import VerifyEmailView from './components/VerifyEmailView.js';
import OnboardingView from './components/OnboardingView.js';
import FooterPages from './components/FooterPages.js';
import { RefreshCw } from 'lucide-react';
import { supabase } from './supabase.js';

export default function App() {
  const { view, setView, fetchUser, fetchProjects, isLoadingAuth, profile, login } = useAppStore();

  useEffect(() => {
    const hydrateAuth = async () => {
      fetchUser();
      fetchProjects();

      if (!supabase) return;

      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.warn('Unable to restore Supabase session:', error);
        return;
      }

      if (session?.user) {
        const email = session.user.email || '';
        const userId = session.user.id;
        await login(userId, email);
        if (window.location.hash === '' || window.location.hash === '#') {
          window.location.hash = '#dashboard';
        }
        return;
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
        if (nextSession?.user) {
          const email = nextSession.user.email || '';
          const userId = nextSession.user.id;
          await login(userId, email);
          if (window.location.hash === '' || window.location.hash === '#') {
            window.location.hash = '#dashboard';
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    };

    let cleanup: (() => void) | undefined;
    hydrateAuth().then((value) => {
      cleanup = value;
    });

    return () => {
      cleanup?.();
    };
  }, []);

  // Hash-based routing to support direct linking/actions
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validViews = [
        'landing', 'dashboard', 'studio', 'billing', 'profile',
        'login', 'signup', 'forgot-password', 'reset-password', 'verify-email',
        'onboarding', 'about', 'contact', 'privacy', 'terms', 'cookies', 'changelog'
      ];
      if (validViews.includes(hash)) {
        setView(hash as any);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Trigger on initial render

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);



  useEffect(() => {
    const root = document.documentElement;
    const theme = profile?.theme || 'light';
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else {
      root.classList.remove('dark');
    }
  }, [profile?.theme]);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-brand-terracotta/20 border-t-brand-terracotta animate-spin" />
        <span className="text-xs font-bold text-text-secondary uppercase tracking-widest animate-pulse">
          Hydrating TrueTone Console...
        </span>
      </div>
    );
  }

  switch (view) {
    case 'landing':
      return <LandingView />;
    case 'dashboard':
      return <DashboardView />;
    case 'studio':
      return <ProjectStudioView />;
    case 'billing':
      return <BillingView />;
    case 'profile':
      return <ProfileView />;
    case 'login':
      return <LoginView />;
    case 'signup':
      return <SignupView />;
    case 'forgot-password':
      return <ForgotPasswordView />;
    case 'reset-password':
      return <ResetPasswordView />;
    case 'verify-email':
      return <VerifyEmailView />;
    case 'onboarding':
      return <OnboardingView />;
    case 'about':
    case 'contact':
    case 'privacy':
    case 'terms':
    case 'cookies':
    case 'changelog':
      return <FooterPages type={view} />;
    default:
      return <LandingView />;
  }
}
