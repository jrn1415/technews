import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true
}) {
  const modalRef = useRef(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="
          relative z-10
          w-full sm:max-w-md
          max-h-[90vh]
          bg-surface-light dark:bg-surface-dark
          rounded-t-2xl sm:rounded-2xl
          shadow-xl
          animate-slide-up
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-primary-light dark:text-primary-dark"
          >
            {title}
          </h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="
                p-2 -mr-2
                text-secondary-light dark:text-secondary-dark
                hover:text-primary-light dark:hover:text-primary-dark
                hover:bg-gray-100 dark:hover:bg-gray-800
                rounded-lg
                transition-colors
              "
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
