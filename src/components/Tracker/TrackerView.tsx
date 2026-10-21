import React, { useState } from 'react';
import {
  Kanban,
  List,
  Plus,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  MoreVertical,
  Download,
  Trash2,
  ExternalLink,
  DollarSign,
  MapPin,
  Bot,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ApplicationTrackerItem, ApplicationStage } from '../../types/protocol';

interface TrackerViewProps {
  items: ApplicationTrackerItem[];
  onUpdateStage: (itemId: string, newStage: ApplicationStage) => void;
  onDeleteItem: (itemId: string) => void;
  onAddItem: (item: ApplicationTrackerItem) => void;
}

const STAGES: { id: ApplicationStage; title: string; color: string; border: string }[] = [
  { id: 'saved', title: 'Saved / Watchlist', color: 'text-zinc-400', border: 'border-zinc-700' },
  { id: 'queued', title: 'Concierge Queued', color: 'text-cyan-400', border: 'border-cyan-500/40' },
  { id: 'applied', title: 'Applied (Direct ATS)', color: 'text-blue-400', border: 'border-blue-500/40' },
  { id: 'screening', title: 'Recruiter Screen', color: 'text-amber-400', border: 'border-amber-500/40' },
  { id: 'technical', title: 'Technical Rounds', color: 'text-purple-400', border: 'border-purple-500/40' },
  { id: 'offer', title: 'Offer Received 🎉', color: 'text-emerald-400', border: 'border-emerald-500/40' },
];

export const TrackerView: React.FC<TrackerViewProps> = ({
  items,
  onUpdateStage,
  onDeleteItem,
  onAddItem,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [newStage, setNewStage] = useState<ApplicationStage>('applied');

  const handleStageChange = (itemId: string, targetStage: ApplicationStage) => {
    onUpdateStage(itemId, targetStage);
    if (targetStage === 'offer') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#f59e0b', '#3b82f6'],
      });
    }
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) return;

    const newItem: ApplicationTrackerItem = {
      id: `track-${Date.now()}`,
      jobId: `custom-${Date.now()}`,
      jobTitle: newTitle,
      company: newCompany,
      salaryRange: newSalary || '$160,000 - $190,000',
      location: 'Remote',
      atsSource: 'Custom ATS',
      stage: newStage,
      appliedDate: 'Just now',
      appliedVia: 'Manual ATS',
      matchScore: 90,
      notes: 'Added manually to tracker',
    };

    onAddItem(newItem);
    setNewTitle('');
    setNewCompany('');
    setNewSalary('');
    setShowAddModal(false);
  };

  const handleExportCSV = () => {
    const headers = 'Job Title,Company,Stage,Salary Range,ATS Source,Applied Via,Applied Date\n';
    const rows = items
      .map(
        (i) =>
          `"${i.jobTitle}","${i.company}","${i.stage}","${i.salaryRange}","${i.atsSource}","${i.appliedVia}","${i.appliedDate}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `protocol-applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Kanban className="w-5 h-5 text-emerald-400" />
            <span>Application Pipeline</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
              {items.length} Active
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time tracking of applications submitted via Apply Concierge, 1-Click Autofill, and direct ATS.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition ${
                viewMode === 'kanban' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition ${
                viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Table List View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-1.5 transition cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-4 h-4 text-zinc-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Add Job */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Job</span>
          </button>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageItems = items.filter((i) => i.stage === stage.id);
            return (
              <div
                key={stage.id}
                className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-3.5 flex flex-col min-h-[460px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${stage.color.replace('text-', 'bg-')}`} />
                    <span className="text-xs font-bold text-white truncate">{stage.title}</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-full">
                    {stageItems.length}
                  </span>
                </div>

                {/* Column Items */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {stageItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition space-y-2.5 shadow-md group relative"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-white line-clamp-1">{item.jobTitle}</span>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                        <Building className="w-3 h-3 text-zinc-500" />
                        <span className="font-semibold text-zinc-300">{item.company}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">• {item.atsSource}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/60 font-mono">
                        <span className="text-emerald-400 font-semibold">{item.salaryRange.split('+')[0]}</span>
                        <span className="text-zinc-500">{item.matchScore}% Fit</span>
                      </div>

                      {item.notes && (
                        <p className="text-[11px] text-zinc-400 leading-tight bg-zinc-900/80 p-2 rounded border border-zinc-800/80">
                          {item.notes}
                        </p>
                      )}

                      {/* Stage Move Controls */}
                      <div className="pt-2 flex items-center justify-between gap-1">
                        <select
                          value={item.stage}
                          onChange={(e) => handleStageChange(item.id, e.target.value as ApplicationStage)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id} className="bg-zinc-900 text-white">
                              Move to: {s.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {stageItems.length === 0 && (
                    <div className="py-8 text-center text-xs text-zinc-600 font-mono border border-dashed border-zinc-800/60 rounded-xl">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Role & Company</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Compensation</th>
                  <th className="py-3 px-4">Applied Via</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-950/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{item.jobTitle}</div>
                      <div className="text-zinc-400 text-[11px] flex items-center gap-1.5 mt-0.5">
                        <span>{item.company}</span>
                        <span>•</span>
                        <span className="font-mono text-cyan-400">{item.atsSource}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={item.stage}
                        onChange={(e) => handleStageChange(item.id, e.target.value as ApplicationStage)}
                        className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id} className="bg-zinc-900">
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">{item.salaryRange}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px]">
                        {item.appliedVia}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">{item.appliedDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Custom Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add Application to Pipeline</h3>
            <form onSubmit={handleCreateCustom} className="space-y-3.5">
              <div>
                <label className="text-xs text-zinc-400">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400">Company</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe, Linear, Vercel"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400">Salary Range</label>
                <input
                  type="text"
                  placeholder="e.g. $170,000 - $210,000"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400">Stage</label>
                <select
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value as ApplicationStage)}
                  className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id} className="bg-zinc-900">
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs"
                >
                  Save to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
