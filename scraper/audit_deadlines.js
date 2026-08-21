import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('./data/raw/unstop_raw.json', 'utf-8'));

console.log('=== FULL KEY & VALUE AUDIT OF data/raw/unstop_raw.json ===\n');

raw.forEach((item, index) => {
  console.log(`----------------------------------------------------`);
  console.log(`RECORD #${index + 1}: ${item.title || item.application_url}`);
  console.log(`All Keys: [${Object.keys(item).join(', ')}]`);
  
  if ('deadline' in item) {
    console.log(`  -> HAS 'deadline' field: "${item.deadline}"`);
  } else {
    console.log(`  -> NO 'deadline' field in scraped object`);
  }

  // Check if any other key contains date strings
  for (const [key, val] of Object.entries(item)) {
    if (key !== 'deadline' && key !== 'application_url' && key !== 'product_page_url' && key !== 'input') {
      const str = JSON.stringify(val);
      if (/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}:\d{2}|ist|am|pm|days?|left)/i.test(str)) {
        console.log(`  -> Notice: Key '${key}' text: ${str}`);
      }
    }
  }
});
