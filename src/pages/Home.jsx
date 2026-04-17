// ─── Week 10 Upgrade: Redux Toolkit (RTK) ────────────────────────────────
// Level 1 – Favorites slice (add/remove via dispatch)
// Level 2 – Filters slice (genre, minRating, sortBy stored in global store)
// Level 3 – useMemo for filtered/sorted list, useCallback for stable handlers

import { useState, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, selectFavIds } from '../store/favoritesSlice';
import { selectFilters } from '../store/filtersSlice';
import FilterSidebar from '../components/FilterSidebar';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import Loader from '../components/Loader';
import useDebounce from '../hooks/useDebounce';
import useMovies from '../hooks/useMovies';
import { searchMovies } from '../utils/api';

// ── Groq Mood Matcher ────────────────────────────────────────────────────
const getMoodMovieFromGroq = async (moodText) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') throw new Error('GROQ_KEY_MISSING');

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 20,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            'You are a movie expert. When given a mood or feeling, respond with ONLY a single movie title — no explanation, no punctuation, just the title.',
        },
        { role: 'user', content: moodText },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq error: ${res.status}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
};

// ── Home Page ─────────────────────────────────────────────────────────────
const Home = () => {
  // ── Redux state ────────────────────────────────────────────────────────
  const dispatch = useDispatch();
  const favIds = useSelector(selectFavIds); // Set<id>
  const filters = useSelector(selectFilters); // { genre, minRating, sortBy }

  // ── Local UI state ─────────────────────────────────────────────────────
  const toastRef = useRef(null); // ✅ scoped — no module-level variable
  const moodCacheRef = useRef(new Map()); // ✅ cache mood results to avoid repeat API calls
  const moodDebounceRef = useRef(null); // ✅ debounce the mood match button
  const [rawQuery, setRawQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [moodText, setMoodText] = useState('');
  const [moodLoading, setMoodLoading] = useState(false);
  const [moodResult, setMoodResult] = useState(null);
  const [moodMatchId, setMoodMatchId] = useState(null);
  const [moodError, setMoodError] = useState(null);

  const debouncedQuery = useDebounce(rawQuery, 500);
  const { movies, loading, loadingMore, error, hasMore, loadMore } = useMovies(debouncedQuery);

  // ── Level 1: dispatch to Redux ─────────────────────────────────────────
  const handleToggleFav = useCallback(
    (movie) => {
      const isCurrentlyFav = favIds.has(movie.id);
      dispatch(toggleFavorite(movie));
      clearTimeout(toastRef.current);
      setToast(isCurrentlyFav ? `🖤  Removed "${movie.title}"` : `❤️  Added "${movie.title}"`);
      toastRef.current = setTimeout(() => setToast(null), 2500);
    },
    [dispatch, favIds],
  );

  // ── Level 3: useMemo — recomputes only when movies or filters change ───
  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (filters.genre !== 'All') {
      result = result.filter(
        (m) => Array.isArray(m.genre_ids) && m.genre_ids.includes(Number(filters.genre)),
      );
    }
    if (filters.minRating > 0) {
      result = result.filter((m) => (m.vote_average || 0) >= filters.minRating);
    }
    if (filters.sortBy === 'rating') {
      result = [...result].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (filters.sortBy === 'year') {
      result = [...result].sort(
        (a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0),
      );
    }

    return result;
  }, [movies, filters]);

  // ── Mood Matcher ───────────────────────────────────────────────────────
  const runMoodMatch = useCallback(async (text) => {
    // ✅ Cache check — skip API call if we've seen this mood before
    if (moodCacheRef.current.has(text)) {
      const cached = moodCacheRef.current.get(text);
      setMoodResult(cached.result);
      setMoodMatchId(cached.matchId);
      return;
    }

    setMoodLoading(true);
    setMoodResult(null);
    setMoodError(null);
    setMoodMatchId(null);

    try {
      const suggestedTitle = await getMoodMovieFromGroq(text);
      if (!suggestedTitle) throw new Error('No title returned');
      const tmdbData = await searchMovies(suggestedTitle, 1);
      const movie = tmdbData.results?.[0];
      const result = { title: suggestedTitle, movie };
      const matchId = movie?.id ?? null;

      // ✅ Store in cache for this session
      moodCacheRef.current.set(text, { result, matchId });

      setMoodResult(result);
      if (matchId) setMoodMatchId(matchId);
    } catch (err) {
      if (err.message === 'GROQ_KEY_MISSING') {
        setMoodError('Add your VITE_GROQ_API_KEY to .env to enable Mood Matcher.');
      } else {
        setMoodError(`Could not get a suggestion: ${err.message}`);
      }
    } finally {
      setMoodLoading(false);
    }
  }, []);

  // ✅ Debounced trigger — prevents hammering the API on rapid clicks
  const handleMoodMatch = useCallback(() => {
    const text = moodText.trim();
    if (!text) return;
    clearTimeout(moodDebounceRef.current);
    moodDebounceRef.current = setTimeout(() => runMoodMatch(text), 400);
  }, [moodText, runMoodMatch]);

  const sectionTitle = debouncedQuery ? `Results for "${debouncedQuery}"` : 'POPULAR MOVIES';

  return (
    <div className="page-wrapper">
      <div className="hero">
        <p className="hero-eyebrow">↯ DISCOVER</p>
        <h1 className="hero-title">
          YOUR NEXT
          <br />
          <em>Obsession</em>
        </h1>
        <p className="hero-sub">Millions of movies. Zero excuses. Start exploring.</p>
      </div>

      <SearchBar value={rawQuery} onChange={setRawQuery} />

      <div className="mood-section">
        <div className="mood-label">
          <span className="mood-badge">AI POWERED</span>
        </div>
        <h2 className="mood-title">Mood Matcher</h2>
        <p className="mood-desc">
          Describe how you're feeling and we'll find the perfect movie for you.
        </p>
        <div className="mood-row">
          <input
            type="text"
            className="mood-input"
            placeholder="e.g. I'm feeling sad but want something uplifting…"
            value={moodText}
            onChange={(e) => setMoodText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !moodLoading && handleMoodMatch()}
          />
          <button
            className="mood-btn"
            onClick={handleMoodMatch}
            disabled={moodLoading || !moodText.trim()}
          >
            {moodLoading ? <Loader inline /> : '✦ Match'}
          </button>
        </div>
        {moodResult && (
          <div className="mood-result">
            {moodResult.movie ? (
              <>
                Based on your mood, we recommend: <strong>{moodResult.title}</strong>
                {moodResult.movie.overview && <> — {moodResult.movie.overview?.slice(0, 120)}…</>}
              </>
            ) : (
              <>
                AI suggested <strong>{moodResult.title}</strong>, but we couldn't find it in our
                database.
              </>
            )}
          </div>
        )}
        {moodError && <div className="mood-result mood-result--error">{moodError}</div>}
      </div>

      {/* ── Week 10: Sidebar + Grid layout ── */}
      <div className="discover-layout">
        <FilterSidebar />

        <div className="discover-main">
          <div className="section-header">
            <h2 className="section-title">{sectionTitle}</h2>
            {!loading && movies.length > 0 && (
              <span className="section-count">
                {filteredMovies.length} of {movies.length} loaded
              </span>
            )}
          </div>

          {error && (
            <div className="error-banner">
              <span>
                {error.includes('TMDB_API_KEY_MISSING')
                  ? '🔑 Please add your VITE_TMDB_API_KEY to the .env file to load movies.'
                  : `Error: ${error}`}
              </span>
              {/* ✅ Retry button — reload the current query */}
              {!error.includes('TMDB_API_KEY_MISSING') && (
                <button
                  className="error-retry"
                  onClick={() => {
                    // Force re-mount of useMovies by toggling query
                    setRawQuery((q) => q);
                  }}
                >
                  Retry
                </button>
              )}
            </div>
          )}

          <MovieGrid
            movies={filteredMovies}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            onLoadMore={loadMore}
            favIds={favIds}
            onToggleFav={handleToggleFav}
            moodMatchId={moodMatchId}
          />
        </div>
      </div>

      {/* ✅ aria-live: screen readers announce toast messages without focus moving */}
      <div aria-live="polite" aria-atomic="true">
        {toast && <div className="toast">{toast}</div>}
      </div>
    </div>
  );
};

export default Home;
