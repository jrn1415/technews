import { useMemo } from 'react';
import { BarChart3, Newspaper, Clock, TrendingUp } from 'lucide-react';
import { useStore } from '../../stores/useStore';
import { useTranslation } from '../../hooks/useTranslation';
import { Card } from '../ui';
import { CATEGORIES } from '../../utils/constants';

export function ArticleStats() {
  const articles = useStore((state) => state.articles);
  const lastUpdated = useStore((state) => state.lastUpdated);
  const { t } = useTranslation();

  const stats = useMemo(() => {
    // Count articles by category
    const categoryCount = {};
    CATEGORIES.forEach((cat) => {
      categoryCount[cat.id] = 0;
    });

    articles.forEach((article) => {
      if (categoryCount[article.category] !== undefined) {
        categoryCount[article.category]++;
      }
    });

    // Calculate average read time
    const totalReadTime = articles.reduce((sum, article) => sum + (article.readTime || 0), 0);
    const avgReadTime = articles.length > 0 ? Math.round(totalReadTime / articles.length) : 0;

    // Get top category
    let topCategory = null;
    let maxCount = 0;
    Object.entries(categoryCount).forEach(([catId, count]) => {
      if (count > maxCount && catId !== 'all') {
        maxCount = count;
        topCategory = catId;
      }
    });

    const topCategoryInfo = CATEGORIES.find((c) => c.id === topCategory);

    return {
      total: articles.length,
      categoryCount,
      avgReadTime,
      topCategory: topCategoryInfo,
      topCategoryCount: maxCount
    };
  }, [articles]);

  // Get translated category label
  const getCategoryLabel = (categoryId) => {
    return t(`categories.${categoryId}`);
  };

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 size={20} className="text-accent-light dark:text-accent-dark" />
        <h2 className="font-serif text-lg font-medium text-primary-light dark:text-primary-dark">
          {t('stats.title')}
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Articles */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Newspaper size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-light dark:text-primary-dark">
                {stats.total}
              </p>
              <p className="text-xs text-secondary-light dark:text-secondary-dark">
                {t('stats.totalArticles')}
              </p>
            </div>
          </div>
        </Card>

        {/* Avg Read Time */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Clock size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-light dark:text-primary-dark">
                {stats.avgReadTime}
              </p>
              <p className="text-xs text-secondary-light dark:text-secondary-dark">
                {t('stats.avgReadTime')}
              </p>
            </div>
          </div>
        </Card>

        {/* Top Category */}
        {stats.topCategory && (
          <Card className="p-4 col-span-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{stats.topCategory.icon}</span>
                  <p className="text-lg font-bold text-primary-light dark:text-primary-dark">
                    {getCategoryLabel(stats.topCategory.id)}
                  </p>
                </div>
                <p className="text-xs text-secondary-light dark:text-secondary-dark">
                  {t('stats.topCategory')} ({stats.topCategoryCount} {t('stats.articles')})
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Category Breakdown */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-primary-light dark:text-primary-dark mb-3">
          {t('stats.byCategory')}
        </h3>
        <div className="space-y-2">
          {CATEGORIES.filter((cat) => cat.id !== 'all').map((category) => {
            const count = stats.categoryCount[category.id] || 0;
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

            return (
              <div key={category.id} className="flex items-center gap-2">
                <span className="text-sm w-6">{category.icon}</span>
                <span className="text-sm text-secondary-light dark:text-secondary-dark w-24">
                  {getCategoryLabel(category.id)}
                </span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-light dark:bg-accent-dark rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-secondary-light dark:text-secondary-dark w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Last Updated */}
      {lastUpdated && (
        <p className="text-xs text-center text-secondary-light dark:text-secondary-dark">
          {t('header.lastUpdated')}: {new Date(lastUpdated).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
