import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseDeadline } from './parseDeadline.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths
const RAW_DATA_PATH = path.resolve(__dirname, '../data/raw/unstop_raw.json');
const OUTPUT_DATA_PATH = path.resolve(__dirname, '../data/opportunities.json');

/**
 * Extracts a human-readable title from an Unstop URL slug if the title field is missing.
 * @param {string} url 
 * @returns {string|null}
 */
function deriveTitleFromUrl(url = '') {
  try {
    const cleanUrl = url.split('?')[0].replace(/\/$/, '');
    const parts = cleanUrl.split('/');
    const slug = parts[parts.length - 1];
    if (!slug) return null;

    // Remove trailing numeric IDs (e.g. -1733628)
    const withoutId = slug.replace(/-\d+$/, '');

    // Convert hyphenated slug to title words
    return withoutId
      .split('-')
      .map(word => {
        if (word.toLowerCase() === 'ai') return 'AI';
        if (word.toLowerCase() === 'rc') return 'RC';
        if (word.toLowerCase() === 'vit') return 'VIT';
        if (word.toLowerCase() === 'cict') return 'CICT';
        if (word.toLowerCase() === 'ctf') return 'CTF';
        if (word.toLowerCase() === 'iiit') return 'IIIT';
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  } catch {
    return null;
  }
}

/**
 * Normalizes a single raw opportunity record from Unstop / Bright Data.
 * 
 * @param {Object} raw - Raw scraped record
 * @param {number} index - 0-based sequential index
 * @returns {Object} Normalized opportunity object
 */
export function normalizeOpportunity(raw, index) {
  const paddedId = `unstop-${String(index + 1).padStart(3, '0')}`;
  const appUrl = typeof raw.application_url === 'string' && raw.application_url.trim()
    ? raw.application_url.trim()
    : (typeof raw.product_page_url === 'string' && raw.product_page_url.trim() ? raw.product_page_url.trim() : '');

  // 1. Title: Use raw.title or derive from URL slug if missing
  let title = null;
  if (typeof raw.title === 'string' && raw.title.trim()) {
    title = raw.title.trim();
  } else if (appUrl) {
    title = deriveTitleFromUrl(appUrl);
  }

  // 2. Organizer
  let organizer = null;
  if (typeof raw.organizer === 'string' && raw.organizer.trim()) {
    organizer = raw.organizer.trim();
  } else if (appUrl && appUrl.includes('vit-vellore')) {
    organizer = 'Vellore Institute of Technology (VIT), Vellore';
  }

  // 3. Mode: Use raw.mode if available, fallback to location if Online/Offline, else null
  let mode = null;
  if (typeof raw.mode === 'string' && raw.mode.trim()) {
    mode = raw.mode.trim();
  } else if (raw.location === 'Online' || raw.location === 'Offline') {
    mode = raw.location;
  }

  // 4. Skills: Map skills_categories or skills array safely
  let skills = [];
  if (Array.isArray(raw.skills_categories)) {
    skills = raw.skills_categories.filter(s => typeof s === 'string' && s.trim().length > 0);
  } else if (Array.isArray(raw.skills)) {
    skills = raw.skills.filter(s => typeof s === 'string' && s.trim().length > 0);
  }

  // 5. Eligibility: Ensure valid array of strings
  let eligibility = [];
  if (Array.isArray(raw.eligibility)) {
    eligibility = raw.eligibility.filter(e => typeof e === 'string' && e.trim().length > 0);
  }

  // 6. Type: Detect category from input.url, application_url, or fallback to Hackathon
  let type = 'Hackathon';
  const urlCheck = `${raw.input?.url || ''} ${appUrl}`.toLowerCase();
  
  if (raw.type && typeof raw.type === 'string' && raw.type.trim()) {
    type = raw.type.trim();
  } else if (urlCheck.includes('/internships')) {
    type = 'Internship';
  } else if (urlCheck.includes('/competitions') || urlCheck.includes('/quizzes')) {
    type = 'Competition';
  } else if (urlCheck.includes('/scholarships')) {
    type = 'Scholarship';
  } else if (urlCheck.includes('/fellowships') || urlCheck.includes('/workshops')) {
    type = 'Fellowship';
  } else {
    type = 'Hackathon';
  }

  // 7. Deadline & DeadlineISO
  const rawDeadline = typeof raw.deadline === 'string' && raw.deadline.trim() ? raw.deadline.trim() : null;
  const deadlineISO = rawDeadline ? parseDeadline(rawDeadline) : null;

  return {
    id: paddedId,
    title,
    organizer,
    type,
    eligibility,
    skills,
    deadline: rawDeadline,
    deadlineISO,
    mode,
    location: null, // Keep null as instructed; raw location field holds Mode strings
    prize: typeof raw.prize_amount === 'string' && raw.prize_amount.trim() ? raw.prize_amount.trim() : null,
    description: null, // Bright Data output does not contain description
    applicationUrl: appUrl,
    sourceWebsite: 'Unstop',
    teamSize: typeof raw.team_size === 'string' && raw.team_size.trim() ? raw.team_size.trim() : null
  };
}

/**
 * Main normalization function.
 * Reads data/raw/unstop_raw.json, de-duplicates by application_url, normalizes records,
 * parses deadlines into deadlineISO, writes data/opportunities.json, and prints a statistical summary.
 */
export async function runNormalization() {
  console.log('----------------------------------------------------');
  console.log('🔄 Student Opportunity Radar - Data Normalization');
  console.log('----------------------------------------------------');
  console.log(`Reading raw scraped data from: ${RAW_DATA_PATH}`);

  const rawFileContent = await fs.readFile(RAW_DATA_PATH, 'utf-8');
  const rawRecords = JSON.parse(rawFileContent);

  if (!Array.isArray(rawRecords)) {
    throw new Error('Expected raw data to be a JSON array');
  }

  const rawCount = rawRecords.length;
  const seenUrls = new Set();
  const uniqueRawRecords = [];
  let duplicatesRemoved = 0;

  for (const record of rawRecords) {
    const url = (record.application_url || record.product_page_url || '').trim().toLowerCase();
    if (url && seenUrls.has(url)) {
      duplicatesRemoved++;
    } else {
      if (url) seenUrls.add(url);
      uniqueRawRecords.push(record);
    }
  }

  // Normalize each unique record with sequential ID and parsed deadlineISO
  const normalizedRecords = uniqueRawRecords.map((rec, idx) => normalizeOpportunity(rec, idx));

  // Compute metrics
  const recordsWithDeadline = normalizedRecords.filter(r => r.deadlineISO !== null).length;
  const recordsWithoutDeadline = normalizedRecords.filter(r => r.deadlineISO === null).length;
  const recordsWithPrize = normalizedRecords.filter(r => r.prize !== null).length;

  // Write output
  await fs.writeFile(OUTPUT_DATA_PATH, JSON.stringify(normalizedRecords, null, 2), 'utf-8');
  console.log(`✅ Normalized data successfully written to: ${OUTPUT_DATA_PATH}`);

  // Summary report
  console.log('\n====================================================');
  console.log('📊 NORMALIZATION SUMMARY (FRESH SCRAPE)');
  console.log('====================================================');
  console.log(`• Raw record count:          ${rawCount}`);
  console.log(`• Duplicates removed:        ${duplicatesRemoved}`);
  console.log(`• Normalized record count:   ${normalizedRecords.length}`);
  console.log(`• Records with valid ISO deadlines: ${recordsWithDeadline}`);
  console.log(`• Records without deadlines: ${recordsWithoutDeadline}`);
  console.log(`• Records with prize data:   ${recordsWithPrize}`);
  console.log('====================================================\n');

  return {
    rawCount,
    duplicatesRemoved,
    normalizedCount: normalizedRecords.length,
    recordsWithDeadline,
    recordsWithoutDeadline,
    recordsWithPrize,
    records: normalizedRecords
  };
}

// Execute when run directly via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runNormalization().catch((err) => {
    console.error('❌ Normalization failed:', err);
    process.exit(1);
  });
}
