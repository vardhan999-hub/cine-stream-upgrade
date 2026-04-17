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
   
    setFavorites(state, action) {
      state.items = action.payload;
    },
  },
});

const { setFavorites } = favoritesSlice.actions;


export const toggleFavorite = (movie) => (dispatch) => {
  const { favorites } = lsToggle(movie);
  dispatch(setFavorites(favorites));
};


const selectFavoritesItems = (state) => state.favorites.items;

export const selectFavorites = selectFavoritesItems;

export const selectFavIds = createSelector(
  selectFavoritesItems,
  
  (items) => new Set(items.map((m) => m.id)),
);

export default favoritesSlice.reducer;
