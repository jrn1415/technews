import { useState } from 'react';
import { useStore } from './stores/useStore';
import { useTheme } from './hooks/useTheme';
import { useServiceWorker } from './hooks/useServiceWorker';
import { Header, BottomNav, OfflineBanner, UpdatePrompt } from './components/layout';
import {
  ArticleList,
  ArticleStats,
  BookmarksList,
  ReaderView,
  SourceList,
  SettingsPanel,
  InstallBanner,
  InstallGuide
} from './components/features';

function App() {
  const activeTab = useStore((state) => state.activeTab);
  const selectedArticle = useStore((state) => state.selectedArticle);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  // Initialize theme
  useTheme();

  // Service Worker update management
  const { showUpdatePrompt, isUpdating, doUpdate, dismissUpdate } = useServiceWorker();

  // Render based on current state
  if (selectedArticle) {
    return (
      <>
        <OfflineBanner />
        <ReaderView />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans">
      <OfflineBanner />
      <div className="max-w-[430px] mx-auto min-h-screen flex flex-col lg:shadow-xl">
        <Header />

        <main className="flex-1 overflow-y-auto pb-20">
          {activeTab === 'home' && <ArticleList />}
          {activeTab === 'bookmarks' && <BookmarksList />}
          {activeTab === 'stats' && <ArticleStats />}
          {activeTab === 'sources' && <SourceList />}
          {activeTab === 'settings' && <SettingsPanel />}
        </main>

        <BottomNav />
      </div>

      {/* Install Banner (shows once for new users) */}
      <InstallBanner onShowGuide={() => setShowInstallGuide(true)} />

      {/* Install Guide Modal */}
      <InstallGuide isOpen={showInstallGuide} onClose={() => setShowInstallGuide(false)} />

      {/* Update Prompt */}
      <UpdatePrompt
        show={showUpdatePrompt}
        isUpdating={isUpdating}
        onUpdate={doUpdate}
        onDismiss={dismissUpdate}
      />
    </div>
  );
}

export default App;
