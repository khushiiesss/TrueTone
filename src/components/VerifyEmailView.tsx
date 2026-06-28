import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store.js';
import AuthLayout from './AuthLayout.js';
import { Mail, RefreshCw, Check } from 'lucide-react';
import { supabase } from '../supabase.js';

export default function VerifyEmailView() {
  const { setView, email } = useAppStore();
  const [cooldown, setCooldown] = useState(0);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  // Timer effect for countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    setIsResending(true);
    setStatusMsg(null);

    try {
      if (supabase && email) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
      } else {
        // Simulator resend
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      setCooldown(60);
      setStatusMsg('Verification email resent successfully.');
    } catch (err: any) {
      setStatusMsg(err.message || 'Failed to resend. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout 
      title="Verify your email" 
      subhead="Verify your email address to unlock standard access, credits, and saving your color selections."
    >
      <div className="flex flex-col text-left gap-4">
        
        {/* Mailbox SVG card */}
        <div className="bg-stone-50 dark:bg-stone-900 border border-ink/10 p-6 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-brand-terracotta/5 border border-brand-terracotta/10 flex items-center justify-center text-brand-terracotta">
            <Mail className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-display font-bold text-sm text-text-primary">We sent you a verification link</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              We sent a verification link to <strong className="text-text-primary font-bold">{email || 'your email'}</strong>. Please click it to activate your account.
            </p>
          </div>
        </div>

        {statusMsg && (
          <div className="bg-stone-100 border border-ink/10 text-text-primary text-[11px] font-medium px-3 py-2.5 rounded-none flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Resend email trigger with countdown */}
        <button 
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || isResending}
          className="w-full border border-ink/10 hover:border-brand-terracotta/40 hover:bg-stone-50 text-text-primary font-bold text-xs uppercase tracking-widest py-3 rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isResending ? (
            <RefreshCw className="w-4 h-4 animate-spin text-brand-terracotta" />
          ) : cooldown > 0 ? (
            `Resend in ${cooldown}s`
          ) : (
            'Resend Verification Email'
          )}
        </button>

        {/* Option to bypass in simulator */}
        {!supabase && (
          <button 
            type="button"
            onClick={() => { setView('onboarding'); window.location.hash = '#onboarding'; }}
            className="w-full bg-brand-terracotta text-white font-bold text-xs uppercase tracking-widest py-3 rounded-none transition-all flex items-center justify-center gap-2 hover:bg-brand-terracotta-hover cursor-pointer"
          >
            Bypass Verification (Simulator)
          </button>
        )}

        <button 
          onClick={() => { setView('login'); window.location.hash = '#login'; }}
          className="text-center text-xs text-brand-terracotta font-bold hover:underline uppercase tracking-wider mt-2"
        >
          Back to Sign In
        </button>

      </div>
    </AuthLayout>
  );
}
