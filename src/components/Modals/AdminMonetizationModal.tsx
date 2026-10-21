import React, { useState } from 'react';
import {
  X,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Globe,
  HelpCircle,
  Crown,
  Building,
  Smartphone,
  Copy,
  Check,
  Lock,
  ArrowRight,
  Sparkles,
  BarChart3,
  Server,
  Layers,
  CreditCard,
  Percent,
} from 'lucide-react';
import { UserSubscription } from '../../types/protocol';

interface AdminMonetizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  onToggleAdminStatus: () => void;
  currency: 'USD' | 'INR';
  onToggleCurrency: (c: 'USD' | 'INR') => void;
}

export const AdminMonetizationModal: React.FC<AdminMonetizationModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onToggleAdminStatus,
  currency,
  onToggleCurrency,
}) => {
  const [activeTab, setActiveTab] = useState<'income' | 'database' | 'admin_free' | 'publishing' | 'global_coverage'>('income');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const isINR = currency === 'INR';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800 pr-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/40">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">Admin & Monetization Hub</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
                  ADMIN 100% FREE
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Income streams, INR/USD payment handling, zero-expense launch, and admin controls
              </p>
            </div>
          </div>

          {/* Quick Currency Switcher */}
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-1 self-start sm:self-auto">
            <span className="text-[11px] text-zinc-400 px-2 font-medium">Currency:</span>
            <button
              onClick={() => onToggleCurrency('INR')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                isINR
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => onToggleCurrency('USD')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                !isINR
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              $ USD
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-zinc-800/80 no-scrollbar">
          <button
            onClick={() => setActiveTab('income')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'income'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>How You Earn Income (Optimized Pricing)</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'database'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>How Database is Handled</span>
          </button>

          <button
            onClick={() => setActiveTab('admin_free')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'admin_free'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Why Admin is 100% Free</span>
          </button>

          <button
            onClick={() => setActiveTab('publishing')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'publishing'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Minimum Expenses & Publishing</span>
          </button>

          <button
            onClick={() => setActiveTab('global_coverage')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'global_coverage'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Global Coverage & All Job Types</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-5">
          {/* TAB 1: HOW TO EARN INCOME */}
          {activeTab === 'income' && (
            <div className="space-y-6">
              {/* Simulated Revenue KPI Header */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5">
                  <div className="text-[11px] text-zinc-400 font-medium">Monthly Revenue (MRR)</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-1">
                    {isINR ? '₹2,84,500' : '$3,420'}
                  </div>
                  <div className="text-[10px] text-emerald-500/80 font-medium mt-0.5">↑ +24% this month</div>
                </div>

                <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5">
                  <div className="text-[11px] text-zinc-400 font-medium">Paying Subscribers</div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
                    114
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Pro & Autopilot tiers</div>
                </div>

                <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5">
                  <div className="text-[11px] text-zinc-400 font-medium">Employer Listings Sold</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono mt-1">
                    {isINR ? '₹79,992' : '$1,592'}
                  </div>
                  <div className="text-[10px] text-amber-500/80 mt-0.5">8 companies @ {isINR ? '₹9,999' : '$199'}</div>
                </div>

                <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5">
                  <div className="text-[11px] text-zinc-400 font-medium">Gross Profit Margin</div>
                  <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono mt-1">
                    98.2%
                  </div>
                  <div className="text-[10px] text-cyan-500/80 mt-0.5">Zero physical inventory</div>
                </div>
              </div>

              {/* The 5 Revenue Streams */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Your 5 Income Engines in SkillMatch AI
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Stream 1 */}
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        STREAM 1: B2C SUBSCRIPTIONS (OPTIMIZED)
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        {isINR ? '₹1,299 - ₹2,799/mo' : '$19 - $44/mo'}
                      </span>
                    </div>
                    <div className="font-semibold text-white text-sm">Monthly / Yearly Job Seeker Subscriptions</div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Optimized for high conversion: Pro at ₹1,299/mo ($19) and Autopilot at ₹2,799/mo ($44) for daily auto-applications, custom ATS resume tailoring, and interview prep kits.
                    </p>
                  </div>

                  {/* Stream 2 */}
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                        STREAM 2: PAY-PER-APPLICATION CREDITS
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        {isINR ? '₹199 - ₹699' : '$3 - $9'}
                      </span>
                    </div>
                    <div className="font-semibold text-white text-sm">Micro-transaction Credit Packs</div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Budget-friendly credit bundles: ₹199 for 5 applications, ₹699 for 25 applications, and ₹399 for 10 verified recruiter unlocks.
                    </p>
                  </div>

                  {/* Stream 3 */}
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        STREAM 3: B2B EMPLOYER JOB POSTS
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        {isINR ? '₹4,999 / post' : '$99 / post'}
                      </span>
                    </div>
                    <div className="font-semibold text-white text-sm">Featured Job Listings for Hiring Teams</div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Optimized from ₹9,999 to ₹4,999 ($99) to encourage early startups and agencies to list roles quickly and acquire talent with zero friction.
                    </p>
                  </div>

                  {/* Stream 4 */}
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                        STREAM 4: RECRUITER CONTACT UNLOCKS
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        {isINR ? '₹99 - ₹199 / contact' : '$2 - $5'}
                      </span>
                    </div>
                    <div className="font-semibold text-white text-sm">Direct Hiring Manager & Recruiter Access</div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Candidates pay to unlock verified work emails and direct LinkedIn handles of hiring managers, along with an AI-generated cold pitch message tailored to the job.
                    </p>
                  </div>

                  {/* Stream 5 */}
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        STREAM 5: WHATSAPP / TELEGRAM VIP ALERTS
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        {isINR ? '₹299/mo' : '$5/mo'}
                      </span>
                    </div>
                    <div className="font-semibold text-white text-sm">Instant Stealth Job Alerts Bot</div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Subscribers receive instant pings on WhatsApp or Telegram the moment an ATS role goes live (under 5 applicants), allowing them to apply before anyone else on LinkedIn notices.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Gateways for India & Global */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Payment Processing Setup (INR & USD)</span>
                  </div>
                  <span className="text-[11px] text-zinc-400">Zero Monthly Gateway Fee</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>🇮🇳 For India: Razorpay / Cashfree</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1 rounded">UPI, Cards, NetBanking</span>
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      Collects INR via Google Pay, PhonePe, Paytm, BHIM UPI and Indian credit/debit cards. Payouts directly to your Indian bank account.
                    </p>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>🌍 For Worldwide: Stripe / Lemon Squeezy</span>
                      <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1 rounded">Global Cards & Apple Pay</span>
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      Collects USD, EUR, GBP from US, Europe, and international applicants. Handles foreign cards and automated monthly invoices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HOW TO HANDLE DATABASE */}
          {activeTab === 'database' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-cyan-950/60 border border-blue-500/40 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Layers className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span>Database Handling & Architecture Guide</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  SkillMatch is designed with a modular architecture. You can run it effortlessly on $0/free cloud databases (Firebase Firestore or PostgreSQL) with automatic failover and local reactive caching.
                </p>
              </div>

              {/* Current vs Production Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>1. Current Fast Cache</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Client state + server in-memory mock engine. Instant 0ms response time, zero database cold start, and full reactivity for testing and demos.
                  </p>
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                    ACTIVE NOW ($0 Cost)
                  </span>
                </div>

                <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-cyan-400">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <span>2. PostgreSQL (Relational)</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Recommended for high-volume transactions and relational integrity. Supported on Cloud SQL, Supabase, Neon, or Railway.
                  </p>
                  <span className="inline-block px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono">
                    Free Tier Available
                  </span>
                </div>

                <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-400">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>3. Firebase Firestore</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    NoSQL document store with live WebSockets. 50,000 free reads/day. Ideal for real-time concierge queues and live ATS feeds.
                  </p>
                  <span className="inline-block px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono">
                    50k Free Reads / Day
                  </span>
                </div>
              </div>

              {/* Schema Design */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span>Production Schema Tables & Collections</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                    <div className="font-bold text-white font-mono text-[11px]">jobs (Table / Collection)</div>
                    <p className="text-zinc-400 text-[11px]">
                      Stores id, title, company, salaryRange, minSalaryUsd, salaryCurrency (INR/USD), category (Java, .NET, QA, Frontend), atsSource, applicantCount, recruiter contacts.
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                    <div className="font-bold text-white font-mono text-[11px]">users & candidate_profiles</div>
                    <p className="text-zinc-400 text-[11px]">
                      Stores email, isAdmin flag, resumeText, skills array (e.g. C#, .NET, Java, Playwright), subscriptionPlan, credits balance, and target preferences.
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                    <div className="font-bold text-white font-mono text-[11px]">application_pipeline</div>
                    <p className="text-zinc-400 text-[11px]">
                      Tracks stages: saved, queued, applied, screening, technical, offer. Records match score, ATS submission timestamp, and recruiter notes.
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                    <div className="font-bold text-white font-mono text-[11px]">payments & webhook_logs</div>
                    <p className="text-zinc-400 text-[11px]">
                      Logs Razorpay / Stripe payment IDs, INR/USD amounts, plan upgrades, and promo discounts for audited financial records.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WHY ADMIN IS 100% FREE */}
          {activeTab === 'admin_free' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/40 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>YES! As the Admin & Owner, SkillMatch is 100% FREE for You</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  You never pay for using your own application! You are the platform owner. All premium features, unlimited AI applications, recruiter unlocks, and job posting permissions are permanently free for your account.
                </p>
              </div>

              {/* Admin Privileges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>Unlimited Concierge Applications</span>
                  </div>
                  <p className="text-zinc-400">
                    Bypasses all user daily limits (no 3/day or 20/day caps). As admin, you have unlimited credits (<span className="text-emerald-400 font-mono font-bold">∞</span>) to test or run applications.
                  </p>
                </div>

                <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Building className="w-4 h-4 text-emerald-400" />
                    <span>Free Job Postings ($199 / ₹9,999 Waived)</span>
                  </div>
                  <p className="text-zinc-400">
                    Employers pay $199 to list jobs, but you can add, edit, or delete any job posting in the feed for free anytime.
                  </p>
                </div>

                <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Full Gemini AI Access at $0 Cost</span>
                  </div>
                  <p className="text-zinc-400">
                    Your Gemini API key connects directly to your backend. AI CV matching, cover letters, and resume rewriting execute on Google's free API quota.
                  </p>
                </div>

                <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span>Instant Recruiter Directory Unlocks</span>
                  </div>
                  <p className="text-zinc-400">
                    All hiring manager emails, direct LinkedIn links, and AI outreach pitch templates are instantly unlocked with no credit deductions.
                  </p>
                </div>
              </div>

              {/* Admin Mode Status & Toggle */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Admin Mode Status:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold">
                      ACTIVE (100% Free Lifetime Pass)
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Linked to admin email: <strong className="text-white">2024abinash@gmail.com</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onToggleAdminStatus}
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition cursor-pointer"
                  >
                    {subscription.isAdmin ? 'Toggle User Preview Mode' : 'Restore Admin Privileges'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MINIMUM EXPENSES & PUBLISHING */}
          {activeTab === 'publishing' && (
            <div className="space-y-5">
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>What is the Minimum Expense to Publish & Run?</span>
                  </h3>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
                    ₹0 / $0 to Start!
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  You can publish and run SkillMatch completely free on modern cloud free tiers. You only pay standard transaction percentages (2-3%) when customers actually purchase subscriptions from you!
                </p>

                {/* Expense Breakdown Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300 border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 text-[11px] uppercase">
                        <th className="py-2 font-semibold">Service / Component</th>
                        <th className="py-2 font-semibold">Provider</th>
                        <th className="py-2 font-semibold">Free Tier Allocation</th>
                        <th className="py-2 font-semibold text-right">Cost to You</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
                      <tr>
                        <td className="py-2.5 font-sans font-medium text-white">App & Backend Hosting</td>
                        <td className="py-2.5">Google Cloud Run / Vercel</td>
                        <td className="py-2.5 text-zinc-400">2M requests / mo free</td>
                        <td className="py-2.5 text-right text-emerald-400 font-bold">$0 / ₹0</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-sans font-medium text-white">AI Engine (Gemini API)</td>
                        <td className="py-2.5">Google AI Studio</td>
                        <td className="py-2.5 text-zinc-400">15 RPM free tier</td>
                        <td className="py-2.5 text-right text-emerald-400 font-bold">$0 / ₹0</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-sans font-medium text-white">Database & Auth (Optional)</td>
                        <td className="py-2.5">Firebase Firestore / Supabase</td>
                        <td className="py-2.5 text-zinc-400">50k reads / day free</td>
                        <td className="py-2.5 text-right text-emerald-400 font-bold">$0 / ₹0</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-sans font-medium text-white">Payment Gateway</td>
                        <td className="py-2.5">Razorpay (India) & Stripe (Global)</td>
                        <td className="py-2.5 text-zinc-400">No monthly maintenance fee</td>
                        <td className="py-2.5 text-right text-emerald-400 font-bold">2% only on sales</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-sans font-medium text-white">Custom Domain (Optional)</td>
                        <td className="py-2.5">Namecheap / GoDaddy / Cloudflare</td>
                        <td className="py-2.5 text-zinc-400">e.g. skillmatch.in or .ai</td>
                        <td className="py-2.5 text-right text-zinc-300">~$10/yr (₹850/yr)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ready to Publish Checklist */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Is It Ready for Production? Can You Publish It?
                </h4>
                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Yes, it is production ready!</strong> The app includes full responsive UI, real ATS filtering, AI resume match engine, auto-apply concierge simulation, Kanban tracker, recruiter directory, and checkout modals in INR & USD.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Steps to share or publish right now:</strong></span>
                  </div>
                  <div className="pl-6 space-y-1 text-zinc-400 text-[11px]">
                    <p>1. In AI Studio, click the <strong>Publish / Share</strong> button in the top right to share the public link with users.</p>
                    <p>2. Connect your Razorpay Key ID or Stripe Public Key in `.env` when you are ready to accept real live card/UPI payments.</p>
                    <p>3. Share the link with tech job seekers on LinkedIn, Reddit (r/developersIndia, r/cscareerquestions), and WhatsApp groups to start acquiring users.</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy App Production URL'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GLOBAL COVERAGE & ALL JOB TYPES */}
          {activeTab === 'global_coverage' && (
            <div className="space-y-5">
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <span>Is it feeding jobs to all companies worldwide or only specific areas?</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  SkillMatch is architected for <strong>Worldwide Global Coverage</strong>! It aggregates jobs directly from company ATS platforms (Ashby, Greenhouse, Lever, Workday) across all major tech hubs and remote destinations:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>🇮🇳 India Hubs (INR Salaries)</span>
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      Bengaluru, Hyderabad, Pune, Gurgaon, Delhi NCR, Mumbai. Top tech companies and unicorns like Swiggy, Razorpay, CRED, Flipkart, Zomato, and high-paying US remote contractors.
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>🇺🇸 United States (USD Salaries)</span>
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      San Francisco Bay Area, New York, Seattle, Austin, Boston, and US Nationwide Remote ($140k - $250k+).
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>🇪🇺 Europe & UK (GBP & EUR)</span>
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      London, Berlin, Amsterdam, Dublin, Paris, and Europe-wide remote roles (£85k - £140k+).
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>🌍 Global Worldwide Remote</span>
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      Work from anywhere in the world! Contract & full-time roles with payroll via Deel, Stripe, or direct wire.
                    </p>
                  </div>
                </div>
              </div>

              {/* All Job Types Handled */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>All Employment Types & Specializations Handled</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
                    <div className="font-bold text-emerald-400 text-[11px]">Full-Time</div>
                    <div className="text-[10px] text-zinc-500">Salaried + Equity / ESOPs</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
                    <div className="font-bold text-cyan-400 text-[11px]">Contract / Freelance</div>
                    <div className="text-[10px] text-zinc-500">Hourly / 6-12 month terms</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
                    <div className="font-bold text-amber-400 text-[11px]">Internships</div>
                    <div className="text-[10px] text-zinc-500">Summer & AI Research</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
                    <div className="font-bold text-purple-400 text-[11px]">Part-Time</div>
                    <div className="text-[10px] text-zinc-500">Flexible 15-25 hrs/wk</div>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-400 pt-1">
                  <strong>Specializations covered:</strong> Frontend, Backend, Fullstack, AI / Machine Learning, DevOps / Cloud, Product Management, Data Science, iOS & Android Mobile, UI/UX Design, QA Automation, and Cybersecurity.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SkillMatch AI Platform Engine Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium transition cursor-pointer"
          >
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
};
