const FAVORITES_KEY = 'cinestream_favorites';

export const getFavorites = () => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveFavorite = (movie) => {
  const favorites = getFavorites();
  if (!favorites.find((m) => m.id === movie.id)) {
    const updated = [movie, ...favorites];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  }
  return favorites;
};

export const removeFavorite = (movieId) => {
  const updated = getFavorites().filter((m) => m.id !== movieId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
};

export const isFavorite = (movieId) => getFavorites().some((m) => m.id === movieId);

export const toggleFavorite = (movie) => {
  if (isFavorite(movie.id)) {
    return { favorites: removeFavorite(movie.id), added: false };
  }
  return { favorites: saveFavorite(movie), added: true };
};
