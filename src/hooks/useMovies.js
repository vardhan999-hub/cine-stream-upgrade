// Fix: removed the setTimeout hack for isFetchingRef.
// It's now reset inside the finally block of fetchPage — after the fetch
// actually completes, not after an arbitrary 500ms delay.

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPopularMovies, searchMovies } from '../utils/api';

const dedupe = (arr) => Array.from(new Map(arr.map((m) => [m.id, m])).values());

const useMovies = (query = '') => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const activeQueryRef = useRef(query);
  const abortRef = useRef(null);
  const isFetchingRef = useRef(false); // ← guards against double-firing loadMore

  const fetchPage = useCallback(async (q, pageNum, reset) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;

    if (reset) setLoading(true);
    else setLoadingMore(true);
    setError(null);
    isFetchingRef.current = true; // mark in-flight

    try {
      const data = q
        ? await searchMovies(q, pageNum, signal)
        : await fetchPopularMovies(pageNum, signal);

      if (q !== activeQueryRef.current) return;

      setMovies((prev) => {
        const combined = reset ? data.results : [...prev, ...data.results];
        return dedupe(combined);
      });
      setTotalPages(data.total_pages);
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (q === activeQueryRef.current) setError(err.message);
    } finally {
      if (q === activeQueryRef.current) {
        setLoading(false);
        setLoadingMore(false);
      }
      // ✅ Reset exactly when the fetch is done, not after an arbitrary timeout
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    activeQueryRef.current = query;
    setPage(1);
    setMovies([]);
    fetchPage(query, 1, true);
    return () => abortRef.current?.abort();
  }, [query, fetchPage]);

  useEffect(() => {
    if (page === 1) return;
    fetchPage(query, page, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadMore = useCallback(() => {
    if (loadingMore || loading || page >= totalPages) return;
    if (isFetchingRef.current) return; // already in-flight
    setPage((p) => p + 1);
  }, [loadingMore, loading, page, totalPages]);

  return { movies, loading, loadingMore, error, hasMore: page < totalPages, loadMore };
};

export default useMovies;
