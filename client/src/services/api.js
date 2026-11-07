async function request(url, fallbackMessage) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 15000);

  let response;

  try {
    response = await fetch(url, {
      signal: controller.signal
    });
  } catch (error) {
    clearTimeout(timeout);

    if (error.name === 'AbortError') {
      throw new Error(
        'The request took too long. Please try again.'
      );
    }

    throw new Error(
      'Unable to connect to Matchday. Make sure the server is running.'
    );
  }

  clearTimeout(timeout);

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
      fallbackMessage ||
      `Request failed (${response.status})`
    );
  }

  return data;
}

export async function fetchSports() {
  return request(
    '/api/sports',
    'Could not load sports.'
  );
}

export async function fetchMatches(sport = null) {
  const url = sport
    ? `/api/matches/${encodeURIComponent(sport)}`
    : '/api/matches';

  return request(
    url,
    'Could not load matches.'
  );
}

export async function fetchLiveMatches(sport = null) {
  const url = sport
    ? `/api/matches/live?sport=${encodeURIComponent(sport)}`
    : '/api/matches/live';

  return request(
    url,
    'Could not load live events.'
  );
}

export async function fetchPopularMatches(sport = null) {
  const url = sport
    ? `/api/matches/popular?sport=${encodeURIComponent(sport)}`
    : '/api/matches/popular';

  return request(
    url,
    'Could not load popular events.'
  );
}

export async function fetchStreams(matchId) {
  return request(
    `/api/matches/${encodeURIComponent(matchId)}/stream`,
    'Could not load the stream.'
  );
}