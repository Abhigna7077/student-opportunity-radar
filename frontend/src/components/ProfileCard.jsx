import React from 'react';
import { User, BookOpen, Wrench, Heart, Target, Sparkles, Award } from 'lucide-react';

export default function ProfileCard({ profile = {} }) {
  const {
    name = "Abhigna Chand",
    headline = "Aspiring AI Engineer & Full Stack Enthusiast",
    branch = "AI & Data Science",
    institution = "National Institute of Technology",
    year = "3rd Year",
    cgpa = "8.9 / 10",
    skills = ["Python", "Java", "Machine Learning"],
    interests = ["AI", "Data Science", "Hackathons"],
    radarScore = "Live AI Scoring"
  } = profile;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Profile summary */}
      <div className="flex items-start justify-between gap-4 mb-5 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/25">
            {name?.charAt(0) || 'S'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">{name}</h3>
            <p className="text-xs text-indigo-300 font-medium">{headline}</p>
            <p className="text-xs text-slate-400 mt-0.5">{institution} • {year}</p>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Radar Profile Engine</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mt-1">
            <Sparkles className="w-3.5 h-3.5" />
            {radarScore}
          </span>
        </div>
      </div>

      {/* Core Profile Attributes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Branch / Education */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Branch</span>
          </div>
          <p className="text-sm font-semibold text-slate-200">{branch}</p>
          <p className="text-xs text-slate-400 mt-1">CGPA: {cgpa}</p>
        </div>

        {/* Skills */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Wrench className="w-4 h-4" />
            <span>Skills</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Heart className="w-4 h-4" />
            <span>Interests</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {interests.map((interest, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
