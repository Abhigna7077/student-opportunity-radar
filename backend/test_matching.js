import { getMatchedOpportunities, calculateOpportunityMatch } from './src/services/matchingService.js';
import { readOpportunitiesData } from './src/services/opportunityService.js';

async function runMatchingVerification() {
  console.log('====================================================');
  console.log('🎯 STUDENT OPPORTUNITY RADAR - MATCHING ALGORITHM');
  console.log('====================================================\n');

  const sampleProfile = {
    branch: "AI & Data Science",
    skills: ["Python", "Java", "Machine Learning"],
    interests: ["AI", "Data Science", "Hackathons"],
    preferredMode: "Online"
  };

  console.log('👤 Target Student Profile:');
  console.log(JSON.stringify(sampleProfile, null, 2));
  console.log('');

  const rankedOpportunities = await getMatchedOpportunities(sampleProfile);

  console.log(`📊 Evaluated ${rankedOpportunities.length} opportunities from data/opportunities.json\n`);

  // Verification 1: Check score range (0-100)
  const allInRange = rankedOpportunities.every(o => o.matchPercentage >= 0 && o.matchPercentage <= 100);
  console.log(`✅ Score range check (0 - 100): ${allInRange ? 'PASSED' : 'FAILED'}`);

  // Verification 2: Check descending sort
  let isSortedDescending = true;
  for (let i = 0; i < rankedOpportunities.length - 1; i++) {
    if (rankedOpportunities[i].matchPercentage < rankedOpportunities[i + 1].matchPercentage) {
      isSortedDescending = false;
      break;
    }
  }
  console.log(`✅ Descending sort check:      ${isSortedDescending ? 'PASSED' : 'FAILED'}\n`);

  // Verification 3: Print Top 5 Matches
  console.log('====================================================');
  console.log('🏆 TOP 5 MATCHED OPPORTUNITIES');
  console.log('====================================================\n');

  const top5 = rankedOpportunities.slice(0, 5);

  top5.forEach((opp, index) => {
    console.log(`#${index + 1} [${opp.id}] ${opp.title}`);
    console.log(`   🎯 Match Percentage: ${opp.matchPercentage}%`);
    console.log(`   🏢 Organizer:       ${opp.organizer}`);
    console.log(`   🏷️  Type:            ${opp.type}`);
    console.log(`   🌐 Mode:            ${opp.mode}`);
    console.log(`   🛠️  Skills:          ${opp.skills.join(', ') || 'None listed'}`);
    console.log(`   💡 Match Reasons:`);
    opp.matchReasons.forEach(reason => {
      console.log(`      • ${reason}`);
    });
    console.log('----------------------------------------------------');
  });

  console.log('\n====================================================');
  console.log('📋 FULL RANKING SUMMARY');
  console.log('====================================================');
  rankedOpportunities.forEach((opp, i) => {
    console.log(`${String(i + 1).padStart(2, ' ')}. [${opp.matchPercentage}%] (${opp.id}) ${opp.title.substring(0, 45)}... | Mode: ${opp.mode}`);
  });
  console.log('====================================================\n');
}

runMatchingVerification().catch(console.error);
