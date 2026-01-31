export function Skeleton({ className = '' }) {
  return (
    <div
      className={`
        animate-pulse
        bg-gray-200 dark:bg-gray-700
        rounded
        ${className}
      `}
    />
  );
}

export function ArticleSkeleton() {
  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4">
      {/* Source and time */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="w-24 h-4" />
        </div>
        <Skeleton className="w-12 h-3" />
      </div>

      {/* Title */}
      <Skeleton className="w-full h-5 mb-2" />
      <Skeleton className="w-3/4 h-5 mb-2" />

      {/* Excerpt */}
      <Skeleton className="w-full h-4 mb-1" />
      <Skeleton className="w-5/6 h-4 mb-3" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <Skeleton className="w-20 h-3" />
        <div className="flex gap-2">
          <Skeleton className="w-7 h-7 rounded-lg" />
          <Skeleton className="w-7 h-7 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ArticleListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <ArticleSkeleton key={index} />
      ))}
    </div>
  );
}
