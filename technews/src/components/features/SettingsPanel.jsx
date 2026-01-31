import { Moon, Sun, Monitor, Type, Bell, RefreshCw, Globe } from 'lucide-react';
import { useStore } from '../../stores/useStore';
import { useNotifications } from '../../hooks/useNotifications';
import { useTranslation } from '../../hooks/useTranslation';
import { LANGUAGES } from '../../utils/constants';
import { Card, Toggle } from '../ui';

export function SettingsPanel() {
  const { settings, updateSettings } = useStore();
  const { isSupported, toggleNotifications } = useNotifications();
  const { t, language, setLanguage } = useTranslation();

  const themeOptions = [
    { id: 'light', labelKey: 'settings.themeLight', icon: Sun },
    { id: 'dark', labelKey: 'settings.themeDark', icon: Moon },
    { id: 'system', labelKey: 'settings.themeSystem', icon: Monitor }
  ];

  const fontSizeOptions = [
    { id: 'small', labelKey: 'reader.small' },
    { id: 'medium', labelKey: 'reader.medium' },
    { id: 'large', labelKey: 'reader.large' }
  ];

  const refreshIntervals = [
    { value: 15, labelKey: 'settings.every15min' },
    { value: 30, labelKey: 'settings.every30min' },
    { value: 60, labelKey: 'settings.everyHour' }
  ];

  return (
    <div className="px-4 py-4 space-y-6">
      {/* Language */}
      <section>
        <h2 className="text-sm font-semibold text-secondary-light dark:text-secondary-dark uppercase tracking-wider mb-3">
          {t('settings.language')}
        </h2>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Globe size={20} className="text-secondary-light dark:text-secondary-dark mt-0.5" />
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((lang) => {
                  const isActive = language === lang.id;

                  return (
                    <button
                      key={lang.id}
                      onClick={() => setLanguage(lang.id)}
                      className={`
                        flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border-2 transition-all text-sm font-medium
                        ${
                          isActive
                            ? 'border-accent-light dark:border-accent-dark bg-accent-light/10 dark:bg-accent-dark/10 text-accent-light dark:text-accent-dark'
                            : 'border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark hover:border-gray-300 dark:hover:border-gray-600'
                        }
                      `}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Appearance */}
      <section>
        <h2 className="text-sm font-semibold text-secondary-light dark:text-secondary-dark uppercase tracking-wider mb-3">
          {t('settings.appearance')}
        </h2>
        <Card className="p-4">
          {/* Theme */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-primary-light dark:text-primary-dark mb-2">
              {t('settings.theme')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isActive = settings.theme === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() => updateSettings({ theme: option.id })}
                    className={`
                      flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all
                      ${
                        isActive
                          ? 'border-accent-light dark:border-accent-dark bg-accent-light/10 dark:bg-accent-dark/10'
                          : 'border-border-light dark:border-border-dark hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                  >
                    <Icon
                      size={20}
                      className={
                        isActive
                          ? 'text-accent-light dark:text-accent-dark'
                          : 'text-secondary-light dark:text-secondary-dark'
                      }
                    />
                    <span
                      className={`text-xs font-medium ${
                        isActive
                          ? 'text-accent-light dark:text-accent-dark'
                          : 'text-secondary-light dark:text-secondary-dark'
                      }`}
                    >
                      {t(option.labelKey)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-primary-light dark:text-primary-dark mb-2">
              <Type size={16} />
              {t('settings.fontSize')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {fontSizeOptions.map((option) => {
                const isActive = settings.fontSize === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() => updateSettings({ fontSize: option.id })}
                    className={`
                      py-2 px-3 rounded-lg border-2 transition-all text-sm font-medium
                      ${
                        isActive
                          ? 'border-accent-light dark:border-accent-dark bg-accent-light/10 dark:bg-accent-dark/10 text-accent-light dark:text-accent-dark'
                          : 'border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                  >
                    {t(option.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      </section>

      {/* Notifications */}
      <section>
        <h2 className="text-sm font-semibold text-secondary-light dark:text-secondary-dark uppercase tracking-wider mb-3">
          {t('settings.notifications')}
        </h2>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Bell size={20} className="text-secondary-light dark:text-secondary-dark mt-0.5" />
            <div className="flex-1">
              <Toggle
                enabled={settings.notifications}
                onChange={toggleNotifications}
                label={t('settings.pushNotifications')}
                description={
                  isSupported
                    ? t('settings.pushDesc')
                    : t('settings.pushUnsupported')
                }
              />
            </div>
          </div>
        </Card>
      </section>

      {/* Refresh Interval */}
      <section>
        <h2 className="text-sm font-semibold text-secondary-light dark:text-secondary-dark uppercase tracking-wider mb-3">
          {t('settings.autoRefresh')}
        </h2>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <RefreshCw size={20} className="text-secondary-light dark:text-secondary-dark mt-0.5" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-primary-light dark:text-primary-dark mb-2">
                {t('settings.refreshInterval')}
              </label>
              <select
                value={settings.refreshInterval}
                onChange={(e) =>
                  updateSettings({ refreshInterval: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-primary-light dark:text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
              >
                {refreshIntervals.map((interval) => (
                  <option key={interval.value} value={interval.value}>
                    {t(interval.labelKey)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      </section>

      {/* About */}
      <section>
        <h2 className="text-sm font-semibold text-secondary-light dark:text-secondary-dark uppercase tracking-wider mb-3">
          {t('settings.about')}
        </h2>
        <Card className="p-4">
          <div className="text-center">
            <h3 className="font-serif text-xl text-primary-light dark:text-primary-dark">
              {t('appName')}
            </h3>
            <p className="text-sm text-secondary-light dark:text-secondary-dark mt-1">
              {t('settings.version')} 1.0.0
            </p>
            <p className="text-xs text-secondary-light dark:text-secondary-dark mt-2">
              {t('appTagline')}
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
