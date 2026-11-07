const H = 3600e3;
const now = Date.now();
 
export const sampleMatches = [
  { id: 1, league: 'Premier League', home: 'Arsenal', away: 'Chelsea', status: 'LIVE', min: 67, hs: 2, as: 1, kickoff: now - 67 * 6e4, venue: 'Emirates Stadium' },
  { id: 2, league: 'La Liga', home: 'Barcelona', away: 'Sevilla', status: 'LIVE', min: 23, hs: 0, as: 0, kickoff: now - 23 * 6e4, venue: 'Camp Nou' },
  { id: 3, league: 'Premier League', home: 'Liverpool', away: 'Brighton', status: 'SCHEDULED', kickoff: now + 2 * H, venue: 'Anfield' },
  { id: 4, league: 'Serie A', home: 'Inter', away: 'Napoli', status: 'SCHEDULED', kickoff: now + 5 * H, venue: 'San Siro' },
  { id: 5, league: 'Bundesliga', home: 'Dortmund', away: 'Leipzig', status: 'SCHEDULED', kickoff: now + 26 * H, venue: 'Signal Iduna Park' },
  { id: 6, league: 'La Liga', home: 'Real Madrid', away: 'Valencia', status: 'SCHEDULED', kickoff: now + 30 * H, venue: 'Bernabéu' },
  { id: 7, league: 'Premier League', home: 'Man City', away: 'Spurs', status: 'FINISHED', hs: 3, as: 3, kickoff: now - 20 * H, venue: 'Etihad Stadium' },
  { id: 8, league: 'Serie A', home: 'Juventus', away: 'Roma', status: 'FINISHED', hs: 1, as: 0, kickoff: now - 27 * H, venue: 'Allianz Stadium' },
  { id: 9, league: 'Bundesliga', home: 'Bayern', away: 'Leverkusen', status: 'FINISHED', hs: 2, as: 2, kickoff: now - 44 * H, venue: 'Allianz Arena' },
];
 