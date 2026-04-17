import { createSlice } from '@reduxjs/toolkit';


const readPersistedTheme = () => {
  try {
    return localStorage.getItem('cinestream_theme') || 'dark';
  } catch {
    return 'dark'; 
  }
};


const persistTheme = (mode) => {
  try {
    localStorage.setItem('cinestream_theme', mode);
  } catch {
    
  }
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: readPersistedTheme(),
  },
  reducers: {
    toggleTheme(state) {
      
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
    },
  },
});

export const { toggleTheme } = themeSlice.actions;


export const toggleThemeWithPersist = () => (dispatch, getState) => {
  dispatch(toggleTheme());
  persistTheme(getState().theme.mode);
};

export const selectTheme = (state) => state.theme.mode;

export default themeSlice.reducer;
