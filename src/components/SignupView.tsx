import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store.js';
import AuthLayout from './AuthLayout.js';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { supabase } from '../supabase.js';

export default function SignupView() {
  const { setView, login } = useAppStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation/loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
    form?: string;
  }>({});

  // Password strength calculation
  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength();

  const getStrengthMeta = () => {
    switch (strengthScore) {
      case 1: return { color: 'bg-red-500', label: 'Weak', count: 1 };
      case 2: return { color: 'bg-orange-500', label: 'Fair', count: 2 };
      case 3: return { color: 'bg-yellow-500', label: 'Good', count: 3 };
      case 4: return { color: 'bg-green-500', label: 'Strong', count: 4 };
      default: return { color: 'bg-stone-200 dark:bg-stone-800', label: 'Very Weak', count: 0 };
    }
  };

  const strengthMeta = getStrengthMeta();

  const handleValidation = () => {
    const newErrors: typeof errors = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
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
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service';
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
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });
        if (error) throw error;
        
        // Show verify email view or auto login if auto-confirmed
        if (data.user) {
          // If session is active immediately
          if (data.session) {
            await login(data.user.id, data.user.email || email);
            setView('onboarding');
          } else {
            setView('verify-email');
          }
        }
      } else {
        // High-fidelity local simulation
        await new Promise(resolve => setTimeout(resolve, 1800));
        const simulatedId = `user_${Math.random().toString(36).substring(2, 9)}`;
        await login(simulatedId, email);
        
        // Push profile details
        const store = useAppStore.getState();
        await store.updateProfile({ fullName, theme: 'light', onboardingCompleted: false });
        
        setView('onboarding');
      }
    } catch (err: any) {
      setErrors({ form: err.message || 'Registration failed. Please try again.' });
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
      title="Start painting" 
      subhead="Free to try — no credit card needed. Generate custom colors instantly."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        
        {/* Form level error */}
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

        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="signup-name" className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Full Name
          </label>
          <input 
            id="signup-name"
            type="text"
            placeholder="Yash Raghuvanshi"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-ink/10 rounded-none focus:outline-none focus:border-brand-terracotta bg-stone-50 dark:bg-stone-900 text-text-primary placeholder:text-text-secondary/50 text-sm transition-colors"
          />
          {errors.fullName && (
            <span className="text-[10px] text-red-600 font-medium mt-0.5">
              • {errors.fullName}
            </span>
          )}
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1">
          <label htmlFor="signup-email" className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Email Address
          </label>
          <input 
            id="signup-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-ink/10 rounded-none focus:outline-none focus:border-brand-terracotta bg-stone-50 dark:bg-stone-900 text-text-primary placeholder:text-text-secondary/50 text-sm transition-colors"
          />
          {errors.email && (
            <span className="text-[10px] text-red-600 font-medium mt-0.5">
              • {errors.email}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1">
          <label htmlFor="signup-password" className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <input 
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          
          {/* Password strength meter */}
          {password && (
            <div className="mt-1.5 flex flex-col gap-1">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                <span>Strength: <span style={{ color: strengthScore > 2 ? '#16a34a' : strengthScore > 1 ? '#d97706' : '#dc2626' }}>{strengthMeta.label}</span></span>
                <span className="font-mono text-[9px]">{strengthScore}/4</span>
              </div>
              <div className="grid grid-cols-4 gap-1 h-1.5 mt-0.5">
                {[1, 2, 3, 4].map((seg) => (
                  <div 
                    key={seg} 
                    className={`h-full transition-colors ${
                      seg <= strengthMeta.count ? strengthMeta.color : 'bg-stone-200 dark:bg-stone-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {errors.password && (
            <span className="text-[10px] text-red-600 font-medium mt-0.5">
              • {errors.password}
            </span>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-1">
          <label htmlFor="signup-confirm-password" className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Confirm Password
          </label>
          <input 
            id="signup-confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-ink/10 rounded-none focus:outline-none focus:border-brand-terracotta bg-stone-50 dark:bg-stone-900 text-text-primary placeholder:text-text-secondary/50 text-sm transition-colors"
          />
          
          {/* Live password match indicator */}
          {password && confirmPassword && (
            <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
              {password === confirmPassword ? (
                <span className="text-green-600 flex items-center gap-0.5">
                  <Check className="w-3 h-3 stroke-[3]" /> Passwords match
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-0.5">
                  <X className="w-3 h-3 stroke-[3]" /> Passwords do not match
                </span>
              )}
            </div>
          )}

          {errors.confirmPassword && (
            <span className="text-[10px] text-red-600 font-medium mt-0.5">
              • {errors.confirmPassword}
            </span>
          )}
        </div>

        {/* Terms checkbox */}
        <div className="flex flex-col gap-1 mt-1">
          <div className="flex items-start gap-2.5">
            <input 
              id="agree-terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 mt-0.5 accent-brand-terracotta text-white border-ink/10 rounded-none focus:ring-brand-terracotta/20 focus:ring-2 shrink-0"
            />
            <label htmlFor="agree-terms" className="text-xs text-text-secondary leading-normal cursor-pointer select-none">
              I agree to the{' '}
              <a href="#terms" target="_blank" rel="noopener noreferrer" className="text-brand-terracotta font-semibold hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" target="_blank" rel="noopener noreferrer" className="text-brand-terracotta font-semibold hover:underline">
                Privacy Policy
              </a>.
            </label>
          </div>
          {errors.agreeTerms && (
            <span className="text-[10px] text-red-600 font-medium mt-0.5">
              • {errors.agreeTerms}
            </span>
          )}
        </div>

        {/* Primary CTA with framer-motion zoom */}
        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-bold text-xs uppercase tracking-widest py-3 mt-2 rounded-none transition-all flex items-center justify-center gap-2 hover:shadow-md cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create My Account'
          )}
        </motion.button>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
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
        <p className="text-center text-xs text-text-secondary mt-1 leading-relaxed">
          Already have an account?{' '}
          <button 
            type="button"
            onClick={() => { setView('login'); window.location.hash = '#login'; }}
            className="text-brand-terracotta font-bold hover:underline"
            disabled={isSubmitting}
          >
            Sign in
          </button>
        </p>

      </form>
    </AuthLayout>
  );
}
