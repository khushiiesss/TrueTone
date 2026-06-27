import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store.js';
import AuthLayout from './AuthLayout.js';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabase.js';

export default function ForgotPasswordView() {
  const { setView } = useAppStore();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      if (supabase) {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/#reset-password`,
        });
        if (resetError) throw resetError;
      } else {
        // Simulation
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title="Reset your password" 
      subhead="Enter your email address and we'll send you a secure magic link to reset your password."
    >
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center text-center py-6 gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-terracotta/10 flex items-center justify-center text-brand-terracotta">
            <Mail className="w-8 h-8 animate-bounce" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-display font-bold text-lg text-text-primary">Check your inbox</h3>
            <p className="text-xs text-text-secondary leading-relaxed max-w-xs">
              We sent a secure password reset link to <strong className="text-text-primary font-bold">{email}</strong>. Please follow the instructions in the email.
            </p>
          </div>
          <button 
            onClick={() => { setView('login'); window.location.hash = '#login'; }}
            className="mt-4 text-xs font-bold text-brand-terracotta uppercase tracking-wider hover:underline"
          >
            Back to Sign In
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-none">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Email field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="forgot-email" className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Email Address
            </label>
            <input 
              id="forgot-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-ink/10 rounded-none focus:outline-none focus:border-brand-terracotta bg-stone-50 dark:bg-stone-900 text-text-primary placeholder:text-text-secondary/50 text-sm transition-colors"
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-bold text-xs uppercase tracking-widest py-3 mt-2 rounded-none transition-all flex items-center justify-center gap-2 hover:shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>

          <button 
            type="button"
            onClick={() => { setView('login'); window.location.hash = '#login'; }}
            className="text-center text-xs text-text-secondary mt-2 flex items-center justify-center gap-1.5 hover:text-brand-terracotta transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </button>

        </form>
      )}
    </AuthLayout>
  );
}
