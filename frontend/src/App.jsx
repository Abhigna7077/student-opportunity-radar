import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Opportunities from './pages/Opportunities';
import Saved from './pages/Saved';
import Profile from './pages/Profile';
import { fetchMatchedOpportunities } from './services/api';
import { AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';

const INITIAL_PROFILE = {
  name: "Abhigna Chand",
  headline: "Aspiring AI Engineer & Full Stack Enthusiast",
  branch: "AI & Data Science",
  institution: "National Institute of Technology",
  year: "3rd Year (Class of 2027)",
  cgpa: "8.9 / 10",
  skills: ["Python", "Java", "Machine Learning"],
  interests: ["AI", "Data Science", "Hackathons"],
  preferredMode: "Online",
  targetTypes: ["Hackathon", "Internship", "Fellowship", "Competition", "Scholarship"],
  preferredModes: ["Online", "Offline"],
  radarScore: "Live API Scoring"
};

/**
 * Skill & category synonym mapping for comprehensive search matching.
 */
const SEARCH_SYNONYMS = {
  'python': ['python', 'software development', 'machine learning', 'data science', 'ai engineering', 'backend'],
  'java': ['java', 'software development', 'backend development'],
  'ai': ['artificial intelligence', 'applied ai', 'ai engineering', 'agentic ai', 'agentic ai engineer', 'ai innovation'],
  'artificial intelligence': ['artificial intelligence', 'ai', 'applied ai', 'ai engineering'],
  'ml': ['machine learning', 'machine learning engineering', 'applied ai'],
  'machine learning': ['machine learning', 'machine learning engineering', 'ai engineering', 'data science', 'applied ai'],
  'data science': ['data science', 'data analytics', 'machine learning', 'pandas'],
  'hackathon': ['hackathon', 'hackathons', 'hack', 'sprint'],
  'hackathons': ['hackathon', 'hackathons', 'hack', 'sprint'],
  'internship': ['internship', 'internships', 'intern'],
  'internships': ['internship', 'internships', 'intern'],
  'competition': ['competition', 'competitions', 'challenge', 'contest', 'ctf'],
  'competitions': ['competition', 'competitions', 'challenge', 'contest', 'ctf'],
  'scholarship': ['scholarship', 'scholarships', 'grant'],
  'scholarships': ['scholarship', 'scholarships', 'grant'],
  'fellowship': ['fellowship', 'fellowships'],
  'fellowships': ['fellowship', 'fellowships']
};

/**
 * Robust case-insensitive search across all opportunity fields.
 */
function matchesSearchQuery(opp, query) {
  if (!query || !query.trim()) return true;

  const rawQ = query.trim().toLowerCase();
  const tokens = rawQ.split(/\s+/).filter(t => t.length > 0);

  const title = (opp.title || '').toLowerCase();
  const organizer = (opp.organizer || '').toLowerCase();
  const type = (opp.type || '').toLowerCase();
  const mode = (opp.mode || '').toLowerCase();
  const location = (opp.location || '').toLowerCase();
  const description = (opp.description || '').toLowerCase();
  const sourceWebsite = (opp.sourceWebsite || '').toLowerCase();
  const prize = (opp.prize || '').toLowerCase();

  const skillsList = Array.isArray(opp.skills) ? opp.skills.map(s => (s || '').toLowerCase()) : [];
  const eligibilityList = Array.isArray(opp.eligibility) 
    ? opp.eligibility.map(e => (e || '').toLowerCase()) 
    : [String(opp.eligibility || '').toLowerCase()];
  const matchReasonsList = Array.isArray(opp.matchReasons) 
    ? opp.matchReasons.map(r => (r || '').toLowerCase()) 
    : [];

  // Direct case-insensitive match across any normalized fields
  const directMatch = (
    title.includes(rawQ) ||
    organizer.includes(rawQ) ||
    type.includes(rawQ) ||
    rawQ.includes(type) ||
    mode.includes(rawQ) ||
    location.includes(rawQ) ||
    description.includes(rawQ) ||
    sourceWebsite.includes(rawQ) ||
    prize.includes(rawQ) ||
    skillsList.some(s => s.includes(rawQ) || rawQ.includes(s)) ||
    eligibilityList.some(e => e.includes(rawQ)) ||
    matchReasonsList.some(r => r.includes(rawQ))
  );

  if (directMatch) return true;

  // Check synonym mapping
  const synonymTerms = SEARCH_SYNONYMS[rawQ] || [];
  const hasSynonymMatch = synonymTerms.some(term => 
    title.includes(term) ||
    type.includes(term) ||
    skillsList.some(s => s.includes(term) || term.includes(s)) ||
    matchReasonsList.some(r => r.includes(term))
  );

  if (hasSynonymMatch) return true;

  // Check if all tokens match
  return tokens.every(token => {
    const tokenSynonyms = SEARCH_SYNONYMS[token] || [token];
    return tokenSynonyms.some(t =>
      title.includes(t) ||
      organizer.includes(t) ||
      type.includes(t) ||
      t.includes(type) ||
      mode.includes(t) ||
      location.includes(t) ||
      description.includes(t) ||
      sourceWebsite.includes(t) ||
      skillsList.some(s => s.includes(t) || t.includes(s)) ||
      eligibilityList.some(e => e.includes(t)) ||
      matchReasonsList.some(r => r.includes(t))
    );
  });
}

export default function App() {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Student Profile state
  const [studentProfile, setStudentProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('radar_student_profile');
      return stored ? JSON.parse(stored) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  // Saved Opportunities in localStorage
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('radar_saved_opportunities');
      return stored ? JSON.parse(stored) : ['unstop-003', 'unstop-004'];
    } catch {
      return ['unstop-003', 'unstop-004'];
    }
  });

  // Live API Opportunities state
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [sortBy, setSortBy] = useState('match');

  // Persist saved opportunities
  useEffect(() => {
    try {
      localStorage.setItem('radar_saved_opportunities', JSON.stringify(savedIds));
    } catch (e) {
      console.error('Failed to write to localStorage', e);
    }
  }, [savedIds]);

  // Persist profile
  useEffect(() => {
    try {
      localStorage.setItem('radar_student_profile', JSON.stringify(studentProfile));
    } catch (e) {
      console.error('Failed to write to localStorage', e);
    }
  }, [studentProfile]);

  // Fetch opportunities from Express Backend API
  const loadOpportunities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMatchedOpportunities({
        branch: studentProfile.branch,
        skills: studentProfile.skills,
        interests: studentProfile.interests,
        preferredMode: studentProfile.preferredMode
      });

      setOpportunities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('API connection error:', err);
      setError(
        err.message || 'Unable to connect to Student Opportunity Radar API at http://localhost:5000'
      );
    } finally {
      setLoading(false);
    }
  }, [studentProfile.branch, studentProfile.skills, studentProfile.interests, studentProfile.preferredMode]);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  // Toggle Save/Unsave
  const handleToggleSave = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Switch preferred delivery mode in profile (triggers backend re-match)
  const handleUpdatePreferredMode = (mode) => {
    setStudentProfile((prev) => ({
      ...prev,
      preferredMode: mode
    }));
  };

  // Collect unique skills dynamically from API opportunities
  const availableSkills = useMemo(() => {
    const skillsSet = new Set();
    opportunities.forEach((opp) => {
      if (Array.isArray(opp.skills)) {
        opp.skills.forEach((skill) => {
          if (skill && skill.trim()) skillsSet.add(skill.trim());
        });
      }
    });
    return Array.from(skillsSet).sort();
  }, [opportunities]);

  // Category counts from API opportunities
  const typeCounts = useMemo(() => {
    const counts = {
      all: opportunities.length,
      Hackathon: 0,
      Internship: 0,
      Competition: 0,
      Scholarship: 0,
      Fellowship: 0,
    };
    opportunities.forEach((opp) => {
      if (counts[opp.type] !== undefined) {
        counts[opp.type] += 1;
      }
    });
    return counts;
  }, [opportunities]);

  // Check if any active filters are applied
  const hasActiveFilters = Boolean(
    searchQuery.trim() !== '' ||
    selectedType !== 'all' ||
    selectedMode !== 'all' ||
    selectedSkill !== 'all' ||
    sortBy !== 'match'
  );

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedMode('all');
    setSelectedSkill('all');
    setSortBy('match');
  };

  // Quick skill tag selection from cards
  const handleSelectTag = (skillName) => {
    setSelectedSkill(skillName);
    setActiveTab('opportunities');
  };

  // Filtered & Sorted Opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // 1. Search Query filter (title, organizer, skills, type, mode, description, eligibility, match reasons)
      if (searchQuery.trim() !== '') {
        if (!matchesSearchQuery(opp, searchQuery)) {
          return false;
        }
      }

      // 2. Type filter
      if (selectedType !== 'all') {
        const targetType = selectedType.toLowerCase().trim();
        const oppType = (opp.type || '').toLowerCase().trim();
        if (oppType !== targetType && !oppType.includes(targetType) && !targetType.includes(oppType)) {
          return false;
        }
      }

      // 3. Mode filter
      if (selectedMode !== 'all' && (opp.mode || '').toLowerCase() !== selectedMode.toLowerCase()) {
        return false;
      }

      // 4. Skill filter
      if (selectedSkill !== 'all') {
        const targetSkill = selectedSkill.toLowerCase().trim();
        const hasSkill = Array.isArray(opp.skills) && opp.skills.some((s) => {
          const sLower = (s || '').toLowerCase().trim();
          return sLower === targetSkill || sLower.includes(targetSkill) || targetSkill.includes(sLower);
        });

        const hasMatchReason = Array.isArray(opp.matchReasons) && opp.matchReasons.some((r) => 
          r.toLowerCase().includes(targetSkill)
        );

        if (!hasSkill && !hasMatchReason) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'match') {
        return (b.matchPercentage || 0) - (a.matchPercentage || 0);
      }
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'deadline') {
        if (!a.deadlineISO && !b.deadlineISO) return 0;
        if (!a.deadlineISO) return 1;
        if (!b.deadlineISO) return -1;
        return new Date(a.deadlineISO) - new Date(b.deadlineISO);
      }
      return 0;
    });
  }, [opportunities, searchQuery, selectedType, selectedMode, selectedSkill, sortBy]);

  // Saved Opportunities list
  const savedOpportunities = useMemo(() => {
    return opportunities.filter((opp) => savedIds.includes(opp.id));
  }, [opportunities, savedIds]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedIds.length}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          savedCount={savedIds.length}
          totalCount={opportunities.length}
          typeCounts={typeCounts}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Loading Indicator */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              <p className="text-sm font-medium text-slate-400">
                Fetching opportunities & scoring matches from backend API...
              </p>
            </div>
          )}

          {/* Backend Connection Error State */}
          {!loading && error && (
            <div className="bg-rose-950/40 border border-rose-500/40 rounded-3xl p-8 text-center my-6 max-w-xl mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white">Backend Connection Error</h2>
              <p className="text-sm text-slate-300">
                {error}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={loadOpportunities}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry API Connection</span>
                </button>
              </div>
            </div>
          )}

          {/* Active Content when loaded */}
          {!loading && !error && (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  opportunities={opportunities}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onNavigateToOpportunities={() => setActiveTab('opportunities')}
                  searchQuery={searchQuery}
                  setSearchQuery={(q) => {
                    setSearchQuery(q);
                    setActiveTab('opportunities');
                  }}
                  onSelectTag={handleSelectTag}
                  profile={studentProfile}
                />
              )}

              {activeTab === 'opportunities' && (
                <Opportunities
                  opportunities={filteredOpportunities}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  selectedMode={selectedMode}
                  setSelectedMode={setSelectedMode}
                  selectedSkill={selectedSkill}
                  setSelectedSkill={setSelectedSkill}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  availableSkills={availableSkills}
                  onResetFilters={handleResetFilters}
                  hasActiveFilters={hasActiveFilters}
                  onSelectTag={handleSelectTag}
                />
              )}

              {activeTab === 'saved' && (
                <Saved
                  savedOpportunities={savedOpportunities}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onNavigateToOpportunities={() => setActiveTab('opportunities')}
                  onSelectTag={handleSelectTag}
                />
              )}

              {activeTab === 'profile' && (
                <Profile
                  profile={studentProfile}
                  onUpdatePreferredMode={handleUpdatePreferredMode}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Student Opportunity Radar • Scrape-Verse Hackathon Project</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Source: Unstop Live API</span>
            <span>•</span>
            <span className="text-indigo-400 font-medium">Smart Match Engine Connected</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
