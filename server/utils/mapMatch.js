import { getSportName } from './sportConfig.js';

function normalizeText(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function getTeams(raw) {
  return {
    home: raw.teams?.home?.name || null,
    away: raw.teams?.away?.name || null,
    homeBadge: raw.teams?.home?.badge || null,
    awayBadge: raw.teams?.away?.badge || null
  };
}

export function mapMatch(raw, footballMatch = null) {
  const sport = String(raw.category || '').toLowerCase();
  const teams = getTeams(raw);

  const footballStatus = footballMatch?.status;
  const footballScore = footballMatch?.score?.fullTime;

  let status = 'SCHEDULED';

  if (footballMatch) {
    if (footballStatus === 'LIVE' || footballStatus === 'IN_PLAY') {
      status = 'LIVE';
    } else if (
      footballStatus === 'FINISHED' ||
      footballStatus === 'AWARDED'
    ) {
      status = 'FINISHED';
    } else if (
      footballStatus === 'POSTPONED' ||
      footballStatus === 'CANCELLED'
    ) {
      status = footballStatus;
    }
  }

  const home = teams.home;
  const away = teams.away;

  return {
    id: raw.id,
    sport,
    sportName: getSportName(sport),
    title: raw.title || [home, away].filter(Boolean).join(' vs '),
    league: footballMatch?.competition?.name || getSportName(sport),
    home,
    away,
    homeBadge: teams.homeBadge,
    awayBadge: teams.awayBadge,
    kickoff: footballMatch?.utcDate
      ? new Date(footballMatch.utcDate).getTime()
      : raw.date || null,
    status,
    hs: footballScore?.home ?? null,
    as: footballScore?.away ?? null,
    poster: raw.poster || null,
    popular: Boolean(raw.popular),
    sources: Array.isArray(raw.sources) ? raw.sources : []
  };
}

export function createFootballLookup(matches) {
  const lookup = new Map();

  for (const match of matches) {
    const home = normalizeText(match.homeTeam?.name);
    const away = normalizeText(match.awayTeam?.name);

    if (!home || !away) continue;

    lookup.set(`${home}|${away}`, match);
  }

  return lookup;
}

export function findFootballMatch(raw, lookup) {
  const home = normalizeText(raw.teams?.home?.name);
  const away = normalizeText(raw.teams?.away?.name);

  if (!home || !away) return null;

  return lookup.get(`${home}|${away}`) || null;
}