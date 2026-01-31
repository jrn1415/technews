import { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      type = 'text',
      placeholder = '',
      value,
      onChange,
      disabled = false,
      error = '',
      icon: Icon,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-light dark:text-secondary-dark">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
            bg-surface-light dark:bg-surface-dark
            border border-border-light dark:border-border-dark
            ${error ? 'border-red-500' : ''}
            rounded-lg
            text-primary-light dark:text-primary-dark
            placeholder:text-secondary-light dark:placeholder:text-secondary-dark
            focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
