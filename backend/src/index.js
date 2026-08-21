import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import opportunityRoutes from './routes/opportunityRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for local development and frontend clients
app.use(cors({
  origin: true, // Allow frontend dev origins (e.g., http://localhost:5173)
  credentials: true
}));

// Request parsing middleware
app.use(express.json());

// API Routes
app.use('/api', opportunityRoutes);

// Root health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Student Opportunity Radar API is running',
    version: '1.0.0',
    documentation: {
      health: 'GET /api/health',
      allOpportunities: 'GET /api/opportunities',
      searchAndFilter: 'GET /api/opportunities?search=python&type=Hackathon&mode=Online',
      singleOpportunity: 'GET /api/opportunities/:id'
    }
  });
});

// 404 Route handler for undefined endpoints
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(`[API Error] ${err.message}`, err.stack);

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : 'Bad Request',
    message: err.message || 'An unexpected error occurred'
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Student Opportunity Radar API running on port ${PORT}`);
});

export default app;
