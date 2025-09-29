/**
 * Iraqi AI Loading Spinner Component
 * Arabic/English loading states with cultural sensitivity
 */

import React from 'react';
import { RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message,
  className = '',
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8',
  };

  const containerSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${containerSizeClasses[size]} ${className}`}
    >
      <RefreshCw className={`${sizeClasses[size]} animate-spin text-blue-600 mb-2`} />
      {message && <span className="text-gray-600 font-medium">{message}</span>}
    </div>
  );
};

export default LoadingSpinner;
