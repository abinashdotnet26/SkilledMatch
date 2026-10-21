import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Zap,
  CheckCircle2,
  Bell,
  Smartphone,
  Send,
  Sparkles,
  DollarSign,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WhatsAppAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppAlertsModal: React.FC<WhatsAppAlertsModalProps> = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('+1 (415) 890-4321');
  const [frequency, setFrequency] = useState<'instant' | 'daily'>('instant');
  const [minSalary, setMinSalary] = useState('160000');
  const [lowCompetitionOnly, setLowCompetitionOnly] = useState(true);
  const [showSimulatedNotification, setShowSimulatedNotification] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleTestAlert = () => {
    setShowSimulatedNotification(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#25D366', '#128C7E', '#075E54'],
    });
  };

  const handleSaveAlerts = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
            <MessageSquare className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Jobs on WhatsApp & Telegram</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Instant Alerts
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Be the first to apply. Get alerted within 5 minutes of direct ATS scrapes.
            </p>
          </div>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSaveAlerts} className="space-y-4">
          <div>
            <label className="text-xs text-zinc-300 font-medium">WhatsApp Phone Number (with Country Code)</label>
            <div className="relative mt-1">
              <Smartphone className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#25D366]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-zinc-400 font-medium">Alert Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#25D366] cursor-pointer"
              >
                <option value="instant">⚡ Real-time (within 5m)</option>
                <option value="daily">📅 Daily Digest (9 AM)</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-400 font-medium">Salary Minimum</label>
              <select
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#25D366] cursor-pointer"
              >
                <option value="140000">$140,000+ / yr</option>
                <option value="160000">$160,000+ / yr</option>
                <option value="180000">$180,000+ / yr</option>
                <option value="200000">$200,000+ / yr</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={lowCompetitionOnly}
              onChange={(e) => setLowCompetitionOnly(e.target.checked)}
              className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
            />
            <span>Only alert for <strong>Low Competition</strong> roles (&lt;10 applicants)</span>
          </label>

          {/* Test Alert Simulator Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleTestAlert}
              className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Preview Live WhatsApp Notification</span>
            </button>
          </div>

          {/* Simulated WhatsApp Notification Box */}
          {showSimulatedNotification && (
            <div className="p-4 rounded-2xl bg-[#0b141a] border border-[#25D366]/40 space-y-2 shadow-xl animate-in fade-in">
              <div className="flex items-center justify-between text-[11px] text-[#25D366] font-mono">
                <span className="flex items-center gap-1 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                  SkillMatch Stealth Alert Bot
                </span>
                <span className="text-zinc-500">Just now</span>
              </div>
              <div className="p-3 rounded-xl bg-[#202c33] text-xs text-zinc-200 leading-relaxed font-sans space-y-1.5 border border-[#2a3942]">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>⚡ NEW STEALTH ROLE DETECTED</span>
                </div>
                <div>
                  <strong>Senior Frontend Engineer</strong> at <strong>Linear</strong>
                </div>
                <div className="text-zinc-400 text-[11px]">
                  • <strong>Salary:</strong> $170k - $210k + Equity<br />
                  • <strong>ATS Source:</strong> Ashby (Posted 38m ago)<br />
                  • <strong>Applicants:</strong> 4 applicants (Low Competition)<br />
                  • <strong>Your CV Match:</strong> 96%
                </div>
                <div className="pt-1 text-[#00a884] font-semibold text-[11px]">
                  👉 Tap to 1-Click Autofill or Delegate to Concierge: skillmatch.ai/a/lin-019
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-[#25D366]/20"
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4 fill-zinc-950" />}
              <span>{isSaved ? 'Alerts Activated!' : 'Save Alert Rules'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
