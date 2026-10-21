import React from 'react';
import { Sparkles, Briefcase, Bot, Kanban, Users, FileText, CheckCircle2 } from 'lucide-react';

export type TabType = 'jobs' | 'concierge' | 'tracker' | 'recruiter' | 'optimizer';

interface TabsNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  jobsCount: number;
  trackerCount: number;
  conciergeQueueCount: number;
}

export const TabsNav: React.FC<TabsNavProps> = ({
  activeTab,
  onTabChange,
  jobsCount,
  trackerCount,
  conciergeQueueCount,
}) => {
  const tabs = [
    {
      id: 'jobs' as TabType,
      label: 'Early Jobs Feed',
      icon: Briefcase,
      badge: `${jobsCount}`,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    },
    {
      id: 'concierge' as TabType,
      label: 'Apply Concierge',
      icon: Bot,
      badge: `${conciergeQueueCount} Queued`,
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
    },
    {
      id: 'tracker' as TabType,
      label: 'Application Pipeline',
      icon: Kanban,
      badge: `${trackerCount}`,
      badgeColor: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
    },
    {
      id: 'recruiter' as TabType,
      label: 'Recruiter Direct',
      icon: Users,
      badge: 'Unlocks',
      badgeColor: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    },
    {
      id: 'optimizer' as TabType,
      label: 'AI Resume & Match',
      icon: FileText,
      badge: '94% Ready',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    },
  ];

  return (
    <div className="border-b border-zinc-800 bg-zinc-950/60 sticky top-24 z-30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
