export function Toggle({ enabled, onChange, label, description }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className="flex items-center justify-between w-full py-2 group"
    >
      <div className="flex-1 text-left">
        <span className="text-primary-light dark:text-primary-dark font-medium">
          {label}
        </span>
        {description && (
          <p className="text-sm text-secondary-light dark:text-secondary-dark mt-0.5">
            {description}
          </p>
        )}
      </div>
      <div
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors duration-200
          ${enabled ? 'bg-accent-light dark:bg-accent-dark' : 'bg-gray-300 dark:bg-gray-600'}
        `}
      >
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full bg-white shadow-sm
            transition-transform duration-200
            ${enabled ? 'translate-x-[22px]' : 'translate-x-[2px]'}
          `}
        />
      </div>
    </button>
  );
}
