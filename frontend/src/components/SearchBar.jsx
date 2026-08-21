import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  placeholder = "Search hackathons, internships, competitions, skills, organizers..." 
}) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-5 h-5" />
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500 rounded-xl text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
      />

      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
          title="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
