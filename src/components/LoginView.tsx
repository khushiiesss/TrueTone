import React, { useState } from 'react';
import { useAppStore } from '../store.js';
import AuthLayout from './AuthLayout.js';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '../supabase.js';

export default function LoginView() {
  const { setView, login } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Validation/loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  const handleValidation = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!handleValidation()) return;

    setIsSubmitting(true);
    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          await login(data.user.id, data.user.email || email);
          setView('dashboard');
        }
      } else {
        // High-fidelity local simulation
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Mock success with standard id
        const simulatedId = `google_yash_${Math.random().toString(36).substring(2, 9)}`;
        await login(simulatedId, email);
        setView('dashboard');
      }
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to sign in. Please check your credentials.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrors({});
    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
            skipBrowserRedirect: true
          }
        });
        if (error) throw error;
        if (data?.url) {
          window.open(data.url, '_blank');
        }
      } else {
        // Simulator fallback
        await new Promise(resolve => setTimeout(resolve, 1200));
        await login('google_yash', 'yashraghuvans@gmail.com');
        setView('dashboard');
      }
    } catch (err: any) {
      setErrors({ form: err.message || 'Google Sign-In failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subhead="Sign in to see your projects, colors, and simulated wall render results."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        
        {/* Form level error alert */}
        {errors.form && (
          <div className="flex flex-col gap-3">
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-none flex items-start gap-2">
              <span className="font-bold shrink-0">⚠️</span>
              <div className="flex-grow">
                <p className="font-bold text-red-800">Authentication Alert</p>
                <p className="font-medium mt-0.5">{errors.form}</p>
              </div>
            </div>


          </div>
        )}

        {/* Email Field */}
        <div className="flex flex-col gap-1">
          <label htmlFor="login-email" className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Email Address
          </label>
          <input 
            id="login-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleValidation}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-ink/10 rounded-none focus:outline-none focus:border-brand-terracotta bg-stone-50 dark:bg-stone-900 text-text-primary placeholder:text-text-secondary/50 text-sm transition-colors"
          />
          {errors.email && (
            <span className="text-[10px] text-red-600 font-medium mt-0.5 flex items-center gap-1">
              • {errors.email}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label htmlFor="login-password" className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Password
            </label>
            <button 
              type="button"
              onClick={() => { setView('forgot-password'); window.location.hash = '#forgot-password'; }}
              className="text-[10px] text-brand-terracotta font-bold hover:underline tracking-wider uppercase"
              disabled={isSubmitting}
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <input 
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={handleValidation}
              disabled={isSubmitting}
              className="w-full pl-3 pr-10 py-2 border border-ink/10 rounded-none focus:outline-none focus:border-brand-terracotta bg-stone-50 dark:bg-stone-900 text-text-primary placeholder:text-text-secondary/50 text-sm transition-colors"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-text-secondary hover:text-text-primary"
              disabled={isSubmitting}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <span className="text-[10px] text-red-600 font-medium mt-0.5 flex items-center gap-1">
              • {errors.password}
            </span>
          )}
        </div>

        {/* Remember me checkbox */}
        <div className="flex items-center gap-2 mt-1">
          <input 
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isSubmitting}
            className="w-4 h-4 accent-brand-terracotta text-white border-ink/10 rounded-none focus:ring-brand-terracotta/20 focus:ring-2"
          />
          <label htmlFor="remember-me" className="text-xs text-text-secondary cursor-pointer select-none">
            Remember me on this device
          </label>
        </div>

        {/* Primary CTA */}
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-bold text-xs uppercase tracking-widest py-3 mt-2 rounded-none transition-all flex items-center justify-center gap-2 hover:shadow-md cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-ink/10"></div>
          <span className="flex-shrink mx-4 text-[10px] text-text-secondary uppercase font-bold tracking-wider">or continue with</span>
          <div className="flex-grow border-t border-ink/10"></div>
        </div>

        {/* Google sign-in */}
        <button 
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full border border-ink/10 hover:border-brand-terracotta/40 text-text-primary hover:bg-stone-50 bg-white dark:bg-stone-900 dark:hover:bg-stone-850 font-bold text-xs uppercase tracking-widest py-3 rounded-none transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Google Accounts
        </button>

        {/* Switch link */}
        <p className="text-center text-xs text-text-secondary mt-2 leading-relaxed">
          Don't have an account?{' '}
          <button 
            type="button"
            onClick={() => { setView('signup'); window.location.hash = '#signup'; }}
            className="text-brand-terracotta font-bold hover:underline"
            disabled={isSubmitting}
          >
            Sign up for free
          </button>
        </p>

      </form>
    </AuthLayout>
  );
}
