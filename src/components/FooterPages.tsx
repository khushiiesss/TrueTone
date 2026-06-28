import React, { useState } from 'react';
import { useAppStore } from '../store.js';
import Footer from './Footer.js';
import { 
  ArrowLeft, Mail, Compass, HelpCircle, Check, 
  MessageSquare, Terminal, ChevronRight, User, Sparkles, AlertTriangle 
} from 'lucide-react';

interface FooterPagesProps {
  type: 'about' | 'contact' | 'privacy' | 'terms' | 'cookies' | 'changelog';
}

export default function FooterPages({ type }: FooterPagesProps) {
  const { setView } = useAppStore();

  const handleBackToLanding = () => {
    setView('landing');
    window.location.hash = '';
    window.scrollTo({ top: 0 });
  };

  return (
    <div id="footer-pages-layout" className="min-h-screen bg-[#FAF9F5] dark:bg-stone-950 text-text-primary flex flex-col justify-between selection:bg-brand-terracotta/20 selection:text-brand-terracotta transition-colors duration-300">
      
      {/* Dynamic Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-ink/5 py-4 px-6 sm:px-12 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToLanding}>
          <span className="w-8 h-8 rounded-none bg-brand-terracotta flex items-center justify-center font-display font-bold text-white tracking-tighter text-lg shadow-xs">
            T
          </span>
          <span className="font-display font-bold text-base tracking-tight text-text-primary">
            TrueTone <span className="text-brand-terracotta">AI</span>
          </span>
        </div>
        
        <button 
          onClick={handleBackToLanding}
          className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-brand-terracotta transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
      </header>

      {/* Main Content Stage */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-12 sm:py-16 md:py-20">
        
        {type === 'about' && <AboutSection handleBack={handleBackToLanding} />}
        {type === 'contact' && <ContactSection />}
        {type === 'privacy' && <PrivacySection />}
        {type === 'terms' && <TermsSection />}
        {type === 'cookies' && <CookiesSection />}
        {type === 'changelog' && <ChangelogSection />}

      </main>

      {/* Embedded footer */}
      <Footer />
    </div>
  );
}

/* ==========================================================================
   1. ABOUT SECTION
   ========================================================================== */
function AboutSection({ handleBack }: { handleBack: () => void }) {
  return (
    <div className="flex flex-col gap-12 text-left">
      
      {/* Title */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-mono font-bold tracking-widest text-brand-terracotta uppercase">
          Who we are & our mission
        </span>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary tracking-tight">
          Redefining paint decisions.
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
          TrueTone AI was built by a small, hyper-focused team of designers and engineers tired of painting the wrong room the wrong color.
        </p>
      </div>

      {/* 2-column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-5 text-xs text-text-secondary leading-relaxed">
          <h3 className="font-display font-bold text-base text-text-primary tracking-tight">
            The Problem We Solve
          </h3>
          <p>
            Choosing a paint color is surprisingly stressful. Swatches look different in the store than on your walls, lighting cycles throughout the day, and buying dozen tiny sample cans gets expensive.
          </p>
          <p>
            {/* TODO(human): replace with real story */}
            We built TrueTone AI to bring high-fidelity previewing to anyone's browser in three seconds flat. No tape, no mess, no buyer's remorse.
          </p>
          
          <div className="bg-[#FAF9F5] border-l-2 border-brand-terracotta p-4 my-2 text-text-primary italic font-medium bg-stone-100 dark:bg-stone-900 rounded-r-lg">
            "Make paint decisions feel obvious, not anxious."
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-video md:aspect-square border border-ink/5">
          <img 
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80" 
            alt="TrueTone Living Room Preview" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
            <span className="text-[10px] font-mono text-white/90">
              Photorealistic wall rendering simulations
            </span>
          </div>
        </div>
      </div>

      {/* Meet the team */}
      <div className="flex flex-col gap-6 pt-6 border-t border-ink/5">
        <div>
          <h3 className="font-display font-bold text-lg text-text-primary">Meet the Team</h3>
          <p className="text-xs text-text-secondary mt-1">
            {/* TODO(human): add real headshots and roles */}
            A passionate collection of creators designing the future of digital home visualization.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {[
            { name: 'Yash Raghuvanshi', role: 'Founder and CTO', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
            { name: 'Khushi Verma', role: 'Founder and CEO', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' }
          ].map((member) => (
            <div key={member.name} className="bg-white dark:bg-stone-900 border border-ink/10 p-4 rounded-xl flex items-center gap-3">
              <img 
                src={member.avatar} 
                alt={member.name} 
                className="w-10 h-10 rounded-full object-cover border border-brand-terracotta/20"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <h4 className="font-bold text-xs text-text-primary">{member.name}</h4>
                <p className="text-[10px] text-text-secondary">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-brand-terracotta/5 border border-brand-terracotta/20 p-8 rounded-none flex flex-col sm:flex-row justify-between items-center gap-6 mt-6">
        <div className="text-left">
          <h4 className="font-display font-bold text-base text-text-primary">Ready to transform your walls?</h4>
          <p className="text-xs text-text-secondary mt-1">Get 20 free credits when you join today. No credit card required.</p>
        </div>
        <button 
          onClick={handleBack}
          className="bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-bold text-xs uppercase tracking-widest px-6 py-3 shrink-0 rounded-none transition-all"
        >
          Try TrueTone Free →
        </button>
      </div>

    </div>
  );
}

/* ==========================================================================
   2. CONTACT SECTION
   ========================================================================== */
function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General inquiry');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError('Please enter your name');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return setError('Please enter a valid email address');
    if (message.length < 20) return setError('Message must be at least 20 characters long');

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        throw new Error('Could not submit form.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
      
      {/* Left Column: Interactive Info Card */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-brand-terracotta uppercase">
            Support & Inquiries
          </span>
          <h1 className="font-display font-bold text-3xl text-text-primary tracking-tight">
            We'd love to hear from you.
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            Have a question about credits, subscriptions, or rendering quality? Send our team a note below.
          </p>
        </div>
        
        {/* Interactive Cards */}
        <div className="grid grid-cols-1 gap-4 mt-4">
          <a href="mailto:hello@truetone.ai" className="group bg-white dark:bg-stone-900 border border-ink/10 p-5 shadow-sm hover:border-brand-terracotta/50 hover:shadow-md transition-all cursor-pointer flex gap-4 items-start rounded-xl no-underline">
            <div className="w-10 h-10 rounded-full bg-brand-terracotta/10 text-brand-terracotta flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-primary">Email Us directly</h3>
              <p className="text-[10px] text-text-secondary mt-1">Prefer to skip the form?</p>
              <span className="text-[10px] font-bold text-brand-terracotta mt-2 inline-block uppercase tracking-wider">hello@truetone.ai →</span>
            </div>
          </a>
          
          <button className="group bg-white dark:bg-stone-900 border border-ink/10 p-5 shadow-sm hover:border-brand-terracotta/50 hover:shadow-md transition-all cursor-pointer flex gap-4 items-start rounded-xl text-left">
            <div className="w-10 h-10 rounded-full bg-brand-terracotta/10 text-brand-terracotta flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-primary">Live Chat Support</h3>
              <p className="text-[10px] text-text-secondary mt-1">Chat with our team in real-time during business hours.</p>
              <span className="text-[10px] font-bold text-brand-terracotta mt-2 inline-block uppercase tracking-wider">Start Chat →</span>
            </div>
          </button>
        </div>
      </div>
      
      {/* Right Column: Form */}
      <div className="flex flex-col">

      {success ? (
        <div className="bg-white dark:bg-stone-900 border border-green-500/20 p-8 rounded-none text-center flex flex-col items-center justify-center gap-4 shadow-md">
          <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-display font-bold text-base text-text-primary">Message Sent Successfully!</h3>
            <p className="text-xs text-text-secondary leading-relaxed max-w-xs">
              Thank you for contacting us, <strong className="text-text-primary">{name}</strong>. Our human team will get back to you within 24 hours.
            </p>
          </div>
          <button 
            onClick={() => {
              setSuccess(false);
              setName('');
              setEmail('');
              setMessage('');
            }}
            className="text-xs font-bold text-brand-terracotta uppercase tracking-wider hover:underline"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 border border-ink/10 p-6 sm:p-8 flex flex-col gap-4 shadow-sm">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-none flex items-start gap-2">
              <span className="font-bold shrink-0">⚠️</span>
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="contact-name" className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Name
            </label>
            <input 
              id="contact-name"
              type="text"
              placeholder="Yash Raghuvanshi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2.5 border border-ink/10 rounded-none focus:outline-none focus:border-brand-terracotta bg-stone-50 dark:bg-stone-850 text-sm"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="contact-email" className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Email Address
            </label>
            <input 
              id="contact-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2.5 border border-ink/10 rounded-none focus:outline-none focus:border-brand-terracotta bg-stone-50 dark:bg-stone-850 text-sm"
            />
          </div>

          {/* Subject Dropdown */}
          <div className="flex flex-col gap-1">
            <label htmlFor="contact-subject" className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Subject Topic
            </label>
            <select
              id="contact-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2.5 border border-ink/10 rounded-none focus:outline-none focus:border-brand-terracotta bg-stone-50 dark:bg-stone-850 text-sm"
            >
              <option value="General inquiry">General Inquiry</option>
              <option value="Bug report">Bug Report / Engineering</option>
              <option value="Enterprise">Enterprise / Business</option>
              <option value="Press">Press / Media</option>
              <option value="Other">Other Issues</option>
            </select>
          </div>

          {/* Message Area */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label htmlFor="contact-message" className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Your Message
              </label>
              <span className="text-[10px] font-mono text-text-secondary">
                {message.length} chars (min 20)
              </span>
            </div>
            <textarea 
              id="contact-message"
              placeholder="Write your message here... please describe any issues in detail."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              rows={5}
              className="w-full px-3 py-2.5 border border-ink/10 rounded-none focus:outline-none focus:border-brand-terracotta bg-stone-50 dark:bg-stone-850 text-sm resize-none"
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-bold text-xs uppercase tracking-widest py-3.5 mt-2 rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? 'Sending Message...' : 'Send Message'}
          </button>

          <p className="text-center text-[10px] text-text-secondary mt-1">
            {/* TODO(human): update with real contact address */}
            Prefer direct email? Reach out to <a href="mailto:hello@truetone.ai" className="text-brand-terracotta font-bold hover:underline">hello@truetone.ai</a>
          </p>

        </form>
      )}
      </div>

    </div>
  );
}

/* ==========================================================================
   3. PRIVACY SECTION
   ========================================================================== */
function PrivacySection() {
  return (
    <div className="flex flex-col gap-8 text-left max-w-3xl mx-auto">
      

      <div className="flex flex-col gap-1.5 pb-4 border-b border-ink/5">
        <span className="text-[10px] font-mono font-bold tracking-widest text-text-secondary uppercase">
          TrueTone Privacy Policy
        </span>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-text-primary">
          Your Privacy is Paramount.
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Last Updated: June 26, 2026
        </p>
      </div>

      {/* Structured legal flow */}
      <article className="prose prose-stone dark:prose-invert text-xs sm:text-sm text-text-secondary leading-relaxed flex flex-col gap-6">
        
        <section className="flex flex-col gap-2">
          <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wider">1. What Data We Collect</h3>
          <p>
            We collect data necessary to provide a clean visualizer experience:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-2">
            <li><strong>Account Credentials:</strong> Full name and email address when you sign up.</li>
            <li><strong>Room Canvas Photos:</strong> High-resolution files you actively upload to generate recolorings.</li>
            <li><strong>Subscription Logs:</strong> Stripe customer tokens used to verify payment credentials and logs. We do not store raw card digits.</li>
            <li><strong>Interaction Events:</strong> Basic usage data (like style presets clicked) to optimize server workloads.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wider">2. How We Use Your Data</h3>
          <p>
            We process your information exclusively to deliver TrueTone services:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-2">
            <li>Synthesize high-fidelity wall masks and recoloring results via our Gemini API.</li>
            <li>Manage subscription cycles and credit wallet accounting.</li>
            <li>We do not sell, rent, or lease your photos or personal data to ad brokers or third parties.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wider">3. Room Photos Security</h3>
          <p>
            Your photos belong strictly to you. They are stored securely and used only to process your generations. You can erase all uploads instantly from your Profile Settings panel under Data Erasure.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wider">4. Third-Party Subprocessors</h3>
          <p>
            To deliver full-stack features, we integrate securely with verified services:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-2">
            <li><strong>Supabase:</strong> For account storage, identity, and token verification.</li>
            <li><strong>Stripe:</strong> Payment checkouts and volume credit accounting.</li>
            <li><strong>Google Gemini API:</strong> Model rendering and color translation.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wider">5. Your Data & Erasure Rights</h3>
          <p>
            You have full control. At any moment, you can export your entire profile payload or delete all visual uploads. For questions, contact us at <a href="mailto:privacy@truetone.ai" className="text-brand-terracotta font-semibold hover:underline">privacy@truetone.ai</a>.
          </p>
        </section>

      </article>

    </div>
  );
}

/* ==========================================================================
   4. TERMS SECTION
   ========================================================================== */
function TermsSection() {
  return (
    <div className="flex flex-col gap-8 text-left max-w-3xl mx-auto">
      

      <div className="flex flex-col gap-1.5 pb-4 border-b border-ink/5">
        <span className="text-[10px] font-mono font-bold tracking-widest text-text-secondary uppercase">
          TrueTone Terms of Service
        </span>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-text-primary">
          Agreements & Conditions.
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Last Updated: June 26, 2026
        </p>
      </div>

      <article className="prose prose-stone dark:prose-invert text-xs sm:text-sm text-text-secondary leading-relaxed flex flex-col gap-6">
        
        <section className="flex flex-col gap-2">
          <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wider">1. Acceptance of Terms</h3>
          <p>
            By creating a TrueTone AI account or accessing our dynamic visualizers, you agree to bind yourself to these terms. If you do not accept these conditions, you may not utilize our platform.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wider">2. What the Service Does</h3>
          <p>
            TrueTone provides high-fidelity, AI-driven mock wall painting previews. While our models are highly trained, visual mockups may vary from final physical paint due to individual monitor profiles, camera lens noise, or paint brand finishes. We always recommend trying a physical paint sample before purchase.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wider">3. Acceptable Use</h3>
          <p>
            You agree to upload only room/home photos that you own or are legally authorized to model. You may not upload inappropriate or illicit imagery. System abuse (spam, scraping, DDoS) will result in immediate termination of credits and accounts.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wider">4. Credit & Wallet Systems</h3>
          <p>
            TrueTone operates using credits. Credits are purchased via top-up packages or recurring subscriptions. Standard trial credits are free. Paid credits are non-refundable except at our team's sole discretion.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wider">5. Liability Limits</h3>
          <p>
            TrueTone is provided "as is" without warranty. We are not liable for physical painting errors, contractors costs, or inaccuracies. For support, reach out to <a href="mailto:legal@truetone.ai" className="text-brand-terracotta font-semibold hover:underline">legal@truetone.ai</a>.
          </p>
        </section>

      </article>

    </div>
  );
}

/* ==========================================================================
   5. COOKIES SECTION
   ========================================================================== */
function CookiesSection() {
  return (
    <div className="flex flex-col gap-8 text-left max-w-3xl mx-auto">
      
      <div className="flex flex-col gap-1.5 pb-4 border-b border-ink/5">
        <span className="text-[10px] font-mono font-bold tracking-widest text-text-secondary uppercase">
          TrueTone Cookie Policy
        </span>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-text-primary">
          Cookies & Storage.
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Last Updated: June 26, 2026
        </p>
      </div>

      <article className="prose prose-stone dark:prose-invert text-xs sm:text-sm text-text-secondary leading-relaxed flex flex-col gap-6">
        
        <p>
          TrueTone AI uses cookies and browser LocalStorage to provide a functional and responsive visualization app. We do not use third-party advertising cookies or trackers.
        </p>

        <section className="flex flex-col gap-2">
          <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wider">Essential Cookies</h3>
          <p>
            Our core workspace requires essential tokens to keep you securely signed in:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1 mt-1">
            <li><strong>Authentication:</strong> LocalStorage token to connect your browser to your projects.</li>
            <li><strong>Theme preference:</strong> Keeps your console in light, dark, or system preference.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display font-bold text-sm text-text-primary uppercase tracking-wider">Opting Out</h3>
          <p>
            You can disable cookies inside your browser's preference panel, but this will break your ability to log in and generate room recolorings.
          </p>
        </section>

      </article>

    </div>
  );
}

/* ==========================================================================
   6. CHANGELOG SECTION
   ========================================================================== */
function ChangelogSection() {
  const logs = [
    {
      version: 'v0.1.0',
      date: 'June 2026',
      title: 'Launch Day',
      bullets: [
        'Initial beta launch with 20 free signup credits.',
        'High-fidelity room wall extraction with Google Gemini integration.',
        'Preset styling models: Indian Contemporary (warm terracotta/spices) & Western Minimal (sage/slate/alabaster).',
        'Stripe payment sandbox simulation for Early Bird and top-up packages.',
        'Secure profile data management and multi-project capabilities.'
      ]
    },
    {
      version: 'v0.0.5',
      date: 'May 2026',
      title: 'Aesthetic Styling Curation',
      bullets: [
        'Added Sherwin-Williams and Asian Paints hex-brand matching tables.',
        'Implemented automatic palette contrast and brightness validators.',
        'Introduced layout choices: Full Wall, Accent Wall, and Two-Tone colors.'
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-8 text-left max-w-3xl mx-auto">
      
      <div className="flex flex-col gap-1.5 pb-4 border-b border-ink/5">
        <span className="text-[10px] font-mono font-bold tracking-widest text-brand-terracotta uppercase">
          TrueTone Product Updates
        </span>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-text-primary">
          Changelog & Milestones
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Follow along with our reverse-chronological development log.
        </p>
      </div>

      <div className="flex flex-col gap-10 mt-4">
        {logs.map((log) => (
          <div key={log.version} className="relative pl-6 sm:pl-8 border-l border-brand-terracotta/20 flex flex-col gap-3">
            
            {/* Timeline bullet indicator */}
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#FAF9F5] dark:bg-stone-950 border-2 border-brand-terracotta" />

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[9px] font-bold font-mono bg-brand-terracotta text-white px-2 py-0.5 uppercase">
                {log.version}
              </span>
              <span className="text-[10px] font-mono font-bold text-text-secondary">
                · {log.date}
              </span>
            </div>

            {/* Content */}
            <div className="text-left flex flex-col gap-2">
              <h3 className="font-display font-bold text-sm text-text-primary tracking-tight">
                “{log.title}”
              </h3>
              <ul className="flex flex-col gap-2 text-xs sm:text-sm text-text-secondary list-disc pl-5">
                {log.bullets.map((b, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {b}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
