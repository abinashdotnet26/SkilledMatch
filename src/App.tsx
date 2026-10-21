import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { TabsNav, TabType } from './components/TabsNav';
import { JobsFilterBar } from './components/JobsFeed/JobsFilterBar';
import { JobCard } from './components/JobsFeed/JobCard';
import { JobDetailPane } from './components/JobsFeed/JobDetailPane';
import { ConciergeView } from './components/Concierge/ConciergeView';
import { TrackerView } from './components/Tracker/TrackerView';
import { RecruiterDirectoryView } from './components/RecruiterDirectory/RecruiterDirectoryView';
import { ResumeOptimizerView } from './components/ResumeOptimizer/ResumeOptimizerView';
import { ProfileModal } from './components/Modals/ProfileModal';
import { WhatsAppAlertsModal } from './components/Modals/WhatsAppAlertsModal';
import { PricingModal } from './components/Modals/PricingModal';
import { PostJobModal } from './components/Modals/PostJobModal';
import { AdminMonetizationModal } from './components/Modals/AdminMonetizationModal';

import {
  INITIAL_JOBS,
  INITIAL_CANDIDATE,
  INITIAL_TRACKER_ITEMS,
  INITIAL_CONCIERGE_LOGS,
} from './data/mockJobs';
import {
  Job,
  CandidateProfile,
  ApplicationTrackerItem,
  ApplicationStage,
  ConciergeConfig,
  ConciergeLog,
  UserSubscription,
  UserPlanTier,
} from './types/protocol';
import confetti from 'canvas-confetti';
import { Zap, Bot, Sparkles, Filter, ChevronRight, AlertCircle, Crown } from 'lucide-react';

export default function App() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [candidate, setCandidate] = useState<CandidateProfile>(INITIAL_CANDIDATE);
  const [trackerItems, setTrackerItems] = useState<ApplicationTrackerItem[]>(INITIAL_TRACKER_ITEMS);
  const [conciergeLogs, setConciergeLogs] = useState<ConciergeLog[]>(INITIAL_CONCIERGE_LOGS);

  const [activeTab, setActiveTab] = useState<TabType>('jobs');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // User Monetization & Subscription state
  const [currency, setCurrency] = useState<'USD' | 'INR'>('INR');
  const [subscription, setSubscription] = useState<UserSubscription>({
    plan: 'free',
    currency: 'INR',
    credits: 5,
    applicationsUsedThisMonth: 14,
    monthlyLimit: 10,
    dailyLimit: 3,
    renewsAt: 'Nov 20, 2026',
    isAdmin: true,
  });

  // Concierge configuration
  const [conciergeConfig, setConciergeConfig] = useState<ConciergeConfig>({
    isActive: true,
    dailyApplicationLimit: 3, // based on free tier initial
    applicationsUsedToday: 2,
    minSalaryUsd: 160000,
    preferredWorkModes: ['Remote', 'Hybrid'],
    preferredCategories: ['Frontend', 'Fullstack', 'AI / Machine Learning'],
    autoTailorResume: true,
    sendRecruiterPing: true,
    targetLocations: ['US', 'India', 'Remote'],
  });

  // Track queued jobs for concierge
  const [queuedJobIds, setQueuedJobIds] = useState<string[]>(['job-2', 'job-6']);

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Filters State for Jobs Feed
  const [filters, setFilters] = useState({
    searchQuery: '',
    category: '',
    workMode: '',
    region: '',
    employmentType: '',
    lowCompetitionOnly: false,
    atsSource: '',
    sortBy: 'newest' as 'newest' | 'competition' | 'match' | 'salary',
  });

  // Saved Jobs Set from Tracker
  const savedJobIds = useMemo(() => {
    return new Set(trackerItems.map((i) => i.jobId));
  }, [trackerItems]);

  const appliedJobIds = useMemo(() => {
    return new Set(
      trackerItems
        .filter((i) => ['applied', 'screening', 'technical', 'offer'].includes(i.stage))
        .map((i) => i.jobId)
    );
  }, [trackerItems]);

  // Derived filtered & sorted jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // Search query
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchCompany = job.company.toLowerCase().includes(q);
          const matchTag = job.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchCompany && !matchTag) return false;
        }

        // Category
        if (filters.category && job.category !== filters.category) {
          return false;
        }

        // Work mode
        if (filters.workMode && job.workMode !== filters.workMode) {
          return false;
        }

        // Region
        if (filters.region && job.region !== filters.region && !(filters.region === 'Global' && job.workMode === 'Remote')) {
          return false;
        }

        // Employment Type
        if (filters.employmentType && job.employmentType !== filters.employmentType) {
          return false;
        }

        // Low competition
        if (filters.lowCompetitionOnly && job.applicantCount > 10) {
          return false;
        }

        // ATS Source
        if (filters.atsSource && job.atsSource !== filters.atsSource) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'newest') {
          return b.postedTimestamp - a.postedTimestamp;
        }
        if (filters.sortBy === 'competition') {
          return a.applicantCount - b.applicantCount;
        }
        if (filters.sortBy === 'match') {
          return b.matchScore - a.matchScore;
        }
        if (filters.sortBy === 'salary') {
          return b.minSalaryUsd - a.minSalaryUsd;
        }
        return 0;
      });
  }, [jobs, filters]);

  // Subscription Upgrade Handler
  const handleUpgradePlan = (plan: UserPlanTier, bonusCredits = 15) => {
    const dailyLimit = plan === 'free' ? 3 : plan === 'pro' ? 20 : 50;
    setSubscription((prev) => ({
      ...prev,
      plan,
      dailyLimit,
      credits: prev.credits + bonusCredits,
    }));
    setConciergeConfig((prev) => ({
      ...prev,
      dailyApplicationLimit: dailyLimit,
    }));
  };

  // Buy Credits Handler
  const handleBuyCredits = (amount: number, _price: number) => {
    setSubscription((prev) => ({
      ...prev,
      credits: prev.credits + amount,
    }));
  };

  // Employer Job Created Handler
  const handleJobCreated = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  // Handle Save / Unsave
  const handleToggleSave = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation();
    const existing = trackerItems.find((i) => i.jobId === job.id);
    if (existing) {
      setTrackerItems((prev) => prev.filter((i) => i.jobId !== job.id));
    } else {
      const newItem: ApplicationTrackerItem = {
        id: `track-${Date.now()}`,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        salaryRange: job.salaryRange,
        location: job.location,
        atsSource: job.atsSource,
        stage: 'saved',
        appliedDate: 'Saved just now',
        appliedVia: 'Manual ATS',
        matchScore: job.matchScore,
        notes: `Saved via SkillMatch feed (${job.applicantCount} applicants)`,
      };
      setTrackerItems((prev) => [newItem, ...prev]);
    }
  };

  // Handle Queue to Concierge
  const handleQueueConcierge = (job: Job, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Check if free user exceeded daily quota
    if (subscription.plan === 'free' && conciergeConfig.applicationsUsedToday >= conciergeConfig.dailyApplicationLimit) {
      setIsPricingModalOpen(true);
      return;
    }

    if (!queuedJobIds.includes(job.id)) {
      setQueuedJobIds((prev) => [job.id, ...prev]);
      // Also register or update in tracker
      setTrackerItems((prev) => {
        const without = prev.filter((i) => i.jobId !== job.id);
        const newItem: ApplicationTrackerItem = {
          id: `track-${Date.now()}`,
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          salaryRange: job.salaryRange,
          location: job.location,
          atsSource: job.atsSource,
          stage: 'queued',
          appliedDate: 'Queued for today',
          appliedVia: 'Apply Concierge',
          matchScore: job.matchScore,
          notes: 'Concierge is optimizing CV bullet points for ATS submission',
        };
        return [newItem, ...without];
      });

      // Add log
      setConciergeLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          jobTitle: job.title,
          company: job.company,
          action: 'QUEUED',
          status: 'pending',
          details: `Queued into Concierge priority pipeline. Auto-tailoring resume for ${job.atsSource}.`,
        },
        ...prev,
      ]);

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#06b6d4', '#10b981'],
      });
    }
  };

  // Handle Quick Autofill
  const handleQuickAutofill = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedJob(job);
  };

  // Handle Mark Applied
  const handleJobApplied = (
    job: Job,
    method: 'Apply Concierge' | '1-Click Autofill' | 'Manual ATS' | 'Recruiter Cold Ping'
  ) => {
    setTrackerItems((prev) => {
      const without = prev.filter((i) => i.jobId !== job.id);
      const newItem: ApplicationTrackerItem = {
        id: `track-${Date.now()}`,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        salaryRange: job.salaryRange,
        location: job.location,
        atsSource: job.atsSource,
        stage: 'applied',
        appliedDate: 'Today',
        appliedVia: method,
        matchScore: job.matchScore,
        notes: `Applied via ${method} (${job.atsSource}). Tailored CV submitted.`,
      };
      return [newItem, ...without];
    });

    setConciergeConfig((prev) => ({
      ...prev,
      applicationsUsedToday: Math.min(prev.dailyApplicationLimit, prev.applicationsUsedToday + 1),
    }));
  };

  const queuedJobsList = useMemo(() => {
    return queuedJobIds.map((id) => jobs.find((j) => j.id === id)).filter(Boolean) as Job[];
  }, [queuedJobIds, jobs]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Protocol Header */}
      <Header
        candidate={candidate}
        subscription={subscription}
        currency={currency}
        onToggleCurrency={setCurrency}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAlerts={() => setIsWhatsAppModalOpen(true)}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onOpenPostJob={() => setIsPostJobModalOpen(true)}
        onOpenAdminHub={() => setIsAdminModalOpen(true)}
        conciergeActive={conciergeConfig.isActive}
        onToggleConcierge={() =>
          setConciergeConfig((prev) => ({ ...prev, isActive: !prev.isActive }))
        }
        applicationsCountToday={conciergeConfig.applicationsUsedToday}
      />

      {/* Tabs Navigation */}
      <TabsNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        jobsCount={jobs.length}
        trackerCount={trackerItems.length}
        conciergeQueueCount={queuedJobIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Upgrade Banner for Free Users */}
        {subscription.plan === 'free' && (
          <div className="bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-amber-950/40 border-b border-zinc-800/80 px-4 py-2.5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Starter Plan:</strong> 3 applications/day • {subscription.credits} recruiter unlock credits remaining
                </span>
              </div>
              <button
                onClick={() => setIsPricingModalOpen(true)}
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer transition"
              >
                <span>Upgrade to Pro Concierge (20 apps/day + WhatsApp alerts)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: JOBS FEED */}
        {activeTab === 'jobs' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
            {/* Value Proposition Subheader */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Early Access Job Feed</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-normal">
                    Direct ATS
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Jobs sourced directly from company career portals (Ashby, Greenhouse, Lever) 24-72 hours before LinkedIn.
                </p>
              </div>

              {/* Quick Concierge Fast-Track Pill & Post Job trigger */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPostJobModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>Employer? Post a Job ($199)</span>
                </button>
                <button
                  onClick={() => setActiveTab('concierge')}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2 transition cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>
                    Auto-Queue: <strong className="text-white font-mono">{queuedJobIds.length}</strong> jobs
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <JobsFilterBar
              filters={filters}
              onChange={setFilters}
              totalFiltered={filteredJobs.length}
              totalJobs={jobs.length}
            />

            {/* Job Cards Grid */}
            {filteredJobs.length === 0 ? (
              <div className="py-20 text-center space-y-3 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
                <AlertCircle className="w-8 h-8 text-zinc-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No matching early access jobs</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Try adjusting your search keywords, role categories, or clearing the low-competition toggle.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      searchQuery: '',
                      category: '',
                      workMode: '',
                      region: '',
                      employmentType: '',
                      lowCompetitionOnly: false,
                      atsSource: '',
                      sortBy: 'newest',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-semibold transition cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSelected={selectedJob?.id === job.id}
                    isSaved={savedJobIds.has(job.id)}
                    isQueued={queuedJobIds.includes(job.id)}
                    onSelect={(j) => setSelectedJob(j)}
                    onQuickAutofill={handleQuickAutofill}
                    onQueueConcierge={handleQueueConcierge}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: APPLY CONCIERGE */}
        {activeTab === 'concierge' && (
          <ConciergeView
            config={conciergeConfig}
            onUpdateConfig={setConciergeConfig}
            queuedJobs={queuedJobsList}
            onRemoveFromQueue={(id) => setQueuedJobIds((prev) => prev.filter((i) => i !== id))}
            logs={conciergeLogs}
            onAddLog={(log) => setConciergeLogs((prev) => [log, ...prev])}
            onJobApplied={handleJobApplied}
          />
        )}

        {/* TAB 3: APPLICATION TRACKER / KANBAN */}
        {activeTab === 'tracker' && (
          <TrackerView
            items={trackerItems}
            onUpdateStage={(itemId, newStage) => {
              setTrackerItems((prev) =>
                prev.map((item) => (item.id === itemId ? { ...item, stage: newStage } : item))
              );
            }}
            onDeleteItem={(itemId) => {
              setTrackerItems((prev) => prev.filter((item) => item.id !== itemId));
            }}
            onAddItem={(newItem) => {
              setTrackerItems((prev) => [newItem, ...prev]);
            }}
          />
        )}

        {/* TAB 4: RECRUITER DIRECT / SKILLMATCH ADVANTAGE */}
        {activeTab === 'recruiter' && (
          <RecruiterDirectoryView jobs={jobs} candidate={candidate} />
        )}

        {/* TAB 5: AI RESUME & ATS MATCH ENGINE */}
        {activeTab === 'optimizer' && (
          <ResumeOptimizerView candidate={candidate} onUpdateCandidate={setCandidate} />
        )}
      </main>

      {/* Deep Job Inspection Detail Pane */}
      {selectedJob && (
        <JobDetailPane
          job={selectedJob}
          candidate={candidate}
          onClose={() => setSelectedJob(null)}
          onQueueConcierge={(j) => handleQueueConcierge(j)}
          onMarkApplied={handleJobApplied}
          isQueued={queuedJobIds.includes(selectedJob.id)}
          isApplied={appliedJobIds.has(selectedJob.id)}
        />
      )}

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        candidate={candidate}
        onSave={setCandidate}
      />

      {/* WhatsApp Alerts Modal */}
      <WhatsAppAlertsModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />

      {/* Pricing & Subscription Modal */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        subscription={subscription}
        onUpgradePlan={handleUpgradePlan}
        onBuyCredits={handleBuyCredits}
      />

      {/* Post a Job (Employer B2B Monetization) Modal */}
      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        onJobCreated={handleJobCreated}
      />

      {/* Admin & Monetization Hub Modal */}
      <AdminMonetizationModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        subscription={subscription}
        onToggleAdminStatus={() => {
          setSubscription((prev) => ({
            ...prev,
            isAdmin: !prev.isAdmin,
            plan: !prev.isAdmin ? 'free' : 'pro',
            credits: !prev.isAdmin ? 5 : 999,
          }));
        }}
        currency={currency}
        onToggleCurrency={setCurrency}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-8 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            </div>
            <span className="font-mono font-bold text-zinc-300">SKILLMATCH AI</span>
            <span>• Direct ATS Aggregator & Apply Concierge</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-400">
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Crown className="w-3 h-3" />
              <span>Admin Hub (100% Free)</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 cursor-pointer"
            >
              Pricing & Plans
            </button>
            <span>•</span>
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              For Employers ({currency === 'INR' ? '₹9,999' : '$199'})
            </button>
            <span>•</span>
            <span>Ashby • Greenhouse • Lever • Workday Direct</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
