const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Health check endpoint
 */
export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }
  return response.json();
}

/**
 * Fetch all opportunities with optional query filters
 */
export async function fetchOpportunities(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.type && params.type !== 'all') query.set('type', params.type);
  if (params.skill && params.skill !== 'all') query.set('skill', params.skill);
  if (params.mode && params.mode !== 'all') query.set('mode', params.mode);

  const queryString = query.toString();
  const url = `${API_BASE_URL}/opportunities${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch opportunities (HTTP ${response.status})`);
  }
  return response.json();
}

/**
 * Fetch opportunities matched and ranked against student profile
 */
export async function fetchMatchedOpportunities(studentProfile = {}) {
  const response = await fetch(`${API_BASE_URL}/opportunities/match`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentProfile),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch matched opportunities (HTTP ${response.status})`);
  }
  return response.json();
}
