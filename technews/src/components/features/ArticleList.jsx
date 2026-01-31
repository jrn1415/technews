import { useMemo } from 'react';
import { useFeeds } from '../../hooks/useFeeds';
import { useStore } from '../../stores/useStore';
import { PullToRefresh } from '../layout';
import { Spinner, ArticleListSkeleton } from '../ui';
import { ArticleCard } from './ArticleCard';
import { CategoryTabs } from './CategoryTabs';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';

export function ArticleList() {
  const { isLoading, error, refresh } = useFeeds();
  const articles = useStore((state) => state.articles);
  const activeCategory = useStore((state) => state.activeCategory);
  const searchQuery = useStore((state) => state.searchQuery);

  // Memoize filtered articles for performance
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === 'all' || article.category === activeCategory;

      const matchesSearch =
        !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [articles, activeCategory, searchQuery]);

  return (
    <PullToRefresh onRefresh={refresh}>
      <CategoryTabs />

      <div className="px-4 py-4">
        {/* Loading state (initial load only) - Skeleton */}
        {isLoading && filteredArticles.length === 0 && (
          <ArticleListSkeleton count={5} />
        )}

        {/* Error state */}
        {error && filteredArticles.length === 0 && (
          <ErrorState message={error} onRetry={refresh} />
        )}

        {/* Empty state */}
        {!isLoading && !error && filteredArticles.length === 0 && (
          <EmptyState
            title={searchQuery ? 'No results found' : 'No articles yet'}
            description={
              searchQuery
                ? `No articles match "${searchQuery}"`
                : 'Pull down to refresh or check your feed sources'
            }
          />
        )}

        {/* Articles list */}
        {filteredArticles.length > 0 && (
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

      </div>
    </PullToRefresh>
  );
}
