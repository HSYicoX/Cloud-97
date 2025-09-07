// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export function FormStatus({
  status = 'default',
  message,
  title,
  className = ''
}) {
  const statusConfig = {
    default: {
      icon: Info,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    loading: {
      icon: AlertCircle,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    success: {
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    error: {
      icon: XCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20'
    },
    warning: {
      icon: AlertCircle,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20'
    }
  };
  const config = statusConfig[status];
  const Icon = config.icon;
  if (!message && !title) return null;
  return <div className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor} ${className}`}>
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 mt-0.5 ${config.color}`} />
        <div className="flex-1">
          {title && <h4 className={`font-medium ${config.color}`}>{title}</h4>}
          {message && <p className="text-sm text-slate-300 mt-1">{message}</p>}
        </div>
      </div>
    </div>;
}