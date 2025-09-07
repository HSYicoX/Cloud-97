// @ts-ignore;
import React from 'react';

export function LoadingSpinner({
  size = 'md',
  className = '',
  text = ''
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };
  return <div className={`flex items-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${sizeClasses[size]}`} />
      {text && <span className="ml-2 text-sm text-slate-400">{text}</span>}
    </div>;
}