import { Trash2 } from 'lucide-react';
import { useStore } from '../../stores/useStore';
import { Toggle } from '../ui';

export function SourceItem({ feed }) {
  const { toggleFeed, removeCustomFeed } = useStore();

  const handleToggle = () => {
    toggleFeed(feed.id);
  };

  const handleRemove = () => {
    if (window.confirm(`Remove "${feed.name}" from your sources?`)) {
      removeCustomFeed(feed.id);
    }
  };

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border-light dark:border-border-dark last:border-b-0">
      {/* Icon */}
      <span className="text-2xl" role="img" aria-hidden="true">
        {feed.icon}
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-primary-light dark:text-primary-dark truncate">
            {feed.name}
          </span>
          {!feed.isDefault && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent-light/10 dark:bg-accent-dark/10 text-accent-light dark:text-accent-dark">
              Custom
            </span>
          )}
        </div>
        <p className="text-xs text-secondary-light dark:text-secondary-dark capitalize">
          {feed.category}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {!feed.isDefault && (
          <button
            onClick={handleRemove}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            aria-label={`Remove ${feed.name}`}
          >
            <Trash2 size={18} />
          </button>
        )}

        <div className="w-11">
          <Toggle enabled={feed.enabled} onChange={handleToggle} />
        </div>
      </div>
    </div>
  );
}
