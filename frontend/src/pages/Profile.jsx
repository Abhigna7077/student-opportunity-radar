import React from 'react';
import { 
  User, 
  Target, 
  Layers, 
  Radio, 
  CheckCircle2,
  Sparkles,
  Sliders
} from 'lucide-react';
import ProfileCard from '../components/ProfileCard';

export default function Profile({
  profile,
  onUpdatePreferredMode
}) {
  const targetTypes = profile.targetTypes || ["Hackathon", "Internship", "Fellowship", "Competition", "Scholarship"];
  const preferredModes = profile.preferredModes || ["Online", "Offline"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <User className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Student Profile & Radar Config
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Your profile parameters guide the Opportunity Radar algorithm to score and surface relevant listings.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-950/60 border border-indigo-500/30 text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Backend Matching Active</span>
        </div>
      </div>

      {/* Main Profile Card Component */}
      <ProfileCard profile={profile} />

      {/* Preferences & Matching Criteria Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Preference Card 1: Target Opportunity Types */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <Target className="w-4 h-4 text-indigo-400" />
            <span>Target Opportunity Types</span>
          </div>
          <p className="text-xs text-slate-400">
            Radar prioritizes and alerts you for these selected formats:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {targetTypes.map((type, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-950/60 border border-indigo-500/30 text-indigo-300"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Preference Card 2: Preferred Delivery Mode */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Preferred Delivery Mode</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              Selected: {profile.preferredMode || 'Online'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Click to switch mode and dynamically re-calculate match percentages:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {preferredModes.map((mode, i) => {
              const isSelected = (profile.preferredMode || 'Online').toLowerCase() === mode.toLowerCase();
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onUpdatePreferredMode && onUpdatePreferredMode(mode)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                  }`}
                >
                  <CheckCircle2 className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  {mode}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* How Radar Works Notice */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/20 space-y-2">
        <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <Radio className="w-4 h-4" />
          <span>Live Match Radar Engine (Express API)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The radar engine continuously scores all live scraped opportunities from Unstop using your branch (<strong>{profile.branch}</strong>), listed skills (<strong>{profile.skills?.join(', ')}</strong>), and preferred mode (<strong>{profile.preferredMode || 'Online'}</strong>) via the <code>POST /api/opportunities/match</code> endpoint.
        </p>
      </div>
    </div>
  );
}
