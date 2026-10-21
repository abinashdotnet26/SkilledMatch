import React from 'react';
import { Search, SlidersHorizontal, Sparkles, ShieldCheck, Flame, ArrowUpDown, X, Globe } from 'lucide-react';

export interface FilterState {
  searchQuery: string;
  category: string;
  workMode: string;
  region: string;
  employmentType: string;
  lowCompetitionOnly: boolean;
  atsSource: string;
  sortBy: 'newest' | 'competition' | 'match' | 'salary';
}

interface JobsFilterBarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  totalFiltered: number;
  totalJobs: number;
}

const CATEGORIES = [
  'All Roles',
  'Java / Spring Boot',
  '.NET / C#',
  'QA & Automation',
  'Frontend',
  'Backend',
  'Fullstack',
  'AI / Machine Learning',
  'DevOps / Cloud',
  'Product Management',
  'Data',
  'Mobile (iOS & Android)',
  'UI/UX & Product Design',
  'Cybersecurity',
];

const EMPLOYMENT_TYPES = ['All Types', 'Full-Time', 'Contract', 'Internship', 'Part-Time'];

const REGIONS = [
  { id: '', label: '🌐 All Worldwide' },
  { id: 'India', label: '🇮🇳 India' },
  { id: 'US', label: '🇺🇸 United States' },
  { id: 'Europe', label: '🇪🇺 Europe' },
  { id: 'Global', label: '🌍 Global Remote' },
];

const WORK_MODES = ['All Modes', 'Remote', 'Hybrid', 'Onsite'];

const ATS_SOURCES = ['All ATS Sources', 'Ashby', 'Greenhouse', 'Lever', 'Workday'];

export const JobsFilterBar: React.FC<JobsFilterBarProps> = ({
  filters,
  onChange,
  totalFiltered,
  totalJobs,
}) => {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Top Search & Primary Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Search roles, tech stack (e.g. React, Python, Swiggy, Linear), or city..."
            className="w-full pl-10 pr-9 py-2.5 bg-zinc-950 border border-zinc-700/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onChange({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Low Competition Filter Toggle */}
        <button
          onClick={() => onChange({ ...filters, lowCompetitionOnly: !filters.lowCompetitionOnly })}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition cursor-pointer ${
            filters.lowCompetitionOnly
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
              : 'bg-zinc-950 border-zinc-700 text-zinc-300 hover:border-zinc-600'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span>Low Competition (&lt;10 applicants)</span>
        </button>

        {/* Sort Select */}
        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-700/80 rounded-xl px-3 py-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
            className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
          >
            <option value="newest" className="bg-zinc-900 text-white">⚡ Scraped: Newest First</option>
            <option value="competition" className="bg-zinc-900 text-white">🟢 Lowest Competition</option>
            <option value="match" className="bg-zinc-900 text-white">🎯 Highest CV Match %</option>
            <option value="salary" className="bg-zinc-900 text-white">💰 Highest Salary</option>
          </select>
        </div>
      </div>

      {/* Worldwide Regions Filter Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
        <span className="text-zinc-500 text-xs font-semibold shrink-0 flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Region:</span>
        </span>
        {REGIONS.map((reg) => {
          const isSelected = (!filters.region && !reg.id) || filters.region === reg.id;
          return (
            <button
              key={reg.id}
              onClick={() => onChange({ ...filters, region: reg.id })}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {reg.label}
            </button>
          );
        })}
      </div>

      {/* Role Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isSelected = (cat === 'All Roles' && !filters.category) || filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() => onChange({ ...filters, category: cat === 'All Roles' ? '' : cat })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Sub-Filters: Work Mode & ATS Source */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-zinc-800/80 text-xs text-zinc-400">
        <div className="flex flex-wrap items-center gap-4">
          {/* Work Mode */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-medium">Work Mode:</span>
            <div className="flex items-center gap-1">
              {WORK_MODES.map((mode) => {
                const isSelected = (mode === 'All Modes' && !filters.workMode) || filters.workMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => onChange({ ...filters, workMode: mode === 'All Modes' ? '' : mode })}
                    className={`px-2 py-0.5 rounded text-[11px] transition ${
                      isSelected
                        ? 'bg-zinc-700 text-white font-medium'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Employment Type */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-medium">Type:</span>
            <div className="flex items-center gap-1">
              {EMPLOYMENT_TYPES.map((type) => {
                const isSelected = (type === 'All Types' && !filters.employmentType) || filters.employmentType === type;
                return (
                  <button
                    key={type}
                    onClick={() => onChange({ ...filters, employmentType: type === 'All Types' ? '' : type })}
                    className={`px-2 py-0.5 rounded text-[11px] transition ${
                      isSelected
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-medium'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ATS Source Filter */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-medium">Direct ATS:</span>
            <select
              value={filters.atsSource}
              onChange={(e) => onChange({ ...filters, atsSource: e.target.value === 'All ATS Sources' ? '' : e.target.value })}
              className="bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-[11px] text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer"
            >
              {ATS_SOURCES.map((source) => (
                <option key={source} value={source === 'All ATS Sources' ? '' : source} className="bg-zinc-900">
                  {source}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="text-xs font-mono text-zinc-400">
          Showing <span className="text-emerald-400 font-bold">{totalFiltered}</span> of {totalJobs} active postings
        </div>
      </div>
    </div>
  );
};
