import { useState } from 'react';
import { Link, Tag, Type, AlertCircle } from 'lucide-react';
import { useStore } from '../../stores/useStore';
import { validateFeed } from '../../utils/rssParser';
import { generateId, isValidUrl } from '../../utils/helpers';
import { CATEGORIES } from '../../utils/constants';
import { Modal, Input, Button, Spinner } from '../ui';

const EMOJI_OPTIONS = ['📰', '🌐', '💻', '🔒', '🤖', '🧠', '📱', '🎮', '🔬', '💡'];

export function AddFeedModal() {
  const { closeAddFeedModal, addCustomFeed } = useStore();

  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('tech');
  const [icon, setIcon] = useState('📰');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate URL format
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    // Validate feed
    setIsValidating(true);
    const result = await validateFeed(url);
    setIsValidating(false);

    if (!result.valid) {
      setError(result.error || 'Invalid RSS feed');
      return;
    }

    // Add feed
    const newFeed = {
      id: generateId(),
      name: name || result.title,
      url: url,
      category: category,
      icon: icon,
      enabled: true,
      isDefault: false
    };

    addCustomFeed(newFeed);
    closeAddFeedModal();
  };

  return (
    <Modal
      isOpen={true}
      onClose={closeAddFeedModal}
      title="Add RSS Feed"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* URL Input */}
        <div>
          <label className="block text-sm font-medium text-primary-light dark:text-primary-dark mb-1.5">
            Feed URL
          </label>
          <Input
            type="url"
            placeholder="https://example.com/rss.xml"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            icon={Link}
            required
          />
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-primary-light dark:text-primary-dark mb-1.5">
            Name (optional)
          </label>
          <Input
            type="text"
            placeholder="Feed name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={Type}
          />
          <p className="mt-1 text-xs text-secondary-light dark:text-secondary-dark">
            Leave empty to use the feed's title
          </p>
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-sm font-medium text-primary-light dark:text-primary-dark mb-1.5">
            Category
          </label>
          <div className="relative">
            <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-light dark:text-secondary-dark" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-primary-light dark:text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark appearance-none cursor-pointer"
            >
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Icon Picker */}
        <div>
          <label className="block text-sm font-medium text-primary-light dark:text-primary-dark mb-1.5">
            Icon
          </label>
          <div className="flex flex-wrap gap-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setIcon(emoji)}
                className={`
                  w-10 h-10 text-xl rounded-lg border-2 transition-all
                  ${
                    icon === emoji
                      ? 'border-accent-light dark:border-accent-dark bg-accent-light/10 dark:bg-accent-dark/10'
                      : 'border-border-light dark:border-border-dark hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={closeAddFeedModal}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isValidating || !url}
            className="flex-1"
          >
            {isValidating ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Validating...
              </>
            ) : (
              'Add Feed'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
