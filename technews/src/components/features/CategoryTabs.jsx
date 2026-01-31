import { useStore } from '../../stores/useStore';
import { useTranslation } from '../../hooks/useTranslation';
import { CATEGORIES } from '../../utils/constants';

export function CategoryTabs() {
  const { activeCategory, setActiveCategory } = useStore();
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-fallback border-b border-border-light dark:border-border-dark">
      <div className="flex overflow-x-auto scrollbar-hide px-4 py-2 gap-2">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id;
          const label = t(`categories.${category.id}`);

          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-primary-light dark:bg-primary-dark text-white dark:text-black'
                    : 'bg-category-light dark:bg-category-dark text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark'
                }
              `}
              aria-pressed={isActive}
            >
              <span className="mr-1">{category.icon}</span>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
