import { Search, X, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '../../stores/useStore';
import { useDebounce, useTranslation } from '../../hooks';
import { SEARCH_DEBOUNCE_DELAY } from '../../utils/constants';
import { formatTimeAgo } from '../../utils/helpers';
import { Input } from '../ui';

export function Header() {
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const activeTab = useStore((state) => state.activeTab);
  const lastUpdated = useStore((state) => state.lastUpdated);
  const { t } = useTranslation();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState('');

  // Debounce the search value
  const debouncedSearchValue = useDebounce(localSearchValue, SEARCH_DEBOUNCE_DELAY);

  // Update global store when debounced value changes
  useEffect(() => {
    setSearchQuery(debouncedSearchValue);
  }, [debouncedSearchValue, setSearchQuery]);

  const handleSearchToggle = () => {
    if (isSearchOpen) {
      setLocalSearchValue('');
      setSearchQuery('');
    }
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchChange = (e) => {
    setLocalSearchValue(e.target.value);
  };

  return (
    <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-fallback border-b border-border-light dark:border-border-dark">
      <div className="px-4 py-3">
        {/* Top row: Logo and Search toggle */}
        <div className="flex items-center justify-between">
          {isSearchOpen ? (
            <div className="flex-1 flex items-center gap-2">
              <Input
                type="search"
                placeholder={t('header.searchPlaceholder')}
                value={localSearchValue}
                onChange={handleSearchChange}
                icon={Search}
                className="flex-1"
                autoFocus
              />
              <button
                onClick={handleSearchToggle}
                className="p-2 text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={t('common.close')}
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <>
              <div>
                <h1 className="font-serif text-2xl text-primary-light dark:text-primary-dark">
                  {t('appName')}
                </h1>
                {activeTab === 'home' && lastUpdated && (
                  <div className="flex items-center gap-1 text-xs text-secondary-light dark:text-secondary-dark">
                    <Clock size={12} />
                    <span>{t('header.lastUpdated')} {formatTimeAgo(lastUpdated)}</span>
                  </div>
                )}
              </div>
              {activeTab === 'home' && (
                <button
                  onClick={handleSearchToggle}
                  className="p-2 text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label={t('header.search')}
                >
                  <Search size={20} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
