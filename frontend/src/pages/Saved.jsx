import React from 'react';
import OpportunityGrid from '../components/OpportunityGrid';
import { Bookmark, BookmarkCheck, ArrowRight } from 'lucide-react';

export default function Saved({
  savedOpportunities = [],
  savedIds = [],
  onToggleSave,
  onNavigateToOpportunities,
  onSelectTag
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <BookmarkCheck className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Saved Opportunities
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Keep track of bookmarks, upcoming deadlines, and applications in progress.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-amber-300">
          <strong>{savedOpportunities.length}</strong> shortlisted
        </span>
      </div>

      {/* Grid of Saved items or Empty State */}
      {savedOpportunities.length === 0 ? (
        <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center my-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-200 mb-2">No saved opportunities yet</h3>
          <p className="text-sm text-slate-400 max-w-md mb-6">
            Click the bookmark icon on any opportunity card to save it here for quick access later.
          </p>
          <button
            type="button"
            onClick={onNavigateToOpportunities}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/20"
          >
            <span>Explore Opportunities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <OpportunityGrid
          opportunities={savedOpportunities}
          savedIds={savedIds}
          onToggleSave={onToggleSave}
          onSelectTag={onSelectTag}
        />
      )}
    </div>
  );
}
