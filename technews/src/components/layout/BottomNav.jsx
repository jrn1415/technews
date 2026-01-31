import { Home, Bookmark, Rss, Settings, BarChart3 } from 'lucide-react';
import { useStore } from '../../stores/useStore';
import { useTranslation } from '../../hooks/useTranslation';

const navItems = [
  { id: 'home', labelKey: 'nav.home', icon: Home },
  { id: 'bookmarks', labelKey: 'nav.saved', icon: Bookmark },
  { id: 'stats', labelKey: 'nav.stats', icon: BarChart3 },
  { id: 'sources', labelKey: 'nav.sources', icon: Rss },
  { id: 'settings', labelKey: 'nav.settings', icon: Settings }
];

export function BottomNav() {
  const activeTab = useStore((state) => state.activeTab);
  const setActiveTab = useStore((state) => state.setActiveTab);
  const bookmarks = useStore((state) => state.bookmarks);
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-fallback border-t border-border-light dark:border-border-dark">
      <div className="max-w-[430px] mx-auto">
        <div className="flex items-center justify-around py-2 pb-safe-bottom">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const showBadge = item.id === 'bookmarks' && bookmarks.length > 0;
            const label = t(item.labelKey);

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  relative flex flex-col items-center justify-center gap-1 px-3 py-1.5 min-w-[56px] min-h-[48px] rounded-xl
                  transition-colors duration-200
                  ${
                    isActive
                      ? 'text-accent-light dark:text-accent-dark'
                      : 'text-secondary-light dark:text-secondary-dark'
                  }
                `}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative">
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                    fill={item.id === 'bookmarks' && isActive ? 'currentColor' : 'none'}
                  />
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-light dark:bg-accent-dark text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {bookmarks.length > 9 ? '9+' : bookmarks.length}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
