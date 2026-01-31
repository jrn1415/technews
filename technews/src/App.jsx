import { useStore } from './stores/useStore';
import { useTheme } from './hooks/useTheme';
import { Header, BottomNav, OfflineBanner } from './components/layout';
import {
  ArticleList,
  ArticleStats,
  BookmarksList,
  ReaderView,
  SourceList,
  SettingsPanel
} from './components/features';

function App() {
  const activeTab = useStore((state) => state.activeTab);
  const selectedArticle = useStore((state) => state.selectedArticle);

  // Initialize theme
  useTheme();

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
    </div>
  );
}

export default App;
