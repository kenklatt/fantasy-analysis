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

    // Calculate average point differential by wins and losses per team
    console.log('\n📈 Analyzing point differentials by wins/losses per team...\n');

    const currentWeek = 14; // Week 14 of 2025 season
    const teamStats = new Map();

    // Initialize stats for each team
    teams.forEach(team => {
      teamStats.set(team.id, {
        name: team.name,
        abbreviation: team.abbreviation,
        winDifferentials: [],
        lossDifferentials: []
      });
    });

    // Fetch boxscores for each week to get game-by-game results
    for (let week = 1; week <= currentWeek; week++) {
      try {
        const boxscores = await client.getBoxscoreForWeek({
          seasonId: 2025,
          matchupPeriodId: week,
          scoringPeriodId: week
        });

        for (const matchup of boxscores) {
          if (matchup.homeScore && matchup.awayScore && matchup.homeTeamId && matchup.awayTeamId) {
            const homeDiff = matchup.homeScore - matchup.awayScore;
            const awayDiff = matchup.awayScore - matchup.homeScore;

            const homeStats = teamStats.get(matchup.homeTeamId);
            const awayStats = teamStats.get(matchup.awayTeamId);

            // Record differentials for home team
            if (homeStats) {
              if (homeDiff > 0) {
                homeStats.winDifferentials.push(homeDiff);
              } else if (homeDiff < 0) {
                homeStats.lossDifferentials.push(homeDiff);
              }
            }

            // Record differentials for away team
            if (awayStats) {
              if (awayDiff > 0) {
                awayStats.winDifferentials.push(awayDiff);
              } else if (awayDiff < 0) {
                awayStats.lossDifferentials.push(awayDiff);
              }
            }
          }
        }
      } catch (err) {
        console.error(`Could not fetch week ${week}:`, err.message);
      }
    }

    // Calculate and display results for each team
    teamStats.forEach((stats, teamId) => {
      const avgWinDiff = stats.winDifferentials.length > 0
        ? stats.winDifferentials.reduce((sum, diff) => sum + diff, 0) / stats.winDifferentials.length
        : 0;

      const avgLossDiff = stats.lossDifferentials.length > 0
        ? stats.lossDifferentials.reduce((sum, diff) => sum + diff, 0) / stats.lossDifferentials.length
        : 0;

      console.log(`${stats.name} (${stats.abbreviation})`);
      console.log(`  Wins: ${stats.winDifferentials.length} games, avg margin: +${avgWinDiff.toFixed(2)} pts`);
      console.log(`  Losses: ${stats.lossDifferentials.length} games, avg margin: ${avgLossDiff.toFixed(2)} pts`);
      console.log('');
    });

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
