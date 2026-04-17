// ─── api.js ───────────────────────────────────────────────────────────────
// API key now sourced from validated env object (via Zod) rather than reading
// import.meta.env directly — catches missing keys at startup, not at call time.

import { env } from './env';

const BASE_URL = 'https://api.themoviedb.org/3';
export const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
export const IMG_ORIGINAL = 'https://image.tmdb.org/t/p/original';

const apiFetch = async (endpoint, params = {}, signal) => {
  const apiKey = env.VITE_TMDB_API_KEY;
  if (!apiKey) throw new Error('TMDB_API_KEY_MISSING: Add VITE_TMDB_API_KEY in .env');

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('language', 'en-US');

  // ✅ Skip params that are undefined or null
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v);
  });

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) {
    // ✅ Include response body in the error — gives actionable info in the console
    // e.g. TMDB returns { status_message: "Invalid API key" } on 401
    const body = await res.json().catch(() => null);
    const detail = body?.status_message || body?.errors?.[0] || res.statusText;
    throw new Error(`TMDB ${res.status}: ${detail}`);
  }
  return res.json();
};

export const fetchPopularMovies = (page = 1, signal) =>
  apiFetch('/movie/popular', { page }, signal);

export const searchMovies = (query, page = 1, signal) =>
  apiFetch('/search/movie', { query, page, include_adult: false }, signal);

export const fetchMovieDetails = (id) => apiFetch(`/movie/${id}`);

export const fetchMoviesByGenre = (genreId, page = 1) =>
  apiFetch('/discover/movie', { with_genres: genreId, page, sort_by: 'popularity.desc' });
