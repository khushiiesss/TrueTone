import React, { useState } from 'react';
import { useAppStore } from '../store.js';
import AuthLayout from './AuthLayout.js';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { supabase } from '../supabase.js';

export default function ResetPasswordView() {
  const { setView } = useAppStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Strength calculator
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      if (supabase) {
        const { error: updateError } = await supabase.auth.updateUser({
          password: password
        });
        if (updateError) throw updateError;
      } else {
        // Simulator
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      setIsSuccess(true);
      setTimeout(() => {
        setView('login');
        window.location.hash = '#login';
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title="Choose a new password" 
      subhead="Please enter your new high-security password below to secure your TrueTone account."
    >
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center text-center py-6 gap-3">
          <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <h3 className="font-display font-bold text-base text-text-primary">Password updated!</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Your password has been changed successfully. Redirecting you to the sign-in page...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-none">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* New Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="reset-password-input" className="text-xs font-bold text-text-primary uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <input 
                id="reset-password-input"
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

            {/* Strength meter */}
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
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="reset-password-confirm" className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Confirm New Password
            </label>
            <input 
              id="reset-password-confirm"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-ink/10 rounded-none focus:outline-none focus:border-brand-terracotta bg-stone-50 dark:bg-stone-900 text-text-primary placeholder:text-text-secondary/50 text-sm transition-colors"
            />
            
            {/* Live match indicator */}
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
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-bold text-xs uppercase tracking-widest py-3 mt-2 rounded-none transition-all flex items-center justify-center gap-2 hover:shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              'Set New Password'
            )}
          </button>

        </form>
      )}
    </AuthLayout>
  );
}
