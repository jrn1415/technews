import { forwardRef } from 'react';

export const Card = forwardRef(
  ({ children, className = '', onClick, hoverable = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`
          bg-surface-light dark:bg-surface-dark
          border border-border-light dark:border-border-dark
          rounded-xl
          ${hoverable ? 'card-hover cursor-pointer' : ''}
          ${onClick ? 'cursor-pointer' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
