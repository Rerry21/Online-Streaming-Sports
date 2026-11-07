
import axios from 'axios';

const BASE_URL = process.env.PPV_API_BASE_URL || 'https://api.ppv.st';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json'
  }
});

let streamsCache = null;
let cacheExpiry = 0;

async function fetchAllStreams() {
  if (streamsCache && Date.now() < cacheExpiry) {
    return streamsCache;
  }

  const response = await client.get('/api/streams');

  if (!response.data?.success || !Array.isArray(response.data.streams)) {
    throw new Error('Invalid response received from PPV.st.');
  }

  streamsCache = response.data.streams;
  cacheExpiry = Date.now() + 60000;

  return streamsCache;
}

function normalizeStream(stream, category) {
  return {
    ...stream,
    category: category.id || category.category,
    categoryName: category.category,
    title: stream.name || stream.tag || 'Untitled Event',
    date: stream.starts_at
      ? Number(stream.starts_at) * 1000
      : null,
    poster: stream.poster || null,
    popular: false,
    sources: [],
    alwaysLive: Boolean(
      stream.always_live || category.always_live
    )
  };
}

function flattenStreams(categories) {
  return categories.flatMap((category) => {
    if (!Array.isArray(category.streams)) {
      return [];
    }

    return category.streams.map((stream) =>
      normalizeStream(stream, category)
    );
  });
}

function isCurrentlyLive(stream) {
  if (stream.alwaysLive) {
    return true;
  }

  const now = Math.floor(Date.now() / 1000);
  const start = Number(stream.starts_at || 0);
  const end = Number(stream.ends_at || 0);

  return start > 0 && end > 0 && now >= start && now <= end;
}

export async function fetchSports() {
  const categories = await fetchAllStreams();

  return categories.map((category) => ({
    id: category.id || category.category,
    name: category.category
  }));
}

export async function fetchSportMatches(sport) {
  const categories = await fetchAllStreams();

  const category = categories.find((item) =>
    String(item.id || item.category).toLowerCase() ===
      String(sport).toLowerCase() ||
    String(item.category).toLowerCase() ===
      String(sport).toLowerCase()
  );

  if (!category || !Array.isArray(category.streams)) {
    return [];
  }

  return category.streams.map((stream) =>
    normalizeStream(stream, category)
  );
}

export async function fetchLiveMatches() {
  const categories = await fetchAllStreams();

  return flattenStreams(categories).filter(isCurrentlyLive);
}

export async function fetchPopularMatches(sport) {
  const matches = sport
    ? await fetchSportMatches(sport)
    : flattenStreams(await fetchAllStreams());

  return matches.filter((match) => match.popular === true);
}

export async function fetchStreamsForMatch(matchId) {
  const categories = await fetchAllStreams();
  const matches = flattenStreams(categories);

  const match = matches.find(
    (item) => String(item.id) === String(matchId)
  );

  if (!match || !match.iframe) {
    return [];
  }

  const srcMatch = match.iframe.match(
    /<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i
  );

  if (!srcMatch) {
    return [];
  }

  try {
    const embedUrl = new URL(srcMatch[1]);

    if (embedUrl.protocol !== 'https:') {
      return [];
    }

    return [
      {
        id: match.id,
        name: match.name,
        embedUrl: embedUrl.toString()
      }
    ];
  } catch {
    return [];
  }
}
