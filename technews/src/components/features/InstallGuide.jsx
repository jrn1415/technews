import { useState, useEffect } from 'react';
import { X, Share, MoreVertical, Plus, Download, CheckCircle, Smartphone } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export function InstallGuide({ isOpen, onClose }) {
  const [platform, setPlatform] = useState('ios');
  const [isStandalone, setIsStandalone] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    if (/android/.test(userAgent)) {
      setPlatform('android');
    } else if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else {
      // Desktop - default to showing both
      setPlatform('ios');
    }

    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone
      || document.referrer.includes('android-app://');
    setIsStandalone(standalone);
  }, []);

  if (!isOpen) return null;

  const iosSteps = [
    {
      icon: Share,
      title: t('install.ios.step1Title'),
      description: t('install.ios.step1Desc'),
    },
    {
      icon: Plus,
      title: t('install.ios.step2Title'),
      description: t('install.ios.step2Desc'),
    },
    {
      icon: CheckCircle,
      title: t('install.ios.step3Title'),
      description: t('install.ios.step3Desc'),
    },
  ];

  const androidSteps = [
    {
      icon: MoreVertical,
      title: t('install.android.step1Title'),
      description: t('install.android.step1Desc'),
    },
    {
      icon: Download,
      title: t('install.android.step2Title'),
      description: t('install.android.step2Desc'),
    },
    {
      icon: CheckCircle,
      title: t('install.android.step3Title'),
      description: t('install.android.step3Desc'),
    },
  ];

  const steps = platform === 'ios' ? iosSteps : androidSteps;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl max-h-[85vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-light/10 dark:bg-accent-dark/10 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-accent-light dark:text-accent-dark" />
            </div>
            <div>
              <h2 className="font-semibold text-primary-light dark:text-primary-dark">
                {t('install.guideTitle')}
              </h2>
              <p className="text-xs text-secondary-light dark:text-secondary-dark">
                {t('install.guideSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Already Installed Notice */}
        {isStandalone && (
          <div className="mx-4 mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle size={18} />
              <span className="text-sm font-medium">{t('install.alreadyInstalled')}</span>
            </div>
          </div>
        )}

        {/* Platform Tabs */}
        <div className="flex p-4 gap-2">
          <button
            onClick={() => setPlatform('ios')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              platform === 'ios'
                ? 'bg-accent-light dark:bg-accent-dark text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-secondary-light dark:text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            🍎 iPhone / iPad
          </button>
          <button
            onClick={() => setPlatform('android')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              platform === 'android'
                ? 'bg-accent-light dark:bg-accent-dark text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-secondary-light dark:text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            🤖 Android
          </button>
        </div>

        {/* Steps */}
        <div className="px-4 pb-6 space-y-4 overflow-y-auto max-h-[50vh]">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-accent-light/10 dark:bg-accent-dark/10 rounded-full flex items-center justify-center">
                    <span className="text-accent-light dark:text-accent-dark font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={16} className="text-accent-light dark:text-accent-dark" />
                    <h3 className="font-medium text-primary-light dark:text-primary-dark text-sm">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-secondary-light dark:text-secondary-dark leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Browser Note */}
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              💡 {platform === 'ios' ? t('install.ios.note') : t('install.android.note')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-light dark:border-border-dark">
          <button
            onClick={onClose}
            className="w-full py-3 bg-accent-light dark:bg-accent-dark text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
          >
            {t('install.gotIt')}
          </button>
        </div>
      </div>
    </div>
  );
}
