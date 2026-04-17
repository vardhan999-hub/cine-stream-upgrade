// ─── themeSlice.js ────────────────────────────────────────────────────────
// Fix: localStorage access is wrapped in a try/catch helper so this slice
// is safe in SSR environments (Next.js) where window/localStorage don't exist.
// Redux reducers stay pure — side effects (persisting) happen only in the
// action handler, never in the reducer body itself.

import { createSlice } from '@reduxjs/toolkit';

// ✅ SSR-safe localStorage read — won't crash in Next.js / test environments
const readPersistedTheme = () => {
  try {
    return localStorage.getItem('cinestream_theme') || 'dark';
  } catch {
    return 'dark'; // fallback for SSR or restricted environments
  }
};

// ✅ SSR-safe localStorage write
const persistTheme = (mode) => {
  try {
    localStorage.setItem('cinestream_theme', mode);
  } catch {
    // silently ignore — non-critical
  }
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: readPersistedTheme(),
  },
  reducers: {
    toggleTheme(state) {
      // Reducer stays pure: only updates state
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

// ✅ Middleware-style persistence: called from the component after dispatch,
//    keeping the reducer itself free of side effects.
export const toggleThemeWithPersist = () => (dispatch, getState) => {
  dispatch(toggleTheme());
  persistTheme(getState().theme.mode);
};

export const selectTheme = (state) => state.theme.mode;

export default themeSlice.reducer;
