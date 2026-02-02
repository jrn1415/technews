import { RefreshCw, X, Sparkles } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export function UpdatePrompt({ show, isUpdating, onUpdate, onDismiss }) {
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onDismiss}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl overflow-hidden animate-slide-up">
        {/* Gradient header */}
        <div className="bg-gradient-to-r from-accent-light to-blue-600 dark:from-accent-dark dark:to-blue-400 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {t('update.title')}
              </h2>
              <p className="text-sm text-white/80">
                {t('update.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-secondary-light dark:text-secondary-dark text-sm mb-6">
            {t('update.description')}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onDismiss}
              disabled={isUpdating}
              className="flex-1 py-3 px-4 border border-border-light dark:border-border-dark text-primary-light dark:text-primary-dark font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {t('update.later')}
            </button>
            <button
              onClick={onUpdate}
              disabled={isUpdating}
              className="flex-1 py-3 px-4 bg-accent-light dark:bg-accent-dark text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {t('update.updating')}
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  {t('update.now')}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onDismiss}
          disabled={isUpdating}
          className="absolute top-4 right-4 p-1 text-white/70 hover:text-white transition-colors disabled:opacity-50"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
