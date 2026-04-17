import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectFilters,
  setGenre,
  setMinRating,
  setSortBy,
  resetFilters,
} from '../store/filtersSlice';

const RATINGS = [0, 5, 6, 7, 8];
const SORTS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Rating' },
  { value: 'year', label: 'Release Year' },
];

const fetchGenres = async () => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  if (!apiKey || apiKey === 'your_tmdb_api_key_here') return [];
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`,
  );
  if (!res.ok) throw new Error(`Genre fetch failed: ${res.status}`);
  const data = await res.json();
  return data.genres || [];
};

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const { genre, minRating, sortBy } = useSelector(selectFilters);

  const [genres, setGenres] = useState([]);
  const [genreLoading, setGenreLoading] = useState(true); 
  const [genreError, setGenreError] = useState(null); 

  const loadGenres = useCallback(async () => {
    setGenreLoading(true);
    setGenreError(null);
    try {
      const list = await fetchGenres();
      setGenres(list);
    } catch (err) {
      setGenreError(err.message);
    } finally {
      setGenreLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGenres();
  }, [loadGenres]);

  const isDefault = genre === 'All' && minRating === 0 && sortBy === 'popularity';

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <span className="filter-title">FILTERS</span>
        {!isDefault && (
          <button className="filter-reset" onClick={() => dispatch(resetFilters())}>
            Reset
          </button>
        )}
      </div>

      {/* Genre */}
      <div className="filter-group">
        <p className="filter-label">GENRE</p>

        {/*  Loading skeleton */}
        {genreLoading && (
          <div className="filter-chips">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="filter-chip filter-chip--skeleton" />
            ))}
          </div>
        )}

        {/*  Error + retry */}
        {genreError && !genreLoading && (
          <div className="filter-error">
            <span>Failed to load</span>
            <button className="filter-reset" onClick={loadGenres}>
              Retry
            </button>
          </div>
        )}

        {/* Genre chips */}
        {!genreLoading && !genreError && (
          <div className="filter-chips">
            <button
              className={`filter-chip${genre === 'All' ? ' active' : ''}`}
              onClick={() => dispatch(setGenre('All'))}
            >
              All
            </button>
            {genres.map((g) => (
              <button
                key={g.id}
                className={`filter-chip${genre === g.id ? ' active' : ''}`}
                onClick={() => dispatch(setGenre(g.id))}
              >
                {g.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Min Rating */}
      <div className="filter-group">
        <p className="filter-label">MIN RATING</p>
        <div className="filter-chips">
          {RATINGS.map((r) => (
            <button
              key={r}
              className={`filter-chip${minRating === r ? ' active' : ''}`}
              onClick={() => dispatch(setMinRating(r))}
            >
              {r === 0 ? 'Any' : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="filter-group">
        <p className="filter-label">SORT BY</p>
        <div className="filter-chips">
          {SORTS.map((s) => (
            <button
              key={s.value}
              className={`filter-chip${sortBy === s.value ? ' active' : ''}`}
              onClick={() => dispatch(setSortBy(s.value))}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
