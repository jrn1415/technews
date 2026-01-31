import { RefreshCw } from 'lucide-react';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';

export function PullToRefresh({ onRefresh, children }) {
  const { containerRef, pullDistance, pullState, isTouching, handlers } = usePullToRefresh(onRefresh);

  // แสดง indicator เฉพาะเมื่อกำลัง touch หรือกำลัง refresh เท่านั้น
  const showIndicator = (isTouching || pullState === 'refreshing') && pullDistance > 0;

  const getMessage = () => {
    switch (pullState) {
      case 'pulling':
        return 'Pull to refresh';
      case 'release':
        return 'Release to refresh';
      case 'refreshing':
        return 'Refreshing...';
      default:
        return '';
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto scrollbar-hide"
      {...handlers}
    >
      {/* Pull indicator - แสดงเฉพาะเมื่อกำลัง touch/refresh */}
      {showIndicator && (
        <div
          className="flex items-center justify-center py-4 text-secondary-light dark:text-secondary-dark"
          style={{
            height: `${pullDistance}px`,
            transition: pullState === 'refreshing' ? 'none' : 'height 0.2s ease-out'
          }}
        >
          <RefreshCw
            size={20}
            className={`mr-2 ${pullState === 'refreshing' ? 'animate-spin' : ''}`}
            style={{
              transform: `rotate(${Math.min(pullDistance * 2, 180)}deg)`,
              transition: pullState === 'refreshing' ? 'none' : 'transform 0.1s ease-out'
            }}
          />
          <span className="text-sm font-medium">{getMessage()}</span>
        </div>
      )}

      {/* Content */}
      {children}
    </div>
  );
}
