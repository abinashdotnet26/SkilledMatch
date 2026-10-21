import React, { useState } from 'react';
import {
  X,
  Building,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Sparkles,
  Lock,
  CreditCard,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Job } from '../../types/protocol';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: (newJob: Job) => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({ isOpen, onClose, onJobCreated }) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [companyStage, setCompanyStage] = useState<'Seed' | 'Series A' | 'Series B' | 'Series C+' | 'Public'>('Series A');
  const [location, setLocation] = useState('Remote (US & Global)');
  const [workMode, setWorkMode] = useState<'Remote' | 'Hybrid' | 'Onsite'>('Remote');
  const [salaryRange, setSalaryRange] = useState('$175,000 - $215,000');
  const [minSalary, setMinSalary] = useState(175000);
  const [category, setCategory] = useState<any>('Frontend');
  const [atsSource, setAtsSource] = useState<any>('Ashby');
  const [atsJobUrl, setAtsJobUrl] = useState('https://jobs.ashbyhq.com/company/open-role');
  const [tags, setTags] = useState('React, TypeScript, Next.js, Node.js');
  const [description, setDescription] = useState('');
  const [recruiterName, setRecruiterName] = useState('Sarah Jenkins');
  const [recruiterEmail, setRecruiterEmail] = useState('sarah.j@company.io');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      const createdJob: Job = {
        id: `job-${Date.now()}`,
        title,
        company,
        companyStage,
        location,
        workMode,
        salaryRange,
        minSalaryUsd: Number(minSalary),
        category,
        atsSource,
        atsJobUrl,
        postedAt: 'Just now (Featured)',
        postedTimestamp: Date.now(),
        applicantCount: 1,
        isLowCompetition: true,
        matchScore: 95,
        experienceLevel: 'Senior',
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        description: description || `Join ${company} as our new ${title}. We are building high-impact products and scaling our engineering team.`,
        requirements: [
          'Strong hands-on experience in core technologies and web architecture',
          'Demonstrated track record of shipping production-grade software',
          'Collaborative mindset and excellent communication skills',
        ],
        benefits: [
          'Top-tier competitive salary and meaningful equity',
          'Comprehensive medical, dental, and vision insurance',
          'Flexible remote work policy and generous equipment stipend',
        ],
        recruiter: {
          name: recruiterName,
          role: 'Head of Talent & Hiring',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
          linkedinUrl: 'https://linkedin.com',
          email: recruiterEmail,
          isVerified: true,
        },
      };

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#f59e0b'],
      });

      onJobCreated(createdJob);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-zinc-950 font-bold shadow-lg shadow-amber-500/20">
            <Building className="w-5 h-5 text-zinc-950" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Post a Featured Stealth Job</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Employer Portal • $199
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Reach top 5% matched candidates directly before public job boards.
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Job Successfully Posted!</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Your role for <strong>{company}</strong> has been featured on the stealth feed and pushed to qualified candidates.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-300 font-medium">Job Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-medium">Company Name</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe, Linear, Vercel"
                  className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Fullstack">Fullstack</option>
                  <option value="AI / Machine Learning">AI / Machine Learning</option>
                  <option value="DevOps / Cloud">DevOps / Cloud</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Data">Data</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-300 font-medium">Work Mode</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-300 font-medium">Salary Range</label>
                <input
                  type="text"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  placeholder="e.g. $170,000 - $210,000"
                  className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-medium">ATS Source</label>
                <select
                  value={atsSource}
                  onChange={(e) => setAtsSource(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Ashby">Ashby</option>
                  <option value="Greenhouse">Greenhouse</option>
                  <option value="Lever">Lever</option>
                  <option value="Workday">Workday</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-zinc-300 font-medium">Direct ATS Application Link</label>
                <input
                  type="url"
                  required
                  value={atsJobUrl}
                  onChange={(e) => setAtsJobUrl(e.target.value)}
                  placeholder="https://jobs.ashbyhq.com/..."
                  className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-zinc-300 font-medium">Core Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. React, TypeScript, Python, Next.js"
                  className="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-zinc-300 font-medium">Hiring Manager / Recruiter Contact</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <input
                    type="text"
                    required
                    value={recruiterName}
                    onChange={(e) => setRecruiterName(e.target.value)}
                    placeholder="Recruiter Name"
                    className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="email"
                    required
                    value={recruiterEmail}
                    onChange={(e) => setRecruiterEmail(e.target.value)}
                    placeholder="Direct Email"
                    className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Price & Checkout summary */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-3">
              <div>
                <span className="text-zinc-400">Featured Job Listing (30 Days)</span>
                <div className="text-white font-bold text-sm mt-0.5">
                  $199 USD / ₹14,999 INR One-Time
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pushed to WhatsApp & Stealth Feed</span>
              </div>
            </div>

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
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
              >
                {isSubmitting ? (
                  <span>Processing Listing...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay $199 & Publish Job</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
