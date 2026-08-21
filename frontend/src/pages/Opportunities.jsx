import React from 'react';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import OpportunityGrid from '../components/OpportunityGrid';
import { Compass, Sparkles, Filter } from 'lucide-react';

export default function Opportunities({
  opportunities = [],
  savedIds = [],
  onToggleSave,
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedMode,
  setSelectedMode,
  selectedSkill,
  setSelectedSkill,
  sortBy,
  setSortBy,
  availableSkills = [],
  onResetFilters,
  hasActiveFilters,
  onSelectTag
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Compass className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Opportunity Radar Directory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse hackathons, internships, competitions, scholarships and fellowships curated for you.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300">
            Showing <strong className="text-indigo-400">{opportunities.length}</strong> opportunities
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search by title, organizer, skills, or opportunity type..."
      />

      {/* Filter Panel */}
      <FilterPanel
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        selectedSkill={selectedSkill}
        setSelectedSkill={setSelectedSkill}
        sortBy={sortBy}
        setSortBy={setSortBy}
        availableSkills={availableSkills}
        onReset={onResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Results Grid */}
      <OpportunityGrid
        opportunities={opportunities}
        savedIds={savedIds}
        onToggleSave={onToggleSave}
        onSelectTag={onSelectTag}
        onResetFilters={onResetFilters}
        emptyTitle="No matching opportunities"
        emptyMessage="We couldn't find any opportunities matching your current search or filter combination."
      />
    </div>
  );
}
