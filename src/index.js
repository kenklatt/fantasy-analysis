import dotenv from 'dotenv';
import pkg from 'espn-fantasy-football-api/node.js';
const { Client } = pkg;

// Load environment variables from .env file
dotenv.config();

// Configuration
const config = {
  // Replace with your league ID
  leagueId: parseInt(process.env.ESPN_LEAGUE_ID || '432132'),

  // For private leagues, you'll need these cookies from ESPN.com
  // Find them in browser DevTools: Application > Cookies > espn.com
  espnS2: process.env.ESPN_S2 || '',
  SWID: process.env.ESPN_SWID || ''
};

async function fetchLeagueInfo() {
  try {
    console.log('Initializing ESPN Fantasy Football API client...');
    console.log(`League ID: ${config.leagueId}`);

    // Create client instance
    const client = new Client({
      leagueId: config.leagueId,
      ...(config.espnS2 && config.SWID && {
        espnS2: config.espnS2,
        SWID: config.SWID
      })
    });

    console.log('\n📊 Fetching league information...\n');

    // Set the season for the client
    client.setCookies({ espnS2: config.espnS2, SWID: config.SWID });

    // Fetch league info for the current season (2025)
    const leagueInfo = await client.getLeagueInfo({ seasonId: 2025 });
    console.log('League Name:', leagueInfo.name || 'Unknown');
    console.log('Number of Teams:', leagueInfo.size || 'Unknown');

    console.log('\n👥 Teams in League:\n');
    // Get teams for week 14 (current week in Dec 2025)
    const teams = await client.getTeamsAtWeek({ seasonId: 2025, scoringPeriodId: 14 });

    // Sort by wins
    teams.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return (b.points || 0) - (a.points || 0);
    });

    teams.forEach((team, index) => {
      console.log(`${index + 1}. ${team.name || 'Team ' + (index + 1)}`);
      if (team.abbreviation) console.log(`   (${team.abbreviation})`);
      console.log(`   Record: ${team.wins || 0}-${team.losses || 0}${team.ties > 0 ? `-${team.ties}` : ''}`);

      // Try different property names for points
      const pointsFor = team.totalPointsScored || team.points || team.regularSeasonPointsFor || 0;
      const pointsAgainst = team.totalPointsAgainst || team.pointsAgainst || team.regularSeasonPointsAgainst || 0;

      if (pointsFor > 0) console.log(`   Points For: ${pointsFor.toFixed(2)}`);
      if (pointsAgainst > 0) console.log(`   Points Against: ${pointsAgainst.toFixed(2)}`);
      console.log('');
    });

    console.log('\n✅ Data fetched successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nMake sure:');
    console.error('- Your league ID is correct');
    console.error('- For private leagues, your ESPN_S2 and SWID cookies are valid');
    console.error('- You have internet connection');
    process.exit(1);
  }
}

// Run the main function
fetchLeagueInfo();
