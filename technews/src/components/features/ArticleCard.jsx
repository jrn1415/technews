import { memo, useCallback } from 'react';
import { Clock, ExternalLink, Bookmark } from 'lucide-react';
import { useStore } from '../../stores/useStore';
import { useToastContext } from '../../contexts/ToastContext';
import { formatTimeAgo } from '../../utils/helpers';
import { Card } from '../ui';

export const ArticleCard = memo(function ArticleCard({ article }) {
  const setSelectedArticle = useStore((state) => state.setSelectedArticle);
  const toggleBookmark = useStore((state) => state.toggleBookmark);
  const bookmarks = useStore((state) => state.bookmarks);
  const toast = useToastContext();

  const isBookmarked = bookmarks.some((b) => b.link === article.link);

  const handleClick = useCallback(() => {
    setSelectedArticle(article);
  }, [article, setSelectedArticle]);

  const handleExternalClick = useCallback((e) => {
    e.stopPropagation();
    window.open(article.link, '_blank', 'noopener,noreferrer');
  }, [article.link]);

  const handleBookmarkClick = useCallback((e) => {
    e.stopPropagation();
    const wasBookmarked = bookmarks.some((b) => b.link === article.link);
    toggleBookmark(article);

    if (wasBookmarked) {
      toast.info('Removed from bookmarks');
    } else {
      toast.success('Saved to bookmarks');
    }
  }, [article, toggleBookmark, bookmarks, toast]);

  return (
    <Card
      hoverable
      onClick={handleClick}
      className="p-4 animate-fade-in"
    >
      <article>
        {/* Source and time */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg" role="img" aria-hidden="true">
              {article.source.icon}
            </span>
            <span className="text-sm font-medium text-secondary-light dark:text-secondary-dark">
              {article.source.name}
            </span>
          </div>
          <span className="text-xs text-secondary-light dark:text-secondary-dark">
            {formatTimeAgo(article.pubDate)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg leading-tight text-primary-light dark:text-primary-dark mb-2 line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-secondary-light dark:text-secondary-dark line-clamp-2 mb-3">
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-secondary-light dark:text-secondary-dark">
            <Clock size={14} />
            <span>{article.readTime} min read</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleBookmarkClick}
              className={`p-1.5 rounded-lg transition-colors ${
                isBookmarked
                  ? 'text-accent-light dark:text-accent-dark'
                  : 'text-secondary-light dark:text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark'
              } hover:bg-gray-100 dark:hover:bg-gray-800`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleExternalClick}
              className="p-1.5 text-secondary-light dark:text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Open in new tab"
            >
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      </article>
    </Card>
  );
});
