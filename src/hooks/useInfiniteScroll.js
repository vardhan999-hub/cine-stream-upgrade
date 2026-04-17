// Fix: observer.disconnect() instead of observer.unobserve(el)
// disconnect() tears down the entire observer — more reliable cleanup,
// especially if the sentinel ref changes between renders.

import { useEffect, useRef, useCallback } from 'react';

const useInfiniteScroll = ({ onIntersect, enabled = true }) => {
  const sentinelRef = useRef(null);

  const handleIntersect = useCallback(
    (entries) => {
      const [entry] = entries;
      if (!entry.isIntersecting || !enabled) return;
      onIntersect();
    },
    [onIntersect, enabled],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '200px',
      threshold: 0,
    });

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      observer.disconnect(); // ✅ cleaner than unobserve — removes all targets
    };
  }, [handleIntersect]);

  return sentinelRef;
};

export default useInfiniteScroll;
