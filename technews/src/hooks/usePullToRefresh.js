import { useState, useRef, useCallback } from 'react';

const PULL_THRESHOLD = 80;
const RESISTANCE = 2.5;

export function usePullToRefresh(onRefresh) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    // Only enable pull to refresh when scrolled to top
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback(
    (e) => {
      if (!isPulling || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;

      if (diff > 0) {
        // Apply resistance to make pulling feel natural
        const distance = Math.min(diff / RESISTANCE, PULL_THRESHOLD * 1.5);
        setPullDistance(distance);
      }
    },
    [isPulling, isRefreshing]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;

    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(PULL_THRESHOLD);

      try {
        await onRefresh?.();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
    setIsPulling(false);
  }, [isPulling, pullDistance, isRefreshing, onRefresh]);

  const getPullState = () => {
    if (isRefreshing) return 'refreshing';
    if (pullDistance >= PULL_THRESHOLD) return 'release';
    if (pullDistance > 0) return 'pulling';
    return 'idle';
  };

  return {
    containerRef,
    pullDistance,
    pullState: getPullState(),
    isRefreshing,
    isTouching: isPulling, // เพิ่ม: ใช้ตรวจสอบว่ากำลัง touch อยู่หรือไม่
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  };
}
