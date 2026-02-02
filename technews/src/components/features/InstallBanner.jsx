import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { STORAGE_KEYS } from '../../utils/constants';

export function InstallBanner({ onShowGuide }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Check if already installed as PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone
      || document.referrer.includes('android-app://');

    setIsStandalone(standalone);

    // Check if banner was dismissed before
    const dismissed = localStorage.getItem(STORAGE_KEYS.INSTALL_BANNER_DISMISSED);

    // Show banner if not installed and not dismissed
    if (!standalone && !dismissed) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEYS.INSTALL_BANNER_DISMISSED, 'true');
  };

  const handleShowGuide = () => {
    onShowGuide?.();
    handleDismiss();
  };

  if (!isVisible || isStandalone) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 px-4 animate-slide-up">
      <div className="max-w-[430px] mx-auto">
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-accent-light/10 dark:bg-accent-dark/10 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-accent-light dark:text-accent-dark" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-primary-light dark:text-primary-dark text-sm">
                {t('install.title')}
              </h3>
              <p className="text-xs text-secondary-light dark:text-secondary-dark mt-0.5">
                {t('install.description')}
              </p>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleShowGuide}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-light dark:bg-accent-dark text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Download size={14} />
                  {t('install.howTo')}
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-3 py-1.5 text-secondary-light dark:text-secondary-dark text-xs font-medium hover:text-primary-light dark:hover:text-primary-dark transition-colors"
                >
                  {t('install.later')}
                </button>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
