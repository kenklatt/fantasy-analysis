import { Client } from 'espn-fantasy-football-api/node.js';

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

    // Example: Get teams in the league
    // Note: You'll need to check the library's documentation for available methods
    // This is a basic example structure

    console.log('✅ Client initialized successfully!');
    console.log('\nTo use this with your league:');
    console.log('1. Set ESPN_LEAGUE_ID environment variable to your league ID');
    console.log('2. For private leagues, also set ESPN_S2 and ESPN_SWID cookies');
    console.log('\nExample:');
    console.log('  export ESPN_LEAGUE_ID=123456');
    console.log('  export ESPN_S2="your_espn_s2_cookie"');
    console.log('  export ESPN_SWID="your_swid_cookie"');
    console.log('  npm start');

    // Add your custom API calls here
    // Example methods you might want to explore:
    // - client.getLeagueInfo()
    // - client.getTeams()
    // - client.getBoxscoreForWeek()
    // - client.getFreeAgents()
    // Check the library documentation for all available methods

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
