import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths
const OPPORTUNITIES_FILE_PATH = path.resolve(__dirname, '../data/opportunities.json');

const MONTH_NAMES = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12
};

/**
 * Parses an Unstop or standard date string into an ISO-8601 string.
 * Assumes IST (UTC+05:30) for Unstop deadline timestamps.
 * 
 * Example inputs:
 * - "04 Sep 26, 12:00 AM IST" -> "2026-09-04T00:00:00+05:30"
 * - "25 Aug 2026, 11:59 PM IST" -> "2026-08-25T23:59:00+05:30"
 * - "2026-09-04" -> "2026-09-04T00:00:00+05:30"
 * 
 * @param {string|null} deadlineStr
 * @returns {string|null} ISO-8601 string or null if unparseable / missing
 */
export function parseDeadline(deadlineStr) {
  if (!deadlineStr || typeof deadlineStr !== 'string' || !deadlineStr.trim()) {
    return null;
  }

  const clean = deadlineStr.trim();

  // Pattern 1: Unstop Standard: "04 Sep 26, 12:00 AM IST" or "4 September 2026, 11:59 PM IST"
  const unstopPattern = /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{2,4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)(?:\s*(IST|UTC|GMT|[A-Z]{2,4}))?$/i;
  const match = clean.match(unstopPattern);

  if (match) {
    const day = parseInt(match[1], 10);
    const monthKey = match[2].toLowerCase();
    const month = MONTH_NAMES[monthKey];
    let year = parseInt(match[3], 10);

    if (!month || isNaN(day) || day < 1 || day > 31) {
      return null;
    }

    // Two-digit year expansion (e.g. 26 -> 2026)
    if (year < 100) {
      year += 2000;
    }

    let hour = parseInt(match[4], 10);
    const minute = parseInt(match[5], 10);
    const second = match[6] ? parseInt(match[6], 10) : 0;
    const meridian = match[7].toUpperCase();

    if (isNaN(hour) || isNaN(minute) || hour < 1 || hour > 12 || minute < 0 || minute > 59) {
      return null;
    }

    // Convert to 24-hour format
    if (meridian === 'AM') {
      if (hour === 12) hour = 0;
    } else if (meridian === 'PM') {
      if (hour !== 12) hour += 12;
    }

    const pad = (n) => String(n).padStart(2, '0');
    return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}+05:30`;
  }

  // Pattern 2: ISO or standard YYYY-MM-DD
  const isoPattern = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/;
  const isoMatch = clean.match(isoPattern);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10);
    const day = parseInt(isoMatch[3], 10);
    const hour = isoMatch[4] ? isoMatch[4] : '00';
    const minute = isoMatch[5] ? isoMatch[5] : '00';
    const second = isoMatch[6] ? isoMatch[6] : '00';
    const tz = isoMatch[7] || '+05:30';

    const pad = (n) => String(n).padStart(2, '0');
    return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}${tz}`;
  }

  // Fallback check with native Date parsing if safe
  const fallbackDate = new Date(clean);
  if (!isNaN(fallbackDate.getTime())) {
    return fallbackDate.toISOString();
  }

  return null;
}

/**
 * Calculates deadline status relative to referenceDate (defaults to now).
 * Keeps dynamic status calculation separate from data storage.
 * 
 * @param {string|null} deadlineISO - Standard ISO-8601 string
 * @param {Date} [referenceDate=new Date()] - Reference date for comparison
 * @returns {string} Status string ("Due today", "1 day left", "X days left", "Deadline passed", "Deadline unavailable")
 */
export function getDeadlineStatus(deadlineISO, referenceDate = new Date()) {
  if (!deadlineISO || typeof deadlineISO !== 'string') {
    return 'Deadline unavailable';
  }

  const deadline = new Date(deadlineISO);
  if (isNaN(deadline.getTime())) {
    return 'Deadline unavailable';
  }

  // Calculate day difference using calendar dates
  const refMidnight = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const deadlineMidnight = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
  const diffDays = Math.round((deadlineMidnight.getTime() - refMidnight.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Deadline passed';
  }
  if (diffDays === 0) {
    return 'Due today';
  }
  if (diffDays === 1) {
    return '1 day left';
  }
  return `${diffDays} days left`;
}

/**
 * Reads data/opportunities.json, applies parseDeadline to each item,
 * adds/updates deadlineISO field, writes back to data/opportunities.json,
 * and prints a validation summary.
 */
export async function runDeadlineParsing() {
  console.log('----------------------------------------------------');
  console.log('⏳ Student Opportunity Radar - Deadline Parser');
  console.log('----------------------------------------------------');
  console.log(`Reading opportunities from: ${OPPORTUNITIES_FILE_PATH}`);

  const content = await fs.readFile(OPPORTUNITIES_FILE_PATH, 'utf-8');
  const opportunities = JSON.parse(content);

  if (!Array.isArray(opportunities)) {
    throw new Error('Expected opportunities.json to contain an array');
  }

  let validDeadlines = 0;
  let missingDeadlines = 0;
  let invalidDeadlines = 0;

  const updatedOpportunities = opportunities.map((opp) => {
    const rawDeadline = opp.deadline;

    if (rawDeadline === null || rawDeadline === undefined || rawDeadline === '') {
      missingDeadlines++;
      return {
        ...opp,
        deadline: null,
        deadlineISO: null
      };
    }

    const parsedISO = parseDeadline(rawDeadline);

    if (parsedISO !== null) {
      validDeadlines++;
      return {
        ...opp,
        deadline: rawDeadline,
        deadlineISO: parsedISO
      };
    } else {
      invalidDeadlines++;
      return {
        ...opp,
        deadline: rawDeadline,
        deadlineISO: null
      };
    }
  });

  // Write updated data back to opportunities.json
  await fs.writeFile(
    OPPORTUNITIES_FILE_PATH,
    JSON.stringify(updatedOpportunities, null, 2),
    'utf-8'
  );

  console.log(`✅ Updated opportunities saved to: ${OPPORTUNITIES_FILE_PATH}`);

  // Print validation summary
  console.log('\n====================================================');
  console.log('📊 DEADLINE PARSING SUMMARY');
  console.log('====================================================');
  console.log(`• Total records:                ${opportunities.length}`);
  console.log(`• Records with valid deadlines:  ${validDeadlines}`);
  console.log(`• Records without deadlines:     ${missingDeadlines}`);
  console.log(`• Records with invalid deadlines:${invalidDeadlines}`);
  console.log('====================================================\n');

  // Demonstrate status helper with sample records
  const sampleWithDeadline = updatedOpportunities.find((o) => o.deadlineISO !== null);
  if (sampleWithDeadline) {
    console.log('Sample parsed record:');
    console.log(` - ID:          ${sampleWithDeadline.id}`);
    console.log(` - Title:       ${sampleWithDeadline.title}`);
    console.log(` - Raw string:  "${sampleWithDeadline.deadline}"`);
    console.log(` - ISO-8601:    "${sampleWithDeadline.deadlineISO}"`);
    console.log(` - Dynamic Status (relative to current date): "${getDeadlineStatus(sampleWithDeadline.deadlineISO)}"`);
    console.log('');
  }

  return {
    totalRecords: opportunities.length,
    validDeadlines,
    missingDeadlines,
    invalidDeadlines,
    opportunities: updatedOpportunities
  };
}

// Execute when run via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runDeadlineParsing().catch((err) => {
    console.error('❌ Deadline parsing failed:', err);
    process.exit(1);
  });
}
