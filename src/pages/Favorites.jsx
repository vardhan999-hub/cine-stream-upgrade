// ─── Week 10: Favorites reads from Redux store ────────────────────────────
// Fix: useRef for toast timeout instead of module-level let (avoids shared
//      state across component instances and memory leak risk)

import { useCallback, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, selectFavorites } from '../store/favoritesSlice';
import MovieCard from '../components/MovieCard';

const Favorites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const [toast, setToast] = useState(null);
  const toastRef = useRef(null); // ✅ scoped to this instance, no leak

  // useMemo prevents favIds from being recreated on every render,
  // which would otherwise make the useCallback below re-run unnecessarily
  const favIds = useMemo(() => new Set(favorites.map((m) => m.id)), [favorites]);

  const showToast = useCallback((msg) => {
    clearTimeout(toastRef.current);
    setToast(msg);
    toastRef.current = setTimeout(() => setToast(null), 2500);
  }, []);

  const handleToggleFav = useCallback(
    (movie) => {
      const isCurrentlyFav = favIds.has(movie.id);
      dispatch(toggleFavorite(movie));
      showToast(isCurrentlyFav ? `🖤  Removed "${movie.title}"` : `❤️  Added "${movie.title}"`);
    },
    [dispatch, favIds, showToast],
  );

  const avgRating = favorites.length
    ? (favorites.reduce((sum, m) => sum + (m.vote_average || 0), 0) / favorites.length).toFixed(1)
    : '—';

  return (
    <div className="page-wrapper">
      <div className="hero">
        <p className="hero-eyebrow">↯ COLLECTION</p>
        <h1 className="hero-title">
          MY
          <br />
          <em>Favorites</em>
        </h1>
      </div>

      {favorites.length > 0 && (
        <div className="fav-stats">
          <div className="fav-stat">
            <div className="fav-stat-number">{favorites.length}</div>
            <div className="fav-stat-label">FILMS SAVED</div>
          </div>
          <div className="fav-stat">
            <div className="fav-stat-number">{avgRating}</div>
            <div className="fav-stat-label">AVG RATING</div>
          </div>
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤍</div>
          <p className="empty-title">NO FAVORITES YET</p>
          <p className="empty-desc">Tap the heart icon on any movie to save it here.</p>
        </div>
      ) : (
        <>
          <div className="section-header">
            <h2 className="section-title">SAVED FILMS</h2>
          </div>
          <div className="movie-grid">
            {favorites.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFav={favIds.has(movie.id)}
                onToggleFav={handleToggleFav}
              />
            ))}
          </div>
        </>
      )}

      <div aria-live="polite" aria-atomic="true">
        {toast && <div className="toast">{toast}</div>}
      </div>
    </div>
  );
};

export default Favorites;
