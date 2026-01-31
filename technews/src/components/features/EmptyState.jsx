import { Inbox } from 'lucide-react';

export function EmptyState({ title, description, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Icon size={32} className="text-secondary-light dark:text-secondary-dark" />
      </div>
      <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark mb-2">
        {title}
      </h3>
      <p className="text-sm text-secondary-light dark:text-secondary-dark max-w-[280px]">
        {description}
      </p>
    </div>
  );
}
