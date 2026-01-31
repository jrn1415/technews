import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white">
      <div className="max-w-[430px] mx-auto px-4 py-2 flex items-center justify-center gap-2">
        <WifiOff size={16} />
        <span className="text-sm font-medium">You're offline. Some features may be limited.</span>
      </div>
    </div>
  );
}
