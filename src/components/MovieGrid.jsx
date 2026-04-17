import MovieCard from './MovieCard';
import Loader from './Loader';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const MovieGrid = ({
  movies,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
  favIds,
  onToggleFav,
  moodMatchId = null,
}) => {
  // Sentinel ref triggers loadMore when scrolled into view
  const sentinelRef = useInfiniteScroll({
    onIntersect: onLoadMore,
    enabled: hasMore && !loadingMore && !loading,
  });

  if (loading) return <Loader text="Fetching movies…" />;

  if (!loading && !movies.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🎬</div>
        <p className="empty-title">NO RESULTS FOUND</p>
        <p className="empty-desc">Try a different search term or browse popular movies.</p>
      </div>
    );
  }

  return (
    <>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFav={favIds.has(movie.id)}
            onToggleFav={onToggleFav}
            isMoodMatch={movie.id === moodMatchId}
          />
        ))}
      </div>

      {/* Infinite scroll sentinel — invisible element at the bottom */}
      <div ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />

      {/* Loading spinner while fetching next page */}
      {loadingMore && <Loader text="Loading more movies…" />}

      {/* End of results */}
      {!hasMore && movies.length > 0 && (
        <p
          style={{
            textAlign: 'center',
            padding: '32px 0',
            color: 'var(--muted)',
            fontSize: '13px',
            letterSpacing: '1px',
          }}
        >
          — END OF RESULTS —
        </p>
      )}
    </>
  );
};

export default MovieGrid;
