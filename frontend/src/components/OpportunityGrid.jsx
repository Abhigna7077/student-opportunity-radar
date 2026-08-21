import React from 'react';
import OpportunityCard from './OpportunityCard';
import { SearchX, Sparkles } from 'lucide-react';

export default function OpportunityGrid({
  opportunities = [],
  savedIds = [],
  onToggleSave,
  onSelectTag,
  onResetFilters,
  emptyTitle = "No opportunities found",
  emptyMessage = "Try changing your search terms or relaxing your filter criteria."
}) {
  if (opportunities.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center my-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-200 mb-2">{emptyTitle}</h3>
        <p className="text-sm text-slate-400 max-w-md mb-6">{emptyMessage}</p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {opportunities.map((opportunity) => (
        <OpportunityCard
          key={opportunity.id}
          opportunity={opportunity}
          isSaved={savedIds.includes(opportunity.id)}
          onToggleSave={onToggleSave}
          onSelectTag={onSelectTag}
        />
      ))}
    </div>
  );
}
