import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui';

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
        <AlertTriangle size={32} className="text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-2">
        Something went wrong
      </h3>
      <p className="text-sm text-secondary-light dark:text-secondary-dark max-w-[280px] mb-4">
        {message || 'Failed to load articles. Please try again.'}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" size="sm">
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}
