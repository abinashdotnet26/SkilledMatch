import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Copy,
  Check,
  Save,
  Loader2,
  Sliders,
  DollarSign,
  Briefcase,
  Terminal,
} from 'lucide-react';
import { CandidateProfile } from '../../types/protocol';

interface ResumeOptimizerViewProps {
  candidate: CandidateProfile;
  onUpdateCandidate: (updated: CandidateProfile) => void;
}

export const ResumeOptimizerView: React.FC<ResumeOptimizerViewProps> = ({
  candidate,
  onUpdateCandidate,
}) => {
  const [profile, setProfile] = useState<CandidateProfile>(candidate);
  const [newSkill, setNewSkill] = useState('');
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isGeneratingGeneral, setIsGeneratingGeneral] = useState(false);
  const [generalOptimizedResume, setGeneralOptimizedResume] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || profile.skills.includes(newSkill.trim())) return;
    const updated = { ...profile, skills: [...profile.skills, newSkill.trim()] };
    setProfile(updated);
    setNewSkill('');
    onUpdateCandidate(updated);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = {
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    };
    setProfile(updated);
    onUpdateCandidate(updated);
  };

  const handleSaveProfile = () => {
    onUpdateCandidate(profile);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleGenerateOptimized = async () => {
    setIsGeneratingGeneral(true);
    try {
      const res = await fetch('/api/ai/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: profile.title,
          company: 'Top Tier Tech Companies (General Benchmark)',
          jobDescription: `High growth software engineering role requiring mastery in ${profile.skills.join(
            ', '
          )}, microservices, high-traffic systems, and modern cloud deployment.`,
          candidateProfile: profile,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneralOptimizedResume(data.tailoredResume);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingGeneral(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-emerald-950/40 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            AI MATCH & ATS OPTIMIZER
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Master Candidate Profile & CV Parser
          </h1>
          <p className="text-sm text-zinc-300 leading-relaxed">
            SkillMatch uses this profile to calculate real-time CV match percentages, populate 1-Click Autofill fields, and generate job-tailored resumes.
          </p>
        </div>

        {/* ATS Readiness Ring */}
        <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800 flex items-center gap-4 shrink-0 shadow-lg">
          <div className="relative w-16 h-16 rounded-full bg-zinc-900 border-4 border-emerald-500 flex items-center justify-center">
            <span className="text-lg font-mono font-bold text-emerald-400">94%</span>
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase font-mono">ATS Readiness</div>
            <div className="text-xs text-emerald-400 mt-0.5">Top Tier Profile Fit</div>
            <div className="text-[10px] text-zinc-500">Passes Ashby, Greenhouse, Lever</div>
          </div>
        </div>
      </div>

      {/* Profile Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Core Candidate Details</span>
              </h3>
              {isSavedNotice && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-zinc-400 font-medium">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-medium">Professional Title</label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-medium">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-medium">Phone</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-medium">Years of Experience</label>
                <input
                  type="number"
                  value={profile.experienceYears}
                  onChange={(e) => setProfile({ ...profile, experienceYears: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-medium">Expected Salary Range</label>
                <input
                  type="text"
                  value={profile.expectedSalary}
                  onChange={(e) => setProfile({ ...profile, expectedSalary: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-medium">LinkedIn URL</label>
                <input
                  type="text"
                  value={profile.linkedin}
                  onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-medium">GitHub / Portfolio URL</label>
                <input
                  type="text"
                  value={profile.github}
                  onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Skills Tags Section */}
            <div className="pt-3 border-t border-zinc-800 space-y-3">
              <label className="text-xs text-zinc-300 font-bold uppercase tracking-wider block">
                Primary Core Skills ({profile.skills.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-950 text-zinc-200 border border-zinc-700 text-xs font-mono"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-zinc-400 hover:text-rose-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Skill input */}
              <form onSubmit={handleAddSkill} className="flex gap-2 max-w-sm pt-1">
                <input
                  type="text"
                  placeholder="Add skill (e.g. C#, Spring Boot, Playwright)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 rounded-lg font-medium cursor-pointer"
                >
                  Add
                </button>
              </form>

              {/* Quick Tech Role Skill Presets */}
              <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-400">
                <span className="font-semibold text-zinc-500">Quick Add:</span>
                {[
                  { label: '+ .NET / C# Stack', skills: ['C#', '.NET 8', 'ASP.NET Core', 'EF Core', 'Azure'] },
                  { label: '+ Java / Spring Stack', skills: ['Java 21', 'Spring Boot 3', 'Kafka', 'Microservices'] },
                  { label: '+ QA & SDET Stack', skills: ['Playwright', 'Selenium', 'RestAssured', 'API Automation', 'Cypress'] },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      const merged = Array.from(new Set([...profile.skills, ...preset.skills]));
                      const updated = { ...profile, skills: merged };
                      setProfile(updated);
                      onUpdateCandidate(updated);
                    }}
                    className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-mono transition cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Resume Summary / Bio */}
            <div className="pt-3 border-t border-zinc-800 space-y-2">
              <label className="text-xs text-zinc-300 font-bold uppercase tracking-wider block">
                Professional Bio & Impact Summary
              </label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full p-3 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveProfile}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: ATS Optimizer & Generated CV */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>General ATS Benchmark CV</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Generate an ATS-certified markdown resume based on your current profile.
            </p>

            <button
              onClick={handleGenerateOptimized}
              disabled={isGeneratingGeneral}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-emerald-500/20"
            >
              {isGeneratingGeneral ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing ATS Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Master ATS Resume</span>
                </>
              )}
            </button>

            {generalOptimizedResume && (
              <div className="space-y-3 pt-3 border-t border-zinc-800 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-400">Generated Resume</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generalOptimizedResume);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-[11px] text-zinc-300 font-mono whitespace-pre-wrap max-h-80 overflow-y-auto leading-relaxed">
                  {generalOptimizedResume}
                </pre>
              </div>
            )}
          </div>

          {/* ATS Best Practices Guide */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3 text-xs">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>SkillMatch ATS Algorithm Guidelines</span>
            </div>
            <ul className="space-y-2 text-zinc-400">
              <li>• Always use standard section headers (Experience, Skills, Education).</li>
              <li>• Quantify metrics with the Google XYZ format ("Accomplished X by doing Y as measured by Z").</li>
              <li>• Apply within the first 24-72 hours of ATS posting for maximum review priority.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
