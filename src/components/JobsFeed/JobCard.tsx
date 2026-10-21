import React from 'react';
import {
  Zap,
  Building,
  MapPin,
  DollarSign,
  Clock,
  Users,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Send,
  Bot,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Job } from '../../types/protocol';

interface JobCardProps {
  job: Job;
  isSelected?: boolean;
  isSaved?: boolean;
  isQueued?: boolean;
  onSelect: (job: Job) => void;
  onQuickAutofill: (job: Job, e: React.MouseEvent) => void;
  onQueueConcierge: (job: Job, e: React.MouseEvent) => void;
  onToggleSave: (job: Job, e: React.MouseEvent) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSelected,
  isSaved,
  isQueued,
  onSelect,
  onQuickAutofill,
  onQueueConcierge,
  onToggleSave,
}) => {
  return (
    <div
      onClick={() => onSelect(job)}
      className={`group relative rounded-2xl p-5 border transition-all cursor-pointer ${
        isSelected
          ? 'bg-zinc-900 border-emerald-500 shadow-xl shadow-emerald-950/30 ring-1 ring-emerald-500/50'
          : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800/80 hover:border-zinc-700 shadow-lg'
      }`}
    >
      {/* Top Protocol Signals Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Early Scrape Signal */}
          <span className="flex items-center gap-1 text-[11px] font-semibold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/60 font-mono">
            <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400" />
            {job.postedAt} direct via {job.atsSource}
          </span>

          {/* Low Competition Indicator */}
          {job.applicantCount <= 10 && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              </span>
              <span>{job.applicantCount} applicants</span>
              <span className="text-[10px] text-emerald-400/80 font-normal hidden sm:inline">• Low Competition</span>
            </span>
          )}
        </div>

        {/* Right side: Match score & Bookmark */}
        <div className="flex items-center gap-2">
          <div
            className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold flex items-center gap-1 ${
              job.matchScore >= 90
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/40'
                : job.matchScore >= 80
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40'
                : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
            }`}
            title="Candidate Profile & ATS Match Score"
          >
            <Sparkles className="w-3 h-3" />
            <span>{job.matchScore}% Match</span>
          </div>

          <button
            onClick={(e) => onToggleSave(job, e)}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              isSaved
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border-zinc-800 hover:border-zinc-700'
            }`}
            title={isSaved ? 'Saved in pipeline' : 'Save job to pipeline'}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Job Info */}
      <div className="flex items-start gap-3.5 mb-3">
        {job.companyLogo ? (
          <img
            src={job.companyLogo}
            alt={job.company}
            className="w-12 h-12 rounded-xl object-cover border border-zinc-800 shrink-0 mt-0.5"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-base font-bold text-emerald-400 shrink-0">
            {job.company[0]}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition truncate">
            {job.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-xs text-zinc-400">
            <span className="font-medium text-zinc-200 flex items-center gap-1">
              <Building className="w-3 h-3 text-zinc-500" />
              {job.company}
            </span>
            <span className="text-[11px] px-1.5 py-0.2 bg-zinc-800 rounded text-zinc-400 border border-zinc-700 font-mono">
              {job.companyStage}
            </span>
            {job.employmentType && (
              <span className="text-[11px] px-1.5 py-0.2 bg-emerald-950/60 rounded text-emerald-300 border border-emerald-500/30 font-medium">
                {job.employmentType}
              </span>
            )}
            {job.region && (
              <span className="text-[11px] px-1.5 py-0.2 bg-cyan-950/60 rounded text-cyan-300 border border-cyan-500/30 font-medium">
                {job.region === 'India' ? '🇮🇳 India' : job.region === 'Europe' ? '🇪🇺 Europe' : job.region === 'Global' ? '🌍 Global' : '🇺🇸 US'}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-zinc-500" />
              {job.location} ({job.workMode})
            </span>
          </div>
        </div>
      </div>

      {/* Salary & Tags */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-1 text-sm font-semibold text-emerald-300 font-mono">
          <span className="text-emerald-400 font-bold">{job.salaryCurrency === 'INR' || job.salaryRange.includes('₹') ? '₹' : job.salaryRange.includes('£') ? '£' : '$'}</span>
          <span>{job.salaryRange.replace(/^(\$|₹|£)\s?/, '')}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {job.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-950 text-zinc-300 border border-zinc-800 font-mono"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 4 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded-md text-zinc-500">
              +{job.tags.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer: Recruiter Hook & Quick Actions */}
      <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Recruiter Preview */}
        <div className="flex items-center gap-2">
          <img
            src={job.recruiter.avatar}
            alt={job.recruiter.name}
            className="w-5 h-5 rounded-full object-cover border border-zinc-700"
          />
          <span className="text-zinc-400 truncate max-w-[150px] sm:max-w-[200px]">
            Hiring: <strong className="text-zinc-200 font-medium">{job.recruiter.name}</strong>
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {/* Quick Concierge Queue Button */}
          <button
            onClick={(e) => onQueueConcierge(job, e)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              isQueued
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
            }`}
            title="Delegate application to Apply Concierge agent"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isQueued ? 'Queued' : 'Auto-Queue'}</span>
          </button>

          {/* Quick 1-Click Autofill */}
          <button
            onClick={(e) => onQuickAutofill(job, e)}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1 transition shadow shadow-emerald-500/20 cursor-pointer"
            title="Open 1-Click ATS autofill modal"
          >
            <Zap className="w-3.5 h-3.5 fill-zinc-950" />
            <span>Autofill</span>
          </button>
        </div>
      </div>
    </div>
  );
};
