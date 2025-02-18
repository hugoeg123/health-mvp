import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export function LoadingSpinner({ size = 'medium', message = 'Loading...' }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className="animate-spin rounded-full border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400"
        role="status"
        aria-label="loading"
        data-testid="loading-spinner"
        className={sizeClasses[size]}
      />
      {message && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{message}</p>}
    </div>
  );
}
