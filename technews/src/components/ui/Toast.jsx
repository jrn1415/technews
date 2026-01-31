import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info
};

const styles = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-accent-light dark:bg-accent-dark'
};

export function Toast({ message, type = 'info', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = icons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`
        fixed bottom-24 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg
        text-white text-sm font-medium
        transition-all duration-300
        ${styles[type]}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
      role="alert"
    >
      <Icon size={18} />
      <span>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
        aria-label="Close"
      >
        <X size={14} />
      </button>
    </div>
  );
}
