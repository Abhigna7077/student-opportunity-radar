import React from 'react';
import { 
  Building2, 
  MapPin, 
  Trophy, 
  GraduationCap, 
  Calendar, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck,
  Radio,
  Users
} from 'lucide-react';
import MatchBadge from './MatchBadge';
import DeadlineBadge from './DeadlineBadge';
import { calculateDeadlineStatus } from '../utils/deadlineUtils';

export default function OpportunityCard({
  opportunity,
  isSaved = false,
  onToggleSave,
  onSelectTag
}) {
  const {
    id,
    title,
    organizer,
    type = 'Hackathon',
    eligibility,
    skills = [],
    deadline,
    deadlineISO,
    mode,
    location,
    prize,
    description,
    applicationUrl,
    sourceWebsite = 'Unstop',
    matchPercentage,
    matchReasons = [],
    teamSize
  } = opportunity;

  // Compute dynamic deadline status
  const dynamicDeadlineStatus = calculateDeadlineStatus(deadlineISO, deadline);

  // Format eligibility string
  const formattedEligibility = Array.isArray(eligibility) && eligibility.length > 0
    ? eligibility.join(', ')
    : (typeof eligibility === 'string' && eligibility.trim() ? eligibility : 'Open to all students');

  // Format description
  const formattedDescription = description && description.trim()
    ? description
    : `Live ${type.toLowerCase()} listed on ${sourceWebsite}. Review requirements and register directly to participate.`;

  // Opportunity Type Colors
  const getTypeBadgeStyle = (type) => {
    switch (type?.toLowerCase()) {
      case 'hackathon':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'internship':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'fellowship':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'scholarship':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'competition':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 md:p-6 transition-all duration-200 shadow-lg hover:shadow-indigo-500/5 flex flex-col justify-between">
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Type badge */}
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${getTypeBadgeStyle(type)}`}>
              {type}
            </span>

            {/* Source badge */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700/60">
              <Radio className="w-2.5 h-2.5 text-indigo-400" />
              {sourceWebsite}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Match Badge */}
            {typeof matchPercentage === 'number' && (
              <MatchBadge matchPercentage={matchPercentage} />
            )}

            {/* Save Button */}
            <button
              type="button"
              onClick={() => onToggleSave(id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isSaved 
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25' 
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-750'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save opportunity'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 fill-amber-400 text-amber-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-slate-100 group-hover:text-indigo-300 transition-colors leading-snug mb-1.5 line-clamp-2">
          {title}
        </h3>

        {/* Organizer */}
        <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-3.5">
          <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="font-medium text-slate-300 truncate">{organizer || 'Featured Organizer'}</span>
        </div>

        {/* Short Description */}
        <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2">
          {formattedDescription}
        </p>

        {/* Highlight Grid (Mode, Prize, Eligibility, Deadline) */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 text-xs">
          {/* Mode & Location */}
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-slate-500 block text-[11px]">Mode / Location</span>
              <span className="font-medium text-slate-200 truncate block">
                {mode || 'Online'} {location ? `• ${location}` : ''}
              </span>
            </div>
          </div>

          {/* Prize / Grant */}
          <div className="flex items-start gap-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-slate-500 block text-[11px]">Prize / Rewards</span>
              <span className="font-semibold text-amber-300 truncate block">
                {prize || 'Recognition & Perks'}
              </span>
            </div>
          </div>

          {/* Eligibility */}
          <div className="flex items-start gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-slate-500 block text-[11px]">Eligibility</span>
              <span className="font-medium text-slate-200 line-clamp-1" title={formattedEligibility}>
                {formattedEligibility}
              </span>
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-start gap-2">
            <Calendar className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-slate-500 block text-[11px]">Deadline</span>
              <span className="font-medium text-slate-200 truncate block">
                {deadline || 'Check listing'}
              </span>
            </div>
          </div>
        </div>

        {/* Skills Tag Pills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] text-slate-500 font-medium mr-1">Skills:</span>
            {skills.length > 0 ? (
              skills.map((skill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectTag && onSelectTag(skill)}
                  className="px-2 py-0.5 text-xs rounded-md bg-slate-800 hover:bg-indigo-900/40 text-slate-300 hover:text-indigo-300 border border-slate-700/60 hover:border-indigo-500/40 transition-colors cursor-pointer"
                >
                  {skill}
                </button>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">Open skill categories</span>
            )}
          </div>
        </div>

        {/* Match Reasons Pill (if available from algorithm) */}
        {matchReasons.length > 0 && (
          <div className="mb-4 p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-300">
            <span className="font-semibold text-white block mb-0.5">Top Match Reason:</span>
            <span className="text-indigo-200">✨ {matchReasons[0]}</span>
          </div>
        )}
      </div>

      {/* Card Footer: Deadline Badge + Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 mt-1">
        {/* Deadline Status Badge */}
        <DeadlineBadge deadlineStatus={dynamicDeadlineStatus} />

        {/* Apply Now Button */}
        <a
          href={applicationUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <span>Apply Now</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
