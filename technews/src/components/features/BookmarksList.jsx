import { Bookmark, Trash2 } from 'lucide-react';
import { useStore } from '../../stores/useStore';
import { useToastContext } from '../../contexts/ToastContext';
import { useTranslation } from '../../hooks/useTranslation';
import { ArticleCard } from './ArticleCard';
import { EmptyState } from './EmptyState';

export function BookmarksList() {
  const bookmarks = useStore((state) => state.bookmarks);
  const clearAllBookmarks = useStore((state) => state.clearAllBookmarks);
  const toast = useToastContext();
  const { t } = useTranslation();

  const handleClearAll = () => {
    if (window.confirm(t('bookmarks.clearConfirm'))) {
      clearAllBookmarks();
      toast.info(t('bookmarks.cleared'));
    }
  };

  if (bookmarks.length === 0) {
    return (
      <div className="px-4 py-4">
        <EmptyState
          title={t('bookmarks.empty')}
          description={t('bookmarks.emptyDesc')}
          icon={Bookmark}
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-secondary-light dark:text-secondary-dark">
          {bookmarks.length} {t('bookmarks.title').toLowerCase()}
        </p>
        <button
          onClick={handleClearAll}
          className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors"
        >
          <Trash2 size={14} />
          {t('bookmarks.clearAll')}
        </button>
      </div>
      <div className="space-y-4">
        {bookmarks.map((article) => (
          <ArticleCard key={article.link} article={article} />
        ))}
      </div>
    </div>
  );
}
