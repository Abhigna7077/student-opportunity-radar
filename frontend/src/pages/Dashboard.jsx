import React from 'react';
import { 
  Sparkles, 
  Radar, 
  Flame, 
  Clock, 
  Bookmark, 
  ArrowRight, 
  Compass, 
  TrendingUp 
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import OpportunityCard from '../components/OpportunityCard';
import ProfileCard from '../components/ProfileCard';
import { calculateDeadlineStatus } from '../utils/deadlineUtils';

export default function Dashboard({
  opportunities = [],
  savedIds = [],
  onToggleSave,
  onNavigateToOpportunities,
  searchQuery,
  setSearchQuery,
  onSelectTag,
  profile
}) {
  // Top matched opportunities from real API data
  const topMatches = [...opportunities]
    .sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))
    .slice(0, 3);

  // Urgent deadlines computed dynamically
  const urgentDeadlines = opportunities.filter((opp) => {
    const status = calculateDeadlineStatus(opp.deadlineISO, opp.deadline).toLowerCase();
    return (
      status.includes('today') ||
      status.includes('tomorrow') ||
      status.includes('1 day') ||
      status.includes('2 day') ||
      status.includes('3 day') ||
      status.includes('4 day') ||
      status.includes('5 day')
    );
  });

  const highestMatch = opportunities.length > 0 
    ? Math.max(...opportunities.map(o => o.matchPercentage || 0), 0) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Hero Radar Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Opportunity Radar • Live API</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Your Opportunity Radar
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Discover opportunities matched to your skills, interests and goals.
          </p>

          {/* Core USP Banner */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/70 border border-indigo-500/30 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
              <Radar className="w-4 h-4 text-indigo-300" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-indigo-200">
              <span className="font-bold text-white">USP:</span> "Opportunities find you, instead of you searching everywhere."
            </p>
          </div>

          {/* Quick Search */}
          <div className="pt-2">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search hackathons, internships, competitions, skills..."
            />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Radar Opportunities */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Radar Opportunities</span>
            <Compass className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{opportunities.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Live from API
          </div>
        </div>

        {/* Metric 2: Top Match Score */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Top Match Score</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{highestMatch}%</div>
          <div className="text-[11px] text-slate-400 mt-1">Real-time profile match</div>
        </div>

        {/* Metric 3: Urgent Deadlines */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Urgent Deadlines</span>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-300">{urgentDeadlines.length}</div>
          <div className="text-[11px] text-rose-400/80 mt-1">Closing within 5 days</div>
        </div>

        {/* Metric 4: Saved Items */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Saved Items</span>
            <Bookmark className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300">{savedIds.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Shortlisted in storage</div>
        </div>
      </div>

      {/* Top Radar Matches Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Top Radar Matches</h2>
              <p className="text-xs text-slate-400">High compatibility calculated by match algorithm</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToOpportunities}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <span>View All ({opportunities.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topMatches.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              isSaved={savedIds.includes(opportunity.id)}
              onToggleSave={onToggleSave}
              onSelectTag={onSelectTag}
            />
          ))}
        </div>
      </section>

      {/* Profile Snapshot Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Your Profile Target Radar</h2>
            <p className="text-xs text-slate-400">Opportunities are scored against these parameters</p>
          </div>
        </div>
        <ProfileCard profile={profile} />
      </section>
    </div>
  );
}
