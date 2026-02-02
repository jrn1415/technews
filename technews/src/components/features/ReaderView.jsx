import { useState } from 'react';
import { ArrowLeft, ExternalLink, Share2, Bookmark, Type, Globe } from 'lucide-react';
import { useStore } from '../../stores/useStore';
import { formatDate, sanitizeHtml } from '../../utils/helpers';

export function ReaderView() {
  const selectedArticle = useStore((state) => state.selectedArticle);
  const setSelectedArticle = useStore((state) => state.setSelectedArticle);
  const settings = useStore((state) => state.settings);
  const updateSettings = useStore((state) => state.updateSettings);
  const toggleBookmark = useStore((state) => state.toggleBookmark);
  const bookmarks = useStore((state) => state.bookmarks);

  const [showFontMenu, setShowFontMenu] = useState(false);

  if (!selectedArticle) return null;

  const isBookmarked = bookmarks.some((b) => b.link === selectedArticle.link);

  const fontSizeOptions = [
    { id: 'small', label: 'Small', size: 'Aa' },
    { id: 'medium', label: 'Medium', size: 'Aa' },
    { id: 'large', label: 'Large', size: 'Aa' }
  ];

  const handleFontSizeChange = (size) => {
    updateSettings({ fontSize: size });
    setShowFontMenu(false);
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };

  const handleBookmark = () => {
    toggleBookmark(selectedArticle);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedArticle.title,
          url: selectedArticle.link
        });
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(selectedArticle.link);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleTranslate = () => {
    // Open via Google Translate - translate to Thai
    const translateUrl = `https://translate.google.com/translate?sl=auto&tl=th&u=${encodeURIComponent(selectedArticle.link)}`;
    window.open(translateUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenExternal = () => {
    // Open original URL directly
    window.open(selectedArticle.link, '_blank', 'noopener,noreferrer');
  };

  // Font size classes based on settings
  const fontSizeClasses = {
    small: 'text-sm leading-relaxed',
    medium: 'text-base leading-relaxed',
    large: 'text-lg leading-relaxed'
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-fallback border-b border-border-light dark:border-border-dark">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 text-primary-light dark:text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </button>

          <div className="flex items-center gap-1">
            {/* Font Size Button */}
            <div className="relative">
              <button
                onClick={() => setShowFontMenu(!showFontMenu)}
                className="p-2 text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Change font size"
              >
                <Type size={20} />
              </button>

              {/* Font Size Dropdown */}
              {showFontMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowFontMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 z-50 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg overflow-hidden min-w-[120px]">
                    {fontSizeOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleFontSizeChange(option.id)}
                        className={`
                          w-full px-4 py-2 text-left text-sm transition-colors
                          ${
                            settings.fontSize === option.id
                              ? 'bg-accent-light/10 dark:bg-accent-dark/10 text-accent-light dark:text-accent-dark font-medium'
                              : 'text-primary-light dark:text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800'
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked
                  ? 'text-accent-light dark:text-accent-dark'
                  : 'text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark'
              } hover:bg-gray-100 dark:hover:bg-gray-800`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Share article"
            >
              <Share2 size={20} />
            </button>
            <button
              onClick={handleTranslate}
              className="p-2 text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Translate to Thai"
              title="แปลเป็นภาษาไทย"
            >
              <Globe size={20} />
            </button>
            <button
              onClick={handleOpenExternal}
              className="p-2 text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Open in browser"
              title="เปิดในเบราว์เซอร์"
            >
              <ExternalLink size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="px-4 py-6 max-w-prose mx-auto">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl" role="img" aria-hidden="true">
            {selectedArticle.source.icon}
          </span>
          <span className="text-sm font-medium text-secondary-light dark:text-secondary-dark">
            {selectedArticle.source.name}
          </span>
          <span className="text-secondary-light dark:text-secondary-dark">·</span>
          <span className="text-sm text-secondary-light dark:text-secondary-dark">
            {formatDate(selectedArticle.pubDate)}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-2xl md:text-3xl font-normal leading-tight text-primary-light dark:text-primary-dark mb-4">
          {selectedArticle.title}
        </h1>

        {/* Author */}
        {selectedArticle.author && (
          <p className="text-sm text-secondary-light dark:text-secondary-dark mb-6">
            By {selectedArticle.author}
          </p>
        )}

        {/* Content */}
        <div
          className={`
            prose dark:prose-invert max-w-none
            ${fontSizeClasses[settings.fontSize]}
            text-primary-light dark:text-primary-dark
          `}
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(selectedArticle.content || selectedArticle.excerpt)
          }}
        />

        {/* Read more link */}
        <div className="mt-8 pt-6 border-t border-border-light dark:border-border-dark">
          <a
            href={selectedArticle.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent-light dark:text-accent-dark hover:underline font-medium"
          >
            Read full article on {selectedArticle.source.name}
            <ExternalLink size={16} />
          </a>
        </div>
      </article>
    </div>
  );
}
