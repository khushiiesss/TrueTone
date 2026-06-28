import React, { useState } from 'react';
import { useAppStore } from '../store.js';
import { Coins, ShieldCheck, CreditCard, Sparkles, Receipt, RefreshCw, Layers, Check } from 'lucide-react';

export default function BillingView() {
  const { 
    setView, 
    wallet, 
    subscription, 
    ledger, 
    checkoutCredits 
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'packs' | 'subscriptions' | 'history'>('packs');
  const [checkoutPayload, setCheckoutPayload] = useState<{
    type: 'subscription' | 'topup';
    plan?: string;
    packId?: string;
    price: number;
    title: string;
    credits: number;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Simulated Checkout execution
  const handleSimulatePayment = async () => {
    if (!checkoutPayload) return;
    setIsProcessing(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    await checkoutCredits({
      type: checkoutPayload.type,
      plan: checkoutPayload.plan,
      packId: checkoutPayload.packId
    });

    setIsProcessing(false);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setCheckoutPayload(null);
    setIsSuccess(false);
  };

  const packs = [
    { id: 'pack_100', credits: 100, price: 9, label: 'Starter Pack', popular: false },
    { id: 'pack_300', credits: 300, price: 24, label: 'Standard Bundle', popular: true },
    { id: 'pack_1000', credits: 1000, price: 69, label: 'Professional Kit', popular: false }
  ];

  const subscriptions = [
    { id: 'trial', name: 'Free Trial', price: 0, credits: 20, desc: 'Introductory preview plan', retention: '7 days', watermark: true },
    { id: 'early_bird', name: 'Early Bird', price: 9, credits: 150, desc: 'Ideal for home owners', retention: '30 days', watermark: false },
    { id: 'pro', name: 'Pro Studio', price: 29, credits: 600, desc: 'Great for architects & visualizers', retention: '90 days', watermark: false }
  ];

  return (
    <div className="min-h-screen bg-bg-base flex flex-col selection:bg-brand-terracotta/20 selection:text-brand-terracotta" id="billing_view">
      
      {/* Navbar header */}
      <header className="sticky top-0 z-40 w-full bg-[#FAFAF8]/95 backdrop-blur-md border-b border-ink/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
            <span className="font-display text-xl font-bold tracking-tight text-text-primary">
              TrueTone <span className="font-serif italic font-normal text-brand-terracotta">AI</span>
            </span>
          </div>
          <span className="text-[9px] tracking-[0.15em] font-bold text-brand-terracotta uppercase border border-brand-terracotta/30 px-2 py-0.5 ml-2">Billing Center</span>
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

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 flex flex-col gap-10">
        
        {/* Top summary row */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Credit meter details */}
          <div className="bg-white rounded-none border border-ink/10 p-6 flex items-center justify-between">
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.15em]">Credit Balance</span>
              <span className="text-5xl font-normal font-serif text-text-primary">{wallet?.balance ?? 0}</span>
              <span className="text-[10px] text-text-secondary leading-relaxed font-sans max-w-[280px]">1 credit = 1 paint visualization render. Multiply based on layout selections.</span>
            </div>
            <div className="w-14 h-14 border border-brand-terracotta/20 bg-brand-terracotta/5 flex items-center justify-center text-brand-terracotta">
              <Coins className="w-6 h-6" />
            </div>
          </div>

          {/* Active plan details */}
          <div className="bg-white rounded-none border border-ink/10 p-6 flex items-center justify-between">
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.15em]">Plan & Subscription</span>
              <span className="text-3xl font-normal font-serif text-text-primary capitalize">{subscription?.plan?.replace('_', ' ') ?? 'trial'}</span>
              <span className="text-[9px] text-brand-sage uppercase tracking-wider font-bold flex items-center gap-1.5 mt-1">
                <ShieldCheck className="w-4 h-4" /> Renewal: {subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="w-14 h-14 border border-brand-sage/20 bg-brand-sage/5 flex items-center justify-center text-brand-sage">
              <Receipt className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* Tab Selection */}
        <section className="flex border-b border-ink/10 gap-8">
          {(['packs', 'subscriptions', 'history'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-display font-bold text-xs uppercase tracking-[0.15em] relative transition-all ${activeTab === tab ? 'text-brand-terracotta' : 'text-text-secondary hover:text-text-primary'}`}
            >
              {tab === 'packs' ? 'Buy Credit Packs' : tab === 'subscriptions' ? 'Upgrade Plans' : 'Transaction History'}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-terracotta" />
              )}
            </button>
          ))}
        </section>

        {/* Tabs Content */}
        <section className="flex-1">
          {/* Packs Grid */}
          {activeTab === 'packs' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packs.map(pack => (
                <div 
                  key={pack.id} 
                  className={`bg-white rounded-none border p-8 flex flex-col justify-between relative ${pack.popular ? 'border border-brand-terracotta bg-[#FAFAF8]' : 'border-ink/10'}`}
                >
                  {pack.popular && (
                    <span className="absolute top-0 right-6 transform -translate-y-1/2 bg-brand-terracotta text-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 border border-brand-terracotta">
                      Best Value
                    </span>
                  )}
                  <div>
                    <h4 className="font-display font-semibold text-base text-text-primary uppercase tracking-wide">{pack.label}</h4>
                    <span className="text-4xl font-normal font-serif text-text-primary mt-4 block">{pack.credits} Credits</span>
                    <p className="text-[10px] uppercase tracking-wider text-text-secondary font-medium mt-1">One-time balance allocation</p>
                    <hr className="border-ink/5 my-5" />
                    <ul className="text-xs space-y-3 text-text-secondary font-medium text-left">
                      <li>✔ Immediate credit wallet addition</li>
                      <li>✔ Unused credits never expire</li>
                      <li>✔ Retain complete full-res matching</li>
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => setCheckoutPayload({
                      type: 'topup',
                      packId: pack.id,
                      price: pack.price,
                      title: pack.label,
                      credits: pack.credits
                    })}
                    className="w-full mt-8 bg-brand-terracotta hover:bg-brand-terracotta-hover text-white py-3.5 px-4 rounded-none text-[10px] uppercase tracking-[0.15em] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Buy Pack for ${pack.price}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Subscriptions Grid */}
          {activeTab === 'subscriptions' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {subscriptions.map(sub => {
                const isActive = subscription?.plan === sub.id;
                return (
                  <div 
                    key={sub.id}
                    className={`bg-white rounded-none border p-8 flex flex-col justify-between relative ${isActive ? 'border border-brand-sage bg-[#FAFAF8]' : 'border-ink/10'}`}
                  >
                    {isActive && (
                      <span className="absolute top-0 right-6 transform -translate-y-1/2 bg-brand-sage text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Current Plan
                      </span>
                    )}
                    <div>
                      <h4 className="font-display font-semibold text-base text-text-primary uppercase tracking-wide">{sub.name}</h4>
                      <div className="my-4">
                        <span className="text-4xl font-normal font-serif text-text-primary">${sub.price}</span>
                        <span className="text-text-secondary text-xs uppercase tracking-wide font-medium ml-1">/ mo</span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">{sub.desc}</p>
                      <hr className="border-ink/5 my-5" />
                      <ul className="text-xs space-y-3 text-text-secondary font-medium text-left">
                        <li className="flex items-center gap-1.5">✔ {sub.credits} monthly credits</li>
                        <li className="flex items-center gap-1.5">✔ {sub.retention} retention</li>
                        <li className="flex items-center gap-1.5 font-semibold">
                          {sub.watermark ? '❌ Watermark exports' : '✔ No watermark exports'}
                        </li>
                      </ul>
                    </div>
                    
                    <button
                      disabled={isActive || sub.id === 'trial'}
                      onClick={() => setCheckoutPayload({
                        type: 'subscription',
                        plan: sub.id,
                        price: sub.price,
                        title: `${sub.name} Subscription`,
                        credits: sub.credits
                      })}
                      className={`w-full mt-8 py-3.5 px-4 rounded-none text-[10px] uppercase tracking-[0.15em] font-bold transition-all flex items-center justify-center gap-1.5 ${isActive ? 'bg-[#FAFAF8] text-stone-400 border border-ink/5 cursor-not-allowed' : 'bg-brand-sage hover:bg-brand-sage-hover text-white cursor-pointer'}`}
                    >
                      {isActive ? 'Your Active Plan' : sub.id === 'trial' ? 'Unavailable' : `Subscribe for $${sub.price}/mo`}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Audit History Log */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-none border border-ink/10 p-8 flex flex-col gap-4 text-left">
              <h4 className="font-display font-semibold text-base text-text-primary">Ledger Balance Statement</h4>
              <p className="text-xs text-text-secondary">Official atomic ledger tracking your credit allocation and workspace generations.</p>
              
              {ledger.length === 0 ? (
                <div className="py-16 text-center text-xs text-text-secondary font-serif italic">
                  No statement balances logged yet in your tenancy.
                </div>
              ) : (
                <div className="overflow-x-auto mt-4">
                  <table className="w-full border-collapse text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-ink/10 text-text-secondary font-bold uppercase tracking-[0.15em] text-[10px]">
                        <th className="py-3 px-2">Date</th>
                        <th className="py-3 px-2">Transaction Reason</th>
                        <th className="py-3 px-2">Delta</th>
                        <th className="py-3 px-2">Balance After</th>
                        <th className="py-3 px-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5 text-text-secondary">
                      {ledger.map((entry) => (
                        <tr key={entry.id} className="hover:bg-stone-50 transition-colors">
                          <td className="py-4 px-2">{new Date(entry.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 px-2 font-sans font-bold text-text-primary capitalize">
                            {entry.reason.replace('_', ' ')}
                          </td>
                          <td className={`py-4 px-2 font-bold ${entry.delta > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {entry.delta > 0 ? `+${entry.delta}` : entry.delta}
                          </td>
                          <td className="py-4 px-2 font-mono">{entry.balanceAfter} cr</td>
                          <td className="py-4 px-2 text-right">
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-none border border-emerald-100 uppercase tracking-wider">
                              Success
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Simulated Stripe Checkout Portal Overlay */}
      {checkoutPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#FAFAF8] rounded-none border border-ink/15 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-250 text-left">
            
            {/* Checkout Header bar */}
            <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-terracotta" />
                <span className="font-display text-xs uppercase tracking-[0.15em] font-bold">Stripe Secure Checkout</span>
              </div>
              <span className="text-[9px] tracking-widest bg-white/10 text-white font-extrabold px-2 py-0.5 border border-white/20">TEST MODE</span>
            </div>

            {/* Content body */}
            <div className="p-8 flex flex-col gap-6">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center text-center py-6 gap-4">
                  <div className="w-12 h-12 border border-brand-sage/25 bg-brand-sage/5 text-brand-sage flex items-center justify-center font-bold text-lg animate-bounce">
                    ✔
                  </div>
                  <h4 className="font-display font-semibold text-lg text-text-primary">Payment Authorized</h4>
                  <p className="text-xs text-text-secondary leading-relaxed max-w-xs font-sans">
                    Stripe successfully authorized the payment of <span className="font-bold text-text-primary">${checkoutPayload.price}</span>. We've granted <span className="font-semibold text-brand-terracotta">+{checkoutPayload.credits} credits</span> and updated your account status instantly.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-4 bg-brand-terracotta hover:bg-brand-terracotta-hover text-white text-[10px] uppercase tracking-wider font-bold py-3 px-6 rounded-none transition-all cursor-pointer"
                  >
                    Return to Console
                  </button>
                </div>
              ) : (
                <>
                  {/* Summary */}
                  <div className="bg-white rounded-none p-5 flex justify-between items-center border border-ink/10">
                    <div className="flex flex-col text-left gap-1">
                      <span className="text-[9px] uppercase font-bold text-text-secondary tracking-[0.15em]">Item Purchase</span>
                      <span className="text-sm font-bold text-text-primary">{checkoutPayload.title}</span>
                      <span className="text-[10px] uppercase tracking-wider text-brand-terracotta font-bold">+{checkoutPayload.credits} Credits Addition</span>
                    </div>
                    <span className="text-2xl font-normal font-serif text-text-primary">${checkoutPayload.price}.00</span>
                  </div>

                  {/* Payment Form (Mock Stripe Elements) */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.15em]">Cardholder Name</label>
                      <input 
                        type="text" 
                        defaultValue="Yash Raghuvanshi" 
                        className="w-full bg-white border border-ink/10 rounded-none px-4 py-3 text-xs uppercase tracking-wider font-semibold focus:outline-none focus:border-brand-terracotta"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.15em]">Card Details (Stripe Test)</label>
                      <div className="w-full bg-white border border-ink/10 rounded-none px-4 py-3 text-xs flex items-center gap-2 font-mono text-text-secondary">
                        <CreditCard className="w-4 h-4 text-stone-400" />
                        <span>4242  4242  4242  4242</span>
                        <span className="ml-auto">12/28</span>
                        <span>424</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-text-secondary leading-relaxed font-sans italic">
                    By confirming this payment, you authorize the test sandbox to simulate real-time webhook events and provision sandbox credits securely.
                  </span>

                  {/* Confirm actions */}
                  <div className="flex gap-3 justify-end pt-4 border-t border-ink/5">
                    <button
                      onClick={handleClose}
                      disabled={isProcessing}
                      className="border border-ink/10 text-text-primary text-[10px] uppercase tracking-wider font-bold px-4 py-2.5 rounded-none hover:bg-stone-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSimulatePayment}
                      disabled={isProcessing}
                      className="bg-stone-900 hover:bg-black text-white text-[10px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-none transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Authorizing...
                        </>
                      ) : (
                        `Authorize Payment ($${checkoutPayload.price}.00)`
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
