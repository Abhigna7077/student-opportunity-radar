import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Robust, production-safe candidate paths to locate opportunities.json
 * regardless of whether running locally, in Docker, or on cloud platforms (Render, Vercel, Railway).
 */
const CANDIDATE_PATHS = [
  // 1. Root data directory relative to this service file (Local / Full Repo Clone)
  path.resolve(__dirname, '../../../data/opportunities.json'),
  // 2. Bundled backend data directory (Cloud deployment where Root Directory is 'backend')
  path.resolve(__dirname, '../../data/opportunities.json'),
  // 3. Current Working Directory / data
  path.resolve(process.cwd(), 'data/opportunities.json'),
  // 4. Current Working Directory / backend / data
  path.resolve(process.cwd(), 'backend/data/opportunities.json'),
  // 5. Parent of CWD / data (if CWD is backend/src)
  path.resolve(process.cwd(), '../data/opportunities.json')
];

let resolvedDataFilePath = null;

/**
 * Dynamically resolves and caches the accessible opportunities.json file path.
 * @returns {string} The resolved absolute file path
 */
export function getDataFilePath() {
  if (resolvedDataFilePath && fsSync.existsSync(resolvedDataFilePath)) {
    return resolvedDataFilePath;
  }

  for (const candidate of CANDIDATE_PATHS) {
    try {
      if (fsSync.existsSync(candidate)) {
        resolvedDataFilePath = candidate;
        return candidate;
      }
    } catch {
      // Continue searching candidates
    }
  }

  // Default fallback
  resolvedDataFilePath = CANDIDATE_PATHS[0];
  return resolvedDataFilePath;
}

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
 * Read and parse opportunities from the JSON data file.
 * Handles missing file and malformed JSON errors gracefully.
 */
export async function readOpportunitiesData() {
  const filePath = getDataFilePath();
  try {
    const rawData = await fs.readFile(filePath, 'utf-8');
    
    if (!rawData.trim()) {
      return [];
    }

    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) {
      throw new Error('Opportunities data format is invalid: expected an array');
    }
    return parsed;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`[Opportunity Service Warning] Data file not found at ${filePath}. Returning empty dataset.`);
      return [];
    }
    if (error instanceof SyntaxError) {
      const parseError = new Error('Malformed JSON syntax in opportunities data file');
      parseError.statusCode = 500;
      throw parseError;
    }
    throw error;
  }
}

/**
 * Check if opportunity matches search query across all fields.
 */
function matchesSearch(opp, query) {
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
    eligibilityList.some(e => e.includes(rawQ))
  );

  if (directMatch) return true;

  const synonymTerms = SEARCH_SYNONYMS[rawQ] || [];
  const hasSynonymMatch = synonymTerms.some(term => 
    title.includes(term) ||
    type.includes(term) ||
    skillsList.some(s => s.includes(term) || term.includes(s))
  );

  if (hasSynonymMatch) return true;

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
      eligibilityList.some(e => e.includes(t))
    );
  });
}

/**
 * Get all opportunities with optional search and filtering.
 * @param {Object} filters
 * @param {string} [filters.search] - Search string for title, organizer, description, skills, type, mode, eligibility
 * @param {string} [filters.type] - Filter by opportunity type (Hackathon, Internship, etc.)
 * @param {string} [filters.skill] - Filter by required skill
 * @param {string} [filters.mode] - Filter by mode (Online, Offline)
 */
export async function getAllOpportunities({ search, type, skill, mode } = {}) {
  const opportunities = await readOpportunitiesData();

  return opportunities.filter((opp) => {
    // 1. Search Query filter
    if (search && search.trim() !== '') {
      if (!matchesSearch(opp, search)) {
        return false;
      }
    }

    // 2. Type filter
    if (type && type.trim() !== '' && type.toLowerCase() !== 'all') {
      const targetType = type.trim().toLowerCase();
      const oppType = (opp.type || '').toLowerCase();
      if (oppType !== targetType && !oppType.includes(targetType) && !targetType.includes(oppType)) {
        return false;
      }
    }

    // 3. Skill filter
    if (skill && skill.trim() !== '' && skill.toLowerCase() !== 'all') {
      const targetSkill = skill.trim().toLowerCase();
      const hasSkill = Array.isArray(opp.skills) && opp.skills.some((s) => {
        const sLower = (s || '').toLowerCase();
        return sLower === targetSkill || sLower.includes(targetSkill) || targetSkill.includes(sLower);
      });
      if (!hasSkill) {
        return false;
      }
    }

    // 4. Mode filter
    if (mode && mode.trim() !== '' && mode.toLowerCase() !== 'all') {
      if ((opp.mode || '').toLowerCase() !== mode.trim().toLowerCase()) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get a single opportunity by ID.
 * @param {string} id - The opportunity ID
 */
export async function getOpportunityById(id) {
  if (!id) return null;
  const opportunities = await readOpportunitiesData();
  const opportunity = opportunities.find((opp) => String(opp.id).toLowerCase() === String(id).toLowerCase());
  return opportunity || null;
}
