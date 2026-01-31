import { Plus } from 'lucide-react';
import { useStore } from '../../stores/useStore';
import { Button } from '../ui';
import { AddFeedModal } from './AddFeedModal';
import { SourceItem } from './SourceItem';

export function SourceList() {
  const { feeds, openAddFeedModal, isAddFeedModalOpen } = useStore();

  // Separate default and custom feeds
  const defaultFeeds = feeds.filter((f) => f.isDefault);
  const customFeeds = feeds.filter((f) => !f.isDefault);

  return (
    <div className="px-4 py-4">
      {/* Add Feed Button */}
      <Button
        variant="secondary"
        fullWidth
        onClick={openAddFeedModal}
        className="mb-6"
      >
        <Plus size={18} className="mr-2" />
        Add Custom Feed
      </Button>

      {/* Custom Feeds */}
      {customFeeds.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-secondary-light dark:text-secondary-dark uppercase tracking-wider mb-3">
            Custom Sources
          </h2>
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark px-4">
            {customFeeds.map((feed) => (
              <SourceItem key={feed.id} feed={feed} />
            ))}
          </div>
        </section>
      )}

      {/* Default Feeds */}
      <section>
        <h2 className="text-sm font-semibold text-secondary-light dark:text-secondary-dark uppercase tracking-wider mb-3">
          Default Sources
        </h2>
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark px-4">
          {defaultFeeds.map((feed) => (
            <SourceItem key={feed.id} feed={feed} />
          ))}
        </div>
      </section>

      {/* Add Feed Modal */}
      {isAddFeedModalOpen && <AddFeedModal />}
    </div>
  );
}
