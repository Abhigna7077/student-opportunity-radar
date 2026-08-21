import React from 'react';
import { Filter, SlidersHorizontal, RotateCcw, ArrowUpDown } from 'lucide-react';

export default function FilterPanel({
  selectedType,
  setSelectedType,
  selectedMode,
  setSelectedMode,
  selectedSkill,
  setSelectedSkill,
  sortBy,
  setSortBy,
  availableSkills = [],
  availableTypes = ['All', 'Hackathon', 'Internship', 'Competition', 'Scholarship', 'Fellowship'],
  onReset,
  hasActiveFilters = false
}) {
  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 md:p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          <span>Filters & Preferences</span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Filter Row 1: Type Pills */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
          Opportunity Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {availableTypes.map((type) => {
            const isSelected = (selectedType.toLowerCase() === type.toLowerCase()) || 
                               (selectedType === 'all' && type === 'All');
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type === 'All' ? 'all' : type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-slate-100 border border-slate-700/60'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Row 2: Mode, Skill & Sort Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {/* Mode Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
            Mode
          </label>
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Modes (Online & Offline)</option>
            <option value="Online">Online / Virtual Only</option>
            <option value="Offline">In-Person / Offline</option>
          </select>
        </div>

        {/* Skill Filter Dropdown */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
            Target Skill
          </label>
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Skills</option>
            {availableSkills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
            Sort By
          </label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none pr-8"
            >
              <option value="match">Highest Match % (Recommended)</option>
              <option value="deadline">Approaching Deadline</option>
              <option value="title">Opportunity Name (A-Z)</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
