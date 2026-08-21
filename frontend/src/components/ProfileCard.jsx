import React, { useState } from 'react';
import { 
  User, 
  BookOpen, 
  Wrench, 
  Heart, 
  Sparkles, 
  Pencil, 
  Save, 
  X,
  GraduationCap,
  Building,
  Calendar,
  Award
} from 'lucide-react';

export default function ProfileCard({ 
  profile = {}, 
  onUpdateProfile 
}) {
  const [isEditing, setIsEditing] = useState(false);

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

  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    branch: '',
    institution: '',
    year: '',
    cgpa: '',
    skills: '',
    interests: ''
  });

  const handleStartEdit = () => {
    setFormData({
      name: profile.name || '',
      headline: profile.headline || '',
      branch: profile.branch || '',
      institution: profile.institution || '',
      year: profile.year || '',
      cgpa: profile.cgpa || '',
      skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
      interests: Array.isArray(profile.interests) ? profile.interests.join(', ') : ''
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = {
      ...profile,
      name: formData.name.trim(),
      headline: formData.headline.trim(),
      branch: formData.branch.trim(),
      institution: formData.institution.trim(),
      year: formData.year.trim(),
      cgpa: formData.cgpa.trim(),
      skills: formData.skills
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      interests: formData.interests
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    };

    if (onUpdateProfile) {
      onUpdateProfile(updatedProfile);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Edit Form Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Pencil className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Edit Student Profile</h3>
              <p className="text-xs text-slate-400">Update your credentials and skills to re-score matching radar listings.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Abhigna Chand"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 transition-colors outline-none"
              />
            </div>

            {/* Headline */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Headline / Specialization
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => handleChange('headline', e.target.value)}
                placeholder="e.g. Aspiring AI Engineer & Full Stack Enthusiast"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 transition-colors outline-none"
              />
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Branch / Major
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => handleChange('branch', e.target.value)}
                placeholder="e.g. AI & Data Science"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 transition-colors outline-none"
              />
            </div>

            {/* Institution */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Institution / University
              </label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => handleChange('institution', e.target.value)}
                placeholder="e.g. National Institute of Technology"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 transition-colors outline-none"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Current Academic Year
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
                placeholder="e.g. 3rd Year (Class of 2027)"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 transition-colors outline-none"
              />
            </div>

            {/* CGPA */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                CGPA / Score
              </label>
              <input
                type="text"
                value={formData.cgpa}
                onChange={(e) => handleChange('cgpa', e.target.value)}
                placeholder="e.g. 8.9 / 10"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 transition-colors outline-none"
              />
            </div>
          </div>

          {/* Skills (Comma-separated) */}
          <div>
            <label className="block text-xs font-semibold text-cyan-300 mb-1.5">
              Skills <span className="text-slate-400 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => handleChange('skills', e.target.value)}
              placeholder="e.g. Python, Java, Machine Learning, SQL"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-slate-100 placeholder-slate-500 transition-colors outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">These skills will directly guide the radar 40-point skills matching engine.</p>
          </div>

          {/* Interests (Comma-separated) */}
          <div>
            <label className="block text-xs font-semibold text-rose-300 mb-1.5">
              Interests <span className="text-slate-400 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={formData.interests}
              onChange={(e) => handleChange('interests', e.target.value)}
              placeholder="e.g. AI, Data Science, Hackathons, Web3"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm text-slate-100 placeholder-slate-500 transition-colors outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">Interests align with opportunity categories for the 30-point interests match.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Profile summary */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/25 shrink-0">
            {name?.charAt(0) || 'S'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">{name}</h3>
            <p className="text-xs text-indigo-300 font-medium">{headline}</p>
            <p className="text-xs text-slate-400 mt-0.5">{institution} • {year}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {onUpdateProfile && (
            <button
              type="button"
              onClick={handleStartEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/50 transition-all cursor-pointer shadow-sm"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          )}

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Radar Profile Engine</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mt-1">
              <Sparkles className="w-3.5 h-3.5" />
              {radarScore}
            </span>
          </div>
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
