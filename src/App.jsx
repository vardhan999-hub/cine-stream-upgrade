import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectTheme, toggleThemeWithPersist } from './store/themeSlice';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

const Navbar = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="logo">
          CINE<span>·</span>STREAM
        </NavLink>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Discover
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            ❤ Favorites
          </NavLink>
          <button
            className="theme-toggle"
            onClick={() => dispatch(toggleThemeWithPersist())}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  const theme = useSelector(selectTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Navbar />
      {/* ✅ ErrorBoundary per route — a crash in one page won't break the other */}
      <Routes>
        <Route
          path="/"
          element={
            <ErrorBoundary>
              <Home />
            </ErrorBoundary>
          }
        />
        <Route
          path="/favorites"
          element={
            <ErrorBoundary>
              <Favorites />
            </ErrorBoundary>
          }
        />
      </Routes>
      <ScrollToTop />
    </BrowserRouter>
  );
};

export default App;
