import { readOpportunitiesData } from './opportunityService.js';

/**
 * Skill synonyms and related keyword mappings for intelligent matching.
 */
const SKILL_SYNONYMS = {
  'ai': ['artificial intelligence', 'ai', 'applied ai', 'ai engineering', 'agentic ai', 'agentic ai engineer', 'generative ai', 'deep learning', 'machine learning'],
  'artificial intelligence': ['ai', 'artificial intelligence', 'applied ai', 'ai engineering', 'agentic ai engineer'],
  'machine learning': ['machine learning', 'ml', 'machine learning engineering', 'applied ai', 'ai engineering', 'deep learning', 'data science'],
  'data science': ['data science', 'data analytics', 'machine learning', 'data engineering', 'big data'],
  'python': ['python', 'software development', 'machine learning', 'ai engineering', 'data science', 'backend development'],
  'java': ['java', 'software development', 'backend development', 'object oriented programming'],
  'software development': ['software development', 'python', 'java', 'c++', 'javascript', 'backend development', 'full stack'],
  'cyber security': ['cyber security', 'ctf', 'information security', 'network security'],
  'web3': ['web3', 'blockchain', 'blockchain development', 'solidity', 'smart contracts']
};

/**
 * Helper to check if a student skill matches an opportunity skill.
 * @param {string} studentSkill 
 * @param {string} oppSkill 
 * @returns {boolean}
 */
function isSkillMatch(studentSkill, oppSkill) {
  const s1 = (studentSkill || '').toLowerCase().trim();
  const s2 = (oppSkill || '').toLowerCase().trim();

  if (!s1 || !s2) return false;

  // Direct equality or substring containment
  if (s1 === s2 || s2.includes(s1) || s1.includes(s2)) {
    return true;
  }

  // Synonym lookup
  const synonyms = SKILL_SYNONYMS[s1];
  if (synonyms && synonyms.some(syn => s2.includes(syn) || syn.includes(s2))) {
    return true;
  }

  // Check reverse synonym lookup
  const oppSynonyms = SKILL_SYNONYMS[s2];
  if (oppSynonyms && oppSynonyms.some(syn => s1.includes(syn) || syn.includes(s1))) {
    return true;
  }

  return false;
}

/**
 * Calculate match score and reasons for a single opportunity against a student profile.
 * 
 * Scoring Model:
 * 1. Skills match — 40 points
 * 2. Interests / Type match — 30 points
 * 3. Eligibility / Branch match — 20 points
 * 4. Mode match — 10 points
 * Total = 100 points
 * 
 * @param {Object} opportunity 
 * @param {Object} studentProfile 
 * @returns {Object} { matchPercentage, matchScore, matchBreakdown, matchReasons }
 */
export function calculateOpportunityMatch(opportunity, studentProfile = {}) {
  const {
    branch = '',
    skills = [],
    interests = [],
    preferredMode = null
  } = studentProfile;

  const matchReasons = [];

  // ============================================================
  // 1. SKILLS MATCH (Max: 40 points)
  // ============================================================
  let skillsScore = 0;
  const oppSkills = Array.isArray(opportunity.skills) ? opportunity.skills : [];
  const matchedStudentSkills = new Set();
  const matchedOppSkills = new Set();

  if (oppSkills.length > 0 && skills.length > 0) {
    oppSkills.forEach((oppSkill) => {
      skills.forEach((studentSkill) => {
        if (isSkillMatch(studentSkill, oppSkill)) {
          matchedOppSkills.add(oppSkill);
          matchedStudentSkills.add(studentSkill);
        }
      });
    });

    const matchRatio = matchedOppSkills.size / oppSkills.length;
    skillsScore = Math.min(40, Math.round(matchRatio * 40));

    matchedStudentSkills.forEach((skill) => {
      matchReasons.push(`${skill} matches required skills`);
    });
  } else if (oppSkills.length === 0) {
    // Check if student skills are mentioned in title
    const titleLower = (opportunity.title || '').toLowerCase();
    skills.forEach((skill) => {
      if (titleLower.includes(skill.toLowerCase())) {
        matchedStudentSkills.add(skill);
      }
    });

    if (matchedStudentSkills.size > 0) {
      skillsScore = Math.min(40, matchedStudentSkills.size * 20);
      matchedStudentSkills.forEach((skill) => {
        matchReasons.push(`${skill} matches opportunity domain`);
      });
    } else {
      // Neutral baseline when no specific skills are mandated
      skillsScore = 20;
    }
  }

  // ============================================================
  // 2. INTERESTS / TYPE MATCH (Max: 30 points)
  // ============================================================
  let interestsScore = 0;
  const titleText = (opportunity.title || '').toLowerCase();
  const descText = (opportunity.description || '').toLowerCase();
  const oppType = (opportunity.type || '').toLowerCase();

  let typeMatched = false;
  let topicMatched = false;

  interests.forEach((interest) => {
    const intLower = interest.toLowerCase().trim();

    // Check Type Match (e.g. "Hackathons" matching type "Hackathon")
    if (
      (intLower.includes('hackathon') && oppType.includes('hackathon')) ||
      (intLower.includes('internship') && oppType.includes('internship')) ||
      (intLower.includes('fellowship') && oppType.includes('fellowship')) ||
      (intLower.includes('competition') && oppType.includes('competition')) ||
      (intLower.includes('scholarship') && oppType.includes('scholarship'))
    ) {
      if (!typeMatched) {
        typeMatched = true;
        interestsScore += 15;
        matchReasons.push(`${opportunity.type} matches your interests`);
      }
    }

    // Check Topic Match in title or description
    if (
      intLower !== 'hackathons' &&
      intLower !== 'internships' &&
      intLower !== 'fellowships' &&
      intLower !== 'competitions' &&
      intLower !== 'scholarships'
    ) {
      if (titleText.includes(intLower) || descText.includes(intLower)) {
        if (!topicMatched) {
          topicMatched = true;
          interestsScore += 15;
          matchReasons.push(`Interest in ${interest} matches this opportunity`);
        }
      }
    }
  });

  // If no type interest explicitly listed, match based on type existence
  if (!typeMatched && oppType === 'hackathon') {
    interestsScore += 10;
  }

  interestsScore = Math.min(30, interestsScore);

  // ============================================================
  // 3. ELIGIBILITY / BRANCH MATCH (Max: 20 points)
  // ============================================================
  let eligibilityScore = 0;
  const oppEligibility = Array.isArray(opportunity.eligibility) ? opportunity.eligibility : [];
  const branchLower = (branch || '').toLowerCase();

  const isEngineeringBranch = branchLower.includes('engineering') ||
    branchLower.includes('science') ||
    branchLower.includes('ai') ||
    branchLower.includes('data') ||
    branchLower.includes('cs') ||
    branchLower.includes('technology');

  if (oppEligibility.length === 0) {
    // Open to all students
    eligibilityScore = 20;
    matchReasons.push('Open eligibility is compatible with your profile');
  } else {
    let matchesEligibility = false;

    oppEligibility.forEach((crit) => {
      const c = crit.toLowerCase();
      if (
        (isEngineeringBranch && c.includes('engineering')) ||
        c.includes('undergraduate') ||
        c.includes('fresher') ||
        c.includes('sciences') ||
        c.includes('technology') ||
        (branchLower.includes('ai') && c.includes('ai')) ||
        (branchLower.includes('data') && c.includes('data'))
      ) {
        matchesEligibility = true;
      }
    });

    if (matchesEligibility) {
      eligibilityScore = 20;
      matchReasons.push('Engineering and undergraduate eligibility is compatible');
    } else {
      eligibilityScore = 5;
    }
  }

  // ============================================================
  // 4. MODE MATCH (Max: 10 points)
  // ============================================================
  let modeScore = 0;
  const oppMode = (opportunity.mode || '').toLowerCase();
  const prefMode = (preferredMode || '').toLowerCase();

  if (!preferredMode || prefMode === 'all' || prefMode === '') {
    modeScore = 10;
  } else if (oppMode === prefMode || oppMode === 'hybrid' || oppMode === 'both') {
    modeScore = 10;
    matchReasons.push(`${opportunity.mode} mode matches your preference`);
  } else {
    modeScore = 0;
  }

  // ============================================================
  // TOTAL SCORE
  // ============================================================
  const totalScore = skillsScore + interestsScore + eligibilityScore + modeScore;
  const matchPercentage = Math.min(100, Math.max(0, Math.round(totalScore)));

  // Deduplicate match reasons
  const uniqueReasons = Array.from(new Set(matchReasons));

  return {
    matchPercentage,
    matchReasons: uniqueReasons,
    breakdown: {
      skills: skillsScore,
      interests: interestsScore,
      eligibility: eligibilityScore,
      mode: modeScore,
      total: matchPercentage
    }
  };
}

/**
 * Loads all opportunities from data/opportunities.json, calculates match percentages
 * and reasons for each opportunity, and returns the list ranked by matchPercentage descending.
 * 
 * @param {Object} studentProfile - The student profile object
 * @returns {Promise<Array<Object>>} Ranked opportunities
 */
export async function getMatchedOpportunities(studentProfile = {}) {
  const opportunities = await readOpportunitiesData();

  const matched = opportunities.map((opportunity) => {
    const matchResult = calculateOpportunityMatch(opportunity, studentProfile);
    return {
      ...opportunity,
      matchPercentage: matchResult.matchPercentage,
      matchReasons: matchResult.matchReasons
    };
  });

  // Sort descending by matchPercentage
  matched.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return matched;
}
