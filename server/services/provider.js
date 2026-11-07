import {
  fetchSports as fetchStreamedSports,
  fetchSportMatches,
  fetchLiveMatches as fetchStreamedLiveMatches,
  fetchPopularMatches
} from './streamed.js';

import {
  fetchFootballMatches,
  fetchFootballLiveMatches
} from './footballData.js';

import {
  mapMatch,
  createFootballLookup,
  findFootballMatch
} from '../utils/mapMatch.js';

const cache = new Map();

function getCached(key) {
  const item = cache.get(key);

  if (!item) return null;

  if (Date.now() > item.expires) {
    cache.delete(key);
    return null;
  }

  return item.value;
}

function setCached(key, value, ttl) {
  cache.set(key, {
    value,
    expires: Date.now() + ttl
  });

  return value;
}

function mapGenericMatches(matches) {
  return matches.map((match) => mapMatch(match));
}

async function mapFootballMatches(matches, live = false) {
  try {
    const footballMatches = live
      ? await fetchFootballLiveMatches()
      : await fetchFootballMatches();

    const lookup = createFootballLookup(footballMatches);

    return matches.map((match) =>
      mapMatch(match, findFootballMatch(match, lookup))
    );
  } catch {
    return mapGenericMatches(matches);
  }
}

export async function fetchSports() {
  const cached = getCached('sports');

  if (cached) return cached;

  const sports = await fetchStreamedSports();

  return setCached(
    'sports',
    sports.map((sport) => ({
      id: sport.id,
      name: sport.name
    })),
    300000
  );
}

export async function fetchMatches(sport = null) {
  if (!sport) {
    const cached = getCached('matches:all');

    if (cached) return cached;

    const sports = await fetchSports();

    const results = await Promise.all(
      sports.map(async ({ id }) => {
        try {
          return await fetchMatches(id);
        } catch {
          return [];
        }
      })
    );

    return setCached(
      'matches:all',
      results.flat(),
      60000
    );
  }

  const cacheKey = `matches:${sport}`;
  const cached = getCached(cacheKey);

  if (cached) return cached;

  const matches = await fetchSportMatches(sport);

  let result;

  if (String(sport).toLowerCase() === 'football') {
    result = await mapFootballMatches(matches);
  } else {
    result = mapGenericMatches(matches);
  }

  return setCached(
    cacheKey,
    result,
    30000
  );
}

export async function fetchLiveMatches(sport = null) {
  const cacheKey = `live:${sport || 'all'}`;
  const cached = getCached(cacheKey);

  if (cached) return cached;

  const matches = await fetchStreamedLiveMatches();

  let filtered = matches;

  if (sport) {
    filtered = matches.filter(
      (match) =>
        String(match.category).toLowerCase() ===
        String(sport).toLowerCase()
    );
  }

  let result;

  if (String(sport || '').toLowerCase() === 'football') {
    result = await mapFootballMatches(filtered, true);
  } else {
    result = mapGenericMatches(filtered);
  }

  return setCached(
    cacheKey,
    result,
    15000
  );
}

export async function fetchPopular(sport = null) {
  const cacheKey = `popular:${sport || 'all'}`;
  const cached = getCached(cacheKey);

  if (cached) return cached;

  const matches = await fetchPopularMatches(sport);

  let result;

  if (String(sport || '').toLowerCase() === 'football') {
    result = await mapFootballMatches(matches);
  } else {
    result = mapGenericMatches(matches);
  }

  return setCached(
    cacheKey,
    result,
    30000
  );
}