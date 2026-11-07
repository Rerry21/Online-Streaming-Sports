import axios from 'axios';

const BASE_URL = process.env.FOOTBALL_DATA_BASE_URL ||
'http://api.football-data.org/v4';

const client = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY
    }
});

async function request(path) {
    const response = await client.get(path);
    return response.data;
}

export async function fetchFootballMatches(){
    const data = await request('/matches');
    return data.matches || [];
}

export async function fetchFootballLiveMatches(){
    const data = await request('/matches?status=LIVE');
    return data.matches || [];
}