
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

function getEventStatus(raw) {
  const now = Date.now();

  const start = raw.starts_at
    ? Number(raw.starts_at) * 1000
    : null;

  const end = raw.ends_at
    ? Number(raw.ends_at) * 1000
    : null;

  if (start && end) {
    if (now >= start && now <= end) return 'LIVE';
    if (now > end) return 'FINISHED';
    if (now < start) return 'SCHEDULED';
  }

  if (raw.alwaysLive || raw.always_live) {
    return 'LIVE';
  }

  return 'SCHEDULED';
}

export function mapMatch(raw, footballMatch = null) {
  const sport = String(raw.category || '').toLowerCase();
  const teams = getTeams(raw);

  const footballStatus = footballMatch?.status;
  const footballScore = footballMatch?.score?.fullTime;

  let status = getEventStatus(raw);

  if (footballMatch) {
    if (
      footballStatus === 'LIVE' ||
      footballStatus === 'IN_PLAY'
    ) {
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
    title: raw.title || [home, away].filter(Boolean).join(' vs ') || 'Untitled Event',
    league: footballMatch?.competition?.name || raw.categoryName || getSportName(sport),
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
