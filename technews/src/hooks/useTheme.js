import { useEffect } from 'react';
import { useStore } from '../stores/useStore';

export function useTheme() {
  const { settings, updateSettings } = useStore();

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (theme) => {
      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', isDark);
      } else {
        root.classList.toggle('dark', theme === 'dark');
      }
    };

    // Apply initial theme
    applyTheme(settings.theme);

    // Listen for system theme changes if using system theme
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e) => {
        root.classList.toggle('dark', e.matches);
      };

      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [settings.theme]);

  const setTheme = (theme) => {
    updateSettings({ theme });
  };

  const isDark = () => {
    if (settings.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return settings.theme === 'dark';
  };

  return {
    theme: settings.theme,
    setTheme,
    isDark: isDark()
  };
}
