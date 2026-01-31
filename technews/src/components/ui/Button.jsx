import { forwardRef } from 'react';

const variants = {
  primary:
    'bg-accent-light dark:bg-accent-dark text-white hover:opacity-90',
  secondary:
    'bg-surface-light dark:bg-surface-dark text-primary-light dark:text-primary-dark border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800',
  ghost:
    'text-primary-light dark:text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800',
  danger:
    'bg-red-500 text-white hover:bg-red-600'
};

const sizes = {
  sm: 'px-3 py-2 text-sm min-h-[36px]',
  md: 'px-4 py-2.5 text-base min-h-[44px]',
  lg: 'px-6 py-3 text-lg min-h-[48px]'
};

export const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          font-medium rounded-lg
          transition-all duration-200
          btn-press
          focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark focus-visible:ring-offset-2
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
