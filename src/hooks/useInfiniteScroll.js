

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
      observer.disconnect(); 
    };
  }, [handleIntersect]);

  return sentinelRef;
};

export default useInfiniteScroll;
