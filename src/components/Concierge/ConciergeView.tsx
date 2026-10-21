import React, { useState } from 'react';
import {
  Bot,
  Zap,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  Sliders,
  DollarSign,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  RotateCw,
  Building,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Job, ConciergeConfig, ConciergeLog } from '../../types/protocol';

interface ConciergeViewProps {
  config: ConciergeConfig;
  onUpdateConfig: (newConfig: ConciergeConfig) => void;
  queuedJobs: Job[];
  onRemoveFromQueue: (jobId: string) => void;
  logs: ConciergeLog[];
  onAddLog: (log: ConciergeLog) => void;
  onJobApplied: (job: Job, method: 'Apply Concierge') => void;
}

export const ConciergeView: React.FC<ConciergeViewProps> = ({
  config,
  onUpdateConfig,
  queuedJobs,
  onRemoveFromQueue,
  logs,
  onAddLog,
  onJobApplied,
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [activeSimJob, setActiveSimJob] = useState<Job | null>(null);

  const steps = [
    'Scanning ATS endpoints (Ashby & Greenhouse API)...',
    'Analyzing job requirements & candidate CV match score...',
    'Generating company-tailored ATS markdown resume...',
    'Auto-populating application form & compliance questions...',
    'Submitting application & registering recruiter outreach...',
  ];

  const handleRunSimulation = () => {
    if (queuedJobs.length === 0) return;
    const targetJob = queuedJobs[0];
    setActiveSimJob(targetJob);
    setIsSimulating(true);
    setSimulationStep(0);

    const stepInterval = setInterval(() => {
      setSimulationStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setIsSimulating(false);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#10b981', '#6366f1'],
          });
          onJobApplied(targetJob, 'Apply Concierge');
          onRemoveFromQueue(targetJob.id);
          onAddLog({
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            jobTitle: targetJob.title,
            company: targetJob.company,
            action: 'SUBMITTED',
            status: 'success',
            details: `Successfully applied to ${targetJob.company} via ${targetJob.atsSource}. Tailored CV and verified responses dispatched.`,
          });
          return 0;
        }
      });
    }, 1100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-cyan-950/60 border border-zinc-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              SKILLMATCH DONE-FOR-YOU APPLICATIONS
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Apply Concierge Autonomous Agent
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Never fill out repetitive ATS forms again. Concierge scrapes direct ATS postings, optimizes your CV keywords, and applies on your behalf with human-level accuracy.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center">
              <div className="text-xl font-bold font-mono text-emerald-400">
                {config.applicationsUsedToday} / {config.dailyApplicationLimit}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Applied Today</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center">
              <div className="text-xl font-bold font-mono text-cyan-400">{queuedJobs.length}</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">In Auto-Queue</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center">
              <div className="text-xl font-bold font-mono text-white">41.8%</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Callback Rate</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center">
              <div className="text-xl font-bold font-mono text-amber-400">1.8s</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Avg Form Speed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls vs Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Automation Rules & Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Concierge Rules</h3>
              </div>
              {/* Active Toggle */}
              <button
                onClick={() => onUpdateConfig({ ...config, isActive: !config.isActive })}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  config.isActive
                    ? 'bg-emerald-500 text-zinc-950'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {config.isActive ? <Play className="w-3 h-3 fill-zinc-950" /> : <Pause className="w-3 h-3" />}
                <span>{config.isActive ? 'Active' : 'Paused'}</span>
              </button>
            </div>

            {/* Daily Quota Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Daily Application Quota</span>
                <span className="font-mono font-bold text-emerald-400">{config.dailyApplicationLimit} apps/day</span>
              </div>
              <input
                type="range"
                min="5"
                max="35"
                value={config.dailyApplicationLimit}
                onChange={(e) => onUpdateConfig({ ...config, dailyApplicationLimit: Number(e.target.value) })}
                className="w-full accent-emerald-500 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-zinc-500">
                Controlled pace avoids spam filters and mimics natural applicant behavior.
              </p>
            </div>

            {/* Minimum Salary Filter */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Minimum Base Salary</span>
                <span className="font-mono font-bold text-emerald-400">
                  ${(config.minSalaryUsd / 1000).toFixed(0)}k+ / yr
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="220000"
                step="5000"
                value={config.minSalaryUsd}
                onChange={(e) => onUpdateConfig({ ...config, minSalaryUsd: Number(e.target.value) })}
                className="w-full accent-emerald-500 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Smart Toggles */}
            <div className="space-y-3 pt-2 border-t border-zinc-800 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-medium text-zinc-200">Auto-Tailor ATS Resume</div>
                  <div className="text-[10px] text-zinc-500">Inject job keywords into bullet points</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.autoTailorResume}
                  onChange={(e) => onUpdateConfig({ ...config, autoTailorResume: e.target.checked })}
                  className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-medium text-zinc-200">Recruiter Cold Ping</div>
                  <div className="text-[10px] text-zinc-500">Queue warm email to verified hiring lead</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.sendRecruiterPing}
                  onChange={(e) => onUpdateConfig({ ...config, sendRecruiterPing: e.target.checked })}
                  className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Concierge Guarantee Card */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>THE SKILLMATCH CONCIERGE ADVANTAGE</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Unlike generic bots that spam thousands of irrelevent roles, SkillMatch strictly targets low-competition roles (&lt;10 applicants) directly from ATS within 24-72h of posting, yielding an average <strong>41.8% interview callback rate</strong>.
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Live Execution Queue & Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Simulation Dispatch Runner */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                  <span>Concierge Application Queue</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                    {queuedJobs.length} Ready
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Jobs queued for automated submission with customized resumes.
                </p>
              </div>

              <button
                onClick={handleRunSimulation}
                disabled={isSimulating || queuedJobs.length === 0}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                  isSimulating || queuedJobs.length === 0
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-zinc-950 shadow-emerald-500/20'
                }`}
              >
                {isSimulating ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Executing Bot Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-zinc-950" />
                    <span>Run Next Application Batch</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Simulation Progress Box */}
            {isSimulating && activeSimJob && (
              <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/50 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                    <span>Applying to {activeSimJob.company}: {activeSimJob.title}</span>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold">
                    Step {simulationStep + 1} of {steps.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full transition-all duration-700 ease-out"
                    style={{ width: `${((simulationStep + 1) / steps.length) * 100}%` }}
                  />
                </div>

                <div className="text-xs font-mono text-zinc-300 flex items-center gap-2">
                  <RotateCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  <span>{steps[simulationStep]}</span>
                </div>
              </div>
            )}

            {/* Queued Jobs List */}
            {queuedJobs.length === 0 ? (
              <div className="py-12 text-center space-y-2 border border-dashed border-zinc-800 rounded-xl">
                <Bot className="w-8 h-8 text-zinc-600 mx-auto" />
                <div className="text-sm font-semibold text-zinc-400">Your Concierge queue is empty</div>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Browse the Early Jobs Feed and click "Auto-Queue" on low-competition roles to delegate applications.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {queuedJobs.map((job, idx) => (
                  <div
                    key={job.id}
                    className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-zinc-500 font-bold">#{idx + 1}</span>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate">{job.title}</div>
                        <div className="text-zinc-400 text-[11px] flex items-center gap-2">
                          <span>{job.company}</span>
                          <span>•</span>
                          <span className="text-cyan-400 font-mono">{job.atsSource}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">{job.salaryRange}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                        {job.matchScore}% Match
                      </span>
                      <button
                        onClick={() => onRemoveFromQueue(job.id)}
                        className="text-zinc-500 hover:text-rose-400 transition cursor-pointer px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity & Audit Log */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Concierge Activity Audit Log</span>
              </h3>
              <span className="text-[11px] text-zinc-500 font-mono">Live telemetry</span>
            </div>

            <div className="space-y-2.5">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{log.company}</span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-zinc-300 font-medium">{log.jobTitle}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{log.details}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-zinc-500 block">{log.timestamp}</span>
                    <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {log.action}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
