import React from 'react';
import { Sparkles, Bell, MessageSquare, Zap, CheckCircle2, User, Flame, Building, Crown, Coins } from 'lucide-react';
import { CandidateProfile, UserSubscription } from '../types/protocol';

interface HeaderProps {
  candidate: CandidateProfile;
  subscription: UserSubscription;
  currency: 'USD' | 'INR';
  onToggleCurrency: (c: 'USD' | 'INR') => void;
  onOpenProfile: () => void;
  onOpenAlerts: () => void;
  onOpenPricing: () => void;
  onOpenPostJob: () => void;
  onOpenAdminHub: () => void;
  conciergeActive: boolean;
  onToggleConcierge: () => void;
  applicationsCountToday: number;
}

export const Header: React.FC<HeaderProps> = ({
  candidate,
  subscription,
  currency,
  onToggleCurrency,
  onOpenProfile,
  onOpenAlerts,
  onOpenPricing,
  onOpenPostJob,
  onOpenAdminHub,
  conciergeActive,
  onToggleConcierge,
  applicationsCountToday,
}) => {
  const isINR = currency === 'INR';

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Protocol Signals Ticker */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-cyan-950/80 px-4 py-1.5 border-b border-zinc-800/80 text-xs flex items-center justify-between text-zinc-300">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            LIVE ATS SCANNER
          </span>
          <span className="truncate">
            <span className="text-zinc-100 font-medium">⚡ 48 fresh jobs</span> scraped in the last 4 hours directly from Ashby, Greenhouse & Lever before LinkedIn
          </span>
          <span className="hidden md:inline-block text-zinc-500">•</span>
          <span className="hidden md:inline-block text-emerald-400 font-medium">
            Avg. competition: <strong className="text-white">7 applicants</strong> vs LinkedIn (250+)
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-4 text-zinc-400 shrink-0">
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Early Mover Advantage: <strong className="text-amber-300 ml-1">4.2x Interview Rate</strong>
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/40">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white font-mono">SKILLMATCH</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-bold tracking-wider">
                AI
              </span>
              <span className="hidden sm:inline-flex text-[10px] uppercase font-semibold tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Early Access ATS
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              AI Job Discovery & Done-for-you applications
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Currency Toggle Pill */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-[11px] font-bold">
            <button
              onClick={() => onToggleCurrency('INR')}
              className={`px-2 py-1 rounded transition cursor-pointer ${
                isINR ? 'bg-emerald-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Switch to Indian Rupee (₹)"
            >
              ₹ INR
            </button>
            <button
              onClick={() => onToggleCurrency('USD')}
              className={`px-2 py-1 rounded transition cursor-pointer ${
                !isINR ? 'bg-emerald-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Switch to US Dollar ($)"
            >
              $ USD
            </button>
          </div>

          {/* Admin Hub Button (100% Free Lifetime Badge) */}
          <button
            onClick={onOpenAdminHub}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-950 via-zinc-900 to-teal-950 hover:border-emerald-400 border border-emerald-500/50 text-emerald-300 text-xs font-semibold shadow-sm shadow-emerald-500/10 transition cursor-pointer"
            title="Open Admin & Monetization Hub (How you earn, Admin Free Pass, Zero Cost Setup)"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Admin Hub</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold">
              FREE
            </span>
          </button>

          {/* Post a Job for Employers */}
          <button
            onClick={onOpenPostJob}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition cursor-pointer"
            title="Post a featured job listing ($199 / ₹9,999)"
          >
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <span>Post a Job</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300">
              {isINR ? '₹9,999' : '$199'}
            </span>
          </button>

          {/* Credits Badge / Top-up */}
          <button
            onClick={onOpenPricing}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono transition cursor-pointer"
            title="Buy more credits"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>{subscription.isAdmin ? '∞' : subscription.credits}</span>
            <span className="text-[10px] text-zinc-500 font-sans">
              {subscription.isAdmin ? 'admin' : 'credits'}
            </span>
          </button>

          {/* Plan Tier Upgrade Button */}
          {subscription.isAdmin ? (
            <div className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono">
              <Crown className="w-3.5 h-3.5 text-emerald-400" />
              <span>ADMIN PASS</span>
            </div>
          ) : subscription.plan === 'free' ? (
            <button
              onClick={onOpenPricing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-zinc-950 text-xs font-bold transition shadow-sm shadow-emerald-500/20 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Upgrade to Pro</span>
            </button>
          ) : (
            <button
              onClick={onOpenPricing}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-emerald-400" />
              <span className="uppercase">{subscription.plan}</span>
            </button>
          )}

          {/* WhatsApp / Telegram Alerts Button */}
          <button
            onClick={onOpenAlerts}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium transition cursor-pointer"
            title="Configure real-time stealth job alerts"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          {/* Concierge Status Pill */}
          <button
            onClick={onToggleConcierge}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
              conciergeActive
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Toggle Apply Concierge automation"
          >
            <span className="relative flex h-2 w-2">
              {conciergeActive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  conciergeActive ? 'bg-emerald-400' : 'bg-zinc-600'
                }`}
              ></span>
            </span>
            <span className="font-semibold hidden sm:inline">Concierge</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
              {applicationsCountToday}/{subscription.plan === 'free' ? 3 : subscription.plan === 'pro' ? 20 : 50}
            </span>
          </button>

          {/* User Profile Pill */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 transition cursor-pointer text-left"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-xs font-bold text-white shadow">
              {candidate.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-semibold text-zinc-200 truncate max-w-[100px]">{candidate.name}</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                94% ATS Ready
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
