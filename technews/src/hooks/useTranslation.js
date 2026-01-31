import { useCallback } from 'react';
import { useStore } from '../stores/useStore';
import { th, en } from '../locales';

const translations = { th, en };

export function useTranslation() {
  const language = useStore((state) => state.settings.language || 'th');
  const updateSettings = useStore((state) => state.updateSettings);

  // Get translation by key path (e.g., 'nav.home', 'articles.readTime')
  const t = useCallback(
    (key, fallback = '') => {
      const keys = key.split('.');
      let value = translations[language];

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Fallback to English if key not found in current language
          value = translations.en;
          for (const k2 of keys) {
            if (value && typeof value === 'object' && k2 in value) {
              value = value[k2];
            } else {
              return fallback || key;
            }
          }
          break;
        }
      }

      return typeof value === 'string' ? value : fallback || key;
    },
    [language]
  );

  // Change language
  const setLanguage = useCallback(
    (lang) => {
      updateSettings({ language: lang });
    },
    [updateSettings]
  );

  return {
    t,
    language,
    setLanguage,
    isThaiLanguage: language === 'th'
  };
}
