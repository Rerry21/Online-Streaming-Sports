import axios from 'axios';

const BASE_URL = process.env.API_BASE_URL || 'https://streamed.pk';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000
});

async function request(path) {
  const response = await client.get(path);
  return response.data;
}

export async function fetchSports() {
  return request('/api/sports');
}

export async function fetchSportMatches(sport) {
  return request(`/api/matches/${encodeURIComponent(sport)}`);
}

export async function fetchLiveMatches() {
  return request('/api/matches/live');
}

export async function fetchPopularMatches(sport) {
  const path = sport
    ? `/api/matches/${encodeURIComponent(sport)}/popular`
    : '/api/matches/all/popular';

  return request(path);
}

export async function fetchStreamsFromSource(source, id) {
  return request(
    `/api/stream/${encodeURIComponent(source)}/${encodeURIComponent(id)}`
  );
}