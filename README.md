# ESPN Fantasy Football API - Nix Flake Project

A Nix flake-based project for analyzing ESPN Fantasy Football data using the [ESPN Fantasy Football API](https://github.com/WictorWilnd/ESPN-Fantasy-Football-API).

## Prerequisites

- [Nix](https://nixos.org/) with flakes enabled
- An ESPN Fantasy Football league ID
- (Optional) ESPN cookies for private leagues

## Quick Start

### 1. Enter the development environment

```bash
nix develop
```

This will set up a Node.js environment with all necessary dependencies.

### 2. Install npm dependencies

```bash
npm install
```

### 3. Configure your league

Set your ESPN league ID as an environment variable:

```bash
export ESPN_LEAGUE_ID=123456
```

### 4. Run the example

```bash
npm start
# or
node src/index.js
```

## Private League Access

If your league is private, you'll need to provide ESPN authentication cookies:

### Finding Your Cookies

1. Open your browser and go to [espn.com](https://espn.com)
2. Log in to your ESPN account
3. Open Developer Tools (F12)
4. Go to Application > Cookies > https://espn.com
5. Find and copy the values for:
   - `espn_s2`
   - `SWID`

### Using Your Cookies

Set them as environment variables:

```bash
export ESPN_LEAGUE_ID=123456
export ESPN_S2="your_espn_s2_cookie_value_here"
export ESPN_SWID="your_swid_cookie_value_here"
npm start
```

Or create a `.env` file (make sure it's in `.gitignore`):

```bash
ESPN_LEAGUE_ID=123456
ESPN_S2=your_espn_s2_cookie_value_here
ESPN_SWID=your_swid_cookie_value_here
```

## Project Structure

```
.
├── flake.nix           # Nix flake configuration
├── package.json        # Node.js dependencies
├── src/
│   └── index.js        # Main application code
└── README.md          # This file
```

## Development

The development shell includes:
- Node.js 20
- npm package manager

All dependencies are managed through Nix, ensuring reproducible builds across different systems.

## Building with Nix

To build the project as a Nix package:

```bash
nix build
```

This creates a `result` symlink to the built package.

## API Documentation

For detailed API documentation and available methods, see the [ESPN Fantasy Football API repository](https://github.com/WictorWilnd/ESPN-Fantasy-Football-API).

Common methods you might want to use:
- `client.getLeagueInfo()` - Get league information
- `client.getTeams()` - Get all teams in the league
- `client.getBoxscoreForWeek(week)` - Get boxscores for a specific week
- `client.getFreeAgents()` - Get available free agents

## License

MIT
