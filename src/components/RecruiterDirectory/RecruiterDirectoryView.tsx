import React, { useState } from 'react';
import {
  Users,
  Search,
  Building,
  Mail,
  Linkedin,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  Send,
  Loader2,
  ExternalLink,
  Lock,
  Unlock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Job, CandidateProfile } from '../../types/protocol';

interface RecruiterDirectoryViewProps {
  jobs: Job[];
  candidate: CandidateProfile;
}

export const RecruiterDirectoryView: React.FC<RecruiterDirectoryViewProps> = ({ jobs, candidate }) => {
  const [search, setSearch] = useState('');
  const [unlockedIds, setUnlockedIds] = useState<Record<string, boolean>>({
    'job-1': true, // linear unlocked by default
    'job-2': true, // aether unlocked
  });

  // Modal for composing AI outreach to specific recruiter
  const [activeRecruiterJob, setActiveRecruiterJob] = useState<Job | null>(null);
  const [outreachData, setOutreachData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState<'direct' | 'enthusiastic' | 'problem-solver'>('direct');
  const [copied, setCopied] = useState(false);

  const recruiters = jobs.map((job) => ({
    id: job.id,
    jobTitle: job.title,
    company: job.company,
    companyLogo: job.companyLogo,
    name: job.recruiter.name,
    role: job.recruiter.role,
    avatar: job.recruiter.avatar,
    email: job.recruiter.email,
    linkedin: job.recruiter.linkedinUrl,
    isVerified: job.recruiter.isVerified,
    job,
  }));

  const filteredRecruiters = recruiters.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.company.toLowerCase().includes(search.toLowerCase()) ||
      r.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleUnlock = (id: string) => {
    setUnlockedIds((prev) => ({ ...prev, [id]: true }));
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#06b6d4', '#10b981'],
    });
  };

  const handleOpenOutreach = async (job: Job) => {
    setActiveRecruiterJob(job);
    setOutreachData(null);
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recruiterName: job.recruiter.name,
          recruiterRole: job.recruiter.role,
          company: job.company,
          jobTitle: job.title,
          tone,
          candidateProfile: candidate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOutreachData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/40 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            SKILLMATCH ADVANTAGE • DIRECT RECRUITER CONTACTS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Verified Hiring Leads & Direct Outreach
          </h1>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Bypass black-hole applicant pools. Reach verified decision-makers directly with AI-tailored cold messages that convert into first-round screens.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300 space-y-1.5 shrink-0">
          <div className="flex justify-between gap-6">
            <span className="text-zinc-500">Unlocked Contacts:</span>
            <span className="font-mono font-bold text-emerald-400">{Object.keys(unlockedIds).length} / {recruiters.length}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-zinc-500">Avg Response Rate:</span>
            <span className="font-mono font-bold text-amber-400">42% (Warm Ping)</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by recruiter name, role, or company..."
          className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Recruiters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecruiters.map((recruiter) => {
          const isUnlocked = unlockedIds[recruiter.id];
          return (
            <div
              key={recruiter.id}
              className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition space-y-4 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header: Avatar, Name, Badge */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={recruiter.avatar}
                    alt={recruiter.name}
                    className="w-13 h-13 rounded-2xl object-cover border border-zinc-700 shadow shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-bold text-white truncate">{recruiter.name}</h3>
                      <span className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400" title="Verified Talent Lead">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{recruiter.role}</div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold mt-1">
                      <Building className="w-3 h-3 text-zinc-500" />
                      <span>{recruiter.company}</span>
                    </div>
                  </div>
                </div>

                {/* Role they are hiring for */}
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs">
                  <div className="text-[10px] text-zinc-500 font-mono uppercase">Actively Hiring For:</div>
                  <div className="font-medium text-emerald-300 mt-0.5 truncate">{recruiter.jobTitle}</div>
                </div>

                {/* Contact info locked/unlocked */}
                {isUnlocked ? (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-zinc-300 font-mono bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                      <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{recruiter.email}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/60 text-xs text-zinc-500 flex items-center justify-between font-mono">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Email & LinkedIn Hidden</span>
                    </span>
                    <span className="text-[10px] text-amber-400">1 credit</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-zinc-800 flex items-center gap-2">
                {isUnlocked ? (
                  <>
                    <button
                      onClick={() => handleOpenOutreach(recruiter.job)}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-500/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Draft AI Cold Email</span>
                    </button>
                    <a
                      href={recruiter.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sky-400 transition"
                      title="LinkedIn profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </>
                ) : (
                  <button
                    onClick={() => handleUnlock(recruiter.id)}
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Unlock Verified Contact (Free)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Outreach Draft Modal */}
      {activeRecruiterJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Outreach Composer for {activeRecruiterJob.recruiter.name}</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {activeRecruiterJob.recruiter.role} at {activeRecruiterJob.company} • {activeRecruiterJob.title}
                </p>
              </div>
              <button
                onClick={() => setActiveRecruiterJob(null)}
                className="text-zinc-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {isGenerating ? (
              <div className="py-12 text-center space-y-3">
                <Loader2 className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
                <p className="text-xs text-zinc-400">Crafting tailored pitch...</p>
              </div>
            ) : outreachData ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase">Subject:</div>
                  <div className="text-xs font-semibold text-white bg-zinc-950 p-2 rounded border border-zinc-800">
                    {outreachData.emailSubject}
                  </div>

                  <div className="text-[11px] font-mono text-zinc-400 uppercase pt-2">Email Body:</div>
                  <p className="text-xs text-zinc-200 whitespace-pre-line leading-relaxed bg-zinc-950 p-3 rounded border border-zinc-800">
                    {outreachData.emailBody}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `Subject: ${outreachData.emailSubject}\n\n${outreachData.emailBody}`
                      );
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
                  </button>

                  <a
                    href={`mailto:${activeRecruiterJob.recruiter.email}?subject=${encodeURIComponent(
                      outreachData.emailSubject
                    )}&body=${encodeURIComponent(outreachData.emailBody)}`}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 fill-zinc-950" />
                    <span>Launch in Mail Client</span>
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
