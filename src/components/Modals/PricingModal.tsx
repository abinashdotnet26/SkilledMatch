import React, { useState } from 'react';
import {
  X,
  Check,
  Zap,
  Sparkles,
  Bot,
  Shield,
  CreditCard,
  Lock,
  ArrowRight,
  Flame,
  Star,
  Users,
  QrCode,
  Smartphone,
  Crown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserSubscription, UserPlanTier } from '../../types/protocol';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  onUpgradePlan: (plan: UserPlanTier, bonusCredits?: number) => void;
  onBuyCredits: (amount: number, price: number) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onUpgradePlan,
  onBuyCredits,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [currency, setCurrency] = useState<'USD' | 'INR'>(subscription.currency || 'USD');
  const [selectedPlan, setSelectedPlan] = useState<UserPlanTier>('pro');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutType, setCheckoutType] = useState<'plan' | 'credits'>('plan');
  const [creditPack, setCreditPack] = useState<{ amount: number; price: number; priceInr: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [upiId, setUpiId] = useState('user@okhdfcbank');

  if (!isOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'EARLY20' || promoCode.trim().toUpperCase() === 'SKILLMATCH') {
      setDiscountPercent(20);
      setPromoError('');
    } else {
      setPromoError('Invalid coupon. Try "EARLY20" for 20% off');
      setDiscountPercent(0);
    }
  };

  const getPlanPrice = (plan: UserPlanTier) => {
    if (plan === 'free') return 0;
    if (currency === 'INR') {
      const base = plan === 'pro' ? (billingCycle === 'monthly' ? 1299 : 899) : (billingCycle === 'monthly' ? 2799 : 1999);
      if (discountPercent > 0) return Math.round(base * (1 - discountPercent / 100));
      return base;
    }
    const base = plan === 'pro' ? (billingCycle === 'monthly' ? 19 : 14) : (billingCycle === 'monthly' ? 44 : 34);
    if (discountPercent > 0) {
      return Math.round(base * (1 - discountPercent / 100));
    }
    return base;
  };

  const currSymbol = currency === 'INR' ? '₹' : '$';

  const handleStartCheckout = (plan: UserPlanTier) => {
    if (plan === 'free') {
      onUpgradePlan('free');
      onClose();
      return;
    }
    setSelectedPlan(plan);
    setCheckoutType('plan');
    setShowCheckout(true);
  };

  const handleStartCreditCheckout = (amount: number, priceUsd: number, priceInr: number) => {
    setCreditPack({ amount, price: priceUsd, priceInr });
    setCheckoutType('credits');
    setShowCheckout(true);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowCheckout(false);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#f59e0b'],
      });

      if (checkoutType === 'plan') {
        onUpgradePlan(selectedPlan, selectedPlan === 'autopilot' ? 50 : 20);
      } else if (creditPack) {
        onBuyCredits(creditPack.amount, currency === 'INR' ? creditPack.priceInr : creditPack.price);
      }
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!showCheckout ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>UPGRADE TO SKILLMATCH PRO & AUTOPILOT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Land Your Next Tech Role in Half the Time
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Supercharge your job hunt with automated ATS submissions, stealth scraper alerts, and direct recruiter outreach.
              </p>

              {/* Currency & Billing Toggles */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {/* Currency Switcher */}
                <div className="inline-flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      currency === 'USD' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    🇺🇸 USD ($)
                  </button>
                  <button
                    onClick={() => setCurrency('INR')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      currency === 'INR' ? 'bg-emerald-500 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    🇮🇳 INR (₹)
                  </button>
                </div>

                {/* Billing Cycle */}
                <div className="inline-flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      billingCycle === 'monthly' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-3.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      billingCycle === 'yearly' ? 'bg-emerald-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>Yearly (Save 25%)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Admin Free Guarantee Notice */}
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Admin / Owner Privilege:</strong> Using and running SkillMatch is <strong>100% free</strong> for you as the administrator. Only external job seekers & employers pay these fees.
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                0% Owner Cost
              </span>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Plan 1: Free Starter */}
              <div className={`p-6 rounded-2xl border transition flex flex-col justify-between ${
                subscription.plan === 'free'
                  ? 'bg-zinc-900/40 border-zinc-700'
                  : 'bg-zinc-900/20 border-zinc-800/80'
              }`}>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Starter</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">For casual browsing</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black font-mono text-white">{currSymbol}0</span>
                    <span className="text-xs text-zinc-500 font-mono">/ month</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-zinc-300 pt-2 border-t border-zinc-800">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>3 Concierge auto-applies / day</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Global & India direct ATS feed</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Basic CV match percentages</span>
                    </li>
                    <li className="flex items-center gap-2 text-zinc-500">
                      <span className="w-4 h-4 text-center font-mono">✕</span>
                      <span>No verified recruiter contacts</span>
                    </li>
                    <li className="flex items-center gap-2 text-zinc-500">
                      <span className="w-4 h-4 text-center font-mono">✕</span>
                      <span>24h delay on stealth postings</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  {subscription.plan === 'free' ? (
                    <div className="w-full py-2.5 rounded-xl bg-zinc-800 text-zinc-400 text-xs text-center font-semibold border border-zinc-700">
                      Current Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartCheckout('free')}
                      className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer transition"
                    >
                      Downgrade to Starter
                    </button>
                  )}
                </div>
              </div>

              {/* Plan 2: Pro Concierge */}
              <div className={`p-6 rounded-2xl border-2 transition relative flex flex-col justify-between ${
                subscription.plan === 'pro'
                  ? 'bg-zinc-900 border-cyan-500 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                  : 'bg-zinc-900/70 border-emerald-500/60 shadow-lg'
              }`}>
                <div className="absolute -top-3 right-5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider shadow">
                  Most Popular
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <span>Pro Concierge</span>
                      <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Active seekers aiming for fast offers</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black font-mono text-white">
                      {currSymbol}{getPlanPrice('pro').toLocaleString()}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      / month {billingCycle === 'yearly' && '(billed annually)'}
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-zinc-200 pt-2 border-t border-zinc-800">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>20 Concierge auto-applies / day</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>Zero delay</strong> instant ATS stealth scrapes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>WhatsApp & Telegram instant push alerts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>15 verified recruiter unlocks</strong> / mo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>AI tailored resumes & ATS gap optimization</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  {subscription.plan === 'pro' ? (
                    <div className="w-full py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs text-center font-bold border border-cyan-500/40">
                      Active Subscription
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartCheckout('pro')}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                      <span>Upgrade to Pro Concierge</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Plan 3: Autopilot Career Agent */}
              <div className={`p-6 rounded-2xl border transition flex flex-col justify-between ${
                subscription.plan === 'autopilot'
                  ? 'bg-zinc-900 border-amber-500 shadow-xl'
                  : 'bg-zinc-900/40 border-zinc-800'
              }`}>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <span>Autopilot Agent</span>
                      <Bot className="w-4 h-4 text-amber-400" />
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Maximum volume & executive leverage</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black font-mono text-white">
                      {currSymbol}{getPlanPrice('autopilot').toLocaleString()}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">/ month</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-zinc-300 pt-2 border-t border-zinc-800">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span><strong>50 Concierge auto-applies / day</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span><strong>Unlimited recruiter unlocks</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Automated warm recruiter outreach DM bot</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Priority ATS execution queue</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Interview Playbook & STAR answer coach</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  {subscription.plan === 'autopilot' ? (
                    <div className="w-full py-2.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs text-center font-bold border border-amber-500/40">
                      Active Subscription
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartCheckout('autopilot')}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                      <span>Upgrade to Autopilot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Pay-as-you-go Credit Packs */}
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>Pay-As-You-Go Credits (No Monthly Commitment)</span>
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Your current credit balance: <strong className="text-emerald-400 font-mono">{subscription.credits} credits</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between gap-2.5">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>Starter Pocket Pack</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded font-mono">NEW</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">5 Concierge Applications</div>
                  </div>
                  <button
                    onClick={() => handleStartCreditCheckout(5, 3, 199)}
                    className="w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-emerald-400 border border-zinc-700 transition cursor-pointer"
                  >
                    {currSymbol}{currency === 'INR' ? '199' : '3'} Buy Pack
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between gap-2.5">
                  <div>
                    <div className="text-xs font-bold text-white">25 Applications Booster</div>
                    <div className="text-[11px] text-zinc-400">Never expires • Fast submission</div>
                  </div>
                  <button
                    onClick={() => handleStartCreditCheckout(25, 9, 699)}
                    className="w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-emerald-400 border border-zinc-700 transition cursor-pointer"
                  >
                    {currSymbol}{currency === 'INR' ? '699' : '9'} Buy Pack
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between gap-2.5">
                  <div>
                    <div className="text-xs font-bold text-white">10 Verified Recruiter Unlocks</div>
                    <div className="text-[11px] text-zinc-400">Direct hiring manager emails</div>
                  </div>
                  <button
                    onClick={() => handleStartCreditCheckout(10, 5, 399)}
                    className="w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-amber-400 border border-zinc-700 transition cursor-pointer"
                  >
                    {currSymbol}{currency === 'INR' ? '399' : '5'} Buy Pack
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Checkout Modal Screen */
          <div className="space-y-6 max-w-lg mx-auto py-2 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Secure Checkout</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  {checkoutType === 'plan'
                    ? `Upgrading to ${selectedPlan.toUpperCase()} Plan (${billingCycle})`
                    : `Purchasing ${creditPack?.amount} Credits`}
                </p>
              </div>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Change Plan
              </button>
            </div>

            {/* Total Due */}
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Item</span>
                <span className="text-white font-medium">
                  {checkoutType === 'plan' ? `SkillMatch ${selectedPlan.toUpperCase()} Subscription` : `${creditPack?.amount} Credit Pack`}
                </span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-400 font-mono">
                  <span>Coupon Discount ({discountPercent}%)</span>
                  <span>-20%</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                <span>Total Due Today</span>
                <span className="text-emerald-400 font-mono">
                  {currSymbol}
                  {checkoutType === 'plan'
                    ? getPlanPrice(selectedPlan).toLocaleString()
                    : (currency === 'INR' ? creditPack?.priceInr : creditPack?.price)?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Coupon input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2 text-xs">
              <input
                type="text"
                placeholder="Promo code (e.g. EARLY20)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 uppercase font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-medium cursor-pointer"
              >
                Apply
              </button>
            </form>
            {promoError && <p className="text-[11px] text-rose-400">{promoError}</p>}
            {discountPercent > 0 && <p className="text-[11px] text-emerald-400 font-semibold">✓ 20% Discount Applied!</p>}

            {/* Payment Method Switcher (Card vs UPI for India) */}
            {currency === 'INR' && (
              <div className="flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    paymentMethod === 'upi' ? 'bg-emerald-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>UPI / QR (GPay, PhonePe, Paytm)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    paymentMethod === 'card' ? 'bg-emerald-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Cards / NetBanking</span>
                </button>
              </div>
            )}

            {/* UPI Option */}
            {currency === 'INR' && paymentMethod === 'upi' ? (
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 text-xs">
                <div>
                  <label className="text-zinc-300 font-medium">Enter UPI VPA / ID</label>
                  <div className="relative mt-1">
                    <Smartphone className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi or username@okaxis"
                      className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-white font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span>Scan QR code with Google Pay, PhonePe, Paytm or BHIM</span>
                </div>
              </div>
            ) : (
              /* Card Form */
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-zinc-400 font-medium">Card Number (Visa, RuPay, MasterCard)</label>
                  <div className="relative mt-1">
                    <CreditCard className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      readOnly
                      value="•••• •••• •••• 4242 (Demo Gateway)"
                      className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-200 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 font-medium">Expiration</label>
                    <input
                      type="text"
                      readOnly
                      value="12/28"
                      className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 font-medium">CVC</label>
                    <input
                      type="text"
                      readOnly
                      value="•••"
                      className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-200 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/25"
              >
                {isProcessing ? (
                  <span>Authorizing Payment via {currency === 'INR' ? 'Razorpay/UPI' : 'Stripe'}...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      Pay {currSymbol}
                      {checkoutType === 'plan'
                        ? getPlanPrice(selectedPlan).toLocaleString()
                        : (currency === 'INR' ? creditPack?.priceInr : creditPack?.price)?.toLocaleString()}{' '}
                      & Activate
                    </span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-zinc-500 text-center mt-2 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>
                  {currency === 'INR'
                    ? 'Secure Razorpay / UPI Gateway • 256-bit Encrypted'
                    : 'Stripe 256-bit SSL encrypted • Cancel anytime with 1 click'}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
