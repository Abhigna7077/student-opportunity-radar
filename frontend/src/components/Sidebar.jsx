import React from 'react';
import { 
  LayoutDashboard, 
  Compass, 
  Code2, 
  Briefcase, 
  Trophy, 
  GraduationCap, 
  Award, 
  BookmarkCheck,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { STUDENT_PROFILE } from '../data/sampleOpportunities';

export default function Sidebar({
  activeTab,
  setActiveTab,
  selectedType,
  setSelectedType,
  savedCount = 0,
  typeCounts = {}
}) {
  const mainNavigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'opportunities', label: 'All Opportunities', icon: Compass, count: typeCounts.all || 0 },
    { id: 'saved', label: 'Saved Opportunities', icon: BookmarkCheck, count: savedCount },
  ];

  const opportunityCategories = [
    { type: 'Hackathon', label: 'Hackathons', icon: Code2, count: typeCounts.Hackathon || 0 },
    { type: 'Internship', label: 'Internships', icon: Briefcase, count: typeCounts.Internship || 0 },
    { type: 'Competition', label: 'Competitions', icon: Trophy, count: typeCounts.Competition || 0 },
    { type: 'Scholarship', label: 'Scholarships', icon: GraduationCap, count: typeCounts.Scholarship || 0 },
    { type: 'Fellowship', label: 'Fellowships', icon: Award, count: typeCounts.Fellowship || 0 },
  ];

  const handleCategoryClick = (type) => {
    setSelectedType(type);
    setActiveTab('opportunities');
  };

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between p-4 bg-slate-950/60 border-r border-slate-800/80 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Section 1: Main navigation */}
        <div>
          <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Overview
          </span>
          <div className="space-y-1">
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && (item.id !== 'opportunities' || selectedType === 'all');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id === 'opportunities') setSelectedType('all');
                    setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      isActive ? 'bg-indigo-950 text-indigo-200' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Opportunity Categories */}
        <div>
          <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Opportunity Radar
          </span>
          <div className="space-y-1">
            {opportunityCategories.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === 'opportunities' && selectedType.toLowerCase() === item.type.toLowerCase();
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => handleCategoryClick(item.type)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800/80 text-slate-400">
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mini Profile Footer in Sidebar */}
      <div 
        onClick={() => setActiveTab('profile')}
        className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-indigo-500/40 cursor-pointer transition-all mt-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            {STUDENT_PROFILE.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-200 truncate">{STUDENT_PROFILE.name}</h4>
            <p className="text-[11px] text-indigo-400 truncate">{STUDENT_PROFILE.branch}</p>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <span>Match Radar</span>
          <span className="text-emerald-400 font-semibold">{STUDENT_PROFILE.radarScore}</span>
        </div>
      </div>
    </aside>
  );
}
