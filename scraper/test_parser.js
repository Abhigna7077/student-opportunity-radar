import fs from 'fs';
import { parseDeadline, getDeadlineStatus } from './parseDeadline.js';

const data = JSON.parse(fs.readFileSync('./data/opportunities.json', 'utf-8'));
console.log('✅ JSON Valid: YES');
console.log('✅ Total records in data/opportunities.json:', data.length);

const sample = data.find(d => d.id === 'unstop-006');
console.log('\n--- Sample Record (unstop-006) ---');
console.log('Title:       ', sample.title);
console.log('Raw Deadline:', sample.deadline);
console.log('deadlineISO: ', sample.deadlineISO);

console.log('\n--- Unit Tests for parseDeadline ---');
console.log('1. "04 Sep 26, 12:00 AM IST"  =>', parseDeadline('04 Sep 26, 12:00 AM IST'));
console.log('2. "25 Aug 2026, 11:59 PM IST" =>', parseDeadline('25 Aug 2026, 11:59 PM IST'));
console.log('3. "2026-09-04"                =>', parseDeadline('2026-09-04'));
console.log('4. null                        =>', parseDeadline(null));
console.log('5. "invalid date text"         =>', parseDeadline('invalid date text'));

console.log('\n--- Unit Tests for getDeadlineStatus ---');
const refDate = new Date('2026-08-20T00:00:00+05:30');
console.log('• Reference Date: 2026-08-20T00:00:00+05:30');
console.log('• 2026-08-20T18:00:00+05:30 (today)     =>', getDeadlineStatus('2026-08-20T18:00:00+05:30', refDate));
console.log('• 2026-08-21T12:00:00+05:30 (tomorrow)  =>', getDeadlineStatus('2026-08-21T12:00:00+05:30', refDate));
console.log('• 2026-08-24T12:00:00+05:30 (4 days)    =>', getDeadlineStatus('2026-08-24T12:00:00+05:30', refDate));
console.log('• 2026-09-04T00:00:00+05:30 (15 days)   =>', getDeadlineStatus('2026-09-04T00:00:00+05:30', refDate));
console.log('• 2026-08-15T12:00:00+05:30 (passed)    =>', getDeadlineStatus('2026-08-15T12:00:00+05:30', refDate));
console.log('• null (unavailable)                     =>', getDeadlineStatus(null, refDate));
