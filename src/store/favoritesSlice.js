// ─── favoritesSlice.js ────────────────────────────────────────────────────
// Fix: Memoized selectors via reselect — selectFavIds no longer recreates
// a new Set() on every render. createSelector caches the result and only
// recomputes when the input (items array) actually changes.

import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { getFavorites, toggleFavorite as lsToggle } from '../utils/localStorage';

const loadInitialFavorites = () => {
  try {
    return getFavorites();
  } catch {
    return [];
  }
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { items: loadInitialFavorites() },
  reducers: {
    // ✅ Pure reducer — no side effects
    setFavorites(state, action) {
      state.items = action.payload;
    },
  },
});

const { setFavorites } = favoritesSlice.actions;

// ✅ Thunk: side effect (localStorage) lives here, not in the reducer
export const toggleFavorite = (movie) => (dispatch) => {
  const { favorites } = lsToggle(movie);
  dispatch(setFavorites(favorites));
};

// ✅ Memoized selectors via reselect — avoids new Set() on every render
const selectFavoritesItems = (state) => state.favorites.items;

export const selectFavorites = selectFavoritesItems;

export const selectFavIds = createSelector(
  selectFavoritesItems,
  // Only recomputes when items array reference changes
  (items) => new Set(items.map((m) => m.id)),
);

export default favoritesSlice.reducer;
