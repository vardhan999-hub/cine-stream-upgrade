import { IMG_BASE } from '../utils/api';

const StarIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect width='300' height='450' fill='%230e1219'/%3E%3Crect x='40' y='100' width='220' height='160' rx='8' fill='none' stroke='%231a2132' stroke-width='2'/%3E%3Cpolygon points='110,140 110,220 200,180' fill='%231a2132'/%3E%3Ctext x='150' y='310' font-family='sans-serif' font-size='13' fill='%236b7585' text-anchor='middle'%3ENo Poster%3C/text%3E%3C/svg%3E";

const MovieCard = ({ movie, isFav, onToggleFav, isMoodMatch = false }) => {
  const posterUrl = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : PLACEHOLDER;

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '—';

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '—';

  const handleFavClick = (e) => {
    e.stopPropagation();
    onToggleFav(movie);
  };

  return (
    <article className={`movie-card${isMoodMatch ? ' mood-match-card' : ''}`}>
      <div className="card-poster-wrap">
        <img
          className="card-poster"
          src={posterUrl}
          // ✅ Descriptive alt: includes year so screen readers distinguish same-title films
          alt={year !== '—' ? `${movie.title} (${year}) poster` : `${movie.title} poster`}
          loading="lazy"
          onError={(e) => {
            // ✅ Guard: only swap once — prevents infinite error loop if PLACEHOLDER also fails
            if (e.currentTarget.src !== PLACEHOLDER) {
              e.currentTarget.src = PLACEHOLDER;
            }
          }}
        />

        {/* Rating badge */}
        <div className="card-rating">
          <StarIcon />
          {rating}
        </div>

        {/* Favorite button */}
        <button
          className={`card-fav${isFav ? ' is-fav' : ''}`}
          onClick={handleFavClick}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon filled={isFav} />
        </button>

        {/* Hover overlay with overview */}
        <div className="card-overlay">
          <p className="card-overlay-text">
            {movie.overview?.slice(0, 160) || 'No description available.'}
          </p>
        </div>

        {/* AI Match badge */}
        {isMoodMatch && <div className="mood-match-badge">AI MATCH</div>}
      </div>

      <div className="card-body">
        <p className="card-title">{movie.title}</p>
        <p className="card-meta">{year}</p>
      </div>
    </article>
  );
};

export default MovieCard;
