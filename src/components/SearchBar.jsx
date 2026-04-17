import { useRef } from 'react';

const SearchBar = ({ value, onChange }) => {
  const inputRef = useRef(null);

  return (
    <div className="search-wrap">
      <span className="search-icon">⌕</span>
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="Search for movies, directors, genres…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
      />
      {value && (
        <button
          className="search-clear"
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
