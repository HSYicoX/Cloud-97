// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export function InputFeedback({
  status = 'default',
  message,
  isLoading = false,
  className = ''
}) {
  const statusConfig = {
    default: {
      icon: null,
      color: 'text-gray-400',
      border: 'border-gray-300'
    },
    loading: {
      icon: Loader2,
      color: 'text-blue-400',
      border: 'border-blue-400'
    },
    success: {
      icon: CheckCircle,
      color: 'text-green-400',
      border: 'border-green-400'
    },
    error: {
      icon: XCircle,
      color: 'text-red-400',
      border: 'border-red-400'
    },
    warning: {
      icon: AlertCircle,
      color: 'text-yellow-400',
      border: 'border-yellow-400'
    }
  };
  const config = statusConfig[status];
  const Icon = config.icon;
  return <div className={`flex items-center space-x-2 mt-1 ${config.color} ${className}`}>
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {Icon && !isLoading && <Icon className="h-4 w-4" />}
      {message && <span className="text-sm">{message}</span>}
    </div>;
}