import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './favoritesSlice';
import filtersReducer from './filtersSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    filters: filtersReducer,
    theme: themeReducer,
  },
});
