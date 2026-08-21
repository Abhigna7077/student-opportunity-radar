import { Router } from 'express';
import {
  getHealth,
  getOpportunities,
  matchOpportunities,
  getOpportunityById
} from '../controllers/opportunityController.js';

const router = Router();

// Health check endpoint
router.get('/health', getHealth);

// Matching endpoint (POST / GET)
router.post('/opportunities/match', matchOpportunities);
router.get('/opportunities/match', matchOpportunities);

// Opportunities directory endpoints
router.get('/opportunities', getOpportunities);
router.get('/opportunities/:id', getOpportunityById);

export default router;
