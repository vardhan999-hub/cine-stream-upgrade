import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    genre: 'All',
    minRating: 0,
    sortBy: 'popularity', // 'popularity' | 'rating' | 'year'
  },
  reducers: {
    setGenre(state, action) {
      state.genre = action.payload;
    },
    setMinRating(state, action) {
      state.minRating = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    resetFilters(state) {
      state.genre = 'All';
      state.minRating = 0;
      state.sortBy = 'popularity';
    },
  },
});

export const { setGenre, setMinRating, setSortBy, resetFilters } = filtersSlice.actions;

// Selectors
export const selectFilters = (state) => state.filters;

export default filtersSlice.reducer;
