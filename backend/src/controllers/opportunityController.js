import * as opportunityService from '../services/opportunityService.js';
import * as matchingService from '../services/matchingService.js';

/**
 * Health check handler
 * GET /api/health
 */
export function getHealth(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'Student Opportunity Radar API is running'
  });
}

/**
 * Get all opportunities with query search and filters
 * GET /api/opportunities
 * Query parameters: search, type, skill, mode
 */
export async function getOpportunities(req, res, next) {
  try {
    const { search, type, skill, mode } = req.query;
    const opportunities = await opportunityService.getAllOpportunities({
      search,
      type,
      skill,
      mode
    });

    res.status(200).json(opportunities);
  } catch (error) {
    next(error);
  }
}

/**
 * Get ranked opportunities matched against a student profile
 * POST /api/opportunities/match or GET /api/opportunities/match
 */
export async function matchOpportunities(req, res, next) {
  try {
    let studentProfile = req.body;

    // Support query parameters if GET request
    if (!studentProfile || Object.keys(studentProfile).length === 0) {
      if (req.query.skills || req.query.branch || req.query.interests) {
        studentProfile = {
          branch: req.query.branch || '',
          skills: typeof req.query.skills === 'string' ? req.query.skills.split(',') : (req.query.skills || []),
          interests: typeof req.query.interests === 'string' ? req.query.interests.split(',') : (req.query.interests || []),
          preferredMode: req.query.preferredMode || req.query.mode || null
        };
      }
    }

    const matchedOpportunities = await matchingService.getMatchedOpportunities(studentProfile);
    res.status(200).json(matchedOpportunities);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single opportunity by ID
 * GET /api/opportunities/:id
 */
export async function getOpportunityById(req, res, next) {
  try {
    const { id } = req.params;
    const opportunity = await opportunityService.getOpportunityById(id);

    if (!opportunity) {
      return res.status(404).json({
        error: 'Opportunity not found',
        message: `No opportunity found with ID '${id}'`,
        id
      });
    }

    res.status(200).json(opportunity);
  } catch (error) {
    next(error);
  }
}
