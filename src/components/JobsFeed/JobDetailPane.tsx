import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Building,
  MapPin,
  DollarSign,
  Briefcase,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  Bot,
  Copy,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  FileText,
  Mail,
  Linkedin,
  Loader2,
  Check,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Job, CandidateProfile } from '../../types/protocol';

interface JobDetailPaneProps {
  job: Job | null;
  candidate: CandidateProfile;
  onClose: () => void;
  onQueueConcierge: (job: Job) => void;
  onMarkApplied: (job: Job, method: 'Apply Concierge' | '1-Click Autofill' | 'Manual ATS' | 'Recruiter Cold Ping') => void;
  isQueued?: boolean;
  isApplied?: boolean;
}

export const JobDetailPane: React.FC<JobDetailPaneProps> = ({
  job,
  candidate,
  onClose,
  onQueueConcierge,
  onMarkApplied,
  isQueued,
  isApplied,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'match' | 'autofill' | 'recruiter' | 'prep'>('overview');

  // Match analysis state
  const [matchData, setMatchData] = useState<any>(null);
  const [isAnalyzingMatch, setIsAnalyzingMatch] = useState(false);

  // Tailored resume state
  const [tailoredResume, setTailoredResume] = useState<string | null>(null);
  const [isTailoring, setIsTailoring] = useState(false);
  const [copiedResume, setCopiedResume] = useState(false);

  // Recruiter outreach state
  const [recruiterOutreach, setRecruiterOutreach] = useState<any>(null);
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false);
  const [outreachTone, setOutreachTone] = useState<'direct' | 'enthusiastic' | 'problem-solver'>('direct');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDm, setCopiedDm] = useState(false);

  // Interview prep state
  const [prepData, setPrepData] = useState<any>(null);
  const [isGeneratingPrep, setIsGeneratingPrep] = useState(false);

  // Autofill form state
  const [autofillSubmitted, setAutofillSubmitted] = useState(false);
  const [autofillCustomNote, setAutofillCustomNote] = useState('');

  // Reset states when job changes
  useEffect(() => {
    if (!job) return;
    setMatchData(null);
    setTailoredResume(null);
    setRecruiterOutreach(null);
    setPrepData(null);
    setAutofillSubmitted(false);
    setActiveTab('overview');
    setAutofillCustomNote(
      `Hi ${job.company} Team, I'm very excited about the ${job.title} role. With ${candidate.experienceYears}+ years in ${candidate.skills.slice(0, 3).join(', ')}, I can hit the ground running on your core systems.`
    );
  }, [job?.id]);

  if (!job) return null;

  // Handle Match Analysis
  const handleAnalyzeMatch = async () => {
    setIsAnalyzingMatch(true);
    try {
      const res = await fetch('/api/ai/match-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: job.title,
          company: job.company,
          jobDescription: job.description + '\n' + job.requirements.join('\n'),
          candidateProfile: candidate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMatchData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingMatch(false);
    }
  };

  // Handle Resume Tailoring
  const handleTailorResume = async () => {
    setIsTailoring(true);
    try {
      const res = await fetch('/api/ai/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: job.title,
          company: job.company,
          jobDescription: job.description + '\n' + job.requirements.join('\n'),
          candidateProfile: candidate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTailoredResume(data.tailoredResume);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTailoring(false);
    }
  };

  // Handle Recruiter Outreach Generation
  const handleGenerateOutreach = async (tone = outreachTone) => {
    setIsGeneratingOutreach(true);
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
        setRecruiterOutreach(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingOutreach(false);
    }
  };

  // Handle Interview Prep Generation
  const handleGeneratePrep = async () => {
    setIsGeneratingPrep(true);
    try {
      const res = await fetch('/api/ai/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: job.title,
          company: job.company,
          jobDescription: job.description + '\n' + job.requirements.join('\n'),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPrepData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPrep(false);
    }
  };

  const handleSimulateSubmit = () => {
    setAutofillSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#06b6d4', '#3b82f6'],
    });
    onMarkApplied(job, '1-Click Autofill');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-zinc-950 border-l border-zinc-800 h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-14 h-14 rounded-2xl object-cover border border-zinc-700 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl font-bold text-emerald-400 shrink-0">
                {job.company[0]}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  ⚡ {job.postedAt} direct via {job.atsSource}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  🟢 {job.applicantCount} applicants (Low Competition)
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">{job.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-1">
                <span className="font-semibold text-zinc-200">{job.company}</span>
                <span>•</span>
                <span className="font-mono">{job.companyStage}</span>
                <span>•</span>
                <span>{job.location} ({job.workMode})</span>
                <span>•</span>
                <span className="text-emerald-400 font-mono font-semibold">{job.salaryRange}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-900/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Match:</span>
            <div className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{job.matchScore}% CV Fit</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Direct ATS URL */}
            <a
              href={job.atsJobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-600 bg-zinc-900 text-xs text-zinc-300 flex items-center gap-1.5 hover:text-white transition"
            >
              <span>Original ATS</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>

            {/* Queue to Concierge */}
            <button
              onClick={() => onQueueConcierge(job)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                isQueued
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isQueued ? 'Queued in Concierge' : 'Delegate to Concierge'}</span>
            </button>

            {/* Quick Autofill */}
            <button
              onClick={() => setActiveTab('autofill')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-zinc-950" />
              <span>1-Click Autofill</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation inside Detail */}
        <div className="px-5 border-b border-zinc-800 bg-zinc-950 flex space-x-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Job Overview', icon: Briefcase },
            { id: 'match', label: 'AI Match & ATS Score', icon: Sparkles },
            { id: 'autofill', label: '1-Click Autofill', icon: Zap },
            { id: 'recruiter', label: 'SkillMatch Advantage (Recruiter)', icon: Users },
            { id: 'prep', label: 'Interview Prep', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'match' && !matchData) handleAnalyzeMatch();
                  if (tab.id === 'recruiter' && !recruiterOutreach) handleGenerateOutreach();
                  if (tab.id === 'prep' && !prepData) handleGeneratePrep();
                }}
                className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition ${
                  isActive
                    ? 'border-emerald-400 text-emerald-400 font-semibold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* SkillMatch Signal Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-cyan-950/60 border border-emerald-500/30">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
                  <Zap className="w-4 h-4 fill-emerald-400" />
                  SKILLMATCH STEALTH ADVANTAGE
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  This role was detected on {job.company}'s <strong>{job.atsSource}</strong> careers pipeline{' '}
                  <strong className="text-white">{job.postedAt}</strong>. It is not yet indexed by primary LinkedIn/Indeed scrapers.
                  With only <strong className="text-emerald-300">{job.applicantCount} active applicants</strong>, your odds of human review are currently <strong>4.2x higher</strong> than industry baseline.
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Role Summary</h3>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>

              {/* Tech Stack Tags */}
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Required Core Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-200 text-xs border border-zinc-700 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Key Responsibilities & Requirements</h3>
                <ul className="space-y-2">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Compensation & Perks</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {job.benefits.map((b, idx) => (
                    <li
                      key={idx}
                      className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: AI MATCH & ATS SCORE */}
          {activeTab === 'match' && (
            <div className="space-y-6">
              {isAnalyzingMatch ? (
                <div className="py-16 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                  <p className="text-sm text-zinc-300 font-medium">Running SkillMatch AI Match & ATS Gap Analysis...</p>
                  <p className="text-xs text-zinc-500">Cross-referencing your profile against {job.company}'s requirements</p>
                </div>
              ) : (
                <>
                  {/* Score Card */}
                  <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-full bg-zinc-950 border-4 border-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <span className="text-2xl font-black font-mono text-emerald-400">
                          {matchData?.matchScore || job.matchScore}%
                        </span>
                      </div>
                      <div>
                        <div className="text-base font-bold text-white">Overall ATS Alignment</div>
                        <div className="text-xs text-emerald-400 font-medium mt-0.5">
                          Fit Rating: {matchData?.experienceFit || 'Strong'}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-1">
                          Evaluated against {candidate.name}'s profile & experience
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleTailorResume}
                      disabled={isTailoring}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                      {isTailoring ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating ATS Tailored CV...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate 1-Click Tailored Resume</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Why You Stand Out */}
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                      SKILLMATCH ADVANTAGE SUMMARY
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {matchData?.protocolAdvantageReason ||
                        `Your experience with ${candidate.skills.slice(0, 3).join(', ')} directly aligns with ${job.company}'s top requirements. Submitting before this job reaches secondary job portals gives you first-mover review priority.`}
                    </p>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Matched */}
                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Matched Skills in Profile ({matchData?.matchedSkills?.length || 4})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(matchData?.matchedSkills || ['React', 'TypeScript', 'Node.js', 'System Design']).map(
                          (skill: string) => (
                            <span
                              key={skill}
                              className="text-xs px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-mono"
                            >
                              ✓ {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* Missing / Recommended */}
                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        <span>ATS Keywords to Highlight</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(matchData?.missingSkills || ['GraphQL', 'Kubernetes', 'CI/CD Pipelines']).map(
                          (skill: string) => (
                            <span
                              key={skill}
                              className="text-xs px-2.5 py-1 rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/60 font-mono"
                            >
                              + {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ATS Recommendations */}
                  <div>
                    <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-2">
                      Actionable ATS Optimization Tips
                    </h3>
                    <div className="space-y-2">
                      {(matchData?.atsRecommendations || [
                        `Quantify architectural throughput (e.g. "Scaled APIs to 2M+ sessions") in your lead summary.`,
                        `Include explicit references to ${job.tags[0] || 'core technologies'} in your most recent project description to satisfy ATS exact-match filters.`,
                      ]).map((tip: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2"
                        >
                          <span className="font-mono text-emerald-400 font-bold shrink-0">{idx + 1}.</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tailored Resume Snippet (if generated) */}
                  {tailoredResume && (
                    <div className="p-5 rounded-2xl bg-zinc-900 border border-emerald-500/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ATS TAILORED RESUME GENERATED
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(tailoredResume);
                            setCopiedResume(true);
                            setTimeout(() => setCopiedResume(false), 2000);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition cursor-pointer"
                        >
                          {copiedResume ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedResume ? 'Copied to Clipboard!' : 'Copy Markdown'}</span>
                        </button>
                      </div>
                      <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-72">
                        {tailoredResume}
                      </pre>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* TAB 3: 1-CLICK AUTOFILL */}
          {activeTab === 'autofill' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 mb-1">
                  <Zap className="w-4 h-4 fill-cyan-400" />
                  SKILLMATCH 1-CLICK ATS FAST APPLY
                </div>
                <p className="text-xs text-zinc-300">
                  SkillMatch auto-populates all candidate fields for <strong>{job.atsSource}</strong> in one click, eliminating redundant 15-minute form filling.
                </p>
              </div>

              {autofillSubmitted ? (
                <div className="py-12 text-center space-y-4 bg-emerald-950/20 border border-emerald-500/40 rounded-2xl p-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Application Successfully Submitted!</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Submitted to <strong>{job.company}</strong> via {job.atsSource} with customized resume and cover note.
                    </p>
                  </div>
                  <div className="p-3 max-w-md mx-auto rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 text-left space-y-1">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Applicant:</span>
                      <span className="font-semibold text-white">{candidate.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Target Role:</span>
                      <span className="font-semibold text-white">{job.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">ATS Source:</span>
                      <span className="font-mono text-cyan-400">{job.atsSource}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Pipeline Status:</span>
                      <span className="font-semibold text-emerald-400">Moved to Applied in Tracker</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Prefilled Fields Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-zinc-400 font-medium">Full Name</label>
                      <input
                        type="text"
                        readOnly
                        value={candidate.name}
                        className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 font-medium">Email Address</label>
                      <input
                        type="text"
                        readOnly
                        value={candidate.email}
                        className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 font-medium">Phone Number</label>
                      <input
                        type="text"
                        readOnly
                        value={candidate.phone}
                        className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 font-medium">Work Authorization</label>
                      <input
                        type="text"
                        readOnly
                        value={candidate.workAuthorization}
                        className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 font-medium">LinkedIn URL</label>
                      <input
                        type="text"
                        readOnly
                        value={candidate.linkedin}
                        className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 font-medium">GitHub / Portfolio</label>
                      <input
                        type="text"
                        readOnly
                        value={candidate.github}
                        className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200"
                      />
                    </div>
                  </div>

                  {/* Custom Application Note / Cover Hook */}
                  <div>
                    <label className="text-xs text-zinc-300 font-medium flex items-center justify-between">
                      <span>Custom ATS Cover Note</span>
                      <span className="text-[11px] text-emerald-400 font-mono">Tailored for {job.company}</span>
                    </label>
                    <textarea
                      rows={4}
                      value={autofillCustomNote}
                      onChange={(e) => setAutofillCustomNote(e.target.value)}
                      className="w-full mt-1.5 p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
                    />
                  </div>

                  {/* Submission Trigger */}
                  <div className="pt-2">
                    <button
                      onClick={handleSimulateSubmit}
                      className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/25"
                    >
                      <Zap className="w-4 h-4 fill-zinc-950" />
                      <span>Submit 1-Click Application via {job.atsSource}</span>
                    </button>
                    <p className="text-[11px] text-zinc-500 text-center mt-2">
                      Automatically registers application in your pipeline tracker & syncs candidate metadata.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RECRUITER DIRECT (PROTOCOL ADVANTAGE) */}
          {activeTab === 'recruiter' && (
            <div className="space-y-6">
              {/* Recruiter Verified Card */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={job.recruiter.avatar}
                    alt={job.recruiter.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{job.recruiter.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Verified Hiring Lead
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">{job.recruiter.role} at {job.company}</div>
                    <div className="flex items-center gap-3 text-xs text-zinc-300 mt-2">
                      <span className="flex items-center gap-1 font-mono text-cyan-300">
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        {job.recruiter.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                  <a
                    href={job.recruiter.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 border border-zinc-700 flex items-center justify-center gap-1.5 transition"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                    <span>View LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* Cold Ping Generator */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    AI Personalized Cold Outreach Pitch
                  </div>
                  {/* Tone selector */}
                  <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-lg text-xs">
                    {(['direct', 'enthusiastic', 'problem-solver'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setOutreachTone(t);
                          handleGenerateOutreach(t);
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] capitalize transition cursor-pointer ${
                          outreachTone === t
                            ? 'bg-emerald-500 text-zinc-950 font-bold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {isGeneratingOutreach ? (
                  <div className="py-12 text-center space-y-3">
                    <Loader2 className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
                    <p className="text-xs text-zinc-400">Crafting personalized warm outreach to {job.recruiter.name}...</p>
                  </div>
                ) : recruiterOutreach ? (
                  <div className="space-y-4">
                    {/* Email Pitch */}
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Direct Email Draft</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `Subject: ${recruiterOutreach.emailSubject}\n\n${recruiterOutreach.emailBody}`
                              );
                              setCopiedEmail(true);
                              setTimeout(() => setCopiedEmail(false), 2000);
                            }}
                            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
                          >
                            {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedEmail ? 'Copied!' : 'Copy'}</span>
                          </button>
                          <a
                            href={`mailto:${job.recruiter.email}?subject=${encodeURIComponent(
                              recruiterOutreach.emailSubject
                            )}&body=${encodeURIComponent(recruiterOutreach.emailBody)}`}
                            className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-medium"
                          >
                            Open in Email Client
                          </a>
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-white bg-zinc-950 p-2 rounded border border-zinc-800">
                        Subject: {recruiterOutreach.emailSubject}
                      </div>
                      <p className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed bg-zinc-950 p-3 rounded border border-zinc-800 font-sans">
                        {recruiterOutreach.emailBody}
                      </p>
                    </div>

                    {/* LinkedIn Connection Note */}
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                          <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                          <span>LinkedIn 300-Char Connection Note</span>
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(recruiterOutreach.linkedinDm);
                            setCopiedDm(true);
                            setTimeout(() => setCopiedDm(false), 2000);
                          }}
                          className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
                        >
                          {copiedDm ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedDm ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-3 rounded border border-zinc-800">
                        {recruiterOutreach.linkedinDm}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* TAB 5: INTERVIEW PREP */}
          {activeTab === 'prep' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-zinc-900 border border-emerald-500/30">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                  <HelpCircle className="w-4 h-4" />
                  SKILLMATCH INTERVIEW PLAYBOOK
                </div>
                <p className="text-xs text-zinc-300">
                  Targeted questions and response frameworks tailored specifically to {job.company}'s engineering stage and culture.
                </p>
              </div>

              {isGeneratingPrep ? (
                <div className="py-12 text-center space-y-3">
                  <Loader2 className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
                  <p className="text-xs text-zinc-400">Synthesizing interview questions and STAR answer guides...</p>
                </div>
              ) : prepData ? (
                <div className="space-y-4">
                  {prepData.questions?.map((q: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {q.category}
                        </span>
                        <span className="text-xs text-zinc-500 font-mono">Q{idx + 1} of 4</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{q.question}</h4>

                      {/* Pro tip */}
                      <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300">
                        <strong className="text-emerald-400">Pro Tip:</strong> {q.proTip}
                      </div>

                      {/* Sample key points */}
                      {q.sampleKeyPoints && (
                        <div>
                          <div className="text-[11px] text-zinc-400 font-medium mb-1">Key talking points to cover:</div>
                          <ul className="list-disc list-inside text-xs text-zinc-300 space-y-1">
                            {q.sampleKeyPoints.map((pt: string, pIdx: number) => (
                              <li key={pIdx}>{pt}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
